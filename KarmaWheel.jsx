import React, { useState, useEffect, useRef } from 'react';

const KARMA_ASPECTS = [
  { label: 'Dharma', icon: '☸️', desc: 'Righteous duty', color: '#F59E0B', house: 9 },
  { label: 'Artha', icon: '💰', desc: 'Wealth & material', color: '#10B981', house: 2 },
  { label: 'Kama', icon: '❤️', desc: 'Love & desire', color: '#EC4899', house: 7 },
  { label: 'Moksha', icon: '🕉️', desc: 'Liberation', color: '#8B5CF6', house: 12 },
  { label: 'Karma', icon: '⚖️', desc: 'Past life debts', color: '#6366F1', house: 10 },
  { label: 'Bhakti', icon: '🙏', desc: 'Devotion', color: '#F97316', house: 5 },
  { label: 'Vidya', icon: '📚', desc: 'Knowledge', color: '#06B6D4', house: 4 },
  { label: 'Shakti', icon: '⚡', desc: 'Life force', color: '#EF4444', house: 1 },
];

function polarToXY(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function KarmaWheel({ kundali, size = 340 }) {
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState(null);
  const animRef = useRef(null);
  const cx = size / 2, cy = size / 2;
  const outerR = size * 0.43;
  const innerR = size * 0.22;
  const labelR = size * 0.36;
  const iconR = size * 0.43;
  const spokes = size * 0.38;

  useEffect(() => {
    let frame;
    const animate = () => {
      setRotation(r => (r + 0.1) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Compute scores from kundali houses
  function getScore(houseNum) {
    if (!kundali) return 50 + Math.random() * 50;
    const house = kundali.houses?.find(h => h.number === houseNum);
    if (!house) return 40;
    const base = 40 + house.planets.length * 15;
    return Math.min(base, 95);
  }

  const n = KARMA_ASPECTS.length;
  const angleStep = 360 / n;

  return (
    <div style={{ fontFamily: 'Georgia, serif', textAlign: 'center' }}>
      <h3 style={{
        color: '#A78BFA', fontSize: '1.1rem', marginBottom: '0.8rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        ☸️ Soul Karma Wheel
      </h3>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="bgGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1E0A3C" />
            <stop offset="100%" stopColor="#0A0615" />
          </radialGradient>
        </defs>

        {/* Background */}
        <circle cx={cx} cy={cy} r={size / 2} fill="url(#bgGrad)" />

        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(124,58,237,0.3)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={outerR * 0.7} fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="1" strokeDasharray="4,4" />

        {/* Rotating outer ring decoration */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${rotation}deg)`, transition: 'none' }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const a = i * 15;
            const p1 = polarToXY(cx, cy, outerR - 4, a);
            const p2 = polarToXY(cx, cy, outerR + 4, a);
            return (
              <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke="rgba(167,139,250,0.4)" strokeWidth="1" />
            );
          })}
        </g>

        {/* Spokes and sections */}
        {KARMA_ASPECTS.map((aspect, i) => {
          const angle = i * angleStep;
          const score = getScore(aspect.house);
          const scoreR = innerR + (spokes - innerR) * (score / 100);
          const p = polarToXY(cx, cy, spokes, angle);
          const ps = polarToXY(cx, cy, scoreR, angle);
          const pLabel = polarToXY(cx, cy, labelR, angle);
          const pIcon = polarToXY(cx, cy, outerR * 0.82, angle);
          const isSelected = selected === i;

          return (
            <g key={i} onClick={() => setSelected(isSelected ? null : i)} style={{ cursor: 'pointer' }}>
              {/* Spoke line */}
              <line
                x1={cx} y1={cy} x2={p.x} y2={p.y}
                stroke={aspect.color}
                strokeWidth={isSelected ? 2 : 0.8}
                opacity={0.4}
              />
              {/* Score indicator */}
              <circle
                cx={ps.x} cy={ps.y} r={isSelected ? 7 : 5}
                fill={aspect.color}
                filter="url(#glow)"
                opacity={0.9}
              />
              {/* Label */}
              <text
                x={pLabel.x} y={pLabel.y + 4}
                textAnchor="middle"
                fontSize="9"
                fill={isSelected ? '#fff' : aspect.color}
                fontFamily="sans-serif"
                fontWeight={isSelected ? 'bold' : 'normal'}
                opacity={0.9}
              >
                {aspect.label}
              </text>
              {/* Icon */}
              <text
                x={pIcon.x} y={pIcon.y + 4}
                textAnchor="middle"
                fontSize="11"
              >
                {aspect.icon}
              </text>
            </g>
          );
        })}

        {/* Filled polygon (radar chart) */}
        <polygon
          points={KARMA_ASPECTS.map((aspect, i) => {
            const angle = i * angleStep;
            const score = getScore(aspect.house);
            const scoreR = innerR + (spokes - innerR) * (score / 100);
            const p = polarToXY(cx, cy, scoreR, angle);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="rgba(124,58,237,0.15)"
          stroke="rgba(167,139,250,0.6)"
          strokeWidth="1.5"
        />

        {/* Inner circle */}
        <circle cx={cx} cy={cy} r={innerR} fill="rgba(0,0,0,0.5)" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" />

        {/* Center symbol */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20">🕉️</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="rgba(167,139,250,0.7)" fontFamily="serif">
          KARMA
        </text>
      </svg>

      {/* Selected detail */}
      {selected !== null && (
        <div style={{
          margin: '0.8rem auto 0',
          maxWidth: '300px',
          padding: '0.8rem 1.2rem',
          background: `linear-gradient(135deg, ${KARMA_ASPECTS[selected].color}20, rgba(0,0,0,0.4))`,
          border: `1px solid ${KARMA_ASPECTS[selected].color}50`,
          borderRadius: '12px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ color: KARMA_ASPECTS[selected].color, fontWeight: 'bold', marginBottom: '4px' }}>
            {KARMA_ASPECTS[selected].icon} {KARMA_ASPECTS[selected].label}
          </div>
          <div style={{ color: '#D1D5DB', fontSize: '0.85rem' }}>
            {KARMA_ASPECTS[selected].desc} · House {KARMA_ASPECTS[selected].house}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '4px' }}>
            Score: {Math.round(getScore(KARMA_ASPECTS[selected].house))}%
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: none; } }`}</style>
    </div>
  );
}
