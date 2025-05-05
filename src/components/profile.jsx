import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../components/auth/supabaseClient';
import { useUser } from '../UserContext';
import EditProfileModal from './editprofile';
// --- Import Icons for Stats Bar ---
import { List, BadgeCheck, Users, UserCheck } from 'lucide-react';

const Profile = () => {
  const { user } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [products, setProducts] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState('forSale'); // Default to 'forSale'
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingFollows, setLoadingFollows] = useState(true);

  // Combined loading state
  const isLoading = loadingProfile || loadingProducts || loadingFollows;

  // Fetch User Profile Data
  const fetchProfile = async () => {
    if (!user?.id) return;
    setLoadingProfile(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) console.error("Error fetching profile:", error);
    setProfileData(error ? null : data);
    setLoadingProfile(false);
  };

  // Fetch User's Products
  const fetchProducts = async () => {
    if (!user?.id) return;
    setLoadingProducts(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, title, price, images, sold')
      .eq('owner', user.id)
      .order('created_at', { ascending: false });
    if (error) console.error("Error fetching products:", error);
    setProducts(error ? [] : data || []);
    setLoadingProducts(false);
  };

  // Fetch Followers List
  const fetchFollowers = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
          .from('followers')
          .select(`follower_id, users:follower_id!inner( username, photo )`)
          .eq('following_id', user.id);
      if (error) { console.error("Error fetching followers:", error); setFollowersList([]); }
      else { setFollowersList(data.map(f => f.users).filter(Boolean)); }
  };

  // Fetch Following List
  const fetchFollowing = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
          .from('followers')
          .select(`following_id, users:following_id!inner( username, photo )`)
          .eq('follower_id', user.id);
      if (error) { console.error("Error fetching following:", error); setFollowingList([]); }
      else { setFollowingList(data.map(f => f.users).filter(Boolean)); }
  };

  // Fetch Follower Count
  const fetchFollowerCount = async () => {
      if (!user?.id) return;
      const { count, error } = await supabase
       .from('followers')
       .select('*', { count: 'exact', head: true })
       .eq('following_id', user.id);
      if (error) { console.warn('Error fetching follower count:', error.message); setFollowerCount(0); }
      else { setFollowerCount(count || 0); }
   };

    // Fetch Following Count
   const fetchFollowingCount = async () => {
        if (!user?.id) return;
        const { count, error } = await supabase
         .from('followers')
         .select('*', { count: 'exact', head: true })
         .eq('follower_id', user.id);
        if (error) { console.warn('Error fetching following count:', error.message); setFollowingCount(0); }
        else { setFollowingCount(count || 0); }
     };

  // Initial data fetching useEffect
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchProducts();
      setLoadingFollows(true);
      Promise.all([
          fetchFollowers(),
          fetchFollowing(),
          fetchFollowerCount(),
          fetchFollowingCount()
      ]).finally(() => setLoadingFollows(false));
    } else {
        setProfileData(null); setProducts([]); setFollowersList([]); setFollowingList([]);
        setFollowerCount(0); setFollowingCount(0); setLoadingProfile(false);
        setLoadingProducts(false); setLoadingFollows(false); setActiveTab('forSale');
    }
  }, [user]);

  // Derived states for products
  const forSale = products.filter((p) => !p.sold);
  const sold = products.filter((p) => p.sold);

   if (isLoading) {
     return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
   }
  if (!profileData) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Could not load profile data.</div>;
  }

  // Helper Component for User List Item
  const UserListItem = ({ person }) => (
     <li style={styles.userListItem}>
        <Link to={`/profile/${person.username}`} style={styles.userListItemLink}>
           <img
               src={person.photo || `/placeholder-avatar.png`}
               alt={person.username}
               style={styles.userListAvatar}
               onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-avatar.png'; }}
           />
           <span style={styles.userListUsername}>@{person.username}</span>
        </Link>
     </li>
  );

  // Dynamic Heading Content
  const getActiveContentTitle = () => {
    switch (activeTab) {
        case 'forSale': return 'Items For Sale';
        case 'sold': return 'Sold Items';
        case 'followers': return 'Followers';
        case 'following': return 'Following';
        default: return 'Profile';
    }
  };


  return (
    <div className="profile-container" style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
        <>
          {/* Header */}
          <div className="profile-header" style={styles.profileHeader}>
             <div style={styles.profileInfo}>
              <img src={profileData.photo || `https://api.dicebear.com/6.x/initials/svg?seed=${profileData.username || user.email}`} alt="avatar" style={styles.profileAvatar}/>
              <div>
                <h2 style={styles.profileUsername}>{profileData.username}</h2>
                <p style={styles.profileBio}>{profileData.bio || 'No bio yet'}</p>
              </div>
            </div>
            <button onClick={() => setIsEditing(true)} className="edit-profile-button" style={styles.editButton}>
              Edit Profile
            </button>
          </div>

          {/* Stats --- MODIFIED: All stats clickable --- */}
          <div className="profile-stats" style={styles.profileStats}>
            {/* Listings Stat (Clickable) */}
            <div
                className={`stat-item ${activeTab === 'forSale' ? 'active' : ''}`}
                style={{...styles.statItem, ...styles.clickableStat, ...(activeTab === 'forSale' ? styles.activeStat : {})}}
                onClick={() => setActiveTab('forSale')}
                role="button" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') setActiveTab('forSale')}}
            >
                <strong style={styles.statCount}>{products.length}</strong>
                <span style={styles.statLabel}>
                   <List size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                   Listings
                </span>
            </div>
             {/* Sold Stat (Clickable) */}
            <div
                className={`stat-item ${activeTab === 'sold' ? 'active' : ''}`}
                style={{...styles.statItem, ...styles.clickableStat, ...(activeTab === 'sold' ? styles.activeStat : {})}}
                onClick={() => setActiveTab('sold')}
                role="button" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') setActiveTab('sold')}}
            >
                <strong style={styles.statCount}>{sold.length}</strong>
                <span style={styles.statLabel}>
                    <BadgeCheck size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Sold
                </span>
            </div>
            {/* Followers Stat (Clickable) */}
            <div
                className={`stat-item ${activeTab === 'followers' ? 'active' : ''}`}
                style={{...styles.statItem, ...styles.clickableStat, ...(activeTab === 'followers' ? styles.activeStat : {})}}
                onClick={() => setActiveTab('followers')}
                role="button" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') setActiveTab('followers')}}
             >
                 <strong style={styles.statCount}>{followerCount}</strong>
                 <span style={styles.statLabel}>
                    <Users size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Followers
                </span>
            </div>
            {/* Following Stat (Clickable) */}
            <div
                 className={`stat-item ${activeTab === 'following' ? 'active' : ''}`}
                 style={{...styles.statItem, ...styles.clickableStat, ...(activeTab === 'following' ? styles.activeStat : {})}}
                 onClick={() => setActiveTab('following')}
                 role="button" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') setActiveTab('following')}}
             >
                 <strong style={styles.statCount}>{followingCount}</strong>
                 <span style={styles.statLabel}>
                     <UserCheck size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                     Following
                </span>
            </div>
          </div>

          {/* --- REMOVED TABS Section --- */}

          {/* --- NEW: Dynamic Heading for Content --- */}
          <h3 style={styles.contentHeading}>
            {getActiveContentTitle()}
          </h3>

          {/* Content Area --- Renders based on activeTab state --- */}
          {/* Added slight adjustment to marginTop for the content area */}
          <div className="tab-content" style={{marginTop: '1.5rem'}}>
              {/* Product Grid (For Sale) */}
              {activeTab === 'forSale' && (
                 <div className="profile-product-grid" style={styles.profileProductGrid}>
                   {forSale.length > 0 ? forSale.map((product) => (
                     <Link to={`/product/${product.id}`} key={product.id} style={styles.productLink}>
                       {/* --- MODIFIED: Added hover handlers back --- */}
                       <div
                         className="profile-product-card"
                         style={styles.profileProductCard}
                         onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                         onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'} // Reset to initial shadow state
                       >
                         <div style={styles.productCardImageContainer}>
                           <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.title || 'Product'} style={styles.productCardImage} onError={(e) => { e.target.onerror = null; e.target.src='/placeholder.jpg'; }} />
                         </div>
                         <div style={styles.productCardInfo}>
                           <h4 style={styles.productCardTitle}>{product.title || 'Untitled'}</h4>
                           <p style={styles.productCardPrice}>{typeof product.price === 'number' ? `${product.price.toFixed(2)} TND` : product.price || 'N/A'}</p>
                         </div>
                       </div>
                     </Link>
                   )) : <p style={styles.emptyTabText}>No items currently listed for sale.</p>}
                 </div>
              )}

               {/* Product Grid (Sold) */}
              {activeTab === 'sold' && (
                 <div className="profile-product-grid" style={styles.profileProductGrid}>
                   {sold.length > 0 ? sold.map((product) => (
                     <Link to={`/product/${product.id}`} key={product.id} style={styles.productLink}>
                       {/* --- ADDED: Hover handlers (optional) --- */}
                       <div
                         className="profile-product-card"
                         style={{...styles.profileProductCard, ...styles.soldProductCard}}
                         onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'} // Added hover
                         onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'} // Added hover
                       >
                         <div style={styles.productCardImageContainer}>
                           <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.title || 'Product'} style={styles.productCardImage} onError={(e) => { e.target.onerror = null; e.target.src='/placeholder.jpg'; }}/>
                           <div style={styles.soldOverlay}>SOLD</div>
                         </div>
                         <div style={styles.productCardInfo}>
                           <h4 style={styles.productCardTitle}>{product.title || 'Untitled'}</h4>
                           <p style={styles.productCardPrice}>{typeof product.price === 'number' ? `${product.price.toFixed(2)} TND` : product.price || 'N/A'}</p>
                         </div>
                       </div>
                     </Link>
                   )) : <p style={styles.emptyTabText}>No sold items yet.</p>}
                 </div>
              )}

               {/* Followers List */}
               {activeTab === 'followers' && (
                    <div className="user-list-container" style={styles.userListContainer}>
                        {loadingFollows ? <p>Loading...</p> : followersList.length === 0 ? <p style={styles.emptyTabText}>No followers yet.</p> : (
                            <ul style={styles.userList}>
                                {followersList.map((person) => person && person.username && (
                                    <UserListItem key={person.username} person={person} />
                                ))}
                            </ul>
                        )}
                    </div>
               )}

               {/* Following List */}
               {activeTab === 'following' && (
                   <div className="user-list-container" style={styles.userListContainer}>
                        {loadingFollows ? <p>Loading...</p> : followingList.length === 0 ? <p style={styles.emptyTabText}>Not following anyone yet.</p> : (
                            <ul style={styles.userList}>
                                {followingList.map((person) => person && person.username && (
                                    <UserListItem key={person.username} person={person} />
                                ))}
                            </ul>
                        )}
                    </div>
               )}

          </div>


          {/* Edit Profile Modal */}
          <EditProfileModal
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            userId={user.id}
            currentProfile={profileData}
            onSave={() => { fetchProfile(); }}
          />
        </>
    </div>
  );
};


// --- Styles Object ---
const styles = {
    profileHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
    profileInfo: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    profileAvatar: { width: '100px', height: '100px', borderRadius: '50%', border: '3px solid #f97316', objectFit: 'cover' },
    profileUsername: { margin: 0, fontSize: '1.8rem' },
    profileBio: { color: '#555', marginTop: '0.25rem', fontSize: '1rem' },
    editButton: { backgroundColor: '#f97316', color: '#fff', borderRadius: '999px', padding: '0.5rem 1.2rem', fontSize: '0.9rem', border: 'none', fontWeight: '500', cursor: 'pointer', height: 'fit-content', transition: 'background-color 0.2s ease' },
    profileStats: { display: 'flex', justifyContent: 'space-around', background: '#fff7ed', padding: '1rem 1.5rem', borderRadius: '1rem', marginBottom: '0rem', textAlign: 'center' },
    statItem: { padding: '0 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }, // Centering items
    clickableStat: { cursor: 'pointer', borderRadius: '6px', padding: '0.25rem 0.5rem', transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease', borderBottom: '3px solid transparent' /* Placeholder for active border */ },
    activeStat: { backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316', borderBottom: '3px solid #f97316' /* Stronger active indicator */ },
    statCount: { display: 'block', fontSize: '1.2rem', fontWeight: '600' },
    statLabel: { fontSize: '0.9rem', color: 'inherit', display: 'flex', alignItems: 'center', marginTop: '0.2rem' }, // Added flex for icon alignment
    contentHeading: { fontSize: '1.4rem', fontWeight: '600', color: '#444', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee'}, // Added heading style
    profileProductGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' },
    productLink: { textDecoration: 'none', color: 'inherit' },
    profileProductCard: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s ease', boxShadow: 'none' /* Explicitly set initial shadow state */ },
    soldProductCard: { opacity: 0.7 },
    soldOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.5)', color: '#555', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem'},
    productCardImageContainer: { width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#f0f0f0', position: 'relative' },
    productCardImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    productCardInfo: { padding: '0.75rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    productCardTitle: { margin: '0 0 0.3rem 0', fontSize: '0.95rem', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    productCardPrice: { margin: 0, color: '#f97316', fontWeight: '600', fontSize: '1rem' },
    userListContainer: { marginTop: '1rem' },
    userList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }, // Reduced gap slightly
    userListItem: { /* No specific style needed here */ },
    userListItemLink: { display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit', padding: '0.75rem', borderRadius: '8px', transition: 'background-color 0.2s ease', backgroundColor: '#fff', border: '1px solid #eee' },
    // --- ADDED: Hover style definition for user list items ---
    userListItemLinkHover: { backgroundColor: '#f8f8f8' }, // You would apply this with CSS classes or onMouseEnter/Leave
    userListAvatar: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
    userListUsername: { fontWeight: '500', color: '#333', fontSize: '1rem' },
    emptyTabText: { gridColumn: '1 / -1', textAlign: 'center', color: '#777', padding: '2rem 0' },
};

export default Profile;