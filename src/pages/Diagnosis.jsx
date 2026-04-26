/* eslint-disable */
import React, { useState, useEffect } from 'react';
import EmergencyAlert from '../components/EmergencyAlert';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { getDiagnosis } from '../services/aiService';

function Diagnosis() {
  const { setPatientData, setAiResult, saveToHistory } = usePatient();
  const navigate = useNavigate();
  const location = useLocation();
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
      const result = await getDiagnosis(form);
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
            <span>⚕</span> AI Health Assessment
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
            Tell us about your health
          </h1>
          <p style={{ margin: 0, color: '#888', fontSize: '15px' }}>
            Fill in your details and our AI will analyze your symptoms
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          <StepDot number={1} active={step === 1} done={step > 1} label="Personal Info" />
          <div style={{ flex: 1, height: '2px', background: step > 1 ? '#0f6e56' : '#e5e7eb', margin: '0 8px', transition: 'background 0.3s' }} />
          <StepDot number={2} active={step === 2} done={false} label="Symptoms" />
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
                <h2 style={{ margin: 0, color: '#fff', fontSize: '17px', fontWeight: '600' }}>Personal Information</h2>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>Step 1 of 2 — Basic details</p>
                {profileLoaded && (
                  <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#fff', display: 'inline-block' }}>
                    ✓ Health profile auto-filled
                  </div>
                )}
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <Label>Full Name</Label>
                    <Input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" required />
                  </div>

                  <div>
                    <Label>Age</Label>
                    <Input name="age" type="number" value={form.age} onChange={handleChange} placeholder="e.g. 25" required />
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <Select name="gender" value={form.gender} onChange={handleChange} required>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Select>
                  </div>

                  <div>
                    <Label>Weight (kg)</Label>
                    <Input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="e.g. 70" />
                  </div>

                  <div>
                    <Label>Blood Group</Label>
                    <Select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                      <option value="">Select blood group</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                        <option key={bg}>{bg}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label>Pre-existing Conditions</Label>
                    <Input name="existingConditions" value={form.existingConditions} onChange={handleChange} placeholder="e.g. Diabetes, BP (or None)" />
                  </div>

                  <div>
                    <Label>Current Medications</Label>
                    <Input name="medications" value={form.medications} onChange={handleChange} placeholder="e.g. Metformin (or None)" />
                  </div>

                  <div style={{ gridColumn: '1/-1' }}>
                    <Label>Allergies</Label>
                    <Input name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g. Penicillin, Dust (or None)" />
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  disabled={!step1Complete}
                  style={{ ...submitBtn, marginTop: '24px', opacity: step1Complete ? 1 : 0.5, cursor: step1Complete ? 'pointer' : 'not-allowed' }}>
                  Continue to Symptoms →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, #0f6e56, #1d9e75)', padding: '20px 24px' }}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '17px', fontWeight: '600' }}>Symptom Details</h2>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>Step 2 of 2 — What are you experiencing?</p>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ background: '#f0faf6', border: '0.5px solid #1d9e75', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px' }}>👤</span>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f6e56' }}>{form.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Age {form.age} · {form.gender} · {form.bloodGroup || 'Blood group not set'}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Label>Current Symptoms <span style={{ color: '#e24b4a' }}>*</span></Label>
                  <textarea
                    name="symptoms"
                    value={form.symptoms}
                    onChange={handleChange}
                    placeholder="Describe your symptoms in detail...&#10;e.g. I have been experiencing headache, fever of 101°F, sore throat and body aches since yesterday evening"
                    rows={5}
                    required
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Label>How long have you had these symptoms?</Label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                    {['Today', '2-3 days', '1 week', 'More than a week'].map(d => (
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
                  <Input name="duration" value={form.duration} onChange={handleChange} placeholder="Or type custom duration e.g. 5 days" />
                </div>

                <div style={{ background: '#fff8e1', border: '0.5px solid #ffe082', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#856404', lineHeight: '1.6' }}>
                    ⚕ This AI assessment is for informational purposes only and is not a substitute for professional medical advice. Always consult a qualified doctor.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={prevStep} style={backBtn}>← Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !step2Complete}
                    style={{ ...submitBtn, flex: 1, opacity: (loading || !step2Complete) ? 0.7 : 1, cursor: (loading || !step2Complete) ? 'not-allowed' : 'pointer' }}>
                    {loading ? (
                      <span>{slowServer ? '⏳ Server waking up, please wait...' : 'Analyzing symptoms...'}</span>
                    ) : (
                      <span>Get AI Assessment →</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', marginTop: '16px' }}>
          Your data is used only for this assessment and is not stored on any server.
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