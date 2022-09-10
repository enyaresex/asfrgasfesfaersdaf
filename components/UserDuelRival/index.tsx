import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import { AuthAndApiContext, BreakpointContext } from '../../contexts';
import Avatar from '../Avatar';
import Button from '../Button';
import styles from './UserDuelRival.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  rival: UserDuelRival,
}>;

export default function UserDuelRival({ className, rival, ...props }: Props) {
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);
  const { breakpoint } = useContext(BreakpointContext);
  const { data: rivalData } = useSWR<User>(() => `/users/${rival.user}`);

  const isRivalMe = useMemo<boolean>(() => {
    if (user === null || rivalData === undefined) return false;

    return user.id === rivalData.id;
  }, [user, rivalData]);

  return rivalData === undefined ? null : (
    <div {...props} className={classNames(styles.rival, className)}>
      <Avatar
        className={styles.avatar}
        duelCount={rival.duelCount}
        image={rivalData.avatar}
        size={breakpoint === 'xs' ? 50 : 66}
      />

      <div className={styles.details}>
        <p className={styles.username}>
          {rivalData.username}

          {isRivalMe && (
            <span className={styles.muted}>
              {' ('}
              <FormattedMessage defaultMessage="You" />
              )
            </span>
          )}
        </p>

        <p className={styles.winRate}>
          <FormattedMessage defaultMessage="Win Rate" />
          {' '}
          <span className={styles.value}>{`${rival.winRate}%`}</span>
        </p>
      </div>

      <Link href={{ query: { ...router.query, username: rivalData.username } }} passHref scroll={false}>
        <Button
          className={styles.goToProfile}
          size="small"
          variant="secondary"
        >
          {isRivalMe ? <FormattedMessage defaultMessage="My Profile" />
            : <FormattedMessage defaultMessage="View Profile" />}
        </Button>
      </Link>
    </div>
  );
}
