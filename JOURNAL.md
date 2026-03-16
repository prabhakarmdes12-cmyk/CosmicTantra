# 🕉️ CosmicTantra — Project Journal

> **Living document** — updated with every significant build, decision, or milestone.
> This journal is the single source of truth for the entire team.
> Each section is annotated for the department that owns it.

---

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEAM ROLE INDEX                              │
│                                                                 │
│  [FOUNDER]   — Vision, strategy, decisions                      │
│  [PM]        — Product Manager — roadmap, priorities, sprints   │
│  [DEV-FE]    — Frontend Developer — React, UI, components       │
│  [DEV-BE]    — Backend Developer — API, DB, auth, server        │
│  [DEV-AI]    — AI/ML Engineer — Claude integration, prompts     │
│  [DEV-3D]    — 3D / Graphics Engineer — Three.js, R3F, shaders  │
│  [DESIGN]    — UI/UX Designer — visuals, flows, aesthetics      │
│  [ASTRO]     — Jyotish Consultant — accuracy, content, vedic    │
│  [CONTENT]   — Content Writer — copy, guidance, mantras         │
│  [OPS]       — DevOps / Infrastructure — deploy, CI/CD, scale   │
│  [GROWTH]    — Growth / Marketing — SEO, social, viral          │
│  [QA]        — Quality Assurance — testing, bugs, coverage      │
└─────────────────────────────────────────────────────────────────┘

🟢 CURRENT STATUS: Solo founder build — all roles handled by Prabhakar
   As team grows, sections below transfer to respective owners.
```

---

## 📋 TABLE OF CONTENTS

1. [Project Vision](#1-project-vision)
2. [Current Status & Live Links](#2-current-status--live-links)
3. [Architecture Overview](#3-architecture-overview)
4. [Feature Log — What's Built](#4-feature-log--whats-built)
5. [Active Development — What's In Progress](#5-active-development--whats-in-progress)
6. [Roadmap — What's Coming](#6-roadmap--whats-coming)
7. [Design System & Brand](#7-design-system--brand)
8. [Engineering Standards](#8-engineering-standards)
9. [AI & Jyotish Accuracy Standards](#9-ai--jyotish-accuracy-standards)
10. [Infrastructure & DevOps](#10-infrastructure--devops)
11. [Growth & Marketing Strategy](#11-growth--marketing-strategy)
12. [Known Issues & Bug Tracker](#12-known-issues--bug-tracker)
13. [Decision Log](#13-decision-log)
14. [Version History](#14-version-history)

---

## 1. Project Vision

> `[FOUNDER]` `[PM]`

### What is CosmicTantra?

CosmicTantra is an **AI-powered Vedic astrology platform** that makes classical Jyotish wisdom accessible to modern users through beautiful design, accurate calculations, and an AI Guru that speaks your language.

### The Core Promise to Users

> *"Enter a digital temple. Receive your cosmic blueprint. Understand your soul's journey."*

### Three Pillars

| Pillar | Description | Status |
|--------|-------------|--------|
| **Accuracy** | Calculations verified against classical Jyotish standards | ✅ V34 |
| **Beauty** | Design that feels like a sacred space, not a tool | ✅ V34 |
| **Intelligence** | AI Guru that knows your chart and speaks your language | ✅ V34 |

### Target Users

- **Primary**: Indian diaspora globally (ages 25–50) seeking spiritual grounding
- **Secondary**: Western astrology enthusiasts discovering Vedic traditions
- **Tertiary**: Practicing astrologers wanting a digital tool for client sessions

### Business Model (Planned)

```
Free Tier       → Basic Kundali + Daily Panchang + limited Guru chat
Premium (₹299/mo) → Full Guru AI, PDF reports, detailed predictions
Marketplace     → Consultant bookings (15% platform commission)
B2B             → White-label API for astrology apps
```

---

## 2. Current Status & Live Links

> `[ALL TEAM]` — Everyone reads this section

### 🟢 Live Environment

| Environment | URL | Branch | Status |
|-------------|-----|--------|--------|
| Production | https://cosmic-tantra.vercel.app | `main` | 🟢 Live |
| GitHub Repo | https://github.com/prabhakarmdes12-cmyk/CosmicTantra | — | 🟢 Public |

### Current Version: V34.1

**Build date:** March 2026
**Lines of code:** ~6,500+
**Files:** 28 source files
**Deployment:** Vercel (auto-deploy on `git push`)

### What a New Team Member Should Do First

```bash
# 1. Clone the repo
git clone https://github.com/prabhakarmdes12-cmyk/CosmicTantra.git
cd CosmicTantra

# 2. Install dependencies
npm install

# 3. Create local env file
echo "VITE_ANTHROPIC_API_KEY=your_key_here" > .env.local

# 4. Run locally
npm run dev
# → Opens at http://localhost:5173
```

> Get your Anthropic API key at: https://console.anthropic.com

---

## 3. Architecture Overview

> `[DEV-FE]` `[DEV-BE]` `[DEV-AI]` `[DEV-3D]`

### Current Stack (V34)

```
FRONTEND (React 18 + Vite)
├── src/
│   ├── CosmicTantraApp.jsx      ← Root component, tab routing, state
│   ├── main.jsx                 ← React entry point
│   ├── engines/                 ← Pure JS calculation engines
│   │   ├── astrologyEngine.js   ← Planets, Lagna, houses, predictions
│   │   ├── dashaEngine.js       ← Vimshottari dasha cycles
│   │   ├── panchang.js          ← Daily Vedic almanac
│   │   └── guruAI.js            ← Claude API + voice I/O
│   ├── components/              ← React UI components
│   │   ├── NorthIndianChart.jsx ← SVG North Indian kundali
│   │   ├── SouthIndianChart.jsx ← SVG South Indian kundali
│   │   ├── SwargaLok.jsx        ← 3D Navagraha (Three.js / R3F)
│   │   ├── DestinyTimeline.jsx  ← Karma timeline visualization
│   │   ├── KarmaWheel.jsx       ← Soul radar chart
│   │   ├── SoulMatrix.jsx       ← Past life analysis
│   │   ├── SoulProfile.jsx      ← Mystical identity dashboard
│   │   ├── DailyGuidance.jsx    ← Mantra, meditation, karma advice
│   │   ├── DailyHoroscope.jsx   ← 12-sign daily horoscope
│   │   ├── ChatBox.jsx          ← Guru AI chat interface
│   │   ├── CosmicShare.jsx      ← Instagram/WhatsApp share card
│   │   ├── ShareReport.jsx      ← PDF + clipboard export
│   │   └── ConsultantMarketplace.jsx
│   └── utils/
│       ├── reportGenerator.js   ← jsPDF export engine
│       └── logoBase64.js        ← SVG logo fallback
├── public/
│   ├── index.html               ← Vite app shell
│   └── logo.svg                 ← Brand logo
└── docs/
    └── CosmicTantra_Journal_V1-V34.txt
```

### Data Flow

```
User enters birth details
        ↓
astrologyEngine.js  → calculates Kundali (planets, lagna, houses)
        ↓
dashaEngine.js      → calculates Dasha periods + karma timeline
        ↓
panchang.js         → calculates today's almanac
        ↓
generateLifePredictions() → career, love, wealth, karma insights
        ↓
generateRemedies()  → personalized planetary remedies
        ↓
React state in CosmicTantraApp.jsx
        ↓
All components receive kundali as prop → render accordingly
        ↓
guruAI.js           → injects kundali context into Claude API
```

### External Dependencies

| Service | Purpose | Key | Owner |
|---------|---------|-----|-------|
| Anthropic Claude | Guru AI chat | `VITE_ANTHROPIC_API_KEY` | `[DEV-AI]` |
| Vercel | Hosting + CI/CD | Dashboard login | `[OPS]` |
| Google Fonts | Cinzel + Lato | No key needed | `[DESIGN]` |

### Planned Backend (V36+)

> `[DEV-BE]` — This section is your future ownership

```
Currently: 100% client-side. No backend, no database.

Planned stack:
├── Node.js + Express (or Next.js API routes)
├── PostgreSQL (user accounts, saved charts)
├── Redis (session cache, rate limiting)
├── Stripe (subscription payments)
└── Supabase (auth + storage)
```

---

## 4. Feature Log — What's Built

> `[PM]` `[QA]` — Track what's shipped

### V34.1 — Current Release ✅

#### 🗺️ Kundali Engine
- [x] All 9 planets calculated (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
- [x] Real Lagna calculation — time + latitude/longitude aware
- [x] Lahiri ayanamsha (Indian standard)
- [x] Whole Sign house system (12 bhavas)
- [x] 27 Nakshatras with pada, ruler, degree
- [x] Planet status: Exalted / Debilitated / Own Sign / Neutral
- [x] North Indian SVG chart (diamond grid)
- [x] South Indian SVG chart (fixed rasi grid)
- [x] Life predictions: Career, Wealth, Love, Karma, Health
- [x] Planetary remedies: mantra, gemstone, charity, color

#### 🌌 Swarga Lok (3D)
- [x] All 9 Navagraha orbiting in 3D space
- [x] Saturn rings, Sun corona effects
- [x] **Click any planet → info panel slides in** *(V34.1)*
- [x] Planet glow aura with pulse animation
- [x] Selection ring around clicked planet
- [x] Spiritual meaning, karmic role, transit influence per planet
- [x] **"Ask Guru" button inside planet panel** *(V34.1)*
- [x] Cosmic dust particles (purple/gold)
- [x] Cosmic Sage (Guru Jyotishdev) floating avatar
- [x] Orbit controls: drag, zoom, auto-rotate

#### ⏳ Dasha System
- [x] Vimshottari Dasha (120-year cycle)
- [x] Full Mahadasha + Antardasha calculation
- [x] Current dasha detection + % complete
- [x] Karma Destiny Timeline (visual bar)
- [x] **Life phase overlays: Childhood → Spiritual Awakening** *(V34.1)*
- [x] **3 views: Timeline, Life Phases, Dasha Cycles** *(V34.1)*
- [x] Marriage and wealth cycle analysis

#### 📅 Panchang
- [x] Tithi (30 types), Yoga (27 types), Karana, Vara
- [x] Sunrise / Sunset calculation (location-aware)
- [x] Rahu Kala per weekday
- [x] Moon phase + illumination percentage
- [x] Auspicious Muhurtas of the day
- [x] Daily divine guidance + remedy

#### 🪬 Soul Profile *(V34.1)*
- [x] Soul evolution stage (6 stages: Infant → Transcendent)
- [x] 5 soul stat bars (Spiritual, Karmic, Dharmic, Love, Wealth)
- [x] Soul mission statement by Lagna sign
- [x] Atmakaraka (soul planet) calculation
- [x] Identity, Mission, Karma, Evolution tabs
- [x] Past life origin (Ketu) + Future direction (Rahu)

#### 🌅 Daily Guidance *(V34.1)*
- [x] AI-generated personalized daily guidance (Vedantic tone)
- [x] Daily mantra with deity, benefit, repetitions
- [x] 4 guided meditation techniques with step-by-step instructions
- [x] Built-in meditation timer (start / pause / reset)
- [x] Daily karma advice (changes every day)
- [x] Text-to-speech for all guidance

#### 🧘 Guru AI Chat
- [x] Claude Sonnet powered
- [x] Kundali context injected into every prompt
- [x] 6 languages: English, Hindi, Tamil, Telugu, Bengali, Sanskrit
- [x] Voice input (Web Speech API)
- [x] Voice output (SpeechSynthesis)
- [x] Quick question chips (personalized to chart)
- [x] Offline fallback responses

#### ✨ Share & Export *(V34.1)*
- [x] Visual soul card (star field, planet grid, dasha bar)
- [x] Download as high-res PNG (Instagram ready)
- [x] WhatsApp share with pre-formatted text
- [x] Instagram download + posting instructions
- [x] Copy link button
- [x] 3-page PDF report (jsPDF)
- [x] Plain text clipboard report

#### 🌟 Daily Horoscope
- [x] All 12 signs daily prediction
- [x] 5 scored dimensions (Love, Career, Health, Finance, Spiritual)
- [x] Lucky numbers, color, time
- [x] Deterministic (same for all users per day)
- [x] Auto-selects user's Lagna sign

#### 👥 Consultant Marketplace
- [x] 6 verified astrologer profiles
- [x] Specialty filters (7 categories)
- [x] Rating, reviews, badges
- [x] Book session with confirmation toast

---

## 5. Active Development — What's In Progress

> `[PM]` `[DEV-FE]` `[DEV-AI]`

### Current Sprint (V34.2 — Target: April 2026)

| # | Feature | Owner | Status | Notes |
|---|---------|-------|--------|-------|
| 1 | User auth (email login) | `[DEV-BE]` | 🔴 Not started | Supabase planned |
| 2 | Save + load kundali | `[DEV-BE]` | 🔴 Not started | Needs DB |
| 3 | Navamsha (D9) chart | `[DEV-FE]` `[ASTRO]` | 🔴 Not started | High priority |
| 4 | Transit overlay on natal | `[DEV-FE]` | 🔴 Not started | Stub exists |
| 5 | Mobile PWA install | `[DEV-FE]` `[OPS]` | 🟡 Planned | Add manifest.json |
| 6 | API key proxy (security) | `[DEV-BE]` `[OPS]` | 🔴 Critical | Key exposed in client |

> ⚠️ **CRITICAL for `[DEV-BE]`**: The Anthropic API key is currently set as `VITE_ANTHROPIC_API_KEY` which exposes it in the client bundle. Before any significant user growth, this must be proxied through a backend endpoint.

---

## 6. Roadmap — What's Coming

> `[FOUNDER]` `[PM]`

### V35 — Accuracy & Charts (Q2 2026)

> Owner: `[DEV-FE]` `[ASTRO]` `[DEV-BE]`

- [ ] Full VSOP87 planetary theory (arcsecond accuracy)
- [ ] Navamsha (D9) chart renderer
- [ ] Bhava Chalit chart
- [ ] Ashtakavarga scoring system
- [ ] User accounts + chart storage
- [ ] Mobile PWA (installable on phone)

### V36 — Relationships & Timing (Q3 2026)

> Owner: `[DEV-FE]` `[DEV-AI]` `[ASTRO]`

- [ ] Compatibility / Synastry chart (2 people)
- [ ] Birth time rectification tool
- [ ] Full transit overlay on natal chart
- [ ] Muhurta selection tool (auspicious timing picker)
- [ ] Prashna (Horary) astrology module
- [ ] Jaimini Dasha systems

### V37 — Monetization (Q4 2026)

> Owner: `[DEV-BE]` `[GROWTH]` `[OPS]`

- [ ] Stripe subscription payments
- [ ] Premium tier gating
- [ ] Live consultant video sessions
- [ ] Push notifications (Rahu Kala, daily panchang)
- [ ] Annual chart (Varshaphal / Solar Return)
- [ ] Remedies marketplace (gemstones, puja items)

### V38 — Scale (2027)

> Owner: `[OPS]` `[DEV-BE]` `[GROWTH]`

- [ ] B2B white-label API
- [ ] Mobile apps (React Native)
- [ ] Regional language full support (Malayalam, Kannada, Gujarati)
- [ ] Affiliate program for astrologers
- [ ] Real-time transit notifications

---

## 7. Design System & Brand

> `[DESIGN]` — This section is your ownership

### Color Palette

```css
/* Core */
--bg-deep:   #030108   /* App background — deepest space */
--bg-mid:    #0D0A1E   /* Card backgrounds */
--bg-card:   rgba(255,255,255,0.04)

/* Brand */
--accent:    #7C3AED   /* Primary purple — cosmic energy */
--gold:      #F59E0B   /* Gold — divine light, Guru */
--text-main: #E2D9F3   /* Soft lavender white */
--text-muted:#9CA3AF   /* Muted grey */
--border:    rgba(124,58,237,0.25)

/* Planet Colors (do not change — semantically significant) */
Sun:     #FF9933    Moon:    #B0C4DE    Mars:    #DC143C
Mercury: #32CD32    Jupiter: #FFD700    Venus:   #FF69B4
Saturn:  #708090    Rahu:    #9370DB    Ketu:    #CD853F
```

### Typography

| Use | Font | Weight |
|-----|------|--------|
| Headers, titles, nav | Cinzel (serif) | 400, 600, 700 |
| Body, UI, labels | Lato (sans-serif) | 300, 400, 700 |
| Code, planet abbreviations | monospace | — |

> **Rule for `[DESIGN]`**: Never use Inter, Roboto, or Arial. The Cinzel + Lato pairing is the soul of the brand.

### Design Principles

1. **Feels sacred, not commercial** — every interaction should feel like entering a temple
2. **Depth over flatness** — use layers, glows, gradients, blur effects
3. **Dark always** — no light mode; the cosmos is dark
4. **Gold for divinity** — gold (#F59E0B) marks anything spiritually significant
5. **Purple for cosmos** — #7C3AED is our cosmic energy color

### Component Patterns

```
Cards:       16px border-radius, backdrop-filter blur(8px)
Buttons:     20px border-radius (pill), gradient on primary
Panels:      slide in from right at 300-320px width
Badges:      20px border-radius, small text, colored border
Dividers:    gradient line (transparent → accent → transparent)
```

### Brand Voice (for `[CONTENT]`)

- **Tone**: Warm, wise, ancient, never cold or clinical
- **Address user as**: "dear seeker", "Vats" (son), "Putri" (daughter)
- **End messages with**: "Hari Om 🙏" or Sanskrit blessing
- **Avoid**: "data", "algorithm", "processing" — use "cosmic wisdom", "celestial map", "karmic blueprint"

---

## 8. Engineering Standards

> `[DEV-FE]` `[DEV-BE]` `[DEV-AI]` `[DEV-3D]` — Everyone follows this

### Code Conventions

```javascript
// ✅ Engine functions: pure JS, no React imports
export function calculateKundali(date, time, lat, lon, tz) { ... }

// ✅ Components: functional with hooks
export default function PlanetPanel({ planet, kundali, onClose }) { ... }

// ✅ File structure: feature-first naming
src/engines/        ← pure calculation logic (no UI)
src/components/     ← React components (no heavy math)
src/utils/          ← helpers, generators, exporters
src/hooks/          ← custom React hooks (future)
```

### State Management

```
Current: All state in CosmicTantraApp.jsx (useState)
Future (V36+): Zustand or Jotai for global state
              React Query for server state
```

> **Rule for `[DEV-FE]`**: Props flow down. Events bubble up. No prop-drilling beyond 2 levels — use context or lift to App level.

### Performance Rules

```
✅ Lazy-load SwargaLok (heavy Three.js bundle)
✅ useMemo for expensive calculations (planet scores, horoscope)
✅ useCallback on event handlers passed as props
❌ Never calculate Kundali on every render — only on form submit
❌ Never import all of three.js — import only what's needed
```

### Git Workflow

```bash
# Branch naming
feature/planet-click-panel
fix/dasha-calculation-offset
chore/update-dependencies
docs/add-api-documentation

# Commit format
feat: add clickable planet info panel
fix: correct Moon longitude calculation
docs: update JOURNAL.md with V34.1 changes
style: improve card hover glow effect
refactor: extract planet wisdom to constants file
```

> **Rule**: Never push directly to `main`. Always branch → PR → review → merge.
> **Solo exception (current)**: Direct push to main is acceptable until the team has 2+ members.

### Environment Variables

```bash
# .env.local (never commit this file)
VITE_ANTHROPIC_API_KEY=sk-ant-...   # Claude API key
VITE_APP_URL=http://localhost:5173   # Local URL

# Vercel production (set in dashboard)
VITE_ANTHROPIC_API_KEY=sk-ant-...   # Production key
```

> **Security note for `[DEV-BE]`**: `VITE_` prefix exposes vars in client bundle. When backend is built, move API calls to a server-side proxy and remove this prefix.

---

## 9. AI & Jyotish Accuracy Standards

> `[DEV-AI]` `[ASTRO]` — Joint ownership

### AI (Guru) Standards

#### System Prompt Philosophy
The Guru persona (`guruAI.js`) must:
- Always inject the user's full Kundali as context
- Never predict specific death dates or extreme misfortune
- Always frame challenges as growth opportunities
- End responses with a blessing or mantra
- Adjust language/tone to selected language setting

#### Prompt Review Process
> `[DEV-AI]` + `[ASTRO]` review all system prompt changes together.
> No unilateral prompt changes — they affect every user interaction.

#### Response Quality Checklist
- [ ] Addresses the seeker personally (Vats/Putri/Priya)
- [ ] References specific chart placements
- [ ] Includes at least one actionable remedy
- [ ] Ends with blessing or "Hari Om 🙏"
- [ ] Does not contradict classical Jyotish principles
- [ ] Appropriate for selected language

### Jyotish Accuracy Standards

> `[ASTRO]` — Own and enforce these standards

#### Current Accuracy (V34)

| Calculation | Method | Accuracy | Verified Against |
|-------------|--------|----------|-----------------|
| Sun longitude | VSOP approximation | ±0.5° | Jagannatha Hora |
| Moon longitude | ELP2000 simplified | ±1.5° | Jagannatha Hora |
| Mars/Jupiter/Saturn | Mean anomaly | ±1.5–2° | Astro.com |
| Lagna | GMST → LST formula | ±1.0° | Jagannatha Hora |
| Ayanamsha | Lahiri/Chitrapaksha | ±0.01° | Standard |
| Dasha | Vimshottari from Moon NAK | ±1 month | Manual calculation |

#### Accuracy Improvement Target (V35)
- Implement full VSOP87 for all planets (arcsecond accuracy)
- Add Koch and Placidus house systems as alternatives
- Add Krishnamurti Paddhati (KP) system

#### Classical Sources Referenced
- Brihat Parashara Hora Shastra (BPHS)
- Brihat Jataka (Varahamihira)
- Phaladeepika
- Saravali

#### Content Accuracy Rules
- All Nakshatra descriptions reviewed by `[ASTRO]`
- All remedies verified against classical texts
- No Western astrology mixing unless explicitly flagged
- Gemstone recommendations include consultation disclaimer

---

## 10. Infrastructure & DevOps

> `[OPS]` — This section is your ownership

### Current Setup (V34 — Simple)

```
Code    → GitHub (prabhakarmdes12-cmyk/CosmicTantra)
Build   → Vercel (auto-detects Vite, builds on every push to main)
Host    → Vercel CDN (global edge, free tier)
Domain  → cosmic-tantra.vercel.app (free Vercel subdomain)
SSL     → Automatic (Vercel)
API Key → Vercel Environment Variables
```

### Deployment Process (Current)

```bash
# Any push to main auto-deploys to production
git push origin main
# → Vercel builds in ~60 seconds
# → Live at cosmic-tantra.vercel.app
```

### Planned Infrastructure (V36+)

```
Frontend  → Vercel (keep, scale as needed)
Backend   → Railway or Render (Node.js API server)
Database  → Supabase (PostgreSQL + Auth + Storage)
Cache     → Redis (Upstash serverless)
CDN       → Cloudflare (custom domain, DDoS protection)
Monitoring→ Sentry (error tracking) + Vercel Analytics
```

### Domain Strategy

> `[OPS]` `[FOUNDER]`

```
Target domains to acquire:
cosmictantra.in       ← Primary India market
cosmictantra.app      ← Global premium
cosmictantra.com      ← Future (check availability)

Redirect chain:
cosmictantra.in → cosmictantra.app (canonical)
```

### Monitoring Checklist (Once Scale Matters)

- [ ] Uptime monitoring (UptimeRobot or Vercel)
- [ ] Error tracking (Sentry)
- [ ] API usage monitoring (Anthropic dashboard)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] API cost alerts (set budget limit in Anthropic console)

### Backup Strategy

```
Code     → GitHub (always backed up)
User data→ Supabase automatic backups (V36+)
Env vars → Vercel dashboard (owner keeps local copy)
```

---

## 11. Growth & Marketing Strategy

> `[GROWTH]` `[CONTENT]` `[DESIGN]` — Shared ownership

### Current Phase: Testing (Now → V35)

**Goal**: 500 real users giving feedback before monetization.

### Channels

| Channel | Strategy | Owner | Status |
|---------|---------|-------|--------|
| WhatsApp sharing | Built-in share card | `[DEV-FE]` ✅ | Live |
| Instagram | Soul card download + post | `[DEV-FE]` ✅ | Live |
| Word of mouth | Beautiful product speaks itself | `[ALL]` | Active |
| SEO | Vedic astrology content | `[CONTENT]` | Planned |
| YouTube | "How to read your Kundali" | `[CONTENT]` | Planned |
| Astrology communities | Reddit, Facebook groups | `[GROWTH]` | Planned |

### Viral Mechanics (Already Built)

1. **Soul Profile Card** — users download and share to Instagram/WhatsApp
2. **Daily Horoscope** — shareable prediction, changes daily
3. **AI Guru** — unique personalized experience worth sharing

### Content Calendar (for `[CONTENT]`)

```
Daily:   Share today's Panchang on social media
Weekly:  "Planet of the week" educational post
Monthly: "What does [Transit Event] mean for you?"
Special: Eclipse seasons, Guru Peyarchi, Sade Sati entry/exit
```

### SEO Keywords to Target (for `[CONTENT]`)

```
High intent:
- "free kundali online"
- "janma kundali calculator"
- "vedic birth chart"
- "vimshottari dasha calculator"
- "daily panchang today"

Long tail:
- "what does ketu in 7th house mean"
- "how to read north indian kundali"
- "sade sati 2026 effects"
```

---

## 12. Known Issues & Bug Tracker

> `[QA]` `[DEV-FE]` `[DEV-BE]`

### 🔴 Critical

| # | Issue | Impact | Owner | Fix Version |
|---|-------|--------|-------|-------------|
| C1 | API key exposed in VITE_ env var | Security — before growth phase | `[DEV-BE]` | V36 |
| C2 | No rate limiting on Guru AI chat | Cost overrun risk | `[DEV-BE]` | V35 |

### 🟡 Important

| # | Issue | Impact | Owner | Fix Version |
|---|-------|--------|-------|-------------|
| I1 | Planetary accuracy ±1.5–2° (simplified math) | Astro accuracy | `[DEV-AI]` `[ASTRO]` | V35 |
| I2 | No user accounts — charts lost on refresh | UX | `[DEV-BE]` | V35 |
| I3 | SwargaLok sometimes slow to load on mobile | Performance | `[DEV-3D]` | V35 |
| I4 | Voice input not working on iOS Safari | Feature | `[DEV-FE]` | V35 |
| I5 | PDF export fonts not loading correctly sometimes | Feature | `[DEV-FE]` | V34.2 |

### 🟢 Minor

| # | Issue | Impact | Owner | Fix Version |
|---|-------|--------|-------|-------------|
| M1 | Consultant marketplace is static (no real booking) | Feature incomplete | `[DEV-BE]` | V36 |
| M2 | No loading skeleton on Kundali generation | Polish | `[DEV-FE]` | V34.2 |
| M3 | Panchang location defaults to Patna regardless of form | UX | `[DEV-FE]` | V34.2 |

### How to Report a Bug

```
1. Open a GitHub Issue
2. Title: [BUG] Brief description
3. Include: Steps to reproduce, expected vs actual, screenshot
4. Tag: bug + relevant department label
```

---

## 13. Decision Log

> `[FOUNDER]` `[PM]` — Record all significant decisions here

### Why Anthropic Claude over OpenAI GPT?

**Date**: January 2026
**Decision**: Use Claude Sonnet for Guru AI
**Reason**: Better at nuanced, culturally sensitive content. Fewer hallucinations on Jyotish topics. More thoughtful persona maintenance.
**Trade-off**: Slightly slower than GPT-4o-mini. Acceptable for this use case.

### Why Vite over Next.js?

**Date**: January 2026
**Decision**: Pure Vite + React (SPA) over Next.js
**Reason**: No SEO needed for V1 (app behind form). Simpler deployment. Faster development iteration.
**Revisit**: V36 — migrate to Next.js for SEO, SSR, and API routes.

### Why Whole Sign house system?

**Date**: February 2026 (with `[ASTRO]` consultation)
**Decision**: Whole Sign as default house system
**Reason**: Most commonly used in Vedic/Parashari tradition. Unambiguous house assignments.
**Trade-off**: Some users prefer Bhava Chalit or KP. Will add options in V35.

### Why Lahiri Ayanamsha?

**Date**: February 2026
**Decision**: Lahiri (Chitrapaksha) as default
**Reason**: Official government of India standard. Most widely used in India. Default in Jagannatha Hora.
**Alternative**: KP Ayanamsha for V35 KP module.

### Why no backend in V34?

**Date**: March 2026
**Decision**: 100% client-side for V34
**Reason**: Fastest path to testing real user value. No DevOps overhead. Vercel free tier sufficient.
**Revisit**: Build backend when: (a) user auth needed, or (b) API key security becomes critical, whichever comes first.

---

## 14. Version History

> `[PM]` `[DEV-FE]` — Keep updated

| Version | Date | Key Features | Status |
|---------|------|-------------|--------|
| V1–V9 | Jan–Feb 2026 | Engine foundations | ✅ Complete |
| V10–V18 | Feb–Mar 2026 | Dasha, charts, soul matrix | ✅ Complete |
| V19–V28 | Mar 2026 | 3D scene, Guru AI, Panchang | ✅ Complete |
| V29–V33 | Mar 2026 | PDF, share, documentation | ✅ Complete |
| **V34** | Mar 2026 | **Full integration release** | ✅ **Live** |
| **V34.1** | Mar 2026 | **Clickable 3D planets, Soul Profile, Destiny phases, Share card, Daily Guidance** | ✅ **Live** |
| V34.2 | Apr 2026 | Bug fixes, PWA manifest, mobile polish | 🔵 Planned |
| V35 | Q2 2026 | VSOP87 accuracy, Navamsha, user accounts | 🔵 Planned |
| V36 | Q3 2026 | Compatibility, transits, Next.js migration | 🔵 Planned |
| V37 | Q4 2026 | Payments, premium tier, marketplace | 🔵 Planned |

---

## 🙏 For New Team Members

Welcome to CosmicTantra. This is not just a product — it is a digital temple.

Before writing a single line of code or design, please:

1. **Use the app** for 30 minutes at https://cosmic-tantra.vercel.app
2. **Generate your own Kundali** — feel what users feel
3. **Read this journal top to bottom** — understand what's been built and why
4. **Read the docs folder** — the V1–V34 journal explains every decision made
5. **Reach out to Prabhakar** before making any change to: engines, system prompts, or the design system

> *"Sarve Bhavantu Sukhinah — May all beings be happy."*
> Build this product with that prayer in your heart.

---

```
Last updated:  March 2026
Updated by:    Prabhakar (Founder / Solo Developer)
Next review:   When first team member joins

Document owner: [FOUNDER] → transfers to [PM] when PM is hired
```

---

*🕉️ Hari Om*
