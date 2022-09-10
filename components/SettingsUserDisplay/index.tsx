import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { AuthAndApiContext } from '../../contexts';
import Avatar from '../Avatar';
import AvatarUpdateModal from '../AvatarUpdateModal';
import styles from './SettingsUserDisplay.module.css';
import { ReactComponent as UpdateAvatar } from './update-avatar.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

export default function SettingsUserDisplay({ className, ...props }: Props) {
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);

  return user === null ? null : (
    <>
      <AvatarUpdateModal />

      <section {...props} className={classNames(styles.settingsUserDisplay, className)}>
        <Link href={{ pathname: router.pathname, query: { ...router.query, action: 'updateAvatar' } }} scroll={false}>
          <a className={styles.avatar}>
            <Avatar alt={user.username} image={user.avatar} size={68} />

            <div className={styles.icon}>
              <UpdateAvatar />
            </div>
          </a>
        </Link>

        <div className={styles.user}>
          <h3 className={styles.username}>{`@${user.username}`}</h3>

          <p className={styles.muted}>
            <FormattedMessage
              defaultMessage="Joined {fromNow}."
              values={{
                fromNow: dayjs(user.createdAt).fromNow(),
              }}
            />
          </p>
        </div>
      </section>
    </>
  );
}
