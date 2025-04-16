import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import getCroppedImg from './utils/cropImage';
import './styles/reactCropCustom.css';

const PhotoEditModal = ({ file, onCancel, onSetMain, onSaveCropped }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspectLocked, setAspectLocked] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgDims, setImgDims] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImgSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const getInitialCrop = (width, height, aspect) => {
    if (aspect) {
      const size = Math.min(width, height);
      return {
        unit: 'px',
        x: (width - size) / 2,
        y: (height - size) / 2,
        width: size,
        height: size,
        aspect: 1,
      };
    }
    return {
      unit: 'px',
      x: 0,
      y: 0,
      width,
      height,
    };
  };

  const onImageLoad = (e) => {
    const img = e.currentTarget;
    const { naturalWidth: width, naturalHeight: height } = img;
    setImgDims({ width, height });
    setCrop(getInitialCrop(width, height, aspectLocked));
  };

  // Apply updated crop immediately when aspect lock changes
  useLayoutEffect(() => {
    if (imgDims) {
        setCrop(getInitialCrop(imgDims.width, imgDims.height, aspectLocked));
    }
  }, [aspectLocked, imgDims]);

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) return;
    const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
    onSaveCropped(croppedBlob);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {imgSrc && (
          <div style={styles.cropContainer}>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectLocked ? 1 : undefined}
              minWidth={10}
              keepSelection
              ruleOfThirds
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="To crop"
                onLoad={onImageLoad}
                style={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </ReactCrop>
          </div>
        )}

        <div style={styles.aspectToggle}>
          <label>
            <input
              type="checkbox"
              checked={aspectLocked}
              onChange={(e) => setAspectLocked(e.target.checked)}
            />
            Lock aspect ratio (square)
          </label>
        </div>

        <div style={styles.buttonRow}>
          <button onClick={onCancel} style={styles.cancelButton}>Cancel</button>
          <button onClick={onSetMain} style={styles.mainButton}>Set as Main</button>
          <button onClick={handleSave} style={styles.saveButton}>Save Crop</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modal: {
    background: '#fff',
    padding: '1rem',
    borderRadius: '12px',
    width: '90vw',
    maxWidth: '700px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cropContainer: {
    flex: 1,
    background: '#333',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  aspectToggle: {
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  cancelButton: {
    flex: 1,
    background: '#eee',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '0.5rem',
    cursor: 'pointer',
  },
  mainButton: {
    flex: 1,
    background: '#0ea5e9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem',
    cursor: 'pointer',
  },
  saveButton: {
    flex: 1,
    background: '#f97316',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default PhotoEditModal;

