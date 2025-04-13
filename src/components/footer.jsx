import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const styles = {
    container: {
      marginTop: '4rem',
      padding: '3rem 1.5rem',
      backgroundColor: '#fff5ed',
      color: '#444',
      fontFamily: "'Segoe UI', sans-serif",
    },
    inner: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: '2rem',
    },
    section: {
      flex: '1 1 200px',
      minWidth: '200px',
    },
    brand: {
      color: '#f97316',
      fontWeight: '800',
      fontSize: '1.8rem',
      marginBottom: '0.5rem',
    },
    tagline: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '1rem',
    },
    link: {
      display: 'block',
      color: '#444',
      textDecoration: 'none',
      marginBottom: '0.5rem',
      fontSize: '0.95rem',
    },
    socialIcons: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '0.5rem',
    },
    icon: {
      width: '24px',
      height: '24px',
    },
    qr: {
      width: '100px',
      height: '100px',
      backgroundColor: '#fff',
      borderRadius: '0.5rem',
      boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    },
    bottom: {
      textAlign: 'center',
      fontSize: '0.85rem',
      color: '#999',
      marginTop: '3rem',
      borderTop: '1px solid #f3e8df',
      paddingTop: '1rem',
    },
  };

  return (
    <footer style={styles.container}>
      <div style={styles.inner}>
        {/* Branding */}
        <div style={styles.section}>
          <div style={styles.brand}>Kashi</div>
          <div style={styles.tagline}>Sustainable fashion for every style.</div>
          <div style={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg fill="#00000" style={styles.icon} viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.596 0 0 .6 0 1.338v21.323C0 23.4.596 24 1.325 24h11.494v-9.294H9.847v-3.622h2.972V8.413c0-2.933 1.792-4.532 4.41-4.532 1.254 0 2.33.093 2.644.134v3.065l-1.814.001c-1.422 0-1.698.676-1.698 1.67v2.188h3.396l-.443 3.622h-2.953V24h5.787c.729 0 1.324-.6 1.324-1.338V1.338C24 .6 23.404 0 22.675 0z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg fill="#00000" style={styles.icon} viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm8.75 2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg fill="#00000" style={styles.icon} viewBox="0 0 24 24">
                <path d="M9.5 3c.82 0 1.5.68 1.5 1.5V16a3.5 3.5 0 1 1-3.5-3.5H8A1.5 1.5 0 1 0 6.5 14c0 .83.67 1.5 1.5 1.5S9.5 14.83 9.5 14V3zM14 3h2a3 3 0 0 0 3 3v2a5 5 0 0 1-5-5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.section}>
          <h4 style={{ color: '#ea580c', fontSize: '1.1rem', marginBottom: '1rem' }}>Quick Links</h4>
          <Link to="/home" style={styles.link}>Marketplace</Link>
          <Link to="/about" style={styles.link}>About Us</Link>
          <Link to="/faq" style={styles.link}>FAQ</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>
        </div>

        {/* Contact Info */}
        <div style={styles.section}>
          <h4 style={{ color: '#ea580c', fontSize: '1.1rem', marginBottom: '1rem' }}>Contact</h4>
          <p>📍 Avenue Habib Bourguiba, Tunis</p>
          <p>📞 +216 12 345 678</p>
          <p>📧 support@kashi.tn</p>
        </div>

        {/* QR Code */}
        <div style={styles.section}>
          <h4 style={{ color: '#ea580c', fontSize: '1.1rem', marginBottom: '1rem' }}>Download App</h4>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://kashi.tn"
            alt="QR Code"
            style={styles.qr}
          />
        </div>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} Kashi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
