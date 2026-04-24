import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const bodyParts = {
  head: { label: 'Head', symptoms: ['Headache', 'Dizziness', 'Migraine', 'Hair loss', 'Head injury'] },
  eyes: { label: 'Eyes', symptoms: ['Eye pain', 'Blurred vision', 'Red eyes', 'Itchy eyes', 'Watery eyes'] },
  nose: { label: 'Nose', symptoms: ['Runny nose', 'Blocked nose', 'Sneezing', 'Nosebleed', 'Loss of smell'] },
  throat: { label: 'Throat & Neck', symptoms: ['Sore throat', 'Difficulty swallowing', 'Hoarse voice', 'Neck pain', 'Swollen glands'] },
  chest: { label: 'Chest', symptoms: ['Chest pain', 'Shortness of breath', 'Cough', 'Palpitations', 'Wheezing'] },
  leftArm: { label: 'Left Arm', symptoms: ['Arm pain', 'Weakness', 'Numbness', 'Swelling', 'Joint pain'] },
  rightArm: { label: 'Right Arm', symptoms: ['Arm pain', 'Weakness', 'Numbness', 'Swelling', 'Joint pain'] },
  stomach: { label: 'Abdomen', symptoms: ['Stomach pain', 'Nausea', 'Vomiting', 'Bloating', 'Indigestion'] },
  lowerAbdomen: { label: 'Lower Abdomen', symptoms: ['Lower abdominal pain', 'Cramps', 'Bloating', 'Constipation', 'Diarrhea'] },
  leftLeg: { label: 'Left Leg', symptoms: ['Leg pain', 'Swelling', 'Cramps', 'Weakness', 'Joint pain'] },
  rightLeg: { label: 'Right Leg', symptoms: ['Leg pain', 'Swelling', 'Cramps', 'Weakness', 'Joint pain'] },
  back: { label: 'Back', symptoms: ['Back pain', 'Lower back pain', 'Stiffness', 'Muscle spasm', 'Spine pain'] },
};

export default function BodyMap() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [checkedSymptoms, setCheckedSymptoms] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]);

  const isActive = (key) => selected === key;
  const hasSymptoms = (key) => bodyParts[key].symptoms.some(s => allSymptoms.includes(s));

  const fill = (key) => isActive(key) ? '#0f6e56' : hasSymptoms(key) ? '#1d9e75' : '#c8e6d8';
  const stroke = (key) => isActive(key) ? '#085041' : '#0f6e56';
  const textFill = (key) => isActive(key) || hasSymptoms(key) ? '#fff' : '#0f6e56';

  const toggleSymptom = (symptom) => {
    if (checkedSymptoms.includes(symptom)) {
      setCheckedSymptoms(checkedSymptoms.filter(s => s !== symptom));
      setAllSymptoms(allSymptoms.filter(s => s !== symptom));
    } else {
      setCheckedSymptoms([...checkedSymptoms, symptom]);
      setAllSymptoms([...new Set([...allSymptoms, symptom])]);
    }
  };

  const handleProceed = () => {
    if (allSymptoms.length === 0) return;
    navigate('/diagnosis', { state: { symptoms: allSymptoms.join(', ') } });
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px' }}>
      <h2 style={{ margin: '0 0 6px' }}>Body Map Symptom Checker</h2>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>
        Click on a body part to select your symptoms, then proceed to AI diagnosis.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px', alignItems: 'start' }}>

        <div style={{ background: '#f9fafb', borderRadius: '16px', border: '0.5px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox="0 0 200 420" width="100%" style={{ maxWidth: '220px' }}>

            {/* HEAD */}
            <ellipse cx="100" cy="38" rx="28" ry="33" fill={fill('head')} stroke={stroke('head')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('head')} />
            {/* face details */}
            <ellipse cx="91" cy="35" rx="4" ry="5" fill={fill('eyes')} stroke={stroke('eyes')} strokeWidth="1" style={{ cursor: 'pointer' }} onClick={() => setSelected('eyes')} />
            <ellipse cx="109" cy="35" rx="4" ry="5" fill={fill('eyes')} stroke={stroke('eyes')} strokeWidth="1" style={{ cursor: 'pointer' }} onClick={() => setSelected('eyes')} />
            <ellipse cx="100" cy="44" rx="3" ry="4" fill={fill('nose')} stroke={stroke('nose')} strokeWidth="1" style={{ cursor: 'pointer' }} onClick={() => setSelected('nose')} />
            <path d="M 90 52 Q 100 58 110 52" fill="none" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />

            {/* NECK */}
            <rect x="88" y="68" width="24" height="18" rx="4" fill={fill('throat')} stroke={stroke('throat')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('throat')} />

            {/* SHOULDERS */}
            <ellipse cx="57" cy="100" rx="22" ry="14" fill={fill('leftArm')} stroke={stroke('leftArm')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('leftArm')} />
            <ellipse cx="143" cy="100" rx="22" ry="14" fill={fill('rightArm')} stroke={stroke('rightArm')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('rightArm')} />

            {/* TORSO - CHEST */}
            <rect x="68" y="84" width="64" height="60" rx="8" fill={fill('chest')} stroke={stroke('chest')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('chest')} />
            {/* chest line detail */}
            <line x1="100" y1="88" x2="100" y2="140" stroke={isActive('chest') ? 'rgba(255,255,255,0.3)' : 'rgba(0,100,60,0.15)'} strokeWidth="1" />

            {/* LEFT ARM */}
            <rect x="36" y="112" width="22" height="70" rx="10" fill={fill('leftArm')} stroke={stroke('leftArm')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('leftArm')} />
            {/* left forearm */}
            <rect x="30" y="180" width="20" height="55" rx="9" fill={fill('leftArm')} stroke={stroke('leftArm')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('leftArm')} />
            {/* left hand */}
            <ellipse cx="40" cy="242" rx="12" ry="8" fill={fill('leftArm')} stroke={stroke('leftArm')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('leftArm')} />

            {/* RIGHT ARM */}
            <rect x="142" y="112" width="22" height="70" rx="10" fill={fill('rightArm')} stroke={stroke('rightArm')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('rightArm')} />
            {/* right forearm */}
            <rect x="150" y="180" width="20" height="55" rx="9" fill={fill('rightArm')} stroke={stroke('rightArm')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('rightArm')} />
            {/* right hand */}
            <ellipse cx="160" cy="242" rx="12" ry="8" fill={fill('rightArm')} stroke={stroke('rightArm')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('rightArm')} />

            {/* ABDOMEN */}
            <rect x="68" y="142" width="64" height="50" rx="4" fill={fill('stomach')} stroke={stroke('stomach')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('stomach')} />

            {/* LOWER ABDOMEN / PELVIS */}
            <rect x="68" y="190" width="64" height="40" rx="4" fill={fill('lowerAbdomen')} stroke={stroke('lowerAbdomen')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('lowerAbdomen')} />

            {/* LEFT LEG upper */}
            <rect x="68" y="228" width="28" height="75" rx="10" fill={fill('leftLeg')} stroke={stroke('leftLeg')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('leftLeg')} />
            {/* LEFT LEG lower */}
            <rect x="70" y="300" width="24" height="70" rx="9" fill={fill('leftLeg')} stroke={stroke('leftLeg')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('leftLeg')} />
            {/* left foot */}
            <ellipse cx="82" cy="376" rx="16" ry="8" fill={fill('leftLeg')} stroke={stroke('leftLeg')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('leftLeg')} />

            {/* RIGHT LEG upper */}
            <rect x="104" y="228" width="28" height="75" rx="10" fill={fill('rightLeg')} stroke={stroke('rightLeg')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('rightLeg')} />
            {/* RIGHT LEG lower */}
            <rect x="106" y="300" width="24" height="70" rx="9" fill={fill('rightLeg')} stroke={stroke('rightLeg')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('rightLeg')} />
            {/* right foot */}
            <ellipse cx="118" cy="376" rx="16" ry="8" fill={fill('rightLeg')} stroke={stroke('rightLeg')} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelected('rightLeg')} />

            {/* LABELS */}
            {[
              { key: 'head', x: 100, y: 38 },
              { key: 'throat', x: 100, y: 78 },
              { key: 'chest', x: 100, y: 114 },
              { key: 'stomach', x: 100, y: 167 },
              { key: 'lowerAbdomen', x: 100, y: 210 },
              { key: 'leftArm', x: 40, y: 152 },
              { key: 'rightArm', x: 160, y: 152 },
              { key: 'leftLeg', x: 82, y: 265 },
              { key: 'rightLeg', x: 118, y: 265 },
            ].map(({ key, x, y }) => (
              <text key={key} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize="6.5" fontWeight="600" fill={textFill(key)}
                style={{ cursor: 'pointer', pointerEvents: 'none' }}>
                {bodyParts[key].label.split(' ')[0]}
              </text>
            ))}
          </svg>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '11px', color: '#888' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#0f6e56', display: 'inline-block' }} /> Selected
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#1d9e75', display: 'inline-block' }} /> Has symptoms
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#c8e6d8', display: 'inline-block' }} /> Normal
            </span>
          </div>
        </div>

        <div>
          {selected ? (
            <div style={card}>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{bodyParts[selected].label}</h3>
              <p style={{ fontSize: '13px', color: '#888', margin: '0 0 14px' }}>Select all symptoms that apply:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {bodyParts[selected].symptoms.map(symptom => (
                  <label key={symptom} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={checkedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                      style={{ width: '16px', height: '16px', accentColor: '#0f6e56' }}
                    />
                    {symptom}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ ...card, background: '#f9fafb', textAlign: 'center', padding: '50px 20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>👈</div>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Click any body part to see symptoms</p>
            </div>
          )}

          {allSymptoms.length > 0 && (
            <div style={{ ...card, marginTop: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#0f6e56' }}>
                Selected Symptoms ({allSymptoms.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {allSymptoms.map(s => (
                  <span key={s} style={{ background: '#e1f5ee', color: '#0f6e56', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500' }}>
                    {s}
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

const card = {
  background: '#fff',
  border: '0.5px solid #e5e7eb',
  borderRadius: '12px',
  padding: '18px',
};

const greenBtn = {
  width: '100%',
  padding: '11px',
  background: '#0f6e56',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
};