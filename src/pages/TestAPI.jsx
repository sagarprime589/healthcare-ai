import { useState } from 'react';

function TestAPI() {
  const [result, setResult] = useState('');

  const test = async () => {
    const key = 'AIzaSyBVxVBH4pX72M1BCg-azlEHGmlqKWoE208';
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Say hello in one word' }] }],
          }),
        }
      );
      const data = await response.json();
      console.log('Full response:', data);
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult('FETCH ERROR: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>API Test</h2>
      <button onClick={test} style={{ padding: '10px 20px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Test Gemini API
      </button>
      <pre style={{ marginTop: '20px', background: '#f5f5f5', padding: '16px', borderRadius: '8px', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#000' }}>
        {result || 'Click the button above...'}
      </pre>
    </div>
  );
}

export default TestAPI;