"use client";
import FoodScanner from './FoodScanner';
import React, { useState, useEffect } from 'react';
import { Utensils, Plus, Flame, Trash2, Zap, Apple, Egg, UtensilsCrossed, Coffee, Sparkles, Droplet, RotateCcw } from 'lucide-react';
import { apiFetch } from '@/utils/api';
import { toast } from 'sonner';

interface Meal {
  id: number;
  name: string;
  calories: number;
  type: string;
  time: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionPanelProps {
  isDarkMode?: boolean;
}

interface FoodItem {
  cal: number;
  p: number;
  c: number;
  f: number;
  isPiece?: boolean;
  aliases: string[];
}

const COMPREHENSIVE_FOOD_DATABASE: FoodItem[] = [
  { aliases: ['toyuq', 'toyuq əti', 'toyuq filəsi', 'çolpa'], cal: 165, p: 31, c: 0, f: 3.6 },
  { aliases: ['mal əti', 'dana əti', 'ət'], cal: 250, p: 26, c: 0, f: 15 },
  { aliases: ['qoyun əti', 'tikə ət'], cal: 294, p: 25, c: 0, f: 21 },
  { aliases: ['balıq', 'somon', 'forel', 'nərə'], cal: 206, p: 22, c: 0, f: 12 },
  { aliases: ['yumurta', 'qayğanaq', 'omlet'], cal: 75, p: 6, c: 0.6, f: 5, isPiece: true },
  { aliases: ['kəsmik', 'tvoroq', 'süzmə'], cal: 98, p: 11, c: 3.4, f: 4.3 },
  { aliases: ['protein', 'protein tozu', 'whey'], cal: 120, p: 24, c: 3, f: 1.5, isPiece: true },
  { aliases: ['shake', 'protein shake'], cal: 210, p: 25, c: 15, f: 3, isPiece: true },
  { aliases: ['dönər', 'lavaş dönər', 'çörək dönər'], cal: 480, p: 24, c: 50, f: 18, isPiece: true },
  { aliases: ['plov', 'aşı'], cal: 210, p: 5, c: 30, f: 8 },
  { aliases: ['dolma', 'yarpaq dolması'], cal: 160, p: 8, c: 9, f: 9 },
  { aliases: ['qutab', 'ət qutabı', 'göy qutabı'], cal: 190, p: 6, c: 26, f: 7, isPiece: true },
  { aliases: ['xəngəl', 'yarpaq xəngəli'], cal: 230, p: 7, c: 35, f: 6 },
  { aliases: ['pizza'], cal: 266, p: 11, c: 33, f: 10, isPiece: true },
  { aliases: ['burger', 'humburger'], cal: 310, p: 16, c: 32, f: 13, isPiece: true },
  { aliases: ['düyü', 'bişmiş düyü'], cal: 130, p: 2.7, c: 28, f: 0.3 },
  { aliases: ['yulaf', 'gerkules', 'oatmeal'], cal: 389, p: 16.9, c: 66, f: 6.9 },
  { aliases: ['çörək', 'qara çörək', 'ağ çörək'], cal: 265, p: 9, c: 49, f: 3.2 },
  { aliases: ['kartof', 'kartof fri', 'bişmiş kartof'], cal: 87, p: 2, c: 20, f: 0.1 },
  { aliases: ['makaron', 'spagetti', 'pasta'], cal: 131, p: 5, c: 25, f: 1.1 },
  { aliases: ['pendir', 'şor'], cal: 350, p: 22, c: 2, f: 28 },
  { aliases: ['alma'], cal: 52, p: 0.3, c: 14, f: 0.2, isPiece: true },
  { aliases: ['banan'], cal: 89, p: 1.1, c: 23, f: 0.3, isPiece: true },
  { aliases: ['xiyar'], cal: 15, p: 0.7, c: 3.6, f: 0.1 },
  { aliases: ['pomidor'], cal: 18, p: 0.9, c: 3.9, f: 0.2 },
  { aliases: ['süd'], cal: 50, p: 3.3, c: 4.8, f: 2 },
  { aliases: ['qəhvə', 'kofe', 'espresso'], cal: 2, p: 0.3, c: 0, f: 0, isPiece: true },
  { aliases: ['çay'], cal: 1, p: 0, c: 0.2, f: 0, isPiece: true }
];

export default function NutritionPanel({ isDarkMode = false }: NutritionPanelProps) {
  const theme = {
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    textMuted: isDarkMode ? '#CBD5E1' : '#475569',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    inputBg: isDarkMode ? '#27272A' : '#F8FAFC',
    inputBorder: isDarkMode ? '#3F3F46' : '#CBD5E1',
    progressBg: isDarkMode ? '#2A2A2A' : '#F1F5F9',
    itemBg: isDarkMode ? '#27272A' : '#F8FAFC',
    itemBorder: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
    macroBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#F1F5F9',
  };

  const goals = { calories: 2000, protein: 130, carbs: 220, fat: 65 };
  const waterGoal = 2000;

  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('Günorta Yeməyi');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatInput, setFatInput] = useState('');
  const [autoDetected, setAutoDetected] = useState(false);

  const [water, setWater] = useState<number>(0);
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const savedMeals = localStorage.getItem('user_meals');
    if (savedMeals) {
      try {
        setMeals(JSON.parse(savedMeals));
      } catch (e) {
        console.error('Error reading meals:', e);
      }
    } else {
      setMeals([
        { id: 1, name: 'Toyuq və Düyü (150g + 150g)', calories: 430, type: 'Günorta Yeməyi', time: '13:30', protein: 40, carbs: 45, fat: 4 },
        { id: 2, name: 'Yulaf və Giləmeyvə', calories: 280, type: 'Səhər Yeməyi', time: '08:45', protein: 10, carbs: 45, fat: 5 }
      ]);
    }

    // Restored values must come from the signed-in account, not old browser state.
    const loadWater = async () => {
      try {
        const response = await apiFetch('/api/activity');
        if (!response.ok) throw new Error(`Water load failed: HTTP ${response.status}`);
        const data = await response.json();
        const savedMl = Number(data.water_ml ?? data.water ?? 0);
        setWater(Math.max(0, savedMl));
        localStorage.setItem('user_water', String(savedMl));
        localStorage.setItem('user_water_ml', String(savedMl));
        localStorage.setItem('user_water_glasses', String(Math.floor(savedMl / 250)));
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Su balansı serverdən yüklənmədi:', error);
      }
    };
    void loadWater();
  }, []);

  const saveMeals = (newMeals: Meal[]) => {
    setMeals(newMeals);
    localStorage.setItem('user_meals', JSON.stringify(newMeals));
  };

  const saveWater = async (newWater: number) => {
    const waterToSave = Math.max(0, Math.round(newWater));
    try {
      const response = await apiFetch('/api/nutrition', {
        method: 'POST',
        body: JSON.stringify({ water_ml: waterToSave }),
      });
      if (!response.ok) throw new Error(`Water save failed: HTTP ${response.status}`);
      const data = await response.json();
      const savedMl = Number(data.water_ml ?? waterToSave);
      setWater(savedMl);
      localStorage.setItem('user_water', String(savedMl));
      localStorage.setItem('user_water_ml', String(savedMl));
      localStorage.setItem('user_water_glasses', String(Math.floor(savedMl / 250)));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Water sync error:', error);
      window.alert('Su qəbulu serverdə saxlanmadı. Yenidən cəhd edin.');
    }
  };

  useEffect(() => {
    if (!mealName.trim()) {
      setAutoDetected(false);
      return;
    }

    const inputLower = mealName.toLowerCase();
    const segments = inputLower.split(/[,+\&]|\bvə\b/);

    let totalCal = 0;
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;
    let matchesFound = 0;

    segments.forEach((segment) => {
      const seg = segment.trim();
      if (!seg) return;

      const gramMatch = seg.match(/(\d+)\s*(g|gr|qram|q)/);
      const pieceMatch = seg.match(/(\d+)\s*(eded|ədəd|dənə|pay|dilim)/);
      const rawNumberMatch = seg.match(/^(\d+)\s+/);

      let amount = 100;
      let isExplicitPiece = false;

      if (gramMatch) {
        amount = parseFloat(gramMatch[1]);
      } else if (pieceMatch) {
        amount = parseFloat(pieceMatch[1]);
        isExplicitPiece = true;
      } else if (rawNumberMatch) {
        amount = parseFloat(rawNumberMatch[1]);
      }

      const foundItem = COMPREHENSIVE_FOOD_DATABASE.find(item =>
        item.aliases.some(alias => seg.includes(alias))
      );

      if (foundItem) {
        matchesFound++;
        let multiplier = 1;
        if (foundItem.isPiece || isExplicitPiece) {
          multiplier = amount > 10 ? amount / 100 : amount;
        } else {
          multiplier = amount / 100;
        }
        totalCal += foundItem.cal * multiplier;
        totalP += foundItem.p * multiplier;
        totalC += foundItem.c * multiplier;
        totalF += foundItem.f * multiplier;
      } else if (amount > 0 && seg.length > 2) {
        matchesFound++;
        let multiplier = isExplicitPiece ? amount : (amount / 100);
        totalCal += 160 * multiplier;
        totalP += 10 * multiplier;
        totalC += 20 * multiplier;
        totalF += 5 * multiplier;
      }
    });

    if (matchesFound > 0) {
      setCalories(Math.round(totalCal).toString());
      setProteinInput(Math.round(totalP).toString());
      setCarbsInput(Math.round(totalC).toString());
      setFatInput(Math.round(totalF).toString());
      setAutoDetected(true);
    } else {
      setAutoDetected(false);
    }
  }, [mealName]);

  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = meals.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbs = meals.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFat = meals.reduce((acc, curr) => acc + curr.fat, 0);

  const caloriePercent = Math.min(Math.round((totalCalories / goals.calories) * 100), 100);
  const proteinPercent = Math.min(Math.round((totalProtein / goals.protein) * 100), 100);
  const carbsPercent = Math.min(Math.round((totalCarbs / goals.carbs) * 100), 100);
  const fatPercent = Math.min(Math.round((totalFat / goals.fat) * 100), 100);
  const waterPercent = Math.min(Math.round((water / waterGoal) * 100), 100);

  const getFoodIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('shake') || lowerName.includes('protein')) return <Zap size={18} color="#EC4899" />;
    if (lowerName.includes('yumurta') || lowerName.includes('omlet')) return <Egg size={18} color="#F59E0B" />;
    if (lowerName.includes('toyuq') || lowerName.includes('ət') || lowerName.includes('düyü') || lowerName.includes('balıq') || lowerName.includes('dönər') || lowerName.includes('plov')) return <UtensilsCrossed size={18} color="#10B981" />;
    if (lowerName.includes('alma') || lowerName.includes('banan') || lowerName.includes('yulaf')) return <Apple size={18} color="#EF4444" />;
    if (lowerName.includes('qəhvə') || lowerName.includes('çay')) return <Coffee size={18} color="#8B5CF6" />;
    return <Apple size={18} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} />;
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim() || !calories || isNaN(Number(calories))) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const calNum = Number(calories);

    const pVal = proteinInput !== '' ? Number(proteinInput) : Math.round((calNum * 0.20) / 4);
    const cVal = carbsInput !== '' ? Number(carbsInput) : Math.round((calNum * 0.50) / 4);
    const fVal = fatInput !== '' ? Number(fatInput) : Math.round((calNum * 0.30) / 9);

    const newMeal: Meal = {
      id: Date.now(),
      name: mealName,
      calories: calNum,
      type: mealType,
      time: timeStr,
      protein: pVal,
      carbs: cVal,
      fat: fVal
    };

    saveMeals([newMeal, ...meals]);
    setMealName('');
    setCalories('');
    setProteinInput('');
    setCarbsInput('');
    setFatInput('');
    setAutoDetected(false);
    toast.success(`${newMeal.name} qida rasionunuza əlavə edildi!`);
  };

  const handleAddPreset = (name: string, cal: number, p: number, c: number, f: number, type: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMeal = { id: Date.now(), name, calories: cal, type, time: timeStr, protein: p, carbs: c, fat: f };
    saveMeals([newMeal, ...meals]);
    toast.success(`${name} əlavə edildi!`);
  };

  return (
    <div className="em-mobile-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Header section */}
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
          Gündəlik Qidalanma və Su İzləyicisi
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
          Enerjinizi yüksək saxlamaq üçün qidalarınızı qeyd edin və hidrasiya balansınızı qoruyun.
        </p>
      </div>

      {/* Dashboard Overview */}
      <div className="em-compact-section" style={{
        backgroundColor: theme.cardBg,
        borderRadius: '20px',
        padding: '24px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Günlük Kalori Hədəfi
            </span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: theme.textPrimary }}>
              {totalCalories} / {goals.calories} kcal ({caloriePercent}%)
            </span>
          </div>

          <div style={{ width: '100%', height: '10px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              width: `${caloriePercent}%`,
              height: '100%',
              backgroundColor: caloriePercent > 90 ? '#EF4444' : (isDarkMode ? '#4ADE80' : '#2E5B4E'),
              borderRadius: '10px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Su Balansı Hədəfi
            </span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: theme.textPrimary }}>
              {water} / {waterGoal} ml ({waterPercent}%)
            </span>
          </div>

          <div style={{ width: '100%', height: '10px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              width: `${waterPercent}%`,
              height: '100%',
              backgroundColor: '#06B6D4',
              borderRadius: '10px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', borderLeft: `1px solid ${theme.macroBorder}`, paddingLeft: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, fontWeight: '700' }}>ZÜLAL</span>
            <strong style={{ fontSize: '14px', color: theme.textPrimary }}>{totalProtein}g</strong>
            <div style={{ width: '40px', height: '4px', backgroundColor: theme.progressBg, borderRadius: '4px', margin: '4px auto 0' }}>
              <div style={{ width: `${proteinPercent}%`, height: '100%', backgroundColor: '#3B82F6', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, fontWeight: '700' }}>KARB</span>
            <strong style={{ fontSize: '14px', color: theme.textPrimary }}>{totalCarbs}g</strong>
            <div style={{ width: '40px', height: '4px', backgroundColor: theme.progressBg, borderRadius: '4px', margin: '4px auto 0' }}>
              <div style={{ width: `${carbsPercent}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, fontWeight: '700' }}>YAĞ</span>
            <strong style={{ fontSize: '14px', color: theme.textPrimary }}>{totalFat}g</strong>
            <div style={{ width: '40px', height: '4px', backgroundColor: theme.progressBg, borderRadius: '4px', margin: '4px auto 0' }}>
              <div style={{ width: `${fatPercent}%`, height: '100%', backgroundColor: '#EC4899', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Water Tracker Controls */}
      <div className="em-compact-section" style={{
        backgroundColor: theme.cardBg,
        padding: '20px 24px',
        borderRadius: '20px',
        border: `1px solid ${theme.borderColor}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: isDarkMode ? 'rgba(6, 182, 212, 0.15)' : '#ECFEFF', padding: '10px', borderRadius: '12px', color: '#06B6D4' }}>
            <Droplet size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>Su Qəbulu İdarəetməsi</h4>
            <span style={{ fontSize: '12.5px', color: theme.textSecondary }}>Maksimum hədəf: {waterGoal} ml </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => saveWater(water - 250)}
            disabled={water <= 0}
            style={{ padding: '8px 12px', borderRadius: '10px', border: `1px solid ${theme.borderColor}`, backgroundColor: theme.inputBg, color: water <= 0 ? theme.textSecondary : theme.textPrimary, fontSize: '12px', fontWeight: '600', cursor: water <= 0 ? 'not-allowed' : 'pointer', opacity: water <= 0 ? 0.5 : 1 }}
          >
            -250 ml
          </button>
          <button
            type="button"
            onClick={() => saveWater(water + 250)}
            disabled={water >= waterGoal}
            style={{ padding: '8px 12px', borderRadius: '10px', border: `1px solid ${theme.borderColor}`, backgroundColor: theme.inputBg, color: water >= waterGoal ? theme.textSecondary : theme.textPrimary, fontSize: '12px', fontWeight: '600', cursor: water >= waterGoal ? 'not-allowed' : 'pointer', opacity: water >= waterGoal ? 0.5 : 1 }}
          >
            +250 ml
          </button>
          <button
            type="button"
            onClick={() => saveWater(water + 500)}
            disabled={water >= waterGoal}
            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)', backgroundColor: isDarkMode ? 'rgba(6, 182, 212, 0.15)' : '#ECFEFF', color: '#06B6D4', fontSize: '12px', fontWeight: '600', cursor: water >= waterGoal ? 'not-allowed' : 'pointer', opacity: water >= waterGoal ? 0.5 : 1 }}
          >
            +500 ml
          </button>
          <button
            type="button"
            onClick={() => saveWater(0)}
            title="Reset"
            style={{ padding: '8px 10px', borderRadius: '10px', border: `1px solid ${theme.borderColor}`, backgroundColor: theme.inputBg, color: '#EF4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Meal Form and Scanner */}
      <div className="em-compact-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '14px', alignItems: 'start' }}>

        <div className="em-compact-section" style={{
          backgroundColor: theme.cardBg,
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils size={18} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} /> Yemək Qeyd Et
            </h3>
            {autoDetected && (
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} /> Avto-Hesablandı
              </span>
            )}
          </div>

          <form onSubmit={handleAddMeal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                Yeməyin Adı və Miqdarı
              </label>
              <input
                type="text"
                required
                placeholder="Məl. 250g boranı, 3 ədəd qutab, kabab..."
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${autoDetected ? '#10B981' : theme.inputBorder}`,
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: theme.inputBg,
                  color: theme.textPrimary,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 155px), 1fr))', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                  Kalori (kcal) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Məl. 430"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.inputBorder}`,
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                  Yemək Vaxtı
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.inputBorder}`,
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Səhər Yeməyi">Səhər Yeməyi</option>
                  <option value="Günorta Yeməyi">Günorta Yeməyi</option>
                  <option value="Şam Yeməyi">Şam Yeməyi</option>
                  <option value="Qəlyanaltı">Qəlyanaltı</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, marginBottom: '3px' }}>Zülal (g)</label>
                <input
                  type="number"
                  placeholder="Avto"
                  value={proteinInput}
                  onChange={(e) => setProteinInput(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, fontSize: '12px', outline: 'none', backgroundColor: theme.inputBg, color: theme.textPrimary, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, marginBottom: '3px' }}>Karbohidrat (g)</label>
                <input
                  type="number"
                  placeholder="Avto"
                  value={carbsInput}
                  onChange={(e) => setCarbsInput(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, fontSize: '12px', outline: 'none', backgroundColor: theme.inputBg, color: theme.textPrimary, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, marginBottom: '3px' }}>Yağ (g)</label>
                <input
                  type="number"
                  placeholder="Avto"
                  value={fatInput}
                  onChange={(e) => setFatInput(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, fontSize: '12px', outline: 'none', backgroundColor: theme.inputBg, color: theme.textPrimary, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '4px',
                backgroundColor: isDarkMode ? '#23473D' : '#2E5B4E',
                color: '#FFFFFF',
                border: 'none',
                padding: '11px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={16} /> Qeyd Et
            </button>
          </form>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: `1px solid ${theme.borderColor}` }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: '700', color: theme.textSecondary, marginBottom: '8px' }}>
              Sürətli Şablonlar
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleAddPreset('Yumurta (1 ədəd)', 75, 6, 1, 5, 'Səhər Yeməyi')}
                style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary, padding: '5px 9px', borderRadius: '8px', fontSize: '11.5px', cursor: 'pointer' }}
              >
                + Yumurta
              </button>
              <button
                type="button"
                onClick={() => handleAddPreset('Alma (1 ədəd)', 95, 1, 25, 0, 'Qəlyanaltı')}
                style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary, padding: '5px 9px', borderRadius: '8px', fontSize: '11.5px', cursor: 'pointer' }}
              >
                + Alma
              </button>
              <button
                type="button"
                onClick={() => handleAddPreset('Protein Shake', 200, 25, 12, 3, 'Qəlyanaltı')}
                style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary, padding: '5px 9px', borderRadius: '8px', fontSize: '11.5px', cursor: 'pointer' }}
              >
                + Shake
              </button>
            </div>
          </div>
        </div>

        {/* AI Scanner */}
        <FoodScanner isDarkMode={isDarkMode} />
      </div>

      {/* Meals List */}
      <div className="em-compact-section" style={{
        marginTop: '8px',
        backgroundColor: theme.cardBg,
        padding: '24px',
        borderRadius: '20px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Bugünkü Qeydlər</span>
          <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500' }}>{meals.length} yemək</span>
        </h3>

        {meals.length === 0 ? (
          <p style={{ margin: 0, fontSize: '13px', color: theme.textSecondary, textAlign: 'center', padding: '30px 0' }}>
            Hələ ki, heç bir yemək qeyd edilməyib.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
            {meals.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: theme.itemBg,
                  border: `1px solid ${theme.itemBorder}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: theme.cardBg,
                    padding: '8px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${theme.borderColor}`
                  }}>
                    {getFoodIcon(item.name)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>{item.name}</h4>
                    <span style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                      {item.type} • {item.time} | <span style={{ color: '#3B82F6' }}>P:{item.protein}g</span> <span style={{ color: '#F59E0B' }}>C:{item.carbs}g</span> <span style={{ color: '#EC4899' }}>F:{item.fat}g</span>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '800', color: isDarkMode ? '#4ADE80' : '#2E5B4E' }}>
                    {item.calories} kcal
                  </span>
                  <button
                    onClick={() => {
                      saveMeals(meals.filter(m => m.id !== item.id));
                      toast.info(`${item.name} rasiondan silindi.`);
                    }}
                    style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: '4px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.textSecondary}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}