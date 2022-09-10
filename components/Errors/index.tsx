import classNames from 'classnames';
import React from 'react';
import styles from './Errors.module.css';

type TextAlign = 'center' | 'left';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  errors: string[] | undefined,
  textAlign?: TextAlign,
}>;

const textAlignClasses: Record<TextAlign, string> = {
  center: styles.textAlignCenter,
  left: styles.textAlignLeft,
};

export default function Errors({ className, errors, textAlign = 'left', ...props }: Props) {
  return errors === undefined ? null : (
    <div {...props} className={classNames(styles.errors, textAlignClasses[textAlign], className)}>
      {errors.map((e) => <p className={styles.error} key={e}>{e}</p>)}
    </div>
  );
}
