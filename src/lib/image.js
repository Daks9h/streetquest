/**
 * Image processing utilities for StreetQuest
 * Resizes photos so the longest side is at most 1024px,
 * exports as JPEG with quality 0.8 using an HTML5 Canvas (no external library).
 */

export function validateImageFile(file) {
  if (!file) {
    return 'No file selected.';
  }
  if (!file.type || !file.type.startsWith('image/')) {
    return 'Please select a valid image file (JPEG, PNG, etc.).';
  }
  return null;
}

export function resizeImage(file, maxDimension = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const error = validateImageFile(file);
    if (error) {
      return reject(new Error(error));
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width <= 0 || height <= 0) {
          URL.revokeObjectURL(objectUrl);
          return reject(new Error('Unable to read image dimensions.'));
        }

        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            const scale = maxDimension / width;
            width = maxDimension;
            height = Math.round(height * scale);
          } else {
            const scale = maxDimension / height;
            height = maxDimension;
            width = Math.round(width * scale);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          return reject(new Error('Canvas 2D context unavailable.'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              return reject(new Error('Failed to create JPEG blob from image.'));
            }
            resolve({
              blob,
              width,
              height,
            });
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for processing.'));
    };

    img.src = objectUrl;
  });
}
