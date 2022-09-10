import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import ActivityIndicator from '../ActivityIndicator';
import Avatar from '../Avatar';
import Button from '../Button';
import Countdown from '../Countdown';
import Errors from '../Errors';
import Modal from '../Modal';
import styles from './DuelCheckIn.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  duel: Duel,
}>;

export default function DuelCheckIn({ className, duel, ...props }: Props) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { category } = useContext(AnalyticsContext);
  const { api, user } = useContext(AuthAndApiContext);
  const [errors, setErrors] = useState<Record<string, string[]>>();
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [isLeaveVerificationModalOpen, setIsLeaveVerificationModalOpen] = useState<boolean>(false);
  const [isCancelVerificationModalOpen, setIsCancelVerificationModalOpen] = useState<boolean>(false);
  const { data: user1 } = useSWR<User>(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR<User>(`/users/${duel.user2}/`);

  const WaitingForOpponent = () => useMemo(() => (
    <>
      <p className={classNames(styles.inviteMessage, styles.white)}>
        <FormattedMessage defaultMessage="The match will start when your opponent is ready." />
      </p>

      <Countdown
        color="yellow"
        date={(() => {
          if (duel.user1CheckInExpiresAt !== null) {
            return dayjs(duel.user1CheckInExpiresAt).valueOf();
          }

          if (duel.user2CheckInExpiresAt !== null) {
            return dayjs(duel.user2CheckInExpiresAt).valueOf();
          }

          return Date.now() + 90000;
        })()}
      />

      <p className={styles.details}>
        <FormattedMessage defaultMessage="Make sure both you and your opponent checked in ready before playing the game. Otherwise, your duel will be canceled even if you win and you won't get the duel reward tokens." />
      </p>
    </>
  ), [duel]);

  useEffect(() => {
    if (!isCheckedIn) return;

    async function handleCheckIn() {
      setIsDisabled(true);

      if (user === null || user1 === undefined) return;

      const response = await api.post(`/duels/${duel.id}/check_in/`, {});
      const responseJson = await response.json();

      if (response.ok) {
        sendGAEvent({
          category,
          event: user.id === user1.id ? 'Click Start' : 'Click Check-in',
          label: 'Duel Actions',
        });

        await mutate(`/duels/${duel.id}/`, responseJson);
      } else {
        setErrors(responseJson);
      }

      setIsDisabled(false);
    }

    handleCheckIn();
  }, [isCheckedIn]);

  return user === null || user1 === undefined || user2 === undefined ? null : (
    <>
      <Modal
        actions={(
          <>
            <Button
              onClick={async () => {
                setIsDisabled(true);

                const response = await api.get(`/duels/${duel.id}/leave/`);
                const responseJson = await response.json();

                if (response.ok) {
                  sendGAEvent({ category, event: 'Click Leave', label: 'Duel Actions' });

                  await mutate(`/duels/${duel.id}/`, responseJson);
                } else {
                  setErrors(responseJson);
                }

                setIsLeaveVerificationModalOpen(false);
                setIsDisabled(false);
              }}
              type="button"
            >
              <FormattedMessage defaultMessage="Leave" />
            </Button>

            <Button
              onClick={() => {
                setIsLeaveVerificationModalOpen(false);

                setIsDisabled(false);
              }}
              type="button"
              variant="secondary"
            >
              <FormattedMessage defaultMessage="Close" />
            </Button>
          </>
        )}
        isOpen={isLeaveVerificationModalOpen}
        onClose={() => {
          setIsLeaveVerificationModalOpen(false);

          setIsDisabled(false);
        }}
      >
        <FormattedMessage defaultMessage="Are you sure you want to leave the duel?" />
      </Modal>

      <Modal
        actions={(
          <>
            <Button
              onClick={async () => {
                setIsDisabled(true);

                const response = await api.post(`/duels/${duel.id}/cancel/`, {});
                const responseJson = await response.json();

                if (response.ok) {
                  sendGAEvent({ category, event: 'Click Cancel', label: 'Duel Actions' });

                  await mutate(`/duels/${duel.id}/`, responseJson);
                } else {
                  setErrors(responseJson);
                }

                setIsCancelVerificationModalOpen(false);
                setIsDisabled(false);
              }}
              type="button"
            >
              <FormattedMessage defaultMessage="Cancel Duel" />
            </Button>

            <Button
              onClick={() => {
                setIsCancelVerificationModalOpen(false);

                setIsDisabled(false);
              }}
              type="button"
              variant="secondary"
            >
              <FormattedMessage defaultMessage="Close" />
            </Button>
          </>
        )}
        isOpen={isCancelVerificationModalOpen}
        onClose={() => {
          setIsCancelVerificationModalOpen(false);

          setIsDisabled(false);
        }}
      >
        <FormattedMessage defaultMessage="Are you sure you want to cancel the duel?" />
      </Modal>

      {isDisabled ? <ActivityIndicator />
        : (
          <div {...props} className={classNames(className, styles.duelCheckIn)}>
            <Errors errors={errors?.nonFieldErrors} textAlign="center" />

            <div className={styles.wrapper}>
              {user.id === user1.id && (
                <>
                  {duel.user2CheckedInAt === null && duel.user1CheckedInAt !== null && <WaitingForOpponent />}

                  {duel.user1CheckedInAt === null && (
                    <>
                      <div className={styles.inviteMessage}>
                        <Avatar image={user2.avatar} size={30} />

                        <p>
                          <FormattedMessage
                            defaultMessage="{username} is waiting you to start match."
                            values={{ username: <span className={styles.user}>{user2.username}</span> }}
                          />
                        </p>
                      </div>

                      <div className={styles.cta}>
                        <Button
                          disabled={isDisabled}
                          onClick={() => setIsCheckedIn(true)}
                          size="large"
                          variant="green"
                        >
                          <FormattedMessage defaultMessage="Start the Match" />
                        </Button>
                      </div>

                      <button
                        className={styles.cancelDuel}
                        onClick={() => setIsCancelVerificationModalOpen(true)}
                        type="button"
                      >
                        <FormattedMessage defaultMessage="Cancel Duel" />
                      </button>
                    </>
                  )}
                </>
              )}

              {user.id === user2.id && (
                <>
                  {duel.user1CheckedInAt === null && duel.user2CheckedInAt !== null && <WaitingForOpponent />}

                  {duel.user2CheckedInAt === null && (
                    <>
                      <div className={styles.inviteMessage}>
                        <Avatar image={user1.avatar} size={30} />

                        <p>
                          <FormattedMessage
                            defaultMessage="{username} is waiting you to check in."
                            values={{ username: <span className={styles.user}>{user1.username}</span> }}
                          />
                        </p>
                      </div>

                      <div className={styles.cta}>
                        <Button
                          disabled={isDisabled}
                          onClick={() => setIsCheckedIn(true)}
                          size="large"
                          variant="green"
                        >
                          <FormattedMessage defaultMessage="Check In" />
                        </Button>
                      </div>

                      <button
                        className={styles.cancelDuel}
                        onClick={() => setIsLeaveVerificationModalOpen(true)}
                        type="button"
                      >
                        <FormattedMessage defaultMessage="Leave Duel" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
    </>
  );
}
