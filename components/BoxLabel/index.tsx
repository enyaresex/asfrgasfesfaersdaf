import classNames from 'classnames';
import React from 'react';
import styles from './BoxLabel.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['label']>, {
  onTop: boolean,
  size: FormComponentSize,
}>;

const sizeStyles: Record<FormComponentSize, string> = {
  large: styles.sizeLarge,
  medium: styles.sizeMedium,
  small: styles.sizeSmall,
};

export default function BoxLabel({ className, onTop, size, ...props }: Props) {
  return (
    <label /* eslint-disable-line jsx-a11y/label-has-associated-control */
      {...props}
      className={classNames(
        styles.boxLabel,
        sizeStyles[size],
        onTop && styles.onTop,
        className,
      )}
    />
  );
}
