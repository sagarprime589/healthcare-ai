import { useState, useRef, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const INTRO = `Hey there! 👋 I'm **ROCKY** — your personal AI health companion from HealthAI!

I'm here to help you with anything health-related, anytime. Whether you have symptoms you're worried about, questions about medicines, or just need some wellness advice — I've got you covered. 😊

What can I help you with today?`;

const QUICK = [
  '🤒 I have some symptoms',
  '💊 Tell me about a medicine',
  '🥗 Give me health tips',
  '🩺 Should I see a doctor?',
];

const ROCKY_CONTEXT = `You are ROCKY, a warm, friendly, and knowledgeable AI health assistant for the HealthAI app. Your personality is encouraging, empathetic, and easy to talk to. You help users with health questions, symptoms, medicines, diet, lifestyle, and wellness. Always use simple, clear language. Occasionally use relevant emojis to be engaging but not excessive. Always recommend consulting a real doctor for serious or emergency concerns. Keep responses concise — 3 to 5 sentences max unless the user asks for more detail. Never diagnose definitively — instead say "this could be" or "it might be". Start every new conversation warmly.`;

export default function RockyChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: INTRO }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const updated = [...messages, { role: 'user', text: msg }];
    setMessages(updated);
    setLoading(true);
    try {
      const history = updated.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: ROCKY_CONTEXT, history, message: msg, lang: 'en' }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.result || 'Sorry, I had trouble with that. Try again!' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Oops! Couldn't connect right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(o => !o);
    setPulse(false);
  };

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px',
          width: '340px', height: '500px',
          background: '#fff', borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1000, overflow: 'hidden',
          animation: 'rockySlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#0a5c47,#0f6e56,#1d9e75)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                🤖
              </div>
              <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', border: '2px solid #0f6e56' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: '800', fontSize: '16px', letterSpacing: '0.5px' }}>ROCKY</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>AI Health Assistant · Online</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '7px' }}>
                {m.role === 'assistant' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#0f6e56,#1d9e75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, boxShadow: '0 2px 6px rgba(15,110,86,0.3)' }}>
                    🤖
                  </div>
                )}
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 13px',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#0f6e56,#1d9e75)' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#1a1a1a',
                  fontSize: '13px', lineHeight: '1.65',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '7px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#0f6e56,#1d9e75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🤖</div>
                <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '4px 18px 18px 18px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0f6e56', animation: `rockyBounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick options — only before first user reply */}
          {messages.length === 1 && !loading && (
            <div style={{ padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px', background: '#f0faf6', borderTop: '1px solid #e5e7eb', flexShrink: 0 }}>
              {QUICK.map((q, i) => (
                <button key={i} onClick={() => send(q)} style={{
                  padding: '5px 11px', background: '#fff', color: '#0f6e56',
                  border: '1px solid #1d9e75', borderRadius: '20px',
                  fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px', background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask ROCKY anything..."
              style={{ flex: 1, padding: '9px 14px', borderRadius: '22px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: '#f8fafc' }}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: loading || !input.trim() ? '#d1d5db' : 'linear-gradient(135deg,#0f6e56,#1d9e75)',
              border: 'none', color: '#fff', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0,
              transition: 'background 0.2s',
            }}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1001 }}>
        {/* Pulse ring */}
        {pulse && !open && (
          <div style={{ position: 'absolute', inset: '-6px', borderRadius: '50%', border: '3px solid #0f6e56', animation: 'rockyPulse 1.5s ease-out infinite', pointerEvents: 'none' }} />
        )}
        {/* Tooltip */}
        {!open && (
          <div style={{ position: 'absolute', bottom: '68px', right: 0, background: '#1a1a1a', color: '#fff', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', pointerEvents: 'none', opacity: pulse ? 1 : 0, transition: 'opacity 0.3s' }}>
            👋 Hi! I'm ROCKY
            <div style={{ position: 'absolute', bottom: '-5px', right: '18px', width: '10px', height: '10px', background: '#1a1a1a', transform: 'rotate(45deg)' }} />
          </div>
        )}
        <button onClick={handleOpen} style={{
          width: '58px', height: '58px', borderRadius: '50%',
          background: open ? '#555' : 'linear-gradient(135deg,#0f6e56,#1d9e75)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(15,110,86,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px', transition: 'all 0.25s',
          transform: open ? 'rotate(90deg) scale(0.95)' : 'scale(1)',
        }}>
          {open ? '✕' : '🤖'}
        </button>
      </div>

      <style>{`
        @keyframes rockySlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rockyBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%           { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes rockyPulse {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </>
  );
}
