import { useCallback } from 'react';

interface ListItem {
  id: string;
}

const useListItems = <T extends ListItem>(items: T[], onChange: (items: T[]) => void, createItem: () => T) => {
  const updateItem = useCallback(
    (id: string, patch: Partial<T>) => {
      onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    },
    [items, onChange],
  );

  const removeItem = useCallback((id: string) => onChange(items.filter((item) => item.id !== id)), [items, onChange]);

  const addItem = useCallback(() => onChange([...items, createItem()]), [items, onChange, createItem]);

  return { updateItem, removeItem, addItem };
};

export default useListItems;
