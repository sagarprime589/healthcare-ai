import { useEffect, useState } from 'react';

const criticalKeywords = [
  'chest pain', 'heart attack', 'difficulty breathing', 'can\'t breathe',
  'shortness of breath', 'stroke', 'unconscious', 'fainted', 'seizure',
  'severe bleeding', 'coughing blood', 'vomiting blood', 'paralysis',
  'sudden numbness', 'severe headache', 'loss of vision', 'suicide',
  'overdose', 'poisoning', 'severe chest', 'cardiac', 'anaphylaxis',
  'allergic reaction', 'swelling throat', 'can\'t swallow',
];

export function checkEmergency(symptoms) {
  if (!symptoms) return false;
  const lower = symptoms.toLowerCase();
  return criticalKeywords.some(k => lower.includes(k));
}

export default function EmergencyAlert({ symptoms, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (checkEmergency(symptoms)) {
      setVisible(true);
    }
  }, [symptoms]);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', maxWidth: '480px',
        width: '100%', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ background: '#a32d2d', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '28px' }}>🚨</div>
          <div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: '700' }}>Emergency Warning</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Critical symptoms detected</p>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '15px', color: '#1a1a1a', lineHeight: '1.6', marginBottom: '20px' }}>
            Your symptoms suggest a <strong>potentially serious medical emergency</strong>. Please do not wait for an AI assessment — seek immediate medical attention.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <EmergencyAction
              icon="🏥"
              title="Go to Emergency Room"
              desc="Visit the nearest hospital emergency immediately"
              color="#a32d2d"
            />
            <EmergencyAction
              icon="🚑"
              title="Call Ambulance"
              desc="India Emergency: 108 | Police: 100 | Fire: 101"
              color="#993c1d"
            />
            <EmergencyAction
              icon="📞"
              title="Call Someone"
              desc="Ask a family member or friend to take you to hospital"
              color="#854f0b"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="tel:108" style={{
              flex: 1, padding: '12px', background: '#a32d2d', color: '#fff',
              border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              📞 Call 108
            </a>
            <button onClick={handleDismiss} style={{
              flex: 1, padding: '12px', background: '#f5f5f5', color: '#555',
              border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px',
              cursor: 'pointer', fontWeight: '500',
            }}>
              I understand, continue
            </button>
          </div>

          <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
            This alert was triggered based on your described symptoms. Always prioritize your safety.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmergencyAction({ icon, title, desc, color }) {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#fff5f5', border: '0.5px solid #ffcccc', borderRadius: '10px', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: '600', fontSize: '14px', color, marginBottom: '2px' }}>{title}</div>
        <div style={{ fontSize: '12px', color: '#888' }}>{desc}</div>
      </div>
    </div>
  );
}