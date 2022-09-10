import classNames from 'classnames';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import { FilterSortContext, RegionContext } from '../../contexts';
import Avatar from '../Avatar';
import { ReactComponent as Cup } from './cup.svg';
import styles from './QuickDuelTournamentInfo.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

type Pagination = {
  next: null | string,
  previous: null | string,
  results: Leaderboard[],
};

export default function QuickDuelTournamentInfo({ className, ...props }: Props) {
  const { selectedDuelFilters } = useContext(FilterSortContext);
  const { region } = useContext(RegionContext);
  const { data: game } = useSWR(selectedDuelFilters.game === null ? null : `/games/${selectedDuelFilters.game}/`);
  const { data: leaderboards } = useSWR<Pagination>(selectedDuelFilters.game === null ? null
    : `/tournaments/leaderboards/?game=${selectedDuelFilters.game}&region=${region.id}&status=IN_PROGRESS`);

  return (leaderboards === undefined || leaderboards.results.length === 0 || selectedDuelFilters.game === null)
    ? null : (
      <div {...props} className={classNames(styles.quickDuelTournamentInfo, className)}>
        <div className={styles.avatar}>
          <Avatar image={game.image} size={42} />

          <div className={styles.cup}>
            <Cup />
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.muted}>
            <FormattedMessage defaultMessage="This duel is within the tournament of " />
          </p>

          <p>{leaderboards.results[0].name}</p>
        </div>
      </div>
    );
}
