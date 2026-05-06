const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiting
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many attempts. Please try again in 15 minutes.' } });
const aiLimiter   = rateLimit({ windowMs: 60 * 1000, max: 10, message: { error: 'Too many AI requests. Please wait a minute.' } });
const otpLimiter  = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { error: 'Too many OTP requests. Please try again in an hour.' } });

app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
app.use('/api/forgot-password', otpLimiter);
app.use('/api/diagnose', aiLimiter);
app.use('/api/chat', aiLimiter);
app.use('/api/medicine', aiLimiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { console.log('MongoDB connected'); seedDoctors(); })
  .catch(err => console.error('MongoDB error:', err));

// ── Schemas ──────────────────────────────────────────────

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  location: String,
  fees: Number,
  experience: Number,
  rating: Number,
  availableDays: [String],
  avatar: String,
});
const Doctor = mongoose.model('Doctor', doctorSchema);

const appointmentSchema = new mongoose.Schema({
  userId: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName: String,
  specialty: String,
  location: String,
  fees: Number,
  date: String,
  slot: String,
  patientName: String,
  patientAge: String,
  reason: String,
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
}, { timestamps: true });
const Appointment = mongoose.model('Appointment', appointmentSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profile: {
    height: String,
    weight: String,
    bloodGroup: String,
    existingConditions: String,
    medications: String,
    allergies: String,
  },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// ── Seed doctors ─────────────────────────────────────────

const TIME_SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM','5:30 PM',
];

async function seedDoctors() {
  const count = await Doctor.countDocuments();
  if (count > 0) return;
  await Doctor.insertMany([
    { name: 'Dr. Priya Sharma',   specialty: 'General Physician', location: 'Mumbai',    fees: 300, experience: 12, rating: 4.8, availableDays: ['Mon','Tue','Wed','Thu','Fri'],        avatar: 'PS' },
    { name: 'Dr. Rajesh Kumar',   specialty: 'Cardiologist',      location: 'Delhi',     fees: 800, experience: 18, rating: 4.9, availableDays: ['Mon','Wed','Fri'],                   avatar: 'RK' },
    { name: 'Dr. Anita Desai',    specialty: 'Dermatologist',     location: 'Pune',      fees: 500, experience: 10, rating: 4.7, availableDays: ['Tue','Wed','Thu','Sat'],             avatar: 'AD' },
    { name: 'Dr. Suresh Patel',   specialty: 'Orthopedic',        location: 'Ahmedabad', fees: 600, experience: 15, rating: 4.6, availableDays: ['Mon','Tue','Thu','Fri'],             avatar: 'SP' },
    { name: 'Dr. Meera Nair',     specialty: 'Gynecologist',      location: 'Bangalore', fees: 700, experience: 14, rating: 4.8, availableDays: ['Mon','Wed','Fri','Sat'],             avatar: 'MN' },
    { name: 'Dr. Amit Joshi',     specialty: 'Pediatrician',      location: 'Chennai',   fees: 400, experience:  9, rating: 4.7, availableDays: ['Mon','Tue','Wed','Thu','Fri'],       avatar: 'AJ' },
    { name: 'Dr. Kavitha Reddy',  specialty: 'Neurologist',       location: 'Hyderabad', fees: 900, experience: 20, rating: 4.9, availableDays: ['Tue','Thu','Sat'],                  avatar: 'KR' },
    { name: 'Dr. Vikram Singh',   specialty: 'Psychiatrist',      location: 'Jaipur',    fees: 600, experience: 11, rating: 4.6, availableDays: ['Mon','Wed','Fri'],                   avatar: 'VS' },
    { name: 'Dr. Sunita Gupta',   specialty: 'ENT Specialist',    location: 'Lucknow',   fees: 450, experience: 13, rating: 4.7, availableDays: ['Tue','Wed','Thu','Fri'],             avatar: 'SG' },
    { name: 'Dr. Rahul Mehta',    specialty: 'Ophthalmologist',   location: 'Surat',     fees: 500, experience:  8, rating: 4.5, availableDays: ['Mon','Tue','Thu','Sat'],             avatar: 'RM' },
    { name: 'Dr. Pooja Iyer',     specialty: 'Endocrinologist',   location: 'Kochi',     fees: 700, experience: 16, rating: 4.8, availableDays: ['Mon','Wed','Thu','Fri'],             avatar: 'PI' },
    { name: 'Dr. Arun Verma',     specialty: 'General Physician', location: 'Nagpur',    fees: 250, experience:  7, rating: 4.4, availableDays: ['Mon','Tue','Wed','Thu','Fri','Sat'], avatar: 'AV' },
  ]);
  console.log('Doctors seeded');
}

// OTP store (in-memory is fine — OTPs are short-lived)
const otpStore = {};

// Email transporter — only used when credentials are configured
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 8000,
  greetingTimeout: 5000,
  socketTimeout: 8000,
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

    const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    if (!emailConfigured) {
      // No email credentials — return OTP directly (dev/demo mode)
      console.log(`\n[HealthAI OTP] ${email} → ${otp}\n`);
      return res.json({ message: 'OTP generated', devOtp: otp });
    }

    // Respond immediately — don't block on email delivery
    res.json({ message: 'OTP sent to your email' });

    // Send email in background
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
    }).catch(err => {
      console.error('[Mail error]', err.message);
      console.log(`[HealthAI OTP fallback] ${email} → ${otp}`);
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

// ── Change password ──────────────────────────────────────

app.post('/api/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword) return res.status(400).json({ error: 'All fields required' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isHashed = user.password.startsWith('$2');
    const valid = isHashed ? await bcrypt.compare(currentPassword, user.password) : currentPassword === user.password;
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: userId }, { password: hashed });
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ── Profile routes ───────────────────────────────────────

app.get('/api/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name email profile');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ name: user.name, email: user.email, profile: user.profile || {} });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.post('/api/profile/:userId', async (req, res) => {
  const { height, weight, bloodGroup, existingConditions, medications, allergies } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { profile: { height, weight, bloodGroup, existingConditions, medications, allergies } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Profile saved', profile: user.profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// ── Appointment routes ───────────────────────────────────

app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ rating: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

app.get('/api/doctors/:id/slots', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required' });
  try {
    const booked = await Appointment.find({ doctorId: req.params.id, date, status: { $ne: 'cancelled' } }).select('slot');
    const bookedSlots = booked.map(a => a.slot);
    const available = TIME_SLOTS.filter(s => !bookedSlots.includes(s));
    res.json({ available });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { userId, doctorId, date, slot, patientName, patientAge, reason } = req.body;
  if (!userId || !doctorId || !date || !slot || !patientName)
    return res.status(400).json({ error: 'Missing required fields' });
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    const existing = await Appointment.findOne({ doctorId, date, slot, status: { $ne: 'cancelled' } });
    if (existing) return res.status(409).json({ error: 'This slot is already booked. Please choose another.' });
    const appt = await Appointment.create({
      userId, doctorId, date, slot, patientName, patientAge, reason,
      doctorName: doctor.name, specialty: doctor.specialty, location: doctor.location, fees: doctor.fees,
    });
    res.json({ appointment: appt });
  } catch (err) {
    res.status(500).json({ error: 'Booking failed' });
  }
});

app.get('/api/appointments/:userId', async (req, res) => {
  try {
    const appts = await Appointment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.patch('/api/appointments/:id/cancel', async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment cancelled', appointment: appt });
  } catch (err) {
    res.status(500).json({ error: 'Cancellation failed' });
  }
});

// ── AI routes ────────────────────────────────────────────

app.post('/api/diagnose', async (req, res) => {
  const patientData = req.body;
  const langInstruction = patientData.lang === 'hi'
    ? '\n\nIMPORTANT: Respond entirely in Hindi language using Devanagari script. All section headers, medical terms, explanations, medicine names, and recommendations must be written in Hindi.'
    : '';

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
This is an AI-generated assessment and not a substitute for professional medical advice.${langInstruction}`;

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
  const { context, history, message, lang } = req.body;
  const langInstruction = lang === 'hi'
    ? ' Always respond in Hindi using Devanagari script.'
    : '';
  try {
    const messages = [
      { role: 'system', content: context + langInstruction },
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
  const { medicine, lang } = req.body;
  const langInstruction = lang === 'hi'
    ? '\n\nIMPORTANT: Respond entirely in Hindi using Devanagari script. All section headers, explanations, and medical information must be in Hindi.'
    : '';
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

Be thorough, practical, and use simple language that a normal Indian patient can understand.${langInstruction}`;

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
