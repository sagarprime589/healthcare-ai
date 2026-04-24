const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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
      {
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 512,
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
          { role: 'system', content: 'You are an expert pharmacist with complete knowledge of all medicines available in India and globally. You know all brand names, generic names, salt compositions, Ayurvedic medicines, and OTC drugs. Always provide complete, accurate, and helpful medicine information.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2048,
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
    console.error('Medicine error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Medicine lookup failed' });
  }
});
const users = [];

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'Email already registered' });
  const user = { id: Date.now(), name, email, password };
  users.push(user);
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

app.listen(5000, () => console.log('Server running on port 5000'));