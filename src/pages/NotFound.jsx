import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '80px', marginBottom: '8px' }}>🏥</div>
        <div style={{ fontSize: '72px', fontWeight: '800', color: '#0f6e56', lineHeight: 1, marginBottom: '16px' }}>404</div>
        <h1 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: '700', color: '#111' }}>Page Not Found</h1>
        <p style={{ margin: '0 0 32px', color: '#888', fontSize: '15px', lineHeight: '1.6' }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ padding: '11px 24px', background: '#fff', color: '#0f6e56', border: '1.5px solid #0f6e56', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '11px 24px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
