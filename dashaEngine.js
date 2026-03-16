/**
 * CosmicTantra V34 — Dasha Engine
 * Vimshottari Dasha system: planetary period cycles,
 * marriage timings, wealth cycles, karma timeline
 */

import { getNakshatra } from './astrologyEngine.js';

// ─── VIMSHOTTARI DASHA YEARS ────────────────────────────────────────────────

export const DASHA_YEARS = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

export const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export const TOTAL_CYCLE_YEARS = 120; // Sum of all dasha years

// Antardasha (sub-period) proportions — same order starting from the mahadasha planet
function getAntardashaOrder(mahaDasha) {
  const idx = DASHA_ORDER.indexOf(mahaDasha);
  return [...DASHA_ORDER.slice(idx), ...DASHA_ORDER.slice(0, idx)];
}

// ─── DASHA CALCULATION ───────────────────────────────────────────────────────

/**
 * Calculate Vimshottari Dasha from Moon Nakshatra at birth
 * @param {Object} moonNakshatra - from astrologyEngine.getNakshatra(moonLon)
 * @param {Date} birthDate
 */
export function calculateVimshottariDasha(moonNakshatra, birthDate) {
  const birth = new Date(birthDate);

  // Elapsed time in nakshatra (0–1 fraction)
  const nakLen = 13.3333; // degrees per nakshatra
  const elapsed = moonNakshatra.degree / nakLen; // fraction elapsed

  // Starting dasha planet = nakshatra ruler
  const startPlanet = moonNakshatra.ruler;
  const startIdx = DASHA_ORDER.indexOf(startPlanet);

  // Remaining years in first dasha
  const remainingInFirst = DASHA_YEARS[startPlanet] * (1 - elapsed);

  const dashas = [];
  let currentDate = new Date(birth);

  // First (partial) dasha
  const endFirst = new Date(currentDate);
  endFirst.setFullYear(endFirst.getFullYear() + Math.floor(remainingInFirst));
  endFirst.setMonth(endFirst.getMonth() + Math.round((remainingInFirst % 1) * 12));

  dashas.push({
    planet: startPlanet,
    startDate: new Date(currentDate),
    endDate: new Date(endFirst),
    years: parseFloat(remainingInFirst.toFixed(2)),
    isPartial: true,
    antardashas: calculateAntardashas(startPlanet, currentDate, remainingInFirst),
    theme: getDashaTheme(startPlanet),
    color: getDashaColor(startPlanet),
  });
  currentDate = new Date(endFirst);

  // Remaining full dashas (2+ cycles to cover ~150 years)
  let dashaIdx = (startIdx + 1) % 9;
  for (let cycle = 0; cycle < 2; cycle++) {
    for (let i = 0; i < 9; i++) {
      const planet = DASHA_ORDER[(dashaIdx + i) % 9];
      const years = DASHA_YEARS[planet];
      const startD = new Date(currentDate);
      const endD = new Date(currentDate);
      endD.setFullYear(endD.getFullYear() + Math.floor(years));
      endD.setMonth(endD.getMonth() + Math.round((years % 1) * 12));

      dashas.push({
        planet,
        startDate: new Date(startD),
        endDate: new Date(endD),
        years,
        isPartial: false,
        antardashas: calculateAntardashas(planet, startD, years),
        theme: getDashaTheme(planet),
        color: getDashaColor(planet),
      });
      currentDate = new Date(endD);
    }
    dashaIdx = 0;
  }

  return dashas;
}

function calculateAntardashas(mahaDasha, startDate, totalYears) {
  const order = getAntardashaOrder(mahaDasha);
  const antardashas = [];
  let current = new Date(startDate);

  for (const planet of order) {
    const proportion = DASHA_YEARS[planet] / TOTAL_CYCLE_YEARS;
    const yearsDuration = totalYears * proportion;
    const end = new Date(current);
    end.setFullYear(end.getFullYear() + Math.floor(yearsDuration));
    end.setMonth(end.getMonth() + Math.round((yearsDuration % 1) * 12));

    antardashas.push({
      planet,
      startDate: new Date(current),
      endDate: new Date(end),
      years: parseFloat(yearsDuration.toFixed(2)),
      theme: getAntardashaTheme(mahaDasha, planet),
    });
    current = new Date(end);
  }
  return antardashas;
}

// ─── CURRENT DASHA ────────────────────────────────────────────────────────────

export function getCurrentDasha(dashas, referenceDate = new Date()) {
  const now = referenceDate;
  for (const dasha of dashas) {
    if (now >= dasha.startDate && now <= dasha.endDate) {
      const antardasha = dasha.antardashas?.find(a => now >= a.startDate && now <= a.endDate);
      const totalMs = dasha.endDate - dasha.startDate;
      const elapsedMs = now - dasha.startDate;
      const percentDone = Math.round((elapsedMs / totalMs) * 100);
      return { ...dasha, antardasha, percentDone };
    }
  }
  return null;
}

// ─── KARMA TIMELINE ──────────────────────────────────────────────────────────

export function generateKarmaTimeline(dashas, birthDate) {
  const birth = new Date(birthDate);
  const timeline = [];

  for (const dasha of dashas) {
    const startAge = Math.round((dasha.startDate - birth) / (365.25 * 24 * 3600 * 1000));
    const endAge = Math.round((dasha.endDate - birth) / (365.25 * 24 * 3600 * 1000));

    if (startAge > 100) break;

    timeline.push({
      period: `${dasha.planet} Dasha`,
      ageRange: `${Math.max(0, startAge)}–${endAge}`,
      startAge: Math.max(0, startAge),
      endAge,
      years: dasha.years,
      planet: dasha.planet,
      theme: dasha.theme,
      color: dasha.color,
      events: getPredictedEvents(dasha.planet, startAge, endAge),
    });
  }
  return timeline;
}

function getPredictedEvents(planet, startAge, endAge) {
  const events = [];
  const midAge = Math.round((startAge + endAge) / 2);

  const eventMap = {
    Sun: ['Career recognition', 'Father-related events', 'Government recognition', 'Leadership emergence'],
    Moon: ['Emotional transformation', 'Mother-related events', 'Property acquisition', 'Mental growth'],
    Mars: ['Physical energy surge', 'Conflict and resolution', 'Sibling events', 'Property disputes'],
    Mercury: ['Education focus', 'Travel & communication', 'Business negotiations', 'Mental acuity peak'],
    Jupiter: ['Marriage potential', 'Children blessings', 'Spiritual awakening', 'Wealth expansion'],
    Venus: ['Romance & marriage', 'Artistic expression', 'Luxury acquisitions', 'Social expansion'],
    Saturn: ['Hard work period', 'Karmic lessons', 'Career foundation', 'Spiritual maturity'],
    Rahu: ['Sudden changes', 'Foreign connections', 'Obsessive pursuits', 'Material ambitions'],
    Ketu: ['Spiritual seeking', 'Past karma resolution', 'Detachment phase', 'Inner wisdom'],
  };

  const pool = eventMap[planet] || [];
  pool.forEach((e, i) => {
    events.push({
      age: startAge + Math.floor((i / pool.length) * (endAge - startAge)),
      event: e,
    });
  });
  return events;
}

// ─── MARRIAGE & WEALTH CYCLES ─────────────────────────────────────────────────

export function getMarriageCycles(dashas, birthDate) {
  const favorablePlanets = ['Venus', 'Jupiter', 'Moon'];
  const birth = new Date(birthDate);

  return dashas
    .filter(d => favorablePlanets.includes(d.planet))
    .map(d => {
      const startAge = Math.round((d.startDate - birth) / (365.25 * 24 * 3600 * 1000));
      const endAge = Math.round((d.endDate - birth) / (365.25 * 24 * 3600 * 1000));
      const bestAge = startAge + Math.floor((endAge - startAge) * 0.3);
      return {
        period: `${d.planet} Dasha`,
        planet: d.planet,
        startAge, endAge, bestAge,
        favorability: d.planet === 'Venus' ? 'Highest' : d.planet === 'Jupiter' ? 'High' : 'Moderate',
        note: getMarriageNote(d.planet),
      };
    })
    .filter(d => d.startAge < 65 && d.endAge > 16)
    .slice(0, 4);
}

function getMarriageNote(planet) {
  const notes = {
    Venus: 'Venus dasha is the prime period for romance and marriage. A beautiful, harmonious union is indicated.',
    Jupiter: 'Jupiter blesses with a wise, auspicious partner. Marriage here brings prosperity and children.',
    Moon: 'Moon dasha brings emotional bonds and family-focused unions. A nurturing partner is indicated.',
  };
  return notes[planet] || 'Favorable conditions for partnership.';
}

export function getWealthCycles(dashas, birthDate) {
  const wealthPlanets = ['Jupiter', 'Venus', 'Mercury', 'Sun'];
  const birth = new Date(birthDate);

  return dashas
    .filter(d => wealthPlanets.includes(d.planet))
    .map(d => {
      const startAge = Math.round((d.startDate - birth) / (365.25 * 24 * 3600 * 1000));
      const endAge = Math.round((d.endDate - birth) / (365.25 * 24 * 3600 * 1000));
      return {
        period: `${d.planet} Dasha`,
        planet: d.planet,
        startAge, endAge,
        wealthType: getWealthType(planet),
        intensity: d.planet === 'Jupiter' ? 'Expansive' : d.planet === 'Venus' ? 'Luxurious' : 'Steady',
      };
    })
    .filter(d => d.startAge < 80)
    .slice(0, 5);
}

function getWealthType(planet) {
  const types = {
    Jupiter: 'Expansion through wisdom, investments, and blessings',
    Venus: 'Luxury, arts, property, and pleasurable gains',
    Mercury: 'Business, trade, communication, and intellect',
    Sun: 'Government, career advancement, and recognition',
  };
  return types[planet] || 'General prosperity';
}

// ─── DASHA THEMES & COLORS ────────────────────────────────────────────────────

export function getDashaTheme(planet) {
  const themes = {
    Sun: 'Soul identity, father, authority, career peaks. Time to shine your inner light.',
    Moon: 'Emotions, mother, mind, home. The inner world takes center stage.',
    Mars: 'Energy, courage, ambition, conflicts. Take action — be the warrior.',
    Mercury: 'Intelligence, communication, education, trade. Your mind leads the way.',
    Jupiter: 'Wisdom, expansion, dharma, children. Blessings flow abundantly.',
    Venus: 'Love, beauty, luxury, relationships. The heart opens and flourishes.',
    Saturn: 'Discipline, karma, patience, lessons. Hard work yields lasting rewards.',
    Rahu: 'Ambition, illusion, foreign, sudden changes. Break beyond your boundaries.',
    Ketu: 'Spirituality, detachment, past karma. Let go and discover true freedom.',
  };
  return themes[planet] || 'A period of karmic unfolding.';
}

export function getDashaColor(planet) {
  const colors = {
    Sun: '#FF6B35',
    Moon: '#B8C9E1',
    Mars: '#E63946',
    Mercury: '#52B788',
    Jupiter: '#F4A261',
    Venus: '#E9C46A',
    Saturn: '#6C757D',
    Rahu: '#8B5CF6',
    Ketu: '#A8553D',
  };
  return colors[planet] || '#8B7355';
}

function getAntardashaTheme(mahadasha, antardasha) {
  if (mahadasha === antardasha) return `Concentrated ${mahadasha} energy — peak manifestation of this dasha's themes.`;
  const harmonious = {
    'Sun-Moon': 'Harmony between ego and emotions. Family + career balance.',
    'Sun-Jupiter': 'Blessings of dharma, career recognition, and spiritual expansion.',
    'Moon-Jupiter': 'Emotional wisdom. Family blessings. Excellent for relationships.',
    'Jupiter-Venus': 'Wealth and romance peak. Spiritual love and material abundance.',
    'Venus-Mercury': 'Creative communication and business blossoms.',
    'Saturn-Mercury': 'Disciplined intelligence. Great for studies and career planning.',
  };
  const key1 = `${mahadasha}-${antardasha}`;
  const key2 = `${antardasha}-${mahadasha}`;
  return harmonious[key1] || harmonious[key2] || `${antardasha} colors the ${mahadasha} period with its unique energy.`;
}

// ─── SOUL AGE CALCULATOR ──────────────────────────────────────────────────────

export function getSoulAge(dashas, birthDate) {
  // Soul age = which cycle of Vimshottari we're in (higher = older soul)
  const birth = new Date(birthDate);
  const now = new Date();
  const ageInYears = (now - birth) / (365.25 * 24 * 3600 * 1000);
  const cycleNumber = Math.floor(ageInYears / 120) + 1;
  return {
    physicalAge: Math.round(ageInYears),
    cyclicAge: cycleNumber,
    soulMaturity: cycleNumber >= 2 ? 'Evolved Soul' : 'Young Soul in Formation',
    cosmicYear: Math.round(ageInYears % 120),
  };
}

export default {
  calculateVimshottariDasha,
  getCurrentDasha,
  generateKarmaTimeline,
  getMarriageCycles,
  getWealthCycles,
  getDashaTheme,
  getDashaColor,
  getSoulAge,
  DASHA_YEARS,
  DASHA_ORDER,
};
