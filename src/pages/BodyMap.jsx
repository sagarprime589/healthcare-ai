/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FRONT_PARTS = {
  head:         { label: 'Head & Face',           symptoms: ['Headache', 'Migraine', 'Dizziness', 'Head injury', 'Forehead pain', 'Facial pain'] },
  eyes:         { label: 'Eyes',                  symptoms: ['Eye pain', 'Blurred vision', 'Red eyes', 'Itchy eyes', 'Watery eyes', 'Light sensitivity'] },
  nose:         { label: 'Nose & Sinuses',        symptoms: ['Runny nose', 'Blocked nose', 'Sneezing', 'Nosebleed', 'Loss of smell', 'Sinus pain'] },
  throat:       { label: 'Throat & Neck',         symptoms: ['Sore throat', 'Difficulty swallowing', 'Hoarse voice', 'Neck pain', 'Swollen glands', 'Stiff neck'] },
  chest:        { label: 'Chest',                 symptoms: ['Chest pain', 'Shortness of breath', 'Cough', 'Palpitations', 'Wheezing', 'Chest tightness'] },
  leftArm:      { label: 'Left Arm',              symptoms: ['Arm pain', 'Weakness', 'Numbness', 'Swelling', 'Joint pain', 'Tingling'] },
  rightArm:     { label: 'Right Arm',             symptoms: ['Arm pain', 'Weakness', 'Numbness', 'Swelling', 'Joint pain', 'Tingling'] },
  abdomen:      { label: 'Abdomen',               symptoms: ['Stomach pain', 'Nausea', 'Vomiting', 'Bloating', 'Indigestion', 'Cramps'] },
  lowerAbdomen: { label: 'Lower Abdomen & Pelvis',symptoms: ['Lower abdominal pain', 'Cramps', 'Bloating', 'Constipation', 'Diarrhea', 'Pelvic pain'] },
  leftLeg:      { label: 'Left Leg',              symptoms: ['Leg pain', 'Swelling', 'Cramps', 'Weakness', 'Knee pain', 'Varicose veins'] },
  rightLeg:     { label: 'Right Leg',             symptoms: ['Leg pain', 'Swelling', 'Cramps', 'Weakness', 'Knee pain', 'Varicose veins'] },
  leftFoot:     { label: 'Left Foot & Ankle',     symptoms: ['Foot pain', 'Ankle pain', 'Swelling', 'Numbness', 'Heel pain', 'Toe pain'] },
  rightFoot:    { label: 'Right Foot & Ankle',    symptoms: ['Foot pain', 'Ankle pain', 'Swelling', 'Numbness', 'Heel pain', 'Toe pain'] },
};

const BACK_PARTS = {
  upperBack:     { label: 'Upper Back & Shoulders', symptoms: ['Upper back pain', 'Shoulder blade pain', 'Muscle stiffness', 'Spasm', 'Posture pain', 'Burning sensation'] },
  midBack:       { label: 'Mid Back',               symptoms: ['Mid back pain', 'Spine pain', 'Muscle ache', 'Stiffness', 'Rib pain', 'Nerve pain'] },
  lowerBack:     { label: 'Lower Back',             symptoms: ['Lower back pain', 'Sciatica', 'Disc pain', 'Stiffness', 'Radiating pain', 'Muscle spasm'] },
  leftShoulder:  { label: 'Left Shoulder',          symptoms: ['Shoulder pain', 'Rotator cuff pain', 'Stiffness', 'Limited movement', 'Clicking sound', 'Swelling'] },
  rightShoulder: { label: 'Right Shoulder',         symptoms: ['Shoulder pain', 'Rotator cuff pain', 'Stiffness', 'Limited movement', 'Clicking sound', 'Swelling'] },
  buttocks:      { label: 'Buttocks & Hips',        symptoms: ['Hip pain', 'Buttock pain', 'Sciatica', 'Pain while sitting', 'Hip stiffness', 'Numbness'] },
  leftBackLeg:   { label: 'Left Leg (Back)',         symptoms: ['Hamstring pain', 'Calf pain', 'Cramps', 'Sciatica', 'Swelling', 'Varicose veins'] },
  rightBackLeg:  { label: 'Right Leg (Back)',        symptoms: ['Hamstring pain', 'Calf pain', 'Cramps', 'Sciatica', 'Swelling', 'Varicose veins'] },
};

export default function BodyMap() {
  const navigate = useNavigate();
  const [view, setView] = useState('front');
  const [selected, setSelected] = useState(null);
  const [allSymptoms, setAllSymptoms] = useState([]);

  const currentParts = view === 'front' ? FRONT_PARTS : BACK_PARTS;

  const toggleSymptom = (symptom) => {
    setAllSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const hasSymptoms = (key) => currentParts[key]?.symptoms.some(s => allSymptoms.includes(s));
  const isActive = (key) => selected === key;

  const handlePartClick = (key) => setSelected(key === selected ? null : key);

  const handleProceed = () => {
    if (allSymptoms.length === 0) return;
    navigate('/diagnosis', { state: { symptoms: allSymptoms.join(', ') } });
  };

  const getHotspotStyle = (key) => ({
    fill: isActive(key) ? 'rgba(15,110,86,0.55)' : hasSymptoms(key) ? 'rgba(29,158,117,0.30)' : 'rgba(255,255,255,0.02)',
    stroke: isActive(key) ? '#0f6e56' : hasSymptoms(key) ? '#1d9e75' : 'rgba(180,180,180,0.25)',
    strokeWidth: isActive(key) ? 1.8 : 1,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 20px' }}>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '700' }}>Body Map Symptom Checker</h2>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
          Click on a body part to select your symptoms, then proceed to AI diagnosis
        </p>
      </div>

      {/* Front / Back toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '4px', display: 'inline-flex', gap: '2px' }}>
          {['front', 'back'].map(v => (
            <button key={v} onClick={() => { setView(v); setSelected(null); }} style={{
              padding: '9px 28px', borderRadius: '9px', border: 'none',
              fontSize: '14px', fontWeight: '500', cursor: 'pointer',
              background: view === v ? '#0f6e56' : 'transparent',
              color: view === v ? '#fff' : '#666',
              transition: 'all 0.2s',
            }}>
              {v === 'front' ? '🫁 Front View' : '🦴 Back View'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }}>

        {/* ── SVG Body ── */}
        <div style={{
          background: 'linear-gradient(160deg, #eef6f2 0%, #f8fafc 60%, #e8f0ee 100%)',
          borderRadius: '20px', border: '1px solid #dde8e4',
          padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}>
          <svg viewBox="0 0 200 520" width="100%" style={{ maxWidth: '220px' }}>
            <defs>
              <radialGradient id="skinHead" cx="44%" cy="36%" r="62%">
                <stop offset="0%" stopColor="#FDDDBF"/>
                <stop offset="55%" stopColor="#F0B98D"/>
                <stop offset="100%" stopColor="#C98B68"/>
              </radialGradient>
              <radialGradient id="skinTorso" cx="50%" cy="25%" r="68%">
                <stop offset="0%" stopColor="#FDDDBF"/>
                <stop offset="60%" stopColor="#F0B98D"/>
                <stop offset="100%" stopColor="#C4896A"/>
              </radialGradient>
              <linearGradient id="skinArm" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C98B68"/>
                <stop offset="35%" stopColor="#F0B98D"/>
                <stop offset="65%" stopColor="#F5C5A0"/>
                <stop offset="100%" stopColor="#C98B68"/>
              </linearGradient>
              <linearGradient id="skinLeg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C98B68"/>
                <stop offset="35%" stopColor="#F0B98D"/>
                <stop offset="65%" stopColor="#F5C5A0"/>
                <stop offset="100%" stopColor="#C98B68"/>
              </linearGradient>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2C1F14"/>
                <stop offset="100%" stopColor="#4A3020"/>
              </linearGradient>
            </defs>

            {view === 'front'
              ? <FrontBody ghs={getHotspotStyle} onClick={handlePartClick} />
              : <BackBody  ghs={getHotspotStyle} onClick={handlePartClick} />
            }
          </svg>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { color: 'rgba(15,110,86,0.55)', border: '#0f6e56', label: 'Selected' },
              { color: 'rgba(29,158,117,0.30)', border: '#1d9e75', label: 'Has symptoms' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#666' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.color, border: `1px solid ${l.border}` }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div>
          {selected ? (
            <div style={card}>
              <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '700' }}>
                {currentParts[selected]?.label}
              </h3>
              <p style={{ fontSize: '13px', color: '#888', margin: '0 0 16px' }}>Select all symptoms that apply:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {currentParts[selected]?.symptoms.map(symptom => {
                  const checked = allSymptoms.includes(symptom);
                  return (
                    <label key={symptom} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '9px 12px', borderRadius: '9px', cursor: 'pointer', fontSize: '13px',
                      background: checked ? '#e1f5ee' : '#f9fafb',
                      border: `1px solid ${checked ? '#1d9e75' : '#e5e7eb'}`,
                      transition: 'all 0.15s',
                    }}>
                      <input type="checkbox" checked={checked} onChange={() => toggleSymptom(symptom)}
                        style={{ width: '15px', height: '15px', accentColor: '#0f6e56', flexShrink: 0 }} />
                      <span style={{ color: checked ? '#0f6e56' : '#444', fontWeight: checked ? '600' : '400' }}>
                        {symptom}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ ...card, background: '#f9fafb', textAlign: 'center', padding: '64px 24px' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>👆</div>
              <p style={{ color: '#888', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
                Click any body part on the diagram to see symptoms
              </p>
              <p style={{ color: '#bbb', fontSize: '12px', marginTop: '8px' }}>
                Switch between Front and Back view for complete coverage
              </p>
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
                    {s} <span style={{ opacity: 0.5, fontSize: '14px', lineHeight: 1 }}>×</span>
                  </span>
                ))}
              </div>
              <button onClick={handleProceed} style={greenBtn}>
                Get AI Diagnosis for these symptoms →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── FRONT BODY ─────────────────────────────────────────── */
function FrontBody({ ghs, onClick }) {
  return (
    <g>
      {/* ── STATIC VISUAL LAYER ── */}

      {/* HEAD */}
      <path d="M100 9 C76 9 59 25 59 47 C59 65 69 79 83 85 L85 93 L115 93 L117 85 C131 79 141 65 141 47 C141 25 124 9 100 9Z"
        fill="url(#skinHead)" stroke="#C08060" strokeWidth="0.8"/>
      {/* Hair */}
      <path d="M100 9 C76 9 59 25 59 47 C59 26 72 13 100 11 C128 13 141 26 141 47 C141 25 124 9 100 9Z"
        fill="url(#hairGrad)" stroke="none"/>
      <ellipse cx="100" cy="24" rx="32" ry="16" fill="url(#hairGrad)" opacity="0.7" stroke="none"/>
      {/* Ears */}
      <ellipse cx="58" cy="51" rx="5" ry="8" fill="#E8A882" stroke="#C08060" strokeWidth="0.6"/>
      <ellipse cx="142" cy="51" rx="5" ry="8" fill="#E8A882" stroke="#C08060" strokeWidth="0.6"/>
      <path d="M59 46 Q62 51 59 56" fill="none" stroke="#C08060" strokeWidth="0.5"/>
      <path d="M141 46 Q138 51 141 56" fill="none" stroke="#C08060" strokeWidth="0.5"/>
      {/* Eyebrows */}
      <path d="M79 38 Q87 35 95 38" fill="none" stroke="#3A2518" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M105 38 Q113 35 121 38" fill="none" stroke="#3A2518" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Eyes */}
      <ellipse cx="87" cy="45" rx="7" ry="5" fill="white" stroke="#999" strokeWidth="0.5"/>
      <circle cx="87" cy="45" r="3.5" fill="#3A2518"/>
      <circle cx="88.2" cy="43.5" r="1.1" fill="white"/>
      <ellipse cx="113" cy="45" rx="7" ry="5" fill="white" stroke="#999" strokeWidth="0.5"/>
      <circle cx="113" cy="45" r="3.5" fill="#3A2518"/>
      <circle cx="114.2" cy="43.5" r="1.1" fill="white"/>
      {/* Upper eyelid lines */}
      <path d="M80 42 Q87 39 94 42" fill="none" stroke="#3A2518" strokeWidth="0.7"/>
      <path d="M106 42 Q113 39 120 42" fill="none" stroke="#3A2518" strokeWidth="0.7"/>
      {/* Nose */}
      <path d="M100 53 L97 64 Q100 67 103 64Z" fill="#D4956A" stroke="none"/>
      <path d="M97 64 Q93 67 94 70 Q100 69 106 70 Q107 67 103 64" fill="#D4956A" stroke="none"/>
      {/* Mouth */}
      <path d="M92 75 Q100 80 108 75" fill="#E07070" stroke="none"/>
      <path d="M92 75 Q100 72 108 75" fill="none" stroke="#C06060" strokeWidth="0.6"/>
      <path d="M92 75 Q100 80 108 75" fill="none" stroke="#C06060" strokeWidth="0.6"/>
      {/* Chin definition */}
      <path d="M94 84 Q100 88 106 84" fill="none" stroke="#C08060" strokeWidth="0.5"/>

      {/* NECK */}
      <path d="M87 91 L84 112 L116 112 L113 91Z" fill="url(#skinTorso)" stroke="#C08060" strokeWidth="0.7"/>
      <path d="M93 93 L90 110" fill="none" stroke="#C08060" strokeWidth="0.4" opacity="0.6"/>
      <path d="M107 93 L110 110" fill="none" stroke="#C08060" strokeWidth="0.4" opacity="0.6"/>
      <path d="M87 112 Q100 116 113 112" fill="none" stroke="#C08060" strokeWidth="0.6"/>

      {/* TORSO */}
      <path d="M84 110 C62 114 38 126 32 147 L28 168 L32 212 L36 257 L46 287 L72 294 L72 310 L128 310 L128 294 L154 287 L164 257 L168 212 L172 168 L168 147 C162 126 138 114 116 110Z"
        fill="url(#skinTorso)" stroke="#C08060" strokeWidth="0.8"/>
      {/* Collar bones */}
      <path d="M88 113 Q100 118 112 113" fill="none" stroke="#C08060" strokeWidth="0.8"/>
      {/* Sternum */}
      <path d="M100 116 L100 210" fill="none" stroke="#C08060" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.5"/>
      {/* Chest muscles hint */}
      <path d="M100 135 Q78 142 64 155" fill="none" stroke="#C08060" strokeWidth="0.5" opacity="0.4"/>
      <path d="M100 135 Q122 142 136 155" fill="none" stroke="#C08060" strokeWidth="0.5" opacity="0.4"/>
      {/* Navel */}
      <ellipse cx="100" cy="232" rx="3.5" ry="4.5" fill="none" stroke="#C08060" strokeWidth="1"/>
      {/* Abs hint */}
      <path d="M94 200 L94 230" fill="none" stroke="#C08060" strokeWidth="0.4" strokeDasharray="4,3" opacity="0.35"/>
      <path d="M106 200 L106 230" fill="none" stroke="#C08060" strokeWidth="0.4" strokeDasharray="4,3" opacity="0.35"/>
      {/* Hip curve */}
      <path d="M46 280 Q100 298 154 280" fill="none" stroke="#C08060" strokeWidth="0.5" opacity="0.5"/>

      {/* UNDERWEAR */}
      <path d="M46 283 Q100 302 154 283 L150 312 Q100 326 50 312Z" fill="#7090AA" opacity="0.55" stroke="none"/>

      {/* LEFT ARM */}
      <path d="M32 147 C20 155 11 170 9 188 L7 228 L11 268 L20 298 L35 293 L40 262 L38 222 L40 185 C38 168 35 154 32 147Z"
        fill="url(#skinArm)" stroke="#C08060" strokeWidth="0.8"/>
      {/* Left arm muscle line */}
      <path d="M16 175 C14 210 16 245 20 275" fill="none" stroke="#C08060" strokeWidth="0.4" opacity="0.4"/>
      {/* LEFT HAND */}
      <path d="M20 296 C13 302 9 313 11 322 C13 329 20 332 27 329 L31 320 L37 313 L35 294Z"
        fill="url(#skinArm)" stroke="#C08060" strokeWidth="0.8"/>
      <path d="M13 316 Q11 326 15 329" fill="none" stroke="#C08060" strokeWidth="0.5"/>
      <path d="M19 320 Q18 330 22 332" fill="none" stroke="#C08060" strokeWidth="0.5"/>
      <path d="M26 317 Q26 327 28 329" fill="none" stroke="#C08060" strokeWidth="0.5"/>

      {/* RIGHT ARM */}
      <path d="M168 147 C180 155 189 170 191 188 L193 228 L189 268 L180 298 L165 293 L160 262 L162 222 L160 185 C162 168 165 154 168 147Z"
        fill="url(#skinArm)" stroke="#C08060" strokeWidth="0.8"/>
      <path d="M184 175 C186 210 184 245 180 275" fill="none" stroke="#C08060" strokeWidth="0.4" opacity="0.4"/>
      {/* RIGHT HAND */}
      <path d="M180 296 C187 302 191 313 189 322 C187 329 180 332 173 329 L169 320 L163 313 L165 294Z"
        fill="url(#skinArm)" stroke="#C08060" strokeWidth="0.8"/>
      <path d="M187 316 Q189 326 185 329" fill="none" stroke="#C08060" strokeWidth="0.5"/>
      <path d="M181 320 Q182 330 178 332" fill="none" stroke="#C08060" strokeWidth="0.5"/>
      <path d="M174 317 Q174 327 172 329" fill="none" stroke="#C08060" strokeWidth="0.5"/>

      {/* LEFT LEG */}
      <path d="M72 310 L68 382 L64 432 L62 480 L74 484 L80 480 L84 432 L86 380 L88 310Z"
        fill="url(#skinLeg)" stroke="#C08060" strokeWidth="0.8"/>
      {/* Left kneecap */}
      <ellipse cx="76" cy="392" rx="10" ry="8" fill="#E8A882" stroke="#C08060" strokeWidth="0.6"/>
      <path d="M68 392 Q76 396 84 392" fill="none" stroke="#C08060" strokeWidth="0.5"/>
      {/* LEFT FOOT */}
      <path d="M62 480 C55 486 50 495 54 502 C58 507 74 507 80 501 L80 480Z"
        fill="url(#skinLeg)" stroke="#C08060" strokeWidth="0.8"/>
      <path d="M54 500 L52 505" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M58 503 L57 508" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M63 505 L63 510" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M68 505 L69 510" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M73 503 L75 507" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>

      {/* RIGHT LEG */}
      <path d="M128 310 L132 382 L136 432 L138 480 L126 484 L120 480 L116 432 L114 380 L112 310Z"
        fill="url(#skinLeg)" stroke="#C08060" strokeWidth="0.8"/>
      {/* Right kneecap */}
      <ellipse cx="124" cy="392" rx="10" ry="8" fill="#E8A882" stroke="#C08060" strokeWidth="0.6"/>
      <path d="M116 392 Q124 396 132 392" fill="none" stroke="#C08060" strokeWidth="0.5"/>
      {/* RIGHT FOOT */}
      <path d="M138 480 C145 486 150 495 146 502 C142 507 126 507 120 501 L120 480Z"
        fill="url(#skinLeg)" stroke="#C08060" strokeWidth="0.8"/>
      <path d="M146 500 L148 505" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M142 503 L143 508" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M137 505 L137 510" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M132 505 L131 510" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M127 503 L125 507" fill="none" stroke="#C08060" strokeWidth="0.8" strokeLinecap="round"/>

      {/* ── INTERACTIVE HOTSPOTS ── */}
      <ellipse cx="100" cy="51" rx="43" ry="45" {...ghs('head')} onClick={() => onClick('head')}/>
      <rect x="76" y="38" width="48" height="15" rx="5" {...ghs('eyes')} onClick={() => onClick('eyes')}/>
      <rect x="92" y="52" width="16" height="18" rx="5" {...ghs('nose')} onClick={() => onClick('nose')}/>
      <rect x="83" y="89" width="34" height="26" rx="7" {...ghs('throat')} onClick={() => onClick('throat')}/>
      <rect x="58" y="110" width="84" height="96" rx="7" {...ghs('chest')} onClick={() => onClick('chest')}/>
      <rect x="60" y="203" width="80" height="62" rx="7" {...ghs('abdomen')} onClick={() => onClick('abdomen')}/>
      <rect x="54" y="262" width="92" height="52" rx="7" {...ghs('lowerAbdomen')} onClick={() => onClick('lowerAbdomen')}/>
      <rect x="6" y="142" width="40" height="188" rx="12" {...ghs('leftArm')} onClick={() => onClick('leftArm')}/>
      <rect x="154" y="142" width="40" height="188" rx="12" {...ghs('rightArm')} onClick={() => onClick('rightArm')}/>
      <rect x="60" y="310" width="32" height="178" rx="12" {...ghs('leftLeg')} onClick={() => onClick('leftLeg')}/>
      <rect x="108" y="310" width="32" height="178" rx="12" {...ghs('rightLeg')} onClick={() => onClick('rightLeg')}/>
      <rect x="48" y="477" width="36" height="34" rx="7" {...ghs('leftFoot')} onClick={() => onClick('leftFoot')}/>
      <rect x="116" y="477" width="36" height="34" rx="7" {...ghs('rightFoot')} onClick={() => onClick('rightFoot')}/>

      {/* Part labels */}
      {[
        { key:'head', x:100, y:16, t:'Head' },
        { key:'chest', x:100, y:158, t:'Chest' },
        { key:'abdomen', x:100, y:234, t:'Abdomen' },
        { key:'lowerAbdomen', x:100, y:285, t:'Pelvis' },
        { key:'leftArm', x:21, y:218, t:'L.Arm' },
        { key:'rightArm', x:179, y:218, t:'R.Arm' },
        { key:'leftLeg', x:76, y:385, t:'L.Leg' },
        { key:'rightLeg', x:124, y:385, t:'R.Leg' },
      ].map(({ key, x, y, t }) => (
        <text key={key} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          fontSize="5.8" fontWeight="700" fill="#555" opacity="0.8"
          style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {t}
        </text>
      ))}
    </g>
  );
}

/* ─── BACK BODY ──────────────────────────────────────────── */
function BackBody({ ghs, onClick }) {
  return (
    <g>
      {/* HEAD (back) */}
      <path d="M100 9 C76 9 59 25 59 47 C59 65 69 79 83 85 L85 93 L115 93 L117 85 C131 79 141 65 141 47 C141 25 124 9 100 9Z"
        fill="url(#skinHead)" stroke="#C08060" strokeWidth="0.8"/>
      <ellipse cx="100" cy="32" rx="38" ry="26" fill="url(#hairGrad)" stroke="none"/>
      <path d="M100 9 C76 9 59 25 59 47 C59 26 72 13 100 11 C128 13 141 26 141 47 C141 25 124 9 100 9Z"
        fill="url(#hairGrad)" stroke="none"/>
      <ellipse cx="58" cy="51" rx="5" ry="8" fill="#E8A882" stroke="#C08060" strokeWidth="0.6"/>
      <ellipse cx="142" cy="51" rx="5" ry="8" fill="#E8A882" stroke="#C08060" strokeWidth="0.6"/>

      {/* NECK */}
      <path d="M87 91 L84 112 L116 112 L113 91Z" fill="url(#skinTorso)" stroke="#C08060" strokeWidth="0.7"/>
      <path d="M100 93 L100 110" fill="none" stroke="#C08060" strokeWidth="0.8" strokeDasharray="2,1.5"/>

      {/* BACK TORSO */}
      <path d="M84 110 C62 114 38 126 32 147 L28 168 L32 212 L36 257 L46 287 L72 294 L72 310 L128 310 L128 294 L154 287 L164 257 L168 212 L172 168 L168 147 C162 126 138 114 116 110Z"
        fill="url(#skinTorso)" stroke="#C08060" strokeWidth="0.8"/>
      {/* Spine */}
      <path d="M100 114 L100 288" fill="none" stroke="#C08060" strokeWidth="0.9" strokeDasharray="3,2.5"/>
      {[122,137,152,167,182,197,212,228,244,260,275].map(y => (
        <circle key={y} cx="100" cy={y} r="2.2" fill="#D4956A" stroke="#C08060" strokeWidth="0.4"/>
      ))}
      {/* Shoulder blades */}
      <ellipse cx="78" cy="156" rx="19" ry="24" fill="none" stroke="#C08060" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.7"/>
      <ellipse cx="122" cy="156" rx="19" ry="24" fill="none" stroke="#C08060" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.7"/>
      {/* Back muscles */}
      <path d="M76 118 C60 145 55 185 60 225" fill="none" stroke="#C08060" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.45"/>
      <path d="M124 118 C140 145 145 185 140 225" fill="none" stroke="#C08060" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.45"/>
      <path d="M86 118 C78 145 76 185 78 225" fill="none" stroke="#C08060" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.3"/>
      <path d="M114 118 C122 145 124 185 122 225" fill="none" stroke="#C08060" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.3"/>
      {/* Lower back dimples */}
      <circle cx="90" cy="262" r="3" fill="none" stroke="#C08060" strokeWidth="0.7" opacity="0.5"/>
      <circle cx="110" cy="262" r="3" fill="none" stroke="#C08060" strokeWidth="0.7" opacity="0.5"/>

      {/* ARMS */}
      <path d="M32 147 C20 155 11 170 9 188 L7 228 L11 268 L20 298 L35 293 L40 262 L38 222 L40 185 C38 168 35 154 32 147Z"
        fill="url(#skinArm)" stroke="#C08060" strokeWidth="0.8"/>
      <path d="M20 296 C13 302 9 313 11 322 C13 329 20 332 27 329 L31 320 L37 313 L35 294Z"
        fill="url(#skinArm)" stroke="#C08060" strokeWidth="0.8"/>
      <path d="M168 147 C180 155 189 170 191 188 L193 228 L189 268 L180 298 L165 293 L160 262 L162 222 L160 185 C162 168 165 154 168 147Z"
        fill="url(#skinArm)" stroke="#C08060" strokeWidth="0.8"/>
      <path d="M180 296 C187 302 191 313 189 322 C187 329 180 332 173 329 L169 320 L163 313 L165 294Z"
        fill="url(#skinArm)" stroke="#C08060" strokeWidth="0.8"/>

      {/* BUTTOCKS */}
      <path d="M46 283 Q72 304 100 304 Q128 304 154 283 L150 314 Q100 330 50 314Z"
        fill="#E8A882" stroke="#C08060" strokeWidth="0.6"/>
      <path d="M100 294 L100 322" fill="none" stroke="#C08060" strokeWidth="0.6" strokeDasharray="2,1.5"/>

      {/* UNDERWEAR */}
      <path d="M46 283 Q100 304 154 283 L150 314 Q100 328 50 314Z" fill="#7090AA" opacity="0.55" stroke="none"/>

      {/* LEGS */}
      <path d="M72 310 L68 382 L64 432 L62 480 L74 484 L80 480 L84 432 L86 380 L88 310Z"
        fill="url(#skinLeg)" stroke="#C08060" strokeWidth="0.8"/>
      {/* Calf muscle left */}
      <ellipse cx="74" cy="445" rx="9" ry="20" fill="none" stroke="#C08060" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6"/>
      {/* Knee back left */}
      <path d="M66 388 Q76 384 86 388" fill="none" stroke="#C08060" strokeWidth="0.7" opacity="0.5"/>
      <path d="M62 480 C55 486 50 495 54 502 C58 507 74 507 80 501 L80 480Z"
        fill="url(#skinLeg)" stroke="#C08060" strokeWidth="0.8"/>

      <path d="M128 310 L132 382 L136 432 L138 480 L126 484 L120 480 L116 432 L114 380 L112 310Z"
        fill="url(#skinLeg)" stroke="#C08060" strokeWidth="0.8"/>
      <ellipse cx="126" cy="445" rx="9" ry="20" fill="none" stroke="#C08060" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6"/>
      <path d="M114 388 Q124 384 134 388" fill="none" stroke="#C08060" strokeWidth="0.7" opacity="0.5"/>
      <path d="M138 480 C145 486 150 495 146 502 C142 507 126 507 120 501 L120 480Z"
        fill="url(#skinLeg)" stroke="#C08060" strokeWidth="0.8"/>

      {/* ── INTERACTIVE HOTSPOTS (back) ── */}
      <rect x="28" y="108" width="42" height="60" rx="7" {...ghs('leftShoulder')} onClick={() => onClick('leftShoulder')}/>
      <rect x="130" y="108" width="42" height="60" rx="7" {...ghs('rightShoulder')} onClick={() => onClick('rightShoulder')}/>
      <rect x="60" y="108" width="80" height="65" rx="7" {...ghs('upperBack')} onClick={() => onClick('upperBack')}/>
      <rect x="65" y="170" width="70" height="62" rx="7" {...ghs('midBack')} onClick={() => onClick('midBack')}/>
      <rect x="65" y="230" width="70" height="58" rx="7" {...ghs('lowerBack')} onClick={() => onClick('lowerBack')}/>
      <rect x="50" y="282" width="100" height="42" rx="7" {...ghs('buttocks')} onClick={() => onClick('buttocks')}/>
      <rect x="60" y="310" width="32" height="178" rx="12" {...ghs('leftBackLeg')} onClick={() => onClick('leftBackLeg')}/>
      <rect x="108" y="310" width="32" height="178" rx="12" {...ghs('rightBackLeg')} onClick={() => onClick('rightBackLeg')}/>

      {/* Labels */}
      {[
        { key:'upperBack', x:100, y:136, t:'Upper Back' },
        { key:'midBack', x:100, y:198, t:'Mid Back' },
        { key:'lowerBack', x:100, y:258, t:'Lower Back' },
        { key:'leftShoulder', x:42, y:136, t:'L.Shoulder' },
        { key:'rightShoulder', x:158, y:136, t:'R.Shoulder' },
        { key:'buttocks', x:100, y:302, t:'Hips' },
        { key:'leftBackLeg', x:76, y:385, t:'L.Leg' },
        { key:'rightBackLeg', x:124, y:385, t:'R.Leg' },
      ].map(({ key, x, y, t }) => (
        <text key={key} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          fontSize="5.8" fontWeight="700" fill="#555" opacity="0.8"
          style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {t}
        </text>
      ))}
    </g>
  );
}

const card = {
  background: '#fff',
  border: '0.5px solid #e5e7eb',
  borderRadius: '14px',
  padding: '20px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
};
const greenBtn = {
  width: '100%', padding: '13px',
  background: '#0f6e56', color: '#fff',
  border: 'none', borderRadius: '10px',
  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
};
const clearBtn = {
  padding: '4px 12px',
  background: '#fff0f0', color: '#cc0000',
  border: '1px solid #ffcccc', borderRadius: '6px',
  fontSize: '12px', cursor: 'pointer',
};