import React, { useEffect, useState } from 'react';
// --- MODIFIED: Added Link and useParams ---
import { useParams, Link } from 'react-router-dom';
import { supabase } from './auth/supabaseClient'; // Ensure path is correct
import { useUser } from '../UserContext'; // Import useUser
// --- MODIFIED: Import Icons ---
import { List, BadgeCheck, Users, UserCheck } from 'lucide-react';

const PublicProfile = () => {
  const { username } = useParams(); // Get username from URL
  const { user: loggedInUser } = useUser(); // Get the currently logged-in user (viewer)

  // --- State from profile.jsx (adapted) ---
  const [profileData, setProfileData] = useState(null); // User being viewed
  const [products, setProducts] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState('forSale'); // Default tab
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingFollows, setLoadingFollows] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false); // Loading state for follow button

  // Combined loading state
  const isLoading = loadingProfile || loadingProducts || loadingFollows;

  // --- Fetch Functions (Adapted for viewed profile ID) ---
  const fetchProfile = async (currentUsername) => {
    if (!currentUsername) return null; // Return null if no username
    setLoadingProfile(true);
    const { data: viewedUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', currentUsername)
      .single();

    if (userError || !viewedUser) {
      console.error('Error fetching user profile:', userError?.message);
      setProfileData(null);
      setLoadingProfile(false);
      return null; // Return null if user not found
    }
    setProfileData(viewedUser);
    setLoadingProfile(false);
    return viewedUser; // Return the fetched user data
  };

  const fetchProducts = async (profileId) => {
    if (!profileId) return;
    setLoadingProducts(true);
    const { data: userProducts, error: productError } = await supabase
      .from('products')
      .select('id, title, price, images, sold')
      .eq('owner', profileId)
      .order('created_at', { ascending: false });
    if (productError) console.error("Error fetching products:", productError);
    setProducts(productError ? [] : userProducts || []);
    setLoadingProducts(false);
  };

  const fetchFollowers = async (profileId) => {
      if (!profileId) return;
      const { data, error } = await supabase
          .from('followers')
          .select(`follower_id, users:follower_id!inner( username, photo )`)
          .eq('following_id', profileId);
      if (error) { console.error("Error fetching followers:", error); setFollowersList([]); }
      else { setFollowersList(data.map(f => f.users).filter(Boolean)); }
  };

  const fetchFollowing = async (profileId) => {
      if (!profileId) return;
      const { data, error } = await supabase
          .from('followers')
          .select(`following_id, users:following_id!inner( username, photo )`)
          .eq('follower_id', profileId);
      if (error) { console.error("Error fetching following:", error); setFollowingList([]); }
      else { setFollowingList(data.map(f => f.users).filter(Boolean)); }
  };

  const fetchFollowerCount = async (profileId) => {
      if (!profileId) return;
      const { count, error } = await supabase
       .from('followers')
       .select('*', { count: 'exact', head: true })
       .eq('following_id', profileId);
      if (error) { console.warn('Error fetching follower count:', error.message); setFollowerCount(0); }
      else { setFollowerCount(count || 0); }
   };

   const fetchFollowingCount = async (profileId) => {
        if (!profileId) return;
        const { count, error } = await supabase
         .from('followers')
         .select('*', { count: 'exact', head: true })
         .eq('follower_id', profileId);
        if (error) { console.warn('Error fetching following count:', error.message); setFollowingCount(0); }
        else { setFollowingCount(count || 0); }
     };

    const checkFollowingStatus = async (viewedProfileId) => {
         if (loggedInUser && loggedInUser.id !== viewedProfileId) {
             const { data, error } = await supabase
                 .from('followers')
                 .select('follower_id') // Select minimal data
                 .eq('follower_id', loggedInUser.id)
                 .eq('following_id', viewedProfileId)
                 .maybeSingle(); // Use maybeSingle to handle 0 or 1 row

             if (!error && data) {
                  setIsFollowing(true);
              } else {
                  setIsFollowing(false); // Also set false on error
                  if(error) console.error("Error checking follow status:", error);
              }
         } else {
             setIsFollowing(false); // Cannot follow self or if not logged in
         }
     };

  // Main data fetching useEffect, triggered by username change
  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    const fetchAllData = async () => {
      // Reset all states when username changes
      setProfileData(null); setProducts([]); setFollowersList([]); setFollowingList([]);
      setFollowerCount(0); setFollowingCount(0); setIsFollowing(false);
      setLoadingProfile(true); setLoadingProducts(true); setLoadingFollows(true);

      const viewedUser = await fetchProfile(username);

      if (viewedUser && isMounted) {
        const profileId = viewedUser.id;
        // Fetch remaining data in parallel
        await Promise.all([
          fetchProducts(profileId),
          fetchFollowers(profileId),
          fetchFollowing(profileId),
          fetchFollowerCount(profileId),
          fetchFollowingCount(profileId),
          checkFollowingStatus(profileId)
        ]).finally(() => {
             if (isMounted) setLoadingFollows(false); // Combined loading state for follows
        });
      } else if (isMounted) {
          // Ensure loading flags are false if profile fetch failed
          setLoadingProfile(false);
          setLoadingProducts(false);
          setLoadingFollows(false);
      }
    };

    fetchAllData();

    return () => { isMounted = false }; // Cleanup function

  }, [username, loggedInUser]); // Re-run if username changes or user logs in/out


  // Follow/Unfollow Logic
  const handleFollowToggle = async () => {
       if (!loggedInUser || !profileData || loggedInUser.id === profileData.id || followLoading) return;
       setFollowLoading(true);
       const targetUserId = profileData.id; // ID of the profile being viewed

       if (isFollowing) {
           // --- Unfollow ---
           const { error } = await supabase
               .from('followers')
               .delete()
               .eq('follower_id', loggedInUser.id)
               .eq('following_id', targetUserId);

           if (error) {
               console.error("Error unfollowing:", error); alert("Failed to unfollow user.");
           } else {
               setIsFollowing(false);
               // Refresh follower count and list for the profile being viewed
               fetchFollowerCount(targetUserId);
               fetchFollowers(targetUserId);
           }
       } else {
           // --- Follow ---
            const { error } = await supabase
               .from('followers')
               .insert({ follower_id: loggedInUser.id, following_id: targetUserId });

            if (error) {
               console.error("Error following:", error); alert("Failed to follow user.");
           } else {
               setIsFollowing(true);
                // Refresh follower count and list for the profile being viewed
               fetchFollowerCount(targetUserId);
               fetchFollowers(targetUserId);
           }
       }
       setFollowLoading(false);
  };


  // Derived states for products
  const forSale = products.filter((p) => !p.sold);
  // --- MODIFIED: Calculate sold items ---
  const sold = products.filter((p) => p.sold);

   if (loadingProfile) { // Show loading only while profile is loading initially
     return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
   }
  if (!profileData) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>User "{username}" not found.</div>;
  }

  // Helper Component for User List Item
  const UserListItem = ({ person }) => (
     <li style={styles.userListItem}>
        {/* Ensure person and username exist */}
        {person && person.username ? (
            <Link to={`/profile/${person.username}`} style={styles.userListItemLink}>
               <img
                   src={person.photo || `/placeholder-avatar.png`}
                   alt={person.username}
                   style={styles.userListAvatar}
                   onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-avatar.png'; }}
               />
               <span style={styles.userListUsername}>@{person.username}</span>
            </Link>
        ) : (
            <span style={{color: '#aaa'}}>Invalid user data</span> // Fallback for bad data
        )}
     </li>
  );

   // Dynamic Heading Content
  const getActiveContentTitle = () => {
    switch (activeTab) {
        case 'forSale': return `${profileData.username}'s Items For Sale`;
        // --- MODIFIED: Re-enable sold title ---
        case 'sold': return `${profileData.username}'s Sold Items`;
        case 'followers': return `Followers`;
        case 'following': return `Following`;
        default: return 'Items';
    }
  };

  // Determine if the logged-in user is viewing their own profile
  const isOwnProfile = loggedInUser?.id === profileData?.id;


  return (
    <div className="profile-container" style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
        <>
          {/* Header */}
          <div className="profile-header" style={styles.profileHeader}>
             <div style={styles.profileInfo}>
              <img src={profileData.photo || `https://api.dicebear.com/6.x/initials/svg?seed=${profileData.username}`} alt="avatar" style={styles.profileAvatar}/>
              <div>
                <h2 style={styles.profileUsername}>{profileData.username}</h2>
                <p style={styles.profileBio}>{profileData.bio || 'No bio yet'}</p>
              </div>
            </div>
             {/* Show Edit button OR Follow button */}
            {isOwnProfile ? (
                // Link to private profile page which has editing
                <Link to="/profile" style={{...styles.editButton, textDecoration: 'none'}}>
                    Go to My Profile / Edit
                </Link>
            ) : loggedInUser ? (
                <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    style={isFollowing ? styles.followingButton : styles.followButton}
                >
                    {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                </button>
            ) : (
                // Prompt non-logged-in users to login to follow
                <Link to="/login" style={styles.followButton}>Follow</Link>
            )}
          </div>

          {/* Stats Bar */}
           <div className="profile-stats" style={styles.profileStats}>
            {/* Listings Stat */}
            <div
                className={`stat-item ${activeTab === 'forSale' ? 'active' : ''}`}
                style={{...styles.statItem, ...styles.clickableStat, ...(activeTab === 'forSale' ? styles.activeStat : {})}}
                onClick={() => setActiveTab('forSale')}
                role="button" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') setActiveTab('forSale')}}
            >
                {/* Display count of all products fetched for this user */}
                <strong style={styles.statCount}>{products.length}</strong>
                <span style={styles.statLabel}>
                   <List size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                   Listings
                </span>
            </div>
             {/* --- MODIFIED: Re-enabled Sold Stat --- */}
             <div
                 className={`stat-item ${activeTab === 'sold' ? 'active' : ''}`}
                 style={{...styles.statItem, ...styles.clickableStat, ...(activeTab === 'sold' ? styles.activeStat : {})}}
                 onClick={() => setActiveTab('sold')}
                 role="button" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') setActiveTab('sold')}}
             >
                 {/* Display count of sold products */}
                 <strong style={styles.statCount}>{sold.length}</strong>
                 <span style={styles.statLabel}>
                    <BadgeCheck size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                     Sold
                 </span>
             </div>
            {/* Followers Stat */}
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
            {/* Following Stat */}
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

          {/* Dynamic Heading */}
           <h3 style={styles.contentHeading}>
            {getActiveContentTitle()}
          </h3>

          {/* Content Area */}
          <div className="tab-content" style={{marginTop: '1.5rem'}}>
              {/* Product Grid (For Sale) */}
              {activeTab === 'forSale' && (
                 <div className="profile-product-grid" style={styles.profileProductGrid}>
                    {/* Show loading indicator specific to products if profile is loaded but products aren't */}
                   {loadingProducts ? <p>Loading items...</p> : forSale.length > 0 ? forSale.map((product) => (
                     <Link to={`/product/${product.id}`} key={product.id} style={styles.productLink}>
                       <div
                         className="profile-product-card"
                         style={styles.profileProductCard}
                         onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                         onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
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
                   )) : <p style={styles.emptyTabText}>No items listed for sale.</p>}
                 </div>
              )}

               {/* --- MODIFIED: Re-enabled Sold Items Grid --- */}
               {activeTab === 'sold' && (
                  <div className="profile-product-grid" style={styles.profileProductGrid}>
                    {loadingProducts ? <p>Loading items...</p> : sold.length > 0 ? sold.map((product) => (
                      <Link to={`/product/${product.id}`} key={product.id} style={styles.productLink}>
                        <div
                          className="profile-product-card"
                          style={{...styles.profileProductCard, ...styles.soldProductCard}}
                          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                          onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
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
                    )) : <p style={styles.emptyTabText}>No sold items to show.</p>}
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
                        {loadingFollows ? <p>Loading...</p> : followingList.length === 0 ? <p style={styles.emptyTabText}>{`${profileData.username}`} isn't following anyone yet.</p> : (
                            <ul style={styles.userList}>
                                {followingList.map((person) => person && person.username && (
                                    <UserListItem key={person.username} person={person} />
                                ))}
                            </ul>
                        )}
                    </div>
               )}
          </div>

          {/* No Edit Modal on Public Profile */}
        </>
    </div>
  );
};


// --- Styles Object (Copied and adapted from profile.jsx) ---
const styles = {
    profileHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
    profileInfo: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    profileAvatar: { width: '100px', height: '100px', borderRadius: '50%', border: '3px solid #f97316', objectFit: 'cover' },
    profileUsername: { margin: 0, fontSize: '1.8rem' },
    profileBio: { color: '#555', marginTop: '0.25rem', fontSize: '1rem' },
    editButton: { backgroundColor: '#f97316', color: '#fff', borderRadius: '999px', padding: '0.5rem 1.2rem', fontSize: '0.9rem', border: 'none', fontWeight: '500', cursor: 'pointer', height: 'fit-content', transition: 'background-color 0.2s ease', minWidth: '100px' },
    followButton: { backgroundColor: '#f97316', color: '#fff', borderRadius: '999px', padding: '0.5rem 1.2rem', fontSize: '0.9rem', border: 'none', fontWeight: '600', cursor: 'pointer', height: 'fit-content', transition: 'background-color 0.2s ease, opacity 0.2s ease', minWidth: '100px'},
    followingButton: { backgroundColor: '#eee', color: '#555', borderRadius: '999px', padding: '0.5rem 1.2rem', fontSize: '0.9rem', border: '1px solid #ddd', fontWeight: '600', cursor: 'pointer', height: 'fit-content', transition: 'background-color 0.2s ease, opacity 0.2s ease', minWidth: '100px' },
    profileStats: { display: 'flex', justifyContent: 'space-around', background: '#fff7ed', padding: '1rem 1.5rem', borderRadius: '1rem', marginBottom: '0rem', textAlign: 'center' },
    statItem: { padding: '0 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    clickableStat: { cursor: 'pointer', borderRadius: '6px', padding: '0.25rem 0.5rem', transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease', borderBottom: '3px solid transparent' },
    activeStat: { backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316', borderBottom: '3px solid #f97316' },
    statCount: { display: 'block', fontSize: '1.2rem', fontWeight: '600' },
    statLabel: { fontSize: '0.9rem', color: 'inherit', display: 'flex', alignItems: 'center', marginTop: '0.2rem' },
    contentHeading: { fontSize: '1.4rem', fontWeight: '600', color: '#444', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee'},
    profileProductGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' },
    productLink: { textDecoration: 'none', color: 'inherit' },
    profileProductCard: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s ease', boxShadow: 'none' },
    soldProductCard: { opacity: 0.7 },
    soldOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.5)', color: '#555', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem'},
    productCardImageContainer: { width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#f0f0f0', position: 'relative' },
    productCardImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    productCardInfo: { padding: '0.75rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    productCardTitle: { margin: '0 0 0.3rem 0', fontSize: '0.95rem', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    productCardPrice: { margin: 0, color: '#f97316', fontWeight: '600', fontSize: '1rem' },
    userListContainer: { marginTop: '1rem' },
    userList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    userListItem: { },
    userListItemLink: { display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit', padding: '0.75rem', borderRadius: '8px', transition: 'background-color 0.2s ease', backgroundColor: '#fff', border: '1px solid #eee' },
    userListItemLinkHover: { backgroundColor: '#f8f8f8' },
    userListAvatar: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
    userListUsername: { fontWeight: '500', color: '#333', fontSize: '1rem' },
    emptyTabText: { gridColumn: '1 / -1', textAlign: 'center', color: '#777', padding: '2rem 0' },
};

export default PublicProfile;