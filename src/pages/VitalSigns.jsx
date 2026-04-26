import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VITALS_KEY = 'healthai_vitals';

const VITAL_CONFIG = [
  { key: 'bp',      label: 'Blood Pressure', unit: 'mmHg',  icon: '🫀', placeholder: 'e.g. 120/80', color: '#ef4444', bg: '#fff1f2',
    ranges: [{ label: 'Normal', range: '< 120/80', color: '#10b981' }, { label: 'Elevated', range: '120-129/<80', color: '#f59e0b' }, { label: 'High', range: '≥ 130/80', color: '#ef4444' }] },
  { key: 'sugar',   label: 'Blood Sugar', unit: 'mg/dL', icon: '🩸', placeholder: 'e.g. 95', color: '#f59e0b', bg: '#fefce8',
    ranges: [{ label: 'Normal (fasting)', range: '70–99', color: '#10b981' }, { label: 'Pre-diabetic', range: '100–125', color: '#f59e0b' }, { label: 'Diabetic', range: '≥ 126', color: '#ef4444' }] },
  { key: 'heart',   label: 'Heart Rate', unit: 'bpm',   icon: '💓', placeholder: 'e.g. 72', color: '#8b5cf6', bg: '#f5f3ff',
    ranges: [{ label: 'Low', range: '< 60', color: '#3b82f6' }, { label: 'Normal', range: '60–100', color: '#10b981' }, { label: 'High', range: '> 100', color: '#ef4444' }] },
  { key: 'oxygen',  label: 'Oxygen Level', unit: 'SpO₂%', icon: '🫁', placeholder: 'e.g. 98', color: '#06b6d4', bg: '#ecfeff',
    ranges: [{ label: 'Normal', range: '≥ 95%', color: '#10b981' }, { label: 'Low', range: '90–94%', color: '#f59e0b' }, { label: 'Critical', range: '< 90%', color: '#ef4444' }] },
  { key: 'temp',    label: 'Temperature', unit: '°F',   icon: '🌡️', placeholder: 'e.g. 98.6', color: '#f97316', bg: '#fff7ed',
    ranges: [{ label: 'Normal', range: '97–99°F', color: '#10b981' }, { label: 'Low fever', range: '99–100.4°F', color: '#f59e0b' }, { label: 'Fever', range: '> 100.4°F', color: '#ef4444' }] },
  { key: 'weight',  label: 'Weight', unit: 'kg',    icon: '⚖️', placeholder: 'e.g. 70', color: '#0f6e56', bg: '#e1f5ee',
    ranges: [] },
];

export default function VitalSigns() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ bp: '', sugar: '', heart: '', oxygen: '', temp: '', weight: '', note: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('log');

  useEffect(() => {
    try { setLogs(JSON.parse(localStorage.getItem(VITALS_KEY) || '[]')); } catch (_) {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const hasAny = VITAL_CONFIG.some(v => form[v.key]);
    if (!hasAny) return;
    setSaving(true);
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      ...form,
    };
    const updated = [entry, ...logs];
    setLogs(updated);
    localStorage.setItem(VITALS_KEY, JSON.stringify(updated));
    setForm({ bp: '', sugar: '', heart: '', oxygen: '', temp: '', weight: '', note: '' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const deleteLog = (id) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem(VITALS_KEY, JSON.stringify(updated));
  };

  // Latest reading per vital
  const latest = {};
  VITAL_CONFIG.forEach(v => {
    const found = logs.find(l => l[v.key]);
    if (found) latest[v.key] = found[v.key];
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '48px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0f6e56,#1d9e75)', padding: '28px 28px 64px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 6px', color: '#fff', fontSize: '24px', fontWeight: '700' }}>Vital Signs Tracker</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>Log and monitor your health metrics over time</p>
        </div>
      </div>

      <div style={{ maxWidth: '820px', margin: '-44px auto 0', padding: '0 20px' }}>

        {/* Latest readings summary */}
        {logs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '10px', marginBottom: '20px' }}>
            {VITAL_CONFIG.filter(v => latest[v.key]).map(v => (
              <div key={v.key} style={{ background: v.bg, border: `1px solid ${v.color}25`, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>{v.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: v.color }}>{latest[v.key]}</div>
                <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>{v.unit}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{v.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            {[{ id: 'log', label: '+ Log Reading' }, { id: 'history', label: `📋 History (${logs.length})` }, { id: 'ranges', label: '📊 Healthy Ranges' }].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                flex: 1, padding: '14px 10px', border: 'none', background: activeTab === t.id ? '#f0fdf8' : '#fff',
                color: activeTab === t.id ? '#0f6e56' : '#666', fontWeight: activeTab === t.id ? '700' : '400',
                fontSize: '13px', cursor: 'pointer', borderBottom: activeTab === t.id ? '2px solid #0f6e56' : '2px solid transparent',
              }}>{t.label}</button>
            ))}
          </div>

          {/* LOG TAB */}
          {activeTab === 'log' && (
            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              {saved && (
                <div style={{ background: '#e1f5ee', border: '1px solid #1d9e75', color: '#0f6e56', padding: '10px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>
                  ✓ Vitals logged successfully!
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '14px', marginBottom: '16px' }}>
                {VITAL_CONFIG.map(v => (
                  <div key={v.key}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '6px' }}>
                      <span>{v.icon}</span>{v.label} <span style={{ color: '#aaa', fontWeight: '400' }}>({v.unit})</span>
                    </label>
                    <input
                      value={form[v.key]}
                      onChange={e => setForm(f => ({ ...f, [v.key]: e.target.value }))}
                      placeholder={v.placeholder}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid #e5e7eb`, fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '6px' }}>📝 Note (optional)</label>
                <input
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="e.g. After morning walk, fasting reading..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>
              <button type="submit" disabled={saving} style={{ width: '100%', padding: '13px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                Save Reading →
              </button>
            </form>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div style={{ padding: '20px' }}>
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📈</div>
                  <p>No readings logged yet. Start tracking your vitals!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {logs.map(log => (
                    <div key={log.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{log.date} · {log.time}</div>
                        <button onClick={() => deleteLog(log.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '12px', padding: '2px 8px' }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {VITAL_CONFIG.map(v => log[v.key] ? (
                          <span key={v.key} style={{ background: v.bg, color: v.color, border: `1px solid ${v.color}30`, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                            {v.icon} {v.label}: <strong>{log[v.key]}</strong> {v.unit}
                          </span>
                        ) : null)}
                      </div>
                      {log.note && <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#888' }}>📝 {log.note}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HEALTHY RANGES TAB */}
          {activeTab === 'ranges' && (
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {VITAL_CONFIG.filter(v => v.ranges.length > 0).map(v => (
                  <div key={v.key} style={{ background: v.bg, borderRadius: '12px', padding: '16px', border: `1px solid ${v.color}20` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{v.icon}</span>
                      <span style={{ fontWeight: '700', fontSize: '15px', color: '#111' }}>{v.label}</span>
                      <span style={{ fontSize: '12px', color: '#888' }}>({v.unit})</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {v.ranges.map(r => (
                        <div key={r.label} style={{ background: '#fff', borderRadius: '8px', padding: '8px 12px', border: `1px solid ${r.color}40` }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: r.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.label}</div>
                          <div style={{ fontSize: '13px', color: '#333', marginTop: '2px' }}>{r.range}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/diagnosis')} style={{ padding: '10px 24px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            🩺 Run AI Diagnosis →
          </button>
        </div>
      </div>
    </div>
  );
}
