import React, { useState, useRef, useEffect } from 'react';
import { callGuruAPI, speakText, stopSpeech, startVoiceInput, getQuickQuestions, LANGUAGES } from '../engines/guruAI.js';

export default function ChatBox({ kundali, language = 'en', onLanguageChange }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const langConfig = LANGUAGES[language] || LANGUAGES.en;
  const quickQuestions = getQuickQuestions(language, kundali);

  // Initial greeting
  useEffect(() => {
    const greeting = {
      role: 'assistant',
      content: langConfig.greeting + (kundali
        ? `\n\nI can see your Kundali — ${kundali.lagna?.rasiName} Lagna with Moon in ${kundali.planets?.Moon?.nakshatra?.name}. What cosmic guidance do you seek today? 🙏`
        : '\n\nPlease generate your Kundali first for personalized guidance, or ask me any Vedic astrology question. 🙏'),
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, [kundali?.lagna?.rasiName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text) {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setIsLoading(true);

    // Build API messages (last 10 for context window)
    const apiMessages = history.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    }));

    const result = await callGuruAPI(apiMessages, language, kundali);

    const assistantMsg = {
      role: 'assistant',
      content: result.message,
      timestamp: new Date(),
      isError: !result.success,
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);

    if (autoSpeak && result.success) {
      setIsSpeaking(true);
      speakText(result.message, language);
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  }

  function handleVoiceInput() {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
      return;
    }

    const rec = startVoiceInput(
      language,
      (transcript) => {
        setInput(transcript);
        setIsListening(false);
        inputRef.current?.focus();
      },
      (error) => {
        console.error('Voice error:', error);
        setIsListening(false);
      }
    );

    if (rec) {
      setRecognition(rec);
      setIsListening(true);
    }
  }

  function toggleSpeak(text) {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, language);
      setTimeout(() => setIsSpeaking(false), 10000);
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: '500px',
      fontFamily: 'Georgia, serif',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.8rem 1rem',
        borderBottom: '1px solid rgba(124,58,237,0.2)',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '12px 12px 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>
            🧘
          </div>
          <div>
            <div style={{ color: '#E2D9F3', fontWeight: 'bold', fontSize: '0.95rem' }}>Guru Jyotishdev</div>
            <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>
              {isLoading ? '✍️ Channeling wisdom...' : '🟢 Available'}
            </div>
          </div>
        </div>

        {/* Language + voice controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={language}
            onChange={e => onLanguageChange?.(e.target.value)}
            style={{
              background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
              color: '#A78BFA', borderRadius: '8px', padding: '3px 8px', fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {Object.entries(LANGUAGES).map(([code, lang]) => (
              <option key={code} value={code} style={{ background: '#1E0A3C' }}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
            style={{
              background: autoSpeak ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${autoSpeak ? '#7C3AED' : 'rgba(255,255,255,0.1)'}`,
              color: autoSpeak ? '#A78BFA' : '#6B7280',
              borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '14px',
            }}
          >
            🔊
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '1rem',
        display: 'flex', flexDirection: 'column', gap: '12px',
        background: 'rgba(8,6,22,0.6)',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(124,58,237,0.3) transparent',
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'fadeIn 0.3s ease',
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', marginRight: '8px', flexShrink: 0, alignSelf: 'flex-end',
              }}>
                🧘
              </div>
            )}
            <div style={{
              maxWidth: '78%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
                : msg.isError
                ? 'rgba(239,68,68,0.15)'
                : 'rgba(255,255,255,0.07)',
              border: msg.role === 'assistant' ? '1px solid rgba(124,58,237,0.2)' : 'none',
              color: msg.role === 'user' ? '#fff' : '#E2D9F3',
              fontSize: '0.9rem', lineHeight: '1.65',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}

              {msg.role === 'assistant' && (
                <button
                  onClick={() => toggleSpeak(msg.content)}
                  style={{
                    display: 'block', marginTop: '6px',
                    background: 'none', border: 'none',
                    color: '#6B7280', fontSize: '11px', cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {isSpeaking ? '⏹ Stop' : '🔊 Speak'}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>
              🧘
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '18px', padding: '10px 14px',
            }}>
              <span style={{ color: '#A78BFA', fontSize: '0.85rem' }}>
                Consulting the cosmic akashic records
                <span style={{ animation: 'pulse 1.5s infinite' }}>...</span>
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid rgba(124,58,237,0.1)',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex', gap: '6px', overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {quickQuestions.slice(0, 4).map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            style={{
              whiteSpace: 'nowrap', padding: '4px 10px',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              color: '#A78BFA', borderRadius: '20px',
              fontSize: '11px', cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div style={{
        padding: '10px 12px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '0 0 12px 12px',
        borderTop: '1px solid rgba(124,58,237,0.15)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        {/* Voice button */}
        <button
          onClick={handleVoiceInput}
          title={isListening ? 'Stop listening' : 'Voice input'}
          style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: isListening ? 'rgba(239,68,68,0.3)' : 'rgba(124,58,237,0.2)',
            border: `1px solid ${isListening ? '#EF4444' : 'rgba(124,58,237,0.4)'}`,
            color: isListening ? '#FCA5A5' : '#A78BFA',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '16px',
            animation: isListening ? 'pulse 1s infinite' : 'none',
          }}
        >
          {isListening ? '⏹' : '🎤'}
        </button>

        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder={`Ask Guru Jyotishdev... (${langConfig.name})`}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '20px', padding: '8px 16px',
            color: '#E2D9F3', fontSize: '0.9rem', outline: 'none',
            fontFamily: 'Georgia, serif',
          }}
        />

        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: input.trim() && !isLoading
              ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
              : 'rgba(255,255,255,0.05)',
            border: 'none', cursor: input.trim() && !isLoading ? 'pointer' : 'default',
            color: '#fff', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          ↑
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: none; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
    </div>
  );
}
