import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  ActivityIndicator,
  AnalyticsProvider,
  Button,
  Container,
  EmptyNotifications,
  HeadTagsHandler,
  Layout,
  Notification,
  withAuth,
} from '../../components';
import { NotificationsContext } from '../../contexts';
import styles from './Notifications.module.css';

function Notifications() {
  const intl = useIntl();
  const { canLoadMore, loadMore, markAllAsRead, notifications } = useContext(NotificationsContext);

  return (
    <AnalyticsProvider category="Notifications">
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Notifications' })} | Gamer Arena`} />

      <Layout className={styles.notifications}>
        <Container>
          <div className={styles.header}>
            <h1>
              <FormattedMessage defaultMessage="Notifications" />
            </h1>

            {notifications?.find((n) => n.isUnread) !== undefined && (
              <button className={styles.markAllAsReadButton} onClick={markAllAsRead} type="button">
                <FormattedMessage defaultMessage="Mark All as Read" />
              </button>
            )}
          </div>

          {notifications === null ? (
            <ActivityIndicator />
          ) : (
            <>
              {notifications.length === 0 ? (
                <EmptyNotifications />
              ) : (
                <>
                  {notifications.map((n) => (
                    <Notification className={styles.notification} key={n.id} notification={n} />
                  ))}
                </>
              )}
            </>
          )}

          {canLoadMore && (
            <div className={styles.loadMore}>
              <Button onClick={() => loadMore()} type="button">
                <FormattedMessage defaultMessage="Load More" />
              </Button>
            </div>
          )}
        </Container>
      </Layout>
    </AnalyticsProvider>
  );
}

export default withAuth('user', Notifications);
