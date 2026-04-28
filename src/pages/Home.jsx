import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const tx = {
  en: {
    badge: 'AI Powered Healthcare Assistant',
    headline: 'Your Personal AI Doctor',
    sub: 'Get instant AI-powered health assessments, medicine recommendations, and disease insights — all in seconds.',
    cta: 'Get AI Assessment →',
    dash: 'View Dashboard',
    statLabels: ['Diagnosis Accuracy', 'Average Response Time', 'Conditions Covered', 'Always Available'],
    featTitle: 'Everything you need',
    featSub: 'Powerful features to help you understand your health better',
    features: [
      { icon: '🩺', title: 'AI Diagnosis', desc: 'Get instant analysis of your symptoms with possible conditions and likelihood percentages.' },
      { icon: '💊', title: 'Medicine Info', desc: 'Receive safe medicine recommendations with dosage and purpose for your condition.' },
      { icon: '🧪', title: 'Lab Tests', desc: 'Know exactly which tests to get done based on your symptoms and medical history.' },
      { icon: '🌿', title: 'Home Remedies', desc: 'Natural remedies and lifestyle tips alongside medical recommendations.' },
      { icon: '⚠️', title: 'Urgency Alerts', desc: 'Color coded urgency levels tell you when to seek immediate medical attention.' },
      { icon: '📋', title: 'Health Reports', desc: 'Detailed structured reports you can share with your doctor during consultation.' },
      { icon: '📅', title: 'Book Appointments', desc: 'Browse verified doctors by specialty and book a consultation slot instantly.' },
    ],
    ctaTitle: 'Ready to check your health?',
    ctaSub: 'Fill in your symptoms and get an AI assessment in seconds.',
    ctaBtn: 'Start Free Assessment →',
    disclaimer: 'Not a substitute for professional medical advice. Always consult a doctor.',
  },
  hi: {
    badge: 'AI स्वास्थ्य सहायक',
    headline: 'आपका निजी AI डॉक्टर',
    sub: 'तुरंत AI-आधारित स्वास्थ्य मूल्यांकन, दवा की जानकारी और बीमारी की जानकारी पाएं — सेकंडों में।',
    cta: 'AI मूल्यांकन शुरू करें →',
    dash: 'डैशबोर्ड देखें',
    statLabels: ['निदान सटीकता', 'औसत प्रतिक्रिया समय', 'बीमारियां कवर', 'हमेशा उपलब्ध'],
    featTitle: 'सभी जरूरी सुविधाएं',
    featSub: 'आपके स्वास्थ्य को बेहतर समझने के लिए शक्तिशाली सुविधाएं',
    features: [
      { icon: '🩺', title: 'AI निदान', desc: 'अपने लक्षणों का तुरंत विश्लेषण करें और संभावित बीमारियां जानें।' },
      { icon: '💊', title: 'दवा की जानकारी', desc: 'खुराक और उद्देश्य सहित सुरक्षित दवाओं की जानकारी पाएं।' },
      { icon: '🧪', title: 'लैब टेस्ट', desc: 'अपने लक्षणों के आधार पर जानें कि कौन से परीक्षण करवाने हैं।' },
      { icon: '🌿', title: 'घरेलू उपाय', desc: 'चिकित्सा सुझावों के साथ-साथ प्राकृतिक उपाय और जीवनशैली सुझाव।' },
      { icon: '⚠️', title: 'आपातकाल अलर्ट', desc: 'रंग-कोडित गंभीरता स्तर बताते हैं कि कब तुरंत डॉक्टर से मिलना है।' },
      { icon: '📋', title: 'स्वास्थ्य रिपोर्ट', desc: 'विस्तृत रिपोर्ट जो आप अपने डॉक्टर के साथ साझा कर सकते हैं।' },
      { icon: '📅', title: 'अपॉइंटमेंट बुक करें', desc: 'विशेषज्ञता के आधार पर सत्यापित डॉक्टर खोजें और तुरंत अपॉइंटमेंट बुक करें।' },
    ],
    ctaTitle: 'अपना स्वास्थ्य जांचें?',
    ctaSub: 'लक्षण भरें और सेकंडों में AI मूल्यांकन पाएं।',
    ctaBtn: 'निशुल्क मूल्यांकन शुरू करें →',
    disclaimer: 'यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। हमेशा डॉक्टर से परामर्श करें।',
  },
};

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = tx[lang];

  return (
    <div style={{ fontFamily: 'inherit' }}>

      <div style={{ background: '#0f6e56', color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', marginBottom: '20px' }}>
            {t.badge}
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '700', margin: '0 0 16px', lineHeight: '1.2' }}>
            {t.headline}
          </h1>
          <p style={{ fontSize: '17px', opacity: '0.85', margin: '0 0 32px', lineHeight: '1.6' }}>
            {t.sub}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/diagnosis')} style={primaryBtn}>
              {t.cta}
            </button>
            <button onClick={() => navigate('/dashboard')} style={secondaryBtn}>
              {t.dash}
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: '#f9fafb', padding: '16px 20px', borderBottom: '0.5px solid #e5e7eb' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { value: '95%', label: t.statLabels[0] },
            { value: '10s', label: t.statLabels[1] },
            { value: '500+', label: t.statLabels[2] },
            { value: '24/7', label: t.statLabels[3] },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#0f6e56' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>
          {t.featTitle}
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '15px' }}>
          {t.featSub}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {t.features.map((f, i) => (
            <div key={i} style={featureCard}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#0f6e56', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '12px' }}>
          {t.ctaTitle}
        </h2>
        <p style={{ opacity: '0.85', marginBottom: '28px', fontSize: '15px' }}>
          {t.ctaSub}
        </p>
        <button onClick={() => navigate('/diagnosis')} style={primaryBtn}>
          {t.ctaBtn}
        </button>
        <p style={{ marginTop: '20px', fontSize: '12px', opacity: '0.6' }}>
          {t.disclaimer}
        </p>
      </div>

    </div>
  );
}

const primaryBtn = {
  padding: '12px 28px',
  background: '#fff',
  color: '#0f6e56',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
};

const secondaryBtn = {
  padding: '12px 28px',
  background: 'transparent',
  color: '#fff',
  border: '1.5px solid rgba(255,255,255,0.5)',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '500',
  cursor: 'pointer',
};

const featureCard = {
  background: '#fff',
  border: '0.5px solid #e5e7eb',
  borderRadius: '12px',
  padding: '20px',
};