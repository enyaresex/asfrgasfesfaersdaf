import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import styles from './ChatCannedResponses.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  onClick: (content: string) => void,
}>;

export default function ChatCannedResponses({ className, onClick, ...props }: Props) {
  const intl = useIntl();

  const cannedResponses = useMemo<string[]>(() => [
    '👋',
    '👊',
    '😎',
    intl.formatMessage({ defaultMessage: 'Are you there?' }),
    intl.formatMessage({ defaultMessage: 'Yes' }),
    intl.formatMessage({ defaultMessage: 'No' }),
  ], [intl]);

  return (
    <div {...props} className={classNames(styles.cannedResponses, className)}>
      <div className={styles.buttons}>
        {cannedResponses.map((c, i) => (
          <button
            className={classNames(styles.button, i < 3 && styles.emoji)}
            key={c}
            onClick={() => onClick(c)}
            type="button"
          >
            <div className={styles.buttonContent}>{c}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
