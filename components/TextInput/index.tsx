import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { FormGroupContext } from '../../contexts';
import BoxLabel from '../BoxLabel';
import styles from './TextInput.module.css';

export type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['input']>, {
  id: string,
  label?: React.ReactNode,
  size?: FormComponentSize,
  customClasses?: string,
}>;

const sizeStyles: Record<FormComponentSize, string> = {
  large: styles.sizeLarge,
  medium: styles.sizeMedium,
  small: styles.sizeSmall,
};

function TextInput({
  className,
  id,
  label,
  onBlur,
  onFocus,
  size = 'medium',
  placeholder,
  value,
  customClasses,
  ...props
}: Props, ref: React.Ref<HTMLDivElement>) {
  const { error } = useContext(FormGroupContext);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div
      className={classNames(
        styles.textInput,
        sizeStyles[size],
        error && styles.hasError,
        label === undefined && styles.noLabel,
        className,
      )}
      ref={ref}
    >
      {label && (
        <BoxLabel
          htmlFor={id}
          onTop={placeholder !== undefined || isFocused || value !== ''}
          size={size}
        >
          {label}
        </BoxLabel>
      )}

      <input
        className={classNames(styles.input, label && styles.withLabel, customClasses && customClasses)}
        id={id}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur !== undefined && onBlur(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus !== undefined && onFocus(event);
        }}
        placeholder={placeholder}
        value={value}
        {...props}
      />
    </div>
  );
}

export default React.forwardRef(TextInput);
