import { useState } from 'react';

export default function MedicineLookup() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicine: query }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      setResult(data.result);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

const popular = [
  'Dolo 650', 'Crocin', 'Combiflam', 'Ibuprofen', 'Paracetamol',
  'Pan 40', 'Pantoprazole', 'Omeprazole', 'Digene', 'Gelusil',
  'Cetirizine', 'Allegra', 'Montair LC', 'Levocetrizine',
  'Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Doxycycline',
  'Metformin', 'Glucophage', 'Insulin', 'Januvia',
  'Amlodipine', 'Telmisartan', 'Atorvastatin', 'Ecosprin',
  'Liv 52', 'Becosules', 'Zincovit', 'Dexona', 'Pudin Hara',
  'Vicks', 'Strepsils', 'Otrivin', 'Betadine', 'Savlon'
];
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px' }}>
      <h2 style={{ margin: '0 0 6px' }}>Medicine Lookup</h2>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
        Search any medicine to get detailed information about usage, dosage, and side effects.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. Paracetamol, Ibuprofen, Amoxicillin..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }}
        />
        <button onClick={handleSearch} disabled={loading} style={greenBtn}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {popular.map(med => (
          <button key={med} onClick={() => { setQuery(med); }} style={pillBtn}>
            {med}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💊</div>
          <p>Looking up medicine information...</p>
        </div>
      )}

      {result && <MedicineCard data={result} name={query} />}
    </div>
  );
}

function MedicineCard({ data, name }) {
  const sections = parseMedicine(data);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ background: '#0f6e56', borderRadius: '12px', padding: '20px 24px', color: '#fff' }}>
        <div style={{ fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Medicine Information</div>
        <h2 style={{ margin: '0 0 4px', fontSize: '24px' }}>{name}</h2>
        <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>{sections.type || 'Pharmaceutical Drug'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <InfoCard title="Uses & Indications" icon="🎯" content={sections.uses} />
        <InfoCard title="Dosage & Administration" icon="💊" content={sections.dosage} />
        <InfoCard title="Side Effects" icon="⚠️" content={sections.sideEffects} />
        <InfoCard title="Precautions & Warnings" icon="🚫" content={sections.precautions} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
        <InfoCard title="Drug Interactions" icon="🔗" content={sections.interactions} />
        <InfoCard title="Storage" icon="🏠" content={sections.storage} />
        <InfoCard title="Alternatives" icon="🔄" content={sections.alternatives} />
      </div>

      <div style={{ background: '#fff8e1', border: '0.5px solid #ffe082', borderRadius: '10px', padding: '14px 16px' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#856404', lineHeight: '1.6' }}>
          ⚕ This information is AI-generated for educational purposes only. Always consult a doctor or pharmacist before taking any medication.
        </p>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, content }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#0f6e56' }}>{title}</h3>
      </div>
      <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
        {content || 'Information not available'}
      </div>
    </div>
  );
}

function parseMedicine(text) {
  const sections = {
    type: '',
    uses: '',
    dosage: '',
    sideEffects: '',
    precautions: '',
    interactions: '',
    storage: '',
    alternatives: ''
  };

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let current = '';

  for (const line of lines) {
    const up = line.toUpperCase();

    if (up.includes('TYPE') || up.includes('CLASS') || up.includes('CATEGORY') || up.includes('DRUG CLASS')) { current = 'type'; continue; }
    if (up.includes('USE') || up.includes('INDICATION') || up.includes('TREAT')) { current = 'uses'; continue; }
    if (up.includes('DOSAGE') || up.includes('DOSE') || up.includes('ADMINISTRATION') || up.includes('HOW TO TAKE')) { current = 'dosage'; continue; }
    if (up.includes('SIDE EFFECT') || up.includes('ADVERSE') || up.includes('UNWANTED')) { current = 'sideEffects'; continue; }
    if (up.includes('PRECAUTION') || up.includes('WARNING') || up.includes('CONTRAINDICATION') || up.includes('WHO SHOULD NOT')) { current = 'precautions'; continue; }
    if (up.includes('INTERACTION') || up.includes('DRUG INTERACTION') || up.includes('AVOID WITH')) { current = 'interactions'; continue; }
    if (up.includes('STORAGE') || up.includes('STORE') || up.includes('KEEP')) { current = 'storage'; continue; }
    if (up.includes('ALTERNATIVE') || up.includes('SIMILAR') || up.includes('SUBSTITUTE') || up.includes('GENERIC') || up.includes('BRAND')) { current = 'alternatives'; continue; }

    if (current && line.length > 2) {
      sections[current] += line + '\n';
    }
  }

  return sections;
}

const greenBtn = {
  padding: '12px 24px',
  background: '#0f6e56',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
};

const pillBtn = {
  padding: '6px 14px',
  background: '#e1f5ee',
  color: '  #0f6e56',
  border: '0.5px solid #1d9e75',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
  cursor: 'pointer',
};  