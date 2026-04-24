import { Link, useNavigate } from 'react-router-dom';

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', opacity: 0.85 }}>Hi, {user.name.split(' ')[0]}</span>
            <button onClick={logout} style={logoutBtn}>Logout</button>
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