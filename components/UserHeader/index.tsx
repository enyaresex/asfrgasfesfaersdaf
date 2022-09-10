import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import {
  AnalyticsContext,
  AuthAndApiContext,
  BreakpointContext,
  OnlineUsersContext,
  ToastsContext,
} from '../../contexts';
import { createGtag } from '../../helpers';
import ActivityIndicator from '../ActivityIndicator';
import Avatar from '../Avatar';
import Button from '../Button';
import Container from '../Container';
import Modal from '../Modal';
import ShareButton from '../ShareButton';
import { ReactComponent as Back } from './back.svg';
import { ReactComponent as Edit } from './edit.svg';
import styles from './UserHeader.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  closePage: () => void,
  userId: number,
}>;

export default function UserHeader({ className, closePage, userId, ...props }: Props) {
  const intl = useIntl();
  const router = useRouter();
  const { category } = useContext(AnalyticsContext);
  const { api, user: authUser } = useContext(AuthAndApiContext);
  const { device } = useContext(BreakpointContext);
  const { onlineUsers } = useContext(OnlineUsersContext);
  const { addToast } = useContext(ToastsContext);
  const { data: blockedUser } = useSWR<BlockedUser[]>(`/users/blocked/?blocked_user=${userId}`);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState<boolean>(false);

  const { data: user } = useSWR<User>(() => `/users/${userId}/`);
  const { data: userDuelStatistics } = useSWR<UserDuelStatistics>(() => `/duels/user_duel_statistics/${userId}/`);

  const isMyProfile = useMemo<boolean>(() => {
    if (authUser === null) return false;

    return userId === authUser.id;
  }, [authUser]);

  return user === undefined || isMyProfile === null || userDuelStatistics === undefined || blockedUser === undefined
    ? <ActivityIndicator />
    : (
      <>
        <Modal
          actions={(
            <>
              <Button onClick={() => setIsBlockModalOpen(false)} type="button" variant="secondary">
                <FormattedMessage defaultMessage="Close" />
              </Button>

              <Button
                onClick={async () => {
                  setIsDisabled(true);

                  const response = await api.post('/users/blocked/', {
                    blockedUser: user.id,
                  });

                  if (response.ok) {
                    await mutate(`/users/blocked/?blocked_user=${userId}`);

                    addToast({
                      content: intl.formatMessage({ defaultMessage: 'User blocked.' }),
                      kind: 'success',
                    });
                  }

                  setIsDisabled(false);
                  setIsBlockModalOpen(false);
                }}
                type="button"
              >
                <FormattedMessage defaultMessage="Block User" />
              </Button>
            </>
          )}
          isOpen={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
        >
          <FormattedMessage defaultMessage="Are you sure you want to block this user?" />
        </Modal>

        <Modal
          actions={(
            <>
              <Button onClick={() => setIsUnblockModalOpen(false)} type="button" variant="secondary">
                <FormattedMessage defaultMessage="Close" />
              </Button>

              <Button
                onClick={async () => {
                  setIsDisabled(true);

                  if (authUser === null) return;

                  const response = await api.destroy(`/users/blocked/${blockedUser[0].id}/`);

                  if (response.ok) {
                    await mutate(`/users/blocked/?blocked_user=${userId}`);

                    addToast({
                      content: intl.formatMessage({ defaultMessage: 'User unblocked.' }),
                      kind: 'success',
                    });
                  }

                  setIsDisabled(false);
                  setIsUnblockModalOpen(false);
                }}
                type="button"
              >
                <FormattedMessage defaultMessage="Unblock User" />
              </Button>
            </>
          )}
          isOpen={isUnblockModalOpen}
          onClose={() => setIsUnblockModalOpen(false)}
        >
          <FormattedMessage defaultMessage="Are you sure you want to unblock this user?" />
        </Modal>

        <section {...props} className={classNames(styles.userHeader, className)}>
          <div className={styles.background} />

          <Container>
            <div className={styles.actions}>
              <button className={styles.goBack} disabled={isDisabled} onClick={closePage} type="button">
                <Back />
              </button>

              {authUser !== null && (
                <>
                  {isMyProfile ? (
                    <>
                      {device !== 'desktop' && (
                        <Link href="/settings">
                          <a className={styles.edit}>
                            <Edit />
                            <FormattedMessage defaultMessage="Edit" />
                          </a>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      {blockedUser.length > 0 ? (
                        <button
                          className={styles.edit}
                          disabled={isDisabled}
                          onClick={() => setIsUnblockModalOpen(true)}
                          type="button"
                        >
                          <FormattedMessage defaultMessage="Unblock User" />
                        </button>
                      ) : (
                        <button
                          className={styles.edit}
                          disabled={isDisabled}
                          onClick={() => setIsBlockModalOpen(true)}
                          type="button"
                        >
                          <FormattedMessage defaultMessage="Block User" />
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <div className={styles.wrapper}>
              <div className={styles.user}>
                <Avatar
                  className={styles.avatar}
                  image={user.avatar}
                  isBanned={!user.isActive}
                  isOnline={onlineUsers.find((u) => u.userId === user?.id) !== undefined}
                  size={118}
                />

                <h3 className={styles.username}>
                  {user.username}

                  <ShareButton
                    text={intl.formatMessage(
                      { defaultMessage: 'Challenge me! | {username} | Gamer Arena Competitive Esports Platform' },
                      { username: user.username },
                    )}
                  />
                </h3>

                <p className={styles.date}>{dayjs(user.createdAt).fromNow()}</p>
              </div>

              <div className={styles.details}>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <p>
                      {userDuelStatistics.totalDuelCount === 0 ? <span className={styles.muted}>N/A</span>
                        : userDuelStatistics.totalDuelCount}
                    </p>

                    <p>
                      <FormattedMessage defaultMessage="Total Duels" />
                    </p>
                  </div>

                  <div className={styles.stat}>
                    <p>
                      {userDuelStatistics.winRate === null ? <span className={styles.muted}>N/A</span>
                        : `${userDuelStatistics.winRate}%`}
                    </p>

                    <p>
                      <FormattedMessage defaultMessage="Win Rate" />
                    </p>
                  </div>

                  <div className={styles.stat}>
                    <p>
                      {userDuelStatistics.winCount === 0 ? <span className={styles.muted}>N/A</span>
                        : userDuelStatistics.winCount}
                    </p>

                    <p>
                      <FormattedMessage defaultMessage="Winner" />
                    </p>
                  </div>
                </div>

                {authUser !== null && (
                  <div className={styles.button}>
                    {isMyProfile ? (
                      <>
                        {device === 'desktop' && (
                          <Button
                            disabled={isDisabled}
                            onClick={() => router.push('/settings')}
                            size="large"
                            variant="secondary"
                          >
                            <FormattedMessage defaultMessage="Edit Profile" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <Link
                        href={{
                          pathname: router.pathname,
                          query: { ...router.query, duelCreation: 'true', userId: user.id },
                        }}
                        passHref
                      >
                        <Button
                          data-gtag={createGtag({ category, event: 'Click Challenge to Duel', label: 'Challenge ' })}
                          disabled={isDisabled}
                          fullWidth
                          size="large"
                        >
                          <FormattedMessage defaultMessage="Challenge To Duel" />
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </>
    );
}
