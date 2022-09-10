import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import styles from './ChatNotice.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  message?: HydratedChatMessage,
}>;

export default function ChatNotice({ children, className, message }: Props) {
  const router = useRouter();
  const { data: user } = useSWR<User>((message === undefined || message.userId === undefined) ? null : `/users/${message.userId}/`);

  const content = useMemo<React.ReactNode>(() => {
    if (children !== undefined) {
      return (
        <div className={styles.content}>{children}</div>
      );
    }

    if (message !== undefined && message.userId === undefined && message.image !== undefined) {
      return (
        <div className={styles.proofNotice}>
          <a className={styles.imageLink} href={message.image} rel="noreferrer" target="_blank" title={message.content}>
            <img alt={message.content} loading="lazy" src={message.image} />
          </a>

          <p className={styles.content}>{message.content}</p>

          <p className={styles.dateTime} title={message.dateTime.format('ll, LT')}>
            {message.dateTime.format('DD MMMM, HH:mm')}
          </p>
        </div>
      );
    }

    return user === undefined || message === undefined ? (
      <ActivityIndicator />
    ) : (
      <>
        <p className={styles.content}>
          <FormattedMessage
            defaultMessage="{userLink} pinged the chat."
            values={{
              userLink: (
                <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
                  <a>{user.username}</a>
                </Link>
              ),
            }}
          />
        </p>

        <p className={styles.dateTime} title={message.dateTime.format('ll, LT')}>
          {message.dateTime.format('DD MMMM, HH:mm')}
        </p>
      </>
    );
  }, [children, message, user]);

  return (
    <div className={classNames(styles.chatNotice, className)}>
      {content}
    </div>
  );
}
