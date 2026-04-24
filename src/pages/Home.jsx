import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'inherit' }}>

      <div style={{ background: '#0f6e56', color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', marginBottom: '20px' }}>
            AI Powered Healthcare Assistant
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '700', margin: '0 0 16px', lineHeight: '1.2' }}>
            Your Personal AI Doctor
          </h1>
          <p style={{ fontSize: '17px', opacity: '0.85', margin: '0 0 32px', lineHeight: '1.6' }}>
            Get instant AI-powered health assessments, medicine recommendations, and disease insights — all in seconds.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/diagnosis')} style={primaryBtn}>
              Get AI Assessment →
            </button>
            <button onClick={() => navigate('/dashboard')} style={secondaryBtn}>
              View Dashboard
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: '#f9fafb', padding: '16px 20px', borderBottom: '0.5px solid #e5e7eb' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { value: '95%', label: 'Diagnosis Accuracy' },
            { value: '10s', label: 'Average Response Time' },
            { value: '500+', label: 'Conditions Covered' },
            { value: '24/7', label: 'Always Available' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#0f6e56' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>
          Everything you need
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '15px' }}>
          Powerful features to help you understand your health better
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🩺', title: 'AI Diagnosis', desc: 'Get instant analysis of your symptoms with possible conditions and likelihood percentages.' },
            { icon: '💊', title: 'Medicine Info', desc: 'Receive safe medicine recommendations with dosage and purpose for your condition.' },
            { icon: '🧪', title: 'Lab Tests', desc: 'Know exactly which tests to get done based on your symptoms and medical history.' },
            { icon: '🌿', title: 'Home Remedies', desc: 'Natural remedies and lifestyle tips alongside medical recommendations.' },
            { icon: '⚠️', title: 'Urgency Alerts', desc: 'Color coded urgency levels tell you when to seek immediate medical attention.' },
            { icon: '📋', title: 'Health Reports', desc: 'Detailed structured reports you can share with your doctor during consultation.' },
          ].map((f, i) => (
            <div key={i} style={featureCard}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#0f6e56', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '12px' }}>
          Ready to check your health?
        </h2>
        <p style={{ opacity: '0.85', marginBottom: '28px', fontSize: '15px' }}>
          Fill in your symptoms and get an AI assessment in seconds.
        </p>
        <button onClick={() => navigate('/diagnosis')} style={primaryBtn}>
          Start Free Assessment →
        </button>
        <p style={{ marginTop: '20px', fontSize: '12px', opacity: '0.6' }}>
          Not a substitute for professional medical advice. Always consult a doctor.
        </p>
      </div>

    </div>
  );
}

const primaryBtn = {
  padding: '12px 28px',
  background: '#fff',
  color: '#0f6e56',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
};

const secondaryBtn = {
  padding: '12px 28px',
  background: 'transparent',
  color: '#fff',
  border: '1.5px solid rgba(255,255,255,0.5)',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '500',
  cursor: 'pointer',
};

const featureCard = {
  background: '#fff',
  border: '0.5px solid #e5e7eb',
  borderRadius: '12px',
  padding: '20px',
};