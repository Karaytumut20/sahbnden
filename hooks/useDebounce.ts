import { useEffect, useState } from 'react';

/**
 * Bu hook, hızlı değişen değerleri (örn: search input) geciktirerek
 * sunucuya giden istek sayısını azaltır. (Rate Limiting optimization)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Belirlenen süre (delay) kadar bekle
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Eğer süre dolmadan değer tekrar değişirse sayacı sıfırla
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}