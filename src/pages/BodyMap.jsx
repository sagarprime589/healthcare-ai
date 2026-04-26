/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FRONT_PARTS = {
  head:          { label: 'Head & Face',            symptoms: ['Headache', 'Migraine', 'Dizziness', 'Head injury', 'Forehead pain', 'Facial pain'] },
  neckThroat:    { label: 'Neck & Throat',          symptoms: ['Sore throat', 'Neck pain', 'Stiff neck', 'Swollen glands', 'Difficulty swallowing', 'Hoarse voice'] },
  chest:         { label: 'Chest & Pectorals',      symptoms: ['Chest pain', 'Shortness of breath', 'Cough', 'Palpitations', 'Wheezing', 'Chest tightness'] },
  abdomen:       { label: 'Abdomen & Core',         symptoms: ['Stomach pain', 'Nausea', 'Vomiting', 'Bloating', 'Indigestion', 'Cramps'] },
  lowerAbdomen:  { label: 'Lower Abdomen & Pelvis', symptoms: ['Lower abdominal pain', 'Pelvic pain', 'Bloating', 'Constipation', 'Diarrhea', 'Groin pain'] },
  leftShoulder:  { label: 'Left Shoulder',          symptoms: ['Shoulder pain', 'Deltoid pain', 'Stiffness', 'Limited movement', 'Clicking', 'Swelling'] },
  rightShoulder: { label: 'Right Shoulder',         symptoms: ['Shoulder pain', 'Deltoid pain', 'Stiffness', 'Limited movement', 'Clicking', 'Swelling'] },
  leftArm:       { label: 'Left Arm (Bicep)',        symptoms: ['Arm pain', 'Bicep pain', 'Weakness', 'Numbness', 'Swelling', 'Tingling'] },
  rightArm:      { label: 'Right Arm (Bicep)',       symptoms: ['Arm pain', 'Bicep pain', 'Weakness', 'Numbness', 'Swelling', 'Tingling'] },
  leftForearm:   { label: 'Left Forearm & Hand',    symptoms: ['Forearm pain', 'Wrist pain', 'Hand pain', 'Finger pain', 'Numbness', 'Carpal tunnel'] },
  rightForearm:  { label: 'Right Forearm & Hand',   symptoms: ['Forearm pain', 'Wrist pain', 'Hand pain', 'Finger pain', 'Numbness', 'Carpal tunnel'] },
  leftLeg:       { label: 'Left Thigh (Quad)',       symptoms: ['Thigh pain', 'Quad pain', 'Weakness', 'Swelling', 'Cramps', 'Varicose veins'] },
  rightLeg:      { label: 'Right Thigh (Quad)',      symptoms: ['Thigh pain', 'Quad pain', 'Weakness', 'Swelling', 'Cramps', 'Varicose veins'] },
  leftKnee:      { label: 'Left Knee',              symptoms: ['Knee pain', 'Swelling', 'Stiffness', 'Clicking', 'Locking', 'Instability'] },
  rightKnee:     { label: 'Right Knee',             symptoms: ['Knee pain', 'Swelling', 'Stiffness', 'Clicking', 'Locking', 'Instability'] },
  leftLowerLeg:  { label: 'Left Lower Leg',         symptoms: ['Calf pain', 'Shin splints', 'Cramps', 'Swelling', 'Numbness', 'DVT concern'] },
  rightLowerLeg: { label: 'Right Lower Leg',        symptoms: ['Calf pain', 'Shin splints', 'Cramps', 'Swelling', 'Numbness', 'DVT concern'] },
  leftFoot:      { label: 'Left Foot & Ankle',      symptoms: ['Foot pain', 'Ankle pain', 'Swelling', 'Numbness', 'Heel pain', 'Toe pain'] },
  rightFoot:     { label: 'Right Foot & Ankle',     symptoms: ['Foot pain', 'Ankle pain', 'Swelling', 'Numbness', 'Heel pain', 'Toe pain'] },
};

const BACK_PARTS = {
  headBack:      { label: 'Head & Neck (Back)',      symptoms: ['Occipital headache', 'Neck stiffness', 'Cervical pain', 'Tension headache', 'Neck spasm', 'Radiating pain'] },
  trapezius:     { label: 'Trapezius & Upper Back',  symptoms: ['Trap pain', 'Shoulder blade pain', 'Muscle tension', 'Stiffness', 'Burning pain', 'Spasm'] },
  midBack:       { label: 'Mid Back (Lats)',         symptoms: ['Mid back pain', 'Lat pain', 'Muscle ache', 'Stiffness', 'Rib pain', 'Nerve pain'] },
  lowerBack:     { label: 'Lower Back',             symptoms: ['Lower back pain', 'Sciatica', 'Disc pain', 'Stiffness', 'Radiating pain', 'Muscle spasm'] },
  leftShoulder:  { label: 'Left Shoulder (Back)',   symptoms: ['Shoulder pain', 'Rotator cuff pain', 'Stiffness', 'Limited movement', 'Clicking', 'Swelling'] },
  rightShoulder: { label: 'Right Shoulder (Back)',  symptoms: ['Shoulder pain', 'Rotator cuff pain', 'Stiffness', 'Limited movement', 'Clicking', 'Swelling'] },
  buttocks:      { label: 'Gluteus & Hips',         symptoms: ['Hip pain', 'Gluteus pain', 'Sciatica', 'Pain while sitting', 'Hip stiffness', 'Piriformis pain'] },
  leftBackLeg:   { label: 'Left Leg (Hamstring)',   symptoms: ['Hamstring pain', 'Calf cramp', 'Sciatica', 'Swelling', 'Tightness', 'Bicep femoris pain'] },
  rightBackLeg:  { label: 'Right Leg (Hamstring)',  symptoms: ['Hamstring pain', 'Calf cramp', 'Sciatica', 'Swelling', 'Tightness', 'Bicep femoris pain'] },
};

export default function BodyMap() {
  const navigate = useNavigate();
  const [view, setView] = useState('front');
  const [selected, setSelected] = useState(null);
  const [allSymptoms, setAllSymptoms] = useState([]);

  const currentParts = view === 'front' ? FRONT_PARTS : BACK_PARTS;

  const toggleSymptom = (s) =>
    setAllSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const hasSymptoms = (key) => currentParts[key]?.symptoms.some(s => allSymptoms.includes(s));
  const isActive = (key) => selected === key;
  const handlePartClick = (key) => setSelected(key === selected ? null : key);

  const hs = (key) => ({
    fill: isActive(key) ? 'rgba(15,110,86,0.52)' : hasSymptoms(key) ? 'rgba(29,158,117,0.30)' : 'rgba(255,255,255,0.01)',
    stroke: isActive(key) ? '#0f6e56' : hasSymptoms(key) ? '#1d9e75' : 'transparent',
    strokeWidth: isActive(key) ? 2.2 : 1.4,
    cursor: 'pointer',
    transition: 'all 0.18s',
  });

  const handleProceed = () => {
    if (allSymptoms.length === 0) return;
    navigate('/diagnosis', { state: { symptoms: allSymptoms.join(', ') } });
  };

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '700' }}>Body Map Symptom Checker</h2>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Click a body region to select your symptoms, then proceed to AI diagnosis</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{ background: '#f0f0f0', borderRadius: '12px', padding: '4px', display: 'inline-flex', gap: '2px' }}>
          {[{ v: 'front', label: 'Front View' }, { v: 'back', label: 'Back View' }].map(({ v, label }) => (
            <button key={v} onClick={() => { setView(v); setSelected(null); }} style={{
              padding: '9px 30px', borderRadius: '9px', border: 'none',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              background: view === v ? '#0f6e56' : 'transparent',
              color: view === v ? '#fff' : '#666', transition: 'all 0.2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* SVG Body Panel */}
        <div style={{
          background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
          borderRadius: '20px', padding: '18px 10px 14px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            {view === 'front' ? 'Anterior View' : 'Posterior View'}
          </p>

          <svg viewBox="0 0 200 555" width="100%" style={{ maxWidth: '230px' }}>
            <defs>
              <radialGradient id="gMuscle" cx="48%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#E87848"/>
                <stop offset="40%" stopColor="#C85030"/>
                <stop offset="100%" stopColor="#7A2010"/>
              </radialGradient>
              <radialGradient id="gHead" cx="44%" cy="34%" r="60%">
                <stop offset="0%" stopColor="#EDB080"/>
                <stop offset="55%" stopColor="#D48050"/>
                <stop offset="100%" stopColor="#A84E28"/>
              </radialGradient>
              <linearGradient id="gArmL" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7A2010"/>
                <stop offset="28%" stopColor="#C85030"/>
                <stop offset="56%" stopColor="#E07040"/>
                <stop offset="100%" stopColor="#8B2818"/>
              </linearGradient>
              <linearGradient id="gArmR" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#7A2010"/>
                <stop offset="28%" stopColor="#C85030"/>
                <stop offset="56%" stopColor="#E07040"/>
                <stop offset="100%" stopColor="#8B2818"/>
              </linearGradient>
              <linearGradient id="gLegL" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7A2010"/>
                <stop offset="30%" stopColor="#C85030"/>
                <stop offset="62%" stopColor="#E07040"/>
                <stop offset="100%" stopColor="#8B2818"/>
              </linearGradient>
              <linearGradient id="gLegR" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#7A2010"/>
                <stop offset="30%" stopColor="#C85030"/>
                <stop offset="62%" stopColor="#E07040"/>
                <stop offset="100%" stopColor="#8B2818"/>
              </linearGradient>
            </defs>

            {view === 'front'
              ? <FrontBody hs={hs} onClick={handlePartClick} />
              : <BackBody  hs={hs} onClick={handlePartClick} />
            }
          </svg>

          <div style={{ display: 'flex', gap: '14px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { c: 'rgba(15,110,86,0.52)', b: '#0f6e56', t: 'Selected' },
              { c: 'rgba(29,158,117,0.30)', b: '#1d9e75', t: 'Has symptoms' },
            ].map(l => (
              <div key={l.t} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '3px', background: l.c, border: `1px solid ${l.b}` }}/>
                {l.t}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div>
          {selected ? (
            <div style={card}>
              <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '700' }}>{currentParts[selected]?.label}</h3>
              <p style={{ fontSize: '13px', color: '#888', margin: '0 0 16px' }}>Select all symptoms that apply:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {currentParts[selected]?.symptoms.map(s => {
                  const on = allSymptoms.includes(s);
                  return (
                    <label key={s} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '9px 12px', borderRadius: '9px', cursor: 'pointer', fontSize: '13px',
                      background: on ? '#e1f5ee' : '#f9fafb',
                      border: `1px solid ${on ? '#1d9e75' : '#e5e7eb'}`,
                    }}>
                      <input type="checkbox" checked={on} onChange={() => toggleSymptom(s)}
                        style={{ width: '15px', height: '15px', accentColor: '#0f6e56', flexShrink: 0 }}/>
                      <span style={{ color: on ? '#0f6e56' : '#444', fontWeight: on ? '600' : '400' }}>{s}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ ...card, background: '#f9fafb', textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>👆</div>
              <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>Click any body region on the diagram</p>
              <p style={{ color: '#bbb', fontSize: '12px', marginTop: '8px' }}>Switch between Front and Back view for complete coverage</p>
            </div>
          )}

          {allSymptoms.length > 0 && (
            <div style={{ ...card, marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f6e56' }}>
                  Selected Symptoms ({allSymptoms.length})
                </h3>
                <button onClick={() => setAllSymptoms([])} style={clearBtn}>Clear all</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '18px' }}>
                {allSymptoms.map(s => (
                  <span key={s} onClick={() => toggleSymptom(s)} style={{
                    background: '#e1f5ee', color: '#0f6e56', fontSize: '12px', fontWeight: '500',
                    padding: '5px 11px', borderRadius: '20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #b2dece',
                  }}>
                    {s} <span style={{ opacity: 0.5 }}>×</span>
                  </span>
                ))}
              </div>
              <button onClick={handleProceed} style={greenBtn}>Get AI Diagnosis →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── FRONT BODY ─────────────────────────────────────────────────── */
function FrontBody({ hs, onClick }) {
  return (
    <g>
      {/* ── BASE SHAPES ── */}

      {/* TORSO */}
      <path d="M 86 104 C 70 107 44 118 32 140 L 24 164 22 202 24 250 30 284 50 298 74 306 74 316 126 316 126 306 150 298 170 284 176 250 178 202 176 164 168 140 C 156 118 130 107 114 104 Z"
        fill="url(#gMuscle)" stroke="#6A1808" strokeWidth="1"/>

      {/* LEFT ARM */}
      <path d="M 32 140 C 20 153 10 172 8 194 L 6 232 10 270 19 302 32 296 39 266 37 230 38 194 C 38 172 36 154 32 140 Z"
        fill="url(#gArmL)" stroke="#6A1808" strokeWidth="0.9"/>
      {/* LEFT FOREARM + HAND */}
      <path d="M 19 300 C 11 308 6 320 9 330 C 12 338 22 340 30 336 L 36 324 40 312 37 298 Z"
        fill="url(#gHead)" stroke="#6A1808" strokeWidth="0.9"/>
      <line x1="12" y1="324" x2="10" y2="333" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="18" y1="329" x2="17" y2="338" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="25" y1="331" x2="25" y2="340" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="31" y1="328" x2="33" y2="336" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>

      {/* RIGHT ARM */}
      <path d="M 168 140 C 180 153 190 172 192 194 L 194 232 190 270 181 302 168 296 161 266 163 230 162 194 C 162 172 164 154 168 140 Z"
        fill="url(#gArmR)" stroke="#6A1808" strokeWidth="0.9"/>
      {/* RIGHT FOREARM + HAND */}
      <path d="M 181 300 C 189 308 194 320 191 330 C 188 338 178 340 170 336 L 164 324 160 312 163 298 Z"
        fill="url(#gHead)" stroke="#6A1808" strokeWidth="0.9"/>
      <line x1="188" y1="324" x2="190" y2="333" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="182" y1="329" x2="183" y2="338" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="175" y1="331" x2="175" y2="340" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="169" y1="328" x2="167" y2="336" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>

      {/* LEFT LEG */}
      <path d="M 74 313 C 68 342 64 382 62 422 L 60 458 58 492 70 500 81 495 85 460 87 422 89 382 90 316 Z"
        fill="url(#gLegL)" stroke="#6A1808" strokeWidth="0.9"/>
      {/* LEFT FOOT */}
      <path d="M 58 492 C 50 500 46 511 51 518 C 55 524 72 525 81 518 L 81 495 Z"
        fill="url(#gHead)" stroke="#6A1808" strokeWidth="0.9"/>
      <line x1="52" y1="516" x2="50" y2="523" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="58" y1="521" x2="57" y2="528" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="64" y1="523" x2="64" y2="530" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="70" y1="521" x2="71" y2="527" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="76" y1="517" x2="78" y2="522" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>

      {/* RIGHT LEG */}
      <path d="M 126 313 C 132 342 136 382 138 422 L 140 458 142 492 130 500 119 495 115 460 113 422 111 382 110 316 Z"
        fill="url(#gLegR)" stroke="#6A1808" strokeWidth="0.9"/>
      {/* RIGHT FOOT */}
      <path d="M 142 492 C 150 500 154 511 149 518 C 145 524 128 525 119 518 L 119 495 Z"
        fill="url(#gHead)" stroke="#6A1808" strokeWidth="0.9"/>
      <line x1="148" y1="516" x2="150" y2="523" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="142" y1="521" x2="143" y2="528" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="136" y1="523" x2="136" y2="530" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="130" y1="521" x2="129" y2="527" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="124" y1="517" x2="122" y2="522" stroke="#9B3A1A" strokeWidth="1.1" strokeLinecap="round"/>

      {/* ── MUSCLE DETAILS ── */}

      {/* DELTOID LEFT */}
      <path d="M 32 140 C 22 128 24 112 38 110 C 52 108 64 120 64 135 C 52 141 41 145 32 140 Z"
        fill="#D86040" stroke="#7A2010" strokeWidth="0.6"/>
      <path d="M 38 118 C 31 126 30 136 36 140" fill="none" stroke="#F09060" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>

      {/* DELTOID RIGHT */}
      <path d="M 168 140 C 178 128 176 112 162 110 C 148 108 136 120 136 135 C 148 141 159 145 168 140 Z"
        fill="#D86040" stroke="#7A2010" strokeWidth="0.6"/>
      <path d="M 162 118 C 169 126 170 136 164 140" fill="none" stroke="#F09060" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>

      {/* PECTORAL LEFT */}
      <path d="M 64 132 C 57 141 55 155 62 170 C 68 180 83 184 96 182 L 100 160 C 95 145 84 131 70 128 Z"
        fill="#D86848" stroke="#7A2010" strokeWidth="0.6"/>
      <path d="M 70 134 C 62 145 60 160 68 174" fill="none" stroke="#F09868" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

      {/* PECTORAL RIGHT */}
      <path d="M 136 132 C 143 141 145 155 138 170 C 132 180 117 184 104 182 L 100 160 C 105 145 116 131 130 128 Z"
        fill="#D86848" stroke="#7A2010" strokeWidth="0.6"/>
      <path d="M 130 134 C 138 145 140 160 132 174" fill="none" stroke="#F09868" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

      {/* STERNUM */}
      <line x1="100" y1="116" x2="100" y2="192" stroke="#EDD0A0" strokeWidth="1.2" opacity="0.45"/>

      {/* ABS - tendinous inscriptions */}
      <line x1="100" y1="192" x2="100" y2="290" stroke="#EDD0A0" strokeWidth="1" opacity="0.4"/>
      <path d="M 88 197 Q 100 200 112 197" fill="none" stroke="#EDD0A0" strokeWidth="1" opacity="0.45"/>
      <path d="M 86 216 Q 100 220 114 216" fill="none" stroke="#EDD0A0" strokeWidth="1" opacity="0.4"/>
      <path d="M 84 238 Q 100 242 116 238" fill="none" stroke="#EDD0A0" strokeWidth="1" opacity="0.35"/>
      <path d="M 84 260 Q 100 264 116 260" fill="none" stroke="#EDD0A0" strokeWidth="1" opacity="0.3"/>
      {/* Ab block highlights */}
      <rect x="88" y="193" width="9" height="20" rx="4" fill="#E07040" opacity="0.28"/>
      <rect x="103" y="193" width="9" height="20" rx="4" fill="#E07040" opacity="0.28"/>
      <rect x="87" y="217" width="10" height="19" rx="4" fill="#E07040" opacity="0.22"/>
      <rect x="103" y="217" width="10" height="19" rx="4" fill="#E07040" opacity="0.22"/>
      <rect x="86" y="239" width="10" height="18" rx="4" fill="#E07040" opacity="0.18"/>
      <rect x="104" y="239" width="10" height="18" rx="4" fill="#E07040" opacity="0.18"/>

      {/* EXTERNAL OBLIQUE */}
      <path d="M 72 190 C 59 212 55 244 58 275 C 62 284 70 290 76 292 C 77 265 76 238 80 210 Z"
        fill="#C84E30" stroke="#7A2010" strokeWidth="0.5" opacity="0.65"/>
      <path d="M 128 190 C 141 212 145 244 142 275 C 138 284 130 290 124 292 C 123 265 124 238 120 210 Z"
        fill="#C84E30" stroke="#7A2010" strokeWidth="0.5" opacity="0.65"/>

      {/* SERRATUS ANTERIOR (finger-like ribs, side of chest) */}
      {[148,158,168,178].map((y,i) => (
        <path key={y} d={`M ${65-i*1} ${y} C ${58-i} ${y+4} ${55-i} ${y+8} ${58-i} ${y+12}`}
          fill="none" stroke="#C84830" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      ))}
      {[148,158,168,178].map((y,i) => (
        <path key={y+'r'} d={`M ${135+i*1} ${y} C ${142+i} ${y+4} ${145+i} ${y+8} ${142+i} ${y+12}`}
          fill="none" stroke="#C84830" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      ))}

      {/* BICEP LEFT */}
      <ellipse cx="25" cy="210" rx="13" ry="22" fill="#D86040" stroke="#7A2010" strokeWidth="0.5" opacity="0.75"/>
      <path d="M 19 198 C 17 210 19 222 23 228" fill="none" stroke="#F09060" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>

      {/* BICEP RIGHT */}
      <ellipse cx="175" cy="210" rx="13" ry="22" fill="#D86040" stroke="#7A2010" strokeWidth="0.5" opacity="0.75"/>
      <path d="M 181 198 C 183 210 181 222 177 228" fill="none" stroke="#F09060" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>

      {/* FOREARM lines */}
      <path d="M 20 258 C 18 272 19 286 20 300" fill="none" stroke="#EDD0A0" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
      <path d="M 180 258 C 182 272 181 286 180 300" fill="none" stroke="#EDD0A0" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>

      {/* SHORTS */}
      <path d="M 54 292 C 68 310 100 320 132 310 L 146 292 L 142 320 C 120 342 80 342 58 320 Z"
        fill="#3A4A62" opacity="0.88" stroke="#252E40" strokeWidth="0.6"/>

      {/* VASTUS LATERALIS left */}
      <path d="M 67 317 C 61 346 59 382 62 418 L 70 423 C 70 388 70 353 76 322 Z"
        fill="#CC4E30" stroke="#7A2010" strokeWidth="0.5" opacity="0.68"/>
      {/* VASTUS MEDIALIS left (teardrop near knee) */}
      <ellipse cx="81" cy="424" rx="10" ry="13" fill="#D86040" stroke="#7A2010" strokeWidth="0.5" opacity="0.65" transform="rotate(-12 81 424)"/>
      {/* RECTUS FEMORIS left (central quad line) */}
      <path d="M 80 318 C 78 352 76 386 76 420" fill="none" stroke="#EDD0A0" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>

      {/* VASTUS LATERALIS right */}
      <path d="M 133 317 C 139 346 141 382 138 418 L 130 423 C 130 388 130 353 124 322 Z"
        fill="#CC4E30" stroke="#7A2010" strokeWidth="0.5" opacity="0.68"/>
      {/* VASTUS MEDIALIS right */}
      <ellipse cx="119" cy="424" rx="10" ry="13" fill="#D86040" stroke="#7A2010" strokeWidth="0.5" opacity="0.65" transform="rotate(12 119 424)"/>
      {/* RECTUS FEMORIS right */}
      <path d="M 120 318 C 122 352 124 386 124 420" fill="none" stroke="#EDD0A0" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>

      {/* SARTORIUS left */}
      <path d="M 78 318 C 74 350 70 382 68 416" fill="none" stroke="#E8C088" strokeWidth="1.5" strokeLinecap="round" opacity="0.38"/>
      {/* SARTORIUS right */}
      <path d="M 122 318 C 126 350 130 382 132 416" fill="none" stroke="#E8C088" strokeWidth="1.5" strokeLinecap="round" opacity="0.38"/>

      {/* PATELLA left */}
      <ellipse cx="74" cy="440" rx="12" ry="10" fill="#E8A868" stroke="#8B3018" strokeWidth="0.9"/>
      <path d="M 66 440 Q 74 444 82 440" fill="none" stroke="#8B3018" strokeWidth="0.6" opacity="0.6"/>

      {/* PATELLA right */}
      <ellipse cx="126" cy="440" rx="12" ry="10" fill="#E8A868" stroke="#8B3018" strokeWidth="0.9"/>
      <path d="M 118 440 Q 126 444 134 440" fill="none" stroke="#8B3018" strokeWidth="0.6" opacity="0.6"/>

      {/* TIBIALIS ANTERIOR left */}
      <path d="M 67 453 C 65 468 65 484 67 498" fill="none" stroke="#EDD0A0" strokeWidth="2.5" strokeLinecap="round" opacity="0.38"/>
      {/* GASTROCNEMIUS side left */}
      <path d="M 61 453 C 59 468 59 484 63 498" fill="none" stroke="#D86040" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>

      {/* TIBIALIS ANTERIOR right */}
      <path d="M 133 453 C 135 468 135 484 133 498" fill="none" stroke="#EDD0A0" strokeWidth="2.5" strokeLinecap="round" opacity="0.38"/>
      {/* GASTROCNEMIUS side right */}
      <path d="M 139 453 C 141 468 141 484 137 498" fill="none" stroke="#D86040" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>

      {/* ── HEAD ── */}
      <path d="M 100 7 C 76 7 59 23 59 45 C 59 63 69 77 82 83 L 84 92 L 116 92 L 118 83 C 131 77 141 63 141 45 C 141 23 124 7 100 7 Z"
        fill="url(#gHead)" stroke="#8B4020" strokeWidth="0.9"/>
      {/* Hair */}
      <path d="M 100 7 C 76 7 59 23 59 45 C 59 28 72 13 100 11 C 128 13 141 28 141 45 C 141 23 124 7 100 7 Z" fill="#1E0F08"/>
      <ellipse cx="100" cy="21" rx="36" ry="18" fill="#1E0F08"/>
      {/* Ears */}
      <ellipse cx="58" cy="49" rx="5" ry="8" fill="#D47848" stroke="#8B4020" strokeWidth="0.6"/>
      <path d="M 59 43 Q 63 49 59 55" fill="none" stroke="#8B4020" strokeWidth="0.7"/>
      <ellipse cx="142" cy="49" rx="5" ry="8" fill="#D47848" stroke="#8B4020" strokeWidth="0.6"/>
      <path d="M 141 43 Q 137 49 141 55" fill="none" stroke="#8B4020" strokeWidth="0.7"/>
      {/* Eyebrows */}
      <path d="M 79 37 Q 87 34 95 37" fill="none" stroke="#2C1808" strokeWidth="1.9" strokeLinecap="round"/>
      <path d="M 105 37 Q 113 34 121 37" fill="none" stroke="#2C1808" strokeWidth="1.9" strokeLinecap="round"/>
      {/* Eyes */}
      <ellipse cx="87" cy="44" rx="7.5" ry="5.5" fill="white" stroke="#bbb" strokeWidth="0.4"/>
      <circle cx="87" cy="44" r="3.5" fill="#2C1808"/>
      <circle cx="88.2" cy="42.5" r="1.2" fill="white"/>
      <ellipse cx="113" cy="44" rx="7.5" ry="5.5" fill="white" stroke="#bbb" strokeWidth="0.4"/>
      <circle cx="113" cy="44" r="3.5" fill="#2C1808"/>
      <circle cx="114.2" cy="42.5" r="1.2" fill="white"/>
      <path d="M 80 41 Q 87 38 94 41" fill="none" stroke="#2C1808" strokeWidth="0.8"/>
      <path d="M 106 41 Q 113 38 120 41" fill="none" stroke="#2C1808" strokeWidth="0.8"/>
      {/* Nose */}
      <path d="M 100 51 L 97 63 Q 100 66 103 63 Z" fill="#C07040"/>
      <path d="M 97 63 Q 92 67 94 70 Q 100 69 106 70 Q 108 67 103 63" fill="#C07040"/>
      {/* Mouth */}
      <path d="M 93 75 Q 100 80 107 75" fill="#B85A50"/>
      <path d="M 93 75 Q 100 72 107 75" fill="none" stroke="#9A4040" strokeWidth="0.7"/>
      {/* Neck */}
      <path d="M 86 89 L 83 107 L 117 107 L 114 89 Z" fill="#D07848" stroke="#8B4020" strokeWidth="0.7"/>
      <path d="M 93 91 C 90 97 89 103 89 107" fill="none" stroke="#A84E28" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M 107 91 C 110 97 111 103 111 107" fill="none" stroke="#A84E28" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M 88 107 Q 100 111 112 107" fill="none" stroke="#EDD0A0" strokeWidth="1.1" opacity="0.55"/>

      {/* ── INTERACTIVE HOTSPOTS ── */}
      <ellipse cx="100" cy="49" rx="43" ry="45" {...hs('head')} onClick={() => onClick('head')}/>
      <rect x="82" y="86" width="36" height="25" rx="6" {...hs('neckThroat')} onClick={() => onClick('neckThroat')}/>
      <ellipse cx="36" cy="124" rx="24" ry="19" {...hs('leftShoulder')} onClick={() => onClick('leftShoulder')}/>
      <ellipse cx="164" cy="124" rx="24" ry="19" {...hs('rightShoulder')} onClick={() => onClick('rightShoulder')}/>
      <rect x="56" y="108" width="88" height="82" rx="8" {...hs('chest')} onClick={() => onClick('chest')}/>
      <rect x="62" y="188" width="76" height="68" rx="8" {...hs('abdomen')} onClick={() => onClick('abdomen')}/>
      <rect x="60" y="254" width="80" height="44" rx="8" {...hs('lowerAbdomen')} onClick={() => onClick('lowerAbdomen')}/>
      <rect x="4" y="138" width="38" height="110" rx="12" {...hs('leftArm')} onClick={() => onClick('leftArm')}/>
      <rect x="158" y="138" width="38" height="110" rx="12" {...hs('rightArm')} onClick={() => onClick('rightArm')}/>
      <rect x="4" y="246" width="40" height="94" rx="12" {...hs('leftForearm')} onClick={() => onClick('leftForearm')}/>
      <rect x="156" y="246" width="40" height="94" rx="12" {...hs('rightForearm')} onClick={() => onClick('rightForearm')}/>
      <rect x="58" y="312" width="36" height="118" rx="12" {...hs('leftLeg')} onClick={() => onClick('leftLeg')}/>
      <rect x="106" y="312" width="36" height="118" rx="12" {...hs('rightLeg')} onClick={() => onClick('rightLeg')}/>
      <ellipse cx="74" cy="440" rx="15" ry="13" {...hs('leftKnee')} onClick={() => onClick('leftKnee')}/>
      <ellipse cx="126" cy="440" rx="15" ry="13" {...hs('rightKnee')} onClick={() => onClick('rightKnee')}/>
      <rect x="57" y="452" width="30" height="44" rx="10" {...hs('leftLowerLeg')} onClick={() => onClick('leftLowerLeg')}/>
      <rect x="113" y="452" width="30" height="44" rx="10" {...hs('rightLowerLeg')} onClick={() => onClick('rightLowerLeg')}/>
      <rect x="44" y="490" width="40" height="34" rx="7" {...hs('leftFoot')} onClick={() => onClick('leftFoot')}/>
      <rect x="116" y="490" width="40" height="34" rx="7" {...hs('rightFoot')} onClick={() => onClick('rightFoot')}/>

      {/* Labels */}
      {[
        { k:'head', x:100, y:14, t:'Head' },
        { k:'chest', x:100, y:152, t:'Chest' },
        { k:'abdomen', x:100, y:225, t:'Abdomen' },
        { k:'lowerAbdomen', x:100, y:276, t:'Pelvis' },
        { k:'leftShoulder', x:36, y:109, t:'Shoulder' },
        { k:'rightShoulder', x:164, y:109, t:'Shoulder' },
        { k:'leftArm', x:23, y:195, t:'Bicep' },
        { k:'rightArm', x:177, y:195, t:'Bicep' },
        { k:'leftForearm', x:23, y:280, t:'Forearm' },
        { k:'rightForearm', x:177, y:280, t:'Forearm' },
        { k:'leftLeg', x:76, y:372, t:'Quad' },
        { k:'rightLeg', x:124, y:372, t:'Quad' },
        { k:'leftKnee', x:74, y:440, t:'Knee' },
        { k:'rightKnee', x:126, y:440, t:'Knee' },
        { k:'leftLowerLeg', x:72, y:474, t:'Calf' },
        { k:'rightLowerLeg', x:128, y:474, t:'Calf' },
      ].map(({ k, x, y, t }) => (
        <text key={k} x={x} y={y} textAnchor="middle" fontSize="5.5" fontWeight="700"
          fill="rgba(255,255,255,0.82)" style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {t}
        </text>
      ))}
    </g>
  );
}

/* ─── BACK BODY ──────────────────────────────────────────────────── */
function BackBody({ hs, onClick }) {
  return (
    <g>
      {/* ── BASE SHAPES ── */}

      {/* TORSO */}
      <path d="M 86 104 C 70 107 44 118 32 140 L 24 164 22 202 24 250 30 284 50 298 74 306 74 316 126 316 126 306 150 298 170 284 176 250 178 202 176 164 168 140 C 156 118 130 107 114 104 Z"
        fill="url(#gMuscle)" stroke="#6A1808" strokeWidth="1"/>

      {/* LEFT ARM */}
      <path d="M 32 140 C 20 153 10 172 8 194 L 6 232 10 270 19 302 32 296 39 266 37 230 38 194 C 38 172 36 154 32 140 Z"
        fill="url(#gArmL)" stroke="#6A1808" strokeWidth="0.9"/>
      <path d="M 19 300 C 11 308 6 320 9 330 C 12 338 22 340 30 336 L 36 324 40 312 37 298 Z"
        fill="url(#gHead)" stroke="#6A1808" strokeWidth="0.9"/>
      <line x1="12" y1="324" x2="10" y2="333" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="18" y1="329" x2="17" y2="338" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="25" y1="331" x2="25" y2="340" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="31" y1="328" x2="33" y2="336" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>

      {/* RIGHT ARM */}
      <path d="M 168 140 C 180 153 190 172 192 194 L 194 232 190 270 181 302 168 296 161 266 163 230 162 194 C 162 172 164 154 168 140 Z"
        fill="url(#gArmR)" stroke="#6A1808" strokeWidth="0.9"/>
      <path d="M 181 300 C 189 308 194 320 191 330 C 188 338 178 340 170 336 L 164 324 160 312 163 298 Z"
        fill="url(#gHead)" stroke="#6A1808" strokeWidth="0.9"/>
      <line x1="188" y1="324" x2="190" y2="333" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="182" y1="329" x2="183" y2="338" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="175" y1="331" x2="175" y2="340" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="169" y1="328" x2="167" y2="336" stroke="#9B3A1A" strokeWidth="1.2" strokeLinecap="round"/>

      {/* LEFT LEG */}
      <path d="M 74 313 C 68 342 64 382 62 422 L 60 458 58 492 70 500 81 495 85 460 87 422 89 382 90 316 Z"
        fill="url(#gLegL)" stroke="#6A1808" strokeWidth="0.9"/>
      <path d="M 58 492 C 50 500 46 511 51 518 C 55 524 72 525 81 518 L 81 495 Z"
        fill="url(#gHead)" stroke="#6A1808" strokeWidth="0.9"/>

      {/* RIGHT LEG */}
      <path d="M 126 313 C 132 342 136 382 138 422 L 140 458 142 492 130 500 119 495 115 460 113 422 111 382 110 316 Z"
        fill="url(#gLegR)" stroke="#6A1808" strokeWidth="0.9"/>
      <path d="M 142 492 C 150 500 154 511 149 518 C 145 524 128 525 119 518 L 119 495 Z"
        fill="url(#gHead)" stroke="#6A1808" strokeWidth="0.9"/>

      {/* ── BACK MUSCLE DETAILS ── */}

      {/* TRAPEZIUS */}
      <path d="M 84 106 C 70 108 48 120 36 140 L 32 150 C 60 142 80 130 100 125 C 120 130 140 142 168 150 L 164 140 C 152 120 130 108 116 106 Z"
        fill="#D06040" stroke="#7A2010" strokeWidth="0.6"/>
      <path d="M 100 111 C 80 117 58 130 44 144" fill="none" stroke="#F09060" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M 100 111 C 120 117 142 130 156 144" fill="none" stroke="#F09060" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

      {/* DELTOID LEFT back */}
      <path d="M 32 140 C 22 128 24 112 38 110 C 52 108 64 120 64 135 C 52 141 41 145 32 140 Z"
        fill="#D86040" stroke="#7A2010" strokeWidth="0.6"/>
      {/* DELTOID RIGHT back */}
      <path d="M 168 140 C 178 128 176 112 162 110 C 148 108 136 120 136 135 C 148 141 159 145 168 140 Z"
        fill="#D86040" stroke="#7A2010" strokeWidth="0.6"/>

      {/* SPINE */}
      <path d="M 100 110 L 100 292" stroke="#EDD0A0" strokeWidth="1.5" strokeDasharray="3,2.5" opacity="0.5"/>
      {[122,138,154,170,186,202,218,234,250,266,282].map(y => (
        <circle key={y} cx="100" cy={y} r="2.4" fill="#E8B870" stroke="#8B3018" strokeWidth="0.4"/>
      ))}

      {/* LATISSIMUS DORSI left */}
      <path d="M 64 132 C 50 154 46 188 52 222 C 56 240 66 250 76 252 L 80 232 C 68 220 64 198 66 174 C 68 156 72 140 80 130 Z"
        fill="#CC4A28" stroke="#7A2010" strokeWidth="0.6" opacity="0.85"/>
      <path d="M 68 140 C 60 164 58 196 64 224" fill="none" stroke="#E87040" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

      {/* LATISSIMUS DORSI right */}
      <path d="M 136 132 C 150 154 154 188 148 222 C 144 240 134 250 124 252 L 120 232 C 132 220 136 198 134 174 C 132 156 128 140 120 130 Z"
        fill="#CC4A28" stroke="#7A2010" strokeWidth="0.6" opacity="0.85"/>
      <path d="M 132 140 C 140 164 142 196 136 224" fill="none" stroke="#E87040" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

      {/* SCAPULA outlines */}
      <path d="M 62 122 C 54 134 52 152 56 170 C 60 182 70 188 78 186 C 84 180 84 164 82 150 C 80 136 74 124 66 120 Z"
        fill="none" stroke="#E8C890" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.5"/>
      <path d="M 138 122 C 146 134 148 152 144 170 C 140 182 130 188 122 186 C 116 180 116 164 118 150 C 120 136 126 124 134 120 Z"
        fill="none" stroke="#E8C890" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.5"/>

      {/* ERECTOR SPINAE */}
      <path d="M 92 128 L 90 282" stroke="#E8B060" strokeWidth="3" strokeLinecap="round" opacity="0.22"/>
      <path d="M 108 128 L 110 282" stroke="#E8B060" strokeWidth="3" strokeLinecap="round" opacity="0.22"/>

      {/* EXTERNAL OBLIQUE back */}
      <path d="M 72 200 C 59 222 55 252 58 278 C 62 287 72 294 80 296 L 80 270 C 68 258 66 232 70 210 Z"
        fill="#C84A28" stroke="#7A2010" strokeWidth="0.5" opacity="0.6"/>
      <path d="M 128 200 C 141 222 145 252 142 278 C 138 287 128 294 120 296 L 120 270 C 132 258 134 232 130 210 Z"
        fill="#C84A28" stroke="#7A2010" strokeWidth="0.5" opacity="0.6"/>

      {/* TRICEP LEFT */}
      <path d="M 10 190 C 10 202 12 216 14 228" fill="none" stroke="#EDD0A0" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M 28 180 C 22 196 20 216 22 230" fill="none" stroke="#EDD0A0" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
      {/* TRICEP RIGHT */}
      <path d="M 190 190 C 190 202 188 216 186 228" fill="none" stroke="#EDD0A0" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M 172 180 C 178 196 180 216 178 230" fill="none" stroke="#EDD0A0" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>

      {/* GLUTEUS MAXIMUS */}
      <path d="M 56 295 C 56 308 64 318 76 322 C 88 326 96 324 100 318 C 104 324 112 326 124 322 C 136 318 144 308 144 295 L 140 286 C 128 298 116 304 100 304 C 84 304 72 298 60 286 Z"
        fill="#D05838" stroke="#7A2010" strokeWidth="0.7"/>
      <line x1="100" y1="297" x2="100" y2="326" stroke="#8B2810" strokeWidth="1.6" opacity="0.5"/>
      <path d="M 76 298 C 70 306 70 316 76 320" fill="none" stroke="#F09060" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M 124 298 C 130 306 130 316 124 320" fill="none" stroke="#F09060" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      {/* Lower back dimples */}
      <circle cx="90" cy="265" r="3" fill="none" stroke="#EDD0A0" strokeWidth="0.9" opacity="0.45"/>
      <circle cx="110" cy="265" r="3" fill="none" stroke="#EDD0A0" strokeWidth="0.9" opacity="0.45"/>

      {/* SHORTS back */}
      <path d="M 54 292 C 68 310 100 320 132 310 L 146 292 L 142 320 C 120 342 80 342 58 320 Z"
        fill="#3A4A62" opacity="0.88" stroke="#252E40" strokeWidth="0.6"/>

      {/* BICEP FEMORIS left (outer hamstring) */}
      <path d="M 67 317 C 61 348 59 384 62 420 L 70 425 C 68 390 68 356 74 324 Z"
        fill="#C84828" stroke="#7A2010" strokeWidth="0.5" opacity="0.7"/>
      {/* SEMITENDINOSUS left (inner hamstring) */}
      <path d="M 88 317 C 90 348 88 382 84 418 L 78 423 C 80 388 82 354 84 322 Z"
        fill="#CC4E2C" stroke="#7A2010" strokeWidth="0.5" opacity="0.65"/>
      <path d="M 76 318 C 74 350 72 384 72 418" fill="none" stroke="#EDD0A0" strokeWidth="1.3" strokeLinecap="round" opacity="0.4"/>

      {/* BICEP FEMORIS right */}
      <path d="M 133 317 C 139 348 141 384 138 420 L 130 425 C 132 390 132 356 126 324 Z"
        fill="#C84828" stroke="#7A2010" strokeWidth="0.5" opacity="0.7"/>
      {/* SEMITENDINOSUS right */}
      <path d="M 112 317 C 110 348 112 382 116 418 L 122 423 C 120 388 118 354 116 322 Z"
        fill="#CC4E2C" stroke="#7A2010" strokeWidth="0.5" opacity="0.65"/>
      <path d="M 124 318 C 126 350 128 384 128 418" fill="none" stroke="#EDD0A0" strokeWidth="1.3" strokeLinecap="round" opacity="0.4"/>

      {/* POPLITEAL FOSSA (back of knee) */}
      <path d="M 63 422 Q 76 428 88 422" fill="none" stroke="#EDD0A0" strokeWidth="1.2" opacity="0.5"/>
      <path d="M 63 430 Q 76 424 88 430" fill="none" stroke="#EDD0A0" strokeWidth="0.8" opacity="0.3"/>
      <path d="M 112 422 Q 125 428 137 422" fill="none" stroke="#EDD0A0" strokeWidth="1.2" opacity="0.5"/>
      <path d="M 112 430 Q 125 424 137 430" fill="none" stroke="#EDD0A0" strokeWidth="0.8" opacity="0.3"/>

      {/* GASTROCNEMIUS left - calf bulges */}
      <path d="M 64 450 C 60 464 59 480 62 498 C 66 508 72 510 77 507 L 76 482 C 74 467 68 452 66 450 Z"
        fill="#D05838" stroke="#7A2010" strokeWidth="0.5" opacity="0.75"/>
      <path d="M 81 450 C 84 464 84 480 82 498 C 78 508 72 510 69 507 L 71 482 C 73 467 78 452 79 450 Z"
        fill="#CC4A28" stroke="#7A2010" strokeWidth="0.5" opacity="0.65"/>
      <path d="M 68 456 C 66 472 66 488 68 502" fill="none" stroke="#F09060" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>

      {/* GASTROCNEMIUS right */}
      <path d="M 136 450 C 140 464 141 480 138 498 C 134 508 128 510 123 507 L 124 482 C 126 467 132 452 134 450 Z"
        fill="#D05838" stroke="#7A2010" strokeWidth="0.5" opacity="0.75"/>
      <path d="M 119 450 C 116 464 116 480 118 498 C 122 508 128 510 131 507 L 129 482 C 127 467 121 452 121 450 Z"
        fill="#CC4A28" stroke="#7A2010" strokeWidth="0.5" opacity="0.65"/>
      <path d="M 132 456 C 134 472 134 488 132 502" fill="none" stroke="#F09060" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>

      {/* ACHILLES TENDON */}
      <line x1="74" y1="505" x2="74" y2="520" stroke="#EDD0A0" strokeWidth="2.5" strokeLinecap="round" opacity="0.55"/>
      <line x1="126" y1="505" x2="126" y2="520" stroke="#EDD0A0" strokeWidth="2.5" strokeLinecap="round" opacity="0.55"/>

      {/* SOLEUS (below gastrocnemius, visible sides) */}
      <path d="M 60 495 C 58 504 60 514 66 518" fill="none" stroke="#C84828" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M 140 495 C 142 504 140 514 134 518" fill="none" stroke="#C84828" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

      {/* ── HEAD (back) ── */}
      <path d="M 100 7 C 76 7 59 23 59 45 C 59 63 69 77 82 83 L 84 92 L 116 92 L 118 83 C 131 77 141 63 141 45 C 141 23 124 7 100 7 Z"
        fill="url(#gHead)" stroke="#8B4020" strokeWidth="0.9"/>
      <ellipse cx="100" cy="24" rx="36" ry="20" fill="#1E0F08"/>
      <path d="M 100 7 C 76 7 59 23 59 45 C 59 28 72 13 100 11 C 128 13 141 28 141 45 C 141 23 124 7 100 7 Z" fill="#1E0F08"/>
      <ellipse cx="58" cy="49" rx="5" ry="8" fill="#D47848" stroke="#8B4020" strokeWidth="0.6"/>
      <ellipse cx="142" cy="49" rx="5" ry="8" fill="#D47848" stroke="#8B4020" strokeWidth="0.6"/>
      {/* Neck back */}
      <path d="M 86 89 L 83 107 L 117 107 L 114 89 Z" fill="#D07848" stroke="#8B4020" strokeWidth="0.7"/>
      <path d="M 100 91 L 100 107" stroke="#EDD0A0" strokeWidth="1.3" strokeDasharray="2.5,2" opacity="0.5"/>

      {/* ── INTERACTIVE HOTSPOTS (back) ── */}
      <ellipse cx="100" cy="49" rx="43" ry="45" {...hs('headBack')} onClick={() => onClick('headBack')}/>
      <rect x="56" y="106" width="88" height="70" rx="8" {...hs('trapezius')} onClick={() => onClick('trapezius')}/>
      <rect x="22" y="108" width="44" height="70" rx="8" {...hs('leftShoulder')} onClick={() => onClick('leftShoulder')}/>
      <rect x="134" y="108" width="44" height="70" rx="8" {...hs('rightShoulder')} onClick={() => onClick('rightShoulder')}/>
      <rect x="66" y="174" width="68" height="74" rx="8" {...hs('midBack')} onClick={() => onClick('midBack')}/>
      <rect x="68" y="246" width="64" height="50" rx="8" {...hs('lowerBack')} onClick={() => onClick('lowerBack')}/>
      <rect x="50" y="292" width="100" height="44" rx="8" {...hs('buttocks')} onClick={() => onClick('buttocks')}/>
      <rect x="4" y="138" width="38" height="158" rx="12" {...hs('leftShoulder')} onClick={() => onClick('leftShoulder')} style={{ pointerEvents: 'none' }}/>
      <rect x="158" y="138" width="38" height="158" rx="12" {...hs('rightShoulder')} onClick={() => onClick('rightShoulder')} style={{ pointerEvents: 'none' }}/>
      <rect x="58" y="312" width="36" height="118" rx="12" {...hs('leftBackLeg')} onClick={() => onClick('leftBackLeg')}/>
      <rect x="106" y="312" width="36" height="118" rx="12" {...hs('rightBackLeg')} onClick={() => onClick('rightBackLeg')}/>
      <rect x="56" y="428" width="34" height="72" rx="10" {...hs('leftBackLeg')} onClick={() => onClick('leftBackLeg')} style={{ pointerEvents: 'none' }}/>
      <rect x="110" y="428" width="34" height="72" rx="10" {...hs('rightBackLeg')} onClick={() => onClick('rightBackLeg')} style={{ pointerEvents: 'none' }}/>

      {/* Labels */}
      {[
        { k:'headBack', x:100, y:14, t:'Head' },
        { k:'trapezius', x:100, y:138, t:'Trapezius' },
        { k:'midBack', x:100, y:210, t:'Mid Back' },
        { k:'lowerBack', x:100, y:270, t:'Lower Back' },
        { k:'leftShoulder', x:38, y:140, t:'Shoulder' },
        { k:'rightShoulder', x:162, y:140, t:'Shoulder' },
        { k:'buttocks', x:100, y:312, t:'Glutes' },
        { k:'leftBackLeg', x:76, y:372, t:'Hamstring' },
        { k:'rightBackLeg', x:124, y:372, t:'Hamstring' },
      ].map(({ k, x, y, t }) => (
        <text key={k} x={x} y={y} textAnchor="middle" fontSize="5.5" fontWeight="700"
          fill="rgba(255,255,255,0.82)" style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {t}
        </text>
      ))}
    </g>
  );
}

const card = {
  background: '#fff', border: '0.5px solid #e5e7eb',
  borderRadius: '14px', padding: '20px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
};
const greenBtn = {
  width: '100%', padding: '13px',
  background: '#0f6e56', color: '#fff',
  border: 'none', borderRadius: '10px',
  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
};
const clearBtn = {
  padding: '4px 12px', background: '#fff0f0', color: '#cc0000',
  border: '1px solid #ffcccc', borderRadius: '6px',
  fontSize: '12px', cursor: 'pointer',
};