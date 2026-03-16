# 🕉️ CosmicTantra V34

> **AI-Powered Vedic Astrology Platform** — Kundali · Dasha · Panchang · 3D Cosmos · AI Guru

[![Version](https://img.shields.io/badge/version-34.0.0-7C3AED?style=flat-square)](./package.json)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r169-000000?style=flat-square&logo=threedotjs)](https://threejs.org)
[![AI](https://img.shields.io/badge/AI-Claude%20Sonnet-FF6B35?style=flat-square)](https://anthropic.com)

---

## ✨ What is CosmicTantra?

CosmicTantra is a full-featured Vedic astrology application that combines:
- **Classical Jyotish** — accurate planetary calculations, Kundali, Dasha, Panchang
- **AI Intelligence** — Claude-powered Guru chat in 6 languages with voice I/O
- **3D Visualization** — animated React Three Fiber Navagraha solar system
- **Modern UX** — responsive React app with dark cosmic design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
git clone https://github.com/your-org/cosmictantra.git
cd cosmictantra
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 API Configuration

CosmicTantra uses the **Anthropic Claude API** for the Guru AI chat.

The API key is **handled server-side** — the Claude.ai artifact environment provides it automatically.

If running standalone, add your key:
```bash
# In a real deployment, set via environment variable:
VITE_ANTHROPIC_API_KEY=your_key_here
```

> **Note:** In production, always proxy API calls through your backend — never expose API keys in client-side code.

---

## 📦 Project Structure

```
cosmictantra/
├── public/
│   └── index.html              # App shell with splash loader
├── src/
│   ├── main.jsx                # React entry point
│   ├── CosmicTantraApp.jsx     # Root component + all tab orchestration
│   ├── engines/
│   │   ├── astrologyEngine.js  # Planetary math, Lagna, houses, predictions
│   │   ├── dashaEngine.js      # Vimshottari Dasha + karma timeline
│   │   ├── panchang.js         # Daily Vedic almanac
│   │   └── guruAI.js           # Claude AI integration + voice
│   ├── components/
│   │   ├── NorthIndianChart.jsx    # SVG North Indian chart
│   │   ├── SouthIndianChart.jsx    # SVG South Indian chart
│   │   ├── SwargaLok.jsx           # 3D Navagraha scene (R3F)
│   │   ├── DestinyTimeline.jsx     # Interactive karma timeline
│   │   ├── KarmaWheel.jsx          # Animated SVG soul radar
│   │   ├── SoulMatrix.jsx          # Past life + soul analysis
│   │   ├── ChatBox.jsx             # Guru AI chat UI
│   │   ├── DailyHoroscope.jsx      # Daily horoscope for 12 signs
│   │   ├── ConsultantMarketplace.jsx # Astrologer booking
│   │   └── ShareReport.jsx         # PDF + clipboard + WhatsApp
│   └── utils/
│       └── reportGenerator.js  # jsPDF + html2canvas export
├── docs/
│   └── CosmicTantra_Journal_V1-V34.txt  # Full development journal
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🌟 Features

### 🗺️ Kundali (Birth Chart)
- **Accurate Vedic calculations** using Lahiri ayanamsha
- All **9 planets**: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
- **Real Lagna** calculation based on birth time + exact location
- **Whole Sign house system** (traditional Vedic standard)
- **27 Nakshatras** with pada, ruler, and interpretation
- Planet status: Exalted, Debilitated, Own Sign, Neutral
- **North Indian** (diamond grid) and **South Indian** (fixed rasi grid) chart renderers
- Life predictions for Career, Wealth, Love, and Karma
- Personalized **planetary remedies** (mantras, gemstones, charity)

### ⏳ Dasha (Planetary Periods)
- **Vimshottari Dasha** system (120-year cycle)
- Full **Mahadasha + Antardasha** calculation
- Current period detection with % complete
- **Karma Destiny Timeline** — visual age-mapped bar
- Marriage and wealth cycle analysis
- Predicted life events per dasha

### 📅 Panchang (Daily Almanac)
- **Tithi** (lunar day) with quality and meaning
- **Nakshatra** with pada and ruler
- **Yoga** (27 types) with auspiciousness
- **Karana** (half-tithi)
- **Vara** (weekday) with planetary deity
- Sunrise, Sunset, **Rahu Kala** timing
- Moon phase with illumination %
- **Auspicious Muhurtas** of the day
- Daily guidance and remedy

### 🌌 Swarga Lok (3D Cosmos)
- **React Three Fiber** 3D scene
- All 9 Navagraha planets with accurate orbital animations
- Saturn with ring geometry
- Sun with point light source
- **Cosmic Sage avatar** (Guru) floating above
- Star field + Milky Way particle belt
- **Orbit controls**: drag, zoom, auto-rotate

### ☸️ Karma Analysis
- **Karma Wheel**: 8-dimension soul radar chart (Dharma, Artha, Kama, Moksha...)
- **Soul Matrix**: Past life karma, dharma, soul gift, challenge, purpose
- 3×3 planetary number grid
- Ketu-based past life themes
- Saturn house-based karma lessons

### 🧘 Guru AI Chat
- Powered by **Claude Sonnet** (claude-sonnet-4-20250514)
- **6 languages**: English, Hindi, Tamil, Telugu, Bengali, Sanskrit
- **Voice input** (Web Speech API)
- **Voice output** (SpeechSynthesis)
- Kundali-aware context injection
- Quick question chips
- Auto-speak mode
- Offline fallback responses

### 🌟 Daily Horoscope
- Daily predictions for **all 12 zodiac signs**
- 5 scored dimensions: Love, Career, Health, Finance, Spiritual
- Lucky numbers, color, time
- Deterministic (same for everyone on same day, changes daily)
- Auto-selects user's natal Lagna sign

### 👥 Consultant Marketplace
- 6 verified astrologer profiles
- Specialty filters
- Rating, reviews, badges
- Book session workflow with confirmation

### 📄 Share & Export
- **PDF download** (3-page jsPDF report)
- **Copy to clipboard** (formatted text report)
- **WhatsApp share** (opens wa.me with report)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + Vite 5 |
| 3D Rendering | React Three Fiber + Drei + Three.js r169 |
| Animations | CSS animations + requestAnimationFrame |
| AI | Anthropic Claude Sonnet (claude-sonnet-4-20250514) |
| Voice | Web Speech API (built-in browser) |
| PDF | jsPDF 2.5 |
| Screenshots | html2canvas 1.4 |
| Icons | Lucide React |
| Build | Vite with manual chunk splitting |
| Styling | CSS-in-JS + CSS Variables (no external CSS framework) |

---

## 🔬 Astronomical Accuracy

CosmicTantra uses simplified but reasonably accurate astronomical algorithms:

| Planet | Accuracy | Method |
|--------|----------|--------|
| Sun | ±0.5° | Low-precision VSOP approximation |
| Moon | ±1.5° | Simplified ELP2000 terms |
| Mars | ±2.0° | Mean anomaly expansion |
| Mercury | ±2.5° | Heliocentric approximation |
| Jupiter | ±1.5° | Mean anomaly expansion |
| Venus | ±2.0° | Mean anomaly expansion |
| Saturn | ±1.5° | Mean anomaly expansion |
| Rahu | ±1.0° | Mean node formula |
| Lagna | ±1.0° | GMST → LST → ascendant |

**Ayanamsha**: Lahiri (Chitrapaksha), accurate to ±0.01°

For professional-grade precision, V35 will implement full VSOP87 theory.

---

## 🌐 Language Support

| Code | Language | Voice Support |
|------|----------|---------------|
| en | English | ✅ en-IN |
| hi | हिंदी | ✅ hi-IN |
| ta | தமிழ் | ✅ ta-IN |
| te | తెలుగు | ✅ te-IN |
| bn | বাংলা | ✅ bn-IN |
| sa | Sanskrit | ✅ hi-IN (closest) |

---

## 📖 Development History

See [docs/CosmicTantra_Journal_V1-V34.txt](./docs/CosmicTantra_Journal_V1-V34.txt) for the complete version history from V1 (project inception) through V34 (current release).

---

## 🗺️ Roadmap

### V35 (Planned)
- Full VSOP87 planetary theory (arcsecond accuracy)
- Navamsha (D9) chart renderer
- Bhava Chalit chart
- Ashtakavarga scoring

### V36 (Planned)
- Compatibility / Synastry chart
- Birth time rectification
- Full transit overlay on natal chart
- Muhurta selection tool

### V37+ (Future)
- User accounts + chart storage
- Push notifications for Rahu Kala
- Prashna (Horary) astrology
- Jaimini Dasha systems
- Annual chart (Varshaphal / Solar Return)

---

## 🙏 Credits & Acknowledgments

- **Vedic Astrology Tradition**: Based on classical Parashari Jyotish
- **Ayanamsha**: Lahiri / Chitrapaksha (Indian standard)
- **Astronomical Algorithms**: Jean Meeus "Astronomical Algorithms"
- **AI**: Anthropic Claude for Guru intelligence
- **3D**: React Three Fiber ecosystem

---

## 📜 License

Proprietary — CosmicTantra V34. All rights reserved.

---

> *"Sarve Bhavantu Sukhinah · Sarve Santu Niraamayaah"*
> May all beings be happy · May all beings be free from illness
>
> 🕉️ **Hari Om**
