import { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { useNavigate } from 'react-router-dom';
import { generatePDF } from '../utils/generatePDF';

export default function History() {
  const { history, setHistory, setPatientData, setAiResult } = usePatient();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  const loadReport = (entry) => {
    setPatientData(entry.patientData);
    setAiResult(entry.aiResult);
    navigate('/dashboard');
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === history.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(history.map(e => e.id));
    }
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected report(s)? This cannot be undone.`)) {
      const updated = history.filter(e => !selectedIds.includes(e.id));
      setHistory(updated);
      localStorage.setItem('healthai_history', JSON.stringify(updated));
      setSelectedIds([]);
      setSelectMode(false);
    }
  };

  const deleteOne = (id) => {
    if (window.confirm('Delete this report?')) {
      const updated = history.filter(e => e.id !== id);
      setHistory(updated);
      localStorage.setItem('healthai_history', JSON.stringify(updated));
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const clearAll = () => {
    if (window.confirm('Delete ALL history? This cannot be undone.')) {
      setHistory([]);
      localStorage.setItem('healthai_history', JSON.stringify([]));
      setSelectedIds([]);
      setSelectMode(false);
    }
  };

  const urgencyColor = (text) => {
    const t = text?.toLowerCase();
    if (t?.includes('low')) return { bg: '#e1f5ee', color: '#0f6e56' };
    if (t?.includes('moderate')) return { bg: '#faeeda', color: '#854f0b' };
    if (t?.includes('high')) return { bg: '#faece7', color: '#993c1d' };
    if (t?.includes('critical')) return { bg: '#fcebeb', color: '#a32d2d' };
    return { bg: '#f1f5f9', color: '#555' };
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

  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <h2>No history yet</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Complete a diagnosis to see your history here.</p>
        <button onClick={() => navigate('/diagnosis')} style={greenBtn}>Start Diagnosis →</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Diagnosis History</h2>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>
            {history.length} report{history.length > 1 ? 's' : ''} saved
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setSelectMode(!selectMode); setSelectedIds([]); }} style={selectMode ? activeSelectBtn : outlineBtn}>
            {selectMode ? 'Cancel' : 'Select'}
          </button>
          {!selectMode && <button onClick={clearAll} style={redBtn}>Delete All</button>}
          <button onClick={() => navigate('/diagnosis')} style={greenBtn}>New Assessment →</button>
        </div>
      </div>

      {selectMode && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={selectedIds.length === history.length}
              onChange={selectAll}
              style={{ width: '16px', height: '16px', accentColor: '#0f6e56' }}
            />
            <span style={{ fontSize: '13px', color: '#555' }}>
              {selectedIds.length === 0 ? 'Select reports to delete' : `${selectedIds.length} selected`}
            </span>
          </div>
          {selectedIds.length > 0 && (
            <button onClick={deleteSelected} style={redBtn}>
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {history.map((entry) => {
          const urgency = getUrgency(entry.aiResult);
          const colors = urgencyColor(urgency);
          const topCondition = getCondition(entry.aiResult);
          const isSelected = selectedIds.includes(entry.id);

          return (
            <div key={entry.id} style={{ ...card, border: isSelected ? '1.5px solid #0f6e56' : '0.5px solid #e5e7eb', background: isSelected ? '#f0faf6' : '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(entry.id)}
                      style={{ width: '16px', height: '16px', accentColor: '#0f6e56', marginTop: '2px', flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>{entry.patientData.name}</span>
                      <span style={{ fontSize: '12px', color: '#888' }}>Age {entry.patientData.age} · {entry.patientData.gender}</span>
                      <span style={{ fontSize: '11px', background: colors.bg, color: colors.color, padding: '2px 10px', borderRadius: '20px', fontWeight: '500' }}>
                        {urgency.split(' ')[0]}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#444' }}>
                      Top condition: <strong>{topCondition}</strong>
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
                      {entry.patientData.symptoms?.slice(0, 80)}...
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginLeft: '16px', flexShrink: 0 }}>
                  <div style={{ fontSize: '12px', color: '#888' }}>{entry.date}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>{entry.time}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid #e5e7eb' }}>
                {!selectMode && (
                  <>
                    <button onClick={() => loadReport(entry)} style={greenBtn}>View Report</button>
                    <button onClick={() => generatePDF(entry.patientData, entry.aiResult)} style={outlineBtn}>Download PDF</button>
                    <button onClick={() => deleteOne(entry.id)} style={redOutlineBtn}>Delete</button>
                  </>
                )}
                {selectMode && (
                  <button onClick={() => toggleSelect(entry.id)} style={isSelected ? activeSelectBtn : outlineBtn}>
                    {isSelected ? '✓ Selected' : 'Select'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const card = {
  borderRadius: '12px',
  padding: '16px 20px',
  transition: 'all 0.15s',
};

const greenBtn = {
  padding: '8px 16px',
  background: '#0f6e56',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};

const outlineBtn = {
  padding: '8px 16px',
  background: '#fff',
  color: '#0f6e56',
  border: '1px solid #0f6e56',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};

const activeSelectBtn = {
  padding: '8px 16px',
  background: '#0f6e56',
  color: '#fff',
  border: '1px solid #0f6e56',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};

const redBtn = {
  padding: '8px 16px',
  background: '#a32d2d',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};

const redOutlineBtn = {
  padding: '8px 16px',
  background: '#fff',
  color: '#a32d2d',
  border: '1px solid #a32d2d',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};