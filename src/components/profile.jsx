import React, { useEffect, useState } from 'react';
import { supabase } from '../components/auth/supabaseClient';
import { useUser } from '../UserContext';
import EditProfileModal from './editprofile';

const Profile = () => {
  const { user } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [products, setProducts] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [activeTab, setActiveTab] = useState('forSale');
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) console.error(error);
    else setProfileData(data);
  };

  useEffect(() => {
    if (!user) return;

    fetchProfile();

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner', user.id);

      if (error) console.error(error);
      else setProducts(data || []);
    };

    const fetchFollowerCount = async () => {
      const { data, error } = await supabase
        .from('follower_counts')
        .select('follower_count')
        .eq('following_username', user.user_metadata.username)
        .single();

      if (error) {
        console.warn('No followers yet');
        setFollowerCount(0);
      } else {
        setFollowerCount(data.follower_count || 0);
      }
    };

    fetchProducts();
    fetchFollowerCount();
  }, [user]);

  const forSale = products.filter((p) => !p.sold);
  const sold = products.filter((p) => p.sold);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      {profileData ? (
        <>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={profileData.photo || `https://api.dicebear.com/6.x/pixel-art/svg?seed=${user.email}`}
                alt="avatar"
                width="80"
                height="80"
                style={{ borderRadius: '50%', border: '2px solid #f97316' }}
              />
              <div>
                <h2 style={{ margin: 0 }}>{profileData.username}</h2>
                <p style={{ color: '#666' }}>{profileData.bio || 'No bio yet'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: '#f97316',
                color: '#fff',
                borderRadius: '999px',
                padding: '0.4rem 1rem',
                fontSize: '0.9rem',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                height: '38px'
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: '#fff7ed',
            padding: '1rem',
            borderRadius: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div><strong>{products.length}</strong> Listings</div>
            <div><strong>{sold.length}</strong> Sold</div>
            <div><strong>{followerCount}</strong> Followers</div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveTab('forSale')}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'forSale' ? '#f97316' : '#eee',
                color: activeTab === 'forSale' ? '#fff' : '#444',
              }}
            >
              For Sale
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'sold' ? '#f97316' : '#eee',
                color: activeTab === 'sold' ? '#fff' : '#444',
              }}
            >
              Sold
            </button>
          </div>

          {/* Product Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '1rem',
          }}>
            {(activeTab === 'forSale' ? forSale : sold).map((product) => (
              <div key={product.id} style={{
                border: '1px solid #eee',
                borderRadius: '1rem',
                overflow: 'hidden',
                textAlign: 'center',
              }}>
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.title}
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                />
                <div style={{ padding: '0.5rem' }}>
                  <h4 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{product.title}</h4>
                  <p style={{ margin: 0, color: '#888' }}>{product.price} DT</p>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Profile Modal */}
          <EditProfileModal
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            userId={user.id}
            currentProfile={profileData}
            onSave={fetchProfile}
          />
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
