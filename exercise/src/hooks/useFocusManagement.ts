import { useCallback, useRef } from 'react';

export const useFocusManagement = () => {
  const focusableRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerRef = useCallback(
    (key: string, element: HTMLElement | null) => {
      if (element) {
        focusableRefs.current.set(key, element);
      } else {
        focusableRefs.current.delete(key);
      }
    },
    [],
  );

  const focusElement = useCallback((key: string) => {
    const element = focusableRefs.current.get(key);
    if (element) {
      element.focus();
      return true;
    }
    return false;
  }, []);

  const focusFirstError = useCallback(
    (errorKeys: string[]) => {
      for (const key of errorKeys) {
        if (focusElement(key)) {
          return;
        }
      }
    },
    [focusElement],
  );

  return { registerRef, focusElement, focusFirstError };
};
