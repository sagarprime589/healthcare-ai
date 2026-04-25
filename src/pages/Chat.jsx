/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import { usePatient } from '../context/PatientContext';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const { patientData, aiResult } = usePatient();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${patientData?.name || 'there'}! I'm your AI doctor. I've reviewed your assessment. You can ask me anything about your symptoms, medicines, or diagnosis.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const context = `You are an AI doctor assistant. The patient's name is ${patientData?.name}, age ${patientData?.age}, gender ${patientData?.gender}. Their symptoms are: ${patientData?.symptoms}. Their previous AI assessment result was: ${aiResult}. Now answer the patient's follow-up question in a friendly, clear, and helpful way. Keep responses concise.`;

      const history = updatedMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, history, message: input }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed');

      setMessages(prev => [...prev, { role: 'assistant', text: data.result }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!patientData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <h2>No diagnosis found</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Please complete a diagnosis first.</p>
        <button onClick={() => navigate('/diagnosis')} style={greenBtn}>
          Go to Diagnosis
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button onClick={() => navigate('/dashboard')} style={grayBtn}>← Back</button>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Chat with AI Doctor</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Based on your diagnosis — ask anything</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1d9e75' }} />
          <span style={{ fontSize: '12px', color: '#1d9e75', fontWeight: '500' }}>AI Online</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f6e56', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', marginRight: '8px', flexShrink: 0, marginTop: '2px' }}>
                AI
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? '#0f6e56' : '#f1f5f9',
              color: msg.role === 'user' ? '#fff' : '#1a1a1a',
              fontSize: '14px',
              lineHeight: '1.6',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f6e56', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
              AI
            </div>
            <div style={{ background: '#f1f5f9', padding: '10px 16px', borderRadius: '18px 18px 18px 4px', fontSize: '14px', color: '#888' }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ paddingTop: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {['What medicine should I take?', 'Is this serious?', 'What tests should I do?', 'Any home remedies?'].map((q, i) => (
            <button key={i} onClick={() => setInput(q)} style={{ padding: '5px 12px', background: '#f1f5f9', border: '0.5px solid #e5e7eb', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', color: '#333' }}>
              {q}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', borderTop: '0.5px solid #e5e7eb', paddingTop: '10px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask your AI doctor anything..."
            style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }}
          />
          <button onClick={sendMessage} disabled={loading} style={{ padding: '12px 20px', background: loading ? '#aaa' : '#0f6e56', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer' }}>
            Send
          </button>
        </div>
      </div>

    </div>
  );
}

const greenBtn = {
  padding: '10px 20px',
  background: '#0f6e56',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
};

const grayBtn = {
  padding: '8px 14px',
  background: '#f1f5f9',
  color: '#333',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  cursor: 'pointer',
};