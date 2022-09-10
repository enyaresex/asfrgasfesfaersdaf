import classNames from 'classnames';
import Link from 'next/link';
import qs from 'qs';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSWRInfinite } from 'swr';
import { RegionContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import EmptyStateDisplay from '../EmptyStateDisplay';
import LeaderboardCard from '../LeaderboardTournamentCard';
import styles from './LeaderboardTournamentCardList.module.css';

type Pagination = {
  next: null | string,
  previous: null | string,
  results: Leaderboard[],
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  hideIfEmpty?: boolean,
  includeStatuses?: LeaderboardTournamentStatus[],
  isPaginationEnabled?: boolean,
  title?: string,
  viewAllLinkHref?: string,
}>;

export default function LeaderboardTournamentCardList({
  className,
  hideIfEmpty = false,
  includeStatuses = [],
  isPaginationEnabled = true,
  title,
  viewAllLinkHref,
  ...props
}: Props) {
  const intl = useIntl();
  const { region } = useContext(RegionContext);
  const { data, size, setSize } = useSWRInfinite<Pagination>((pageIndex, previousPageData) => {
    if (pageIndex === 0 || previousPageData === null || previousPageData.next === null) {
      return `/tournaments/leaderboards/?region=${region.id}&${qs.stringify({ status: includeStatuses },
        { indices: false })}`;
    }

    return new URL(previousPageData.next).pathname + new URL(previousPageData.next).search;
  });

  const leaderboards = useMemo(() => (data === undefined
    ? null
    : (data.map((d) => d.results).flat() as Leaderboard[])), [data]);

  return (data === undefined || leaderboards === null) ? <ActivityIndicator /> : (
    <>
      {leaderboards.length === 0 && hideIfEmpty ? null : (
        <section {...props} className={classNames(styles.leaderboardTournamentCardList, className)}>

          {leaderboards.length === 0 ? (
            <EmptyStateDisplay
              kind="noTournament"
              message={intl.formatMessage({ defaultMessage: 'There are no tournaments yet.' })}
            />
          ) : (
            <>
              {(title !== '' || viewAllLinkHref) && (
                <div className={styles.header}>
                  {title && (
                    <h3>
                      {title}
                      {' '}
                      <span className={styles.tournamentCount}>{`(${leaderboards.length})`}</span>
                    </h3>
                  )}

                  {viewAllLinkHref && (
                    <Link href={`${viewAllLinkHref}`}>
                      <a className={styles.viewAll}>
                        <FormattedMessage defaultMessage="View All" />
                      </a>
                    </Link>
                  )}
                </div>
              )}

              <div className={styles.list}>
                {leaderboards.map((l) => <LeaderboardCard key={l.id} leaderboard={l} />)}
              </div>

              {isPaginationEnabled && data.slice(-1)[0].next !== null && (
                <div className={styles.showMoreButtonWrapper}>
                  <Button
                    className={styles.submit}
                    fullWidth
                    onClick={() => setSize(size + 1)}
                    size="large"
                    type="button"
                    variant="secondary"
                  >
                    <FormattedMessage defaultMessage="Show More" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </>
  );
}
