'use client';
import { useState, useEffect } from 'react';

export type ExerciseType = 'breathing' | 'meditation' | 'affirmation' | null;

interface ExerciseModalProps {
    type: ExerciseType;
    onClose: () => void;
    isDarkMode?: boolean;
}

const affirmations = [
    "Mən özümə və zəkama tamamilə inanıram.",
    "Hər çətinlik məni daha da təcrübəli və güclü edir.",
    "Bu gün diqqətimi sakitliyə və uğura kökləyirəm.",
    "Zehnim aydın, bədənim tamamilə rahatdır.",
    "Məqsədlərimə doğru addım-addım əminliklə irəliləyirəm.",
    "Səhvlərim mənim öyrənmə prosesimin təbii hissəsidir.",
    "Öz templə irəliləyirəm və nəticələrimlə fəxr edirəm."
];

export default function ExerciseModal({ type, onClose, isDarkMode }: ExerciseModalProps) {
    const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
    const [breathTimer, setBreathTimer] = useState(4);
    const [meditationTime, setMeditationTime] = useState(300);
    const [isMeditating, setIsMeditating] = useState(false);
    const [affIndex, setAffIndex] = useState(0);

    useEffect(() => {
        if (type === 'breathing') {
            setBreathPhase('Inhale');
            setBreathTimer(4);
        } else if (type === 'meditation') {
            setMeditationTime(300);
            setIsMeditating(false);
        } else if (type === 'affirmation') {
            setAffIndex(0);
        }
    }, [type]);

    useEffect(() => {
        if (type !== 'breathing') return;
        const interval = setInterval(() => {
            setBreathTimer((prev) => {
                if (prev > 1) return prev - 1;
                if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 7; }
                else if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 8; }
                else { setBreathPhase('Inhale'); return 4; }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [type, breathPhase]);

    useEffect(() => {
        if (type !== 'meditation' || !isMeditating) return;
        const interval = setInterval(() => {
            setMeditationTime((prev) => {
                if (prev <= 1) { setIsMeditating(false); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [type, isMeditating]);

    if (!type) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && onClose()}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                backdropFilter: 'blur(4px)'
            }}
        >
            <div
                style={{
                    backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
                    padding: '32px 28px', borderRadius: '20px',
                    maxWidth: '460px', width: '90%',
                    color: isDarkMode ? '#fff' : '#000',
                    textAlign: 'center', position: 'relative', border: '1px solid #333',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'none', border: 'none',
                        color: isDarkMode ? '#aaa' : '#555', fontSize: '22px', cursor: 'pointer', lineHeight: 1
                    }}
                >
                    ✕
                </button>

                {type === 'breathing' && (
                    <div>
                        <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>🫁 4-7-8 Nəfəs Məşqi</h3>
                        <p style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#555', marginBottom: '24px' }}>
                            Sinir sistemini sakitləşdirmək üçün ekrandakı ritmə uyğun nəfəs al və ver.
                        </p>
                        <div
                            style={{
                                width: '160px', height: '160px', borderRadius: '50%',
                                backgroundColor: breathPhase === 'Inhale' ? '#10b981' : breathPhase === 'Hold' ? '#f59e0b' : '#3b82f6',
                                margin: '0 auto 24px', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', transition: 'all 0.8s ease-in-out',
                                transform: breathPhase === 'Inhale' ? 'scale(1.18)' : breathPhase === 'Hold' ? 'scale(1.10)' : 'scale(0.90)',
                                boxShadow: breathPhase === 'Inhale' ? '0 0 25px rgba(16, 185, 129, 0.4)' : breathPhase === 'Hold' ? '0 0 25px rgba(245, 158, 11, 0.4)' : '0 0 25px rgba(59, 130, 246, 0.4)'
                            }}
                        >
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                {breathPhase === 'Inhale' ? 'Nəfəs Al' : breathPhase === 'Hold' ? 'Saxla' : 'Nəfəs Ver'}
                            </span>
                            <span style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>{breathTimer}s</span>
                        </div>
                        <button onClick={onClose} style={{ padding: '10px 24px', backgroundColor: '#2a2a2d', border: '1px solid #444', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                            Məşqi Bitir
                        </button>
                    </div>
                )}

                {type === 'meditation' && (
                    <div>
                        <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>🧘 Fokus Meditasiyası</h3>
                        <p style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#555', margin: '12px 0 20px' }}>
                            Gözlərini yum, çiyinlərini sərbəst burax və diqqətini yalnız nəfəsində saxla.
                        </p>
                        <div style={{ padding: '24px', background: isDarkMode ? '#2a2a2d' : '#f0f0f0', borderRadius: '14px', margin: '0 0 24px' }}>
                            <div style={{ fontSize: '42px', fontWeight: 'bold', fontFamily: 'monospace', color: '#10b981', marginBottom: '8px' }}>
                                {formatTime(meditationTime)}
                            </div>
                            <p style={{ color: isDarkMode ? '#ccc' : '#777', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>
                                {isMeditating ? 'Sakitləş və yalnız anı hiss et...' : 'Başlamaq üçün düyməyə sıx'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setIsMeditating(!isMeditating)} style={{ padding: '12px 24px', backgroundColor: isMeditating ? '#ef4444' : '#10b981', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                                {isMeditating ? 'Pauza Et' : 'Başla (5 dəq)'}
                            </button>
                            <button onClick={onClose} style={{ padding: '12px 20px', backgroundColor: '#2a2a2d', border: '1px solid #444', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                                Tamamla
                            </button>
                        </div>
                    </div>
                )}

                {type === 'affirmation' && (
                    <div>
                        <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>✨ Pozitiv Affirmasiya</h3>
                        <p style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#555', marginBottom: '20px' }}>
                            Daxili inamını bərpa etmək üçün bu cümləni daxilən 3 dəfə təkrarla.
                        </p>
                        <div style={{ minHeight: '120px', padding: '24px', background: isDarkMode ? '#2a2a2d' : '#f0f0f0', borderRadius: '14px', margin: '0 0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '4px solid #8b5cf6' }}>
                            <p style={{ fontSize: '18px', fontStyle: 'italic', color: isDarkMode ? '#f1f5f9' : '#333', margin: 0, lineHeight: 1.5 }}>
                                "{affirmations[affIndex]}"
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setAffIndex((prev) => (prev + 1) % affirmations.length)} style={{ padding: '12px 22px', backgroundColor: '#8b5cf6', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                                Növbəti Cümlə ➔
                            </button>
                            <button onClick={onClose} style={{ padding: '12px 18px', backgroundColor: '#2a2a2d', border: '1px solid #444', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                                Bağla
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}