import classNames from 'classnames';
import React from 'react';
import { FormGroupContext, FormGroupContextValue } from '../../contexts';
import styles from './FormGroup.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, FormGroupContextValue>;

function FormGroup({
  children,
  className,
  error,
  ...props
}: Props, ref: React.Ref<HTMLDivElement>) {
  return (
    <FormGroupContext.Provider value={{ error }}>
      <div
        {...props}
        className={classNames(
          styles.formGroup,
          error !== undefined && styles.hasError,
          className,
        )}
        ref={ref}
      >
        {children}

        {error !== undefined && (
          <div className={classNames(styles.message, styles.error)}>
            {error.map((e) => (
              <p key={e.toString()}>{e}</p>
            ))}
          </div>
        )}
      </div>
    </FormGroupContext.Provider>
  );
}

export default React.forwardRef(FormGroup);
