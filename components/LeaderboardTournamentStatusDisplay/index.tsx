import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './LeaderboardTournamentStatusDisplay.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['p']>, {
  leaderboardStatus: LeaderboardTournamentStatus,
  size?: Size;
}>;

type Size = 'large' | 'small';

const sizeStyles: Record<Size, string> = {
  large: styles.sizeLarge,
  small: styles.sizeSmall,
};

export default function LeaderboardTournamentStatusDisplay({
  className,
  leaderboardStatus,
  size = 'small',
  ...props
}: Props) {
  const statusDetails = useMemo<Record<LeaderboardTournamentStatus, React.ReactNode>>(() => ({
    FINISHED: <FormattedMessage defaultMessage="Finished" />,
    FUTURE: <FormattedMessage defaultMessage="Future" />,
    IN_PROGRESS: <FormattedMessage defaultMessage="Ongoing" />,
    IN_REVIEW: <FormattedMessage defaultMessage="In Review" />,
    PAUSED: <FormattedMessage defaultMessage="Paused" />,
  }), [leaderboardStatus]);

  return (
    <p
      {...props}
      className={classNames(
        styles.leaderboardTournamentStatusDisplay,
        styles[leaderboardStatus],
        sizeStyles[size],
        className,
      )}
    >
      {statusDetails[leaderboardStatus]}
    </p>
  );
}
