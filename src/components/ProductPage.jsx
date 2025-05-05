import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from './auth/supabaseClient'; //
import { useUser } from '../UserContext'; //
import './productpage.css'; //
import { ChevronRight } from 'lucide-react'; // Example icon import

const ProductPage = () => {
  const { id } = useParams();
  const { user } = useUser(); //
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});

  const replyRefs = useRef({});

  // Effect for expanding/collapsing replies
  useEffect(() => {
    Object.keys(expandedReplies).forEach((key) => {
      const el = replyRefs.current[key];
      if (!el) return;
      if (expandedReplies[key]) {
        el.style.height = el.scrollHeight + 'px';
      } else {
        el.style.height = '0px';
      }
    });
  }, [expandedReplies]);

  // Effect for fetching product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // Start loading
      const { data, error } = await supabase //
        .from('products')
        // Select product columns and join with users table to get seller info
        .select('*, users:owner (username, photo)') // Joins with users table
        .eq('id', id)
        .single();

      if (!error && data) {
        setProduct(data);
        if (data.images?.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } else {
        console.error('Error fetching product:', error?.message);
        setProduct(null); // Ensure product is null on error
      }
      setLoading(false); // Finish loading
    };

    if (id) { // Ensure id is available before fetching
        fetchProduct();
    } else {
        setLoading(false);
        setProduct(null);
    }
  }, [id]);

  // Function and Effect for loading comments
  const loadComments = async () => {
     if (!id) return; // Don't fetch if id isn't available yet
    const { data, error } = await supabase //
      .from('comments')
      .select('*')
      .eq('product_id', parseInt(id, 10))
      .order('created_at', { ascending: false });

    if (!error) setComments(data || []);
    else console.error('Error loading comments:', error.message);
  };

  useEffect(() => {
    loadComments();
  }, [id]);


  // Function for posting comments/replies
  const handlePostComment = async (parentId = null) => {
    const text = parentId ? replyText : newComment;
    if (!text.trim() || !user) return; //

    // Fetch commenter's profile details for username/avatar consistency
    const { data: profile, error: profileError } = await supabase //
      .from('users')
      .select('username, photo')
      .eq('id', user.id) //
      .single();

    if (profileError) {
      console.error('Failed to load profile:', profileError.message);
      alert('Could not fetch your profile details to post comment.');
      return;
    }

    const { error } = await supabase.from('comments').insert([ //
      {
        product_id: parseInt(id, 10),
        username: profile.username || 'anonymous', // Fallback username
        avatar: profile.photo || '', // Use fetched photo or empty string
        comment: text,
        parent_id: parentId || null,
      },
    ]);

    if (error) {
      console.error('Failed to post comment:', error.message);
      alert('Failed to post comment.');
    } else {
      setNewComment('');
      setReplyText('');
      setReplyingTo(null);
      loadComments(); // Reload comments after posting
    }
  };

  // Logic for comments and replies
  const topLevelComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId) => comments.filter((c) => c.parent_id === parentId);
  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // --- RENDER LOGIC ---
  if (loading) return <div className="product-loading">Loading product...</div>;
  if (!product) return <div className="product-error">Product not found or error loading details.</div>;

  return (
    // Use className from productpage.css
    <div className="product-container">
      {/* Wrapper for Gallery + Details side-by-side */}
      <div className="product-top">
        {/* Left: Gallery */}
        <div className="product-gallery">
          <div className="thumbnails">
            {/* Map over product images */}
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
                onError={(e) => (e.target.src = '/placeholder.jpg')}
              />
            ))}
          </div>
          <div className="main-image">
            <img
              src={selectedImage || '/placeholder.jpg'}
              alt={product.title || 'Main product image'}
              onError={(e) => (e.target.src = '/placeholder.jpg')}
            />
          </div>
        </div>

        {/* Right: Details - Uses styles from productpage.css */}
        <div className="product-details">
          {/* Title */}
          <h1 className="product-title-main">{product.title}</h1>

          {/* Price */}
          <p className="price-main">
             {/* Format price */}
             {typeof product.price === 'number' ? `${product.price.toFixed(2)} TND` : product.price || 'N/A'}
          </p>

          {/* Attributes Section */}
          <div className="product-attributes">
            <div className="attribute-item">
                <span className="attribute-label">Brand:</span>
                <span className="attribute-value">{product.brand || 'N/A'}</span>
            </div>
             <div className="attribute-item">
                <span className="attribute-label">Size:</span>
                <span className="attribute-value">{product.size || 'N/A'}</span>
            </div>
             <div className="attribute-item">
                <span className="attribute-label">Color:</span>
                <span className="attribute-value">{product.color || 'N/A'}</span>
            </div>
             <div className="attribute-item">
                <span className="attribute-label">Condition:</span>
                <span className="attribute-value">{product.condition || 'N/A'}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="description-section">
            <h3 className="description-heading">Description</h3>
            <p className="description-text">{product.description || 'No description provided.'}</p>
          </div>

           {/* TODO: Add CTA Buttons Here Later (Buy Now, Add Cart, Offer) */}
           {/* <div className="cta-buttons"> ... </div> */}

          {/* Seller Card - Uses data joined from users table */}
          <div className="seller-card">
            <Link to={`/profile/${product.users?.username || ''}`} className="seller-avatar">
              <img
                // Use seller's photo from joined data, fallback to placeholder
                src={product.users?.photo || `/placeholder-avatar.png`}
                alt={product.users?.username || 'Seller avatar'}
                onError={(e) => (e.target.src = '/placeholder-avatar.png')}
              />
            </Link>
            <div className="seller-info">
              <span className="seller-label">Sold by:</span>
              {/* Link to seller's public profile */}
              <Link to={`/profile/${product.users?.username || ''}`} className="seller-name">
                @{product.users?.username || 'Unknown'}
              </Link>
              {/* Optional: Add member since or other info here */}
              <p className="seller-date">Posted on: {new Date(product.created_at).toLocaleDateString()}</p>
            </div>
            {/* Link to seller's profile */}
             <Link to={`/profile/${product.users?.username || ''}`} className="view-profile-link" title="View profile">
                 <ChevronRight size={20} />
             </Link>
          </div>
        </div> {/* End product-details */}
      </div> {/* End product-top */}

      {/* Comments Section - Below product-top */}
       <div className="comments-section">
        <h3 className="comments-heading">Comments & Questions</h3>

        {/* Comment Form for logged-in users */}
        {user && ( //
          <div className="comment-form">
            <textarea
              rows="3"
              placeholder="Write your comment or question..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={() => handlePostComment()}>Post Comment</button>
          </div>
        )}
         {/* Prompt to login/signup if not logged in */}
         {!user && ( //
             <p className="comment-login-prompt">
                 <Link to="/login">Log in</Link> or <Link to="/signup">sign up</Link> to leave a comment.
            </p>
         )}

        {/* List of Comments */}
        <div className="comment-list">
          {topLevelComments.map((c) => (
            <div key={c.id} className="comment">
              {/* Comment author avatar */}
              <img
                src={c.avatar || '/placeholder-avatar.png'}
                alt={c.username}
                className="comment-avatar"
                onError={(e) => (e.target.src = '/placeholder-avatar.png')}
              />
              {/* Comment content */}
              <div className="comment-content">
                <span className="comment-username">@{c.username}</span>
                <p className="comment-text">{c.comment}</p>
                <div className="comment-footer">
                    <span className="comment-date">{new Date(c.created_at).toLocaleString()}</span>
                    {/* Reply button for logged-in users */}
                    {user && ( //
                      <button className="reply-button" onClick={() => setReplyingTo(c.id)}>
                        Reply
                      </button>
                    )}
                </div>

                {/* Toggle Replies Button */}
                {getReplies(c.id).length > 0 && (
                  <button
                    className="toggle-replies-button"
                    onClick={() => toggleReplies(c.id)}
                  >
                    <ChevronRight
                      size={16}
                      className={`toggle-replies-icon ${expandedReplies[c.id] ? 'expanded' : ''}`}
                    />
                    {expandedReplies[c.id]
                      ? 'Hide replies'
                      : `Show ${getReplies(c.id).length} replies`}
                  </button>
                )}

                {/* Reply Input Form */}
                {replyingTo === c.id && (
                  <div className="reply-form">
                    <textarea
                      rows="2"
                      placeholder={`Replying to @${c.username}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="reply-form-actions">
                        <button onClick={() => setReplyingTo(null)} className="cancel-reply-button">Cancel</button>
                        <button onClick={() => handlePostComment(c.id)}>Post Reply</button>
                    </div>
                  </div>
                )}

                {/* Replies Container */}
                <div
                  className="replies"
                  ref={(el) => (replyRefs.current[c.id] = el)}
                  style={{ height: 0, overflow: 'hidden', transition: 'height 0.3s ease' }}
                >
                  {getReplies(c.id).map((reply) => (
                    <div key={reply.id} className="comment reply">
                      <img
                        src={reply.avatar || '/placeholder-avatar.png'}
                        alt={reply.username}
                        className="comment-avatar"
                         onError={(e) => (e.target.src = '/placeholder-avatar.png')}
                      />
                      <div className="comment-content">
                         <span className="comment-username">@{reply.username}</span>
                         <p className="comment-text">{reply.comment}</p>
                          <div className="comment-footer">
                            <span className="comment-date">{new Date(reply.created_at).toLocaleString()}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> {/* End comment-content */}
            </div> // End comment
          ))}
          {/* Message if no comments exist */}
          {comments.length === 0 && <p className="no-comments-message">Be the first to comment!</p>}
        </div> {/* End comment-list */}
      </div> {/* End comments-section */}

    </div> // End product-container
  );
};

export default ProductPage;