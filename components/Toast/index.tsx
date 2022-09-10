import classNames from 'classnames';
import React from 'react';
import { useIntl } from 'react-intl';
import styles from './Toast.module.css';
import { ReactComponent as Check } from './check.svg';
import { ReactComponent as Warning } from './warning.svg';
import { ReactComponent as Close } from './close.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  onDismiss: () => void,
  toast: Toast,
}>;

const kindIcons: Record<Toast['kind'], React.ReactNode> = {
  success: <Check />,
  warning: <Warning />,
};

const kindStyles: Record<Toast['kind'], string> = {
  success: styles.kindSuccess,
  warning: styles.kindWarning,
};

export default function Toast({ className, onDismiss, toast, ...props }: Props) {
  const intl = useIntl();

  return (
    <div
      {...props}
      className={classNames(styles.toast, kindStyles[toast.kind], className)}
    >
      <div className={styles.icon}>
        {kindIcons[toast.kind]}
      </div>

      <p className={styles.content}>{toast.content}</p>

      <div className={styles.separator} />

      <button
        aria-label={intl.formatMessage({ defaultMessage: 'Dismiss' })}
        className={styles.dismissButton}
        onClick={() => onDismiss()}
        type="button"
      >
        <Close />
      </button>
    </div>
  );
}
