import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import zxcvbn from 'zxcvbn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const scoreMap = [
    { label: 'Weak', color: '#f87171', percent: 20 },
    { label: 'Fair', color: '#facc15', percent: 40 },
    { label: 'Good', color: '#fbbf24', percent: 60 },
    { label: 'Strong', color: '#4ade80', percent: 80 },
    { label: 'Very Strong', color: '#22c55e', percent: 100 },
  ];

  const strength = zxcvbn(password);
  const strengthScore = scoreMap[strength.score];

  // const handleSignup = () => {
  //   console.log('Clicked!');
  //   if (password !== confirmPassword) {
  //     setError('Passwords do not match.');
  //    return;
  //   }
  //   setError('');
  //   continue signup logic here
  //   console.log('Sign up with', { email, password });
  // };
  const handleSignup = async () => {
    console.log('Clicked!');
  
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    setError('');
  
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
  
      const user = data?.user;
      if (!user) {
        setError('Signup failed: no user returned.');
        return;
      }
  
      // ✅ Insert user into the `users` table
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: user.id, // Auth UID
          email: user.email,
          username: generateUsername(user.email),
          photo: '', // Optional: default avatar URL or leave blank
          bio: '',   // Optional default bio
        },
      ]);
  
      if (insertError) {
        setError('Account created but user profile failed to save.');
        console.error(insertError.message);
        return;
      }
  
      console.log('User created and added to users table!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      alert('Signup successful! Please check your email to confirm.');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something went wrong. Please try again.');
    }
  };
  
  // Optional helper to auto-generate a username
  const generateUsername = (email) => {
    return email.split('@')[0] + Math.floor(Math.random() * 10000);
  };
  
  
  

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
    inputContainer: {
      position: 'relative',
      width: '100%',
      margin: '0.75rem 0',
    },
    input: {
      width: '100%',
      padding: '0.9rem 1.25rem',
      paddingRight: '3rem',
      borderRadius: '999px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      outline: 'none',
      lineHeight: '1.5',
      boxSizing: 'border-box',
    },
    eyeButton: {
      position: 'absolute',
      top: '50%',
      right: '1rem',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.1rem',
      color: '#888',
    },
    strengthMeter: {
      textAlign: 'left',
      marginTop: '0.25rem',
      marginBottom: '0.5rem',
    },
    strengthBarContainer: {
      height: '6px',
      width: '100%',
      backgroundColor: '#eee',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    strengthBar: {
      height: '100%',
      transition: 'width 0.3s ease',
    },
    strengthLabel: {
      fontSize: '0.85rem',
      marginTop: '0.3rem',
    },
    suggestionText: {
      fontSize: '0.8rem',
      color: '#999',
      marginTop: '0.25rem',
    },
    error: {
      color: '#dc2626',
      fontSize: '0.9rem',
      marginTop: '0.5rem',
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

        <div style={styles.inputContainer}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            aria-label="Toggle password visibility"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {password && (
          <div style={styles.strengthMeter}>
            <div style={styles.strengthBarContainer}>
              <div
                style={{
                  ...styles.strengthBar,
                  width: `${strengthScore.percent}%`,
                  backgroundColor: strengthScore.color,
                }}
              />
            </div>
            <span style={{ ...styles.strengthLabel, color: strengthScore.color }}>
              {strengthScore.label}
            </span>
            {strength.feedback.suggestions.length > 0 && (
              <div style={styles.suggestionText}>
                {strength.feedback.suggestions.join(' ')}
              </div>
            )}
          </div>
        )}

        <div style={styles.inputContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={styles.button}
          onClick={handleSignup}
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
