const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// OTP store (in-memory is fine — OTPs are short-lived)
const otpStore = {};

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Auth routes ──────────────────────────────────────────

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    // Support both bcrypt hashes and old plain-text passwords (migration)
    const isHashed = user.password.startsWith('$2');
    const valid = isHashed
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    // Upgrade plain-text password to bcrypt hash on successful login
    if (!isHashed) {
      const hashed = await bcrypt.hash(password, 10);
      await User.updateOne({ _id: user._id }, { password: hashed });
    }

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No account found with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };

    transporter.sendMail({
      from: `"HealthAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'HealthAI — Password Reset OTP',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f5f7fa;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:48px;height:48px;background:#0f6e56;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:22px;">⚕</div>
            <h2 style="margin:12px 0 4px;color:#1a1a1a;">Password Reset</h2>
            <p style="margin:0;color:#888;font-size:14px;">Your HealthAI OTP code</p>
          </div>
          <div style="background:#fff;border-radius:10px;padding:24px;text-align:center;border:1px solid #e5e7eb;">
            <p style="margin:0 0 12px;color:#555;font-size:14px;">Use this OTP to reset your password. It expires in <strong>10 minutes</strong>.</p>
            <div style="font-size:36px;font-weight:700;letter-spacing:10px;color:#0f6e56;padding:16px 0;">${otp}</div>
            <p style="margin:12px 0 0;color:#aaa;font-size:12px;">If you didn't request this, ignore this email.</p>
          </div>
        </div>
      `,
    }, (err) => {
      if (err) {
        console.error('Mail error:', err);
        return res.status(500).json({ error: 'Failed to send OTP email. Try again.' });
      }
      res.json({ message: 'OTP sent to your email' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ error: 'All fields are required' });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }
  if (record.otp !== otp) return res.status(400).json({ error: 'Incorrect OTP' });

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate({ email }, { password: hashed });
    if (!user) return res.status(404).json({ error: 'Account not found' });
    delete otpStore[email];
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Reset failed' });
  }
});

// ── AI routes ────────────────────────────────────────────

app.post('/api/diagnose', async (req, res) => {
  const patientData = req.body;

  const prompt = `You are an experienced medical AI assistant. A patient has provided the following information:
- Name: ${patientData.name}
- Age: ${patientData.age}
- Gender: ${patientData.gender}
- Weight: ${patientData.weight} kg
- Blood Group: ${patientData.bloodGroup}
- Current Symptoms: ${patientData.symptoms}
- Symptom Duration: ${patientData.duration}
- Pre-existing Conditions: ${patientData.existingConditions}
- Current Medications: ${patientData.medications}
- Allergies: ${patientData.allergies}

Provide a structured medical assessment with exactly this format:

POSSIBLE CONDITIONS:
1. [Condition name] - [percentage]% likelihood - [one line explanation]
2. [Condition name] - [percentage]% likelihood - [one line explanation]
3. [Condition name] - [percentage]% likelihood - [one line explanation]

URGENCY LEVEL:
[Low / Moderate / High / Critical] - [one sentence reason]

RECOMMENDED MEDICINES:
1. [Medicine name] - [dosage] - [purpose]
2. [Medicine name] - [dosage] - [purpose]
3. [Medicine name] - [dosage] - [purpose]

RECOMMENDED TESTS:
1. [Test name] - [reason]
2. [Test name] - [reason]

HOME REMEDIES:
1. [Remedy] - [benefit]
2. [Remedy] - [benefit]
3. [Remedy] - [benefit]

SEE A DOCTOR IF:
1. [warning sign]
2. [warning sign]
3. [warning sign]

DISCLAIMER:
This is an AI-generated assessment and not a substitute for professional medical advice.`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful medical AI assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const text = response.data.choices[0].message.content;
    res.json({ result: text });
  } catch (err) {
    console.error('Groq error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.error?.message || err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  const { context, history, message } = req.body;
  try {
    const messages = [
      { role: 'system', content: context },
      ...history,
      { role: 'user', content: message },
    ];
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      { model: 'llama-3.3-70b-versatile', messages, max_tokens: 512 },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    res.json({ result: response.data.choices[0].message.content });
  } catch (err) {
    console.error('Chat error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Chat failed' });
  }
});

app.post('/api/medicine', async (req, res) => {
  const { medicine } = req.body;
  const prompt = `You are an expert pharmacist and medical professional with complete knowledge of all medicines used in India and worldwide, including branded medicines, generic medicines, Ayurvedic medicines, common Indian pharmacy medicines, OTC medicines, and prescription drugs.

The user is asking about: "${medicine}"

Even if this is a brand name, generic name, salt name, Ayurvedic medicine, or common Indian medicine name — you must provide complete information.

Provide detailed information using exactly these section headers:

TYPE:
[Drug class, category, and whether it is OTC or prescription]

USES:
[List all medical conditions and symptoms it treats - be detailed and comprehensive]

DOSAGE:
[Standard dosage for adults, children, elderly. Include timing like before/after food]

SIDE EFFECTS:
[List common side effects and serious/rare side effects separately]

PRECAUTIONS:
[Who should not take it, pregnancy safety, liver/kidney concerns, age restrictions]

INTERACTIONS:
[List medicines and foods it should not be combined with]

STORAGE:
[Temperature, light, humidity instructions]

ALTERNATIVES:
[List Indian brand names, generic alternatives, and similar medicines available in India]

Be thorough, practical, and use simple language that a normal Indian patient can understand.`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert pharmacist with complete knowledge of all medicines available in India and globally.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2048,
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    res.json({ result: response.data.choices[0].message.content });
  } catch (err) {
    console.error('Medicine error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Medicine lookup failed' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
