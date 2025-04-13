import React, { useState } from 'react';

const Signup = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      backgroundColor: '#fefcf9',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '2rem 1rem',
    },
    card: {
      backgroundColor: '#fff',
      padding: '3rem 2rem',
      borderRadius: '1.5rem',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
      marginTop: '2rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#f97316',
      marginBottom: '2rem',
    },
    input: {
      width: '100%',
      padding: '0.9rem 1rem',
      margin: '0.75rem 0',
      borderRadius: '999px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      outline: 'none',
    },
    button: {
      width: '100%',
      maxWidth: '250px',
      padding: '0.9rem 1.5rem',
      margin: '1rem auto 0.75rem',
      borderRadius: '999px',
      backgroundColor: '#f97316',
      color: '#fff',
      fontSize: '1.1rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.3s',
    },
    facebookButton: {
      width: '100%',
      maxWidth: '250px',
      padding: '0.8rem 1.2rem',
      borderRadius: '999px',
      backgroundColor: '#1877f2',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      margin: '0 auto',
    },
    fbIcon: {
      width: '18px',
      height: '18px',
      fill: 'white',
    },
    helper: {
      marginTop: '1.5rem',
      fontSize: '0.9rem',
      textAlign: 'center',
      color: '#666',
    },
    link: {
      color: '#f97316',
      textDecoration: 'none',
      fontWeight: '500',
      marginLeft: '0.25rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign Up</h2>

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />

        <button
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
        >
          Sign Up
        </button>

        <button style={styles.facebookButton}>
          <svg style={styles.fbIcon} viewBox="0 0 24 24">
            <path d="M22.675 0h-21.35C.596 0 0 .6 0 1.338v21.323C0 23.4.596 24 1.325 24h11.494v-9.294H9.847v-3.622h2.972V8.413c0-2.933 1.792-4.532 4.41-4.532 1.254 0 2.33.093 2.644.134v3.065l-1.814.001c-1.422 0-1.698.676-1.698 1.67v2.188h3.396l-.443 3.622h-2.953V24h5.787c.729 0 1.324-.6 1.324-1.338V1.338C24 .6 23.404 0 22.675 0z" />
          </svg>
          Continue with Facebook
        </button>

        <div style={styles.helper}>
          Already have an account?
          <a href="/login" style={styles.link}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
