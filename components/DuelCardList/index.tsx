import classNames from 'classnames';
import Link from 'next/link';
import qs from 'qs';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSWRInfinite } from 'swr';
import { RegionContext } from '../../contexts';
import { hydrateDuel } from '../../helpers';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import DuelCard from '../DuelCard';
import EmptyStateDisplay from '../EmptyStateDisplay';
import styles from './DuelCardList.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  cardsPerRow?: 2 | 3,
  emptyStatus?: string,
  excludeStatus?: DuelStatus[],
  excludeUsers?: number[] | null,
  expand?: boolean,
  game?: number | null,
  gameMode?: number | null,
  hideIfEmpty?: boolean,
  includeStatus?: DuelStatus[],
  includeUsers?: number[] | null,
  isPaginationEnabled?: boolean,
  leaderboard?: number | null,
  platform?: number | null,
  ordering?: DuelFilterOrdering,
  title?: string,
  viewAll?: boolean,
}>;

type Pagination = {
  next: null | string,
  previous: null | string,
  results: Duel[],
};

export default function DuelCardList({
  cardsPerRow,
  className,
  emptyStatus,
  excludeStatus = [],
  excludeUsers = null,
  expand = false,
  game,
  gameMode,
  hideIfEmpty = true,
  includeStatus = [],
  includeUsers = null,
  isPaginationEnabled = true,
  leaderboard,
  platform,
  ordering,
  title = '',
  viewAll = false,
  ...props
}: Props) {
  const { region } = useContext(RegionContext);

  const gameQuery = useMemo<string>(() => qs.stringify({
    game_mode: gameMode,
    game_mode__game: game,
    game_mode__platform: platform,
    leaderboard,
    ordering,
    region: region.id,
  }), [game, gameMode, leaderboard, platform, region, ordering]);

  const endpoint = useMemo<string>(() => {
    const queries: { key: string, value: number[] | string[] | null }[] = [{
      key: 'status',
      value: includeStatus,
    }, {
      key: 'status_exclude',
      value: excludeStatus,
    }, {
      key: 'user',
      value: includeUsers,
    }, {
      key: 'user_exclude',
      value: excludeUsers,
    }];

    let query = queries.reduce((acc, curr) => ((curr.value === null || curr.value.length === 0)
      ? acc
      : `${acc}&${qs.stringify({ [curr.key]: curr.value }, { indices: false })}`), '');

    query += `&${gameQuery}`;

    return `/duels/?${query}`;
  }, [excludeStatus, excludeUsers, gameQuery, includeStatus, includeUsers]);

  const { data, size, setSize } = useSWRInfinite<Pagination>((pageIndex, previousPageData) => {
    if (pageIndex === 0 || previousPageData === null || previousPageData.next === null) return endpoint;

    return new URL(previousPageData.next).pathname + new URL(previousPageData.next).search;
  });

  const duels = useMemo(() => (data === undefined
    ? null
    : (data.map((d) => d.results).flat() as Duel[]).map((d) => hydrateDuel(d))), [data]);

  return data === undefined || duels === null ? <ActivityIndicator /> : (
    <>
      {duels.length === 0 && hideIfEmpty ? null
        : (
          <>
            {duels.length === 0 ? (
              <section
                {...props}
                className={classNames(styles.duelCardList, className)}
              >
                <EmptyStateDisplay kind="noDuel" message={emptyStatus} />
              </section>
            ) : (
              (
                <section
                  {...props}
                  className={classNames(
                    styles.duelCardList,
                    cardsPerRow !== undefined && styles[`display-${cardsPerRow}`],
                    className,
                  )}
                >

                  {(title !== '' || viewAll) && (
                    <div className={styles.header}>
                      {title && (
                        <h3>
                          {title}
                          {' '}
                          <span className={styles.duelCount}>{`(${duels.length})`}</span>
                        </h3>
                      )}

                      {viewAll && (
                        <Link href="/">
                          <a className={styles.viewAll}>
                            <FormattedMessage defaultMessage="View All" />
                          </a>
                        </Link>
                      )}
                    </div>
                  )}

                  <div className={classNames(styles.cards)}>
                    {duels.map((d) => (
                      <DuelCard
                        duel={d}
                        expand={expand}
                        key={d.id}
                      />
                    ))}
                  </div>

                  {isPaginationEnabled && data.slice(-1)[0].next !== null && (
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
                </section>
              )
            )}
          </>
        )}
    </>
  );
}
