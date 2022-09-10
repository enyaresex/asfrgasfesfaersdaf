import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import useSWR from 'swr';
import { AnalyticsContext, AuthAndApiContext, BreakpointContext } from '../../contexts';
import { createGtag } from '../../helpers';
import Avatar from '../Avatar';
import GACoin from '../GACoin';
import { ReactComponent as BronzeTrophy } from './bronzeTrophy.svg';
import { ReactComponent as GoldTrophy } from './goldTrophy.svg';
import styles from './LeaderboardTournamentRank.module.css';
import { ReactComponent as Loss } from './loss.svg';
import { ReactComponent as SilverTrophy } from './silverTrophy.svg';
import { ReactComponent as Win } from './win.svg';

type RankProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['tr']>, {
  entry: LeaderboardEntry,
  leaderboard: Leaderboard,
  rank: number,
}>;

export default function LeaderboardTournamentRank({ className, entry, leaderboard, rank, ...props }: RankProps) {
  const router = useRouter();
  const { category } = useContext(AnalyticsContext);
  const { user: authUser } = useContext(AuthAndApiContext);
  const { data: user } = useSWR<User>(`/users/${entry.user}/`);
  const { breakpoint, device } = useContext(BreakpointContext);
  const sortedRewards = useMemo<number[]>(() => leaderboard.rewards.sort((a, b) => b - a), [leaderboard]);

  return user === undefined ? null : (
    <tr
      {...props}
      className={classNames(
        styles.leaderboardTournamentRank,
        (authUser !== null && authUser.id === user.id) && styles.me,
        className,
      )}
    >
      {device === 'desktop' && (
        <td className={styles.trophies}>
          {rank === 0 && <GoldTrophy />}
          {rank === 1 && <SilverTrophy />}
          {rank === 2 && <BronzeTrophy />}
        </td>
      )}

      <td className={styles.rankCount}>{`#${rank + 1}`}</td>

      <td colSpan={breakpoint === 'xs' ? 1 : 4}>
        <div className={styles.user}>
          <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
            <a className={styles.inline} data-gtag={createGtag({ category, event: 'Visit User Profile', label: leaderboard.name })}>
              <Avatar image={user.avatar} isBanned={!user.isActive} size={36} />

              <p>{user.username}</p>
            </a>
          </Link>
        </div>
      </td>

      <td className={styles.count}>
        <div className={styles.inline}>
          <Win />

          <p>{entry.winCount}</p>
        </div>
      </td>

      <td className={styles.count}>
        <div className={styles.inline}>
          <Loss />

          <p>{entry.loseCount}</p>
        </div>
      </td>

      <td className={styles.reward} colSpan={breakpoint === 'xs' ? 1 : 2}>
        {sortedRewards[rank] === undefined ? '-' : (
          <>
            <GACoin />

            {' '}

            {sortedRewards[rank]}
          </>
        )}
      </td>
    </tr>
  );
}
