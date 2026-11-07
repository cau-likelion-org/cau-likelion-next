import { DragEvent, useState } from 'react';

export const moveItem = <T>(items: T[], from: number, to: number) => {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

// 핸들을 누른 항목만 드래그되게 해, 항목 안 입력칸에서 글자를 드래그로 선택할 때 항목이 끌려가지 않게 한다
const useDragReorder = <T>(items: T[], onReorder: (items: T[]) => void, disabled = false) => {
  const [armedIndex, setArmedIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const getHandleProps = (index: number) => ({
    onMouseDown: () => {
      if (!disabled) setArmedIndex(index);
    },
    onMouseUp: () => setArmedIndex(null),
  });

  const getItemProps = (index: number) => ({
    draggable: !disabled && armedIndex === index,
    // 문항 카드 안의 선택지처럼 드래그 목록이 겹칠 때 바깥 목록까지 이벤트가 전달되지 않게 한다
    onDragStart: (event: DragEvent) => {
      event.stopPropagation();
      event.dataTransfer.effectAllowed = 'move';
      setDragIndex(index);
    },
    onDragOver: (event: DragEvent) => {
      if (dragIndex === null) return;
      event.preventDefault();
      if (dragIndex === index) return;
      onReorder(moveItem(items, dragIndex, index));
      setDragIndex(index);
    },
    onDrop: (event: DragEvent) => event.preventDefault(),
    onDragEnd: (event: DragEvent) => {
      event.stopPropagation();
      setDragIndex(null);
      setArmedIndex(null);
    },
  });

  return { dragIndex, getHandleProps, getItemProps };
};

export default useDragReorder;
