"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Activity,
    Droplets,
    Moon,
    Footprints,
    Smile,
    Zap
} from "lucide-react";

interface DailyScoreWidgetProps {
    isDarkMode?: boolean;
}

export default function DailyScoreWidget({ isDarkMode = true }: DailyScoreWidgetProps) {
    const [mounted, setMounted] = useState(false);
    const [waterLitres, setWaterLitres] = useState<number>(1.5);
    const [sleepHours, setSleepHours] = useState<number>(7);
    const [steps, setSteps] = useState<number>(6500);
    const [moodScore, setMoodScore] = useState<number>(4);
    const [targetWater, setTargetWater] = useState<number>(2.5);
    const [targetSteps, setTargetSteps] = useState<number>(10000);
    const targetSleep = 8;

    useEffect(() => {
        setMounted(true);

        const savedSteps = localStorage.getItem('user_steps');
        if (savedSteps) setSteps(Number(savedSteps));

        const savedSleep = localStorage.getItem('user_sleep');
        if (savedSleep) setSleepHours(Number(savedSleep));

        const savedMood = localStorage.getItem('user_mood');
        if (savedMood) setMoodScore(Number(savedMood));

        const savedWaterMl = localStorage.getItem('user_water_ml');
        if (savedWaterMl) {
            setWaterLitres(Number(savedWaterMl) / 1000);
        } else {
            const savedGlasses = localStorage.getItem('user_water_glasses');
            if (savedGlasses) setWaterLitres((Number(savedGlasses) * 250) / 1000);
        }

        const savedGoal = localStorage.getItem('user_step_goal');
        if (savedGoal) setTargetSteps(Number(savedGoal));

        const savedWaterGoal = localStorage.getItem('daily_water_goal');
        if (savedWaterGoal) setTargetWater(Number(savedWaterGoal) / 1000);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.daily_step_goal || parsed.dailyStepGoal) {
                    setTargetSteps(Number(parsed.daily_step_goal || parsed.dailyStepGoal));
                }
                if (parsed.daily_water_goal || parsed.dailyWaterGoal) {
                    setTargetWater(Number(parsed.daily_water_goal || parsed.dailyWaterGoal) / 1000);
                }
            } catch (e) {
                console.error("Lokal istifadəçi datası oxunarkən xəta:", e);
            }
        }
    }, []);

    const handleWaterChange = (val: number) => {
        setWaterLitres(val);
        localStorage.setItem('user_water_ml', (val * 1000).toString());
    };

    const handleSleepChange = (val: number) => {
        setSleepHours(val);
        localStorage.setItem('user_sleep', val.toString());
    };

    const handleStepsChange = (val: number) => {
        setSteps(val);
        localStorage.setItem('user_steps', val.toString());
    };

    const handleMoodChange = (val: number) => {
        setMoodScore(val);
        localStorage.setItem('user_mood', val.toString());
    };

    const healthMetrics = useMemo(() => {
        const waterPerc = Math.min((waterLitres / (targetWater || 2.5)) * 100, 100);
        const sleepPerc = Math.min((sleepHours / targetSleep) * 100, 100);
        const stepsPerc = Math.min((steps / (targetSteps || 10000)) * 100, 100);
        const moodPerc = (moodScore / 5) * 100;

        const score = Math.round(
            sleepPerc * 0.35 + stepsPerc * 0.25 + waterPerc * 0.2 + moodPerc * 0.2
        );

        let status = "Əla";
        let statusColor = "#10B981";

        if (score < 50) {
            status = "Kritik Diqqət";
            statusColor = "#EF4444";
        } else if (score < 75) {
            status = "Kafidir";
            statusColor = "#F59E0B";
        }

        return { score, status, statusColor };
    }, [waterLitres, sleepHours, steps, moodScore, targetWater, targetSteps]);

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (healthMetrics.score / 100) * circumference;

    const theme = {
        cardBg: isDarkMode ? "#18181B" : "#FFFFFF",
        cardBorder: isDarkMode ? "#27272A" : "#E2E8F0",
        textPrimary: isDarkMode ? "#FFFFFF" : "#0F172A",
        textSecondary: isDarkMode ? "#A1A1AA" : "#64748B",
    };

    if (!mounted) return null;

    return (
        <div
            style={{
                backgroundColor: theme.cardBg,
                borderRadius: "16px",
                border: `1px solid ${theme.cardBorder}`,
                padding: "16px",
                color: theme.textPrimary,
                fontFamily: "sans-serif",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            {/* Üst Başlıq */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ padding: "6px", borderRadius: "10px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10B981" }}>
                        <Activity size={18} />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>Daily Score</h4>
                        <span style={{ fontSize: "11px", color: theme.textSecondary }}>Gündəlik Balın</span>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
                    <Zap size={12} fill="#F59E0B" /> 5 Gün
                </div>
            </div>

            {/* Dairəvi Bal Göstəricisi */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", backgroundColor: isDarkMode ? "#202023" : "#F8FAFC", padding: "12px", borderRadius: "12px", border: `1px solid ${theme.cardBorder}` }}>
                <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
                    <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="60" cy="60" r={radius} stroke={isDarkMode ? "#2D2D32" : "#E2E8F0"} strokeWidth="10" fill="transparent" />
                        <circle cx="60" cy="60" r={radius} stroke={healthMetrics.statusColor} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
                    </svg>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "28px", fontWeight: "800", lineHeight: "1" }}>{healthMetrics.score}</span>
                        <span style={{ fontSize: "10px", color: theme.textSecondary, marginTop: "2px" }}>/ 100</span>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "11px", color: theme.textSecondary }}>Ümumi Vəziyyət</span>
                    <span style={{ display: "inline-block", backgroundColor: `${healthMetrics.statusColor}20`, color: healthMetrics.statusColor, padding: "2px 8px", borderRadius: "8px", fontSize: "12px", fontWeight: "700" }}>
                        {healthMetrics.status}
                    </span>
                </div>
            </div>
            {/* İnteraktiv Sliderlər */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Su */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: theme.textSecondary }}>
                            <Droplets size={14} color="#3B82F6" /> Su
                        </span>
                        <span style={{ fontWeight: "600" }}>{waterLitres} L</span>
                    </div>
                    <input type="range" min="0" max="4" step="0.1" value={waterLitres} onChange={(e) => handleWaterChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#3B82F6", cursor: "pointer" }} />
                </div>

                {/* Yuxu */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: theme.textSecondary }}>
                            <Moon size={14} color="#8B5CF6" /> Yuxu
                        </span>
                        <span style={{ fontWeight: "600" }}>{sleepHours} saat</span>
                    </div>
                    <input type="range" min="0" max="12" step="0.5" value={sleepHours} onChange={(e) => handleSleepChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#8B5CF6", cursor: "pointer" }} />
                </div>

                {/* Addım */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: theme.textSecondary }}>
                            <Footprints size={14} color="#10B981" /> Addım
                        </span>
                        <span style={{ fontWeight: "600" }}>{steps.toLocaleString()}</span>
                    </div>
                    <input type="range" min="0" max="15000" step="500" value={steps} onChange={(e) => handleStepsChange(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#10B981", cursor: "pointer" }} />
                </div>

                {/* Əhval-ruhiyyə */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: theme.textSecondary }}>
                            <Smile size={14} color="#EC4899" /> Əhval (1-5)
                        </span>
                        <span style={{ fontWeight: "600" }}>{moodScore} / 5</span>
                    </div>
                    <input type="range" min="1" max="5" step="1" value={moodScore} onChange={(e) => handleMoodChange(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#EC4899", cursor: "pointer" }} />
                </div>
            </div>
        </div>
    );
}