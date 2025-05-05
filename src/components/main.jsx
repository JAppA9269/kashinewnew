import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { supabase } from './auth/supabaseClient';
import { Link } from 'react-router-dom';
import './mainpage.css'; // Make sure CSS is imported

// Simple Skeleton Card Component (can be moved to its own file later)
const SkeletonCard = () => (
  <div className="product-card skeleton-card">
    <div className="skeleton skeleton-image"></div>
    <div className="product-info">
      <div className="skeleton skeleton-text skeleton-text-short"></div>
      <div className="skeleton skeleton-text skeleton-text-long"></div>
      <div className="skeleton skeleton-text skeleton-text-medium"></div>
    </div>
  </div>
);


function Main() {
  const { user, loading: userLoading } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Keep this for product loading
  const [brandFilter, setBrandFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');

  // Combine loading states
  const isLoading = userLoading || loading;

  useEffect(() => {
    const fetchProducts = async () => {
      // Don't reset loading if user is still loading, wait for effect trigger
      if (!userLoading) {
         setLoading(true);
      } else {
          // If user is loading, we wait until user is loaded before fetching
          return;
      }

      // Fetch only if user is loaded and present
      if(user) {
          const { data, error } = await supabase
            .from('products')
            .select('*') // Select specific columns if needed: 'id, title, brand, size, price, images'
            .eq('sold', false)
            .order('created_at', { ascending: false }); // Example: order by newest

          if (error) {
            console.error('Error fetching products:', error.message);
            // Optionally set an error state here
          } else {
            setProducts(data || []); // Ensure data is an array
          }
      } else {
          // If no user, maybe clear products or handle differently
          setProducts([]);
      }


      setLoading(false); // Products fetch attempt finished
    };

    // Fetch products only when user is confirmed to be loaded
    if (!userLoading) {
        fetchProducts();
    }
    // Dependency array includes userLoading and user to refetch if user logs in/out
  }, [userLoading, user]);

  // Derived state should be calculated during render
  const filteredProducts = products.filter((item) => {
    // Ensure item and properties exist before filtering
    const brandMatch = !brandFilter || (item && item.brand === brandFilter);
    const sizeMatch = !sizeFilter || (item && item.size === sizeFilter);
    return brandMatch && sizeMatch;
  });

  // Generate unique lists for filters based on the *original* products list
  const uniqueBrands = [...new Set(products.map((p) => p?.brand).filter(Boolean))];
  const uniqueSizes = [...new Set(products.map((p) => p?.size).filter(Boolean))];


  // Display loading skeletons if data is loading
  if (isLoading) {
    return (
       <div className="mainpage-container">
         {/* Keep filter bar visible but maybe disabled/styled differently? */}
         <div className="filter-bar">
           <select disabled><option>All Brands</option></select>
           <select disabled><option>All Sizes</option></select>
           {/* Add skeleton for sort dropdown if you add it */}
         </div>
         <div className="product-grid">
            {/* Render e.g., 8 skeleton cards */}
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
         </div>
       </div>
    );
  }

  // Redirect or show message if not logged in (already handled by App.jsx routing, but good practice)
  if (!user) {
     // This might not be reached if routing handles it, but as a fallback
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Please log in to view products.</div>;
  }

  return (
    <div className="mainpage-container">
      <div className="filter-bar">
        {/* Filter Dropdowns */}
        <select onChange={(e) => setBrandFilter(e.target.value)} value={brandFilter}>
          <option value="">All Brands</option>
          {uniqueBrands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select onChange={(e) => setSizeFilter(e.target.value)} value={sizeFilter}>
          <option value="">All Sizes</option>
          {uniqueSizes.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
         {/* TODO: Add Sorting Dropdown Here */}
      </div>

       {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="product-card-link" // Use class for styling link if needed
            >
              <div className="product-card">
                 {/* Image Container for aspect ratio */}
                <div className="product-image-container">
                  <img
                     className="product-image" // Add class for specific image styling
                    src={
                      Array.isArray(product.images) && product.images.length > 0
                        ? product.images[0] // Use first image
                        : '/placeholder.jpg' // Fallback placeholder
                    }
                    alt={product.title || product.brand || 'Product image'} // Better alt text
                    loading="lazy" // Add lazy loading for images below the fold
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
                 {/* Info Section */}
                <div className="product-info">
                   {/* Display Title */}
                   <h4 className="product-title">{product.title || 'Untitled Item'}</h4>
                   {/* Display Details */}
                  <div className="product-sub-info">
                     <span className="brand-size">
                        {product.brand || 'N/A'} | {product.size || 'N/A'}
                     </span>
                     {/* Display Price */}
                     <span className="price">
                         {/* Format price if stored as number */}
                         {typeof product.price === 'number' ? `${product.price.toFixed(2)} TND` : product.price || 'N/A'}
                     </span>
                  </div>
                   {/* Optional: Add Seller Info */}
                   {/* <p className="product-seller">@{product.username || 'unknown'}</p> */}
                </div>
              </div>
            </Link>
          ))
        ) : (
           // Message when no products match filters
           <p className="no-products-message">No products found matching your filters.</p>
        )}
      </div>
       {/* TODO: Add Pagination or Load More Button Here */}
    </div>
  );
}

export default Main;