import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import { AnalyticsContext, BreakpointContext, NotificationsContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import Button from '../Button';
import { ReactComponent as Duel } from './duel.svg';
import { ReactComponent as Info } from './info.svg';
import styles from './Notification.module.css';
import { ReactComponent as Read } from './read.svg';
import { ReactComponent as Tournament } from './tournament.svg';
import { ReactComponent as Wallet } from './wallet.svg';

type Props = {
  className?: string,
  isAllActionable?: boolean,
  notification: HydratedNotification,
};

const kindIcons: Record<FSNotification['kind'], React.ReactNode> = {
  duel: <Duel />,
  info: <Info />,
  tournament: <Tournament />,
  wallet: <Wallet />,
};

const kindStyles: Record<FSNotification['kind'], string> = {
  duel: styles.kindDuel,
  info: styles.kindInfo,
  tournament: styles.kindTournament,
  wallet: styles.kindWallet,
};

export default function Notification({
  className,
  isAllActionable: isAllActionableFromProps = false,
  notification,
}: Props) {
  const router = useRouter();
  const { breakpoint } = useContext(BreakpointContext);
  const { category } = useContext(AnalyticsContext);
  const { isMenuOpen, markAsRead, setIsMenuOpen } = useContext(NotificationsContext);

  const isAllActionable = useMemo<boolean>(
    () => isAllActionableFromProps || ['xs', 'sm'].includes(breakpoint),
    [breakpoint],
  );

  async function onActivate() {
    if (isMenuOpen) setIsMenuOpen(false);

    await markAsRead(notification.id);

    sendGAEvent({
      category,
      event: 'Click Notification',
      label: category === 'Header' ? 'Notifications Menu' : 'Notifications',
    });

    if (notification.action.action === 'navigate') {
      if (notification.action.route === 'duel') {
        await router.push(`/duels/duel?id=${notification.action.id}`);
      }

      if (notification.action.route === 'leaderboard') {
        await router.push({
          pathname: '/tournaments/leaderboard',
          query: {
            id: notification.action.id,
          },
        });
      }

      if (notification.action.route === 'wallet') {
        await router.push('/wallet');
      }

      if (notification.action.route === 'verifyPhoneNumber') {
        await router.push({
          pathname: '/settings',
          query: {
            section: 'profileSettings',
          },
        });
      }

      return;
    }

    if (notification.action.action === 'open') {
      const newTab = window.open(notification.action.route, '_blank');
      newTab?.focus();
    }
  }

  const children = (
    <>
      <div className={styles.column}>
        <div className={styles.unreadStatus}>
          {notification.isUnread ? (
            <div className={styles.unreadIndicator} />
          ) : (
            <Read className={styles.read} />
          )}
        </div>
      </div>

      <div className={classNames(styles.column, styles.iconColumn)}>
        <div className={styles.icon}>
          {kindIcons[notification.kind]}
        </div>
      </div>

      <div className={styles.column}>
        <div className={styles.body}>
          <p className={styles.title}>
            {notification.title}
          </p>

          <p className={styles.description}>
            {notification.description}
          </p>

          <p className={styles.dateTime}>
            {notification.dateTimeDisplay}
          </p>
        </div>
      </div>

      <div className={classNames(styles.column, styles.actionColumn)}>
        <div className={styles.action}>
          {isAllActionable ? (
            <Button href={undefined} variant="secondary">
              {notification.action.title}
            </Button>
          ) : (
            <Button onClick={onActivate} type="button" variant="secondary">
              {notification.action.title}
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return isAllActionable ? (
    <button
      className={classNames(styles.notification, kindStyles[notification.kind], styles.allActionable, className)}
      onClick={() => {
        if (isAllActionable) {
          onActivate();
        }
      }}
      type="button"
    >
      {children}
    </button>
  ) : (
    <div className={classNames(styles.notification, kindStyles[notification.kind], className)}>
      {children}
    </div>
  );
}
