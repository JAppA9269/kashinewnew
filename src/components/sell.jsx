import React, { useState, useRef } from 'react';
import { supabase } from './auth/supabaseClient'; // Corrected path assuming it's in parent dir
import { useUser } from '../UserContext'; // Corrected path assuming it's in parent dir
import ImageEditorModal from './ImageEditorModal'; // Corrected path assuming it's in same dir
// --- MODIFIED: Import Trash2 instead of XCircle ---
import { Trash2, Plus } from 'lucide-react';

const Sell = () => {
  const { user } = useUser(); //
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    brand: '',
    category: '',
    size: '',
    color: '',
    condition: '',
    price: '',
  });
  const fileInputRef = useRef(null);

  const MAX_PHOTOS = 22;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotos = (e) => {
    const newFiles = Array.from(e.target.files);
    if (photos.length + newFiles.length > MAX_PHOTOS) {
      alert(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      const remainingSlots = MAX_PHOTOS - photos.length;
      if (remainingSlots > 0) {
         setPhotos((prev) => [...prev, ...newFiles.slice(0, remainingSlots)]);
      }
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
      return;
    }
    setPhotos((prev) => [...prev, ...newFiles]);
     if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
     if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
        setDraggedIndex(null);
        return;
    }
    const updated = [...photos];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);
    setPhotos(updated);
    setDraggedIndex(null);
  };


  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
    if (loading || !user || photos.length === 0) {
        if (!user) alert("You must be logged in.");
        if (photos.length === 0) alert("Please upload at least one image.");
        return;
    }
    setLoading(true);
    try {
      const uploadedURLs = [];
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const filePath = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { error: uploadError } = await supabase.storage // Renamed for clarity
          .from('product-images')
          .upload(filePath, file);
        // Check specifically for upload error
        if (uploadError) throw new Error(`Image ${i+1} upload failed: ${uploadError.message}`);

        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        // Ensure public URL was retrieved
        if (!publicData?.publicUrl) throw new Error(`Could not get public URL for image ${i+1}`);
        uploadedURLs.push(publicData.publicUrl);
      }

      let sellerUsername = user.email.split('@')[0];
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();
      if (!userError && userData?.username) {
        sellerUsername = userData.username;
      } else if (userError) {
          console.warn("Could not fetch username, using fallback.", userError.message);
      }

      // --- MODIFIED: Format price before inserting ---
      const priceToSave = `${form.price} TND`;
      // --- Note: Storing price as text like this makes database sorting/filtering harder. ---
      // --- It's usually better to store numbers as numeric types and format on display. ---

      const { error: insertError } = await supabase
        .from('products')
        .insert([
          {
            ...form,
            // --- MODIFIED: Use the formatted price string ---
            price: priceToSave,
            sold: false,
            images: uploadedURLs,
            created_at: new Date().toISOString(),
            owner: user.id,
            username: sellerUsername,
          }
        ]);
      if (insertError) throw new Error(`Product listing failed: ${insertError.message}`);

      alert("Product listed successfully!");
      setPhotos([]);
      setForm({ title: '', description: '', brand: '', category: '', size: '', color: '', condition: '', price: '' });
    } catch (err) {
      console.error("Submit Error:", err);
      alert(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  // --- Styles Object ---
  const styles = {
    // ... (keep all your existing styles from the previous version) ...
    photoLayoutContainer: { display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' },
    mainPreviewColumn: { flexShrink: 0, width: '200px', height: '264px' },
    mainPreviewWrapper: { position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid #f97316', cursor: 'pointer', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    mainPreviewImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    mainPreviewPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', textAlign: 'center', border: '2px dashed #ccc', borderRadius: '12px', backgroundColor: '#f9f9f9', height: '100%'},
    addIconLarge: { fontSize: '3rem', lineHeight: '1', marginBottom: '0.5rem', color: '#aaa' },
    addTextLarge: { fontSize: '1rem', fontWeight: '500' },
    mainLabel: { position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: '3px 8px', fontSize: '12px', borderRadius: '6px', zIndex: 1 },
    deleteButtonMain: { position: 'absolute', top: '8px', right: '8px', background: 'rgba(40, 40, 40, 0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    thumbnailGridColumn: { flex: 1, minWidth: '200px' },
    photoGridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' },
    thumbnailWrapper: { position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee', cursor: 'grab', backgroundColor: '#f0f0f0' },
    thumbnailWrapperDragging: { opacity: 0.5, border: '2px dashed #f97316' },
    thumbnailImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    deleteButton: { position: 'absolute', top: '4px', right: '4px', background: 'rgba(40, 40, 40, 0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    addPhotoSquare: { width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed #ccc', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#888', backgroundColor: '#f9f9f9', textAlign: 'center', transition: 'background-color 0.2s, border-color 0.2s' },
    addIcon: { fontSize: '1.5rem', lineHeight: '1', marginBottom: '0.2rem', color: '#aaa' },
    addText: { fontSize: '0.7rem', fontWeight: '500' },
    placeholderSquare: { width: '80px', height: '80px', borderRadius: '8px', backgroundColor: '#f0f0f0', border: '1px solid #e0e0e0' },
    formInput: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
    formSelect: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', width: '100%', backgroundColor: '#fff', boxSizing: 'border-box' },
    formTextarea: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', width: '100%', resize: 'vertical', background: '#fff8f4', boxSizing: 'border-box', minHeight: '100px' },
    formButton: { backgroundColor: loading ? '#ccc' : '#f97316', color: '#fff', padding: '0.7rem 1.6rem', border: 'none', borderRadius: '999px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s' },
    label: { fontWeight: 'bold', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem', color: '#333' }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#f97316' }}>Sell an Item</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={styles.label}>
            Upload Photos (max {MAX_PHOTOS}, first is main):
          </label>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handlePhotos} style={{ display: 'none' }} id="hidden-photo-upload"/>

          <div style={styles.photoLayoutContainer}>
            {/* Left Column: Main Image Preview */}
            <div style={styles.mainPreviewColumn}>
              {photos.length > 0 ? (
                <div className="mainPreviewWrapper"
                    style={styles.mainPreviewWrapper} draggable onDragStart={() => handleDragStart(0)} onDragOver={handleDragOver} onDrop={() => handleDrop(0)} onClick={() => setActiveModalIndex(0)} title="Click to edit main image" role="button" aria-label="Main product image">
                  <img src={URL.createObjectURL(photos[0])} alt="Main preview" style={styles.mainPreviewImage}/>
                   <div style={styles.mainLabel}>Main</div>
                   <button className="deleteButtonMain"
                       type="button" onClick={(e) => { e.stopPropagation(); handleRemovePhoto(0); }} style={styles.deleteButtonMain} aria-label="Remove main image">
                      <Trash2 size={16} strokeWidth={2} />
                   </button>
                </div>
              ) : (
                <div style={{...styles.mainPreviewWrapper, ...styles.mainPreviewPlaceholder}} onClick={triggerFileInput} role="button" aria-label="Add first photo" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') triggerFileInput()}}>
                    <div style={styles.addIconLarge}><Plus size={48} strokeWidth={1.5}/></div>
                    <div style={styles.addTextLarge}>Add Main Photo</div>
                </div>
              )}
            </div>

            {/* Right Column: Thumbnail Grid */}
            <div style={styles.thumbnailGridColumn}>
              <div style={styles.photoGridContainer}>
                {/* Render thumbnails for photos[1] onwards */}
                {photos.slice(1).map((file, index) => (
                  <div className="thumbnailWrapper"
                      key={`photo-${index + 1}`} style={{ ...styles.thumbnailWrapper, ...(draggedIndex === index + 1 ? styles.thumbnailWrapperDragging : {}) }} draggable onDragStart={() => handleDragStart(index + 1)} onDragOver={handleDragOver} onDrop={() => handleDrop(index + 1)} onClick={() => setActiveModalIndex(index + 1)} title={`Click to edit, drag to reorder (Image ${index + 2})`}>
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} style={styles.thumbnailImage}/>
                    <button className="deleteButton"
                        type="button" onClick={(e) => { e.stopPropagation(); handleRemovePhoto(index + 1); }} style={styles.deleteButton} aria-label={`Remove image ${index + 2}`}>
                       <Trash2 size={12} strokeWidth={2}/>
                    </button>
                  </div>
                ))}

                {/* Render the "+ Add" button */}
                 {photos.length < MAX_PHOTOS && (
                  <div style={styles.addPhotoSquare} onClick={triggerFileInput} role="button" aria-label="Add more photos" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') triggerFileInput()}}>
                    <div style={styles.addIcon}><Plus size={24} strokeWidth={1.5}/></div>
                    <div style={styles.addText}>Add</div>
                  </div>
                )}

                {/* Render empty placeholder squares */}
                 {Array.from({
                    length: Math.max(0, (MAX_PHOTOS - 1) - photos.slice(1).length - (photos.length < MAX_PHOTOS ? 1 : 0))
                 }).map((_, index) => (
                    <div key={`placeholder-${index}`} style={styles.placeholderSquare}></div>
                 ))}
              </div>
            </div>
          </div>
        </div>
        {/* --- END PHOTO SECTION --- */}

        {/* --- REST OF YOUR FORM --- */}
         <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="title" style={styles.label}>Title:</label>
          <input id="title" name="title" placeholder="e.g., Vintage Denim Jacket" value={form.title} onChange={handleInput} required style={styles.formInput} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
              <label htmlFor="brand" style={styles.label}>Brand:</label>
              <select id="brand" name="brand" value={form.brand} onChange={handleInput} style={styles.formSelect} required>
                <option value="" disabled>Select Brand</option> <option value="Zara">Zara</option> <option value="Nike">Nike</option> <option value="H&M">H&M</option> <option value="Adidas">Adidas</option> <option value="Vintage">Vintage</option>
              </select>
          </div>
          <div>
              <label htmlFor="size" style={styles.label}>Size:</label>
              <select id="size" name="size" value={form.size} onChange={handleInput} style={styles.formSelect} required>
                <option value="" disabled>Select Size</option> <option value="XS">XS</option> <option value="S">S</option> <option value="M">M</option> <option value="L">L</option> <option value="XL">XL</option>
              </select>
          </div>
          <div>
              <label htmlFor="color" style={styles.label}>Color:</label>
              <select id="color" name="color" value={form.color} onChange={handleInput} style={styles.formSelect} required>
                 <option value="" disabled>Select Color</option> <option value="Black">Black</option> <option value="White">White</option> <option value="Red">Red</option> <option value="Blue">Blue</option> <option value="Beige">Beige</option>
              </select>
          </div>
           <div>
              <label htmlFor="price" style={styles.label}>Price (TND):</label>
              <input id="price" type="number" name="price" placeholder="e.g., 50" value={form.price} onChange={handleInput} required min="0" step="any" style={styles.formInput}/>
           </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
         <div>
              <label htmlFor="category" style={styles.label}>Category:</label>
              <select id="category" name="category" value={form.category} onChange={handleInput} style={styles.formSelect} required>
                 <option value="" disabled>Select Category</option> <option value="Tops">Tops</option> <option value="Bottoms">Bottoms</option> <option value="Dresses">Dresses</option> <option value="Outerwear">Outerwear</option> <option value="Accessories">Accessories</option>
              </select>
          </div>
          <div>
              <label htmlFor="condition" style={styles.label}>Condition:</label>
              <select id="condition" name="condition" value={form.condition} onChange={handleInput} style={styles.formSelect} required>
                 <option value="" disabled>Select Condition</option> <option value="New with tags">New with tags</option> <option value="New without tags">New without tags</option> <option value="New with imperfections">New with imperfections</option> <option value="Pre-owned - Excellent">Pre-owned - Excellent</option> <option value="Pre-owned - Good">Pre-owned - Good</option> <option value="Pre-owned - Fair">Pre-owned - Fair</option>
              </select>
          </div>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="description" style={styles.label}>Description:</label>
          <textarea id="description" name="description" placeholder="Describe your item..." value={form.description} onChange={handleInput} required rows={5} style={styles.formTextarea}/>
        </div>
        <button type="submit" disabled={loading || photos.length === 0} style={styles.formButton}> {loading ? 'Listing...' : 'List Now'} </button>
      </form>

      {/* --- MODAL --- */}
      {activeModalIndex !== null && photos[activeModalIndex] && (
        <ImageEditorModal
          file={photos[activeModalIndex]}
          onClose={() => setActiveModalIndex(null)}
          onSave={(blob) => {
            const editedFile = new File([blob], `edited-${photos[activeModalIndex].name}`, { type: blob.type || 'image/jpeg' });
            setPhotos((prev) => {
              const updated = [...prev];
              updated[activeModalIndex] = editedFile;
              return updated;
            });
            setActiveModalIndex(null);
          }}
        />
      )}
       {/* --- END MODAL --- */}

      {/* --- Embedded style block for hover effect --- */}
      <style>{`
        .deleteButtonMain,
        .deleteButton {
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            background-color: rgba(40, 40, 40, 0.6);
        }
        .mainPreviewWrapper:hover .deleteButtonMain,
        .thumbnailWrapper:hover .deleteButton {
           opacity: 1;
        }
        .deleteButtonMain:hover,
        .deleteButton:hover {
            background-color: rgba(40, 40, 40, 0.8);
        }
        .draggable:active {
          cursor: grabbing !important;
        }
      `}</style>
    </div>
  );
};


// --- Styles Object ---
// Keep the full styles object from the previous version here
const styles = {
    photoLayoutContainer: { display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' },
    mainPreviewColumn: { flexShrink: 0, width: '200px', height: '264px' },
    mainPreviewWrapper: { position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid #f97316', cursor: 'pointer', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    mainPreviewImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    mainPreviewPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', textAlign: 'center', border: '2px dashed #ccc', borderRadius: '12px', backgroundColor: '#f9f9f9', height: '100%'},
    addIconLarge: { fontSize: '3rem', lineHeight: '1', marginBottom: '0.5rem', color: '#aaa' },
    addTextLarge: { fontSize: '1rem', fontWeight: '500' },
    mainLabel: { position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: '3px 8px', fontSize: '12px', borderRadius: '6px', zIndex: 1 },
    deleteButtonMain: { position: 'absolute', top: '8px', right: '8px', background: 'rgba(40, 40, 40, 0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    thumbnailGridColumn: { flex: 1, minWidth: '200px' },
    photoGridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' },
    thumbnailWrapper: { position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee', cursor: 'grab', backgroundColor: '#f0f0f0' },
    thumbnailWrapperDragging: { opacity: 0.5, border: '2px dashed #f97316' },
    thumbnailImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    deleteButton: { position: 'absolute', top: '4px', right: '4px', background: 'rgba(40, 40, 40, 0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    addPhotoSquare: { width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed #ccc', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#888', backgroundColor: '#f9f9f9', textAlign: 'center', transition: 'background-color 0.2s, border-color 0.2s' },
    addIcon: { fontSize: '1.5rem', lineHeight: '1', marginBottom: '0.2rem', color: '#aaa' },
    addText: { fontSize: '0.7rem', fontWeight: '500' },
    placeholderSquare: { width: '80px', height: '80px', borderRadius: '8px', backgroundColor: '#f0f0f0', border: '1px solid #e0e0e0' },
    formInput: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
    formSelect: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', width: '100%', backgroundColor: '#fff', boxSizing: 'border-box' },
    formTextarea: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', width: '100%', resize: 'vertical', background: '#fff8f4', boxSizing: 'border-box', minHeight: '100px' },
    formButton: { backgroundColor: loading ? '#ccc' : '#f97316', color: '#fff', padding: '0.7rem 1.6rem', border: 'none', borderRadius: '999px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s' },
    label: { fontWeight: 'bold', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem', color: '#333' }
};

export default Sell;