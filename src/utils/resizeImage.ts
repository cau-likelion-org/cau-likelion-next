const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 0.85;

const ANIMATION_MARKERS: Record<string, string> = { 'image/png': 'acTL', 'image/webp': 'ANIM' };
const ANIMATION_SCAN_BYTES = 64 * 1024;

export const isAnimatedImage = async (file: File) => {
  if (file.type === 'image/gif') return true;
  const marker = ANIMATION_MARKERS[file.type];
  if (!marker) return false;
  const head = new TextDecoder('latin1').decode(await file.slice(0, ANIMATION_SCAN_BYTES).arrayBuffer());
  return head.includes(marker);
};

// 애니메이션 이미지(gif, APNG, 움직이는 WebP)는 캔버스를 거치면 첫 프레임만 남으므로 원본을 그대로 사용
export const resizeImageFile = async (
  file: File,
  outputType: string = file.type,
  maxDimension: number = MAX_DIMENSION,
): Promise<File> => {
  if (await isAnimatedImage(file)) return file;
  const isConverting = outputType !== file.type;

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      if (scale === 1 && !isConverting) {
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
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          if (!isConverting) {
            resolve(new File([blob], file.name, { type: file.type }));
            return;
          }
          if (blob.type !== outputType) {
            resolve(resizeImageFile(file, file.type, maxDimension));
            return;
          }
          if (scale === 1 && blob.size >= file.size) {
            resolve(file);
            return;
          }
          const convertedName = `${file.name.replace(/\.[^.]+$/, '')}.${outputType.split('/')[1]}`;
          resolve(new File([blob], convertedName, { type: outputType }));
        },
        outputType,
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
