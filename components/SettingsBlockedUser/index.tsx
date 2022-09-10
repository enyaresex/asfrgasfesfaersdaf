import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AuthAndApiContext, BreakpointContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import Avatar from '../Avatar';
import Button from '../Button';
import Modal from '../Modal';
import styles from './SettingsBlockedUser.module.css';
import { ReactComponent as Trash } from './trash.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  blockedUser: BlockedUser,
}>;

export default function SettingsBlockedUser({ className, blockedUser, ...props }: Props) {
  const router = useRouter();
  const { api, user: authUser } = useContext(AuthAndApiContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { device } = useContext(BreakpointContext);
  const { data: user } = useSWR<User>(`/users/${blockedUser.blockedUser}/`);

  const unblockButton = (
    <>
      <Modal
        actions={(
          <>
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              <FormattedMessage defaultMessage="Close" />
            </Button>

            <Button
              onClick={async () => {
                const response = await api.destroy(`/users/blocked/${blockedUser.id}/`);

                if (response.ok) {
                  await mutate('/users/blocked/');
                } else {
                  /* TODO: Handle error */
                }

                setIsModalOpen(false);
              }}
              type="button"
            >
              <FormattedMessage defaultMessage="Unblock User" />
            </Button>
          </>
        )}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <FormattedMessage defaultMessage="Are you sure you want to unblock this user?" />
      </Modal>

      <button
        className={styles.button}
        onClick={() => {
          if (authUser === null) return;
          setIsModalOpen(true);
        }}
        type="button"
      >
        <Trash />
      </button>
    </>
  );

  return user === undefined ? <ActivityIndicator /> : (
    <>
      {device === 'desktop' ? (
        <div {...props} className={classNames(styles.settingsBlockedUser, className)}>
          <div className={styles.topInfo}>
            {unblockButton}
          </div>

          <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
            <a className={styles.avatar}>
              <Avatar image={user.avatar} isBlocked size={64} />
            </a>
          </Link>

          <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
            <a className={styles.username}>{`@${user.username}`}</a>
          </Link>
        </div>
      ) : (
        <div {...props} className={classNames(styles.settingsBlockedUser, className)}>
          <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
            <a className={styles.avatar}>
              <Avatar image={user.avatar} isBlocked size={64} />
            </a>
          </Link>

          <div className={styles.content}>
            <div className={styles.info}>
              <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
                <a className={styles.username}>{`@${user.username}`}</a>
              </Link>
            </div>

            <div className={styles.action}>
              {unblockButton}

              <p className={styles.blockedText}>
                <FormattedMessage defaultMessage="Blocked" />
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
