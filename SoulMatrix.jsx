import React, { useState } from 'react';

const SOUL_DIMENSIONS = [
  { key: 'pastLife', label: 'Past Life', icon: '🔮' },
  { key: 'dharma', label: 'Life Dharma', icon: '☸️' },
  { key: 'lesson', label: 'Karma Lesson', icon: '⚖️' },
  { key: 'gift', label: 'Soul Gift', icon: '✨' },
  { key: 'challenge', label: 'Soul Challenge', icon: '🌑' },
  { key: 'purpose', label: 'Life Purpose', icon: '🌟' },
];

function getSoulGift(kundali) {
  if (!kundali) return 'Your soul gifts will be revealed once your Kundali is generated.';
  const lagna = kundali.lagna?.rasiName;
  const gifts = {
    Aries: 'Courage, leadership, and the ability to initiate transformation',
    Taurus: 'Patience, sensory wisdom, and the power to create lasting beauty',
    Gemini: 'Communication, adaptability, and the gift of seeing all perspectives',
    Cancer: 'Deep empathy, nurturing energy, and psychic attunement',
    Leo: 'Creative fire, generous heart, and the ability to inspire all',
    Virgo: 'Healing power, discernment, and mastery in service to others',
    Libra: 'Diplomacy, aesthetic vision, and the power to restore balance',
    Scorpio: 'Transformation, depth, and the ability to die and be reborn',
    Sagittarius: 'Wisdom, vision, and the gift of illuminating higher truth',
    Capricorn: 'Discipline, mastery, and the power to build lasting structures',
    Aquarius: 'Innovation, humanitarian vision, and the ability to uplift humanity',
    Pisces: 'Spiritual compassion, mystical insight, and unconditional love',
  };
  return gifts[lagna] || 'A unique soul essence awaiting discovery.';
}

function getSoulChallenge(kundali) {
  if (!kundali) return 'Your soul challenges will be revealed after Kundali generation.';
  const saturnHouse = kundali.planets?.Saturn?.house;
  const challenges = [
    'Building self-worth independent of external validation',
    'Releasing material attachment and emotional hoarding',
    'Developing focused clarity amid scattered mental energy',
    'Healing deep emotional wounds and ancestral patterns',
    'Surrendering ego to serve something greater',
    'Overcoming perfectionism and accepting wholeness',
    'Making decisions and standing by authentic values',
    'Transforming fear of intimacy into deep union',
    'Grounding abstract visions into tangible reality',
    'Balancing worldly ambition with spiritual growth',
    'Connecting personal innovation to community service',
    'Maintaining healthy boundaries while remaining open',
  ];
  return challenges[(saturnHouse || 1) - 1];
}

function getLifePurpose(kundali) {
  if (!kundali) return 'Your life purpose will emerge from your Kundali data.';
  const h9 = kundali.houses?.[8]?.rasiName;
  const h1 = kundali.lagna?.rasiName;
  return `Your soul came to this life to master the integration of ${h1} consciousness through ${h9} wisdom. Your purpose is written in the stars — to become the fullest expression of your cosmic blueprint.`;
}

export default function SoulMatrix({ kundali, lifePredictions }) {
  const [activeTab, setActiveTab] = useState('pastLife');

  const soulData = {
    pastLife: kundali ? (lifePredictions?.karma?.pastLife || 'Calculating past life karma from Ketu position...') : 'Generate Kundali to reveal your past life karma.',
    dharma: kundali ? (lifePredictions?.karma?.dharma || 'Your dharmic path is being computed...') : 'Your dharma will be revealed after Kundali generation.',
    lesson: kundali ? (lifePredictions?.karma?.lesson || 'Saturn reveals your soul lesson...') : 'Saturn\'s position reveals your core life lesson.',
    gift: getSoulGift(kundali),
    challenge: getSoulChallenge(kundali),
    purpose: getLifePurpose(kundali),
  };

  const activeData = SOUL_DIMENSIONS.find(d => d.key === activeTab);

  // Soul matrix grid numbers (numerology-like)
  function getSoulNumber() {
    if (!kundali) return Array(9).fill('?');
    const planets = kundali.planets || {};
    return [
      Math.round((planets.Sun?.longitude || 0) % 9) + 1,
      Math.round((planets.Moon?.longitude || 0) % 9) + 1,
      Math.round((planets.Mars?.longitude || 0) % 9) + 1,
      Math.round((planets.Mercury?.longitude || 0) % 9) + 1,
      Math.round((planets.Jupiter?.longitude || 0) % 9) + 1,
      Math.round((planets.Venus?.longitude || 0) % 9) + 1,
      Math.round((planets.Saturn?.longitude || 0) % 9) + 1,
      Math.round((planets.Rahu?.longitude || 0) % 9) + 1,
      Math.round((planets.Ketu?.longitude || 0) % 9) + 1,
    ];
  }
  const nums = getSoulNumber();

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <h3 style={{
        color: '#A78BFA', fontSize: '1.1rem', marginBottom: '1.2rem',
        letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
      }}>
        🔮 Soul Matrix
      </h3>

      {/* 3x3 soul number grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px', marginBottom: '1.5rem', maxWidth: '220px', margin: '0 auto 1.5rem',
      }}>
        {['☉','☽','♂','☿','♃','♀','♄','☊','☋'].map((symbol, i) => (
          <div key={i} style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '8px', padding: '10px',
            textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
          }}>
            <span style={{ fontSize: '16px', color: '#A78BFA' }}>{symbol}</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#E2D9F3' }}>
              {nums[i]}
            </span>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        marginBottom: '1rem', justifyContent: 'center',
      }}>
        {SOUL_DIMENSIONS.map(dim => (
          <button
            key={dim.key}
            onClick={() => setActiveTab(dim.key)}
            style={{
              padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
              fontSize: '12px', fontWeight: '600',
              background: activeTab === dim.key ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activeTab === dim.key ? '#7C3AED' : 'rgba(255,255,255,0.1)'}`,
              color: activeTab === dim.key ? '#E2D9F3' : '#9CA3AF',
              transition: 'all 0.2s',
            }}
          >
            {dim.icon} {dim.label}
          </button>
        ))}
      </div>

      {/* Content panel */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,0,0,0.3))',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: '12px', padding: '1.2rem',
        minHeight: '100px',
        animation: 'fadeIn 0.3s ease',
        key: activeTab,
      }}>
        <div style={{ color: '#A78BFA', fontWeight: 'bold', marginBottom: '8px', fontSize: '1rem' }}>
          {activeData?.icon} {activeData?.label}
        </div>
        <p style={{
          color: '#D1D5DB', lineHeight: '1.7', fontSize: '0.9rem', margin: 0,
        }}>
          {soulData[activeTab]}
        </p>
      </div>

      {/* Nakshatra soul summary */}
      {kundali && (
        <div style={{
          marginTop: '1rem',
          padding: '0.8rem 1rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px', fontSize: '0.82rem', color: '#9CA3AF',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <strong style={{ color: '#A78BFA' }}>Soul Birth Signature:</strong>{' '}
          {kundali.lagna?.rasiName} Lagna · Moon in {kundali.planets?.Moon?.nakshatra?.name} · 
          Ketu in {kundali.planets?.Ketu?.rasiName}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: none; } }`}</style>
    </div>
  );
}
