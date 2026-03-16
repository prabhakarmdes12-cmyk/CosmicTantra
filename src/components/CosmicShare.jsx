import React, { useRef, useState } from 'react';
import { getDashaColor } from '../engines/dashaEngine.js';

const SIGN_ICONS = { Aries:'♈',Taurus:'♉',Gemini:'♊',Cancer:'♋',Leo:'♌',Virgo:'♍',Libra:'♎',Scorpio:'♏',Sagittarius:'♐',Capricorn:'♑',Aquarius:'♒',Pisces:'♓' };

// ─── SHAREABLE CARD CANVAS ─────────────────────────────────────────────────────
function ShareCard({ kundali, currentDasha, lifePredictions, panchang, name, cardRef }) {
  if (!kundali) return null;
  const lagna = kundali.lagna;
  const moon  = kundali.planets.Moon;
  const sun   = kundali.planets.Sun;
  const dashaColor = currentDasha ? getDashaColor(currentDasha.planet) : '#7C3AED';

  return (
    <div ref={cardRef} id="cosmic-share-card" style={{
      width: '400px', minHeight: '680px',
      background: 'linear-gradient(160deg, #030108 0%, #0D0A2E 40%, #1A0A3C 100%)',
      borderRadius: '20px', overflow: 'hidden', position: 'relative',
      fontFamily: 'Georgia, serif',
      border: '1px solid rgba(124,58,237,0.4)',
      boxShadow: '0 0 60px rgba(124,58,237,0.3)',
    }}>
      {/* Cosmic star field */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{
          position:'absolute',
          left: `${(i * 19 + 7) % 100}%`, top: `${(i * 23 + 11) % 100}%`,
          width: `${1 + (i % 2)}px`, height: `${1 + (i % 2)}px`,
          background: '#fff', borderRadius: '50%', opacity: 0.15 + (i % 5) * 0.05,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Top accent bar */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, #7C3AED, ${dashaColor}, #F59E0B)` }} />

      {/* Header */}
      <div style={{ padding: '1.5rem 1.5rem 0', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🕉️</div>
        <div style={{ color: '#6B7280', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '2px' }}>
          CosmicTantra · Vedic Soul Profile
        </div>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.5rem', fontWeight: '700', color: '#E2D9F3', marginBottom: '2px' }}>
          {name || 'Cosmic Seeker'}
        </div>
        <div style={{ color: '#A78BFA', fontSize: '0.85rem' }}>
          {SIGN_ICONS[lagna.rasiName]} {lagna.rasiName} Rising · {SIGN_ICONS[moon.rasiName]} Moon in {moon.rasiName}
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '1rem 1.5rem', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }} />

      {/* Planet grid */}
      <div style={{ padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1rem' }}>
        {Object.entries(kundali.planets).map(([pName, p]) => (
          <div key={pName} style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '8px',
            border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center',
          }}>
            <div style={{ color: getPlanetColor(pName), fontSize: '10px', fontWeight: '700' }}>{pName}</div>
            <div style={{ color: '#D1D5DB', fontSize: '11px', fontWeight: '600' }}>{SIGN_ICONS[p.rasiName]} {p.rasiName?.slice(0,3)}</div>
            <div style={{ color: '#6B7280', fontSize: '9px' }}>H{p.house}</div>
          </div>
        ))}
      </div>

      {/* Current Dasha */}
      {currentDasha && (
        <div style={{ margin: '0 1.5rem 1rem', padding: '0.75rem 1rem', borderRadius: '12px', background: `${dashaColor}18`, border: `1px solid ${dashaColor}35` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Current Dasha</div>
              <div style={{ color: dashaColor, fontWeight: '700', fontSize: '1rem' }}>{currentDasha.planet} Mahadasha</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#9CA3AF', fontSize: '9px' }}>Complete</div>
              <div style={{ color: dashaColor, fontWeight: '700', fontSize: '1.1rem' }}>{currentDasha.percentDone}%</div>
            </div>
          </div>
          <div style={{ marginTop: '6px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${currentDasha.percentDone}%`, height: '100%', background: dashaColor, borderRadius: '2px' }} />
          </div>
        </div>
      )}

      {/* Life predictions */}
      {lifePredictions && (
        <div style={{ margin: '0 1.5rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Career', value: lifePredictions.career?.field?.split(',')[0], icon: '💼', color: '#3B82F6' },
            { label: 'Wealth', value: `${lifePredictions.wealth?.score}% potential`, icon: '💰', color: '#10B981' },
            { label: 'Partner', value: lifePredictions.love?.partner?.split(',')[0], icon: '❤️', color: '#EC4899' },
            { label: 'Karma',  value: lifePredictions.karma?.lesson?.slice(0, 22), icon: '☸️', color: '#8B5CF6' },
          ].map(item => (
            <div key={item.label} style={{ background: `${item.color}10`, border: `1px solid ${item.color}22`, borderRadius: '8px', padding: '6px 8px' }}>
              <div style={{ color: '#6B7280', fontSize: '9px' }}>{item.icon} {item.label}</div>
              <div style={{ color: item.color, fontSize: '10px', fontWeight: '600', marginTop: '2px' }}>{item.value || '—'}</div>
            </div>
          ))}
        </div>
      )}

      {/* Nakshatra */}
      <div style={{ margin: '0 1.5rem 1rem', padding: '0.7rem 1rem', borderRadius: '10px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', textAlign: 'center' }}>
        <div style={{ color: '#9CA3AF', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>Birth Nakshatra</div>
        <div style={{ color: '#A78BFA', fontWeight: '700', fontSize: '1rem' }}>🌙 {moon.nakshatra?.name}</div>
        <div style={{ color: '#6B7280', fontSize: '9px' }}>Pada {moon.nakshatra?.pada} · Ruled by {moon.nakshatra?.ruler}</div>
      </div>

      {/* Today's panchang snippet */}
      {panchang && (
        <div style={{ margin: '0 1.5rem 1rem', padding: '0.7rem 1rem', borderRadius: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ color: '#9CA3AF', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Today's Cosmic Alignment</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Tithi', val: panchang.tithi.name },
              { label: 'Nakshatra', val: panchang.nakshatra.name },
              { label: 'Yoga', val: panchang.yoga.name },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#F59E0B', fontSize: '10px', fontWeight: '600' }}>{item.val}</div>
                <div style={{ color: '#6B7280', fontSize: '8px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '0.8rem 1.5rem 1.2rem', textAlign: 'center' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)', marginBottom: '0.7rem' }} />
        <div style={{ color: '#4B5563', fontSize: '9px', letterSpacing: '0.15em' }}>
          🌐 cosmic-tantra.vercel.app · Generated {new Date().toLocaleDateString('en-IN')}
        </div>
        <div style={{ color: '#374151', fontSize: '8px', marginTop: '3px' }}>
          🕉️ Hari Om · Vedic Astrology AI Platform
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CosmicShare({ kundali, currentDasha, lifePredictions, panchang, name }) {
  const cardRef = useRef();
  const [status, setStatus] = useState(null);
  const [showCard, setShowCard] = useState(false);

  if (!kundali) return null;

  async function downloadImage() {
    setStatus('generating');
    try {
      const mod = await import('html2canvas');
      const html2canvas = mod.default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#030108',
        scale: 2.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      const link = document.createElement('a');
      link.download = `CosmicTantra_${(name || 'Soul').replace(/\s+/g,'_')}_${new Date().toLocaleDateString('en-IN').replace(/\//g,'-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setStatus('done');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('Image export error:', err);
      setStatus('error');
      setTimeout(() => setStatus(null), 3000);
    }
  }

  async function shareWhatsApp() {
    const text = `🕉️ My Vedic Soul Profile from CosmicTantra\n\n` +
      `✨ ${name || 'Cosmic Seeker'}\n` +
      `🌟 ${kundali.lagna.rasiName} Lagna\n` +
      `🌙 Moon in ${kundali.planets.Moon.nakshatra?.name} Nakshatra\n` +
      `⏳ ${currentDasha?.planet || '?'} Dasha (${currentDasha?.percentDone || 0}% complete)\n\n` +
      `Discover your cosmic blueprint at:\n` +
      `🌐 cosmic-tantra.vercel.app\n\n` +
      `#CosmicTantra #VedicAstrology #Jyotish #KundaliAI`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  async function shareInstagram() {
    // Download image first, then prompt to share
    await downloadImage();
    setStatus('instagram');
    setTimeout(() => setStatus(null), 5000);
  }

  async function copyLink() {
    await navigator.clipboard.writeText('https://cosmic-tantra.vercel.app').catch(() => {});
    setStatus('copied');
    setTimeout(() => setStatus(null), 2500);
  }

  const btnStyle = (color, bg) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '9px 16px', borderRadius: '20px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600', border: `1px solid ${color}`,
    background: bg, color: '#E2D9F3', transition: 'all 0.2s', flex: 1,
    minWidth: '120px',
  });

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <h3 style={{ color: '#A78BFA', fontSize: '1.1rem', marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
        ✨ Share Your Cosmic Identity
      </h3>
      <p style={{ color: '#6B7280', fontSize: '0.82rem', textAlign: 'center', marginBottom: '1.2rem' }}>
        Share your mystical soul profile with the world
      </p>

      {/* Preview toggle */}
      <button onClick={() => setShowCard(!showCard)} style={{
        display: 'block', margin: '0 auto 1rem',
        padding: '6px 18px', borderRadius: '20px', cursor: 'pointer',
        background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
        color: '#A78BFA', fontSize: '12px', fontWeight: '600',
      }}>
        {showCard ? '🙈 Hide Preview' : '👁️ Preview Card'}
      </button>

      {/* Card preview */}
      {showCard && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem', overflowX: 'auto' }}>
          <ShareCard
            cardRef={cardRef} kundali={kundali} currentDasha={currentDasha}
            lifePredictions={lifePredictions} panchang={panchang} name={name}
          />
        </div>
      )}

      {/* Hidden card for export (always in DOM) */}
      {!showCard && (
        <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
          <ShareCard
            cardRef={cardRef} kundali={kundali} currentDasha={currentDasha}
            lifePredictions={lifePredictions} panchang={panchang} name={name}
          />
        </div>
      )}

      {/* Status message */}
      {status === 'instagram' && (
        <div style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '0.8rem', textAlign: 'center', fontSize: '0.82rem', color: '#F9A8D4' }}>
          📱 Image saved! Open Instagram → New Post → Select downloaded image
        </div>
      )}
      {status === 'done' && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '0.8rem', textAlign: 'center', fontSize: '0.82rem', color: '#6EE7B7' }}>
          ✅ Image downloaded successfully!
        </div>
      )}
      {status === 'copied' && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '0.8rem', textAlign: 'center', fontSize: '0.82rem', color: '#6EE7B7' }}>
          ✅ Link copied to clipboard!
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        <button onClick={downloadImage} disabled={status === 'generating'} style={btnStyle('rgba(124,58,237,0.4)', 'rgba(124,58,237,0.2)')}>
          {status === 'generating' ? '⏳ Generating...' : '📥 Download Image'}
        </button>
        <button onClick={shareWhatsApp} style={btnStyle('rgba(37,211,102,0.4)', 'rgba(37,211,102,0.1)')}>
          💬 WhatsApp
        </button>
        <button onClick={shareInstagram} style={btnStyle('rgba(236,72,153,0.4)', 'rgba(236,72,153,0.1)')}>
          📸 Instagram
        </button>
        <button onClick={copyLink} style={btnStyle('rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)')}>
          🔗 Copy Link
        </button>
      </div>
    </div>
  );
}

function getPlanetColor(planet) {
  const c = { Sun:'#FF9933',Moon:'#B0C4DE',Mars:'#DC143C',Mercury:'#32CD32',Jupiter:'#FFD700',Venus:'#FF69B4',Saturn:'#708090',Rahu:'#9370DB',Ketu:'#CD853F' };
  return c[planet] || '#9CA3AF';
}
