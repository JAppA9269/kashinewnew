import React, { useState } from 'react';
import PhotoEditModal from './PhotoEditModal'; // adjust path if needed

const Sell = () => {
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

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotos = (e) => {
    const newFiles = Array.from(e.target.files);
    const total = photos.length + newFiles.length;
    if (total > 20) {
      alert('You can upload a maximum of 20 photos.');
      return;
    }
    setPhotos((prev) => [...prev, ...newFiles]);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...photos];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, movedItem);
    setPhotos(updated);
    setDraggedIndex(null);
  };

  const handleSetMain = (index) => {
    setPhotos((prev) => {
      const updated = [...prev];
      const [main] = updated.splice(index, 1);
      updated.unshift(main);
      return updated;
    });
    setActiveModalIndex(null); // Close modal if action was from modal
  };

  const inputStyle = {
    padding: '0.6rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '100%',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form, photos);
  };
  const handleSaveCropped = (index, blob) => {
    const newFile = new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
    setPhotos(prev => {
      const updated = [...prev];
      updated[index] = newFile;
      return updated;
    });
    setActiveModalIndex(null); // close modal after saving
  };
  

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#f97316' }}>Sell an Item</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
            Upload Photos (max 20):
          </label>
          <input type="file" multiple accept="image/*" onChange={handlePhotos} />
        </div>

        {photos.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Main Image */}
            <div style={{ position: 'relative' }}>
              <div
                className="photo-wrapper draggable"
                draggable
                onDragStart={() => handleDragStart(0)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(0)}
                onClick={() => setActiveModalIndex(0)}
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '2px solid #f97316',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <img
                  src={URL.createObjectURL(photos[0])}
                  alt="Main"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '2px 6px',
                    fontSize: '12px',
                    borderRadius: '6px',
                  }}
                >
                  Main
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto(0);
                  }}
                  className="delete-button"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '0.5rem',
                flex: 1,
                minWidth: '0',
              }}
            >
              {photos.slice(1).map((file, index) => (
                <div
                  key={index + 1}
                  className="photo-wrapper draggable"
                  draggable
                  onDragStart={() => handleDragStart(index + 1)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index + 1)}
                  onClick={() => setActiveModalIndex(index + 1)}
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid #eee',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(index + 1);
                    }}
                    className="delete-button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <input name="title" placeholder="Title" value={form.title} onChange={handleInput} style={inputStyle} />
          <input name="brand" placeholder="Brand" value={form.brand} onChange={handleInput} style={inputStyle} />
          <input name="category" placeholder="Category" value={form.category} onChange={handleInput} style={inputStyle} />
          <input name="size" placeholder="Size" value={form.size} onChange={handleInput} style={inputStyle} />
          <input name="color" placeholder="Color" value={form.color} onChange={handleInput} style={inputStyle} />
          <select name="condition" value={form.condition} onChange={handleInput} style={inputStyle}>
            <option value="">Select Condition</option>
            <option value="New with tags">New with tags</option>
            <option value="New without tags">New without tags</option>
            <option value="New with imperfections">New with imperfections</option>
            <option value="Pre-owned - Excellent">Pre-owned - Excellent</option>
            <option value="Pre-owned - Good">Pre-owned - Good</option>
            <option value="Pre-owned - Fair">Pre-owned - Fair</option>
          </select>
          <input
            name="price"
            type="number"
            placeholder="Price (DT)"
            value={form.price}
            onChange={handleInput}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
          <textarea
            name="description"
            placeholder="Describe your item..."
            value={form.description}
            onChange={handleInput}
            rows={5}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#f97316',
            color: '#fff',
            padding: '0.7rem 1.6rem',
            border: 'none',
            borderRadius: '999px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          List Now
        </button>
      </form>

      {/* Modal */}
      {activeModalIndex !== null && (
  <PhotoEditModal
    file={photos[activeModalIndex]}
    onCancel={() => setActiveModalIndex(null)}
    onSetMain={() => handleSetMain(activeModalIndex)}
    onSaveCropped={(blob) => handleSaveCropped(activeModalIndex, blob)}
  />
)}


      <style>{`
        .delete-button {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #e11d48;
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          cursor: pointer;
          display: none;
        }
        .photo-wrapper:hover .delete-button {
          display: block;
        }
        .draggable:active {
          cursor: grabbing !important;
        }
      `}</style>
    </div>
  );
};

export default Sell;
