import React, { useState } from 'react';
import ImageEditorModal from './ImageEditorModal';

const ParentComponent = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setShowEditor(true);
    }
  };

  const closeEditor = () => {
    setShowEditor(false);
    setSelectedImage(null); // ✅ optional: clears state for next session
  };

  const saveAndClose = (blob) => {
    setFinalImage(blob);
    closeEditor();
  };

  return (
    <div style={styles.container}>
      <h2>Test Image Editor</h2>
      <input type="file" accept="image/*" onChange={handleImageSelect} />

      {finalImage && (
        <div style={styles.result}>
          <h4>Edited Image:</h4>
          <img
            src={URL.createObjectURL(finalImage)}
            alt="Edited"
            style={{ maxWidth: '300px', borderRadius: '8px' }}
          />
        </div>
      )}

      {showEditor && selectedImage && (
        <ImageEditorModal
          file={selectedImage}
          onClose={closeEditor}
          onSave={saveAndClose}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  result: {
    marginTop: '1rem',
  },
};

export default ParentComponent;
