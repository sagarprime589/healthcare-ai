import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('healthai_user') || 'null');
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useLang();

  const logout = () => {
    localStorage.removeItem('healthai_user');
    navigate('/login');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/diagnosis', label: 'Diagnosis' },
    { to: '/bodymap', label: 'Body Map' },
    { to: '/medicine', label: 'Medicine' },
    { to: '/vitals', label: 'Vitals' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/history', label: 'History' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/" style={{ ...styles.logo, textDecoration: 'none' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚕</span>
            HealthAI
          </span>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop" style={styles.desktopLinks}>
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} style={{ ...styles.link, ...(isActive(to) ? styles.activeLink : {}) }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop user area */}
        <div className="nav-desktop" style={{ ...styles.desktopLinks, gap: '10px' }}>
          <button onClick={toggleLang} style={langBtn} title="Switch language / भाषा बदलें">
            {lang === 'en' ? 'हि' : 'EN'}
          </button>
          {user ? (
            <>
              {user.isGuest ? (
                <span style={{ fontSize: '13px', opacity: 0.75, color: '#fff' }}>👤 Guest</span>
              ) : (
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                  <div style={avatarStyle}>{user.name?.[0]?.toUpperCase()}</div>
                  <span style={{ fontSize: '13px', color: '#fff', opacity: 0.9 }}>{user.name.split(' ')[0]}</span>
                </Link>
              )}
              <button onClick={logout} style={logoutBtn}>{user.isGuest ? 'Sign In' : 'Logout'}</button>
            </>
          ) : (
            <Link to="/login" style={loginBtn}>Login</Link>
          )}
        </div>

        {/* Hamburger button (mobile only) */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} style={hamburgerBtn} aria-label="Menu">
          <span style={bar(menuOpen, 0)} />
          <span style={bar(menuOpen, 1)} />
          <span style={bar(menuOpen, 2)} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={overlay} />
          <div style={drawer}>
            {/* User info */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #e5e7eb' }}>
              {user ? (
                user.isGuest ? (
                  <div style={{ fontSize: '14px', color: '#888' }}>👤 Signed in as Guest</div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ ...avatarStyle, width: '40px', height: '40px', fontSize: '16px', background: '#0f6e56' }}>
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#111' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{user.email}</div>
                    </div>
                  </div>
                )
              ) : null}
            </div>

            {/* Nav links */}
            <div style={{ padding: '12px 0' }}>
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{
                  display: 'block', padding: '12px 20px', fontSize: '15px', fontWeight: '500',
                  color: isActive(to) ? '#0f6e56' : '#333', textDecoration: 'none',
                  background: isActive(to) ? '#e1f5ee' : 'transparent',
                  borderLeft: isActive(to) ? '3px solid #0f6e56' : '3px solid transparent',
                }}>
                  {label}
                </Link>
              ))}
              {user && !user.isGuest && (
                <Link to="/profile" onClick={() => setMenuOpen(false)} style={{
                  display: 'block', padding: '12px 20px', fontSize: '15px', fontWeight: '500',
                  color: isActive('/profile') ? '#0f6e56' : '#333', textDecoration: 'none',
                  background: isActive('/profile') ? '#e1f5ee' : 'transparent',
                  borderLeft: isActive('/profile') ? '3px solid #0f6e56' : '3px solid transparent',
                }}>
                  Profile
                </Link>
              )}
            </div>

            {/* Language toggle */}
            <div style={{ padding: '8px 20px', borderTop: '1px solid #e5e7eb' }}>
              <button onClick={toggleLang} style={{ width: '100%', padding: '10px', background: '#f5f7fa', color: '#0f6e56', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                {lang === 'en' ? '🌐 हिंदी में बदलें' : '🌐 Switch to English'}
              </button>
            </div>

            {/* Auth button */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb' }}>
              {user ? (
                <button onClick={logout} style={{ width: '100%', padding: '12px', background: '#fff0f0', color: '#cc0000', border: '1px solid #ffcccc', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  {user.isGuest ? 'Sign In with Account' : 'Logout'}
                </button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#0f6e56', color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 24px', height: '56px',
    background: '#0f6e56', color: '#fff',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  logo: { fontSize: '18px', fontWeight: '700', color: '#fff' },
  desktopLinks: { display: 'flex', gap: '20px', alignItems: 'center', className: 'nav-desktop' },
  link: { color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', fontWeight: '400', padding: '4px 0' },
  activeLink: { color: '#fff', fontWeight: '600', borderBottom: '2px solid rgba(255,255,255,0.7)' },
};

const avatarStyle = {
  width: '30px', height: '30px', borderRadius: '50%',
  background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '13px', fontWeight: '700', color: '#fff',
};

const langBtn = {
  padding: '5px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff',
  border: '1px solid rgba(255,255,255,0.35)', borderRadius: '8px',
  fontSize: '13px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px',
};

const loginBtn = {
  padding: '7px 18px', background: '#fff', color: '#0f6e56',
  borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600',
};

const logoutBtn = {
  padding: '7px 16px', background: 'rgba(255,255,255,0.15)', color: '#fff',
  border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px',
  fontSize: '13px', fontWeight: '500', cursor: 'pointer',
};

const hamburgerBtn = {
  display: 'none', flexDirection: 'column', gap: '5px',
  background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
  className: 'nav-hamburger',
};

const bar = (open, i) => ({
  display: 'block', width: '22px', height: '2px', background: '#fff', borderRadius: '2px',
  transition: 'all 0.25s',
  transform: open && i === 0 ? 'translateY(7px) rotate(45deg)' : open && i === 2 ? 'translateY(-7px) rotate(-45deg)' : open && i === 1 ? 'scaleX(0)' : 'none',
});

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200,
};

const drawer = {
  position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px',
  background: '#fff', zIndex: 201, boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
  overflowY: 'auto',
};

export default Navbar;
