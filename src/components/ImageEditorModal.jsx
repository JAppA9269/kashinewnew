// ImageEditorModal.jsx — Final Version (CropperJS always mounted)
import React, { useState, useRef } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './styles/cropperCustom.css';
import EditToolbar from './EditToolbar';

const ImageEditorModal = ({ file, onClose, onSave }) => {
  const [mode, setMode] = useState(null); // crop | rotate | null
  const [originalImage] = useState(file);
  const [editedImage, setEditedImage] = useState(null);
  const imageRef = useRef(null);
  const cropperRef = useRef(null);

  const imageToDisplay = editedImage || originalImage;

  const initializeCropper = () => {
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }
    cropperRef.current = new Cropper(imageRef.current, {
      viewMode: 2,
      dragMode: 'move',
      autoCropArea: 1,
      aspectRatio: NaN,
      responsive: true,
      background: false,
      guides: true,
      highlight: false,
      movable: true,
      zoomable: false,
      scalable: false,
      rotatable: true,
      cropBoxResizable: true,
      cropBoxMovable: true,
      ready() {
        const lines = document.querySelectorAll('.cropper-line');
        lines.forEach((line) => {
          line.style.display = 'block';
          line.style.background = 'white';
          line.style.opacity = '1';
        });
      },
    });
  };

  const handleCropperLoad = () => {
    if (imageRef.current) {
      initializeCropper();
    }
  };

  const handleSaveCrop = () => {
    if (!cropperRef.current) return;
    cropperRef.current.getCroppedCanvas().toBlob((blob) => {
      if (blob) {
        setEditedImage(blob);
        setMode(null);
      }
    }, 'image/jpeg');
  };

  const handleRotate = () => {
    if (cropperRef.current) {
      cropperRef.current.rotate(90);
    }
  };

  const handleDone = () => {
    onSave(editedImage || originalImage);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <button onClick={handleClose} style={styles.closeButton}>✕</button>
          <h3>Edit photo</h3>
        </div>

        <div style={styles.imageArea}>
          <img
            ref={imageRef}
            src={URL.createObjectURL(imageToDisplay)}
            onLoad={handleCropperLoad}
            alt="To edit"
            style={styles.previewImage}
          />
        </div>

        <EditToolbar
          onSelectTool={(tool) => {
            if (tool === 'rotate') handleRotate();
            else setMode(mode === tool ? null : tool);
          }}
          activeMode={mode}
        />

        <div style={styles.footer}>
          {mode === 'crop' ? (
            <>
              <button onClick={() => setMode(null)} style={styles.cancelButton}>Cancel</button>
              <button onClick={handleSaveCrop} style={styles.doneButton}>Save Crop</button>
            </>
          ) : (
            <>
              <button onClick={handleClose} style={styles.cancelButton}>Cancel</button>
              <button onClick={handleDone} style={styles.doneButton}>Done</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    width: '90vw',
    maxWidth: '700px',
    maxHeight: '90vh',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '1rem',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    background: 'transparent',
    fontSize: '1.2rem',
    border: 'none',
    cursor: 'pointer',
  },
  imageArea: {
    height: 'calc(100vh - 250px)',
    maxHeight: '80vh',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  cancelButton: {
    background: '#eee',
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  doneButton: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default ImageEditorModal;
