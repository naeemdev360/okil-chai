import { useCallback, useEffect, useState } from 'react';
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined')
            return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : initialValue;
        }
        catch {
            return initialValue;
        }
    });
    const setValue = useCallback((value) => {
        setStoredValue((prev) => {
            const nextValue = value instanceof Function ? value(prev) : value;
            try {
                window.localStorage.setItem(key, JSON.stringify(nextValue));
            }
            catch {
                // Storage quota exceeded or private browsing — fail silently
            }
            return nextValue;
        });
    }, [key]);
    const removeValue = useCallback(() => {
        setStoredValue(initialValue);
        try {
            window.localStorage.removeItem(key);
        }
        catch {
            // Ignore
        }
    }, [key, initialValue]);
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key !== key)
                return;
            try {
                const newValue = event.newValue !== null ? JSON.parse(event.newValue) : initialValue;
                setStoredValue(newValue);
            }
            catch {
                // Ignore parse errors from other tabs
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, initialValue]);
    return [storedValue, setValue, removeValue];
}
