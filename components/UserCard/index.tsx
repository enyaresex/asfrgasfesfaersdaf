import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import { AnalyticsContext, OnlineUsersContext } from '../../contexts';
import { createGtag } from '../../helpers';

import Avatar from '../Avatar';
import Button from '../Button';
import UserRank from '../UserRank';
import styles from './UserCard.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  gameId: number | null,
  rank: Rank,
  userId: number,
}>;

export default function UserCard({ gameId, rank, userId, ...props }: Props) {
  const router = useRouter();
  const { onlineUsers } = useContext(OnlineUsersContext);
  const { category } = useContext(AnalyticsContext);
  const { data: user } = useSWR<User>(`/users/${userId}/`);
  const { data: userGames } = useSWR<UserGame[]>(() => `/games/user_games/?user=${userId}`);

  const userGameAccount = useMemo<string | null>(() => {
    if (userGames === undefined || gameId === null) return null;

    const gameDetails = userGames.find(({ game }) => game === gameId);

    return gameDetails === undefined ? null : gameDetails.gameAccount;
  }, [userGames]);

  return user === undefined ? null : (
    <div {...props} className={styles.userCard}>
      <div className={styles.content}>
        <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
          <a
            className={styles.avatar}
            data-gtag={createGtag({
              category,
              event: 'Visit User Profile',
              label: 'New Players',
            })}
            tabIndex={-1}
          >
            <Avatar
              image={user.avatar}
              isOnline={onlineUsers !== undefined && onlineUsers.find((u) => u.userId === user?.id) !== undefined}
              size={75}
            />
          </a>
        </Link>

        <div className={styles.detail}>
          <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
            <a
              className={styles.username}
              data-gtag={createGtag({ category, event: 'Visit User Profile', label: 'New Players' })}
            >
              {user.username}
            </a>
          </Link>

          {userGameAccount !== null && <p className={styles.gameUsername}>{userGameAccount}</p>}

          <UserRank rank={rank} />
        </div>
      </div>

      <div className={styles.sendChallenge}>
        <Link
          href={{
            pathname: router.pathname,
            query: { ...router.query, duelCreation: 'true', userId },
          }}
          passHref
        >
          <Button
            className={styles.challengeButton}
            data-gtag={createGtag({ category, event: 'Click Send Challenge', label: 'New Players' })}
            outline
            type="button"
          >
            <FormattedMessage defaultMessage="Send Challenge" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
