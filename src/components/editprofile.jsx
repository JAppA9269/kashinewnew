import React, { useState, useEffect } from 'react';
import { supabase } from '../components/auth/supabaseClient';

const EditProfileModal = ({ isOpen, onClose, userId, currentProfile, onSave }) => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (currentProfile) {
      setUsername(currentProfile.username || '');
      setBio(currentProfile.bio || '');
      setPreviewUrl(currentProfile.photo || `https://api.dicebear.com/6.x/thumbs/svg?seed=${currentProfile.email}`);
    }
  }, [currentProfile]);

  const handleAvatarUpload = async () => {
    if (!avatarFile) return null;

    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `avatars/${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) {
      console.error('Avatar upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    let photo = currentProfile?.photo || '';

    if (avatarFile) {
      const uploadedUrl = await handleAvatarUpload();
      if (uploadedUrl) photo = uploadedUrl;
    }

    const { error } = await supabase
      .from('users')
      .update({ username, bio, photo })
      .eq('id', userId);

    if (error) {
      console.error('Update error:', error);
      return;
    }

    onSave(); // Refresh profile page
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2 style={{ textAlign: 'center' }}>Edit Profile</h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <img
            src={previewUrl}
            alt="Avatar Preview"
            style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #f97316' }}
          />
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={styles.textarea}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '1rem' }}
        />

        <div style={styles.actions}>
          <button onClick={handleSubmit} style={styles.saveBtn}>Save</button>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '1rem',
    maxWidth: '400px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
  },
  saveBtn: {
    backgroundColor: '#f97316',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#eee',
    padding: '0.5rem 1rem',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default EditProfileModal;
