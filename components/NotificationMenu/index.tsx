import classNames from 'classnames';
import Link from 'next/link';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useClickAway } from 'react-use';
import { AnalyticsContext, NotificationsContext } from '../../contexts';
import { createGtag, sendGAEvent } from '../../helpers';

import { useKeyDown } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import BackgroundShade from '../BackgroundShade';
import EmptyNotifications from '../EmptyNotifications';
import HeaderButton from '../HeaderButton';
import Notification from '../Notification';
import { ReactComponent as Bell } from './bell.svg';
import styles from './NotificationMenu.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

export default function NotificationMenu({ className, ...props }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const { isMenuOpen, markAllAsRead, notifications, setIsMenuOpen } = useContext(NotificationsContext);
  const { category } = useContext(AnalyticsContext);
  const audio = useRef<HTMLAudioElement>(new Audio('/notification.mp3'));

  const unreadNotificationCount = useMemo<number>(
    () => (notifications === null ? 0 : notifications.filter((n) => n.isUnread).length),
    [notifications],
  );
  const previousUnreadNotificationCount = useRef<number>(unreadNotificationCount);

  const filteredNotifications = useMemo<HydratedNotification[] | null>(() => {
    if (notifications === null) return null;

    const count = Math.max(10, notifications.filter((n) => n.isUnread).length);

    return notifications.slice(0, count);
  }, [notifications]);

  async function playSound() {
    try {
      await audio.current.play();
    } catch (e) {
      /*
       This might occur when we try to play a sound before user interacts with the document.
       I am catching this to prevent the unnecessary sentry report. -G
       */
    }
  }

  useEffect(() => {
    if (unreadNotificationCount > previousUnreadNotificationCount.current) {
      playSound();
    }

    previousUnreadNotificationCount.current = unreadNotificationCount;
  }, [unreadNotificationCount]);

  useClickAway(box, () => {
    if (isMenuOpen) setIsMenuOpen(false);
  });

  useKeyDown(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, ['escape']);

  useEffect(() => {
    if (isMenuOpen) {
      sendGAEvent({ category, event: 'Open Notifications', label: 'Notifications Menu' });
    }
  }, [isMenuOpen]);

  return (
    <>
      <BackgroundShade isVisible={isMenuOpen} />

      <div {...props} className={classNames(className, styles.notificationMenu)}>
        <HeaderButton className={styles.headerButton} onClick={() => setIsMenuOpen((o) => !o)}>
          <Bell />

          {unreadNotificationCount !== 0 && (
            <div className={styles.notificationIndicator}>
              {unreadNotificationCount}
            </div>
          )}
        </HeaderButton>

        <TransitionGroup>
          {isMenuOpen && (
            <CSSTransition timeout={300}>
              <div className={styles.box} ref={box}>
                <div className={styles.header}>
                  <p className={styles.title}>
                    <FormattedMessage defaultMessage="Notifications" />
                  </p>

                  {notifications?.find((n) => n.isUnread) !== undefined && (
                    <button
                      className={styles.markAllAsReadButton}
                      onClick={() => {
                        markAllAsRead();

                        sendGAEvent({
                          category,
                          event: 'Click Mark All as Read',
                          label: category === 'Header' ? 'Notifications Menu' : 'Notifications',
                        });
                      }}
                      type="button"
                    >
                      <FormattedMessage defaultMessage="Mark All as Read" />
                    </button>
                  )}
                </div>

                <div className={styles.body}>
                  {filteredNotifications === null ? (
                    <ActivityIndicator />
                  ) : (
                    <>
                      {filteredNotifications.length === 0 ? (
                        <EmptyNotifications />
                      ) : (
                        <div className={styles.items}>
                          {filteredNotifications.map((notification) => (
                            <Notification isAllActionable key={notification.id} notification={notification} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.footer}>
                  <Link href="/notifications" passHref>
                    <a
                      className={styles.pageLink}
                      data-gtag={createGtag({ category, event: 'Click Show All', label: 'Notifications Menu' })}
                      href="dummy"
                      onClick={() => setIsMenuOpen(false)}
                      role="button"
                    >
                      <FormattedMessage defaultMessage="Show All" />
                    </a>
                  </Link>
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </>
  );
}
