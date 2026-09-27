'use client';

import React, { useState } from 'react';
import { Camera, Upload, Loader2, Sparkles, Utensils, Check } from 'lucide-react';

interface FoodResult {
    foodName: string;
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    advice: string;
}

export default function FoodScanner() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<FoodResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setResult(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeFood = async () => {
        if (!imagePreview) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/scan-food', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: imagePreview }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Xəta baş verdi');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Yeməyi analiz etmək mümkün olmadı. Yenidən cəhd edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#18181b] text-white p-6 rounded-2xl border border-zinc-800 shadow-xl max-w-xl w-full mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">AI Foto-Kalori Skaneri</h2>
                    <p className="text-sm text-zinc-400">Yeməyinizin fotosunu yükləyin, AI dərhal tərkibini analiz etsin.</p>
                </div>
            </div>

            {/* Şəkil Yükləmə Sahəsi */}
            <div className="relative border-2 border-dashed border-zinc-700 hover:border-emerald-500 transition-colors rounded-xl p-4 text-center cursor-pointer bg-zinc-900/50 mb-6">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {imagePreview ? (
                    <div className="relative w-full h-56 rounded-lg overflow-hidden flex items-center justify-center bg-black">
                        <img src={imagePreview} alt="Yemək" className="max-h-full object-contain" />
                    </div>
                ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-zinc-400 gap-2">
                        <Camera className="w-10 h-10 text-emerald-400 mb-1" />
                        <p className="font-medium text-sm">Şəkli buraya sürüşdürün və ya seçin</p>
                        <span className="text-xs text-zinc-500">PNG, JPG, WEBP (maks. 5MB)</span>
                    </div>
                )}
            </div>

            {/* Analiz Düyməsi */}
            {imagePreview && (
                <button
                    onClick={analyzeFood}
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 mb-6"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Yemək Analiz Edilir...</span>
                        </>
                    ) : (
                        <>
                            <Utensils className="w-5 h-5" />
                            <span>Kalorini Analiz Et</span>
                        </>
                    )}
                </button>
            )}

            {/* Xəta Mesajı */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm mb-6">
                    {error}
                </div>
            )}

            {/* Analiz Nəticələri */}
            {result && (
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
                    <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                        <div>
                            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Aşkar edilən yemək</span>
                            <h3 className="text-lg font-bold text-white capitalize">{result.foodName}</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-emerald-400">{result.calories}</span>
                            <span className="text-xs text-zinc-400 block">kkal</span>
                        </div>
                    </div>

                    {/* Makro Dəyərləri */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-zinc-800/60 p-3 rounded-lg border border-zinc-700/40">
                            <span className="text-xs text-zinc-400 block mb-1">Zülal</span>
                            <span className="font-bold text-white">{result.protein}</span>
                        </div>
                        <div className="bg-zinc-800/60 p-3 rounded-lg border border-zinc-700/40">
                            <span className="text-xs text-zinc-400 block mb-1">Karbohidrat</span>
                            <span className="font-bold text-white">{result.carbs}</span>
                        </div>
                        <div className="bg-zinc-800/60 p-3 rounded-lg border border-zinc-700/40">
                            <span className="text-xs text-zinc-400 block mb-1">Yağ</span>
                            <span className="font-bold text-white">{result.fat}</span>
                        </div>
                    </div>

                    {/* AI Tövsiyəsi */}
                    {result.advice && (
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-xs text-emerald-300/90">
                            💡 <span className="font-medium">Tövsiyə:</span> {result.advice}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}