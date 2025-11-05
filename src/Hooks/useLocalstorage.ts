import { useState, useEffect } from "react";

export default function useLocalStorage<Type>(key: string, initialValue: Type) {
  const [state, setState] = useState<Type>(() => {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as Type) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
    if (typeof window !== "undefined") {
      const event = new Event("local-storage");
      window.dispatchEvent(event);
    }
  }, [key, state]);

  return [state, setState] as const;
}