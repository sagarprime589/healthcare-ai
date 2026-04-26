/* eslint-disable */
import React, { useState, useEffect } from 'react';
import EmergencyAlert from '../components/EmergencyAlert';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { getDiagnosis } from '../services/aiService';
import { useLang } from '../context/LanguageContext';

const t = {
  en: {
    badge: 'AI Health Assessment',
    heading: 'Tell us about your health',
    subheading: 'Fill in your details and our AI will analyze your symptoms',
    step1label: 'Personal Info',
    step2label: 'Symptoms',
    step1title: 'Personal Information',
    step1sub: 'Step 1 of 2 — Basic details',
    autofilled: '✓ Health profile auto-filled',
    fullName: 'Full Name', namePH: 'e.g. Rahul Sharma',
    age: 'Age', agePH: 'e.g. 25',
    gender: 'Gender', genderPH: 'Select gender',
    weight: 'Weight (kg)', weightPH: 'e.g. 70',
    bloodGroup: 'Blood Group', bloodPH: 'Select blood group',
    conditions: 'Pre-existing Conditions', condPH: 'e.g. Diabetes, BP (or None)',
    medications: 'Current Medications', medPH: 'e.g. Metformin (or None)',
    allergies: 'Allergies', allergyPH: 'e.g. Penicillin, Dust (or None)',
    continue: 'Continue to Symptoms →',
    step2title: 'Symptom Details',
    step2sub: 'Step 2 of 2 — What are you experiencing?',
    bloodNotSet: 'Blood group not set',
    symptomsLabel: 'Current Symptoms',
    symptomsPH: 'Describe your symptoms in detail...\ne.g. I have been experiencing headache, fever of 101°F, sore throat and body aches since yesterday evening',
    durationLabel: 'How long have you had these symptoms?',
    durations: ['Today', '2-3 days', '1 week', 'More than a week'],
    durationPH: 'Or type custom duration e.g. 5 days',
    disclaimer: '⚕ This AI assessment is for informational purposes only and is not a substitute for professional medical advice. Always consult a qualified doctor.',
    back: '← Back',
    analyzing: 'Analyzing symptoms...',
    waking: '⏳ Server waking up, please wait...',
    submit: 'Get AI Assessment →',
    footer: 'Your data is used only for this assessment and is not stored on any server.',
    male: 'Male', female: 'Female', other: 'Other',
  },
  hi: {
    badge: 'AI स्वास्थ्य मूल्यांकन',
    heading: 'अपने स्वास्थ्य के बारे में बताएं',
    subheading: 'अपनी जानकारी भरें और हमारा AI आपके लक्षणों का विश्लेषण करेगा',
    step1label: 'व्यक्तिगत जानकारी',
    step2label: 'लक्षण',
    step1title: 'व्यक्तिगत जानकारी',
    step1sub: 'चरण 1 / 2 — बुनियादी जानकारी',
    autofilled: '✓ स्वास्थ्य प्रोफ़ाइल भर दी गई',
    fullName: 'पूरा नाम', namePH: 'जैसे राहुल शर्मा',
    age: 'उम्र', agePH: 'जैसे 25',
    gender: 'लिंग', genderPH: 'लिंग चुनें',
    weight: 'वजन (किग्रा)', weightPH: 'जैसे 70',
    bloodGroup: 'रक्त समूह', bloodPH: 'रक्त समूह चुनें',
    conditions: 'पहले से मौजूद बीमारियां', condPH: 'जैसे डायबिटीज, बीपी (या कोई नहीं)',
    medications: 'वर्तमान दवाएं', medPH: 'जैसे मेटफॉर्मिन (या कोई नहीं)',
    allergies: 'एलर्जी', allergyPH: 'जैसे पेनिसिलिन, धूल (या कोई नहीं)',
    continue: 'लक्षणों की ओर जाएं →',
    step2title: 'लक्षण विवरण',
    step2sub: 'चरण 2 / 2 — आप क्या महसूस कर रहे हैं?',
    bloodNotSet: 'रक्त समूह नहीं भरा',
    symptomsLabel: 'वर्तमान लक्षण',
    symptomsPH: 'अपने लक्षणों का विस्तार से वर्णन करें...\nजैसे कल शाम से सिरदर्द, 101°F बुखार, गले में खराश और बदन दर्द हो रहा है',
    durationLabel: 'ये लक्षण कब से हैं?',
    durations: ['आज', '2-3 दिन', '1 सप्ताह', 'एक सप्ताह से अधिक'],
    durationPH: 'या खुद लिखें जैसे 5 दिन',
    disclaimer: '⚕ यह AI मूल्यांकन केवल जानकारी के लिए है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है। हमेशा किसी योग्य डॉक्टर से परामर्श करें।',
    back: '← वापस',
    analyzing: 'लक्षण विश्लेषण हो रहा है...',
    waking: '⏳ सर्वर शुरू हो रहा है, कृपया प्रतीक्षा करें...',
    submit: 'AI मूल्यांकन प्राप्त करें →',
    footer: 'आपका डेटा केवल इस मूल्यांकन के लिए उपयोग किया जाता है और किसी सर्वर पर संग्रहीत नहीं होता।',
    male: 'पुरुष', female: 'महिला', other: 'अन्य',
  },
};

function Diagnosis() {
  const { setPatientData, setAiResult, saveToHistory } = usePatient();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLang();
  const tx = t[lang];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: '', age: '', gender: '', weight: '',
    bloodGroup: '', symptoms: '', duration: '',
    existingConditions: '', medications: '', allergies: '',
  });
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    // Restore draft from session if exists
    const draft = sessionStorage.getItem('healthai_draft');
    if (draft) { try { setForm(JSON.parse(draft)); } catch (_) {} }

    const user = JSON.parse(localStorage.getItem('healthai_user') || 'null');
    const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    if (user && !user.isGuest) {
      fetch(`${API}/api/profile/${user.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.profile) {
            setForm(prev => ({
              ...prev,
              name: user.name || prev.name,
              weight: data.profile.weight || prev.weight,
              bloodGroup: data.profile.bloodGroup || prev.bloodGroup,
              existingConditions: data.profile.existingConditions || prev.existingConditions,
              medications: data.profile.medications || prev.medications,
              allergies: data.profile.allergies || prev.allergies,
            }));
            setProfileLoaded(true);
          }
        })
        .catch(() => {});
    }
    if (location.state?.symptoms) {
      setForm(prev => ({ ...prev, symptoms: location.state.symptoms }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    sessionStorage.setItem('healthai_draft', JSON.stringify(updated));
  };

  const [slowServer, setSlowServer] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSlowServer(false);
    const slowTimer = setTimeout(() => setSlowServer(true), 8000);
    try {
      const result = await getDiagnosis(form, lang);
      setPatientData(form);
      setAiResult(result);
      saveToHistory(form, result);
      sessionStorage.removeItem('healthai_draft');
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong. If the server just woke up, wait 30 seconds and try again.');
      console.error(err);
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      setSlowServer(false);
    }
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const step1Complete = form.name && form.age && form.gender;
  const step2Complete = form.symptoms;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '32px 20px' }}>
      <EmergencyAlert symptoms={form.symptoms} />
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e1f5ee', color: '#0f6e56', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>
            <span>⚕</span> {tx.badge}
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
            {tx.heading}
          </h1>
          <p style={{ margin: 0, color: '#888', fontSize: '15px' }}>
            {tx.subheading}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          <StepDot number={1} active={step === 1} done={step > 1} label={tx.step1label} />
          <div style={{ flex: 1, height: '2px', background: step > 1 ? '#0f6e56' : '#e5e7eb', margin: '0 8px', transition: 'background 0.3s' }} />
          <StepDot number={2} active={step === 2} done={false} label={tx.step2label} />
        </div>

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '16px', border: '0.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

          {step === 1 && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, #0f6e56, #1d9e75)', padding: '20px 24px' }}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '17px', fontWeight: '600' }}>{tx.step1title}</h2>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>{tx.step1sub}</p>
                {profileLoaded && (
                  <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#fff', display: 'inline-block' }}>
                    {tx.autofilled}
                  </div>
                )}
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <Label>{tx.fullName}</Label>
                    <Input name="name" value={form.name} onChange={handleChange} placeholder={tx.namePH} required />
                  </div>

                  <div>
                    <Label>{tx.age}</Label>
                    <Input name="age" type="number" value={form.age} onChange={handleChange} placeholder={tx.agePH} required />
                  </div>

                  <div>
                    <Label>{tx.gender}</Label>
                    <Select name="gender" value={form.gender} onChange={handleChange} required>
                      <option value="">{tx.genderPH}</option>
                      <option value="Male">{tx.male}</option>
                      <option value="Female">{tx.female}</option>
                      <option value="Other">{tx.other}</option>
                    </Select>
                  </div>

                  <div>
                    <Label>{tx.weight}</Label>
                    <Input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder={tx.weightPH} />
                  </div>

                  <div>
                    <Label>{tx.bloodGroup}</Label>
                    <Select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                      <option value="">{tx.bloodPH}</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                        <option key={bg}>{bg}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label>{tx.conditions}</Label>
                    <Input name="existingConditions" value={form.existingConditions} onChange={handleChange} placeholder={tx.condPH} />
                  </div>

                  <div>
                    <Label>{tx.medications}</Label>
                    <Input name="medications" value={form.medications} onChange={handleChange} placeholder={tx.medPH} />
                  </div>

                  <div style={{ gridColumn: '1/-1' }}>
                    <Label>{tx.allergies}</Label>
                    <Input name="allergies" value={form.allergies} onChange={handleChange} placeholder={tx.allergyPH} />
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  disabled={!step1Complete}
                  style={{ ...submitBtn, marginTop: '24px', opacity: step1Complete ? 1 : 0.5, cursor: step1Complete ? 'pointer' : 'not-allowed' }}>
                  {tx.continue}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, #0f6e56, #1d9e75)', padding: '20px 24px' }}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '17px', fontWeight: '600' }}>{tx.step2title}</h2>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>{tx.step2sub}</p>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ background: '#f0faf6', border: '0.5px solid #1d9e75', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px' }}>👤</span>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f6e56' }}>{form.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{lang === 'hi' ? 'उम्र' : 'Age'} {form.age} · {form.gender} · {form.bloodGroup || tx.bloodNotSet}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Label>{tx.symptomsLabel} <span style={{ color: '#e24b4a' }}>*</span></Label>
                  <textarea
                    name="symptoms"
                    value={form.symptoms}
                    onChange={handleChange}
                    placeholder={tx.symptomsPH}
                    rows={5}
                    required
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Label>{tx.durationLabel}</Label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                    {tx.durations.map((d, idx) => (
                      <button key={d} type="button"
                        onClick={() => setForm({ ...form, duration: d })}
                        style={{
                          padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                          background: form.duration === d ? '#0f6e56' : '#f5f7fa',
                          color: form.duration === d ? '#fff' : '#555',
                          border: form.duration === d ? '1px solid #0f6e56' : '1px solid #e5e7eb',
                        }}>
                        {d}
                      </button>
                    ))}
                  </div>
                  <Input name="duration" value={form.duration} onChange={handleChange} placeholder={tx.durationPH} />
                </div>

                <div style={{ background: '#fff8e1', border: '0.5px solid #ffe082', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#856404', lineHeight: '1.6' }}>
                    {tx.disclaimer}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={prevStep} style={backBtn}>{tx.back}</button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !step2Complete}
                    style={{ ...submitBtn, flex: 1, opacity: (loading || !step2Complete) ? 0.7 : 1, cursor: (loading || !step2Complete) ? 'not-allowed' : 'pointer' }}>
                    {loading ? (
                      <span>{slowServer ? tx.waking : tx.analyzing}</span>
                    ) : (
                      <span>{tx.submit}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', marginTop: '16px' }}>
          {tx.footer}
        </p>
      </div>
    </div>
  );
}

function StepDot({ number, active, done, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: '700',
        background: done ? '#0f6e56' : active ? '#0f6e56' : '#e5e7eb',
        color: done || active ? '#fff' : '#aaa',
        transition: 'all 0.3s',
      }}>
        {done ? '✓' : number}
      </div>
      <span style={{ fontSize: '11px', color: active ? '#0f6e56' : '#aaa', fontWeight: active ? '600' : '400' }}>{label}</span>
    </div>
  );
}

function Label({ children }) {
  return (
    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '6px' }}>
      {children}
    </label>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', fontFamily: 'inherit' }}>
      {children}
    </select>
  );
}

const submitBtn = {
  width: '100%',
  padding: '13px',
  background: '#0f6e56',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
};

const backBtn = {
  padding: '13px 20px',
  background: '#f5f7fa',
  color: '#555',
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: '500',
  cursor: 'pointer',
};

export default Diagnosis;