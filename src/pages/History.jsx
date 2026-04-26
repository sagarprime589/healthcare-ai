import { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { useNavigate } from 'react-router-dom';
import { generatePDF } from '../utils/generatePDF';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', maxWidth: '380px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '12px' }}>🗑️</div>
        <h3 style={{ margin: '0 0 8px', textAlign: 'center', fontSize: '17px', fontWeight: '700' }}>Confirm Delete</h3>
        <p style={{ margin: '0 0 24px', textAlign: 'center', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', background: '#f5f7fa', color: '#555', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '11px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const { history, setHistory, setPatientData, setAiResult } = usePatient();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [search, setSearch] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }

  const askConfirm = (message, onConfirm) => setConfirm({ message, onConfirm });
  const closeConfirm = () => setConfirm(null);

  const loadReport = (entry) => {
    setPatientData(entry.patientData);
    setAiResult(entry.aiResult);
    navigate('/dashboard');
  };

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const selectAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(e => e.id));

  const doDelete = (ids) => {
    const updated = history.filter(e => !ids.includes(e.id));
    setHistory(updated);
    localStorage.setItem('healthai_history', JSON.stringify(updated));
    setSelectedIds([]);
    setSelectMode(false);
    closeConfirm();
  };

  const deleteSelected = () => askConfirm(`Delete ${selectedIds.length} selected report(s)? This cannot be undone.`, () => doDelete(selectedIds));
  const deleteOne = (id) => askConfirm('Delete this report? This cannot be undone.', () => doDelete([id]));
  const clearAll = () => askConfirm('Delete ALL diagnosis history? This cannot be undone.', () => {
    setHistory([]);
    localStorage.setItem('healthai_history', JSON.stringify([]));
    setSelectedIds([]);
    setSelectMode(false);
    closeConfirm();
  });

  const urgencyColor = (text) => {
    const t = text?.toLowerCase();
    if (t?.includes('low'))      return { bg: '#e1f5ee', color: '#0f6e56', dot: '#10b981' };
    if (t?.includes('moderate')) return { bg: '#fef3c7', color: '#854f0b', dot: '#f59e0b' };
    if (t?.includes('high'))     return { bg: '#faece7', color: '#993c1d', dot: '#ef4444' };
    if (t?.includes('critical')) return { bg: '#fcebeb', color: '#a32d2d', dot: '#dc2626' };
    return { bg: '#f1f5f9', color: '#555', dot: '#9ca3af' };
  };

  const getUrgency = (aiResult) => {
    const lines = aiResult?.split('\n') || [];
    let found = false;
    for (const line of lines) {
      if (line.includes('URGENCY LEVEL')) { found = true; continue; }
      if (found && line.trim()) return line.trim();
    }
    return 'Unknown';
  };

  const getCondition = (aiResult) => {
    const lines = aiResult?.split('\n') || [];
    for (const line of lines) {
      if (line.match(/^1\./)) return line.replace(/^1\.\s*/, '').split(' - ')[0];
    }
    return 'Unknown';
  };

  // Filter + search
  const filtered = history.filter(entry => {
    const urgency = getUrgency(entry.aiResult).toLowerCase();
    const matchesUrgency = filterUrgency === 'all' || urgency.includes(filterUrgency);
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      entry.patientData.name?.toLowerCase().includes(q) ||
      entry.patientData.symptoms?.toLowerCase().includes(q) ||
      getCondition(entry.aiResult).toLowerCase().includes(q);
    return matchesUrgency && matchesSearch;
  });

  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '80px', padding: '20px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📋</div>
        <h2 style={{ margin: '0 0 8px' }}>No history yet</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Complete a diagnosis to see your history here.</p>
        <button onClick={() => navigate('/diagnosis')} style={greenBtn}>Start Diagnosis →</button>
      </div>
    );
  }

  return (
    <>
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />}

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>Diagnosis History</h2>
            <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>
              {history.length} total · {filtered.length} shown
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => { setSelectMode(!selectMode); setSelectedIds([]); }} style={selectMode ? activeSelectBtn : outlineBtn}>
              {selectMode ? 'Cancel' : 'Select'}
            </button>
            {!selectMode && <button onClick={clearAll} style={redBtn}>Delete All</button>}
            {selectMode && selectedIds.length > 0 && (
              <button onClick={deleteSelected} style={redBtn}>Delete ({selectedIds.length})</button>
            )}
            <button onClick={() => navigate('/diagnosis')} style={greenBtn}>+ New Assessment</button>
          </div>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#aaa' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, symptom or condition..."
              style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <select
            value={filterUrgency}
            onChange={e => setFilterUrgency(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', background: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">All urgency</option>
            <option value="low">🟢 Low</option>
            <option value="moderate">🟡 Moderate</option>
            <option value="high">🔴 High</option>
            <option value="critical">🚨 Critical</option>
          </select>
        </div>

        {selectMode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 16px', marginBottom: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#555' }}>
              <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={selectAll} style={{ width: '16px', height: '16px', accentColor: '#0f6e56' }} />
              {selectedIds.length === 0 ? 'Select all' : `${selectedIds.length} selected`}
            </label>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#888' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
            <p style={{ margin: 0 }}>No results match your search or filter.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((entry) => {
            const urgency = getUrgency(entry.aiResult);
            const colors = urgencyColor(urgency);
            const topCondition = getCondition(entry.aiResult);
            const isSelected = selectedIds.includes(entry.id);

            return (
              <div key={entry.id} style={{
                background: isSelected ? '#f0faf6' : '#fff',
                border: `1px solid ${isSelected ? '#1d9e75' : '#e5e7eb'}`,
                borderRadius: '14px', padding: '16px 20px',
                transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                    {selectMode && (
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(entry.id)}
                        style={{ width: '16px', height: '16px', accentColor: '#0f6e56', marginTop: '3px', flexShrink: 0 }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '700', fontSize: '15px', color: '#111' }}>{entry.patientData.name}</span>
                        <span style={{ fontSize: '12px', color: '#888' }}>Age {entry.patientData.age} · {entry.patientData.gender}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', background: colors.bg, color: colors.color, padding: '2px 10px', borderRadius: '20px', fontWeight: '600' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dot, flexShrink: 0 }}/>
                          {urgency.split(' ')[0]}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#444' }}>
                        Top condition: <strong>{topCondition}</strong>
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#aaa', lineHeight: '1.4' }}>
                        {entry.patientData.symptoms?.slice(0, 90)}{entry.patientData.symptoms?.length > 90 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>{entry.date}</div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>{entry.time}</div>
                  </div>
                </div>

                {!selectMode && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f0f0f0', flexWrap: 'wrap' }}>
                    <button onClick={() => loadReport(entry)} style={greenBtn}>View Report</button>
                    <button onClick={() => generatePDF(entry.patientData, entry.aiResult)} style={outlineBtn}>↓ PDF</button>
                    <button onClick={() => deleteOne(entry.id)} style={redOutlineBtn}>Delete</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const greenBtn     = { padding: '8px 16px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' };
const outlineBtn   = { padding: '8px 16px', background: '#fff', color: '#0f6e56', border: '1px solid #0f6e56', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' };
const activeSelectBtn = { padding: '8px 16px', background: '#0f6e56', color: '#fff', border: '1px solid #0f6e56', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' };
const redBtn       = { padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' };
const redOutlineBtn= { padding: '8px 16px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' };
