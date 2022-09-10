import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { AnalyticsContext, AuthAndApiContext, OnlineUsersContextOnlineUser } from '../../contexts';
import { createGtag } from '../../helpers';

import Avatar from '../Avatar';
import Button from '../Button';
import styles from './OnlineUser.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  onlineUser: OnlineUsersContextOnlineUser,
}>;

export default function OnlineUser({ onlineUser }: Props) {
  const router = useRouter();
  const { user: authUser } = useContext(AuthAndApiContext);
  const { category } = useContext(AnalyticsContext);
  const { data: user } = useSWR<User>(`/users/${onlineUser.userId}/`);

  return user === undefined ? null : (
    <div className={styles.onlineUser} key={user.id}>
      <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
        <a className={styles.user} data-gtag={createGtag({ category, event: 'Visit User Profile' })}>
          <Avatar image={user.avatar} isBanned={!user.isActive} isOnline size={30} />

          <div className={styles.username}>{user.username}</div>
        </a>
      </Link>

      <div className={styles.action}>
        {(authUser === null || (authUser.id !== user.id)) && (
          <Link
            href={{
              pathname: router.pathname,
              query: { ...router.query, duelCreation: 'true', userId: onlineUser.userId },
            }}
            passHref
          >
            <Button
              data-gtag={createGtag({ category, event: 'Click Challenge To Duel' })}
              icon="swords"
              size="small"
              type="button"
              variant="secondary"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
