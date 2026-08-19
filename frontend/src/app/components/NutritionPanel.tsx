"use client";
import React, { useState } from 'react';
import { Utensils, Plus, Flame, Trash2, Zap, Apple, Egg, UtensilsCrossed, Coffee, Cookie } from 'lucide-react';

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

  const goals = {
    calories: 2000,
    protein: 130,
    carbs: 220,
    fat: 65,
  };

  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('Günorta');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatInput, setFatInput] = useState('');

  const [meals, setMeals] = useState<Meal[]>([
    { id: 1, name: 'Toyuq və Düyü (150g + 150g)', calories: 430, type: 'Günorta', time: '13:30', protein: 40, carbs: 45, fat: 4 },
    { id: 2, name: 'Yulaf və Giləmeyvə', calories: 280, type: 'Səhər', time: '08:45', protein: 10, carbs: 45, fat: 5 }
  ]);

  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = meals.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbs = meals.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFat = meals.reduce((acc, curr) => acc + curr.fat, 0);

  const caloriePercent = Math.min(Math.round((totalCalories / goals.calories) * 100), 100);
  const proteinPercent = Math.min(Math.round((totalProtein / goals.protein) * 100), 100);
  const carbsPercent = Math.min(Math.round((totalCarbs / goals.carbs) * 100), 100);
  const fatPercent = Math.min(Math.round((totalFat / goals.fat) * 100), 100);

  const getFoodIcon = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('shake') || lowerName.includes('protein')) {
      return <Zap size={18} color="#EC4899" />;
    }
    if (lowerName.includes('yumurta') || lowerName.includes('omlet')) {
      return <Egg size={18} color="#F59E0B" />;
    }
    if (lowerName.includes('toyuq') || lowerName.includes('ət') || lowerName.includes('düyü') || lowerName.includes('balıq')) {
      return <UtensilsCrossed size={18} color="#10B981" />;
    }
    if (lowerName.includes('alma') || lowerName.includes('giləmeyvə') || lowerName.includes('yulaf') || lowerName.includes('meyvə')) {
      return <Apple size={18} color="#EF4444" />;
    }
    if (lowerName.includes('qəhvə') || lowerName.includes('kofe') || lowerName.includes('çay')) {
      return <Coffee size={18} color="#8B5CF6" />;
    }
    if (lowerName.includes('peçenye') || lowerName.includes('tort') || lowerName.includes('şirniyyat')) {
      return <Cookie size={18} color="#D97706" />;
    }

    return <Apple size={18} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} />;
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim() || !calories || isNaN(Number(calories))) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const calNum = Number(calories);

    const newMeal: Meal = {
      id: Date.now(),
      name: mealName,
      calories: calNum,
      type: mealType,
      time: timeStr,
      protein: proteinInput !== '' ? Number(proteinInput) : Math.round(calNum * 0.05),
      carbs: carbsInput !== '' ? Number(carbsInput) : Math.round(calNum * 0.1),
      fat: fatInput !== '' ? Number(fatInput) : Math.round(calNum * 0.02)
    };

    setMeals([newMeal, ...meals]);
    setMealName('');
    setCalories('');
    setProteinInput('');
    setCarbsInput('');
    setFatInput('');
  };

  const handleAddPreset = (name: string, cal: number, p: number, c: number, f: number, type: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMeal: Meal = {
      id: Date.now(),
      name,
      calories: cal,
      type,
      time: timeStr,
      protein: p,
      carbs: c,
      fat: f
    };

    setMeals([newMeal, ...meals]);
  };

  const handleDeleteMeal = (id: number) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Başlıq */}
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
          Gündəlik Qidalanma və Kalori İzləyicisi
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
          Enerjinizi yüksək saxlamaq üçün gündəlik qida qəbulunuzu və kalorilərinizi rahatlıqla qeyd edin.
        </p>
      </div>

      {/* Dinamik İcmal Paneli */}
      <div style={{
        backgroundColor: theme.cardBg,
        borderRadius: '20px',
        padding: '24px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        {/* Sol: Kalori Hədəfi */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="#EF4444" /> Günlük Kalori Hədəfi
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

        {/* Sağ: Dinamik Makronutrientlər */}
        <div style={{ display: 'flex', justifyContent: 'space-around', borderLeft: `1px solid ${theme.macroBorder}`, paddingLeft: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, fontWeight: '700' }}>ZÜLAL</span>
            <strong style={{ fontSize: '14px', color: theme.textPrimary }}>{totalProtein}g <span style={{ fontSize: '10px', color: theme.textSecondary }}>/ {goals.protein}g</span></strong>
            <div style={{ width: '54px', height: '4px', backgroundColor: theme.progressBg, borderRadius: '4px', margin: '4px auto 0' }}>
              <div style={{ width: `${proteinPercent}%`, height: '100%', backgroundColor: '#3B82F6', borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, fontWeight: '700' }}>KARBOHİDRAT</span>
            <strong style={{ fontSize: '14px', color: theme.textPrimary }}>{totalCarbs}g <span style={{ fontSize: '10px', color: theme.textSecondary }}>/ {goals.carbs}g</span></strong>
            <div style={{ width: '54px', height: '4px', backgroundColor: theme.progressBg, borderRadius: '4px', margin: '4px auto 0' }}>
              <div style={{ width: `${carbsPercent}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, fontWeight: '700' }}>YAĞ</span>
            <strong style={{ fontSize: '14px', color: theme.textPrimary }}>{totalFat}g <span style={{ fontSize: '10px', color: theme.textSecondary }}>/ {goals.fat}g</span></strong>
            <div style={{ width: '54px', height: '4px', backgroundColor: theme.progressBg, borderRadius: '4px', margin: '4px auto 0' }}>
              <div style={{ width: `${fatPercent}%`, height: '100%', backgroundColor: '#EC4899', borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Form və Siyahı Bloku */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>

        {/* Yemək Əlavə Et Formu */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={18} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} /> Yemək Qeyd Et
          </h3>

          <form onSubmit={handleAddMeal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                Yeməyin Adı *
              </label>
              <input
                type="text"
                required
                placeholder="Məl. Toyuq və Düyü"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                  <option value="Səhər">Səhər Yeməyi</option>
                  <option value="Günorta">Günorta Yeməyi</option>
                  <option value="Şam">Şam Yeməyi</option>
                  <option value="Qəlyanaltı">Qəlyanaltı</option>
                </select>
              </div>
            </div>

            {/* Opsional Makronutrient Dəyərləri */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
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
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2E5B4E' : '#23473D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#23473D' : '#2E5B4E'}
            >
              <Plus size={16} /> Qeyd Et
            </button>
          </form>

          {/* Sürətli Əlavə Şablonları */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: `1px solid ${theme.borderColor}` }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: '700', color: theme.textSecondary, marginBottom: '8px' }}>
              <Zap size={13} color="#F59E0B" /> Sürətli Şablonlar
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleAddPreset('Yumurta (1 ədəd)', 75, 6, 1, 5, 'Səhər')}
                style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary, padding: '5px 9px', borderRadius: '8px', fontSize: '11.5px', cursor: 'pointer' }}
              >
                + Yumurta (75 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleAddPreset('Alma (1 ədəd)', 95, 1, 25, 0, 'Qəlyanaltı')}
                style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary, padding: '5px 9px', borderRadius: '8px', fontSize: '11.5px', cursor: 'pointer' }}
              >
                + Alma (95 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleAddPreset('Protein Shake (Süd ilə)', 200, 25, 12, 3, 'Qəlyanaltı')}
                style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary, padding: '5px 9px', borderRadius: '8px', fontSize: '11.5px', cursor: 'pointer' }}
              >
                + Shake (200 kcal)
              </button>
            </div>
          </div>
        </div>

        {/* Bugünkü Qeydlər Siyahısı */}
        <div style={{
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
                      onClick={() => handleDeleteMeal(item.id)}
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

    </div>
  );
}