"use client";

import React, { useState, useMemo } from "react";
import {
    Activity,
    Droplets,
    Moon,
    Footprints,
    Smile,
    Zap,
    TrendingUp,
    RefreshCw,
    Award
} from "lucide-react";

interface DailyScoreWidgetProps {
    isDarkMode?: boolean;
}

export default function DailyScoreWidget({ isDarkMode = true }: DailyScoreWidgetProps) {
    const [waterLitres, setWaterLitres] = useState<number>(1.6);
    const [sleepHours, setSleepHours] = useState<number>(7);
    const [steps, setSteps] = useState<number>(6500);
    const [moodScore, setMoodScore] = useState<number>(4);

    const targetWater = 2.5;
    const targetSleep = 8;
    const targetSteps = 8000;

    const healthMetrics = useMemo(() => {
        const waterPerc = Math.min((waterLitres / targetWater) * 100, 100);
        const sleepPerc = Math.min((sleepHours / targetSleep) * 100, 100);
        const stepsPerc = Math.min((steps / targetSteps) * 100, 100);
        const moodPerc = (moodScore / 5) * 100;

        const score = Math.round(
            sleepPerc * 0.35 + stepsPerc * 0.25 + waterPerc * 0.2 + moodPerc * 0.2
        );

        let status = "Əla";
        let statusColor = "#10B981"; // Green
        let advice = "Bədən və zehnin mükəmməl balansdadır! Bu tempi saxla.";

        if (score < 50) {
            status = "Kritik Diqqət";
            statusColor = "#EF4444"; // Red
            advice = "Enerjin aşağıdır. 1 stəkan su iç, 15 dəqiqə təmiz havada gəz və yuxunu bərpa et.";
        } else if (score < 75) {
            status = "Kafidir";
            statusColor = "#F59E0B"; // Amber
            advice = "Yaxşı gedirsən! Günün sonunadək su qəbulunu artıraraq balını 80+-ə qaldıra bilərsən.";
        }

        return { score, status, statusColor, advice, waterPerc, sleepPerc, stepsPerc };
    }, [waterLitres, sleepHours, steps, moodScore]);

    const radius = 68;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (healthMetrics.score / 100) * circumference;

    const theme = {
        cardBg: isDarkMode ? "#18181B" : "#FFFFFF",
        cardBorder: isDarkMode ? "#27272A" : "#E2E8F0",
        textPrimary: isDarkMode ? "#FFFFFF" : "#0F172A",
        textSecondary: isDarkMode ? "#A1A1AA" : "#64748B",
        inputBg: isDarkMode ? "#27272A" : "#F1F5F9",
        accent: "#10B981",
    };

    return (
        <div
            style={{
                backgroundColor: theme.cardBg,
                borderRadius: "24px",
                border: `1px solid ${theme.cardBorder}`,
                padding: "28px",
                color: theme.textPrimary,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                fontFamily: "sans-serif",
            }}
        >
            {/* Üst Başlıq */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                        style={{
                            padding: "10px",
                            borderRadius: "14px",
                            backgroundColor: "rgba(16, 185, 129, 0.12)",
                            color: "#10B981",
                        }}
                    >
                        <Activity size={22} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
                            E-Motion Daily Score
                        </h3>
                        <span style={{ fontSize: "12.5px", color: theme.textSecondary }}>
                            Gündəlik İnteqrasiya Edilmiş Sağlamlıq Balı
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "rgba(245, 158, 11, 0.15)",
                        color: "#F59E0B",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                    }}
                >
                    <Zap size={14} fill="#F59E0B" /> 5 Günlük Seriya
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "28px",
                    alignItems: "center",
                }}
            >
                {/* Sol tərəf: Dairəvi Göstərici və Nəticə */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        backgroundColor: isDarkMode ? "#202023" : "#F8FAFC",
                        borderRadius: "20px",
                        border: `1px solid ${theme.cardBorder}`,
                    }}
                >
                    <div style={{ position: "relative", width: "170px", height: "170px" }}>
                        <svg width="170" height="170" style={{ transform: "rotate(-90deg)" }}>
                            {/* Arxa Fon Çevrəsi */}
                            <circle
                                cx="85"
                                cy="85"
                                r={radius}
                                stroke={isDarkMode ? "#2D2D32" : "#E2E8F0"}
                                strokeWidth="12"
                                fill="transparent"
                            />
                            {/* Doldurulan Çevrə */}
                            <circle
                                cx="85"
                                cy="85"
                                r={radius}
                                stroke={healthMetrics.statusColor}
                                strokeWidth="12"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="transparent"
                                style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
                            />
                        </svg>

                        {/* Mərkəzdəki Bal Text-i */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <span style={{ fontSize: "40px", fontWeight: "800", lineHeight: "1" }}>
                                {healthMetrics.score}
                            </span>
                            <span style={{ fontSize: "11px", color: theme.textSecondary, marginTop: "4px" }}>
                                / 100 BAL
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: "16px",
                            textAlign: "center",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                backgroundColor: `${healthMetrics.statusColor}20`,
                                color: healthMetrics.statusColor,
                                padding: "4px 12px",
                                borderRadius: "12px",
                                fontSize: "12.5px",
                                fontWeight: "700",
                                marginBottom: "8px",
                            }}
                        >
                            Status: {healthMetrics.status}
                        </span>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "12.5px",
                                color: theme.textSecondary,
                                lineHeight: "1.4",
                                maxWidth: "240px",
                            }}
                        >
                            {healthMetrics.advice}
                        </p>
                    </div>
                </div>

                {/* Sağ tərəf: Slayderlər / İdarəetmə */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700" }}>
                        Günün Nəticələrini Yenilə
                    </h4>

                    {/* Su Qəbulu */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: theme.textSecondary }}>
                                <Droplets size={16} color="#3B82F6" /> Su Qəbulu
                            </span>
                            <span style={{ fontWeight: "700" }}>{waterLitres} L / {targetWater} L</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="4"
                            step="0.1"
                            value={waterLitres}
                            onChange={(e) => setWaterLitres(parseFloat(e.target.value))}
                            style={{ width: "100%", accentColor: "#3B82F6", cursor: "pointer" }}
                        />
                    </div>

                    {/* Yuxu Rejimi */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: theme.textSecondary }}>
                                <Moon size={16} color="#8B5CF6" /> Yuxu Müddəti
                            </span>
                            <span style={{ fontWeight: "700" }}>{sleepHours} saat / {targetSleep} saat</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="12"
                            step="0.5"
                            value={sleepHours}
                            onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                            style={{ width: "100%", accentColor: "#8B5CF6", cursor: "pointer" }}
                        />
                    </div>

                    {/* Addım Sayı */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: theme.textSecondary }}>
                                <Footprints size={16} color="#10B981" /> Günlük Addım
                            </span>
                            <span style={{ fontWeight: "700" }}>{steps.toLocaleString()} / {targetSteps.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="15000"
                            step="500"
                            value={steps}
                            onChange={(e) => setSteps(parseInt(e.target.value))}
                            style={{ width: "100%", accentColor: "#10B981", cursor: "pointer" }}
                        />
                    </div>

                    {/* Əhval-ruhiyyə */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: theme.textSecondary }}>
                                <Smile size={16} color="#F59E0B" /> Bugünkü Əhval-ruhiyyən
                            </span>
                            <span style={{ fontWeight: "700" }}>{moodScore} / 5</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setMoodScore(num)}
                                    style={{
                                        flex: 1,
                                        padding: "8px 0",
                                        borderRadius: "10px",
                                        border: `1px solid ${moodScore === num ? "#F59E0B" : theme.cardBorder}`,
                                        backgroundColor: moodScore === num ? "rgba(245, 158, 11, 0.2)" : theme.inputBg,
                                        color: moodScore === num ? "#F59E0B" : theme.textPrimary,
                                        fontWeight: "700",
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {num === 1 ? "😞" : num === 2 ? "😐" : num === 3 ? "🙂" : num === 4 ? "😊" : "🔥"}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}