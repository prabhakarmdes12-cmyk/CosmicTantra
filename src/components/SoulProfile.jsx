import React, { useState, useRef } from 'react';
import { RASIS } from '../engines/astrologyEngine.js';

const EVOLUTION_STAGES = [
  { stage: 1, name: 'Infant Soul',    icon: '🌱', desc: 'First steps on the cosmic path. Learning physical existence.' },
  { stage: 2, name: 'Baby Soul',      icon: '🌿', desc: 'Building structure, rules, and belonging.' },
  { stage: 3, name: 'Young Soul',     icon: '🌳', desc: 'Conquering the material world with ambition.' },
  { stage: 4, name: 'Mature Soul',    icon: '🌸', desc: 'Emotional depth, relationships, empathy.' },
  { stage: 5, name: 'Old Soul',       icon: '🌌', desc: 'Seeking meaning, wisdom and liberation.' },
  { stage: 6, name: 'Transcendent',   icon: '⭐', desc: 'Beyond the wheel — a teacher among souls.' },
];

const SOUL_MISSIONS = {
  Aries: 'To lead with courage and ignite the divine spark in others',
  Taurus: 'To anchor beauty and abundance into the physical world',
  Gemini: 'To bridge worlds through the sacred power of communication',
  Cancer: 'To heal others through unconditional nurturing and emotional wisdom',
  Leo: 'To radiate the creative fire of the divine Self',
  Virgo: 'To serve with sacred precision and heal through discernment',
  Libra: 'To restore cosmic balance and manifest divine harmony',
  Scorpio: 'To dive into the depths and resurrect what must be transformed',
  Sagittarius: 'To illuminate the path of wisdom and higher truth',
  Capricorn: 'To build lasting spiritual structures that serve humanity',
  Aquarius: 'To usher in new consciousness and liberate collective humanity',
  Pisces: 'To dissolve boundaries and embody universal compassion',
};

const KARMIC_DEBT_BY_HOUSE = [
  'Learning self-worth beyond appearance',
  'Releasing attachment to possessions',
  'Overcoming scattered focus and indecision',
  'Healing family and ancestral patterns',
  'Surrendering the need for constant validation',
  'Moving beyond perfectionism and self-criticism',
  'Choosing authentic partnerships over comfort',
  'Releasing fear of depth and transformation',
  'Grounding spiritual wisdom into daily life',
  'Balancing ambition with inner purpose',
  'Connecting community vision to personal heart',
  'Establishing healthy boundaries while remaining open',
];

function getSoulEvolutionStage(kundali) {
  if (!kundali) return 3;
  const ketuHouse = kundali.planets?.Ketu?.house || 1;
  const saturnHouse = kundali.planets?.Saturn?.house || 1;
  // Old souls have Ketu in moksha houses (4,8,12) and Saturn in spiritual houses
  if ([8,12].includes(ketuHouse) && [9,12].includes(saturnHouse)) return 5;
  if ([4,12].includes(ketuHouse)) return 4;
  if (ketuHouse === 1 || ketuHouse === 10) return 3;
  return 3;
}

function StatBar({ label, value, color, icon }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ color: '#9CA3AF', fontSize: '11px' }}>{icon} {label}</span>
        <span style={{ color, fontSize: '11px', fontWeight: '700' }}>{value}%</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          width: `${value}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}66, ${color})`,
          borderRadius: '3px', transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

export default function SoulProfile({ kundali, lifePredictions, dashas, name = 'Cosmic Seeker' }) {
  const [activeCard, setActiveCard] = useState('identity');
  const cardRef = useRef();

  if (!kundali) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,0,0,0.5))',
        border: '1px solid rgba(124,58,237,0.2)', borderRadius: '16px',
        padding: '3rem', textAlign: 'center', fontFamily: 'Georgia, serif',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔮</div>
        <div style={{ color: '#A78BFA', fontSize: '1.2rem', fontFamily: 'Cinzel, serif', marginBottom: '8px' }}>
          Your Soul Profile Awaits
        </div>
        <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>
          Generate your Kundali to unlock your mystical Soul Profile — your cosmic identity card across lifetimes.
        </p>
      </div>
    );
  }

  const lagna = kundali.lagna;
  const moon = kundali.planets.Moon;
  const sun = kundali.planets.Sun;
  const ketu = kundali.planets.Ketu;
  const saturn = kundali.planets.Saturn;
  const jupiter = kundali.planets.Jupiter;

  const evolutionStage = getSoulEvolutionStage(kundali);
  const evoData = EVOLUTION_STAGES[evolutionStage - 1];
  const soulMission = SOUL_MISSIONS[lagna.rasiName] || 'To fulfill your unique cosmic dharma';
  const karmaDebt = KARMIC_DEBT_BY_HOUSE[(saturn?.house || 1) - 1];

  // Soul scores
  const spiritualScore = Math.min(95, 40 + (ketu?.house === 12 ? 30 : ketu?.house === 8 ? 20 : 10) + (jupiter?.status === 'Exalted' ? 20 : 0));
  const karmicScore = Math.min(95, 50 + (saturn?.status === 'Exalted' ? 30 : saturn?.status === 'Debilitated' ? 5 : 15));
  const loveScore = Math.min(95, 45 + (kundali.planets.Venus?.status === 'Exalted' ? 35 : 15));
  const wealthScore = lifePredictions?.wealth?.score || 50;
  const dharmaScore = Math.min(95, 50 + (jupiter?.house === 9 || jupiter?.house === 1 ? 30 : 15));

  const TABS = [
    { id: 'identity', label: '🪬 Identity' },
    { id: 'mission',  label: '☸️ Mission' },
    { id: 'karma',    label: '⚖️ Karma' },
    { id: 'evolution',label: '🌌 Evolution' },
  ];

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {/* Mystical header card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(245,158,11,0.08), rgba(0,0,0,0.5))',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: '20px', padding: '1.5rem',
        marginBottom: '1.2rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Cosmic background dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 17) % 100}%`, top: `${(i * 23) % 100}%`,
            width: `${1 + (i % 2)}px`, height: `${1 + (i % 2)}px`,
            background: '#fff', borderRadius: '50%', opacity: 0.12,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 0 24px rgba(124,58,237,0.4), 0 0 8px rgba(245,158,11,0.2)',
            border: '2px solid rgba(255,255,255,0.15)',
          }}>
            🧘
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ color: '#6B7280', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3px' }}>
              Cosmic Identity
            </div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem', fontWeight: '700', color: '#E2D9F3', marginBottom: '3px' }}>
              {name}
            </div>
            <div style={{ color: '#A78BFA', fontSize: '0.88rem' }}>
              {lagna.rasiName} Lagna · {moon.nakshatra?.name} Moon
            </div>
            <div style={{ color: '#6B7280', fontSize: '0.78rem', marginTop: '3px' }}>
              Sun in {sun.rasiName} · Ketu in {ketu?.rasiName}
            </div>
          </div>

          {/* Evolution badge */}
          <div style={{
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '12px', padding: '10px 14px', textAlign: 'center',
            minWidth: '100px',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '2px' }}>{evoData.icon}</div>
            <div style={{ color: '#A78BFA', fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em' }}>
              {evoData.name}
            </div>
            <div style={{ color: '#6B7280', fontSize: '9px' }}>
              Stage {evolutionStage} of 6
            </div>
          </div>
        </div>

        {/* Soul stats */}
        <div style={{ marginTop: '1.2rem' }}>
          <StatBar label="Spiritual Quotient" value={spiritualScore} color="#8B5CF6" icon="🕉️" />
          <StatBar label="Karmic Balance" value={karmicScore} color="#F59E0B" icon="⚖️" />
          <StatBar label="Dharmic Alignment" value={dharmaScore} color="#10B981" icon="☸️" />
          <StatBar label="Love Karma" value={loveScore} color="#EC4899" icon="❤️" />
          <StatBar label="Wealth Destiny" value={wealthScore} color="#3B82F6" icon="💰" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveCard(t.id)} style={{
            padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
            fontSize: '12px', fontWeight: '600', transition: 'all 0.2s',
            background: activeCard === t.id ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${activeCard === t.id ? '#7C3AED' : 'rgba(255,255,255,0.1)'}`,
            color: activeCard === t.id ? '#E2D9F3' : '#6B7280',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div ref={cardRef} style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,58,237,0.18)',
        borderRadius: '14px', padding: '1.2rem', animation: 'fadeIn 0.3s ease',
        key: activeCard,
      }}>

        {/* IDENTITY TAB */}
        {activeCard === 'identity' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {[
                { label: 'Lagna',          value: lagna.rasiName,          sub: `${lagna.degreeInRasi?.toFixed(1)}° in sign`,  icon: '⬆️' },
                { label: 'Moon Nakshatra', value: moon.nakshatra?.name,    sub: `Pada ${moon.nakshatra?.pada} · ${moon.nakshatra?.ruler}`,  icon: '🌙' },
                { label: 'Sun Sign',       value: sun.rasiName,            sub: `House ${sun.house}`,                          icon: '☀️' },
                { label: 'Atmakaraka',     value: getAtmakaraka(kundali),  sub: 'Soul planet',                                  icon: '🪬' },
                { label: 'Past Life',      value: ketu?.rasiName,          sub: `House ${ketu?.house} · Soul origin`,           icon: '🔮' },
                { label: 'Future Path',    value: kundali.planets.Rahu?.rasiName, sub: `House ${kundali.planets.Rahu?.house}`,  icon: '🌅' },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)',
                  borderRadius: '10px', padding: '0.8rem',
                }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                  <div style={{ color: '#6B7280', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ color: '#E2D9F3', fontWeight: '700', fontSize: '0.9rem', marginTop: '2px' }}>{item.value || '—'}</div>
                  <div style={{ color: '#6B7280', fontSize: '0.72rem', marginTop: '2px' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MISSION TAB */}
        {activeCard === 'mission' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🌟</div>
              <div style={{ color: '#A78BFA', fontFamily: 'Cinzel, serif', fontSize: '1rem', marginBottom: '8px' }}>
                Your Soul Mission
              </div>
              <p style={{
                color: '#E2D9F3', fontSize: '1.05rem', lineHeight: '1.8',
                fontStyle: 'italic', margin: '0 auto', maxWidth: '400px',
                padding: '1rem', background: 'rgba(124,58,237,0.1)',
                borderRadius: '12px', border: '1px solid rgba(124,58,237,0.2)',
              }}>
                "{soulMission}"
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Primary Dharma', value: lifePredictions?.career?.field?.split(',')[0] || lagna.rasiName + ' path', icon: '☸️', color: '#A78BFA' },
                { label: 'Soul Element',   value: getSoulElement(lagna.rasiName),  icon: '🔥', color: '#F59E0B' },
                { label: 'Life Theme',     value: getLifeTheme(lagna.rasiName),    icon: '🌊', color: '#22D3EE' },
                { label: 'Sacred Lesson',  value: lifePredictions?.karma?.lesson || karmaDebt.slice(0,30), icon: '📿', color: '#10B981' },
              ].map(item => (
                <div key={item.label} style={{ background: `${item.color}10`, border: `1px solid ${item.color}25`, borderRadius: '10px', padding: '0.8rem' }}>
                  <div style={{ fontSize: '16px', marginBottom: '3px' }}>{item.icon}</div>
                  <div style={{ color: '#6B7280', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</div>
                  <div style={{ color: item.color, fontWeight: '600', fontSize: '0.82rem', marginTop: '3px' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KARMA TAB */}
        {activeCard === 'karma' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#F59E0B', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                ⚖️ Primary Karmic Debt
              </div>
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '0.9rem' }}>
                <p style={{ color: '#D1D5DB', fontSize: '0.88rem', lineHeight: '1.7', margin: 0 }}>
                  {karmaDebt}
                </p>
                <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '6px' }}>
                  Saturn in House {saturn?.house || '?'} — This is your soul's primary lesson
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#8B5CF6', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                🔮 Past Life Origin (Ketu)
              </div>
              <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', padding: '0.9rem' }}>
                <p style={{ color: '#D1D5DB', fontSize: '0.88rem', lineHeight: '1.7', margin: 0 }}>
                  {lifePredictions?.karma?.pastLife || `Ketu in ${ketu?.rasiName} (House ${ketu?.house}) reveals a soul who mastered ${ketu?.rasiName} energy in past lives.`}
                </p>
              </div>
            </div>

            <div>
              <div style={{ color: '#22D3EE', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                🌅 Current Life Direction (Rahu)
              </div>
              <div style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '10px', padding: '0.9rem' }}>
                <p style={{ color: '#D1D5DB', fontSize: '0.88rem', lineHeight: '1.7', margin: 0 }}>
                  Rahu in {kundali.planets.Rahu?.rasiName} (House {kundali.planets.Rahu?.house}) marks the frontier your soul is evolving toward. Embrace this unfamiliar territory — it is your dharmic destiny.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EVOLUTION TAB */}
        {activeCard === 'evolution' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {EVOLUTION_STAGES.map((stage, i) => {
                const isActive = stage.stage === evolutionStage;
                const isPast = stage.stage < evolutionStage;
                return (
                  <div key={stage.stage} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', borderRadius: '10px',
                    background: isActive ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    opacity: isPast ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{stage.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: isActive ? '#E2D9F3' : '#9CA3AF', fontWeight: isActive ? '700' : '400', fontSize: '0.88rem' }}>
                          {stage.name}
                        </span>
                        {isActive && (
                          <span style={{ background: 'rgba(124,58,237,0.3)', color: '#A78BFA', fontSize: '9px', padding: '2px 8px', borderRadius: '20px', fontWeight: '700' }}>
                            ← YOUR STAGE
                          </span>
                        )}
                        {isPast && <span style={{ color: '#10B981', fontSize: '12px' }}>✓</span>}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '2px' }}>{stage.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(124,58,237,0.08)', borderRadius: '10px', border: '1px solid rgba(124,58,237,0.18)' }}>
              <p style={{ color: '#D1D5DB', fontSize: '0.83rem', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                "{evoData.desc} Your {lagna.rasiName} rising gives you a unique lens through which this stage unfolds with particular grace."
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

function getAtmakaraka(kundali) {
  // Atmakaraka = planet with highest degree in sign
  const planets = kundali?.planets;
  if (!planets) return '—';
  let max = -1, atma = '—';
  for (const [name, p] of Object.entries(planets)) {
    if (name === 'Rahu' || name === 'Ketu') continue;
    if ((p.degreeInRasi || 0) > max) { max = p.degreeInRasi; atma = name; }
  }
  return atma;
}

function getSoulElement(lagnaSign) {
  const fire = ['Aries','Leo','Sagittarius'];
  const earth = ['Taurus','Virgo','Capricorn'];
  const air = ['Gemini','Libra','Aquarius'];
  const water = ['Cancer','Scorpio','Pisces'];
  if (fire.includes(lagnaSign)) return '🔥 Fire — Agni';
  if (earth.includes(lagnaSign)) return '🌍 Earth — Prithvi';
  if (air.includes(lagnaSign)) return '💨 Air — Vayu';
  if (water.includes(lagnaSign)) return '🌊 Water — Jala';
  return 'Ether — Akasha';
}

function getLifeTheme(lagnaSign) {
  const themes = {
    Aries:'Courage & Initiation', Taurus:'Beauty & Abundance',
    Gemini:'Knowledge & Connection', Cancer:'Healing & Nurturing',
    Leo:'Creativity & Self-Expression', Virgo:'Service & Mastery',
    Libra:'Balance & Harmony', Scorpio:'Transformation & Depth',
    Sagittarius:'Wisdom & Expansion', Capricorn:'Mastery & Legacy',
    Aquarius:'Liberation & Vision', Pisces:'Compassion & Transcendence',
  };
  return themes[lagnaSign] || 'Cosmic Unfolding';
}
