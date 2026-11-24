import { describe, expect, it } from 'vitest';

import { isAnimatedImage, resizeImageFile } from './resizeImage';

const PNG_SIGNATURE = '\x89PNG\r\n\x1a\n';
const fileOf = (content: string, type: string) =>
  new File([Uint8Array.from(content, (char) => char.charCodeAt(0))], 'image', { type });

describe('isAnimatedImage', () => {
  it('gif는 애니메이션으로 본다', async () => {
    expect(await isAnimatedImage(fileOf('GIF89a', 'image/gif'))).toBe(true);
  });

  it('acTL 청크가 있는 PNG(APNG)를 애니메이션으로 판별한다', async () => {
    expect(await isAnimatedImage(fileOf(`${PNG_SIGNATURE}....IHDR....acTL....IDAT`, 'image/png'))).toBe(true);
    expect(await isAnimatedImage(fileOf(`${PNG_SIGNATURE}....IHDR....IDAT`, 'image/png'))).toBe(false);
  });

  it('ANIM 청크가 있는 WebP를 애니메이션으로 판별한다', async () => {
    expect(await isAnimatedImage(fileOf('RIFF....WEBPVP8X....ANIM....', 'image/webp'))).toBe(true);
    expect(await isAnimatedImage(fileOf('RIFF....WEBPVP8 ....', 'image/webp'))).toBe(false);
  });

  it('JPEG는 애니메이션으로 보지 않는다', async () => {
    expect(await isAnimatedImage(fileOf('\xff\xd8\xff....ANIM', 'image/jpeg'))).toBe(false);
  });
});

describe('resizeImageFile', () => {
  it('애니메이션 이미지는 변환하지 않고 원본을 그대로 돌려준다', async () => {
    const apng = fileOf(`${PNG_SIGNATURE}....acTL....`, 'image/png');

    expect(await resizeImageFile(apng, 'image/webp')).toBe(apng);
  });
});
