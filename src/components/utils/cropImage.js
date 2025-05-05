const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.setAttribute('crossOrigin', 'anonymous'); // Needed to avoid CORS issues
    img.src = url;
  });

const getCroppedImg = async (imageSrc, crop, zoom = 1, aspect = 1) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const pixelCropX = crop.x * scaleX;
  const pixelCropY = crop.y * scaleY;
  const pixelCropWidth = crop.width * scaleX;
  const pixelCropHeight = crop.height * scaleY;

  canvas.width = pixelCropWidth;
  canvas.height = pixelCropHeight;

  ctx.drawImage(
    image,
    pixelCropX,
    pixelCropY,
    pixelCropWidth,
    pixelCropHeight,
    0,
    0,
    pixelCropWidth,
    pixelCropHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg');
  });
};

export default getCroppedImg;
