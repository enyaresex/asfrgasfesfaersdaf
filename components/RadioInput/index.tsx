import classNames from 'classnames';
import React from 'react';
import InlineLabel from '../InlineLabel';
import styles from './RadioInput.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['input']>, {
  alignContentCenter?: boolean,
  hideRadioButton?: boolean,
  id: string,
  label?: React.ReactNode,
}>;

export default function RadioInput({
  alignContentCenter = false,
  checked,
  disabled,
  className,
  hideRadioButton = false,
  id,
  label,
  ...props
}: Props) {
  return (
    <label
      className={classNames(
        styles.radioInput,
        checked && styles.isActive,
        disabled && styles.disabled,
        alignContentCenter && styles.contentCentered,
        hideRadioButton && styles.hideRadioButton,
        className,
      )}
      htmlFor={id}
    >
      <input
        {...props}
        checked={checked}
        className={styles.input}
        disabled={disabled}
        id={id}
        type="radio"
      />

      {label !== undefined && (
        <InlineLabel className={styles.inlineLabel}>
          {label}
        </InlineLabel>
      )}
    </label>
  );
}
