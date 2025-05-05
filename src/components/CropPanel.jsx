// CropPanel.jsx — CropperJS implementation (eBay style)
import React, { useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './styles/cropperCustom.css'; // Your styling for white border + dots + grid

const CropPanel = ({ image, cropperRef }) => {
  const imageRef = React.useRef(null);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    cropperRef.current = new Cropper(img, {
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
      rotatable: false,
      cropBoxResizable: true,
      cropBoxMovable: true,
      ready() {
        const lines = document.querySelectorAll('.cropper-line');
        lines.forEach((line) => {
          line.style.display = 'block';
          line.style.background = 'white';
          line.style.opacity = '1';
        });
      }
    });

    return () => {
      cropperRef.current?.destroy();
      cropperRef.current = null;
    };
  }, [image, cropperRef]);

  return (
    <div style={styles.container}>
      <div style={styles.cropWrapper}>
        <img
          ref={imageRef}
          src={image instanceof Blob ? URL.createObjectURL(image) : image}
          alt="To crop"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cropWrapper: {
    position: 'relative',
    height: '60vh',
    width: '100%',
    overflow: 'hidden',
    background: '#f9f9f9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default CropPanel;
