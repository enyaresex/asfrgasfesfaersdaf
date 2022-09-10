import classNames from 'classnames';
import dayjs from 'dayjs';
import firebase from 'firebase/app';
import 'firebase/auth'; // eslint-disable-line import/no-duplicates
import 'firebase/firestore'; // eslint-disable-line import/no-duplicates
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext, ToastsContext } from '../../contexts';
import { getFirestoreCollection, sendGAEvent } from '../../helpers';
import { useForm, useKeyDown } from '../../hooks';
import Button from '../Button';
import ChatCannedResponses from '../ChatCannedResponses';
import ChatMessage from '../ChatMessage';
import ChatNotice from '../ChatNotice';
import TextInput from '../TextInput';
import styles from './DuelChat.module.css';
import { ReactComponent as Expand } from './expand.svg';
import { ReactComponent as Nudge } from './nudge.svg';
import { ReactComponent as Shrink } from './shrink.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  id: number,
}>;

type Form = {
  message: string,
};

const firestoreCollection = getFirestoreCollection('duel-chats');

export default function DuelChat({ className, id }: Props) {
  const db = firebase.firestore();

  const intl = useIntl();
  const [values, , updateValue] = useForm<Form>({
    message: '',
  });
  const { category } = useContext(AnalyticsContext);
  const { api, user } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [messages, setMessages] = useState<HydratedChatMessage[]>([]);
  const [permittedUserIds, setPermittedUserIds] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const content = useRef<HTMLDivElement>(null);

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

  const postingUserId = useMemo<number | null>(() => {
    if (user !== null && permittedUserIds.includes(user.id)) {
      return user.id;
    }

    return null;
  }, [user, permittedUserIds]);

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
            image: data.image,
            userId: data.userId,
          };
        });

        setMessages(newMessages);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = db.collection(firestoreCollection)
      .doc(id.toString())
      .onSnapshot((querySnapshot) => {
        setPermittedUserIds(querySnapshot.data()?.userIds || []);
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
    const bodyClassName = 'has-duel-chat-expanded';

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
    <section className={classNames(styles.duelChat, isExpanded && styles.expanded, className)}>
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

        <div className={classNames(styles.headerSide, styles.headerRight)}>
          {postingUserId !== null && (
            <button
              className={styles.headerButton}
              onClick={async () => {
                const response = await api.get(`/duels/${id}/ping/`);

                const responseJson = await response.json();

                if (response.ok) {
                  sendGAEvent({ category, event: 'Click Ping', label: 'Duel Chat' });

                  await mutate(`/duels/${id}/`, responseJson);
                } else if (responseJson.nonFieldErrors) {
                  addToast({
                    content: responseJson.nonFieldErrors[0],
                    kind: 'warning',
                  });
                }
              }}
              type="button"
            >
              <Nudge />
            </button>
          )}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.content} ref={content}>
          <ChatNotice>
            <FormattedMessage defaultMessage="This chat is readable by the public and only game participants can write to this chat." />
          </ChatNotice>

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        {postingUserId !== null && (
          <>
            <ChatCannedResponses onClick={(c: string) => post(c)} />

            <div className={styles.input}>
              <form
                className={styles.form}
                onSubmit={async (event) => {
                  event.preventDefault();

                  post(values.message);
                  updateValue('message', '');

                  sendGAEvent({ category, event: 'Click Send', label: 'Duel Chat' });
                }}
              >
                <TextInput
                  customClasses={styles.chatInput}
                  id="duel-chat-text-input"
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
