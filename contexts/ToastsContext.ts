import { createContext } from 'react';

type ToastsContextValue = {
  addToast: (toast: Toast) => void,
  toasts: KeyedToast[],
};

const ToastsContext = createContext<ToastsContextValue>({} as ToastsContextValue);

export default ToastsContext;
