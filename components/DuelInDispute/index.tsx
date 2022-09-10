import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import { AuthAndApiContext } from '../../contexts';
import Button from '../Button';
import DuelDisputeModal from '../DuelDisputeModal';
import { ReactComponent as Bot } from './bot.svg';
import styles from './DuelInDispute.module.css';

type DisputeStatus = 'declined' | 'processing' | 'verified' | 'waiting';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  duel: HydratedDuel,
}>;

export default function DuelInDispute({ className, duel, ...props }: Props) {
  const { user } = useContext(AuthAndApiContext);
  const { data: resultDeclarations } = useSWR<ResultDeclaration[]>(`/duels/result_declarations/?duel=${duel.id}`,
    { refreshInterval: 10000 });
  const [status, setStatus] = useState<DisputeStatus>('waiting');
  const [isDuelPageOpen, setIsDuelPageOpen] = useState<boolean>(false);

  const lastDeclaration = useMemo<ResultDeclaration | null>(() => (
    (resultDeclarations === undefined || resultDeclarations.length === 0)
      ? null
      : resultDeclarations[resultDeclarations.length - 1]),
  [resultDeclarations]);

  useEffect(() => {
    if (user === null || duel.status === 'ENDED') return;

    if (lastDeclaration === null) {
      setStatus('waiting');
    }

    if (lastDeclaration !== null && lastDeclaration.isAccepted === null && lastDeclaration.user1 === user.id) {
      setStatus('processing');
    }

    if (lastDeclaration !== null && lastDeclaration.isAccepted === false && lastDeclaration.user1 === user.id) {
      setStatus('declined');
    }

    if (lastDeclaration !== null && lastDeclaration.isAccepted === true && lastDeclaration.user1 === user.id) {
      setStatus('declined');
    }
  }, [lastDeclaration, user, duel.status]);

  return (
    <>
      <DuelDisputeModal duel={duel} isOpen={isDuelPageOpen} setIsOpen={setIsDuelPageOpen} />

      <div {...props} className={classNames(className, styles.duelInDispute, styles.onlyButton)}>
        {status === 'waiting' && (
          <div className={styles.waiting}>
            <p className={styles.info}>
              <FormattedMessage defaultMessage="Both side has declined the result and duel has disputed. You should upload a proof. " />
            </p>

            <div className={styles.joinButton}>
              <Button onClick={() => setIsDuelPageOpen(true)} type="button">
                <FormattedMessage defaultMessage="Upload Proof" />
              </Button>
            </div>
          </div>
        )}

        {/* {status === 'verified' && ( */}
        {/*  <div className={styles.verified}> */}
        {/*    <Countdown color="yellow" date={new Date().getTime() + 555000} includeDays={false} /> */}

        {/*    <p className={styles.title}> */}
        {/*      <FormattedMessage defaultMessage="Your proof successfully verified!" /> */}
        {/*    </p> */}

        {/*    <p className={styles.description}> */}
        {/*      <FormattedMessage */}
        {/*        defaultMessage="Countdown has started. If the opponent does not report a score */}
        {/*       when the time is up, you will be declared the winner." */}
        {/*      /> */}
        {/*    </p> */}
        {/*  </div> */}
        {/* )} */}

        {status === 'processing' && (
          <div className={styles.processing}>
            <div className={styles.title}>
              <Bot />

              <p>
                <FormattedMessage defaultMessage="is processing the last uploaded proof." />
              </p>
            </div>
          </div>
        )}

        {status === 'declined' && (
          <div className={styles.declined}>
            <div className={styles.title}>
              <Bot />

              <p>
                <FormattedMessage defaultMessage="Can NOT recognize your proof." />
              </p>
            </div>

            <p className={styles.description}>
              <FormattedMessage defaultMessage="The image wasn't recognized by our bot. Please make sure you are uploading a proof that matches the requirements" />
            </p>

            <p className={styles.description}>
              <FormattedMessage defaultMessage="Or contact Gamer Arena admins to resolve this dispute." />
            </p>
            <div className={styles.actions}>
              <Button onClick={() => window?.$crisp?.push(['do', 'chat:toggle'])} type="button">
                <FormattedMessage defaultMessage="Contact Admin" />
              </Button>

              <Button onClick={() => setIsDuelPageOpen(true)} outline type="button">
                <FormattedMessage defaultMessage="Re-Upload Proof" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
