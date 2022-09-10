import classNames from 'classnames';
import React, { useState } from 'react';
import BoxLabel from '../BoxLabel';
import styles from './Select.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['select']>, {
  id: string,
  label?: React.ReactNode,
  size?: FormComponentSize,
}>;

const sizeStyles: Record<FormComponentSize, string> = {
  large: styles.sizeLarge,
  medium: styles.sizeMedium,
  small: styles.sizeSmall,
};

function Select({
  className,
  id,
  label,
  onBlur,
  onFocus,
  size = 'medium',
  value,
  ...props
}: Props, ref: React.Ref<HTMLDivElement>) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div
      className={classNames(
        styles.select,
        label !== undefined && styles.withLabel,
        sizeStyles[size],
        className,
      )}
      ref={ref}
    >
      {label !== undefined && (
        <BoxLabel
          htmlFor={id}
          onTop={isFocused || value !== ''}
          size={size}
        >
          {label}
        </BoxLabel>
      )}

      <select
        {...props}
        className={styles.actualSelect}
        id={id}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur && onBlur(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus && onFocus(event);
        }}
        value={value}
      />
    </div>
  );
}

export default React.forwardRef(Select);
