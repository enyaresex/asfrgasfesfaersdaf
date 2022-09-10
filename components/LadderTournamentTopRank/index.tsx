import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import { AnalyticsContext } from '../../contexts';
import { createGtag } from '../../helpers';
import GACoin from '../GACoin';
import styles from './LadderTournamentTopRank.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['a']>, {
  entry: LadderEntry,
  ladder: Ladder,
  rank: number,
}>;

export default function LadderTournamentTopRank({ className, entry, ladder, rank, ...props }: Props) {
  const router = useRouter();
  const { category } = useContext(AnalyticsContext);
  const { data: user } = useSWR<User>(entry.users.length === 0 ? null : `/users/${entry.users[0]}/`);
  const sortedRewards = useMemo<number[]>(() => ladder.rewards.sort((a, b) => b - a), [ladder]);

  return user === undefined ? null : (
    <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
      <a
        {...props}
        className={classNames(styles.ladderTournamentTopRank, className)}
        data-gtag={createGtag({ category, event: 'Visit User Profile', label: ladder.name })}
      >
        <div className={styles.user}>
          <div className={styles.details}>
            <p className={styles.username}>{entry.name}</p>

            <div className={styles.count}>
              <p>
                <span className={styles.muted}>
                  <FormattedMessage defaultMessage="Points" />
                  {': '}
                </span>

                {entry.points}
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
