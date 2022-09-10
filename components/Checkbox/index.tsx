import classNames from 'classnames';
import React from 'react';
import InlineLabel from '../InlineLabel';
import styles from './Checkbox.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['input']>, {
  id: string,
  imageRadius?: boolean,
  label?: React.ReactNode,
  labelImage?: string,
}>;

export default function Checkbox({ checked, className, id, imageRadius = true, labelImage, label, ...props }: Props) {
  return (
    <label
      className={classNames(
        styles.checkbox,
        checked && styles.isActive,
        className,
      )}
      htmlFor={id}
    >
      <input
        {...props}
        checked={checked}
        className={styles.input}
        id={id}
        type="checkbox"
      />

      {label !== undefined && (
        <InlineLabel className={styles.inlineLabel} image={labelImage} imageRadius={imageRadius}>
          {label}
        </InlineLabel>
      )}
    </label>
  );
}
