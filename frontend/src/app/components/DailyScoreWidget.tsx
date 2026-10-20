"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Activity,
    Zap
} from "lucide-react";

interface DailyScoreWidgetProps {
    isDarkMode?: boolean;
}

export default function DailyScoreWidget({ isDarkMode = true }: DailyScoreWidgetProps) {
    const [mounted, setMounted] = useState(false);
    const [waterLitres, setWaterLitres] = useState<number>(0);
    const [sleepHours, setSleepHours] = useState<number>(0);
    const [steps, setSteps] = useState<number>(0);
    const [activeMinutes, setActiveMinutes] = useState<number>(0);
    const [calories, setCalories] = useState<number>(0);

    const loadDataFromStorage = () => {
        const savedSteps = localStorage.getItem('user_steps');
        const savedMins = localStorage.getItem('user_active_minutes');
        const savedCals = localStorage.getItem('user_calories');
        const savedSleep = localStorage.getItem('user_sleep_hours') || localStorage.getItem('user_sleep');
        const savedWaterMl = localStorage.getItem('user_water_ml');
        const savedGlasses = localStorage.getItem('user_water_glasses');

        const stepNum = savedSteps ? Number(savedSteps) : 0;
        const minNum = savedMins ? Number(savedMins) : 0;
        setSteps(stepNum);
        setActiveMinutes(minNum);

        if (savedCals) {
            setCalories(Number(savedCals));
        } else {
            setCalories(Math.round(stepNum * 0.04 + minNum * 5));
        }

        setSleepHours(savedSleep !== null ? Number(savedSleep) : 0);

        if (savedWaterMl !== null) {
            setWaterLitres(Number(savedWaterMl) / 1000);
        } else if (savedGlasses !== null) {
            setWaterLitres((Number(savedGlasses) * 250) / 1000);
        } else {
            setWaterLitres(0);
        }
    };

    useEffect(() => {
        setMounted(true);
        loadDataFromStorage();

        const handleUpdate = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail) {
                if (customEvent.detail.steps !== undefined) setSteps(Number(customEvent.detail.steps));
                if (customEvent.detail.activeMinutes !== undefined) setActiveMinutes(Number(customEvent.detail.activeMinutes));
                if (customEvent.detail.calories !== undefined) setCalories(Number(customEvent.detail.calories));
            }
            loadDataFromStorage();
        };

        window.addEventListener('activity-updated', handleUpdate as EventListener);
        window.addEventListener('storage', handleUpdate);

        return () => {
            window.removeEventListener('activity-updated', handleUpdate as EventListener);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    const healthMetrics = useMemo(() => {
        const stepScore = Math.min(20, (steps / 10000) * 20);
        const activityScore = Math.min(20, (activeMinutes / 60) * 20);
        const currentCalories = calories || Math.round(steps * 0.04 + activeMinutes * 5);
        const calorieScore = Math.min(20, (currentCalories / 600) * 20);
        const waterScore = Math.min(20, (waterLitres / 2.0) * 20);

        let sleepScore = 0;
        if (sleepHours >= 7 && sleepHours <= 9) {
            sleepScore = 20;
        } else if (sleepHours > 0) {
            const diff = Math.abs(8 - sleepHours);
            sleepScore = Math.max(0, 20 - diff * 4);
        }

        const score = Math.round(stepScore + activityScore + calorieScore + waterScore + sleepScore);

        let status = "Zəif";
        let statusColor = "#EF4444";

        if (score >= 80) {
            status = "Mükəmməl";
            statusColor = "#10B981";
        } else if (score >= 60) {
            status = "Yaxşı";
            statusColor = "#3B82F6";
        } else if (score >= 40) {
            status = "Orta";
            statusColor = "#F59E0B";
        }

        return { score, status, statusColor };
    }, [waterLitres, sleepHours, steps, activeMinutes, calories]);

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
            {/* Top Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                    <div>
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>Daily Score</h4>
                        <span style={{ fontSize: "11px", color: theme.textSecondary }}>Gündəlik Balın</span>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
                    <Zap size={12} fill="#F59E0B" /> 5 Gün
                </div>
            </div>

            {/* Circular Indicator */}
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
        </div>
    );
}