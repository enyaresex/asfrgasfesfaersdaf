import classNames from 'classnames';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import EmptyStateDisplay from '../EmptyStateDisplay';
import UserGameAccount from '../UserGameAccount';
import styles from './UserGames.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  userId: number,
}>;

export default function UserGames({ className, userId, ...props }: Props) {
  const intl = useIntl();
  const { data: userGames } = useSWR<UserGame[]>(`/games/user_games/?user=${userId}&is_active=true`);

  return userGames === undefined ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.userGames, className)}>
      <div className={styles.header}>
        <h4 className={styles.title}>
          <FormattedMessage defaultMessage="Game Accounts" />
          <span className={styles.count}>{` (${userGames.length})`}</span>
        </h4>
      </div>
      <div className={styles.body}>
        {userGames.length === 0 ? (
          <div className={styles.isEmpty}>
            <EmptyStateDisplay
              kind="noUserGame"
              message={intl.formatMessage({ defaultMessage: 'Game account not found.' })}
            />
          </div>
        ) : (
          <>
            {userGames.map((ug) => (
              <UserGameAccount
                key={ug.id}
                userGame={ug}
                userId={userId}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
