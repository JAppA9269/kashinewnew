import React, { useState, useRef, useEffect } from 'react';
import { FiHeart, FiShoppingCart, FiBell, FiSearch, FiChevronDown } from 'react-icons/fi';
import { useUser } from '../UserContext.jsx';
import { supabase } from '../components/auth/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const AuthNavbar = () => {
  const [open, setOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Fetch user profile photo from Supabase users table
  useEffect(() => {
    const fetchPhoto = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('users')
        .select('photo')
        .eq('id', user.id)
        .single();

      if (!error && data?.photo) {
        setProfilePhoto(data.photo);
      } else {
        setProfilePhoto(`https://api.dicebear.com/6.x/thumbs/svg?seed=${user.email}`);
      }
    };

    fetchPhoto();
  }, [user]);

  // 🔐 close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      marginLeft: '40px',
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

  return (
    <div style={styles.navbar}>
      <Link to="/" style={styles.logo}>Kashi</Link>

      <div style={styles.centerSection}>
        <div style={styles.searchBar}>
          <FiSearch />
          <input type="text" placeholder="Search for products..." style={styles.searchInput} />
        </div>

        <Link to="/sell" style={styles.sellButton}>
          Sell an Item
        </Link>
      </div>

      <div style={styles.rightSection}>
        <FiHeart style={styles.iconBtn} title="Wishlist" />
        <FiShoppingCart style={styles.iconBtn} title="Cart" />
        <FiBell style={styles.iconBtn} title="Notifications" />

        <div
          style={styles.avatarContainer}
          onClick={() => setOpen(!open)}
          ref={dropdownRef}
        >
          <img src={profilePhoto} alt="avatar" style={styles.avatar} />
          <FiChevronDown style={{ color: '#f97316' }} />
          {open && (
            <div style={styles.dropdown}>
              <Link to="/profile" style={styles.dropdownItem}>👤 Profile</Link>
              <Link to="/settings" style={styles.dropdownItem}>⚙️ Settings</Link>
              <div
                onClick={handleLogout}
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
