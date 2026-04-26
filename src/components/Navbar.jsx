import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('healthai_user') || 'null');

  const logout = () => {
    localStorage.removeItem('healthai_user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={{ ...styles.logo, textDecoration: 'none' }}>HealthAI</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/diagnosis" style={styles.link}>Diagnosis</Link>
        <Link to="/bodymap" style={styles.link}>Body Map</Link>
        <Link to="/medicine" style={styles.link}>Medicine</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/history" style={styles.link}>History</Link>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user.isGuest ? (
              <span style={{ fontSize: '13px', opacity: 0.75 }}>👤 Guest</span>
            ) : (
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', color: '#fff', opacity: 0.9 }}>{user.name.split(' ')[0]}</span>
              </Link>
            )}
            <button onClick={logout} style={logoutBtn}>
              {user.isGuest ? 'Sign In' : 'Logout'}
            </button>
          </div>
        ) : (
          <Link to="/login" style={loginBtn}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 32px',
    background: '#0f6e56',
    color: '#fff',
  },
  logo: { fontSize: '20px', fontWeight: '600', color: '#fff' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '14px' },
};

const loginBtn = {
  padding: '7px 18px',
  background: '#fff',
  color: '#0f6e56',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: '600',
};

const logoutBtn = {
  padding: '7px 18px',
  background: 'rgba(255,255,255,0.15)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};

export default Navbar;