import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import Errors from '../Errors';
import Modal from '../Modal';
import styles from './DuelCancel.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  duel: HydratedDuel,
}>;

export default function DuelCancel({ className, duel, ...props }: Props) {
  const { category } = useContext(AnalyticsContext);
  const { api } = useContext(AuthAndApiContext);
  const [errors, setErrors] = useState<Record<string, string[]>>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isCancelVerificationModalOpen, setIsCancelVerificationModalOpen] = useState<boolean>(false);

  return isDisabled ? <ActivityIndicator /> : (
    <>
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

      <div {...props} className={classNames(className, styles.duelCancel)}>
        <Errors errors={errors?.nonFieldErrors} textAlign="center" />

        <div className={styles.wrapper}>
          <p className={styles.message}>
            <FormattedMessage defaultMessage="Anyone hasn't joined to your duel yet. You can cancel if you have changed your mind." />
          </p>

          <Button
            onClick={() => setIsCancelVerificationModalOpen(true)}
            size="large"
            variant="secondary"
          >
            <FormattedMessage defaultMessage="Cancel Duel" />
          </Button>
        </div>
      </div>
    </>
  );
}
