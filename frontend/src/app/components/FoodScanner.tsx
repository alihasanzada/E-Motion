"use client";

import React, { useState } from 'react';
import { Sparkles, Upload, RefreshCw, Utensils } from 'lucide-react';

interface FoodScannerProps {
    isDarkMode?: boolean;
}

interface NutritionResult {
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    recommendation: string;
}

export default function FoodScanner({ isDarkMode = true }: FoodScannerProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<NutritionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const theme = {
        cardBg: isDarkMode ? '#18181b' : '#ffffff',
        border: isDarkMode ? '1px solid #27272a' : '1px solid #e4e4e7',
        dashedBorder: isDarkMode ? '#3f3f46' : '#d4d4d8',
        textPrimary: isDarkMode ? '#f4f4f5' : '#18181b',
        textSecondary: isDarkMode ? '#a1a1aa' : '#71717a',
        innerBg: isDarkMode ? '#09090b' : '#f4f4f5',
        accent: '#10b981',
        accentLight: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            setResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/food-scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: selectedImage }),
            });

            if (!res.ok) throw new Error('Analiz zamanı xəta baş verdi');
            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Xəta baş verdi. Yenidən cəhd edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundColor: theme.cardBg,
                border: theme.border,
                borderRadius: '16px',
                padding: '20px',
                marginTop: '24px',
                color: theme.textPrimary,
                transition: 'all 0.2s ease',
            }}
        >
            {/* Başlıq */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div
                    style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        backgroundColor: theme.accentLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.accent,
                    }}
                >
                    <Sparkles size={18} />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>
                        AI Foto-Kalori Skaneri
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: theme.textSecondary }}>
                        Yeməyin şəklini yükləyin, AI tərkibini və kalorisini analiz etsin.
                    </p>
                </div>
            </div>

            {/* Kompakt Struktur */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: selectedImage ? '180px 1fr' : '1fr',
                    gap: '16px',
                    alignItems: 'center',
                }}
            >
                {/* Şəkil Yükləmə / Önizləmə Sahəsi */}
                <div>
                    {!selectedImage ? (
                        <label
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '18px 12px',
                                border: `2px dashed ${theme.dashedBorder}`,
                                borderRadius: '12px',
                                backgroundColor: theme.innerBg,
                                cursor: 'pointer',
                                textAlign: 'center',
                            }}
                        >
                            <Upload size={20} color={theme.textSecondary} />
                            <span style={{ fontSize: '12px', fontWeight: '600', color: theme.textPrimary }}>
                                Şəkil yükləyin
                            </span>
                            <span style={{ fontSize: '10px', color: theme.textSecondary }}>PNG, JPG, WEBP</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>
                    ) : (
                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: theme.border }}>
                            <img
                                src={selectedImage}
                                alt="Yemək"
                                style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                            />
                            <label
                                style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '6px',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    color: '#fff',
                                    padding: '5px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                }}
                                title="Dəyişdir"
                            >
                                <RefreshCw size={12} />
                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            </label>
                        </div>
                    )}

                    {selectedImage && !result && (
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            style={{
                                width: '100%',
                                marginTop: '10px',
                                padding: '8px 12px',
                                backgroundColor: theme.accent,
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? 'Analiz edilir...' : 'Kalorini Analiz Et'}
                        </button>
                    )}
                </div>

                {/* Nəticələr Hissəsi */}
                {result && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.accent, fontWeight: '700' }}>
                                    Aşkar Edilən Yemək
                                </span>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>
                                    {result.foodName}
                                </h4>
                            </div>
                            <div
                                style={{
                                    backgroundColor: theme.accentLight,
                                    padding: '4px 10px',
                                    borderRadius: '16px',
                                    color: theme.accent,
                                    fontWeight: '800',
                                    fontSize: '14px',
                                }}
                            >
                                {result.calories} <span style={{ fontSize: '10px', fontWeight: '500' }}>kcal</span>
                            </div>
                        </div>

                        {/* Makrolar */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            <div style={{ backgroundColor: theme.innerBg, padding: '8px', borderRadius: '8px', textAlign: 'center', border: theme.border }}>
                                <div style={{ fontSize: '10px', color: theme.textSecondary }}>Zülal</div>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: theme.textPrimary }}>{result.protein}g</div>
                            </div>
                            <div style={{ backgroundColor: theme.innerBg, padding: '8px', borderRadius: '8px', textAlign: 'center', border: theme.border }}>
                                <div style={{ fontSize: '10px', color: theme.textSecondary }}>Karbohidrat</div>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: theme.textPrimary }}>{result.carbs}g</div>
                            </div>
                            <div style={{ backgroundColor: theme.innerBg, padding: '8px', borderRadius: '8px', textAlign: 'center', border: theme.border }}>
                                <div style={{ fontSize: '10px', color: theme.textSecondary }}>Yağ</div>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: theme.textPrimary }}>{result.fat}g</div>
                            </div>
                        </div>

                        {/* Tövsiyə */}
                        {result.recommendation && (
                            <p style={{ margin: 0, fontSize: '11px', color: theme.textSecondary, backgroundColor: theme.innerBg, padding: '8px 10px', borderRadius: '8px', border: theme.border }}>
                                💡 <strong>Tövsiyə:</strong> {result.recommendation}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}