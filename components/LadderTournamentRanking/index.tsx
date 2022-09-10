import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSWRInfinite } from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import EmptyStateDisplay from '../EmptyStateDisplay';
import LadderTournamentRankingList from '../LadderTournamentRankingList';
import LadderTournamentTopRank from '../LadderTournamentTopRank';
import styles from './LadderTournamentRanking.module.css';

type Pagination = {
  next: null | string,
  previous: null | string,
  results: LadderEntry[],
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  ladder: Ladder,
}>;

export default function LadderTournamentRanking({ className, ladder, ...props }: Props) {
  const intl = useIntl();
  const { data, size, setSize } = useSWRInfinite<Pagination>((pageIndex, previousPageData) => {
    if (pageIndex === 0 || previousPageData === null || previousPageData.next === null) {
      return `/tournaments/ladder_entries/?ladder=${ladder.id}`;
    }

    return new URL(previousPageData.next).pathname + new URL(previousPageData.next).search;
  });

  const entries = useMemo<LadderEntry[] | null>(() => (data === undefined
    ? null
    : (data.map((d) => d.results).flat() as LadderEntry[])), [data]);

  return entries === null || data === undefined ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.ladderTournamentRanking, className)}>
      {entries.length === 0 ? (
        <EmptyStateDisplay
          kind="noTournamentRank"
          message={intl.formatMessage({ defaultMessage: 'There is no any rankings yet' })}
        />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.topRanks}>
            {entries.slice(0, 3).map((e, i) => (
              <LadderTournamentTopRank
                entry={e}
                key={e.id}
                ladder={ladder}
                rank={i}
              />
            ))}
          </div>

          <div className={styles.ranks}>
            <div className={styles.header}>
              <h4><FormattedMessage defaultMessage="Ladder Rankings" /></h4>
            </div>

            <div className={styles.body}>
              <LadderTournamentRankingList
                entries={entries}
                ladder={ladder}
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
