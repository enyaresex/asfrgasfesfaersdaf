import classNames from 'classnames';
import dayjs from 'dayjs';
import firebase from 'firebase/app';
import 'firebase/auth'; // eslint-disable-line import/no-duplicates
import 'firebase/firestore'; // eslint-disable-line import/no-duplicates
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AuthAndApiContext } from '../../contexts';
import { getFirestoreCollection } from '../../helpers';
import { useForm, useKeyDown } from '../../hooks';
import Button from '../Button';
import ChatCannedResponses from '../ChatCannedResponses';
import ChatMessage from '../ChatMessage';
import ChatNotice from '../ChatNotice';
import TextInput from '../TextInput';
import { ReactComponent as Expand } from './expand.svg';
import { ReactComponent as Shrink } from './shrink.svg';
import styles from './TournamentChat.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  id: number,
  kind: 'ladder' | 'leaderboard',
}>;

type Form = {
  message: string,
};

export default function TournamentChat({ className, id, kind }: Props) {
  const db = firebase.firestore();

  const intl = useIntl();
  const [values, , updateValue] = useForm<Form>({
    message: '',
  });
  const { user } = useContext(AuthAndApiContext);
  const [messages, setMessages] = useState<HydratedChatMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const content = useRef<HTMLDivElement>(null);
  const firestoreCollection = useMemo<string>(() => getFirestoreCollection(`${kind}-tournament-chats`), [kind]);

  async function post(message: string) {
    if (user === null) return;

    try {
      await db.collection(firestoreCollection).doc(id.toString()).collection('messages').add({
        content: message,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        userId: user.id,
      });
    } catch (e) {
      // TODO: Do something with this error
    }
  }

  useEffect(() => {
    const unsubscribe = db.collection(firestoreCollection)
      .doc(id.toString())
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot((querySnapshot) => {
        const newMessages: HydratedChatMessage[] = querySnapshot.docs.map((ds) => {
          const data = ds.data();

          return {
            content: data.content,
            dateTime: dayjs(data.timestamp.toDate()),
            id: ds.id,
            userId: data.userId,
          };
        });

        setMessages(newMessages);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (content.current === null) return;

    content.current.scrollTo({
      behavior: 'smooth',
      top: content.current.scrollHeight,
    });
  }, [messages]);

  useEffect(() => {
    const bodyClassName = 'has-tournament-chat-expanded';

    if (isExpanded) {
      document.body.classList.add(bodyClassName);
    } else {
      document.body.classList.remove(bodyClassName);
    }
  }, [isExpanded]);

  useKeyDown(() => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  }, ['escape']);

  return id === null ? null : (
    <section className={classNames(styles.tournamentChat, isExpanded && styles.expanded, className)}>
      <div className={styles.header}>
        <div className={styles.headerSide}>
          <button
            className={styles.headerButton}
            onClick={() => setIsExpanded((previousIsExpanded) => !previousIsExpanded)}
            type="button"
          >
            {isExpanded ? <Shrink /> : <Expand />}
          </button>
        </div>

        <h6 className={styles.title}>
          <FormattedMessage defaultMessage="Chat" />
        </h6>

        <div className={classNames(styles.headerSide, styles.headerRight)} />
      </div>

      <div className={styles.body}>
        <div className={styles.content} ref={content}>
          <div className={styles.messageBox}>
            <ChatNotice>
              <FormattedMessage defaultMessage="This chat is readable by the public and only registered users can write to this chat." />
            </ChatNotice>

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>

        {user !== null && (
          <>
            <ChatCannedResponses onClick={(c: string) => post(c)} />

            <div className={styles.input}>
              <form
                className={styles.form}
                onSubmit={(event) => {
                  event.preventDefault();
                 
                  post(values.message);
                  updateValue('message', '');
                }}
              >
                <TextInput
                  customClasses={styles.chatInput}
                  id="tournament-chat-text-input"
                  label={intl.formatMessage({ defaultMessage: 'Type a message' })}
                  name="message"
                  onChange={updateValue}
                  required
                  value={values.message}
                />

                <Button icon="send" type="submit" variant="secondary" />
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
