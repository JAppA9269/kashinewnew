import React, { useState } from 'react';
import { FiHeart, FiShoppingCart, FiBell, FiSearch, FiChevronDown } from 'react-icons/fi';

const AuthNavbar = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);

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
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#f97316',
      textDecoration: 'none',
      marginLeft:"40px"
    },
    centerSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flex: 1,
      marginLeft: '2rem',
      marginRight: '2rem',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: '999px',
      padding: '0.4rem 1rem',
      flex: 1,
      maxWidth: '500px',
      marginLeft: '10rem',
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      marginLeft: '0.5rem',
      flex: 1,
      fontSize: '1rem',
    },
    sellButton: {
      backgroundColor: '#f97316',
      color: '#fff',
      padding: '0.5rem 1.2rem',
      borderRadius: '999px',
      fontSize: '1rem',
      fontWeight: '600',
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginLeft: '160px',
    },
    iconBtn: {
      fontSize: '1.3rem',
      color: '#f97316',
      cursor: 'pointer',
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
    },
    avatarContainer: {
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #f97316',
    },
    dropdown: {
      position: 'absolute',
      top: '110%',
      right: 0,
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '0.5rem',
      width: '160px',
      textAlign: 'left',
      zIndex: 100,
    },
    dropdownItem: {
      padding: '0.5rem',
      fontSize: '0.95rem',
      color: '#444',
      textDecoration: 'none',
      display: 'block',
    },
    logout: {
      color: '#e11d48',
    },
  };

  const photoUrl =
    user?.user_metadata?.avatar_url ||
    `https://api.dicebear.com/6.x/thumbs/svg?seed=${user?.email}`;

  return (
    <div style={styles.navbar}>
      {/* Logo */}
      <a href="/" style={styles.logo}>Kashi</a>

      {/* Center Section */}
      <div style={styles.centerSection}>
        {/* Search Bar */}
        <div style={styles.searchBar}>
          <FiSearch />
          <input type="text" placeholder="Search for products..." style={styles.searchInput} />
        </div>

        {/* Sell Button */}
        <a href="/sell" style={styles.sellButton}>
          Sell an Item
        </a>
      </div>

      {/* Right Icons + Avatar */}
      <div style={styles.rightSection}>
        <FiHeart style={styles.iconBtn} title="Wishlist" />
        <FiShoppingCart style={styles.iconBtn} title="Cart" />
        <FiBell style={styles.iconBtn} title="Notifications" />

        {/* Avatar with dropdown */}
        <div
          style={styles.avatarContainer}
          onClick={() => setOpen(!open)}
          onBlur={() => setOpen(false)}
          tabIndex={0}
        >
          <img src={photoUrl} alt="avatar" style={styles.avatar} />
          <FiChevronDown style={{ color: '#f97316' }} />
          {open && (
            <div style={styles.dropdown}>
              <a href="/profile" style={styles.dropdownItem}>👤 Profile</a>
              <a href="/settings" style={styles.dropdownItem}>⚙️ Settings</a>
              <div
                onClick={onLogout}
                style={{ ...styles.dropdownItem, ...styles.logout, cursor: 'pointer' }}
              >
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthNavbar;
