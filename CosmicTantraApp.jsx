import React, { useState, useCallback, lazy, Suspense } from 'react';
import { calculateKundali, generateLifePredictions } from './engines/astrologyEngine.js';
import { calculateVimshottariDasha, getCurrentDasha, generateKarmaTimeline, getMarriageCycles, getWealthCycles } from './engines/dashaEngine.js';
import { calculatePanchang } from './engines/panchang.js';
import { generateRemedies } from './engines/guruAI.js';

// Lazy-load heavy components
const SwargaLok = lazy(() => import('./components/SwargaLok.jsx'));
import NorthIndianChart from './components/NorthIndianChart.jsx';
import SouthIndianChart from './components/SouthIndianChart.jsx';
import DestinyTimeline from './components/DestinyTimeline.jsx';
import KarmaWheel from './components/KarmaWheel.jsx';
import SoulMatrix from './components/SoulMatrix.jsx';
import ChatBox from './components/ChatBox.jsx';
import ConsultantMarketplace from './components/ConsultantMarketplace.jsx';
import ShareReport from './components/ShareReport.jsx';
import DailyHoroscope from './components/DailyHoroscope.jsx';

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-deep:    #030108;
    --bg-mid:     #0D0A1E;
    --bg-card:    rgba(255,255,255,0.04);
    --border:     rgba(124,58,237,0.25);
    --accent:     #7C3AED;
    --accent2:    #F59E0B;
    --text-main:  #E2D9F3;
    --text-muted: #9CA3AF;
    --gold:       #F59E0B;
  }

  body {
    background: var(--bg-deep);
    color: var(--text-main);
    font-family: 'Lato', Georgia, sans-serif;
    line-height: 1.6;
    min-height: 100vh;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 3px; }

  /* Animations */
  @keyframes cosmicPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
  }
  @keyframes starFloat {
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  .animate-up { animation: slideUp 0.5s ease forwards; }
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    backdrop-filter: blur(8px);
  }
  .section-title {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-title::before, .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent);
  }
  .tab-btn {
    padding: 6px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
    border: 1px solid transparent;
    font-family: 'Lato', sans-serif;
  }
  .tab-btn.active {
    background: linear-gradient(135deg, rgba(124,58,237,0.4), rgba(92,21,181,0.4));
    border-color: #7C3AED;
    color: #E2D9F3;
  }
  .tab-btn.inactive {
    background: transparent;
    border-color: rgba(255,255,255,0.1);
    color: #6B7280;
  }
  .tab-btn:hover { opacity: 0.85; }
  input, select { font-family: 'Lato', sans-serif; }
`;

// ─── LOCATION PRESETS ────────────────────────────────────────────────────────
const CITIES = [
  { name: 'Patna', lat: 25.5941, lon: 85.1376, tz: 5.5 },
  { name: 'Delhi', lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, tz: 5.5 },
  { name: 'Varanasi', lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: 'London', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'New York', lat: 40.7128, lon: -74.0060, tz: -5 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, tz: 4 },
  { name: 'Custom', lat: null, lon: null, tz: 5.5 },
];

// ─── NAV TABS ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'kundali',    label: '🗺️ Kundali',    short: 'Kundali' },
  { id: 'swarga',    label: '🌌 Swarga Lok',  short: '3D' },
  { id: 'dasha',     label: '⏳ Dasha',       short: 'Dasha' },
  { id: 'panchang',  label: '📅 Panchang',    short: 'Panchang' },
  { id: 'karma',     label: '☸️ Karma',       short: 'Karma' },
  { id: 'guru',      label: '🧘 Guru AI',     short: 'Guru' },
  { id: 'horoscope', label: '🌟 Horoscope',   short: 'Horoscope' },
  { id: 'consult',   label: '👥 Consult',     short: 'Consult' },
];

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function CosmicTantraApp() {
  const [activeTab, setActiveTab] = useState('kundali');
  const [chartStyle, setChartStyle] = useState('north'); // 'north' | 'south'
  const [guruLanguage, setGuruLanguage] = useState('en');

  // Birth form state
  const [form, setForm] = useState({
    name: '',
    dob: '1990-01-15',
    tob: '10:30',
    city: 'Patna',
    lat: 25.5941,
    lon: 85.1376,
    tz: 5.5,
  });

  // Computed data
  const [kundali, setKundali] = useState(null);
  const [dashas, setDashas] = useState(null);
  const [currentDasha, setCurrentDasha] = useState(null);
  const [karmaTimeline, setKarmaTimeline] = useState(null);
  const [lifePredictions, setLifePredictions] = useState(null);
  const [panchang, setPanchang] = useState(null);
  const [remedies, setRemedies] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState('predictions'); // predictions | charts | planets

  const handleCityChange = (cityName) => {
    const city = CITIES.find(c => c.name === cityName);
    if (city && city.lat !== null) {
      setForm(f => ({ ...f, city: cityName, lat: city.lat, lon: city.lon, tz: city.tz }));
    } else {
      setForm(f => ({ ...f, city: cityName }));
    }
  };

  const handleGenerate = useCallback(() => {
    if (!form.dob) return;
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const k = calculateKundali(form.dob, form.tob, form.lat, form.lon, form.tz);
        const preds = generateLifePredictions(k);
        const dashaList = calculateVimshottariDasha(k.planets.Moon.nakshatra, new Date(form.dob));
        const current = getCurrentDasha(dashaList);
        const timeline = generateKarmaTimeline(dashaList, form.dob);
        const todayPanchang = calculatePanchang(new Date(), form.lat, form.lon, form.tz);
        const rems = generateRemedies(k);

        setKundali(k);
        setLifePredictions(preds);
        setDashas(dashaList);
        setCurrentDasha(current);
        setKarmaTimeline(timeline);
        setPanchang(todayPanchang);
        setRemedies(rems);
      } catch (err) {
        console.error('Kundali generation error:', err);
      }
      setIsGenerating(false);
    }, 600);
  }, [form]);

  // ─── RENDER HELPERS ──────────────────────────────────────────────────────────

  function renderBirthForm() {
    return (
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="section-title">Birth Details</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '1.2rem',
        }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Your Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Enter name"
              style={inputStyle}
            />
          </div>
          {/* DOB */}
          <div>
            <label style={labelStyle}>Date of Birth</label>
            <input
              type="date"
              value={form.dob}
              onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
              style={inputStyle}
            />
          </div>
          {/* TOB */}
          <div>
            <label style={labelStyle}>Time of Birth</label>
            <input
              type="time"
              value={form.tob}
              onChange={e => setForm(f => ({ ...f, tob: e.target.value }))}
              style={inputStyle}
            />
          </div>
          {/* City */}
          <div>
            <label style={labelStyle}>City / Location</label>
            <select
              value={form.city}
              onChange={e => handleCityChange(e.target.value)}
              style={inputStyle}
            >
              {CITIES.map(c => (
                <option key={c.name} value={c.name} style={{ background: '#1E0A3C' }}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {form.city === 'Custom' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Latitude</label>
              <input type="number" step="0.01" value={form.lat}
                onChange={e => setForm(f => ({ ...f, lat: parseFloat(e.target.value) }))}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Longitude</label>
              <input type="number" step="0.01" value={form.lon}
                onChange={e => setForm(f => ({ ...f, lon: parseFloat(e.target.value) }))}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Timezone (±h)</label>
              <input type="number" step="0.5" value={form.tz}
                onChange={e => setForm(f => ({ ...f, tz: parseFloat(e.target.value) }))}
                style={inputStyle} />
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            width: '100%', padding: '12px',
            background: isGenerating ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            border: 'none', borderRadius: '12px', cursor: isGenerating ? 'wait' : 'pointer',
            color: '#fff', fontSize: '1rem', fontWeight: 'bold',
            letterSpacing: '0.05em', transition: 'all 0.3s',
            boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
          }}
        >
          {isGenerating ? '✨ Reading the cosmos...' : '🕉️ Generate My Cosmic Chart'}
        </button>
      </div>
    );
  }

  function renderKundaliTab() {
    return (
      <div>
        {renderBirthForm()}

        {kundali && (
          <div className="animate-up">
            {/* Lagna summary banner */}
            <div className="card" style={{
              padding: '1rem 1.5rem', marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(245,158,11,0.08))',
              display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center',
            }}>
              <div style={{ fontSize: '2.5rem' }}>🌟</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.3rem', fontFamily: 'Cinzel, serif', color: '#A78BFA', fontWeight: '600' }}>
                  {form.name || 'Cosmic Seeker'} — {kundali.lagna.rasiName} Lagna
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '0.88rem', marginTop: '2px' }}>
                  Moon in {kundali.planets.Moon.nakshatra.name} · Sun in {kundali.planets.Sun.rasiName} · Ayanamsha: {kundali.ayanamsha}°
                </div>
              </div>
              {currentDasha && (
                <div style={{
                  background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
                  borderRadius: '10px', padding: '8px 14px', textAlign: 'center',
                }}>
                  <div style={{ color: '#9CA3AF', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Current Dasha</div>
                  <div style={{ color: '#A78BFA', fontWeight: 'bold', fontSize: '1rem' }}>{currentDasha.planet}</div>
                  <div style={{ color: '#6B7280', fontSize: '11px' }}>{currentDasha.percentDone}% complete</div>
                </div>
              )}
            </div>

            {/* Share buttons */}
            <div style={{ marginBottom: '1.5rem' }}>
              <ShareReport
                kundali={kundali}
                lifePredictions={lifePredictions}
                panchang={panchang}
                currentDasha={currentDasha}
                name={form.name || 'Cosmic Seeker'}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              {['north', 'south'].map(style => (
                <button
                  key={style}
                  className={`tab-btn ${chartStyle === style ? 'active' : 'inactive'}`}
                  onClick={() => setChartStyle(style)}
                >
                  {style === 'north' ? '🔷 North Indian' : '⬛ South Indian'}
                </button>
              ))}
            </div>

            {/* Chart display */}
            <div style={{
              display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
              alignItems: 'flex-start', marginBottom: '1.5rem',
            }}>
              <div className="card" style={{ padding: '1rem', display: 'inline-block' }}>
                {chartStyle === 'north'
                  ? <NorthIndianChart kundali={kundali} size={300} />
                  : <SouthIndianChart kundali={kundali} size={300} />
                }
              </div>

              {/* Planet table */}
              <div className="card" style={{ padding: '1rem', flex: 1, minWidth: '280px' }}>
                <div className="section-title">Planetary Positions</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      {['Planet', 'Rasi', 'House', 'Nakshatra', 'Status'].map(h => (
                        <th key={h} style={{ color: '#6B7280', fontWeight: '600', padding: '4px 8px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '11px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(kundali.planets).map(([name, p]) => (
                      <tr key={name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '5px 8px', color: getPlanetColor(name), fontWeight: '600' }}>{name}</td>
                        <td style={{ padding: '5px 8px', color: '#D1D5DB' }}>{p.rasiName}</td>
                        <td style={{ padding: '5px 8px', color: '#9CA3AF' }}>{p.house}</td>
                        <td style={{ padding: '5px 8px', color: '#9CA3AF', fontSize: '0.78rem' }}>{p.nakshatra?.name}</td>
                        <td style={{ padding: '5px 8px' }}>
                          <span style={{
                            color: p.status === 'Exalted' ? '#10B981' : p.status === 'Debilitated' ? '#EF4444' : p.status === 'Own Sign' ? '#FBBF24' : '#6B7280',
                            fontSize: '0.78rem', fontWeight: '600',
                          }}>
                            {p.status === 'Exalted' ? '⬆ ' : p.status === 'Debilitated' ? '⬇ ' : ''}{p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Life Predictions */}
            {lifePredictions && (
              <div className="card" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
                <div className="section-title">Life Predictions</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {[
                    { key: 'career', icon: '💼', label: 'Career', color: '#3B82F6' },
                    { key: 'wealth', icon: '💰', label: 'Wealth', color: '#10B981' },
                    { key: 'love', icon: '❤️', label: 'Love & Marriage', color: '#EC4899' },
                    { key: 'karma', icon: '☸️', label: 'Karma & Dharma', color: '#8B5CF6' },
                  ].map(({ key, icon, label, color }) => (
                    <div key={key} style={{
                      background: `${color}10`, border: `1px solid ${color}30`,
                      borderRadius: '10px', padding: '1rem',
                    }}>
                      <div style={{ color, fontWeight: 'bold', marginBottom: '6px', fontSize: '0.95rem' }}>
                        {icon} {label}
                      </div>
                      {key === 'career' && (
                        <>
                          <div style={{ color: '#D1D5DB', fontSize: '0.82rem', lineHeight: '1.6' }}>
                            <strong>Field:</strong> {lifePredictions.career?.field}
                          </div>
                          <div style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '4px' }}>
                            {lifePredictions.career?.tip}
                          </div>
                        </>
                      )}
                      {key === 'wealth' && (
                        <>
                          <div style={{ color: '#D1D5DB', fontSize: '0.82rem', lineHeight: '1.6' }}>
                            <strong>Source:</strong> {lifePredictions.wealth?.source}
                          </div>
                          <div style={{ marginTop: '6px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', padding: '2px 6px', display: 'inline-block' }}>
                            <span style={{ color: '#10B981', fontSize: '0.78rem' }}>Score: {lifePredictions.wealth?.score}%</span>
                          </div>
                        </>
                      )}
                      {key === 'love' && (
                        <>
                          <div style={{ color: '#D1D5DB', fontSize: '0.82rem', lineHeight: '1.6' }}>
                            <strong>Partner:</strong> {lifePredictions.love?.partner}
                          </div>
                          <div style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '4px' }}>
                            <strong>Timing:</strong> {lifePredictions.love?.timing}
                          </div>
                        </>
                      )}
                      {key === 'karma' && (
                        <>
                          <div style={{ color: '#D1D5DB', fontSize: '0.82rem', lineHeight: '1.6' }}>
                            {lifePredictions.karma?.dharma}
                          </div>
                          <div style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '4px' }}>
                            <strong>Lesson:</strong> {lifePredictions.karma?.lesson}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Remedies */}
            {remedies && remedies.length > 0 && (
              <div className="card" style={{ padding: '1.2rem' }}>
                <div className="section-title">Planetary Remedies</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {remedies.map((r, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
                      padding: '0.9rem', border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                      <div style={{ color: '#A78BFA', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.9rem' }}>
                        {r.planet} — {r.type}
                      </div>
                      <div style={{ color: '#D1D5DB', fontSize: '0.82rem', lineHeight: '1.6' }}>
                        🙏 {r.remedy}
                      </div>
                      {r.gemstone && (
                        <div style={{ color: '#FBBF24', fontSize: '0.78rem', marginTop: '4px' }}>
                          💎 {r.gemstone}
                        </div>
                      )}
                      {r.charity && (
                        <div style={{ color: '#6EE7B7', fontSize: '0.78rem', marginTop: '2px' }}>
                          🤲 {r.charity}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function renderPanchangTab() {
    const today = panchang || calculatePanchang(new Date());
    return (
      <div>
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="section-title">Today's Panchang</div>
          <div style={{ color: '#A78BFA', fontSize: '1rem', fontFamily: 'Cinzel, serif', marginBottom: '1.2rem' }}>
            📅 {today.date}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Tithi', value: today.tithi.name, sub: today.tithi.meaning, icon: '🌙' },
              { label: 'Nakshatra', value: today.nakshatra.name, sub: `Pada ${today.nakshatra.pada} · ${today.nakshatra.ruler} ruled`, icon: '⭐' },
              { label: 'Yoga', value: today.yoga.name, sub: today.yoga.meaning, icon: '☯️', color: today.yoga.quality === 'Auspicious' ? '#10B981' : today.yoga.quality === 'Inauspicious' ? '#EF4444' : '#F59E0B' },
              { label: 'Karana', value: today.karana.name, sub: today.karana.quality, icon: '🔱' },
              { label: 'Vara', value: today.vara.name, sub: `${today.vara.day} · ${today.vara.planet}`, icon: '🌅' },
              { label: 'Moon Phase', value: today.moonPhase.name, sub: `${today.moonPhase.illumination}% illuminated`, icon: today.moonPhase.icon },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '0.9rem',
              }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                <div style={{ color: '#9CA3AF', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ color: item.color || '#E2D9F3', fontWeight: 'bold', fontSize: '0.95rem', marginTop: '2px' }}>{item.value}</div>
                <div style={{ color: '#6B7280', fontSize: '0.78rem', marginTop: '2px' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sunrise/Sunset + Rahu Kala */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <div className="section-title">Sun Timings</div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px' }}>🌅</div>
                <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase' }}>Sunrise</div>
                <div style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '1.1rem' }}>{today.sunrise}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px' }}>🌇</div>
                <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase' }}>Sunset</div>
                <div style={{ color: '#EC4899', fontWeight: 'bold', fontSize: '1.1rem' }}>{today.sunset}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1rem' }}>
            <div className="section-title">Rahu Kala</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚠️</div>
              <div style={{ color: '#EF4444', fontWeight: 'bold', fontSize: '1rem' }}>
                {today.rahuKala.start} – {today.rahuKala.end}
              </div>
              <div style={{ color: '#6B7280', fontSize: '0.78rem', marginTop: '4px' }}>
                {today.rahuKala.caution}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Guidance */}
        <div className="card" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
          <div className="section-title">Divine Daily Guidance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'rgba(124,58,237,0.1)', borderRadius: '8px', padding: '0.8rem', borderLeft: '3px solid #7C3AED' }}>
              <div style={{ color: '#A78BFA', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>Overall Energy</div>
              <div style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: '1.6' }}>{today.guidance.overall}</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', borderRadius: '8px', padding: '0.8rem', borderLeft: '3px solid #F59E0B' }}>
              <div style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>Nakshatra Guidance</div>
              <div style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: '1.6' }}>{today.guidance.nakshatra}</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: '8px', padding: '0.8rem', borderLeft: '3px solid #10B981' }}>
              <div style={{ color: '#10B981', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>Daily Remedy</div>
              <div style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: '1.6' }}>{today.guidance.remedy}</div>
            </div>
          </div>
        </div>

        {/* Auspicious muhurtas */}
        <div className="card" style={{ padding: '1.2rem' }}>
          <div className="section-title">Auspicious Muhurtas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {today.muhurtas.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px',
              }}>
                <span style={{ color: '#FBBF24', fontSize: '14px' }}>✨</span>
                <span style={{ color: '#D1D5DB', fontSize: '0.85rem' }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderDashaTab() {
    if (!kundali) {
      return (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <div style={{ color: '#9CA3AF' }}>Generate your Kundali first to view Dasha cycles</div>
          <button
            onClick={() => setActiveTab('kundali')}
            style={{ marginTop: '1rem', ...ctaButtonStyle }}
          >
            Go to Kundali →
          </button>
        </div>
      );
    }

    const marriageCycles = getMarriageCycles(dashas, form.dob);

    return (
      <div>
        {/* Current Dasha */}
        {currentDasha && (
          <div className="card" style={{ padding: '1.2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(0,0,0,0.3))' }}>
            <div className="section-title">Current Period</div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: `${currentDasha.color}33`,
                border: `2px solid ${currentDasha.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', flexShrink: 0,
              }}>
                🪐
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: currentDasha.color, fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'Cinzel, serif' }}>
                  {currentDasha.planet} Mahadasha
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                  Ends {currentDasha.endDate?.toLocaleDateString('en-IN')} · {currentDasha.percentDone}% complete
                </div>
                {currentDasha.antardasha && (
                  <div style={{ color: '#E2D9F3', fontSize: '0.85rem', marginTop: '4px' }}>
                    Current Antardasha: <span style={{ color: currentDasha.color }}>{currentDasha.antardasha.planet}</span>
                  </div>
                )}
              </div>
            </div>
            <p style={{ color: '#D1D5DB', fontSize: '0.88rem', lineHeight: '1.7', marginTop: '1rem', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              {currentDasha.theme}
            </p>
          </div>
        )}

        {/* Destiny Timeline */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <DestinyTimeline
            timeline={karmaTimeline}
            currentDasha={currentDasha}
            birthDate={form.dob}
          />
        </div>

        {/* Marriage cycles */}
        {marriageCycles.length > 0 && (
          <div className="card" style={{ padding: '1.2rem' }}>
            <div className="section-title">Marriage & Love Periods</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {marriageCycles.map((m, i) => (
                <div key={i} style={{
                  background: 'rgba(236,72,153,0.08)',
                  border: '1px solid rgba(236,72,153,0.2)',
                  borderRadius: '10px', padding: '0.9rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#EC4899', fontWeight: 'bold', fontSize: '0.95rem' }}>
                      💝 {m.period}
                    </div>
                    <span style={{
                      background: 'rgba(236,72,153,0.15)',
                      color: '#EC4899', fontSize: '11px', padding: '2px 10px', borderRadius: '20px',
                    }}>
                      {m.favorability}
                    </span>
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.82rem', marginTop: '4px' }}>
                    Age {m.startAge}–{m.endAge} · Best window: ~{m.bestAge}
                  </div>
                  <div style={{ color: '#D1D5DB', fontSize: '0.82rem', marginTop: '6px' }}>
                    {m.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderKarmaTab() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <KarmaWheel kundali={kundali} />
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <SoulMatrix kundali={kundali} lifePredictions={lifePredictions} />
        </div>
      </div>
    );
  }

  function renderGuruTab() {
    return (
      <div className="card" style={{ height: '600px', overflow: 'hidden' }}>
        <ChatBox
          kundali={kundali}
          language={guruLanguage}
          onLanguageChange={setGuruLanguage}
        />
      </div>
    );
  }

  // ─── MAIN RENDER ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px 40px' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', padding: '2rem 0 1.5rem' }}>
          {/* Cosmic background particles */}
          <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                background: '#fff', borderRadius: '50%',
                opacity: Math.random() * 0.5 + 0.1,
              }} />
            ))}
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px', lineHeight: 1 }}>🕉️</div>
            <h1 style={{
              fontFamily: 'Cinzel, serif', fontWeight: '700',
              fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
              background: 'linear-gradient(90deg, #7C3AED, #F59E0B, #7C3AED)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'shimmer 4s linear infinite',
              letterSpacing: '0.08em', marginBottom: '6px',
            }}>
              CosmicTantra
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Vedic Astrology · V34 · AI Jyotish Guru
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav style={{
          display: 'flex', gap: '6px', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '1.5rem',
          position: 'sticky', top: '8px', zIndex: 100,
          background: 'rgba(3,1,8,0.85)', backdropFilter: 'blur(12px)',
          padding: '8px 12px', borderRadius: '16px',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-label-full" style={{ display: 'inline' }}>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <main>
          {activeTab === 'kundali'   && renderKundaliTab()}
          {activeTab === 'swarga'   && (
            <div>
              <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                <div className="section-title">Swarga Lok — 3D Navagraha Cosmos</div>
                <Suspense fallback={
                  <div style={{ height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                    Loading 3D cosmos...
                  </div>
                }>
                  <SwargaLok kundali={kundali} />
                </Suspense>
                <p style={{ color: '#6B7280', fontSize: '0.8rem', textAlign: 'center', marginTop: '8px' }}>
                  Drag to rotate · Scroll to zoom · Watch Navagraha in their celestial dance
                </p>
              </div>
            </div>
          )}
          {activeTab === 'dasha'    && renderDashaTab()}
          {activeTab === 'panchang' && renderPanchangTab()}
          {activeTab === 'karma'    && renderKarmaTab()}
          {activeTab === 'guru'     && renderGuruTab()}
          {activeTab === 'horoscope' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <DailyHoroscope userLagna={kundali?.lagna?.rasiName} />
            </div>
          )}
          {activeTab === 'consult'  && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <ConsultantMarketplace />
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px',
  padding: '8px 12px', color: '#E2D9F3', fontSize: '0.9rem',
  outline: 'none', transition: 'border 0.2s',
};
const labelStyle = {
  display: 'block', color: '#9CA3AF', fontSize: '11px',
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px',
};
const ctaButtonStyle = {
  padding: '8px 20px', borderRadius: '20px', cursor: 'pointer',
  background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
  color: '#A78BFA', fontSize: '0.9rem',
};

function getPlanetColor(planet) {
  const colors = {
    Sun: '#FF9933', Moon: '#B0C4DE', Mars: '#DC143C',
    Mercury: '#32CD32', Jupiter: '#FFD700', Venus: '#FF69B4',
    Saturn: '#708090', Rahu: '#9370DB', Ketu: '#CD853F',
  };
  return colors[planet] || '#9CA3AF';
}
