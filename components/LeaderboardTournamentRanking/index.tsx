import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSWRInfinite } from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import EmptyStateDisplay from '../EmptyStateDisplay';
import LeaderboardTournamentRankingList from '../LeaderboardTournamentRankingList';
import LeaderboardTournamentTopRank from '../LeaderboardTournamentTopRank';
import styles from './LeaderboardTournamentRanking.module.css';

type Pagination = {
  next: null | string,
  previous: null | string,
  results: LeaderboardEntry[],
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  leaderboard: Leaderboard,
}>;

export default function LeaderboardTournamentRanking({ className, leaderboard, ...props }: Props) {
  const intl = useIntl();
  const { data, size, setSize } = useSWRInfinite<Pagination>((pageIndex, previousPageData) => {
    if (pageIndex === 0 || previousPageData === null || previousPageData.next === null) {
      return `/tournaments/leaderboard_entries/?leaderboard=${leaderboard.id}`;
    }

    return new URL(previousPageData.next).pathname + new URL(previousPageData.next).search;
  });

  const entries = useMemo<LeaderboardEntry[] | null>(() => (data === undefined
    ? null
    : (data.map((d) => d.results).flat() as LeaderboardEntry[])), [data]);

  return entries === null || data === undefined ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.leaderboardTournamentRanking, className)}>
      {entries.length === 0 ? (
        <EmptyStateDisplay
          kind="noTournamentRank"
          message={intl.formatMessage({ defaultMessage: 'There is no any rankings yet' })}
        />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.topRanks}>
            {entries.slice(0, 3).map((e, i) => (
              <LeaderboardTournamentTopRank
                entry={e}
                key={e.id}
                leaderboard={leaderboard}
                rank={i}
              />
            ))}
          </div>

          <div className={styles.ranks}>
            <div className={styles.header}>
              <h4><FormattedMessage defaultMessage="Leaderboard Rankings" /></h4>
            </div>

            <div className={styles.body}>
              <LeaderboardTournamentRankingList
                entries={entries}
                leaderboard={leaderboard}
              />
            </div>
          </div>

          {data.slice(-1)[0].next !== null && (
            <div className={styles.showMoreButtonWrapper}>
              <Button
                className={styles.submit}
                onClick={() => setSize(size + 1)}
                size="large"
                type="button"
                variant="secondary"
              >
                <FormattedMessage defaultMessage="Show More" />
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
