const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;

// gif는 캔버스를 거치면 애니메이션이 사라지므로 리사이징하지 않고 원본을 그대로 사용
export const resizeImageFile = (file: File): Promise<File> => {
  if (file.type === 'image/gif') return Promise.resolve(file);

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
      if (scale === 1) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext('2d');
      if (!context) {
        resolve(file);
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], file.name, { type: file.type }) : file),
        file.type,
        JPEG_QUALITY,
      );
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    image.src = objectUrl;
  });
};
