import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './LeaderboardTournamentDescription.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  leaderboard: Leaderboard,
}>;

export default function LeaderboardTournamentDescription({ className, leaderboard, ...props }: Props) {
  return leaderboard.description === '' ? null : (
    <section {...props} className={classNames(styles.leaderboardTournamentDescription, className)}>
      <div className={styles.header}>
        <h4><FormattedMessage defaultMessage="Description" /></h4>
      </div>

      <div className={styles.body}>
        {leaderboard.description}
      </div>
    </section>
  );
}
