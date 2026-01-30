// useDebounce.ts (or just paste inside your component file)
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timer to update the value
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel the timer if the user types again (cleans up previous effect)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}