/**
 * CosmicTantra V34 — Panchang Engine
 * Daily Vedic almanac: Tithi, Nakshatra, Yoga, Karana,
 * Vara (weekday), Rahu Kala, Auspicious muhurtas
 */

import { toJulianDay, getLahiriAyanamsha, getNakshatra, getRasi, RASIS } from './astrologyEngine.js';

// ─── TITHIS (Lunar Days) ──────────────────────────────────────────────────────

export const TITHIS = [
  { name: 'Pratipada', num: 1, quality: 'Nanda', meaning: 'Joy and new beginnings' },
  { name: 'Dwitiya', num: 2, quality: 'Bhadra', meaning: 'Good for stable work' },
  { name: 'Tritiya', num: 3, quality: 'Jaya', meaning: 'Victory and success' },
  { name: 'Chaturthi', num: 4, quality: 'Rikta', meaning: 'Emptiness; avoid new starts' },
  { name: 'Panchami', num: 5, quality: 'Purna', meaning: 'Completion and fulfillment' },
  { name: 'Shashthi', num: 6, quality: 'Nanda', meaning: 'Joy; good for travel' },
  { name: 'Saptami', num: 7, quality: 'Bhadra', meaning: 'Stable; good for long-term' },
  { name: 'Ashtami', num: 8, quality: 'Jaya', meaning: 'Victory over obstacles' },
  { name: 'Navami', num: 9, quality: 'Rikta', meaning: 'Avoid ceremonies today' },
  { name: 'Dashami', num: 10, quality: 'Purna', meaning: 'Abundance and completion' },
  { name: 'Ekadashi', num: 11, quality: 'Nanda', meaning: 'Spiritual fasting; highly auspicious' },
  { name: 'Dwadashi', num: 12, quality: 'Bhadra', meaning: 'Breaking fast; charity advised' },
  { name: 'Trayodashi', num: 13, quality: 'Jaya', meaning: 'Good for spiritual practice' },
  { name: 'Chaturdashi', num: 14, quality: 'Rikta', meaning: 'Lord Shiva honored; caution' },
  { name: 'Purnima', num: 15, quality: 'Purna', meaning: 'Full Moon; very auspicious' },
  { name: 'Pratipada (K)', num: 16, quality: 'Nanda', meaning: 'Krishna Paksha begins' },
  { name: 'Dwitiya (K)', num: 17, quality: 'Bhadra', meaning: 'Steady and stable' },
  { name: 'Tritiya (K)', num: 18, quality: 'Jaya', meaning: 'Good for courage' },
  { name: 'Chaturthi (K)', num: 19, quality: 'Rikta', meaning: 'Ganesh day; avoid new work' },
  { name: 'Panchami (K)', num: 20, quality: 'Purna', meaning: 'Complete tasks at hand' },
  { name: 'Shashthi (K)', num: 21, quality: 'Nanda', meaning: 'Murugan day; auspicious' },
  { name: 'Saptami (K)', num: 22, quality: 'Bhadra', meaning: 'Good for healing' },
  { name: 'Ashtami (K)', num: 23, quality: 'Jaya', meaning: 'Victory; avoid conflict' },
  { name: 'Navami (K)', num: 24, quality: 'Rikta', meaning: 'Difficult; be cautious' },
  { name: 'Dashami (K)', num: 25, quality: 'Purna', meaning: 'Abundance waning; be mindful' },
  { name: 'Ekadashi (K)', num: 26, quality: 'Nanda', meaning: 'Spiritual fasting advised' },
  { name: 'Dwadashi (K)', num: 27, quality: 'Bhadra', meaning: 'Good for charity' },
  { name: 'Trayodashi (K)', num: 28, quality: 'Jaya', meaning: 'Pradosh fast' },
  { name: 'Chaturdashi (K)', num: 29, quality: 'Rikta', meaning: 'Shivaratri observance' },
  { name: 'Amavasya', num: 30, quality: 'Purna', meaning: 'New Moon; ancestral rites' },
];

// ─── YOGAS ────────────────────────────────────────────────────────────────────

export const YOGAS = [
  { name: 'Vishkambha', quality: 'Inauspicious', meaning: 'Obstacles possible' },
  { name: 'Priti', quality: 'Auspicious', meaning: 'Love and affection' },
  { name: 'Ayushman', quality: 'Auspicious', meaning: 'Longevity and health' },
  { name: 'Saubhagya', quality: 'Auspicious', meaning: 'Good fortune' },
  { name: 'Shobhana', quality: 'Auspicious', meaning: 'Beauty and grace' },
  { name: 'Atiganda', quality: 'Inauspicious', meaning: 'Obstacles; be careful' },
  { name: 'Sukarma', quality: 'Auspicious', meaning: 'Good deeds rewarded' },
  { name: 'Dhriti', quality: 'Auspicious', meaning: 'Resolve and determination' },
  { name: 'Shula', quality: 'Inauspicious', meaning: 'Sharp challenges' },
  { name: 'Ganda', quality: 'Inauspicious', meaning: 'Knots and complications' },
  { name: 'Vriddhi', quality: 'Auspicious', meaning: 'Growth and increase' },
  { name: 'Dhruva', quality: 'Auspicious', meaning: 'Stability and permanence' },
  { name: 'Vyaghata', quality: 'Inauspicious', meaning: 'Clashes and conflicts' },
  { name: 'Harshana', quality: 'Auspicious', meaning: 'Joy and happiness' },
  { name: 'Vajra', quality: 'Mixed', meaning: 'Strong but sharp energy' },
  { name: 'Siddhi', quality: 'Auspicious', meaning: 'Accomplishment and success' },
  { name: 'Vyatipata', quality: 'Inauspicious', meaning: 'Misfortune possible' },
  { name: 'Variyana', quality: 'Auspicious', meaning: 'Comfort and happiness' },
  { name: 'Parigha', quality: 'Inauspicious', meaning: 'Barriers and obstacles' },
  { name: 'Shiva', quality: 'Auspicious', meaning: 'Auspiciousness of Shiva' },
  { name: 'Siddha', quality: 'Auspicious', meaning: 'Perfection and mastery' },
  { name: 'Sadhya', quality: 'Auspicious', meaning: 'Achievable goals' },
  { name: 'Shubha', quality: 'Auspicious', meaning: 'Pure auspiciousness' },
  { name: 'Shukla', quality: 'Auspicious', meaning: 'Purity and brightness' },
  { name: 'Brahma', quality: 'Auspicious', meaning: 'Creative divine energy' },
  { name: 'Indra', quality: 'Auspicious', meaning: 'Kingly power and victory' },
  { name: 'Vaidhriti', quality: 'Inauspicious', meaning: 'Avoid major decisions' },
];

// ─── KARANAS (Half Tithis) ────────────────────────────────────────────────────

export const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 'Vanija', 'Vishti',
  'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
];

export const KARANA_QUALITY = {
  Vishti: 'Inauspicious (Bhadra) — avoid major work',
  Shakuni: 'Semi-auspicious',
  Chatushpada: 'Moderately favorable',
  Naga: 'Avoid new beginnings',
  Kimstughna: 'Mixed',
};

// ─── VARA (WEEKDAY) ──────────────────────────────────────────────────────────

export const VARAS = [
  { name: 'Ravivara', day: 'Sunday', planet: 'Sun', color: 'Gold', deity: 'Surya', fast: 'Optional' },
  { name: 'Somavara', day: 'Monday', planet: 'Moon', color: 'White', deity: 'Shiva', fast: 'For Shiva blessings' },
  { name: 'Mangalavara', day: 'Tuesday', planet: 'Mars', color: 'Red', deity: 'Hanuman', fast: 'For strength' },
  { name: 'Budhavara', day: 'Wednesday', planet: 'Mercury', color: 'Green', deity: 'Vishnu', fast: 'For wisdom' },
  { name: 'Guruvara', day: 'Thursday', planet: 'Jupiter', color: 'Yellow', deity: 'Brihaspati', fast: 'For prosperity' },
  { name: 'Shukravara', day: 'Friday', planet: 'Venus', color: 'Pink', deity: 'Lakshmi', fast: 'For love & wealth' },
  { name: 'Shanivara', day: 'Saturday', planet: 'Saturn', color: 'Blue/Black', deity: 'Shani', fast: 'For karma relief' },
];

// ─── RAHU KALA CHART ─────────────────────────────────────────────────────────
// Each day divided into 8 periods of 90 min each; Rahu Kala varies by day
// Format: [start_period, end_period] out of 8 segments of the day

export const RAHU_KALA_SLOTS = {
  Sunday: 8,    // 4:30–6:00 PM
  Monday: 2,    // 7:30–9:00 AM
  Tuesday: 7,   // 3:00–4:30 PM
  Wednesday: 5, // 12:00–1:30 PM
  Thursday: 6,  // 1:30–3:00 PM
  Friday: 4,    // 10:30–12:00 PM
  Saturday: 3,  // 9:00–10:30 AM
};

// ─── CORE PANCHANG CALCULATOR ─────────────────────────────────────────────────

export function calculatePanchang(date, latitudeDeg = 25.5941, longitudeDeg = 85.1376, timezoneOffset = 5.5) {
  const JD = toJulianDay(date);
  const T = (JD - 2451545.0) / 36525;
  const ayanamsha = getLahiriAyanamsha(JD);

  // Approximate Sun and Moon longitudes (sidereal)
  const sunTropical = normAngle(280.46646 + 36000.76983 * T);
  const moonTropical = normAngle(218.3165 + 481267.8813 * T);
  const sunLon = normAngle(sunTropical - ayanamsha);
  const moonLon = normAngle(moonTropical - ayanamsha);

  // ── Tithi ──
  let elongation = normAngle(moonLon - sunLon);
  const tithiNum = Math.floor(elongation / 12);
  const tithiDeg = elongation % 12;
  const tithi = TITHIS[tithiNum % 30];
  const tithiRemainingPct = Math.round((1 - tithiDeg / 12) * 100);

  // ── Nakshatra ──
  const moonNak = getNakshatra(moonLon);
  const sunNak = getNakshatra(sunLon);

  // ── Yoga (Sun + Moon longitude / 13.333) ──
  const yogaLon = normAngle(sunLon + moonLon);
  const yogaIdx = Math.floor(yogaLon / 13.3333) % 27;
  const yoga = YOGAS[yogaIdx];

  // ── Karana (half-tithi) ──
  const karanaIdx = Math.floor(elongation / 6) % 11;
  const karana = KARANAS[karanaIdx];
  const karanaQuality = KARANA_QUALITY[karana] || 'Favorable';

  // ── Vara ──
  const dayOfWeek = date.getDay(); // 0=Sunday
  const vara = VARAS[dayOfWeek];

  // ── Sunrise / Sunset approximation ──
  const { sunrise, sunset } = approximateSunriseSunset(date, latitudeDeg, longitudeDeg, timezoneOffset);

  // ── Rahu Kala ──
  const rahuKala = calculateRahuKala(sunrise, sunset, vara.day);

  // ── Moon Phase ──
  const moonPhase = getMoonPhase(elongation);

  // ── Paksha ──
  const paksha = elongation < 180 ? 'Shukla Paksha (Bright Half)' : 'Krishna Paksha (Dark Half)';

  // ── Auspicious Muhurtas ──
  const muhurtas = getAuspiciousMuhurtas(yoga.quality, tithi.quality, vara.day);

  // ── Daily Guidance ──
  const guidance = getDailyGuidance(tithi, yoga, vara, moonNak);

  return {
    date: date.toDateString(),
    tithi: {
      ...tithi,
      remaining: `${tithiRemainingPct}%`,
    },
    nakshatra: {
      ...moonNak,
      sunNakshatra: sunNak.name,
    },
    yoga,
    karana: { name: karana, quality: karanaQuality },
    vara,
    paksha,
    moonPhase,
    sunrise,
    sunset,
    rahuKala,
    moonLongitude: parseFloat(moonLon.toFixed(2)),
    sunLongitude: parseFloat(sunLon.toFixed(2)),
    ayanamsha: parseFloat(ayanamsha.toFixed(4)),
    muhurtas,
    guidance,
  };
}

function normAngle(a) {
  return ((a % 360) + 360) % 360;
}

// ─── SUNRISE / SUNSET ────────────────────────────────────────────────────────

function approximateSunriseSunset(date, lat, lon, tzOffset) {
  const JD = toJulianDay(date);
  const T = (JD - 2451545.0) / 36525;
  const solarNoon = 12 - lon / 15 + tzOffset;

  // Declination
  const L = normAngle(280.460 + 36000.771 * T);
  const g = normAngle(357.528 + 35999.050 * T);
  const lambdaSun = L + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180);
  const eps = 23.439 - 0.013 * T;
  const decl = Math.asin(Math.sin(eps * Math.PI / 180) * Math.sin(lambdaSun * Math.PI / 180)) * 180 / Math.PI;

  // Hour angle
  const latR = lat * Math.PI / 180;
  const declR = decl * Math.PI / 180;
  const cosH = (Math.sin(-0.8333 * Math.PI / 180) - Math.sin(latR) * Math.sin(declR)) /
    (Math.cos(latR) * Math.cos(declR));

  if (Math.abs(cosH) > 1) return { sunrise: '06:00', sunset: '18:00' };

  const H = Math.acos(cosH) * 180 / Math.PI / 15;
  const srH = solarNoon - H;
  const ssH = solarNoon + H;

  return {
    sunrise: formatTime(srH),
    sunset: formatTime(ssH),
  };
}

function formatTime(decimalHours) {
  const h = Math.floor(decimalHours) % 24;
  const m = Math.round((decimalHours % 1) * 60);
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

// ─── RAHU KALA ────────────────────────────────────────────────────────────────

function calculateRahuKala(sunrise, sunset, dayName) {
  const [srH, srM] = sunrise.split(':').map(Number);
  const [ssH, ssM] = sunset.split(':').map(Number);
  const dayLen = (ssH * 60 + ssM) - (srH * 60 + srM);
  const segLen = dayLen / 8;

  const slot = RAHU_KALA_SLOTS[dayName] || 2;
  const start = srH * 60 + srM + (slot - 1) * segLen;
  const end = start + segLen;

  return {
    start: formatTime(start / 60),
    end: formatTime(end / 60),
    caution: 'Avoid important beginnings during Rahu Kala',
  };
}

// ─── MOON PHASE ──────────────────────────────────────────────────────────────

function getMoonPhase(elongation) {
  if (elongation < 12) return { name: 'New Moon (Amavasya)', icon: '🌑', illumination: 0 };
  if (elongation < 90) return { name: 'Waxing Crescent', icon: '🌒', illumination: Math.round((elongation / 180) * 100) };
  if (elongation < 102) return { name: 'First Quarter', icon: '🌓', illumination: 50 };
  if (elongation < 168) return { name: 'Waxing Gibbous', icon: '🌔', illumination: Math.round((elongation / 180) * 100) };
  if (elongation < 192) return { name: 'Full Moon (Purnima)', icon: '🌕', illumination: 100 };
  if (elongation < 270) return { name: 'Waning Gibbous', icon: '🌖', illumination: Math.round(((360 - elongation) / 180) * 100) };
  if (elongation < 282) return { name: 'Last Quarter', icon: '🌗', illumination: 50 };
  return { name: 'Waning Crescent', icon: '🌘', illumination: Math.round(((360 - elongation) / 180) * 100) };
}

// ─── MUHURTAS ────────────────────────────────────────────────────────────────

function getAuspiciousMuhurtas(yogaQuality, tithiQuality, dayName) {
  const list = [];
  if (yogaQuality === 'Auspicious') list.push('Brahma Muhurta (4:24–5:12 AM) — excellent for sadhana');
  if (tithiQuality === 'Purna' || tithiQuality === 'Jaya') {
    list.push('Vijaya Muhurta (2:24–3:12 PM) — good for victories');
  }
  if (['Thursday', 'Friday', 'Wednesday'].includes(dayName)) {
    list.push('Morning window (9:00–11:00 AM) — favorable for beginnings');
  }
  if (tithiQuality === 'Nanda') {
    list.push('Godhuli Muhurta (dusk time) — auspicious for prayer');
  }
  if (list.length === 0) list.push('Brahma Muhurta (4:24–5:12 AM) — always auspicious for prayer');
  return list;
}

// ─── DAILY GUIDANCE ───────────────────────────────────────────────────────────

function getDailyGuidance(tithi, yoga, vara, moonNak) {
  const tithiMsg = tithi.quality === 'Purna' || tithi.quality === 'Jaya'
    ? 'The lunar energy is strong and supportive today. Begin new ventures with confidence.'
    : tithi.quality === 'Rikta'
    ? 'Rikta Tithi advises caution. Complete existing tasks rather than starting new ones.'
    : 'A balanced day with steady energy. Progress on current goals.';

  const nakMsg = `Moon in ${moonNak.name} (${moonNak.ruler} ruled) — ${getNakshatraGuidance(moonNak.name)}`;

  const varaMsg = `${vara.day} is ruled by ${vara.planet}. ${getVaraGuidance(vara.day)}`;

  const remedy = getDailyRemedy(vara.day, moonNak.name);

  return {
    overall: tithiMsg,
    nakshatra: nakMsg,
    vara: varaMsg,
    remedy,
    mantras: getDailyMantras(vara.planet),
    colors: vara.color,
  };
}

function getNakshatraGuidance(nakName) {
  const guide = {
    Ashwini: 'Quick actions and healing are favored. Move swiftly.',
    Bharani: 'Creative work and transformation. Embrace change.',
    Krittika: 'Sharp clarity and cutting through illusions. Be direct.',
    Rohini: 'Growth, beauty, and abundance. Plant seeds today.',
    Mrigashira: 'Seek, explore, and investigate. Follow curiosity.',
    Ardra: 'Deep transformation through storms. Breakthrough possible.',
    Punarvasu: 'Return to basics. Home, family, and renewal.',
    Pushya: 'Nourishment and care. Give and receive with grace.',
    Ashlesha: 'Hidden powers surface. Trust your intuition deeply.',
    Magha: 'Ancestral honor and authority. Act with dignity.',
    'Purva Phalguni': 'Pleasure, rest, and love. Celebrate today.',
    'Uttara Phalguni': 'Contracts, agreements, and service. Help others.',
    Hasta: 'Skill, craft, and healing hands. Practical work excels.',
    Chitra: 'Creativity and artistic work shines. Build something beautiful.',
    Swati: 'Freedom, independence, and wind. Go with the flow.',
    Vishakha: 'Goals and purposeful action. Stay focused on the target.',
    Anuradha: 'Devotion, friendship, and teamwork. Collaborate.',
    Jyeshtha: 'Power and seniority. Protect those in your care.',
    Mula: 'Root causes and foundations. Dig deep today.',
    'Purva Ashadha': 'Victory and invincibility. Declare your intent.',
    'Uttara Ashadha': 'Permanent victories. Build lasting foundations.',
    Shravana: 'Listen and learn. Wisdom through hearing and travel.',
    Dhanishtha: 'Wealth, music, and abundance. Create and expand.',
    Shatabhisha: 'Healing, mystery, and solitude. Seek inner truth.',
    'Purva Bhadrapada': 'Fiery transformation and intensity. Channel wisely.',
    'Uttara Bhadrapada': 'Depth, karmic wisdom, and rain. Reflect inward.',
    Revati: "Journey's end and new beginnings. Complete cycles.",
  };
  return guide[nakName] || 'A day for introspection and gentle progress.';
}

function getVaraGuidance(day) {
  const guide = {
    Sunday: 'Honor the Sun — father, authority, health. Ideal for government tasks.',
    Monday: 'Honor the Moon — emotions, water, mind. Great for spiritual work.',
    Tuesday: 'Honor Mars — courage and drive. Ideal for active physical work.',
    Wednesday: 'Honor Mercury — business, communication, education. Excellent day.',
    Thursday: 'Honor Jupiter — dharma and prosperity. Best day for all auspicious works.',
    Friday: 'Honor Venus — love, beauty, wealth. Perfect for relationships and art.',
    Saturday: 'Honor Saturn — service and patience. Karmic debts can be cleared.',
  };
  return guide[day] || 'A sacred day for reflection.';
}

function getDailyRemedy(day, nakName) {
  const remedies = {
    Sunday: 'Offer red flowers to Surya at sunrise. Chant Aditya Hridayam.',
    Monday: 'Offer milk to Shivalinga. Chant Om Namah Shivaya 108 times.',
    Tuesday: 'Offer red flowers to Hanuman. Chant Hanuman Chalisa.',
    Wednesday: 'Light incense for Ganesha. Chant Om Gam Ganapataye Namaha.',
    Thursday: 'Wear yellow. Offer yellow flowers to Jupiter/Vishnu.',
    Friday: 'Offer white flowers to Lakshmi. Light rose incense.',
    Saturday: 'Light sesame oil lamp for Shani. Chant Shani Stotra.',
  };
  return remedies[day] || 'Meditate at sunrise for daily blessings.';
}

function getDailyMantras(planet) {
  const mantras = {
    Sun: ['Om Suryaya Namaha', 'Om Hraam Hreem Hraum Sah Suryaya Namah'],
    Moon: ['Om Chandraya Namaha', 'Om Shram Shreem Shraum Sah Chandraya Namah'],
    Mars: ['Om Angarakaya Namaha', 'Om Kraam Kreem Kraum Sah Bhaumaaya Namah'],
    Mercury: ['Om Budhaya Namaha', 'Om Braam Breem Braum Sah Budhaya Namah'],
    Jupiter: ['Om Gurave Namaha', 'Om Graam Greem Graum Sah Guruve Namah'],
    Venus: ['Om Shukraya Namaha', 'Om Draam Dreem Draum Sah Shukraya Namah'],
    Saturn: ['Om Shanaye Namaha', 'Om Praam Preem Praum Sah Shanaischaraya Namah'],
  };
  return mantras[planet] || ['Om Namah Shivaya'];
}

// ─── WEEKLY PANCHANG ──────────────────────────────────────────────────────────

export function calculateWeeklyPanchang(startDate, lat = 25.5941, lon = 85.1376, tz = 5.5) {
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    week.push(calculatePanchang(d, lat, lon, tz));
  }
  return week;
}

export default {
  calculatePanchang,
  calculateWeeklyPanchang,
  TITHIS,
  YOGAS,
  KARANAS,
  VARAS,
  RAHU_KALA_SLOTS,
};
