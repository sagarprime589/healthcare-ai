
import { generatePDF } from '../utils/generatePDF';
import { usePatient } from '../context/PatientContext';
import { useNavigate } from 'react-router-dom';

function parseResult(text) {
  const sections = {
    conditions: [],
    urgency: '',
    urgencyLevel: '',
    medicines: [],
    tests: [],
    remedies: [],
    seeDoctor: [],
    disclaimer: '',
  };

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let current = '';

  for (const line of lines) {
    if (line.startsWith('POSSIBLE CONDITIONS')) { current = 'conditions'; continue; }
    if (line.startsWith('URGENCY LEVEL')) { current = 'urgency'; continue; }
    if (line.startsWith('RECOMMENDED MEDICINES')) { current = 'medicines'; continue; }
    if (line.startsWith('RECOMMENDED TESTS')) { current = 'tests'; continue; }
    if (line.startsWith('HOME REMEDIES')) { current = 'remedies'; continue; }
    if (line.startsWith('SEE A DOCTOR IF')) { current = 'seeDoctor'; continue; }
    if (line.startsWith('DISCLAIMER')) { current = 'disclaimer'; continue; }

    if (current === 'conditions' && line.match(/^\d+\./)) sections.conditions.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'urgency' && line) {
      sections.urgency = line;
      sections.urgencyLevel = line.split(' ')[0].replace('-', '').trim();
    }
    if (current === 'medicines' && line.match(/^\d+\./)) sections.medicines.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'tests' && line.match(/^\d+\./)) sections.tests.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'remedies' && line.match(/^\d+\./)) sections.remedies.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'seeDoctor' && line.match(/^\d+\./)) sections.seeDoctor.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'disclaimer') sections.disclaimer += line;
  }

  return sections;
}

function urgencyColor(level) {
  const l = level?.toLowerCase();
  if (l === 'low') return { bg: '#e1f5ee', color: '#0f6e56', border: '#1d9e75' };
  if (l === 'moderate') return { bg: '#faeeda', color: '#854f0b', border: '#ba7517' };
  if (l === 'high') return { bg: '#faece7', color: '#993c1d', border: '#d85a30' };
  if (l === 'critical') return { bg: '#fcebeb', color: '#a32d2d', border: '#e24b4a' };
  return { bg: '#f1efe8', color: '#5f5e5a', border: '#888780' };
}

export default function Dashboard() {
  const { patientData, aiResult } = usePatient();
  const navigate = useNavigate();

  if (!aiResult) {
    return (
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <h2>No results yet</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Please fill in the diagnosis form first.</p>
        <button onClick={() => navigate('/diagnosis')} style={btnStyle}>Go to Diagnosis →</button>
        <button onClick={() => navigate('/chat')} style={chatBtn}>
  Chat with AI Doctor →
</button>
        <button onClick={() => navigate('/chat')} style={chatBtn}>
  Chat with AI Doctor →
</button>
      </div>
    );
  }

  const data = parseResult(aiResult);
  const urgency = urgencyColor(data.urgencyLevel);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
  <div>
    <h2 style={{ margin: 0, fontSize: '22px' }}>AI Health Assessment</h2>
    <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
      {patientData?.name} · Age {patientData?.age} · {patientData?.gender} · {patientData?.bloodGroup}
    </p>
  </div>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button onClick={() => navigate('/diagnosis')} style={btnStyle}>← New Assessment</button>
    <button onClick={() => generatePDF(patientData, aiResult)} style={downloadBtn}>Download PDF ↓</button>
    <button onClick={() => navigate('/chat')} style={chatBtn}>Chat with AI Doctor →</button>
  </div>
</div>

      <div style={{ ...card, background: urgency.bg, border: `1.5px solid ${urgency.border}`, marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: urgency.color, marginBottom: '6px' }}>
          Urgency Level
        </div>
        <div style={{ fontSize: '18px', fontWeight: '600', color: urgency.color }}>
          {data.urgencyLevel || 'Unknown'}
        </div>
        <div style={{ fontSize: '13px', color: urgency.color, marginTop: '4px', opacity: 0.85 }}>
          {data.urgency}
        </div>
      </div>

      <Section title="Possible Conditions">
        {data.conditions.map((c, i) => {
          const parts = c.split(' - ');
          const name = parts[0];
          const pct = parts[1] || '';
          const desc = parts[2] || '';
          const pctNum = parseInt(pct);
          return (
            <div key={i} style={{ ...card, marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '500', fontSize: '15px' }}>{name}</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: pctNum > 60 ? '#d85a30' : pctNum > 30 ? '#ba7517' : '#0f6e56' }}>
                  {pct}
                </span>
              </div>
              <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }}>
                <div style={{ height: '4px', width: `${pctNum || 0}%`, background: pctNum > 60 ? '#d85a30' : pctNum > 30 ? '#ba7517' : '#0f6e56', borderRadius: '4px' }} />
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>{desc}</p>
            </div>
          );
        })}
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Section title="Recommended Medicines" small>
          {data.medicines.map((m, i) => {
            const parts = m.split(' - ');
            return (
              <div key={i} style={{ padding: '10px 0', borderBottom: '0.5px solid #e5e7eb' }}>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{parts[0]}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{parts[1]} · {parts[2]}</div>
              </div>
            );
          })}
        </Section>

        <Section title="Recommended Tests" small>
          {data.tests.map((t, i) => {
            const parts = t.split(' - ');
            return (
              <div key={i} style={{ padding: '10px 0', borderBottom: '0.5px solid #e5e7eb' }}>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{parts[0]}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{parts[1]}</div>
              </div>
            );
          })}
        </Section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Section title="Home Remedies" small>
          {data.remedies.map((r, i) => {
            const parts = r.split(' - ');
            return (
              <div key={i} style={{ padding: '10px 0', borderBottom: '0.5px solid #e5e7eb' }}>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{parts[0]}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{parts[1]}</div>
              </div>
            );
          })}
        </Section>

        <Section title="See a Doctor If" small>
          {data.seeDoctor.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 0', borderBottom: '0.5px solid #e5e7eb' }}>
              <span style={{ color: '#e24b4a', fontWeight: '600', fontSize: '14px' }}>!</span>
              <span style={{ fontSize: '13px', color: '#333' }}>{s}</span>
            </div>
          ))}
        </Section>
      </div>

      {data.disclaimer && (
        <div style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px', padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#888', lineHeight: '1.6' }}>
            ⚕ {data.disclaimer}
          </p>
        </div>
      )}

    </div>
  );
}

function Section({ title, children, small }) {
  return (
    <div style={{ ...card, marginBottom: small ? '0' : '16px' }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

const card = {
  background: '#fff',
  border: '0.5px solid #e5e7eb',
  borderRadius: '12px',
  padding: '16px 18px',
};

const btnStyle = {
  padding: '9px 18px',
  background: '#0f6e56',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};
const downloadBtn = {
  padding: '9px 18px',
  background: '#fff',
  color: '#0f6e56',
  border: '1.5px solid #0f6e56',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};
const chatBtn = {
  padding: '9px 18px',
  background: '#1d9e75',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               