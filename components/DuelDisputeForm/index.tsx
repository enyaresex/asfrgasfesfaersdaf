import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AuthAndApiContext } from '../../contexts';
import { useForm } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import FormGroup from '../FormGroup';
import ResultDeclarationDisplay from '../ResultDeclarationDisplay';
import ResultDeclarationDisplayWithScore from '../ResultDeclarationDisplayWithScore';
import { ReactComponent as Check } from './check.svg';
import styles from './DuelDisputeForm.module.css';
import { ReactComponent as Error } from './error.svg';
import { ReactComponent as Screenshot } from './screenshot.svg';

type Props = {
  children?: React.ReactNode,
  duel: Duel,
  onClose: () => void,
  setDuelDisputeStep: React.Dispatch<React.SetStateAction<string>>
};

type Form = {
  image: string | null,
  resultDeclaration: {
    userWon: number | null,
  } | {
    user1Score: number | null,
    user2Score: number | null,
  } | null,
};

const initialValues: Form = {
  image: null,
  resultDeclaration: null,
};

export default function DuelDisputeForm({ children, duel, onClose, setDuelDisputeStep }: Props) {
  const { api, user } = useContext(AuthAndApiContext);
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}`);
  const imageFileInput = useRef<HTMLInputElement>(null);
  const { data: user1 } = useSWR<User>(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR<User>(`/users/${duel.user2}/`);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>(initialValues);

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setErrors({});

    const { files } = event.target;

    if (files === null || files.length !== 1) {
      updateValue('image', null);

      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(files[0]);

    reader.addEventListener('load', async () => {
      if (reader.result === null) return;

      updateValue('image', reader.result.toString());
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      user1 === undefined
      || user2 === undefined
      || user === null
      || values.resultDeclaration === null
    ) return;

    setIsDisabled(true);

    const body = 'userWon' in values.resultDeclaration ? {
      duel: duel.id,
      image: values.image,
      isAccepted: false,
      user2: (user.id === user2.id) ? user1.id : user2.id,
      userWon: values.resultDeclaration.userWon,
    } : {
      duel: duel.id,
      image: values.image,
      isAccepted: false,
      user1Score: (user.id === user2.id) ? values.resultDeclaration.user2Score : values.resultDeclaration.user1Score,
      user2: (user.id === user2.id) ? user1.id : user2.id,
      user2Score: (user.id === user2.id) ? values.resultDeclaration.user1Score : values.resultDeclaration.user2Score,
    };

    const response = await api.post('/duels/result_declarations/', body);

    const responseJson = await response.json();

    if (response.ok) {
      await mutate(`/duels/${duel.id}/`);
      await mutate(`/duels/result_declarations/?duel=${duel.id}`);

      setIsCompleted(true);
    } else {
      setErrors(responseJson);

      setIsCompleted(false);
    }

    setIsDisabled(false);
  }

  useEffect(() => {
    if (gameMode === undefined || values.resultDeclaration !== null) return;

    if (gameMode.isScoreRequired) {
      updateValue('resultDeclaration', {
        user1Score: null,
        user2Score: null,
      });
    } else {
      updateValue('resultDeclaration', {
        userWon: null,
      });
    }
  }, [gameMode, values]);

  return gameMode === undefined || values.resultDeclaration === null ? (
    <ActivityIndicator />
  ) : (
    <div className={styles.duelDisputeForm}>
      {isCompleted === null ? (
        <form onSubmit={onSubmit}>
          <fieldset>
            <div className={styles.section}>
              <div className={styles.sectionTop}>
                <div className={classNames(styles.check, values.image !== null && styles.completed)}>
                  <Check />
                </div>

                <h4>
                  <FormattedMessage defaultMessage="Upload the Screenshot" />
                </h4>
              </div>

              <FormGroup>
                <div className={styles.imageFile}>
                  <input
                    className={styles.imageFileInput}
                    name="image"
                    onChange={handleFileInputChange}
                    ref={imageFileInput}
                    type="file"
                  />

                  {values.image === null ? (
                    <button
                      className={styles.imageFileInputButton}
                      onClick={() => {
                        imageFileInput.current?.click();
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                      }}
                      onDrop={(event) => {
                        event.preventDefault();

                        if (event.dataTransfer.files.length === 1) {
                          const reader = new FileReader();

                          reader.addEventListener('load', (readerEvent) => {
                            if (readerEvent.target?.result) {
                              updateValue('image', readerEvent.target.result.toString());
                            }
                          });

                          reader.readAsDataURL(event.dataTransfer.files[0]);
                        }
                      }}
                      type="button"
                    >
                      <Screenshot />

                      <span>
                        <FormattedMessage defaultMessage="Choose a file" />
                      </span>
                    </button>
                  ) : (
                    <>
                      <img alt="screenshot" className={styles.imageFilePreview} src={values.image} />

                      <button
                        className={styles.imageFileInputReUploadButton}
                        onClick={() => {
                          imageFileInput.current?.click();
                        }}
                        onDragOver={(event) => {
                          event.preventDefault();
                        }}
                        onDrop={(event) => {
                          event.preventDefault();

                          if (event.dataTransfer.files.length === 1) {
                            const reader = new FileReader();

                            reader.addEventListener('load', (readerEvent) => {
                              if (readerEvent.target?.result) {
                                updateValue('image', readerEvent.target.result.toString());
                              }
                            });

                            reader.readAsDataURL(event.dataTransfer.files[0]);
                          }
                        }}
                        type="button"
                      >
                        <FormattedMessage defaultMessage="Upload Another Screenshot" />
                      </button>
                    </>
                  )}
                </div>
              </FormGroup>

              <div className={styles.sectionTop}>
                <div
                  className={classNames(
                    styles.check,
                    (
                      ('userWon' in values.resultDeclaration && values.resultDeclaration.userWon !== null)
                      || (
                        'user1Score' in values.resultDeclaration
                        && values.resultDeclaration.user1Score !== null
                        && values.resultDeclaration.user2Score !== null
                      )) && styles.completed,
                  )}
                >
                  <Check />
                </div>

                <h4>
                  {gameMode.isScoreRequired ? (
                    <FormattedMessage defaultMessage="Check the Score" />
                  ) : (
                    <FormattedMessage defaultMessage="Check the Winner" />
                  )}
                </h4>
              </div>

              <FormGroup>
                {'userWon' in values.resultDeclaration
                  ? (
                    <ResultDeclarationDisplay
                      duel={duel}
                      errors={errors}
                      isDisabled={isDisabled}
                      setUserWon={(userWon: number | null) => setValues({ ...values, resultDeclaration: { userWon } })}
                      userWon={values.resultDeclaration.userWon}
                    />
                  )
                  : (
                    <ResultDeclarationDisplayWithScore
                      duel={duel}
                      errors={errors}
                      isDisabled={isDisabled}
                      scores={values.resultDeclaration}
                      setScores={({ user1Score, user2Score }) => {
                        setValues({
                          ...values,
                          resultDeclaration: { user1Score: Number(user1Score), user2Score: Number(user2Score) },
                        });
                      }}
                    />
                  )}
              </FormGroup>
            </div>

            <Button disabled={isDisabled} fullWidth size="large" type="submit">
              <FormattedMessage defaultMessage="Upload Screenshot" />
            </Button>

            <div className={styles.children}>
              {children}
            </div>
          </fieldset>
        </form>
      ) : (
        <div className={classNames(styles.result, isCompleted ? styles.success : styles.error)}>
          <div className={styles.resultIcon}>
            {isCompleted ? <Check /> : <Error />}
          </div>

          <h3 className={styles.resultTitle}>
            {isCompleted ? (
              <FormattedMessage defaultMessage="Upload Successful" />
            ) : (
              <FormattedMessage defaultMessage="Upload Failed" />
            )}
          </h3>

          <div className={styles.resultDescription}>
            <FormattedMessage defaultMessage="Your image is being processed. You can enjoy other duels during we are checking the results." />
          </div>

          <div className={styles.resultActions}>
            {isCompleted ? (
              <Button onClick={onClose} type="button">
                <FormattedMessage defaultMessage="Close" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => window.$crisp?.push(['do', 'open'])}
                  type="button"
                >
                  <FormattedMessage defaultMessage="Contact Support" />
                </Button>

                <Button
                  onClick={() => {
                    setValues(initialValues);
                    setDuelDisputeStep('description');
                  }}
                  outline
                  type="button"
                >
                  <FormattedMessage defaultMessage="Start Over" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
