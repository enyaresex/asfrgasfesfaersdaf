import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useClickAway } from 'react-use';
import { useKeyDown } from '../../hooks';
import BackgroundShade from '../BackgroundShade';
import { ReactComponent as Close } from './close.svg';
import styles from './Modal.module.css';

type Size = 'large' | 'regular';

export type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  actions?: React.ReactNode,
  bodyClassName?: string,
  dialogClassName?: string,
  dialogStyle?: React.CSSProperties,
  isOpen: boolean,
  onClose?: () => any,
  size?: Size,
  title?: React.ReactNode,
}>;

const sizeStyle: Record<Size, string> = {
  large: styles.sizeLarge,
  regular: styles.sizeRegular,
};

export default function Modal({
  actions,
  bodyClassName,
  children,
  className,
  dialogClassName,
  dialogStyle,
  isOpen,
  onClose,
  size = 'regular',
  title,
  ...props
}: Props) {
  const dialog = useRef(null);

  function closeIfOpen() {
    if (isOpen && onClose !== undefined) {
      onClose();
    }
  }

  const closeButton = (
    <button className={styles.closeButton} onClick={onClose} type="button">
      <Close />
    </button>
  );

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('with-modal-open');
    } else {
      document.body.classList.remove('has-modal-open');
    }
  }, [isOpen]);

  useClickAway(dialog, closeIfOpen);
  useKeyDown(closeIfOpen, ['escape']);

  return (
    <>
      <BackgroundShade isVisible={isOpen} />

      <TransitionGroup>
        {isOpen && (
          <CSSTransition timeout={300} unmountOnExit>
            <div
              {...props}
              className={classNames(
                styles.modal,
                sizeStyle[size],
                title === undefined && styles.noTitle,
                className,
              )}
            >
              <div className={classNames(styles.dialog, dialogClassName)} ref={dialog} style={dialogStyle}>
                <div className={styles.header}>
                  {onClose !== undefined && closeButton}

                  {title !== undefined && (
                    <h2 className={styles.title}>{title}</h2>
                  )}
                </div>

                <div className={classNames(styles.body, bodyClassName)}>
                  {children}

                  {actions !== undefined && (
                    <div className={styles.actions}>
                      {actions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </>
  );
}
