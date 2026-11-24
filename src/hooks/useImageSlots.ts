import { ChangeEvent, DragEvent, KeyboardEvent, useState } from 'react';

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
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(Array(maxCount).fill(null));
  const [featuredIndex, setFeaturedIndex] = useState(initialFeaturedIndex);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addFiles = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    const hadNoImages = images.every((image) => image === null);

    const targets: { targetIndex: number; file: File }[] = [];
    let cursor = index;
    for (const file of files) {
      while (cursor < maxCount && images[cursor] !== null) cursor++;
      if (cursor >= maxCount) break;
      targets.push({ targetIndex: cursor, file });
      cursor++;
    }
    if (targets.length === 0) return;

    const preparedTargets = prepareFile
      ? await Promise.all(
          targets.map(async ({ targetIndex, file }) => ({ targetIndex, file: await prepareFile(file) })),
        )
      : targets;

    setImages((prev) => {
      const next = [...prev];
      preparedTargets.forEach(({ targetIndex, file }) => {
        if (next[targetIndex]) URL.revokeObjectURL(next[targetIndex] as string);
        next[targetIndex] = URL.createObjectURL(file);
      });
      return next;
    });
    setImageFiles((prev) => {
      const next = [...prev];
      preparedTargets.forEach(({ targetIndex, file }) => {
        next[targetIndex] = file;
      });
      return next;
    });
    if (hadNoImages) setFeaturedIndex(preparedTargets[0].targetIndex);
  };

  const removeImage = (index: number) => {
    const removed = images[index];
    if (removed) URL.revokeObjectURL(removed);

    const nextImages = removeAndCompact(images, index);
    setImages(nextImages);
    setImageFiles((prev) => removeAndCompact(prev, index));
    setFeaturedIndex((prev) => {
      if (prev < index) return prev;
      if (prev > index) return prev - 1;
      const fallback = nextImages.findIndex((image) => image !== null);
      return fallback === -1 ? 0 : fallback;
    });
  };

  const moveImage = (from: number, to: number) => {
    if (from === to) return;
    setImages((prev) => reorder(prev, from, to));
    setImageFiles((prev) => reorder(prev, from, to));
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
