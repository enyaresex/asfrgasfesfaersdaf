import classNames from 'classnames';
import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { BreakpointContext } from '../../contexts';
import LeaderboardTournamentRank from '../LeaderboardTournamentRank';
import styles from './LeaderboardTournamentRankingList.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  entries: LeaderboardEntry[],
  leaderboard: Leaderboard,
}>;

export default function LeaderboardTournamentRankingList({
  className,
  entries,
  leaderboard,
  ...props
}: Props) {
  const intl = useIntl();
  const { breakpoint, device } = useContext(BreakpointContext);

  return (
    <div
      {...props}
      className={classNames(styles.leaderboardTournamentRankingList, className)}
    >
      <table className={styles.table}>
        <thead>
          <tr>
            {device === 'desktop' && (
              <th aria-label={intl.formatMessage({ defaultMessage: 'Trophy' })} />
            )}

            <th aria-label={intl.formatMessage({ defaultMessage: 'Rank' })}>
              <FormattedMessage defaultMessage="Rank" />
            </th>

            <th
              aria-label={intl.formatMessage({ defaultMessage: 'Username' })}
              colSpan={breakpoint === 'xs' ? 1 : 4}
            >
              <FormattedMessage defaultMessage="Username" />
            </th>

            <th aria-label={intl.formatMessage({ defaultMessage: 'Win' })}>
              <FormattedMessage defaultMessage="Win" />
            </th>

            <th aria-label={intl.formatMessage({ defaultMessage: 'Lose' })}>
              <FormattedMessage defaultMessage="Lose" />
            </th>

            <th
              aria-label={intl.formatMessage({ defaultMessage: 'Reward' })}
              colSpan={breakpoint === 'xs' ? 1 : 2}
            >
              <FormattedMessage defaultMessage="Reward" />
            </th>
          </tr>
        </thead>

        <tbody>
          {entries.map((e, i) => (
            <LeaderboardTournamentRank
              entry={e}
              key={e.id}
              leaderboard={leaderboard}
              rank={i}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
