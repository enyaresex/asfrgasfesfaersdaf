import classNames from 'classnames';
import React from 'react';
import styles from './ActivityIndicator.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  takeOver?: boolean,
  flex?: boolean,
}>

export default function ActivityIndicator({ className, flex, takeOver, ...props }: Props) {
  return (
    <div
      {...props}
      className={classNames(
        styles.activityIndicator,
        flex && styles.flex,
        takeOver && styles.takeOver,
        className,
      )}
    >
      <div className={styles.wrapper}>
        <span className={styles.inner} />
      </div>
    </div>
  );
}
