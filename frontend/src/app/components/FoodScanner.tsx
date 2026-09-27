"use client";

import React, { useState } from 'react';
import { Sparkles, Upload, RefreshCw } from 'lucide-react';

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

            if (!res.ok) throw new Error('Analiz xətası');
            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Xəta baş verdi.');
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
                padding: '16px',
                color: theme.textPrimary,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                boxSizing: 'border-box',
            }}
        >
            {/* Başlıq */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div
                    style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        backgroundColor: theme.accentLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.accent,
                        flexShrink: 0,
                    }}
                >
                    <Sparkles size={16} />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>
                        AI Foto-Skaner
                    </h3>
                    <p style={{ margin: 0, fontSize: '11px', color: theme.textSecondary }}>
                        Şəkli yükləyin, AI analizi etsin
                    </p>
                </div>
            </div>

            {/* Şəkil Yükləmə Sahəsi */}
            {!selectedImage ? (
                <label
                    style={{
                        flex: 1,
                        minHeight: '110px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '12px',
                        border: `2px dashed ${theme.dashedBorder}`,
                        borderRadius: '12px',
                        backgroundColor: theme.innerBg,
                        cursor: 'pointer',
                        textAlign: 'center',
                    }}
                >
                    <Upload size={18} color={theme.textSecondary} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: theme.textPrimary }}>
                        Şəkil seçin
                    </span>
                    <span style={{ fontSize: '10px', color: theme.textSecondary }}>PNG, JPG, WEBP</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: theme.border }}>
                        <img
                            src={selectedImage}
                            alt="Yemək"
                            style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
                        />
                        <label
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                padding: '4px',
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

                    {!result && (
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '7px 10px',
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
            )}

            {error && (
                <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>{error}</div>
            )}

            {/* Nəticə */}
            {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: theme.textPrimary }}>
                            {result.foodName}
                        </span>
                        <div
                            style={{
                                backgroundColor: theme.accentLight,
                                padding: '2px 7px',
                                borderRadius: '10px',
                                color: theme.accent,
                                fontWeight: '800',
                                fontSize: '12px',
                            }}
                        >
                            {result.calories} <span style={{ fontSize: '9px', fontWeight: '500' }}>kcal</span>
                        </div>
                    </div>

                    {/* Makrolar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                        <div style={{ backgroundColor: theme.innerBg, padding: '5px', borderRadius: '6px', textAlign: 'center', border: theme.border }}>
                            <div style={{ fontSize: '8.5px', color: theme.textSecondary }}>Zülal</div>
                            <div style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textPrimary }}>{result.protein}g</div>
                        </div>
                        <div style={{ backgroundColor: theme.innerBg, padding: '5px', borderRadius: '6px', textAlign: 'center', border: theme.border }}>
                            <div style={{ fontSize: '8.5px', color: theme.textSecondary }}>Karb</div>
                            <div style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textPrimary }}>{result.carbs}g</div>
                        </div>
                        <div style={{ backgroundColor: theme.innerBg, padding: '5px', borderRadius: '6px', textAlign: 'center', border: theme.border }}>
                            <div style={{ fontSize: '8.5px', color: theme.textSecondary }}>Yağ</div>
                            <div style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textPrimary }}>{result.fat}g</div>
                        </div>
                    </div>

                    {result.recommendation && (
                        <p style={{ margin: 0, fontSize: '9.5px', color: theme.textSecondary, backgroundColor: theme.innerBg, padding: '5px 7px', borderRadius: '6px', border: theme.border }}>
                            💡 {result.recommendation}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}