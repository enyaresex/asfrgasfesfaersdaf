import React, { useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './BackgroundShade.module.css';

type Props = {
  isVisible: boolean,
};

export default function BackgroundShade({ isVisible }: Props) {
  useEffect(() => {
    const hasShadeClassName = 'has-background-shade';

    if (isVisible) {
      document.body.classList.add(hasShadeClassName);
    } else {
      document.body.classList.remove(hasShadeClassName);
    }

    return () => {
      document.body.classList.remove(hasShadeClassName);
    };
  }, [isVisible]);

  return (
    <TransitionGroup component={null}>
      {isVisible && (
        <CSSTransition timeout={150} unmountOnExit>
          <div className={styles.backgroundShade} />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}
