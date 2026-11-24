import { ChangeEvent, DragEvent, KeyboardEvent, useRef, useState } from 'react';

interface UseImageSlotsOptions {
  maxCount: number;
  initialImages: (string | null)[];
  initialFeaturedIndex: number;
  prepareFile?: (file: File) => Promise<File>;
}

const reorder = <T>(list: T[], from: number, to: number) => {
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

const removeAndCompact = <T>(list: (T | null)[], index: number) => {
  const next = [...list];
  next.splice(index, 1);
  next.push(null);
  return next;
};

const useImageSlots = ({ maxCount, initialImages, initialFeaturedIndex, prepareFile }: UseImageSlotsOptions) => {
  const [images, setImages] = useState<(string | null)[]>(initialImages);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(() => Array(maxCount).fill(null));
  const [featuredIndex, setFeaturedIndex] = useState(initialFeaturedIndex);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // 갤러리처럼 파일 변환을 기다리는 동안 다른 선택·삭제가 끼어들 수 있어, 칸 배정은 항상 최신 상태를 기준으로 한다
  const slotsRef = useRef({ images, imageFiles });
  const commitSlots = (nextImages: (string | null)[], nextImageFiles: (File | null)[]) => {
    slotsRef.current = { images: nextImages, imageFiles: nextImageFiles };
    setImages(nextImages);
    setImageFiles(nextImageFiles);
  };

  const addFiles = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, maxCount);
    event.target.value = '';
    if (files.length === 0) return;

    const preparedFiles = prepareFile ? await Promise.all(files.map(prepareFile)) : files;

    const { images: currentImages, imageFiles: currentFiles } = slotsRef.current;
    const hadNoImages = currentImages.every((image) => image === null);
    const nextImages = [...currentImages];
    const nextImageFiles = [...currentFiles];
    let firstFilledIndex: number | null = null;
    let cursor = index;
    for (const file of preparedFiles) {
      while (cursor < maxCount && nextImages[cursor] !== null) cursor++;
      if (cursor >= maxCount) break;
      nextImages[cursor] = URL.createObjectURL(file);
      nextImageFiles[cursor] = file;
      firstFilledIndex ??= cursor;
      cursor++;
    }
    if (firstFilledIndex === null) return;

    commitSlots(nextImages, nextImageFiles);
    if (hadNoImages) setFeaturedIndex(firstFilledIndex);
  };

  const removeImage = (index: number) => {
    const { images: currentImages, imageFiles: currentFiles } = slotsRef.current;
    const removed = currentImages[index];
    if (removed) URL.revokeObjectURL(removed);

    const nextImages = removeAndCompact(currentImages, index);
    commitSlots(nextImages, removeAndCompact(currentFiles, index));
    setFeaturedIndex((prev) => {
      if (prev < index) return prev;
      if (prev > index) return prev - 1;
      const fallback = nextImages.findIndex((image) => image !== null);
      return fallback === -1 ? 0 : fallback;
    });
  };

  const moveImage = (from: number, to: number) => {
    if (from === to) return;
    const { images: currentImages, imageFiles: currentFiles } = slotsRef.current;
    commitSlots(reorder(currentImages, from, to), reorder(currentFiles, from, to));
    setFeaturedIndex((prev) => {
      if (prev === from) return to;
      if (from < prev && prev <= to) return prev - 1;
      if (to <= prev && prev < from) return prev + 1;
      return prev;
    });
  };

  const endDrag = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const thumbnailProps = (index: number) => ({
    onClick: () => setFeaturedIndex(index),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setFeaturedIndex(index);
      }
    },
    draggable: true,
    onDragStart: (event: DragEvent<HTMLElement>) => {
      event.dataTransfer.effectAllowed = 'move';
      // Firefox는 데이터가 설정되어야 드래그를 시작함
      event.dataTransfer.setData('text/plain', String(index));
      setDraggingIndex(index);
    },
    onDragEnd: endDrag,
    onDragOver: (event: DragEvent<HTMLElement>) => {
      if (draggingIndex === null) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      setDragOverIndex(index);
    },
    onDragLeave: () => setDragOverIndex((prev) => (prev === index ? null : prev)),
    onDrop: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      if (draggingIndex !== null) moveImage(draggingIndex, index);
      endDrag();
    },
  });

  return {
    images,
    imageFiles,
    featuredIndex,
    isDragging: (index: number) => draggingIndex === index,
    isDropTarget: (index: number) => dragOverIndex === index && draggingIndex !== index,
    addFiles,
    removeImage,
    thumbnailProps,
  };
};

export default useImageSlots;
