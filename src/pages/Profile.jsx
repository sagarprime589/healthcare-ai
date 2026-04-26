import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ChangePassword({ userId }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) { setErr('New password must be at least 6 characters'); return; }
    if (form.newPassword !== form.confirm) { setErr('Passwords do not match'); return; }
    setSaving(true); setErr(''); setMsg('');
    try {
      const res = await fetch(`${API}/api/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handle} style={{ ...card, marginTop: '16px' }}>
      <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '700' }}>Change Password</h2>
      <p style={{ margin: '0 0 20px', color: '#888', fontSize: '13px' }}>Update your account password</p>
      {msg && <div style={{ background: '#e1f5ee', border: '1px solid #1d9e75', color: '#0f6e56', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>✓ {msg}</div>}
      {err && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>⚠ {err}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div><Label>Current Password</Label><Input type="password" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} placeholder="Enter current password" required/></div>
        <div><Label>New Password</Label><Input type="password" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="Min. 6 characters" required/></div>
        <div><Label>Confirm New Password</Label><Input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Re-enter new password" required/></div>
      </div>
      <button type="submit" disabled={saving} style={{ ...saveBtn, marginTop: '20px', opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('healthai_user') || 'null');

  const [form, setForm] = useState({
    height: '', weight: '', bloodGroup: '',
    existingConditions: '', medications: '', allergies: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.isGuest) { navigate('/login'); return; }
    fetch(`${API}/api/profile/${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.profile) setForm({ ...form, ...data.profile });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API}/api/profile/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('Profile saved! Your details will auto-fill in future diagnoses.');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '80px', color: '#888' }}>Loading profile...</div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '48px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0f6e56,#1d9e75)', padding: '32px 32px 72px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '700', color: '#fff', border: '2px solid rgba(255,255,255,0.4)' }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '22px', fontWeight: '700' }}>{user?.name}</h1>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div style={{ maxWidth: '640px', margin: '-48px auto 0', padding: '0 20px' }}>
        <form onSubmit={handleSave}>
          <div style={card}>
            <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '700' }}>Health Profile</h2>
            <p style={{ margin: '0 0 24px', color: '#888', fontSize: '13px' }}>
              Save your details once — they'll auto-fill every time you run a diagnosis.
            </p>

            {success && (
              <div style={{ background: '#e1f5ee', border: '1px solid #1d9e75', color: '#0f6e56', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>
                ✓ {success}
              </div>
            )}
            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Label>Height (cm)</Label>
                <Input name="height" value={form.height} onChange={handleChange} placeholder="e.g. 175"/>
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 70"/>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <Label>Blood Group</Label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} style={selectStyle}>
                  <option value="">Select blood group</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <Label>Pre-existing Conditions</Label>
                <Input name="existingConditions" value={form.existingConditions} onChange={handleChange} placeholder="e.g. Diabetes, Hypertension (or None)"/>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <Label>Current Medications</Label>
                <Input name="medications" value={form.medications} onChange={handleChange} placeholder="e.g. Metformin 500mg (or None)"/>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <Label>Allergies</Label>
                <Input name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g. Penicillin, Dust (or None)"/>
              </div>
            </div>

            {/* BMI Display */}
            {form.height && form.weight && (
              <BmiCard height={form.height} weight={form.weight} />
            )}

            <button type="submit" disabled={saving} style={{ ...saveBtn, marginTop: '24px', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save Profile →'}
            </button>
          </div>
        </form>

        <ChangePassword userId={user?.id} />

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
          <button onClick={() => navigate('/diagnosis')} style={actionCard('#0f6e56', '#fff')}>
            <span style={{ fontSize: '20px' }}>🩺</span>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>Start Diagnosis</span>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>Profile will auto-fill</span>
          </button>
          <button onClick={() => navigate('/history')} style={actionCard('#1d9e75', '#fff')}>
            <span style={{ fontSize: '20px' }}>📋</span>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>View History</span>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>Past diagnoses</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function BmiCard({ height, weight }) {
  const h = parseFloat(height) / 100;
  const w = parseFloat(weight);
  if (!h || !w || h <= 0) return null;
  const bmi = (w / (h * h)).toFixed(1);
  const { label, color, bg } = bmi < 18.5
    ? { label: 'Underweight', color: '#1d4ed8', bg: '#eff6ff' }
    : bmi < 25
    ? { label: 'Normal', color: '#065f46', bg: '#d1fae5' }
    : bmi < 30
    ? { label: 'Overweight', color: '#92400e', bg: '#fef3c7' }
    : { label: 'Obese', color: '#7f1d1d', bg: '#fee2e2' };

  return (
    <div style={{ background: bg, border: `1px solid ${color}30`, borderRadius: '12px', padding: '14px 18px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ fontSize: '28px', fontWeight: '700', color }}>{bmi}</div>
      <div>
        <div style={{ fontWeight: '600', fontSize: '14px', color }}>BMI — {label}</div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
          Healthy range: 18.5 – 24.9
        </div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '6px' }}>{children}</label>;
}
function Input(props) {
  return <input {...props} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}/>;
}

const selectStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', fontFamily: 'inherit' };
const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' };
const saveBtn = { width: '100%', padding: '13px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' };
function actionCard(bg, color) {
  return { display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', padding: '18px 20px', background: bg, color, border: 'none', borderRadius: '14px', cursor: 'pointer', textAlign: 'left' };
}
