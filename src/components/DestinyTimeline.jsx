import React, { useState, useMemo } from 'react';
import { getDashaColor } from '../engines/dashaEngine.js';

// ─── LIFE PHASES ──────────────────────────────────────────────────────────────
const LIFE_PHASES = [
  { name: 'Childhood',           icon: '🌱', ageStart: 0,  ageEnd: 12,  color: '#34D399', desc: 'Foundation of character, family karma, early impressions' },
  { name: 'Education',           icon: '📚', ageStart: 12, ageEnd: 24,  color: '#60A5FA', desc: 'Knowledge building, identity formation, first dharmic steps' },
  { name: 'Career Launch',       icon: '🚀', ageStart: 24, ageEnd: 35,  color: '#F59E0B', desc: 'Professional foundation, ambition, early wealth creation' },
  { name: 'Love & Marriage',     icon: '❤️', ageStart: 25, ageEnd: 40,  color: '#EC4899', desc: 'Partnerships, relationships, family creation' },
  { name: 'Wealth Accumulation', icon: '💰', ageStart: 35, ageEnd: 55,  color: '#FBBF24', desc: 'Peak earning, property, material establishment' },
  { name: 'Wisdom Years',        icon: '🦉', ageStart: 45, ageEnd: 65,  color: '#A78BFA', desc: 'Mentorship, dharmic clarity, karmic completion' },
  { name: 'Spiritual Awakening', icon: '🕉️', ageStart: 55, ageEnd: 100, color: '#8B5CF6', desc: 'Moksha path, letting go, service, inner realization' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getAgeFromDate(birthDate) {
  return (new Date() - new Date(birthDate)) / (365.25 * 24 * 3600 * 1000);
}

function getActivePhases(currentAge) {
  return LIFE_PHASES.filter(p => currentAge >= p.ageStart && currentAge <= p.ageEnd);
}

// ─── PHASE BADGE ─────────────────────────────────────────────────────────────
function PhaseBadge({ phase, isActive, isComplete }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '5px 10px', borderRadius: '20px',
      background: isActive ? `${phase.color}22` : isComplete ? 'rgba(255,255,255,0.04)' : 'transparent',
      border: `1px solid ${isActive ? phase.color : isComplete ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
      opacity: isComplete ? 0.6 : 1,
      transition: 'all 0.2s',
    }}>
      <span style={{ fontSize: '14px' }}>{phase.icon}</span>
      <div>
        <div style={{ color: isActive ? phase.color : '#9CA3AF', fontSize: '11px', fontWeight: isActive ? '700' : '400' }}>
          {phase.name}
        </div>
        <div style={{ color: '#6B7280', fontSize: '9px' }}>Age {phase.ageStart}–{phase.ageEnd}</div>
      </div>
      {isActive && <span style={{ width: '6px', height: '6px', background: phase.color, borderRadius: '50%', boxShadow: `0 0 6px ${phase.color}`, flexShrink: 0 }} />}
      {isComplete && <span style={{ color: '#10B981', fontSize: '10px' }}>✓</span>}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DestinyTimeline({ timeline, currentDasha, birthDate }) {
  const [view, setView] = useState('timeline');   // 'timeline' | 'phases' | 'dasha'
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const currentAge = useMemo(() => birthDate ? getAgeFromDate(birthDate) : 30, [birthDate]);
  const activePhases = useMemo(() => getActivePhases(currentAge), [currentAge]);

  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem', fontFamily: 'Georgia, serif' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
        Generate your Kundali to reveal your Destiny Timeline
      </div>
    );
  }

  const maxYears = 90;
  const currentPct = Math.min((currentAge / maxYears) * 100, 100);

  const VIEWS = [
    { id: 'timeline', label: '📊 Timeline' },
    { id: 'phases',   label: '🌱 Life Phases' },
    { id: 'dasha',    label: '⏳ Dasha Cycles' },
  ];

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <h3 style={{ color: '#A78BFA', fontSize: '1.1rem', marginBottom: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
        ✨ Karma Destiny Timeline
      </h3>

      {/* Active phase banner */}
      {activePhases.length > 0 && (
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: '1rem', padding: '0.7rem',
          background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ color: '#9CA3AF', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', width: '100%', textAlign: 'center', marginBottom: '4px' }}>
            You are currently in
          </div>
          {activePhases.map(p => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '20px',
              background: `${p.color}20`, border: `1px solid ${p.color}40`,
              color: p.color, fontSize: '12px', fontWeight: '600',
            }}>
              {p.icon} {p.name}
            </div>
          ))}
        </div>
      )}

      {/* View toggle */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.2rem', justifyContent: 'center' }}>
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            padding: '5px 14px', borderRadius: '20px', cursor: 'pointer',
            fontSize: '12px', fontWeight: '600',
            background: view === v.id ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${view === v.id ? '#7C3AED' : 'rgba(255,255,255,0.1)'}`,
            color: view === v.id ? '#E2D9F3' : '#6B7280', transition: 'all 0.2s',
          }}>{v.label}</button>
        ))}
      </div>

      {/* ── TIMELINE VIEW ── */}
      {view === 'timeline' && (
        <div>
          {/* Master timeline bar */}
          <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
            {/* Background */}
            <div style={{ height: '56px', background: 'rgba(255,255,255,0.03)', borderRadius: '28px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Life phase color bands */}
              {LIFE_PHASES.map(phase => {
                const left = (phase.ageStart / maxYears) * 100;
                const width = ((phase.ageEnd - phase.ageStart) / maxYears) * 100;
                return (
                  <div key={phase.name} style={{
                    position: 'absolute', left: `${left}%`, width: `${Math.min(width, 100 - left)}%`,
                    top: 0, bottom: 0,
                    background: `${phase.color}18`,
                    borderRight: `1px solid ${phase.color}30`,
                  }} />
                );
              })}

              {/* Dasha segments */}
              {timeline.map((item, idx) => {
                const start = (item.startAge / maxYears) * 100;
                const width = ((item.endAge - item.startAge) / maxYears) * 100;
                const isActive = item.planet === currentDasha?.planet;
                const color = getDashaColor(item.planet);
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{
                      position: 'absolute', left: `${start}%`, width: `${Math.min(width, 100 - start)}%`,
                      height: '100%',
                      background: isActive ? `linear-gradient(90deg, ${color}CC, ${color})` : `${color}50`,
                      borderRight: '1px solid rgba(0,0,0,0.4)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      opacity: hoveredIdx === idx ? 1 : isActive ? 0.9 : 0.65,
                    }}
                  >
                    {width > 7 && (
                      <span style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        fontSize: width > 11 ? '10px' : '8px', fontWeight: 'bold',
                        color: '#fff', whiteSpace: 'nowrap',
                        textShadow: '0 1px 3px rgba(0,0,0,0.9)', pointerEvents: 'none',
                      }}>
                        {width > 13 ? item.planet : item.planet.slice(0, 2)}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Current age marker */}
              {currentPct > 0 && currentPct < 100 && (
                <div style={{
                  position: 'absolute', left: `${currentPct}%`, top: 0, bottom: 0,
                  width: '2px', background: '#FBBF24', boxShadow: '0 0 8px #FBBF24', zIndex: 10,
                }}>
                  <div style={{
                    position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)',
                    background: '#FBBF24', color: '#000', fontSize: '9px', fontWeight: 'bold',
                    padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap',
                  }}>▼ NOW</div>
                </div>
              )}
            </div>

            {/* Phase icons below timeline */}
            <div style={{ position: 'relative', height: '24px', marginTop: '4px' }}>
              {LIFE_PHASES.map(phase => {
                const midPct = ((phase.ageStart + phase.ageEnd) / 2 / maxYears) * 100;
                return (
                  <div key={phase.name} style={{
                    position: 'absolute', left: `${midPct}%`, transform: 'translateX(-50%)',
                    fontSize: '14px', cursor: 'default',
                  }} title={`${phase.name} (${phase.ageStart}–${phase.ageEnd})`}>
                    {phase.icon}
                  </div>
                );
              })}
            </div>

            {/* Age labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {[0, 15, 30, 45, 60, 75, 90].map(age => (
                <span key={age} style={{ fontSize: '10px', color: '#4B5563' }}>{age}</span>
              ))}
            </div>
          </div>

          {/* Selected dasha detail */}
          {selectedIdx !== null && timeline[selectedIdx] && (
            <DetailCard item={timeline[selectedIdx]} currentDasha={currentDasha} currentAge={currentAge} />
          )}

          {/* Dasha legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '1rem' }}>
            {timeline.slice(0, 10).map((item, idx) => (
              <button key={idx} onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px', borderRadius: '20px', cursor: 'pointer',
                background: selectedIdx === idx ? getDashaColor(item.planet) + '33' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedIdx === idx ? getDashaColor(item.planet) : 'rgba(255,255,255,0.08)'}`,
                color: getDashaColor(item.planet), fontSize: '10px', fontWeight: '600',
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: getDashaColor(item.planet), display: 'inline-block', flexShrink: 0 }} />
                {item.planet} ({item.ageRange})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── LIFE PHASES VIEW ── */}
      {view === 'phases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {LIFE_PHASES.map(phase => {
            const isActive = currentAge >= phase.ageStart && currentAge <= phase.ageEnd;
            const isComplete = currentAge > phase.ageEnd;
            // Find dashas that overlap this phase
            const overlapping = timeline.filter(d => d.endAge >= phase.ageStart && d.startAge <= phase.ageEnd);

            return (
              <div key={phase.name} style={{
                background: isActive ? `${phase.color}10` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? phase.color + '35' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '12px', padding: '1rem',
                opacity: isComplete ? 0.65 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{phase.icon}</span>
                    <div>
                      <div style={{ color: isActive ? phase.color : '#D1D5DB', fontWeight: '600', fontSize: '0.92rem' }}>
                        {phase.name}
                        {isActive && <span style={{ marginLeft: '6px', background: `${phase.color}30`, color: phase.color, fontSize: '9px', padding: '1px 7px', borderRadius: '20px', fontWeight: '700' }}>CURRENT</span>}
                        {isComplete && <span style={{ marginLeft: '6px', color: '#10B981', fontSize: '11px' }}>✓</span>}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>Age {phase.ageStart}–{phase.ageEnd}</div>
                    </div>
                  </div>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.8rem', margin: '0 0 8px', lineHeight: '1.6' }}>{phase.desc}</p>
                {overlapping.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {overlapping.map(d => (
                      <span key={d.planet} style={{
                        background: `${getDashaColor(d.planet)}20`,
                        border: `1px solid ${getDashaColor(d.planet)}35`,
                        color: getDashaColor(d.planet), fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                      }}>{d.planet} Dasha</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── DASHA CYCLES VIEW ── */}
      {view === 'dasha' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {timeline.slice(0, 12).map((item, idx) => {
            const isActive = item.planet === currentDasha?.planet;
            const isComplete = currentAge > item.endAge;
            const color = getDashaColor(item.planet);
            return (
              <div key={idx} onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
                style={{
                  background: isActive ? `${color}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? color + '40' : selectedIdx === idx ? color + '30' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '10px', padding: '0.9rem',
                  cursor: 'pointer', transition: 'all 0.2s', opacity: isComplete ? 0.65 : 1,
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: isActive ? `0 0 8px ${color}` : 'none', flexShrink: 0 }} />
                    <span style={{ color: isActive ? color : '#D1D5DB', fontWeight: '600', fontSize: '0.9rem' }}>
                      {item.planet} Dasha
                    </span>
                    {isActive && <span style={{ background: `${color}25`, color, fontSize: '9px', padding: '1px 7px', borderRadius: '20px', fontWeight: '700' }}>ACTIVE</span>}
                  </div>
                  <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Age {item.ageRange} · {item.years?.toFixed(1)} yrs</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.78rem', margin: 0, lineHeight: '1.6' }}>
                  {item.theme?.slice(0, 100)}{item.theme?.length > 100 ? '...' : ''}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

function DetailCard({ item, currentDasha, currentAge }) {
  const color = getDashaColor(item.planet);
  const isActive = item.planet === currentDasha?.planet;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}12, rgba(0,0,0,0.3))`,
      border: `1px solid ${color}35`, borderRadius: '12px', padding: '1.1rem',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ color, fontWeight: '700', fontSize: '1rem' }}>{item.period}</div>
          <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Age {item.ageRange} · {item.years?.toFixed(1)} years</div>
        </div>
        {isActive && <span style={{ background: `${color}25`, color, fontSize: '10px', padding: '3px 10px', borderRadius: '20px', fontWeight: '700' }}>▶ NOW</span>}
      </div>
      <p style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: '1.7', margin: '0 0 10px' }}>{item.theme}</p>
      {item.events?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {item.events.map((ev, i) => (
            <span key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#E5E7EB', fontSize: '10px', padding: '2px 9px', borderRadius: '20px' }}>
              ~{ev.age}: {ev.event}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
