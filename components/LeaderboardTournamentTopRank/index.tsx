import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import useSWR from 'swr';
import { AnalyticsContext } from '../../contexts';
import { createGtag } from '../../helpers';
import Avatar from '../Avatar';
import GACoin from '../GACoin';
import styles from './LeaderboardTournamentTopRank.module.css';
import { ReactComponent as Loss } from './loss.svg';
import { ReactComponent as Win } from './win.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['a']>, {
  entry: LeaderboardEntry,
  leaderboard: Leaderboard,
  rank: number,
}>;

/* TODO: Connect rankBorderColors with Avatar component */
const rankBorderColors = ['gold', 'silver', 'bronze'];

export default function LeaderboardTournamentTopRank({ className, entry, leaderboard, rank, ...props }: Props) {
  const router = useRouter();
  const { category } = useContext(AnalyticsContext);
  const { data: user } = useSWR<User>(`/users/${entry.user}/`);
  const sortedRewards = useMemo<number[]>(() => leaderboard.rewards.sort((a, b) => b - a), [leaderboard]);

  return user === undefined ? null : (
    <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
      <a
        {...props}
        className={classNames(styles.leaderboardTournamentTopRank, className)}
        data-gtag={createGtag({ category, event: 'Visit User Profile', label: leaderboard.name })}
      >
        <div className={styles.user}>
          <Avatar
            image={user.avatar}
            isBanned={!user.isActive}
            rank={rank + 1}
            rankBorderColor={(rankBorderColors[rank] as 'bronze' | 'gold' | 'silver') || 'red'}
            size={64}
          />

          <div className={styles.details}>
            <p className={styles.username}>{user.username}</p>

            <div className={styles.count}>
              <p className={styles.info}>
                <Win />
                {entry.winCount}
              </p>

              <p className={styles.info}>
                <Loss />

                {entry.loseCount}
              </p>
            </div>
          </div>
        </div>

        {sortedRewards[rank] !== undefined && (
          <div className={styles.reward}>
            <GACoin />
            {' '}
            {sortedRewards[rank]}
          </div>
        )}
      </a>
    </Link>
  );
}
