import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import useSWR from 'swr';
import { AnalyticsContext, AuthAndApiContext, BreakpointContext } from '../../contexts';
import { createGtag } from '../../helpers';
import GACoin from '../GACoin';
import { ReactComponent as BronzeTrophy } from './bronzeTrophy.svg';
import { ReactComponent as GoldTrophy } from './goldTrophy.svg';
import styles from './LadderTournamentRank.module.css';
import { ReactComponent as SilverTrophy } from './silverTrophy.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['tr']>, {
  entry: LadderEntry,
  ladder: Ladder,
  rank: number,
}>;

export default function LadderTournamentRank({ className, entry, ladder, rank, ...props }: Props) {
  const router = useRouter();
  const { category } = useContext(AnalyticsContext);
  const { user: authUser } = useContext(AuthAndApiContext);
  const { data: user } = useSWR<User>(entry.users.length <= 0 ? null : `/users/${entry.users[0]}/`);
  const { breakpoint, device } = useContext(BreakpointContext);
  const sortedRewards = useMemo<number[]>(() => ladder.rewards.sort((a, b) => b - a), [ladder]);

  return user === undefined ? null : (
    <tr
      {...props}
      className={classNames(styles.ladderTournamentRank,
        (authUser !== null && entry.users.includes(authUser.id)) && styles.me,
        className)}
    >
      {device === 'desktop' && (
        <td className={styles.trophies}>
          {rank === 0 && <GoldTrophy />}
          {rank === 1 && <SilverTrophy />}
          {rank === 2 && <BronzeTrophy />}
        </td>
      )}

      <td className={styles.rankCount}>{`#${rank + 1}`}</td>

      <td className={styles.user} colSpan={breakpoint === 'xs' ? 1 : 4}>
        <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
          <a data-gtag={createGtag({ category, event: 'Visit User Profile', label: ladder.name })}>
            <p>{entry.name}</p>
          </a>
        </Link>
      </td>

      <td className={styles.count}>
        {entry.points}
      </td>

      <td className={styles.reward} colSpan={breakpoint === 'xs' ? 1 : 2}>
        {sortedRewards[rank] === undefined ? '-' : (
          <>
            <GACoin />

            {` ${sortedRewards[rank]}`}
          </>
        )}
      </td>
    </tr>
  );
}
