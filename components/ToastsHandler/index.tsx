import uniqueId from 'lodash/uniqueId';
import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ToastsContext } from '../../contexts';
import Container from '../Container';
import Toast from '../Toast';
import styles from './ToastsHandler.module.css';

type Props = {
  children: React.ReactNode,
};

export default function ToastsHandler({ children }: Props) {
  const timeouts = useRef<Record<string, number>>({});
  const [toasts, setToasts] = useState<KeyedToast[]>([]);

  const destroyToast = (key: string) => {
    setToasts((ts) => ts.filter((t) => t.key !== key));

    const { [key]: _, ...newTimeouts } = timeouts.current;

    timeouts.current = newTimeouts;
  };

  useEffect(() => {
    toasts.filter((t) => !t.isPersistent).forEach((t) => {
      if (!(t.key in timeouts.current)) {
        timeouts.current = {
          ...timeouts.current,
          [t.key]: window.setTimeout(() => destroyToast(t.key), 3000),
        };
      }
    });
  }, [toasts]);

  return (
    <ToastsContext.Provider
      value={{
        addToast: (toast: Toast) => {
          setToasts((previousToasts) => {
            const key = uniqueId('toast-');

            const newToast = { ...toast, key };

            return toast.isPersistent
              ? [newToast, ...previousToasts]
              : [...previousToasts, newToast];
          });
        },
        toasts,
      }}
    >
      <div className={styles.toastsHandler}>
        <Container>
          <TransitionGroup>
            {toasts.map((t) => (
              <CSSTransition key={t.key} timeout={300}>
                <Toast
                  className={styles.toast}
                  onDismiss={() => destroyToast(t.key)}
                  onMouseEnter={() => {
                    const { [t.key]: toastTimeout, ...newTimeouts } = timeouts.current;

                    window.clearTimeout(toastTimeout);

                    timeouts.current = newTimeouts;
                  }}
                  onMouseLeave={() => {
                    if (!(t.key in timeouts.current)) {
                      timeouts.current = {
                        ...timeouts.current,
                        [t.key]: window.setTimeout(() => {
                          setToasts(toasts.filter((t2) => t2.key !== t.key));
                        }, 3000),
                      };
                    }
                  }}
                  toast={t}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </Container>
      </div>

      {children}
    </ToastsContext.Provider>
  );
}
