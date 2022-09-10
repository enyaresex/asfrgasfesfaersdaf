import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import DuelDisputeForm from '../DuelDisputeForm';
import Modal from '../Modal';
import styles from './DuelDisputeModal.module.css';

type Props = {
  duel: HydratedDuel,
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<Props['isOpen']>>,
};

export default function DuelDisputeModal({ duel, isOpen, setIsOpen }: Props) {
  const intl = useIntl();
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}/`);
  const [step, setStep] = useState<string>('description');

  return (
    <Modal
      className={styles.duelDisputeModal}
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setStep('description');
      }}
      size="large"
      title={intl.formatMessage({ defaultMessage: 'Upload Screenshot' })}
    >
      {step === 'description' && (
        <>
          {gameMode === undefined ? <ActivityIndicator /> : (
            <div className={styles.description}>

              {gameMode.sampleOcrImage !== null && (
                <img alt="sample screenshot" className={styles.sampleScreenshot} src={gameMode.sampleOcrImage} />
              )}

              <ol className={styles.rules}>
                <li>
                  <div className={styles.rule}>
                    <FormattedMessage defaultMessage="The proof we are expecting looks like the example above. Any other type of screenshot from a different part of the game can’t be verified." />
                  </div>
                </li>

                <li>
                  <div className={styles.rule}>
                    <FormattedMessage defaultMessage="Pictures taken by a camera can’t be verified, we need screenshots." />
                  </div>
                </li>

                <li>
                  <div className={styles.rule}>
                    <FormattedMessage defaultMessage="Game account usernames and declared results of both sides should match fully with the info on Gamer Arena." />
                  </div>
                </li>

                <li>
                  <div className={styles.rule}>
                    <FormattedMessage defaultMessage="Any user trying to upload a photoshopped proof will be detected and banned." />
                  </div>
                </li>

                <li>
                  <div className={styles.rule}>
                    <FormattedMessage defaultMessage="Any user trying to upload a proof that is not related to this match will be penaltied." />
                  </div>
                </li>
              </ol>

              <Button
                className={styles.continueButton}
                fullWidth
                onClick={() => setStep('form')}
                type="button"
              >
                <FormattedMessage defaultMessage="Continue" />
              </Button>
            </div>
          )}
        </>

      )}

      {step === 'form' && (
        <>
          <DuelDisputeForm duel={duel} onClose={() => setIsOpen(false)} setDuelDisputeStep={setStep}>
            <Button fullWidth onClick={() => setStep('description')} variant="secondary">
              <FormattedMessage defaultMessage="Go Back" />
            </Button>
          </DuelDisputeForm>
        </>
      )}
    </Modal>
  );
}
