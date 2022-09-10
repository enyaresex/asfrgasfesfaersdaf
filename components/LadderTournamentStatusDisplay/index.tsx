import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './LadderTournamentStatusDisplay.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['p']>, {
  ladderStatus: LadderTournamentStatus,
  size?: Size;
}>;

type Size = 'large' | 'small';

const sizeStyles: Record<Size, string> = {
  large: styles.sizeLarge,
  small: styles.sizeSmall,
};

export default function LadderTournamentStatusDisplay({ className, ladderStatus, size = 'small', ...props }: Props) {
  const statusDetails = useMemo<Record<LadderTournamentStatus, React.ReactNode>>(() => ({
    FINISHED: <FormattedMessage defaultMessage="Finished" />,
    FUTURE: <FormattedMessage defaultMessage="Future" />,
    IN_PROGRESS: <FormattedMessage defaultMessage="Ongoing" />,
    PAUSED: <FormattedMessage defaultMessage="Paused" />,
    REGISTRATION: <FormattedMessage defaultMessage="Registration" />,
  }), [ladderStatus]);

  return (
    <p
      {...props}
      className={classNames(
        styles.ladderTournamentStatusDisplay,
        styles[ladderStatus],
        sizeStyles[size],
        className,
      )}
    >
      {statusDetails[ladderStatus]}
    </p>
  );
}
