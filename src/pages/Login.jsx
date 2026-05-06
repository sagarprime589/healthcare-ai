import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

export default function Login() {
  const navigate = useNavigate();
  const { setPatientData, setAiResult } = usePatient();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // forgot password state
  const [forgotStep, setForgotStep] = useState(0); // 0=login, 1=enter email, 2=enter otp+newpass
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [devOtp, setDevOtp] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('healthai_user', JSON.stringify(data.user));
      setPatientData(null);
      setAiResult(null);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guest = { id: 'guest_' + Date.now(), name: 'Guest User', email: '', isGuest: true };
    localStorage.setItem('healthai_user', JSON.stringify(guest));
    setPatientData(null);
    setAiResult(null);
    navigate('/');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setDevOtp('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.devOtp) setDevOtp(data.devOtp);
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setForgotError('Password must be at least 6 characters'); return; }
    setForgotLoading(true);
    setForgotError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForgotSuccess('Password reset successfully! You can now log in.');
      setTimeout(() => {
        setForgotStep(0);
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setForgotSuccess('');
        setForgotError('');
      }, 2500);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgot = () => {
    setForgotStep(0);
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
    setForgotError('');
    setForgotSuccess('');
    setDevOtp('');
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '52px', height: '52px', background: '#0f6e56', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '22px' }}>⚕</div>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: '700' }}>
            {forgotStep === 0 ? 'Welcome back' : 'Reset Password'}
          </h1>
          <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
            {forgotStep === 0 && 'Sign in to your HealthAI account'}
            {forgotStep === 1 && 'Enter your registered email to receive an OTP'}
            {forgotStep === 2 && `OTP sent to ${forgotEmail}`}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: '0.5px solid #e5e7eb', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

          {/* ── STEP 0: Login ── */}
          {forgotStep === 0 && (
            <>
              {error && <div style={errorBox}>⚠ {error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={labelStyle}>Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required style={inputStyle} />
                </div>
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                  <button type="button" onClick={() => setForgotStep(1)} style={linkBtn}>
                    Forgot password?
                  </button>
                </div>
                <button type="submit" disabled={loading} style={submitBtn}>
                  {loading ? 'Signing in...' : 'Sign In →'}
                </button>
              </form>

              <div style={divider}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                <span style={{ fontSize: '12px', color: '#aaa', padding: '0 8px' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              </div>

              <button type="button" onClick={handleGuestLogin} style={guestBtn}>
                Continue as Guest
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', margin: '8px 0 0' }}>
                Guest history is not saved across devices
              </p>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '20px', marginBottom: 0 }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#0f6e56', fontWeight: '600', textDecoration: 'none' }}>Create one</Link>
              </p>
            </>
          )}

          {/* ── STEP 1: Enter email to get OTP ── */}
          {forgotStep === 1 && (
            <>
              {forgotError && <div style={errorBox}>⚠ {forgotError}</div>}

              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Registered Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={inputStyle}
                  />
                </div>
                <button type="submit" disabled={forgotLoading} style={submitBtn}>
                  {forgotLoading ? 'Sending OTP...' : 'Send OTP to Email →'}
                </button>
              </form>

              <button type="button" onClick={resetForgot} style={{ ...guestBtn, marginTop: '12px' }}>
                ← Back to Login
              </button>
            </>
          )}

          {/* ── STEP 2: Enter OTP + new password ── */}
          {forgotStep === 2 && (
            <>
              {forgotError && <div style={errorBox}>⚠ {forgotError}</div>}
              {forgotSuccess && <div style={successBox}>✓ {forgotSuccess}</div>}

              {devOtp ? (
                <div style={{ background: '#fefce8', border: '2px solid #f59e0b', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Your OTP (email not configured)
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '10px', color: '#0f6e56', textAlign: 'center', padding: '8px 0' }}>
                    {devOtp}
                  </div>
                  <div style={{ fontSize: '11px', color: '#92400e', textAlign: 'center', marginTop: '4px' }}>
                    Copy this code and enter it below
                  </div>
                </div>
              ) : (
                <div style={{ background: '#e1f5ee', border: '1px solid #1d9e75', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: '#0f6e56' }}>
                  📧 A 6-digit OTP has been sent to <strong>{forgotEmail}</strong>. Check your inbox (and spam folder).
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="6-digit code"
                    maxLength={6}
                    required
                    style={{ ...inputStyle, letterSpacing: '6px', fontSize: '18px', textAlign: 'center' }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    style={inputStyle}
                  />
                </div>
                <button type="submit" disabled={forgotLoading || !!forgotSuccess} style={submitBtn}>
                  {forgotLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
                <button type="button" onClick={resetForgot} style={linkBtn}>← Back to Login</button>
                <button type="button" onClick={() => { setForgotStep(1); setOtp(''); setNewPassword(''); setForgotError(''); }} style={linkBtn}>
                  Resend OTP
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const submitBtn = { width: '100%', padding: '13px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' };
const guestBtn = { width: '100%', padding: '13px', background: '#f5f7fa', color: '#444', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' };
const linkBtn = { background: 'none', border: 'none', color: '#0f6e56', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0 };
const errorBox = { background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' };
const successBox = { background: '#e1f5ee', border: '1px solid #1d9e75', color: '#0f6e56', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' };
const divider = { display: 'flex', alignItems: 'center', margin: '16px 0' };
