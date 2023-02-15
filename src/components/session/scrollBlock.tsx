import { useCallback } from 'react';

export function useBodyScrollLock() {

    const lockScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';

    }, []);

    const openScroll = useCallback(() => {
    document.body.style.removeProperty('overflow');
    document.body.style.position = '';
    }, []);

    return { lockScroll, openScroll };
}