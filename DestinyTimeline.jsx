import React, { useState } from 'react';
import { getDashaColor } from '../engines/dashaEngine.js';

export default function DestinyTimeline({ timeline, currentDasha, birthDate }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (!timeline || timeline.length === 0) {
    return <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem' }}>Generate your Kundali to see your Destiny Timeline</div>;
  }

  const maxYears = Math.max(...timeline.map(t => t.endAge));
  const now = new Date();
  const birthDt = new Date(birthDate);
  const currentAge = (now - birthDt) / (365.25 * 24 * 3600 * 1000);
  const currentPct = (currentAge / maxYears) * 100;

  const selectedItem = selectedIdx !== null ? timeline[selectedIdx] : null;

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <h3 style={{
        color: '#A78BFA', fontSize: '1.1rem', marginBottom: '1.2rem',
        letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
      }}>
        ✨ Karma Destiny Timeline
      </h3>

      {/* Timeline bar */}
      <div style={{ position: 'relative', margin: '0 0 2rem' }}>
        {/* Background track */}
        <div style={{
          height: '48px', background: 'rgba(255,255,255,0.04)',
          borderRadius: '24px', overflow: 'hidden', position: 'relative',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          {timeline.map((item, idx) => {
            const startPct = (item.startAge / maxYears) * 100;
            const widthPct = ((item.endAge - item.startAge) / maxYears) * 100;
            const isActive = item.planet === currentDasha?.planet;
            const color = getDashaColor(item.planet);

            return (
              <div
                key={idx}
                onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position: 'absolute',
                  left: `${startPct}%`,
                  width: `${widthPct}%`,
                  height: '100%',
                  background: isActive
                    ? `linear-gradient(90deg, ${color}CC, ${color})`
                    : `${color}44`,
                  borderRight: '1px solid rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: hoveredIdx === idx ? 1 : isActive ? 0.95 : 0.65,
                  boxSizing: 'border-box',
                }}
                title={`${item.period}: Age ${item.ageRange}`}
              >
                {widthPct > 7 && (
                  <span style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    fontSize: widthPct > 10 ? '10px' : '8px',
                    fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    pointerEvents: 'none',
                  }}>
                    {widthPct > 12 ? item.planet : item.planet.slice(0, 2)}
                  </span>
                )}
              </div>
            );
          })}

          {/* Current age marker */}
          {currentPct > 0 && currentPct < 100 && (
            <div style={{
              position: 'absolute',
              left: `${currentPct}%`,
              top: 0, bottom: 0,
              width: '2px',
              background: '#FBBF24',
              boxShadow: '0 0 8px #FBBF24',
              zIndex: 10,
            }}>
              <div style={{
                position: 'absolute', top: '-18px', left: '50%',
                transform: 'translateX(-50%)',
                background: '#FBBF24', color: '#000',
                fontSize: '9px', fontWeight: 'bold',
                padding: '1px 5px', borderRadius: '8px',
                whiteSpace: 'nowrap',
              }}>
                NOW
              </div>
            </div>
          )}
        </div>

        {/* Age labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          {[0, 20, 40, 60, 80, 100].map(age => {
            const pct = (age / maxYears) * 100;
            if (pct > 100) return null;
            return (
              <span key={age} style={{ fontSize: '10px', color: '#6B7280' }}>
                {age}
              </span>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        marginBottom: '1.5rem', justifyContent: 'center',
      }}>
        {timeline.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px', borderRadius: '20px', cursor: 'pointer',
              background: selectedIdx === idx
                ? getDashaColor(item.planet) + '33'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${selectedIdx === idx ? getDashaColor(item.planet) : 'rgba(255,255,255,0.1)'}`,
              color: getDashaColor(item.planet),
              fontSize: '11px', fontWeight: '600', transition: 'all 0.2s',
            }}
          >
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: getDashaColor(item.planet), display: 'inline-block',
            }} />
            {item.planet} ({item.ageRange})
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selectedItem && (
        <div style={{
          background: `linear-gradient(135deg, ${getDashaColor(selectedItem.planet)}15, rgba(0,0,0,0.3))`,
          border: `1px solid ${getDashaColor(selectedItem.planet)}40`,
          borderRadius: '12px', padding: '1.2rem',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
            <div>
              <h4 style={{ color: getDashaColor(selectedItem.planet), margin: 0, fontSize: '1.1rem' }}>
                {selectedItem.period}
              </h4>
              <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                Age {selectedItem.ageRange} · {selectedItem.years?.toFixed(1)} years
              </span>
            </div>
            <span style={{
              background: getDashaColor(selectedItem.planet) + '33',
              color: getDashaColor(selectedItem.planet),
              padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
            }}>
              {selectedItem.planet === currentDasha?.planet ? '▶ ACTIVE' : '◦ FUTURE'}
            </span>
          </div>

          <p style={{ color: '#D1D5DB', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1rem' }}>
            {selectedItem.theme}
          </p>

          {selectedItem.events && selectedItem.events.length > 0 && (
            <>
              <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Predicted Life Events
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedItem.events.map((ev, i) => (
                  <span key={i} style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#E5E7EB', fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                  }}>
                    Age ~{ev.age}: {ev.event}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
