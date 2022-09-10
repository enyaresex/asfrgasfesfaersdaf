import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ReactComponent as Empty } from './empty.svg';
import styles from './EmptyNotifications.module.css';

export default function EmptyNotifications() {
  return (
    <div className={styles.emptyNotifications}>
      <Empty />

      <p className={styles.description}>
        <FormattedMessage defaultMessage="You don't have any notifications." />
      </p>
    </div>
  );
}
