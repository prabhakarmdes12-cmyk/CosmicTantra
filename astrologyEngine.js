/**
 * CosmicTantra V34 — Astrology Engine
 * Vedic / Jyotish planetary calculation engine
 * Implements: Lagna, planetary longitudes, house assignments,
 * Nakshatra, rasi, aspects, North/South Indian chart data
 */

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

export const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export const RASIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const RASI_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export const NAKSHATRAS = [
  { name: 'Ashwini', ruler: 'Ketu', start: 0 },
  { name: 'Bharani', ruler: 'Venus', start: 13.333 },
  { name: 'Krittika', ruler: 'Sun', start: 26.666 },
  { name: 'Rohini', ruler: 'Moon', start: 40 },
  { name: 'Mrigashira', ruler: 'Mars', start: 53.333 },
  { name: 'Ardra', ruler: 'Rahu', start: 66.666 },
  { name: 'Punarvasu', ruler: 'Jupiter', start: 80 },
  { name: 'Pushya', ruler: 'Saturn', start: 93.333 },
  { name: 'Ashlesha', ruler: 'Mercury', start: 106.666 },
  { name: 'Magha', ruler: 'Ketu', start: 120 },
  { name: 'Purva Phalguni', ruler: 'Venus', start: 133.333 },
  { name: 'Uttara Phalguni', ruler: 'Sun', start: 146.666 },
  { name: 'Hasta', ruler: 'Moon', start: 160 },
  { name: 'Chitra', ruler: 'Mars', start: 173.333 },
  { name: 'Swati', ruler: 'Rahu', start: 186.666 },
  { name: 'Vishakha', ruler: 'Jupiter', start: 200 },
  { name: 'Anuradha', ruler: 'Saturn', start: 213.333 },
  { name: 'Jyeshtha', ruler: 'Mercury', start: 226.666 },
  { name: 'Mula', ruler: 'Ketu', start: 240 },
  { name: 'Purva Ashadha', ruler: 'Venus', start: 253.333 },
  { name: 'Uttara Ashadha', ruler: 'Sun', start: 266.666 },
  { name: 'Shravana', ruler: 'Moon', start: 280 },
  { name: 'Dhanishtha', ruler: 'Mars', start: 293.333 },
  { name: 'Shatabhisha', ruler: 'Rahu', start: 306.666 },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter', start: 320 },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn', start: 333.333 },
  { name: 'Revati', ruler: 'Mercury', start: 346.666 },
];

export const PLANET_RULERS = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

export const EXALTATION = {
  Sun: { sign: 'Aries', degree: 10 },
  Moon: { sign: 'Taurus', degree: 3 },
  Mars: { sign: 'Capricorn', degree: 28 },
  Mercury: { sign: 'Virgo', degree: 15 },
  Jupiter: { sign: 'Cancer', degree: 5 },
  Venus: { sign: 'Pisces', degree: 27 },
  Saturn: { sign: 'Libra', degree: 20 },
  Rahu: { sign: 'Taurus', degree: 20 },
  Ketu: { sign: 'Scorpio', degree: 20 },
};

export const DEBILITATION = {
  Sun: { sign: 'Libra', degree: 10 },
  Moon: { sign: 'Scorpio', degree: 3 },
  Mars: { sign: 'Cancer', degree: 28 },
  Mercury: { sign: 'Pisces', degree: 15 },
  Jupiter: { sign: 'Capricorn', degree: 5 },
  Venus: { sign: 'Virgo', degree: 27 },
  Saturn: { sign: 'Aries', degree: 20 },
  Rahu: { sign: 'Scorpio', degree: 20 },
  Ketu: { sign: 'Taurus', degree: 20 },
};

export const HOUSE_SIGNIFICANCE = [
  'Self, Body, Personality',
  'Wealth, Family, Speech',
  'Siblings, Courage, Communication',
  'Home, Mother, Happiness',
  'Intelligence, Children, Creativity',
  'Health, Enemies, Service',
  'Marriage, Partnership, Business',
  'Longevity, Transformation, Hidden Wealth',
  'Luck, Dharma, Higher Learning',
  'Career, Fame, Status',
  'Gains, Social Circle, Ambitions',
  'Losses, Liberation, Foreign Travel',
];

// ─── JULIAN DATE & TIME UTILITIES ───────────────────────────────────────────

export function toJulianDay(date) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const h = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let jy = y, jm = m;
  if (m <= 2) { jy -= 1; jm += 12; }
  const A = Math.floor(jy / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (jy + 4716)) + Math.floor(30.6001 * (jm + 1)) + d + h / 24 + B - 1524.5;
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function degreesToRadians(deg) { return deg * Math.PI / 180; }
function radiansToDegrees(rad) { return rad * 180 / Math.PI; }

// ─── AYANAMSHA (Lahiri) ──────────────────────────────────────────────────────

export function getLahiriAyanamsha(julianDay) {
  const T = (julianDay - 2451545.0) / 36525;
  return 23.85 + (0.0137792 * T) + (0.000012 * T * T);
}

// ─── PLANETARY LONGITUDE CALCULATIONS ───────────────────────────────────────

function sunLongitude(T) {
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mr = degreesToRadians(M);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
    + 0.000289 * Math.sin(3 * Mr);
  return normalizeAngle(L0 + C);
}

function moonLongitude(T) {
  const L1 = 218.3165 + 481267.8813 * T;
  const M = 357.5291 + 35999.0503 * T;
  const Mp = 134.9634 + 477198.8676 * T;
  const D = 297.8502 + 445267.1115 * T;
  const F = 93.2721 + 483202.0175 * T;
  const Mr = degreesToRadians(normalizeAngle(M));
  const Mpr = degreesToRadians(normalizeAngle(Mp));
  const Dr = degreesToRadians(normalizeAngle(D));
  const Fr = degreesToRadians(normalizeAngle(F));

  const lon = L1
    + 6.2886 * Math.sin(Mpr)
    + 1.2740 * Math.sin(2 * Dr - Mpr)
    + 0.6583 * Math.sin(2 * Dr)
    + 0.2136 * Math.sin(2 * Mpr)
    - 0.1851 * Math.sin(Mr)
    - 0.1143 * Math.sin(2 * Fr)
    + 0.0588 * Math.sin(2 * Dr - 2 * Mpr)
    + 0.0572 * Math.sin(2 * Dr - Mr - Mpr)
    + 0.0533 * Math.sin(2 * Dr + Mpr);
  return normalizeAngle(lon);
}

function marsLongitude(T) {
  const L = 355.433 + 19140.299 * T + 0.000261 * T * T;
  const M = 19.373 + 19140.30268 * T;
  const Mr = degreesToRadians(normalizeAngle(M));
  return normalizeAngle(L + 10.691 * Math.sin(Mr) + 0.623 * Math.sin(2 * Mr) + 0.050 * Math.sin(3 * Mr));
}

function mercuryLongitude(T) {
  const L = 252.251 + 149472.675 * T;
  const M = 174.795 + 149472.515 * T;
  const Mr = degreesToRadians(normalizeAngle(M));
  return normalizeAngle(L + 23.440 * Math.sin(Mr) + 2.998 * Math.sin(2 * Mr));
}

function jupiterLongitude(T) {
  const L = 34.351 + 3034.906 * T;
  const M = 20.020 + 3034.906 * T;
  const Mr = degreesToRadians(normalizeAngle(M));
  return normalizeAngle(L + 5.554 * Math.sin(Mr) + 0.168 * Math.sin(2 * Mr));
}

function venusLongitude(T) {
  const L = 181.979 + 58517.816 * T;
  const M = 212.448 + 58517.804 * T;
  const Mr = degreesToRadians(normalizeAngle(M));
  return normalizeAngle(L + 0.741 * Math.sin(Mr) + 0.022 * Math.sin(2 * Mr));
}

function saturnLongitude(T) {
  const L = 50.077 + 1222.114 * T;
  const M = 317.020 + 1222.114 * T;
  const Mr = degreesToRadians(normalizeAngle(M));
  return normalizeAngle(L + 6.406 * Math.sin(Mr) + 0.225 * Math.sin(2 * Mr));
}

function rahuLongitude(T) {
  // Mean Rahu (True node approximation)
  const N = 125.0445 - 1934.1363 * T + 0.0020762 * T * T;
  return normalizeAngle(N);
}

// ─── LAGNA (ASCENDANT) CALCULATION ──────────────────────────────────────────

export function calculateLagna(julianDay, latitudeDeg, longitudeDeg) {
  const T = (julianDay - 2451545.0) / 36525;
  // Sidereal time at Greenwich
  let GMST = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0)
    + 0.000387933 * T * T - T * T * T / 38710000;
  GMST = normalizeAngle(GMST);
  // Local Sidereal Time
  const LST = normalizeAngle(GMST + longitudeDeg);
  // Obliquity of ecliptic
  const eps = 23.439291111 - 0.013004167 * T;
  const epsr = degreesToRadians(eps);
  const LSTr = degreesToRadians(LST);
  const latr = degreesToRadians(latitudeDeg);
  // Ascendant formula
  const y = -Math.cos(LSTr);
  const x = Math.sin(epsr) * Math.tan(latr) + Math.cos(epsr) * Math.sin(LSTr);
  let asc = radiansToDegrees(Math.atan2(y, x));
  if (asc < 0) asc += 360;
  return normalizeAngle(asc);
}

// ─── APPLY AYANAMSHA (Tropical → Sidereal) ──────────────────────────────────

export function toSidereal(tropicalLon, ayanamsha) {
  return normalizeAngle(tropicalLon - ayanamsha);
}

// ─── RASI FROM LONGITUDE ─────────────────────────────────────────────────────

export function getRasi(longitude) {
  return Math.floor(longitude / 30);
}

export function getDegreeInRasi(longitude) {
  return longitude % 30;
}

// ─── NAKSHATRA FROM LONGITUDE ────────────────────────────────────────────────

export function getNakshatra(longitude) {
  const nakIdx = Math.floor(longitude / 13.3333);
  const pada = Math.floor((longitude % 13.3333) / 3.3333) + 1;
  return {
    name: NAKSHATRAS[nakIdx % 27].name,
    index: nakIdx % 27,
    pada,
    ruler: NAKSHATRAS[nakIdx % 27].ruler,
    degree: longitude % 13.3333,
  };
}

// ─── PLANET STATUS ───────────────────────────────────────────────────────────

function getPlanetStatus(planet, rasi) {
  const rName = RASIS[rasi];
  if (EXALTATION[planet]?.sign === rName) return 'Exalted';
  if (DEBILITATION[planet]?.sign === rName) return 'Debilitated';
  if (PLANET_RULERS[rName] === planet) return 'Own Sign';
  return 'Neutral';
}

// ─── HOUSE ASSIGNMENT (Whole Sign) ───────────────────────────────────────────

function getHouseNumber(planetRasi, lagnaRasi) {
  return ((planetRasi - lagnaRasi + 12) % 12) + 1;
}

// ─── FULL KUNDALI CALCULATION ─────────────────────────────────────────────────

export function calculateKundali(birthDate, birthTime, latitudeDeg, longitudeDeg, timezoneOffset = 0) {
  // Parse birth date/time
  const [hours, minutes] = (birthTime || '12:00').split(':').map(Number);
  const dt = new Date(birthDate);
  dt.setUTCHours(hours - timezoneOffset, minutes, 0, 0);

  const JD = toJulianDay(dt);
  const T = (JD - 2451545.0) / 36525;
  const ayanamsha = getLahiriAyanamsha(JD);

  // Tropical longitudes
  const tropicalPositions = {
    Sun: sunLongitude(T),
    Moon: moonLongitude(T),
    Mars: marsLongitude(T),
    Mercury: mercuryLongitude(T),
    Jupiter: jupiterLongitude(T),
    Venus: venusLongitude(T),
    Saturn: saturnLongitude(T),
    Rahu: rahuLongitude(T),
    Ketu: normalizeAngle(rahuLongitude(T) + 180),
  };

  // Sidereal positions
  const positions = {};
  for (const [planet, lon] of Object.entries(tropicalPositions)) {
    const sidLon = toSidereal(lon, ayanamsha);
    const rasi = getRasi(sidLon);
    const degInRasi = getDegreeInRasi(sidLon);
    positions[planet] = {
      longitude: sidLon,
      rasi,
      rasiName: RASIS[rasi],
      degreeInRasi: parseFloat(degInRasi.toFixed(2)),
      nakshatra: getNakshatra(sidLon),
      status: getPlanetStatus(planet, rasi),
    };
  }

  // Lagna
  const tropicalLagna = calculateLagna(JD, latitudeDeg, longitudeDeg);
  const lagnaLon = toSidereal(tropicalLagna, ayanamsha);
  const lagnaRasi = getRasi(lagnaLon);

  // House assignments (Whole Sign System)
  for (const planet of Object.keys(positions)) {
    positions[planet].house = getHouseNumber(positions[planet].rasi, lagnaRasi);
  }

  // Build 12 houses
  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    rasi: (lagnaRasi + i) % 12,
    rasiName: RASIS[(lagnaRasi + i) % 12],
    significance: HOUSE_SIGNIFICANCE[i],
    planets: Object.entries(positions)
      .filter(([, p]) => p.house === i + 1)
      .map(([name]) => name),
  }));

  return {
    lagna: {
      longitude: lagnaLon,
      rasi: lagnaRasi,
      rasiName: RASIS[lagnaRasi],
      degreeInRasi: parseFloat((lagnaLon % 30).toFixed(2)),
      nakshatra: getNakshatra(lagnaLon),
    },
    planets: positions,
    houses,
    ayanamsha: parseFloat(ayanamsha.toFixed(4)),
    julianDay: JD,
    metadata: {
      birthDate: dt.toISOString(),
      latitude: latitudeDeg,
      longitude: longitudeDeg,
      timezone: timezoneOffset,
    },
  };
}

// ─── NORTH INDIAN CHART LAYOUT ────────────────────────────────────────────────
// Returns a 4x4 grid cell → house mapping (positions 0-11 clockwise)

export const NORTH_INDIAN_GRID = [
  // [row, col] for house 1-12
  [0, 1], // House 1  → top center-left
  [0, 0], // House 2  → top-left
  [1, 0], // House 3  → left top
  [2, 0], // House 4  → left bottom
  [3, 0], // House 5  → bottom-left
  [3, 1], // House 6  → bottom center-left
  [3, 2], // House 7  → bottom center-right
  [3, 3], // House 8  → bottom-right
  [2, 3], // House 9  → right bottom
  [1, 3], // House 10 → right top
  [0, 3], // House 11 → top-right
  [0, 2], // House 12 → top center-right
];

// ─── SOUTH INDIAN CHART LAYOUT ────────────────────────────────────────────────
// Fixed rasi positions in a 4x4 grid

export const SOUTH_INDIAN_RASI_GRID = [
  // [rasi_index] for each cell row by row
  // Pisces  Aries  Taurus  Gemini
  [11,       0,     1,      2     ],
  // Aquarius center  center  Cancer
  [10,      -1,    -1,     3     ],
  // Capricorn center center  Leo
  [9,       -1,    -1,     4     ],
  // Sagittarius Scorpio  Libra  Virgo
  [8,        7,    6,      5     ],
];

export function getSouthIndianData(kundali) {
  const grid = SOUTH_INDIAN_RASI_GRID.map(row =>
    row.map(rasiIdx => {
      if (rasiIdx === -1) return null;
      const house = kundali.houses.find(h => h.rasi === rasiIdx);
      return {
        rasi: rasiIdx,
        rasiName: RASIS[rasiIdx],
        houseNum: house ? house.number : null,
        planets: house ? house.planets : [],
        isLagna: rasiIdx === kundali.lagna.rasi,
      };
    })
  );
  return grid;
}

// ─── LIFE PREDICTIONS ────────────────────────────────────────────────────────

export function generateLifePredictions(kundali) {
  const { planets, lagna, houses } = kundali;
  const predictions = {};

  // Career (10th house)
  const h10 = houses[9];
  const h10Ruler = PLANET_RULERS[h10.rasiName];
  const careerPlanet = h10.planets[0];
  predictions.career = {
    strength: careerPlanet ? 'Strong' : h10Ruler ? 'Moderate' : 'Weak',
    field: getCareerField(lagna.rasiName, h10.rasiName),
    tip: getCareerTip(h10.rasiName),
  };

  // Wealth (2nd + 11th house)
  const h2 = houses[1];
  const h11 = houses[10];
  const wealthScore = (h2.planets.length + h11.planets.length) * 25 + 25;
  predictions.wealth = {
    score: Math.min(wealthScore, 100),
    source: getWealthSource(h2.rasiName, h11.rasiName),
    tip: getWealthTip(planets.Jupiter?.rasiName),
  };

  // Love & Marriage (7th house)
  const h7 = houses[6];
  predictions.love = {
    partner: getPartnerDescription(h7.rasiName),
    timing: getMarriageTiming(planets.Venus?.house, planets.Jupiter?.house),
    tip: getLoveTip(h7.rasiName),
  };

  // Karma & Spirituality (12th + 9th house)
  const h12 = houses[11];
  const h9 = houses[8];
  predictions.karma = {
    pastLife: getPastLifeTheme(planets.Ketu?.rasiName, planets.Ketu?.house),
    dharma: getDharmicPath(lagna.rasiName, h9.rasiName),
    lesson: getKarmaLesson(planets.Saturn?.house),
  };

  // Health (1st + 6th house)
  predictions.health = {
    constitution: getConstitution(lagna.rasiName),
    caution: getHealthCaution(planets.Saturn?.rasiName, planets.Mars?.rasiName),
  };

  return predictions;
}

// ─── PREDICTION HELPERS ───────────────────────────────────────────────────────

function getCareerField(lagnaSign, h10Sign) {
  const map = {
    Aries: 'Military, Police, Engineering, Sports',
    Taurus: 'Finance, Arts, Real Estate, Food Industry',
    Gemini: 'Media, Writing, Teaching, Technology',
    Cancer: 'Healthcare, Hospitality, Agriculture, Social Work',
    Leo: 'Government, Politics, Management, Entertainment',
    Virgo: 'Medicine, Accounting, Data Analysis, Research',
    Libra: 'Law, Diplomacy, Fashion, Consulting',
    Scorpio: 'Investigation, Research, Occult, Surgery',
    Sagittarius: 'Education, Philosophy, Travel, Law',
    Capricorn: 'Engineering, Government, Architecture, Mining',
    Aquarius: 'Technology, Humanitarian Work, Science, Innovation',
    Pisces: 'Arts, Spirituality, Healthcare, Marine Industries',
  };
  return map[h10Sign] || map[lagnaSign] || 'Multi-disciplinary pursuits';
}

function getCareerTip(sign) {
  const tips = {
    Aries: 'Lead from the front. Avoid impulsiveness in career decisions.',
    Taurus: 'Build steadily. Patience brings lasting success.',
    Gemini: 'Versatility is your strength. Avoid scatter.',
    Cancer: 'Emotional intelligence is your career superpower.',
    Leo: 'Visibility matters. Cultivate your personal brand.',
    Virgo: 'Excellence in detail sets you apart.',
    Libra: 'Collaboration and harmony open doors.',
    Scorpio: 'Research deeply before acting. Secrecy can be your shield.',
    Sagittarius: 'Your optimism and vision inspire others. Share it boldly.',
    Capricorn: 'Long-term thinking and discipline are your cornerstones.',
    Aquarius: 'Innovation and unconventional thinking are your gifts.',
    Pisces: 'Intuition guides your best decisions.',
  };
  return tips[sign] || 'Stay consistent and authentic in your professional path.';
}

function getWealthSource(h2Sign, h11Sign) {
  const sources = {
    Aries: 'Entrepreneurship, Independent ventures',
    Taurus: 'Land, Property, Accumulated savings',
    Gemini: 'Communication, Multiple income streams',
    Cancer: 'Family business, Real estate, Inheritance',
    Leo: 'Government grants, Speculative gains, Leadership roles',
    Virgo: 'Service profession, Analytical work, Health sector',
    Libra: 'Partnerships, Trade, Creative arts',
    Scorpio: 'Hidden sources, Research, Investments',
    Sagittarius: 'Foreign sources, Education, Publishing',
    Capricorn: 'Hard work, Government, Systematic investment',
    Aquarius: 'Technology, Networking, Innovation',
    Pisces: 'Spiritual services, Arts, Foreign lands',
  };
  return sources[h2Sign] || 'Diverse sources';
}

function getWealthTip(jupiterSign) {
  if (!jupiterSign) return 'Worship Vishnu on Thursdays for wealth blessings.';
  const tips = {
    Cancer: 'Jupiter is exalted — great financial fortune awaits through patience.',
    Sagittarius: 'Jupiter in own sign — expand through education and wisdom.',
    Pisces: 'Jupiter in own sign — spiritual and material wealth align.',
    Capricorn: 'Jupiter is debilitated — seek mentors and avoid over-optimism.',
  };
  return tips[jupiterSign] || 'Thursday prayers and yellow sapphire may strengthen wealth.';
}

function getPartnerDescription(h7Sign) {
  const desc = {
    Aries: 'Dynamic, independent, assertive partner',
    Taurus: 'Stable, sensual, materially oriented partner',
    Gemini: 'Intellectual, communicative, dual-natured partner',
    Cancer: 'Nurturing, emotional, home-loving partner',
    Leo: 'Confident, proud, generous partner',
    Virgo: 'Analytical, service-oriented, health-conscious partner',
    Libra: 'Balanced, aesthetic, diplomatic partner',
    Scorpio: 'Intense, mysterious, transformative partner',
    Sagittarius: 'Philosophical, adventurous, free-spirited partner',
    Capricorn: 'Disciplined, ambitious, traditional partner',
    Aquarius: 'Innovative, humanitarian, unconventional partner',
    Pisces: 'Spiritual, compassionate, artistic partner',
  };
  return desc[h7Sign] || 'A soul who mirrors your inner world';
}

function getMarriageTiming(venusHouse, jupiterHouse) {
  if (!venusHouse && !jupiterHouse) return '24–30 years (general window)';
  if (venusHouse === 7 || jupiterHouse === 7) return '22–26 years (early blessing)';
  if (venusHouse === 12 || jupiterHouse === 12) return '28–34 years (spiritual union)';
  return '26–32 years (measured timing)';
}

function getLoveTip(h7Sign) {
  return `With ${h7Sign} in the 7th, seek a partner who values ${
    ['Aries','Scorpio','Mars'].includes(h7Sign) ? 'passion and independence' :
    ['Taurus','Libra','Venus'].includes(h7Sign) ? 'beauty and harmony' :
    ['Gemini','Virgo','Mercury'].includes(h7Sign) ? 'communication and intellect' :
    ['Cancer','Moon'].includes(h7Sign) ? 'emotional security' :
    ['Leo','Sun'].includes(h7Sign) ? 'loyalty and recognition' :
    ['Sagittarius','Pisces','Jupiter'].includes(h7Sign) ? 'wisdom and growth' :
    ['Capricorn','Aquarius','Saturn'].includes(h7Sign) ? 'structure and vision' :
    'authentic connection'
  }.`;
}

function getPastLifeTheme(ketuSign, ketuHouse) {
  const themes = {
    Aries: 'Warrior or leader in a past life. Lessons of ego and dharma.',
    Taurus: 'Wealthy merchant or farmer. Lessons of attachment.',
    Gemini: 'Scholar or merchant. Lessons of focus.',
    Cancer: 'Healer or mother. Lessons of emotional independence.',
    Leo: 'Royalty or ruler. Lessons of humility.',
    Virgo: 'Ascetic or craftsman. Lessons of service vs. self.',
    Libra: 'Diplomat or artist. Lessons of justice.',
    Scorpio: 'Occultist or warrior. Lessons of transformation.',
    Sagittarius: 'Sage or pilgrim. Lessons of higher truth.',
    Capricorn: 'Administrator or minister. Lessons of true purpose.',
    Aquarius: 'Philosopher or rebel. Lessons of community.',
    Pisces: 'Monk or mystic. Lessons of boundaries.',
  };
  return themes[ketuSign] || 'A rich tapestry of past karma awaits exploration.';
}

function getDharmicPath(lagnaSign, h9Sign) {
  return `Your soul\'s dharmic path is illuminated by ${lagnaSign} rising and a ${h9Sign} 9th house — guiding you toward a life of ${
    ['Aries','Leo','Sagittarius'].includes(lagnaSign) ? 'inspired leadership and spiritual courage' :
    ['Taurus','Virgo','Capricorn'].includes(lagnaSign) ? 'grounded service and practical wisdom' :
    ['Gemini','Libra','Aquarius'].includes(lagnaSign) ? 'sharing knowledge and creating harmony' :
    'nurturing others and healing the world'
  }.`;
}

function getKarmaLesson(saturnHouse) {
  const lessons = [
    'Learning to value the self', 'Building secure foundations', 'Mastering communication',
    'Healing family patterns', 'Creative self-expression', 'Duty and service',
    'Balanced partnerships', 'Facing the shadow self', 'Wisdom through experience',
    'Righteous ambition', 'Community over self', 'Spiritual surrender',
  ];
  return lessons[(saturnHouse || 1) - 1] || 'Patience, discipline, and karma mastery.';
}

function getConstitution(lagnaSign) {
  const vata = ['Gemini', 'Virgo', 'Libra', 'Aquarius', 'Capricorn'];
  const pitta = ['Aries', 'Leo', 'Sagittarius'];
  const kapha = ['Taurus', 'Cancer', 'Scorpio', 'Pisces'];
  if (vata.includes(lagnaSign)) return 'Vata (Air/Ether) — prone to anxiety, dryness, irregular patterns';
  if (pitta.includes(lagnaSign)) return 'Pitta (Fire/Water) — prone to inflammation, intensity, ambition';
  if (kapha.includes(lagnaSign)) return 'Kapha (Water/Earth) — prone to lethargy, congestion, loyalty';
  return 'Mixed constitution';
}

function getHealthCaution(saturnSign, marsSign) {
  if (!saturnSign) return 'Maintain regularity in routine for optimal health.';
  const map = {
    Aries: 'Watch for head-related issues. Avoid impulsive injuries.',
    Taurus: 'Throat, thyroid, and neck need attention.',
    Gemini: 'Lungs and nervous system require care.',
    Cancer: 'Digestive health and emotional wellbeing are linked.',
    Leo: 'Heart and spine — avoid chronic stress.',
    Virgo: 'Intestinal health and purity in diet are key.',
    Libra: 'Kidney and adrenal health. Balance work-rest.',
    Scorpio: 'Reproductive and detox organs need attention.',
    Sagittarius: 'Liver, hips, and thighs. Avoid excess.',
    Capricorn: 'Bones, knees, joints. Calcium and Vitamin D essential.',
    Aquarius: 'Circulation and nervous system. Avoid isolation.',
    Pisces: 'Feet, lymphatic system. Watch for escapism.',
  };
  return map[saturnSign] || 'General wellness through routine and sattvic diet.';
}

export default {
  calculateKundali,
  calculateLagna,
  getLahiriAyanamsha,
  getNakshatra,
  getRasi,
  getSouthIndianData,
  generateLifePredictions,
  PLANETS,
  RASIS,
  NAKSHATRAS,
  HOUSE_SIGNIFICANCE,
  NORTH_INDIAN_GRID,
  SOUTH_INDIAN_RASI_GRID,
};
