import { useState } from "react";

// Define a generic type for the initial value
type InitialValue<T> = T | (() => T) | undefined;

const useLocalStorage = <T>(
  key: string,
  initialValue?: InitialValue<T>
): [T | undefined, (value: T | undefined) => void] => {
  // Retrieve initial value from localStorage if available, or use initialValue
  const initialStoredValue = (): T | undefined => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      return JSON.parse(storedValue) as T;
    }
    if (typeof initialValue === "function") {
      return (initialValue as () => T)();
    }
    return initialValue;
  };

  // Initialize state to the retrieved value or the initial value
  const [storedValue, setStoredValue] = useState<T | undefined>(
    initialStoredValue()
  );

  // Function to update both state and localStorage
  const setValue = (value: T | undefined) => {
    // Update state
    setStoredValue(value);
    // Update localStorage
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
