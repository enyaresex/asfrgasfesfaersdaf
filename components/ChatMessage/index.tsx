import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { AuthAndApiContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import Avatar from '../Avatar';
import ChatNotice from '../ChatNotice';
import styles from './ChatMessage.module.css';

type Props = {
  message: HydratedChatMessage,
};

export default function ChatMessage({ message }: Props) {
  const router = useRouter();
  const { user: authUser } = useContext(AuthAndApiContext);
  const { data: user } = useSWR<User>(`/users/${message.userId}/`);

  return user === undefined ? (
    <>
      {message.userId === undefined ? <ChatNotice message={message} /> : <ActivityIndicator />}
    </>
  ) : (
    <>
      {message.content === undefined ? (
        <ChatNotice message={message} />
      ) : (
        <div className={classNames(styles.chatMessage, authUser?.id === message.userId && styles.own)}>
          <Link href={{ query: { ...router.query, username: user.username } }} scroll={false}>
            <a className={styles.user} title={user.username}>
              <Avatar
                className={styles.avatar}
                image={user.avatar}
                size={30}
                title={user.username}
              />

              <p className={styles.username}>{`@${user.username}`}</p>
            </a>
          </Link>

          <div className={styles.message}>
            <div className={styles.messageContent}>{message.content}</div>

            <p className={styles.messageDateTime} title={message.dateTime.format('ll, LT')}>
              {message.dateTime.format('DD MMMM, HH:mm')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
