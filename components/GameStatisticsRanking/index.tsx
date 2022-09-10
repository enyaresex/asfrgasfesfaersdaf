import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSWRInfinite } from 'swr';
import { BreakpointContext, RegionContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import GameStatisticsRank from '../GameStatisticsRank';
import styles from './GameStatisticsRanking.module.css';

type Pagination = {
  next: null | string,
  previous: null | string,
  results: GameStatistic[],
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  gameId: number,
}>;

export default function GameStatisticsRanking({ className, gameId, ...props }: Props) {
  const { device, breakpoint } = useContext(BreakpointContext);
  const intl = useIntl();
  const { region } = useContext(RegionContext);
  const { data, size, setSize } = useSWRInfinite<Pagination>((pageIndex, previousPageData) => {
    if (pageIndex === 0 || previousPageData === null || previousPageData.next === null) {
      return `/games/user_game_statistics/?game=${gameId}&region=${region.id}`;
    }

    return new URL(previousPageData.next).pathname + new URL(previousPageData.next).search;
  });

  const entries = useMemo<GameStatistic[] | null>(() => (data === undefined
    ? null
    : (data.map((d) => d.results).flat() as GameStatistic[])), [data]);

  return (entries === null || data === undefined) ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.gameStatisticsRanking, className)}>
      {entries.length === 0 ? (
        <div className={styles.isEmpty}>
          <h4><FormattedMessage defaultMessage="There isn't any rankings yet" /></h4>
        </div>
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.tableWrapper}>
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
                    colSpan={breakpoint === 'sm' ? 1 : 4}
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
                    aria-label={intl.formatMessage({ defaultMessage: 'Win Rate' })}
                    colSpan={breakpoint === 'sm' ? 1 : 2}
                  >
                    <FormattedMessage defaultMessage="Win Rate" />
                  </th>
                </tr>
              </thead>

              <tbody>
                {entries.map((e, i) => <GameStatisticsRank entry={e} key={e.id} rank={i} />)}
              </tbody>
            </table>
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
