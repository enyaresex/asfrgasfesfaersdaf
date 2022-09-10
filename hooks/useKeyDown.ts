import { useEffect } from 'react';

interface Handler {
  (key: string, event: KeyboardEvent): any,
}

export default function useKeyDown(handler: Handler, keys: string[]) {
  const handlerWrapper = (event: KeyboardEvent) => {
    const key = (event.key || 'n/a').toLowerCase();

    if (
      typeof document !== 'undefined'
      && document.activeElement
      && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)
      && keys.includes(key)
    ) {
      handler(key, event);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handlerWrapper);

    return () => document.removeEventListener('keydown', handlerWrapper);
  });
}
