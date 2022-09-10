import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import Avatar from '../Avatar';
import EmptyStateDisplay from '../EmptyStateDisplay';
import GACoin from '../GACoin';
import styles from './UserTrophies.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  userId: number,
}>;

type GameProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  leaderboard: number,
}>;

function Game({ className, leaderboard, ...props }: GameProps) {
  const { data: leaderboardData } = useSWR<Leaderboard>(() => `/tournaments/leaderboards/${leaderboard}/`);
  const { data: game } = useSWR<Game>(() => (leaderboardData === undefined ? null
    : `/games/${leaderboardData.game}/`));

  return game === undefined ? null : (
    <div {...props} className={classNames(styles.game, className)}>
      <Avatar image={game.image} size={46} />

      <p className={styles.name}>{game.name}</p>
    </div>
  );
}

export default function UserTrophies({ className, userId, ...props }: Props) {
  const intl = useIntl();
  const { data: leaderboardEntries } = useSWR<UserLeaderboardEntry[]>(() => `/tournaments/user_leaderboard_entries/?user=${userId}`);

  return leaderboardEntries === undefined ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.userTrophies, className)}>
      <div className={styles.header}>
        <h4>
          <FormattedMessage defaultMessage="Trophies" />
        </h4>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.trophiesHeader}>
          <p><FormattedMessage defaultMessage="Rank" /></p>

          <p><FormattedMessage defaultMessage="Game" /></p>

          <p><FormattedMessage defaultMessage="Reward" /></p>
        </div>

        <hr className={styles.separator} />

        <div className={styles.trophies}>
          {leaderboardEntries.length === 0 ? (
            <EmptyStateDisplay
              kind="noUserTrophy"
              message={intl.formatMessage({ defaultMessage: 'This user doesn\'t have any trophies.' })}
            />
          ) : (
            <>
              {leaderboardEntries.map((e) => (
                <Link href={`/tournaments/leaderboard?id=${e.leaderboard}&section=rankings`} key={e.id}>
                  <a className={styles.trophy} key={e.id}>
                    <div className={styles.ranking}>
                      <p className={styles.rank}>{`#${e.rank}`}</p>
                    </div>

                    <Game leaderboard={e.leaderboard} />

                    <p className={styles.reward}>
                      {e.reward}
                      {' '}
                      <GACoin />
                    </p>
                  </a>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
