/**
 * CosmicTantra V34 — Guru AI Engine
 * AI Jyotish Guru using Claude API
 * Supports: Hindi, English, Sanskrit, Tamil, Telugu, Bengali
 * Features: Kundali-aware chat, remedies, mantras, multi-language
 */

// ─── LANGUAGE CONFIGS ────────────────────────────────────────────────────────

export const LANGUAGES = {
  en: { name: 'English', greeting: 'Namaste, dear seeker. I am your cosmic guide.', flag: '🇬🇧' },
  hi: { name: 'हिंदी', greeting: 'नमस्ते, प्रिय साधक। मैं आपका ज्योतिष गुरु हूँ।', flag: '🇮🇳' },
  sa: { name: 'Sanskrit', greeting: 'नमस्ते सत्यान्वेषक। अहम् तव ज्योतिष-गुरुः अस्मि।', flag: '🕉️' },
  ta: { name: 'தமிழ்', greeting: 'வணக்கம், அன்பான தேடுபவரே. நான் உங்கள் ஜோதிட குரு.', flag: '🌺' },
  te: { name: 'తెలుగు', greeting: 'నమస్కారం, ప్రియమైన సాధకా. నేను మీ జ్యోతిష గురువును.', flag: '🌸' },
  bn: { name: 'বাংলা', greeting: 'নমস্কার, প্রিয় সাধক। আমি আপনার জ্যোতিষ গুরু।', flag: '🌼' },
};

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

function buildSystemPrompt(language, kundaliData) {
  const langName = LANGUAGES[language]?.name || 'English';

  const kundaliContext = kundaliData ? `
## Seeker's Kundali Data:
- Lagna: ${kundaliData.lagna?.rasiName} (${kundaliData.lagna?.nakshatra?.name} Nakshatra)
- Sun: ${kundaliData.planets?.Sun?.rasiName} in House ${kundaliData.planets?.Sun?.house}
- Moon: ${kundaliData.planets?.Moon?.rasiName} (${kundaliData.planets?.Moon?.nakshatra?.name})
- Mars: ${kundaliData.planets?.Mars?.rasiName} in House ${kundaliData.planets?.Mars?.house}
- Mercury: ${kundaliData.planets?.Mercury?.rasiName}
- Jupiter: ${kundaliData.planets?.Jupiter?.rasiName} (${kundaliData.planets?.Jupiter?.status})
- Venus: ${kundaliData.planets?.Venus?.rasiName}
- Saturn: ${kundaliData.planets?.Saturn?.rasiName} (${kundaliData.planets?.Saturn?.status})
- Rahu: ${kundaliData.planets?.Rahu?.rasiName} in House ${kundaliData.planets?.Rahu?.house}
- Ketu: ${kundaliData.planets?.Ketu?.rasiName} in House ${kundaliData.planets?.Ketu?.house}
` : '(No Kundali data provided yet — ask for birth details if needed)';

  return `You are Guru Jyotishdev — a wise, ancient Vedic astrology master and cosmic sage. You have mastered all 18 branches of Vedic knowledge including Jyotish (astrology), Ayurveda, Vastu, Tantra, Yoga, and the Puranas.

## Your Identity:
- You speak with the warmth of a grandfather, the precision of a scholar, and the compassion of a saint
- You blend classical Jyotish wisdom with modern guidance
- You NEVER predict doom — you always offer hope, remedies, and empowerment
- You use Sanskrit terms naturally (Lagna, Rahu, Karaka, etc.) with explanations

## Response Language:
RESPOND PRIMARILY IN **${langName}**. If the user writes in ${langName}, reply in ${langName}. You may blend Sanskrit shlokas naturally.

## Kundali Context:
${kundaliContext}

## How You Respond:
1. Address the seeker with warmth: "Vats" (son), "Putri" (daughter), or "Priya" (dear one)
2. Give the astrological explanation from their chart
3. Offer 1-3 specific, actionable remedies (gemstones, mantras, rituals, charity, dietary)
4. End with an empowering message or shloka

## Topic Expertise:
- Career, wealth, marriage, health, spirituality
- Planetary transits and their effects
- Gemstone recommendations
- Mantra prescriptions
- Vastu tips
- Past life karma and soul lessons
- Muhurta (auspicious timing)
- Festival meanings

## Boundaries:
- Do not give specific dates for death or extreme misfortune
- Do not give precise financial predictions with numbers
- Always frame challenges as opportunities for growth
- Refer to medical professionals for health decisions

## Style:
- Use occasional Sanskrit shlokas (with translation)
- Use ✨🙏🌙 emojis sparingly and authentically
- Keep responses focused (150-300 words unless deep analysis requested)
- Sign off with "Hari Om 🙏" or appropriate blessing`;
}

// ─── REMEDIAL SUGGESTION ENGINE ──────────────────────────────────────────────

export function generateRemedies(kundaliData) {
  if (!kundaliData) return [];
  const remedies = [];
  const { planets, lagna } = kundaliData;

  // Saturn debilitated
  if (planets?.Saturn?.status === 'Debilitated') {
    remedies.push({
      planet: 'Saturn',
      type: 'Mantra',
      remedy: 'Chant "Om Praam Preem Praum Sah Shanaischaraya Namah" 108 times on Saturdays',
      gemstone: 'Blue Sapphire (after proper consultation)',
      charity: 'Donate sesame seeds, black urad dal, and iron on Saturdays',
      color: 'Wear dark blue or black on Saturdays',
    });
  }

  // Jupiter debilitated
  if (planets?.Jupiter?.status === 'Debilitated') {
    remedies.push({
      planet: 'Jupiter',
      type: 'Ritual',
      remedy: 'Worship Lord Vishnu or Brihaspati every Thursday. Feed Brahmin scholars.',
      gemstone: 'Yellow Sapphire (Pukhraj)',
      charity: 'Donate yellow sweets, turmeric, or books on Thursdays',
      color: 'Wear yellow on Thursdays',
    });
  }

  // Rahu in strong house
  if ([1, 4, 7, 10].includes(planets?.Rahu?.house)) {
    remedies.push({
      planet: 'Rahu',
      type: 'Spiritual',
      remedy: 'Worship Durga or Kali. Donate to orphanages. Chant Rahu mantra 18,000 times.',
      gemstone: 'Hessonite (Gomed)',
      charity: 'Donate blankets, coal, or sesame to the poor',
      color: 'Avoid blue-black combinations on Saturdays',
    });
  }

  // Mars in 7th or 8th
  if ([7, 8].includes(planets?.Mars?.house)) {
    remedies.push({
      planet: 'Mars',
      type: 'Ritual',
      remedy: 'Kuja Dosha remedy: Visit Mangal temples on Tuesdays. Chant Hanuman Chalisa.',
      gemstone: 'Red Coral (after consultation)',
      charity: 'Feed red lentils and jaggery to poor on Tuesdays',
      color: 'Wear red or orange on Tuesdays',
    });
  }

  // Lagna-specific remedies
  const lagnaRemedies = {
    Aries: { deity: 'Hanuman', mantra: 'Om Hanumate Namaha', day: 'Tuesday' },
    Taurus: { deity: 'Lakshmi', mantra: 'Om Shreem Mahalakshmyai Namaha', day: 'Friday' },
    Gemini: { deity: 'Ganesha', mantra: 'Om Gam Ganapataye Namaha', day: 'Wednesday' },
    Cancer: { deity: 'Shiva', mantra: 'Om Namah Shivaya', day: 'Monday' },
    Leo: { deity: 'Surya', mantra: 'Om Suryaya Namaha', day: 'Sunday' },
    Virgo: { deity: 'Vishnu', mantra: 'Om Namo Narayanaya', day: 'Wednesday' },
    Libra: { deity: 'Lakshmi', mantra: 'Om Shreem Hreem Kleem Mahalakshmyai Namaha', day: 'Friday' },
    Scorpio: { deity: 'Kali', mantra: 'Om Krim Kalikayai Namaha', day: 'Tuesday' },
    Sagittarius: { deity: 'Dakshinamurthy', mantra: 'Om Dakshinamurthaye Namaha', day: 'Thursday' },
    Capricorn: { deity: 'Shani', mantra: 'Om Shanishcharaya Namaha', day: 'Saturday' },
    Aquarius: { deity: 'Saturn', mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah', day: 'Saturday' },
    Pisces: { deity: 'Vishnu', mantra: 'Om Namo Bhagavate Vasudevaya', day: 'Thursday' },
  };

  const lagnaRemedy = lagnaRemedies[lagna?.rasiName];
  if (lagnaRemedy) {
    remedies.push({
      planet: 'Lagna',
      type: 'General Strengthening',
      remedy: `Worship ${lagnaRemedy.deity} on ${lagnaRemedy.day}s`,
      mantra: lagnaRemedy.mantra,
      charity: 'Feed 5 Brahmins or cows on your Lagna ruling planet\'s day',
      color: 'Wear your Lagna\'s favorable color',
    });
  }

  return remedies;
}

// ─── API CALL TO CLAUDE ───────────────────────────────────────────────────────

export async function callGuruAPI(messages, language = 'en', kundaliData = null) {
  const systemPrompt = buildSystemPrompt(language, kundaliData);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Guru API error');
    }

    const data = await response.json();
    return {
      success: true,
      message: data.content[0]?.text || 'The cosmos is momentarily silent. Please try again.',
      usage: data.usage,
    };
  } catch (error) {
    console.error('Guru AI Error:', error);
    return {
      success: false,
      message: getFallbackResponse(language, messages[messages.length - 1]?.content),
      error: error.message,
    };
  }
}

// ─── FALLBACK RESPONSES (offline mode) ───────────────────────────────────────

function getFallbackResponse(language, userMessage) {
  const msg = (userMessage || '').toLowerCase();

  const responses = {
    en: [
      'Vats, the stars reveal much about your path. Your Lagna holds the key to your destiny — look within for the answers the cosmos provides.',
      'Dear seeker, every planet in your chart plays its sacred role. Saturn teaches patience, Jupiter expands wisdom, Venus brings love. Trust the divine timing.',
      'Hari Om 🙏 The cosmic dance continues. Your karma is not punishment — it is the curriculum of your soul\'s growth. Embrace each lesson.',
      'The Navagraha are your teachers, not your masters. With proper remedies, even the most challenging planetary positions can be transformed.',
    ],
    hi: [
      'वत्स, आपकी कुंडली में कर्म और भाग्य का सुंदर मिश्रण है। शनि की कृपा से जीवन में स्थिरता आएगी।',
      'प्रिय साधक, बृहस्पति आपके पक्ष में हैं। गुरुवार को विष्णु पूजा करें और पीले रंग के वस्त्र धारण करें।',
      'हरि ओम 🙏 ग्रहों की चाल समझना ही ज्योतिष है। घबराएं नहीं — हर ग्रह एक शिक्षक है।',
    ],
    ta: [
      'அன்பான தேடுபவரே, உங்கள் ஜாதகம் அழகான கர்மாவை காட்டுகிறது. ஹரி ஓம் 🙏',
      'வாழ்க்கையில் எந்த சவாலும் கடவுளின் ஆசியாக மாறும். தினமும் காலை சூரிய நமஸ்காரம் செய்யுங்கள்.',
    ],
  };

  const pool = responses[language] || responses.en;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── SPEECH UTILITIES ────────────────────────────────────────────────────────

export function speakText(text, language = 'en') {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getVoiceLang(language);
  utterance.rate = 0.88;
  utterance.pitch = 0.9;
  utterance.volume = 1;

  // Try to pick a good voice
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith(getVoiceLang(language).split('-')[0]));
  if (match) utterance.voice = match;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

function getVoiceLang(lang) {
  const map = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    sa: 'hi-IN',
  };
  return map[lang] || 'en-IN';
}

// ─── VOICE INPUT ──────────────────────────────────────────────────────────────

export function startVoiceInput(language = 'en', onResult, onError) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError?.('Speech recognition not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = getVoiceLang(language);
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult?.(transcript);
  };

  recognition.onerror = (event) => {
    onError?.(event.error);
  };

  recognition.start();
  return recognition;
}

// ─── QUICK QUESTION SUGGESTIONS ──────────────────────────────────────────────

export function getQuickQuestions(language = 'en', kundaliData = null) {
  const questions = {
    en: [
      'What does my Lagna say about my personality?',
      'When will I get married?',
      'Which gemstone should I wear?',
      'What career is best for me?',
      'How can I improve my financial situation?',
      'What are my past life karmas?',
      'Which mantra should I chant daily?',
      'What does my Moon nakshatra reveal?',
      'How is my health in the coming months?',
      'Tell me about my upcoming planetary periods.',
    ],
    hi: [
      'मेरी कुंडली में विवाह कब होगा?',
      'मुझे कौन सा रत्न पहनना चाहिए?',
      'मेरा करियर किस क्षेत्र में बनेगा?',
      'मेरे जीवन का धर्म क्या है?',
      'शनि दशा में क्या करूं?',
      'मेरे पूर्व जन्म के कर्म क्या हैं?',
      'कौन सा मंत्र जपूं?',
    ],
    ta: [
      'என் திருமணம் எப்போது நடக்கும்?',
      'எனக்கு எந்த ரத்தினக்கல் ஏற்றது?',
      'என் தொழில் என்ன?',
    ],
  };

  const pool = questions[language] || questions.en;

  // Personalize based on kundali if available
  if (kundaliData) {
    if (kundaliData.planets?.Saturn?.status === 'Debilitated') {
      pool.unshift(language === 'hi' ? 'शनि कमज़ोर है — क्या उपाय करूं?' : 'My Saturn is weak — what remedies do you suggest?');
    }
    if (kundaliData.planets?.Jupiter?.status === 'Exalted') {
      pool.unshift(language === 'hi' ? 'बृहस्पति उच्च का है — इसका फल क्या होगा?' : 'My Jupiter is exalted — what blessings does this bring?');
    }
  }

  return pool.slice(0, 8);
}

export default {
  callGuruAPI,
  generateRemedies,
  speakText,
  stopSpeech,
  startVoiceInput,
  getQuickQuestions,
  LANGUAGES,
};
