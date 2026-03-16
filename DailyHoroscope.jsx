import React, { useState, useMemo } from 'react';
import { calculatePanchang } from '../engines/panchang.js';
import { RASIS, RASI_SYMBOLS } from '../engines/astrologyEngine.js';

const SIGN_THEMES = {
  Aries:       { icon: '♈', element: 'Fire',  ruling: 'Mars',    color: '#EF4444' },
  Taurus:      { icon: '♉', element: 'Earth', ruling: 'Venus',   color: '#10B981' },
  Gemini:      { icon: '♊', element: 'Air',   ruling: 'Mercury', color: '#3B82F6' },
  Cancer:      { icon: '♋', element: 'Water', ruling: 'Moon',    color: '#60A5FA' },
  Leo:         { icon: '♌', element: 'Fire',  ruling: 'Sun',     color: '#F59E0B' },
  Virgo:       { icon: '♍', element: 'Earth', ruling: 'Mercury', color: '#34D399' },
  Libra:       { icon: '♎', element: 'Air',   ruling: 'Venus',   color: '#F472B6' },
  Scorpio:     { icon: '♏', element: 'Water', ruling: 'Mars',    color: '#8B5CF6' },
  Sagittarius: { icon: '♐', element: 'Fire',  ruling: 'Jupiter', color: '#FBBF24' },
  Capricorn:   { icon: '♑', element: 'Earth', ruling: 'Saturn',  color: '#6B7280' },
  Aquarius:    { icon: '♒', element: 'Air',   ruling: 'Saturn',  color: '#22D3EE' },
  Pisces:      { icon: '♓', element: 'Water', ruling: 'Jupiter', color: '#A78BFA' },
};

// Deterministic daily horoscope based on sign + date seed
function generateDailyHoroscope(sign, date) {
  const seed = (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
    + RASIS.indexOf(sign) * 7919) % 997;
  const r = (n) => Math.floor((seed * (n + 1) * 6271) % 100);

  const themes = {
    love: ['Deep connection beckons.', 'Express your feelings boldly.', 'A meaningful conversation opens doors.', 'Romance is in the stars.', 'Solitude brings clarity in relationships.', 'Old bonds strengthen today.', 'New love energy surrounds you.'],
    career: ['A breakthrough idea arrives.', 'Leadership qualities shine.', 'Patience yields results.', 'Collaboration unlocks progress.', 'Stay focused on long-term goals.', 'Recognition for past efforts comes.', 'A pivot in direction serves you well.'],
    health: ['Grounding activities nourish you.', 'Rest and restore your energy.', 'Physical movement brings clarity.', 'Hydration and diet matter today.', 'Emotional release brings physical relief.', 'Morning rituals set a positive tone.', 'Sleep is your medicine tonight.'],
    finance: ['Conservative choices protect wealth.', 'An unexpected gain is possible.', 'Review your budget mindfully.', 'Avoid impulsive spending.', 'Investments made today may bloom later.', 'Generosity returns threefold.', 'Patience with finances pays off.'],
    spiritual: ['Meditation reveals deep truths.', 'The universe sends you a sign today.', 'Surrender what you cannot control.', 'Your intuition is sharp — trust it.', 'Gratitude amplifies your vibration.', 'Ancestral wisdom guides you.', 'A karmic cycle completes.'],
  };

  const scores = {
    overall: 50 + r(0) % 45,
    love:    40 + r(1) % 55,
    career:  45 + r(2) % 50,
    health:  50 + r(3) % 45,
    luck:    30 + r(4) % 65,
  };

  const theme = SIGN_THEMES[sign];

  // Generate lucky elements
  const luckyNumbers = [r(5) % 9 + 1, r(6) % 9 + 1, r(7) % 9 + 1];
  const luckyColors = ['Red', 'Blue', 'Green', 'Gold', 'White', 'Purple', 'Pink', 'Orange', 'Yellow', 'Indigo'];
  const luckyColor = luckyColors[r(8) % luckyColors.length];
  const luckyTime = `${8 + r(9) % 12}:${(r(10) % 6) * 10 || '00'}${r(9) % 2 === 0 ? ' AM' : ' PM'}`;

  return {
    overall: scores.overall,
    summary: `${sign} ${theme.icon} — Today the ${theme.element} energy of ${theme.ruling} guides you toward ${scores.overall > 70 ? 'significant breakthroughs' : scores.overall > 50 ? 'steady progress' : 'reflection and patience'}.`,
    love: { score: scores.love, msg: themes.love[r(11) % themes.love.length] },
    career: { score: scores.career, msg: themes.career[r(12) % themes.career.length] },
    health: { score: scores.health, msg: themes.health[r(13) % themes.health.length] },
    finance: { score: scores.finance, msg: themes.finance[r(14) % themes.finance.length] },
    spiritual: { score: scores.luck, msg: themes.spiritual[r(15) % themes.spiritual.length] },
    lucky: {
      numbers: [...new Set(luckyNumbers)].slice(0, 3),
      color: luckyColor,
      time: luckyTime,
    },
  };
}

function ScoreBar({ score, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          width: `${score}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: '3px',
          transition: 'width 0.6s ease',
        }} />
      </div>
      <span style={{ color, fontSize: '11px', fontWeight: 'bold', minWidth: '28px' }}>{score}%</span>
    </div>
  );
}

export default function DailyHoroscope({ userLagna }) {
  const [selectedSign, setSelectedSign] = useState(userLagna || 'Aries');
  const today = useMemo(() => new Date(), []);
  const horoscope = useMemo(() => generateDailyHoroscope(selectedSign, today), [selectedSign]);
  const theme = SIGN_THEMES[selectedSign];

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <h3 style={{
        color: '#A78BFA', fontSize: '1.1rem', marginBottom: '1rem',
        letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
      }}>
        🌟 Daily Horoscope — {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
      </h3>

      {/* Sign selector */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px',
        marginBottom: '1.2rem',
      }}>
        {RASIS.map(sign => {
          const t = SIGN_THEMES[sign];
          const isSelected = sign === selectedSign;
          return (
            <button
              key={sign}
              onClick={() => setSelectedSign(sign)}
              title={sign}
              style={{
                padding: '6px 4px', borderRadius: '8px', cursor: 'pointer',
                background: isSelected ? `${t.color}25` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isSelected ? t.color : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '14px' }}>{t.icon}</span>
              <span style={{ fontSize: '8px', color: isSelected ? t.color : '#6B7280' }}>
                {sign.slice(0, 3)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main horoscope card */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.color}18, rgba(0,0,0,0.4))`,
        border: `1px solid ${theme.color}35`,
        borderRadius: '14px', padding: '1.2rem',
        marginBottom: '1rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>{theme.icon}</div>
            <div style={{ color: theme.color, fontWeight: 'bold', fontSize: '1rem', marginTop: '2px' }}>{selectedSign}</div>
            <div style={{ color: '#6B7280', fontSize: '10px' }}>{theme.element} · {theme.ruling}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall</div>
            <div style={{
              fontSize: '2rem', fontWeight: 'bold',
              color: horoscope.overall > 70 ? '#10B981' : horoscope.overall > 50 ? theme.color : '#EF4444',
            }}>
              {horoscope.overall}
            </div>
            <div style={{ color: '#6B7280', fontSize: '10px' }}>out of 100</div>
          </div>
        </div>

        <p style={{ color: '#D1D5DB', fontSize: '0.88rem', lineHeight: '1.65', margin: '0 0 1rem' }}>
          {horoscope.summary}
        </p>

        {/* Category scores */}
        {[
          { key: 'love',     label: '❤️ Love',     color: '#EC4899' },
          { key: 'career',   label: '💼 Career',   color: '#3B82F6' },
          { key: 'health',   label: '💚 Health',   color: '#10B981' },
          { key: 'finance',  label: '💰 Finance',  color: '#F59E0B' },
          { key: 'spiritual',label: '🕉️ Spirit',   color: '#8B5CF6' },
        ].map(({ key, label, color }) => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <span style={{ color: '#9CA3AF', fontSize: '11px' }}>{label}</span>
              <span style={{ color: '#6B7280', fontSize: '11px' }}>{horoscope[key].msg}</span>
            </div>
            <ScoreBar score={horoscope[key].score} color={color} />
          </div>
        ))}
      </div>

      {/* Lucky elements */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap',
        padding: '0.8rem', background: 'rgba(255,255,255,0.03)',
        borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ color: '#9CA3AF', fontSize: '11px', width: '100%', marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Lucky Elements Today
        </div>
        <span style={luckyTag}>🔢 {horoscope.lucky.numbers.join(', ')}</span>
        <span style={luckyTag}>🎨 {horoscope.lucky.color}</span>
        <span style={luckyTag}>⏰ {horoscope.lucky.time}</span>
      </div>
    </div>
  );
}

const luckyTag = {
  background: 'rgba(124,58,237,0.15)',
  border: '1px solid rgba(124,58,237,0.25)',
  color: '#A78BFA', fontSize: '12px',
  padding: '3px 12px', borderRadius: '20px',
};
