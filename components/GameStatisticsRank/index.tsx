import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import { AuthAndApiContext, BreakpointContext } from '../../contexts';
import Avatar from '../Avatar';
import { ReactComponent as BronzeTrophy } from './bronzeTrophy.svg';
import styles from './GameStatisticsRank.module.css';
import { ReactComponent as GoldTrophy } from './goldTrophy.svg';
import { ReactComponent as Loss } from './loss.svg';
import { ReactComponent as SilverTrophy } from './silverTrophy.svg';
import { ReactComponent as Win } from './win.svg';

type RankProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['tr']>, {
  entry: GameStatistic,
  rank: number,
}>;

export default function GameStatisticsRank({ className, entry, rank, ...props }: RankProps) {
  const intl = useIntl();
  const router = useRouter();
  const { user: authUser } = useContext(AuthAndApiContext);
  const { data: user } = useSWR<User>(`/users/${entry.user}/`);
  const { breakpoint, device } = useContext(BreakpointContext);

  const winRate = useMemo<string>(() => {
    const temp = Math.round((entry.winCount / (entry.winCount + entry.loseCount)) * 100) / 100;

    return Number.isNaN(temp) ? 'N/A' : intl.formatMessage({ defaultMessage: '{number}%' }, {
      number: Math.round(temp * 100),
    });
  }, [entry]);

  return user === undefined ? null : (
    <tr
      {...props}
      className={classNames(
        styles.gameStatisticsRank,
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

      <td colSpan={breakpoint === 'sm' ? 1 : 4}>
        <div className={styles.user}>
          <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
            <a className={styles.inline}>
              <Avatar className={styles.avatar} image={user.avatar} isBanned={!user.isActive} size={36} />

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

      <td className={styles.winRate} colSpan={breakpoint === 'sm' ? 1 : 2}>
        {winRate}
      </td>
    </tr>
  );
}
