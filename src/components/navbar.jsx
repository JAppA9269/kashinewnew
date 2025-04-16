import React from 'react';
import { useUser } from '../UserContext.jsx'; // make sure path is correct
import { supabase } from '../components/auth/supabaseClient'; // adjust if needed

const Navbar = () => {
  const { user } = useUser();

  const styles = {
    navbar: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #f0f0f0',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#f97316',
      textDecoration: 'none',
    },
    links: {
      display: 'flex',
      gap: '1.5rem',
      fontSize: '0.95rem',
      fontWeight: 500,
    },
    link: {
      color: '#555',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      fontSize: 'x-large',
      padding: '0.5rem 1.25rem',
      borderRadius: '20px',
      transform: 'scale(1)',
    },
    button: {
      border: '1px solid #f97316',
      color: '#f97316',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: 'large',
      transition: 'all 0.3s ease',
      transform: 'scale(1)',
      backgroundColor: 'transparent',
    },
    email: {
      marginRight: '1rem',
      fontSize: '0.9rem',
      color: '#333',
      fontWeight: '500',
    },
  };

  const handleLinkHover = (e) => {
    e.currentTarget.style.backgroundColor = '#ffedd5';
    e.currentTarget.style.color = '#000000';
    e.currentTarget.style.transform = 'scale(1.05)';
  };

  const handleLinkLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = '#555';
    e.currentTarget.style.transform = 'scale(1)';
  };

  const handleButtonHover = (e) => {
    e.currentTarget.style.backgroundColor = '#fff5ed';
    e.currentTarget.style.transform = 'scale(1.05)';
  };

  const handleButtonLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.transform = 'scale(1)';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={styles.navbar}>
      <a href="/" style={styles.logo}>Kashi</a>
      <div style={styles.links}>
        {['Home', 'Contact Us', 'About Us', 'Features'].map((text, index) => (
          <a
            key={index}
            href={text === 'Accueil' ? '/' : `#${text.toLowerCase()}`}
            style={styles.link}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            {text}
          </a>
        ))}
      </div>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={styles.email}>{user.email}</span>
          <button
            style={styles.button}
            onClick={handleLogout}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Logout
          </button>
        </div>
      ) : (
        <a
          href="/login"
          style={styles.button}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          Connexion
        </a>
      )}
    </div>
  );
};

export default Navbar;
