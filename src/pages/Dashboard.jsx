import { generatePDF } from '../utils/generatePDF';
import { usePatient } from '../context/PatientContext';
import { useNavigate } from 'react-router-dom';

function parseResult(text) {
  const sections = { conditions: [], urgency: '', urgencyLevel: '', medicines: [], tests: [], remedies: [], seeDoctor: [], disclaimer: '' };
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
    if (current === 'urgency' && line) { sections.urgency = line; sections.urgencyLevel = line.split(' ')[0].replace('-', '').trim(); }
    if (current === 'medicines' && line.match(/^\d+\./)) sections.medicines.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'tests' && line.match(/^\d+\./)) sections.tests.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'remedies' && line.match(/^\d+\./)) sections.remedies.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'seeDoctor' && line.match(/^\d+\./)) sections.seeDoctor.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'disclaimer') sections.disclaimer += line;
  }
  return sections;
}

function urgencyConfig(level) {
  const l = level?.toLowerCase();
  if (l === 'low')      return { bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', color: '#065f46', border: '#34d399', icon: '✓', badge: '#10b981' };
  if (l === 'moderate') return { bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#78350f', border: '#f59e0b', icon: '⚠', badge: '#f59e0b' };
  if (l === 'high')     return { bg: 'linear-gradient(135deg,#fee2e2,#fecaca)', color: '#7f1d1d', border: '#f87171', icon: '!', badge: '#ef4444' };
  if (l === 'critical') return { bg: 'linear-gradient(135deg,#fce7f3,#fbcfe8)', color: '#831843', border: '#f472b6', icon: '!!', badge: '#ec4899' };
  return { bg: '#f3f4f6', color: '#374151', border: '#d1d5db', icon: '?', badge: '#9ca3af' };
}

export default function Dashboard() {
  const { patientData, aiResult } = usePatient();
  const navigate = useNavigate();

  if (!aiResult) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#f8fafc' }}>
        <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#0f6e56,#1d9e75)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '24px', boxShadow: '0 8px 24px rgba(15,110,86,0.25)' }}>⚕</div>
        <h2 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: '700', color: '#111' }}>No Assessment Yet</h2>
        <p style={{ color: '#888', fontSize: '15px', marginBottom: '40px', textAlign: 'center' }}>Complete a diagnosis to see your AI health assessment here</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '480px', width: '100%' }}>
          <button onClick={() => navigate('/diagnosis')} style={{ padding: '20px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🩺</div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>AI Diagnosis</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>Enter symptoms & get assessment</div>
          </button>
          <button onClick={() => navigate('/bodymap')} style={{ padding: '20px', background: '#1d9e75', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🫀</div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>Body Map</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>Select symptoms visually</div>
          </button>
          <button onClick={() => navigate('/chat')} style={{ padding: '20px', background: '#fff', color: '#0f6e56', border: '1.5px solid #0f6e56', borderRadius: '14px', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>AI Doctor Chat</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Ask health questions directly</div>
          </button>
          <button onClick={() => navigate('/medicine')} style={{ padding: '20px', background: '#fff', color: '#0f6e56', border: '1.5px solid #0f6e56', borderRadius: '14px', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💊</div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>Medicine Info</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Look up any medicine</div>
          </button>
        </div>
      </div>
    );
  }

  const data = parseResult(aiResult);
  const urgency = urgencyConfig(data.urgencyLevel);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '48px' }}>

      {/* ── HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg,#0f6e56 0%,#1d9e75 100%)', padding: '32px 32px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
        <div style={{ position: 'absolute', bottom: -60, left: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>AI Health Assessment</div>
              <h1 style={{ margin: '0 0 12px', fontSize: '28px', fontWeight: '700', color: '#fff' }}>
                {patientData?.name || 'Patient'}
              </h1>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Age', val: patientData?.age },
                  { label: 'Gender', val: patientData?.gender },
                  { label: 'Blood', val: patientData?.bloodGroup },
                  { label: 'Weight', val: patientData?.weight ? `${patientData.weight} kg` : null },
                ].filter(x => x.val).map(x => (
                  <span key={x.label} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '12px', fontWeight: '500', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {x.label}: {x.val}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/diagnosis')} style={headerBtn('#fff', '#0f6e56')}>← New Assessment</button>
              <button onClick={() => navigate('/chat')} style={headerBtn('rgba(255,255,255,0.15)', '#fff', true)}>💬 AI Doctor</button>
              <button onClick={() => generatePDF(patientData, aiResult)} style={headerBtn('rgba(255,255,255,0.15)', '#fff', true)}>↓ PDF</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARDS PULLED UP ── */}
      <div style={{ maxWidth: '900px', margin: '-52px auto 0', padding: '0 20px' }}>

        {/* URGENCY BANNER */}
        <div style={{ background: urgency.bg, border: `1.5px solid ${urgency.border}`, borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: urgency.badge, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff', fontWeight: '700', flexShrink: 0 }}>
            {urgency.icon}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: urgency.color, opacity: 0.7 }}>Urgency Level</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: urgency.color }}>{data.urgencyLevel || 'Unknown'}</div>
            <div style={{ fontSize: '13px', color: urgency.color, opacity: 0.85, marginTop: '2px' }}>{data.urgency?.replace(/^[^-]+-\s*/, '')}</div>
          </div>
        </div>

        {/* CONDITIONS */}
        <div style={sectionCard}>
          <SectionTitle icon="🔍" title="Possible Conditions" count={data.conditions.length}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.conditions.map((c, i) => {
              const parts = c.split(' - ');
              const name = parts[0];
              const pct = parts[1] || '';
              const desc = parts[2] || '';
              const pctNum = parseInt(pct) || 0;
              const col = pctNum > 60 ? '#ef4444' : pctNum > 30 ? '#f59e0b' : '#10b981';
              return (
                <div key={i} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col, flexShrink: 0 }}/>
                      <span style={{ fontWeight: '600', fontSize: '15px', color: '#111' }}>{name}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: col }}>{pct}</span>
                  </div>
                  <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '6px', marginBottom: '8px', overflow: 'hidden' }}>
                    <div style={{ height: '6px', width: `${pctNum}%`, background: `linear-gradient(90deg,${col}99,${col})`, borderRadius: '6px', transition: 'width 0.8s ease' }}/>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* MEDICINES + TESTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={sectionCard}>
            <SectionTitle icon="💊" title="Medicines" count={data.medicines.length}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.medicines.map((m, i) => {
                const parts = m.split(' - ');
                return (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 12px', background: '#f0fdf8', borderRadius: '10px', border: '1px solid #d1fae5' }}>
                    <div style={{ width: '28px', height: '28px', background: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>💊</div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#111' }}>{parts[0]}</div>
                      {parts[1] && <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>{parts[1]}</div>}
                      {parts[2] && <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{parts[2]}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={sectionCard}>
            <SectionTitle icon="🧪" title="Recommended Tests" count={data.tests.length}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.tests.map((t, i) => {
                const parts = t.split(' - ');
                return (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 12px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <div style={{ width: '28px', height: '28px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>🧪</div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#111' }}>{parts[0]}</div>
                      {parts[1] && <div style={{ fontSize: '11px', color: '#2563eb', marginTop: '2px' }}>{parts[1]}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* REMEDIES + SEE DOCTOR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={sectionCard}>
            <SectionTitle icon="🌿" title="Home Remedies" count={data.remedies.length}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.remedies.map((r, i) => {
                const parts = r.split(' - ');
                return (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 12px', background: '#fefce8', borderRadius: '10px', border: '1px solid #fef08a' }}>
                    <div style={{ width: '28px', height: '28px', background: '#eab308', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>🌿</div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#111' }}>{parts[0]}</div>
                      {parts[1] && <div style={{ fontSize: '11px', color: '#a16207', marginTop: '2px' }}>{parts[1]}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={sectionCard}>
            <SectionTitle icon="🚨" title="See a Doctor If" count={data.seeDoctor.length}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.seeDoctor.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px', background: '#fff1f2', borderRadius: '10px', border: '1px solid #fecdd3' }}>
                  <div style={{ width: '20px', height: '20px', background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>!</div>
                  <span style={{ fontSize: '13px', color: '#333', lineHeight: '1.5' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHAT CTA */}
        <div style={{ background: 'linear-gradient(135deg,#0f6e56,#1d9e75)', borderRadius: '16px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '17px', marginBottom: '4px' }}>Have questions about your results?</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>Chat with the AI Doctor for personalized guidance</div>
          </div>
          <button onClick={() => navigate('/chat')} style={{ padding: '12px 24px', background: '#fff', color: '#0f6e56', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            💬 Chat with AI Doctor →
          </button>
        </div>

        {/* DISCLAIMER */}
        {data.disclaimer && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px 20px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', lineHeight: '1.7' }}>
              ⚕ {data.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
      {count > 0 && <span style={{ background: '#e1f5ee', color: '#0f6e56', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>{count}</span>}
    </div>
  );
}

const sectionCard = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '16px',
  boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
};

function headerBtn(bg, color, ghost = false) {
  return {
    padding: '9px 18px',
    background: bg,
    color: color,
    border: ghost ? '1px solid rgba(255,255,255,0.3)' : 'none',
    borderRadius: '9px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    backdropFilter: ghost ? 'blur(4px)' : 'none',
  };
}