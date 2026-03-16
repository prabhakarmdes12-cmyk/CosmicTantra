import React, { useState, useMemo, useEffect } from 'react';
import { callGuruAPI } from '../engines/guruAI.js';
import { speakText, stopSpeech } from '../engines/guruAI.js';

// ─── STATIC GUIDANCE DATA ────────────────────────────────────────────────────

const DAILY_MANTRAS = [
  { mantra: 'Om Namah Shivaya', meaning: 'I bow to Shiva — the inner Self', deity: 'Shiva', reps: 108, benefit: 'Removes ego and purifies karma' },
  { mantra: 'Om Namo Narayanaya', meaning: 'I bow to Narayana — the cosmic sustainer', deity: 'Vishnu', reps: 108, benefit: 'Brings protection and abundance' },
  { mantra: 'Om Gam Ganapataye Namaha', meaning: 'Salutations to Ganesha, remover of obstacles', deity: 'Ganesha', reps: 108, benefit: 'Clears path for new beginnings' },
  { mantra: 'Gayatri Mantra', meaning: 'We meditate on that divine light of the sun', deity: 'Surya', reps: 108, benefit: 'Awakens divine intelligence' },
  { mantra: 'Om Shreem Mahalakshmyai Namaha', meaning: 'Salutations to Mahalakshmi', deity: 'Lakshmi', reps: 108, benefit: 'Attracts wealth and grace' },
  { mantra: 'Om Dum Durgayai Namaha', meaning: 'Salutations to Durga, the protector', deity: 'Durga', reps: 108, benefit: 'Protection and fierce grace' },
  { mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah', meaning: 'Salutations to the divine Sun', deity: 'Surya', reps: 12, benefit: 'Vitality and clarity' },
];

const MEDITATION_GUIDES = [
  {
    title: 'Sunrise Pranayama',
    duration: '10 min',
    icon: '🌅',
    steps: ['Sit facing east at sunrise', 'Close eyes, spine upright', 'Breathe in for 4 counts, hold 4, out 6', 'Visualize golden solar energy filling your body', 'Repeat 21 times, then sit in stillness'],
    benefit: 'Charges solar plexus and awakens vital force',
  },
  {
    title: 'Moon Trataka',
    duration: '15 min',
    icon: '🌙',
    steps: ['At night, light a ghee lamp', 'Gaze softly at the flame without blinking', 'Hold the image when eyes water and close', 'See the flame in the space between your eyebrows', 'Rest in inner stillness'],
    benefit: 'Strengthens mind, improves focus and inner vision',
  },
  {
    title: 'Chakra Sound Healing',
    duration: '20 min',
    icon: '🔮',
    steps: ['Lie flat in shavasana', 'Chant each bija mantra 7 times: LAM, VAM, RAM, YAM, HAM, AUM, OM', 'Feel vibration at each energy center', 'End with 3 long Oms', 'Rest in silence for 5 minutes'],
    benefit: 'Balances all 7 chakras and clears energy blocks',
  },
  {
    title: 'So Hum Meditation',
    duration: '12 min',
    icon: '🕉️',
    steps: ['Sit comfortably, eyes closed', 'With each inhale, silently hear "So" (I am)', 'With each exhale, hear "Hum" (That — the universe)', 'Let the breath be natural, the mantra spontaneous', 'Rest in the space between breaths'],
    benefit: 'Dissolves separation between self and cosmos',
  },
];

const KARMA_ADVICE = [
  'Today, practice seeing the divine in every person you meet. Every soul is a face of Brahman.',
  'Release one expectation today. True karma yoga is action without attachment to outcome.',
  'Whatever comes to you today — pleasant or difficult — receive it as prasad from the cosmos.',
  'Before reacting, pause for one breath. In that pause, your karma is transformed.',
  'Do one act of anonymous service today. The universe notices what the ego does not claim.',
  'Your thoughts are seeds. Plant only what you wish to harvest in the garden of your life.',
  'The situation that most challenges you holds your greatest lesson. Bow to it with gratitude.',
];

// ─── SEED-BASED DAILY SELECTION ───────────────────────────────────────────────

function getDailySeed(date) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function seededPick(array, seed, offset = 0) {
  return array[Math.abs(seed * (offset + 1) * 6271) % array.length];
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DailyGuidance({ kundali, panchang, language = 'en' }) {
  const [activeTab, setActiveTab] = useState('guidance');
  const [aiGuidance, setAiGuidance] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [meditationStep, setMeditationStep] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const today = new Date();
  const seed = getDailySeed(today);
  const dailyMantra = seededPick(DAILY_MANTRAS, seed, 0);
  const dailyMeditation = seededPick(MEDITATION_GUIDES, seed, 1);
  const dailyKarmaAdvice = seededPick(KARMA_ADVICE, seed, 2);

  // Meditation timer
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  async function generateAIGuidance() {
    setAiLoading(true);
    const todayStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    const panchangContext = panchang
      ? `Today is ${todayStr}. Tithi: ${panchang.tithi.name} (${panchang.tithi.meaning}). Nakshatra: ${panchang.nakshatra.name}. Yoga: ${panchang.yoga.name}. Vara: ${panchang.vara.day} ruled by ${panchang.vara.planet}.`
      : `Today is ${todayStr}.`;
    const kundaliContext = kundali
      ? `My Lagna is ${kundali.lagna.rasiName} and Moon is in ${kundali.planets.Moon.nakshatra?.name} Nakshatra.`
      : '';

    const res = await callGuruAPI([{
      role: 'user',
      content: `${panchangContext} ${kundaliContext} Please give me today's cosmic guidance in a beautiful Vedantic tone. Include: 1) Overall energy for the day (2 sentences), 2) One key spiritual insight (2 sentences), 3) One practical karma action for today (1 sentence). Keep it mystical, uplifting and concise.`
    }], language, kundali);

    setAiGuidance(res.message);
    setAiLoading(false);
  }

  function toggleSpeak(text) {
    if (speaking) { stopSpeech(); setSpeaking(false); }
    else { speakText(text, language); setSpeaking(true); setTimeout(() => setSpeaking(false), 12000); }
  }

  const TABS = [
    { id: 'guidance',  label: '🌟 Guidance' },
    { id: 'mantra',    label: '📿 Mantra' },
    { id: 'meditation',label: '🧘 Meditation' },
    { id: 'karma',     label: '⚖️ Karma' },
  ];

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <h3 style={{ color: '#A78BFA', fontSize: '1.1rem', marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
        🌅 Daily Cosmic Guidance
      </h3>
      <div style={{ color: '#6B7280', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1.2rem' }}>
        {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>

      {/* Panchang summary strip */}
      {panchang && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.2rem' }}>
          {[
            { icon: '🌙', val: panchang.tithi.name },
            { icon: '⭐', val: panchang.nakshatra.name },
            { icon: '☯️', val: panchang.yoga.name },
            { icon: panchang.moonPhase.icon, val: panchang.moonPhase.name.split('(')[0].trim() },
          ].map(item => (
            <span key={item.val} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#A78BFA', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>
              {item.icon} {item.val}
            </span>
          ))}
        </div>
      )}

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
            fontSize: '12px', fontWeight: '600',
            background: activeTab === t.id ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${activeTab === t.id ? '#7C3AED' : 'rgba(255,255,255,0.1)'}`,
            color: activeTab === t.id ? '#E2D9F3' : '#6B7280', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── GUIDANCE TAB ── */}
      {activeTab === 'guidance' && (
        <div>
          {/* Static panchang guidance */}
          {panchang && (
            <div style={{ marginBottom: '1rem' }}>
              {[
                { color: '#7C3AED', icon: '🌌', label: 'Cosmic Energy', text: panchang.guidance.overall },
                { color: '#F59E0B', icon: '⭐', label: 'Nakshatra Wisdom', text: panchang.guidance.nakshatra },
                { color: '#10B981', icon: '🙏', label: 'Daily Remedy', text: panchang.guidance.remedy },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: '8px', background: `${item.color}10`, border: `1px solid ${item.color}25`, borderRadius: '10px', padding: '0.8rem', borderLeft: `3px solid ${item.color}` }}>
                  <div style={{ color: item.color, fontWeight: '700', fontSize: '11px', letterSpacing: '0.08em', marginBottom: '4px' }}>{item.icon} {item.label}</div>
                  <p style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: '1.65', margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* AI Guidance */}
          <div style={{ marginBottom: '1rem' }}>
            {!aiGuidance ? (
              <button onClick={generateAIGuidance} disabled={aiLoading} style={{
                width: '100%', padding: '11px',
                background: aiLoading ? 'rgba(124,58,237,0.2)' : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                border: '1px solid rgba(124,58,237,0.4)', borderRadius: '12px',
                cursor: aiLoading ? 'wait' : 'pointer', color: '#fff',
                fontSize: '0.9rem', fontWeight: '600',
                boxShadow: '0 4px 20px rgba(124,58,237,0.2)',
              }}>
                {aiLoading ? '🧘 Guru is channeling today\'s wisdom...' : '✨ Get Personalized AI Guidance for Today'}
              </button>
            ) : (
              <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '12px', padding: '1rem', animation: 'fadeIn 0.4s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ color: '#A78BFA', fontWeight: '700', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    🧘 Guru Jyotishdev Speaks
                  </div>
                  <button onClick={() => toggleSpeak(aiGuidance)} style={{ background: speaking ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)', border: 'none', color: '#A78BFA', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', cursor: 'pointer' }}>
                    {speaking ? '⏹ Stop' : '🔊 Speak'}
                  </button>
                </div>
                <p style={{ color: '#E2D9F3', fontSize: '0.88rem', lineHeight: '1.75', margin: '0 0 8px', whiteSpace: 'pre-wrap' }}>{aiGuidance}</p>
                <button onClick={() => { setAiGuidance(''); }} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '11px', cursor: 'pointer', padding: 0 }}>
                  ↺ Refresh
                </button>
              </div>
            )}
          </div>

          {/* Muhurtas */}
          {panchang?.muhurtas && (
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>✨ Auspicious Windows</div>
              {panchang.muhurtas.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#FBBF24', fontSize: '12px', flexShrink: 0 }}>✨</span>
                  <span style={{ color: '#D1D5DB', fontSize: '0.82rem', lineHeight: '1.5' }}>{m}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MANTRA TAB ── */}
      {activeTab === 'mantra' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📿</div>
            <div style={{ color: '#9CA3AF', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Today's Sacred Mantra
            </div>
            <div style={{ fontFamily: 'Cinzel, serif', color: '#A78BFA', fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>
              {dailyMantra.mantra}
            </div>
            <div style={{ color: '#6B7280', fontSize: '0.82rem', fontStyle: 'italic', marginBottom: '12px' }}>
              "{dailyMantra.meaning}"
            </div>
            <div style={{ display: 'inline-flex', gap: '12px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '20px', padding: '5px 16px' }}>
              <span style={{ color: '#A78BFA', fontSize: '12px' }}>🙏 Deity: {dailyMantra.deity}</span>
              <span style={{ color: '#A78BFA', fontSize: '12px' }}>📿 {dailyMantra.reps}× repetitions</span>
            </div>
          </div>

          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#F59E0B', fontSize: '11px', fontWeight: '700', marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Benefit</div>
            <p style={{ color: '#D1D5DB', fontSize: '0.88rem', margin: 0 }}>{dailyMantra.benefit}</p>
          </div>

          {/* All mantras */}
          <div style={{ color: '#9CA3AF', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Other Daily Mantras</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {DAILY_MANTRAS.filter(m => m.mantra !== dailyMantra.mantra).map(m => (
              <div key={m.mantra} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '8px 12px' }}>
                <div style={{ color: '#D1D5DB', fontSize: '0.83rem', fontWeight: '600' }}>{m.mantra}</div>
                <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>{m.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MEDITATION TAB ── */}
      {activeTab === 'meditation' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(0,0,0,0.4))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '14px', padding: '1.2rem', marginBottom: '1.2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>{dailyMeditation.icon}</div>
              <div style={{ color: '#A78BFA', fontFamily: 'Cinzel, serif', fontSize: '1.05rem', fontWeight: '600' }}>
                {dailyMeditation.title}
              </div>
              <div style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '3px' }}>
                ⏱️ {dailyMeditation.duration} · {dailyMeditation.benefit}
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dailyMeditation.steps.map((step, i) => (
                <div key={i} onClick={() => setMeditationStep(i)}
                  style={{ display: 'flex', gap: '10px', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', background: meditationStep === i ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${meditationStep === i ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.2s' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: meditationStep === i ? '#7C3AED' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: meditationStep === i ? '#fff' : '#6B7280', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ color: meditationStep === i ? '#E2D9F3' : '#9CA3AF', fontSize: '0.83rem', lineHeight: '1.5' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: '2.2rem', fontFamily: 'Cinzel, serif', color: '#A78BFA', marginBottom: '8px', letterSpacing: '0.05em' }}>
              {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={() => setTimerActive(!timerActive)} style={{ padding: '7px 20px', borderRadius: '20px', cursor: 'pointer', background: timerActive ? 'rgba(239,68,68,0.2)' : 'rgba(124,58,237,0.3)', border: `1px solid ${timerActive ? '#EF4444' : '#7C3AED'}`, color: timerActive ? '#FCA5A5' : '#E2D9F3', fontSize: '13px', fontWeight: '600' }}>
                {timerActive ? '⏸ Pause' : timerSeconds > 0 ? '▶ Resume' : '▶ Start'}
              </button>
              <button onClick={() => { setTimerActive(false); setTimerSeconds(0); }} style={{ padding: '7px 14px', borderRadius: '20px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#6B7280', fontSize: '13px' }}>
                ↺ Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── KARMA TAB ── */}
      {activeTab === 'karma' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>⚖️</div>
            <div style={{ color: '#9CA3AF', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Today's Karma Advice
            </div>
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '14px', padding: '1.2rem', textAlign: 'left' }}>
              <p style={{ color: '#E2D9F3', fontSize: '1rem', lineHeight: '1.8', margin: 0, fontStyle: 'italic' }}>
                "{dailyKarmaAdvice}"
              </p>
            </div>
          </div>

          {/* All karma principles */}
          <div style={{ color: '#9CA3AF', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Universal Karma Laws
          </div>
          {KARMA_ADVICE.map((advice, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '8px', marginBottom: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#F59E0B', fontSize: '12px', flexShrink: 0, paddingTop: '2px' }}>☸️</span>
              <p style={{ color: '#9CA3AF', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>{advice}</p>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}
