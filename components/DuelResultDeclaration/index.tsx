import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import { useForm } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import Errors from '../Errors';
import ResultDeclarationDisplay from '../ResultDeclarationDisplay';
import ResultDeclarationDisplayWithScore from '../ResultDeclarationDisplayWithScore';
import styles from './DuelResultDeclaration.module.css';
import { ReactComponent as Info } from './info.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  duel: Duel,
}>;

type Form = {
  userWon: number | null,
} | {
  user1Score: number | null,
  user2Score: number | null,
} | null;

type ResultDeclarationStep = 'declareResult' | 'respondToDeclaration' | 'waitForResponse';

export default function DuelResultDeclaration({ className, duel, ...props }: Props) {
  const { category } = useContext(AnalyticsContext);
  const { api, user } = useContext(AuthAndApiContext);
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}/`);
  const { data: user1 } = useSWR<User>(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR<User>(`/users/${duel.user2}/`);
  const { data: resultDeclarations } = useSWR<ResultDeclaration[]>(`/duels/result_declarations/?duel=${duel.id}`);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [resultDeclarationStep, setResultDeclarationStep] = useState<ResultDeclarationStep>('declareResult');

  const [values, setValues, , errors, setErrors] = useForm<Form>(null);

  const lastDeclaration = useMemo<ResultDeclaration | null>(() => (
    (resultDeclarations === undefined || resultDeclarations.length === 0)
      ? null
      : resultDeclarations[resultDeclarations.length - 1]),
  [resultDeclarations]);

  useEffect(() => {
    if (gameMode === undefined) return;

    setValues(gameMode.isScoreRequired ? {
      user1Score: null,
      user2Score: null,
    } : {
      userWon: null,
    });
  }, [gameMode]);

  useEffect(() => {
    if (user === null || lastDeclaration === null || user1 === undefined || values === null) return;

    if ('user1Score' in values) {
      setValues({
        user1Score: lastDeclaration.user1 === user1.id ? lastDeclaration.user1Score : lastDeclaration.user2Score,
        user2Score: lastDeclaration.user1 === user1.id ? lastDeclaration.user2Score : lastDeclaration.user1Score,
      });
    } else if ('userWon' in values) {
      setValues({
        userWon: lastDeclaration.userWon,
      });
    }

    if (lastDeclaration.user1 === user.id && (lastDeclaration.isAccepted === null || lastDeclaration.isAccepted === false)) {
      setResultDeclarationStep('waitForResponse');
    }

    if (lastDeclaration.user2 === user.id && lastDeclaration.isAccepted === null) {
      setResultDeclarationStep('respondToDeclaration');
    }

    if (lastDeclaration.user2 === user.id && lastDeclaration.isAccepted === false) {
      setResultDeclarationStep('declareResult');

      setValues('userWon' in values ? {
        userWon: null,
      } : {
        user1Score: null,
        user2Score: null,
      });
    }
  }, [lastDeclaration, user, user1]);

  return user1 === undefined || user2 === undefined || gameMode === undefined ? null : (
    <>
      {isDisabled || values === null ? <ActivityIndicator /> : (
        <div {...props} className={classNames(className, styles.duelResultDeclaration)}>
          <Errors errors={errors.nonFieldErrors} />

          {resultDeclarationStep === 'declareResult' && (
            <p className={styles.muted}>
              <FormattedMessage defaultMessage="In order to end the duel, you need to declare the result." />
            </p>
          )}

          {resultDeclarationStep === 'respondToDeclaration' && (
            <p className={styles.muted}>
              <FormattedMessage defaultMessage="Your opponent has declared the result." />
            </p>
          )}

          {'userWon' in values
            ? (
              <ResultDeclarationDisplay
                duel={duel}
                errors={errors}
                isDisabled={isDisabled || resultDeclarationStep === 'waitForResponse' || resultDeclarationStep === 'respondToDeclaration'}
                setUserWon={(userWon: number | null) => setValues({ userWon })}
                userWon={values.userWon}
              />
            )
            : (
              <ResultDeclarationDisplayWithScore
                duel={duel}
                errors={errors}
                isDisabled={isDisabled || resultDeclarationStep === 'waitForResponse' || resultDeclarationStep === 'respondToDeclaration'}
                scores={values}
                setScores={(setValues as React.Dispatch<React.SetStateAction<{
                  user1Score: number | null,
                  user2Score: number | null,
                }>>)}
              />
            )}

          <div className={styles.buttonWrapper}>
            {resultDeclarationStep === 'declareResult' && (
              <Button
                onClick={async () => {
                  if (user === null || resultDeclarations === undefined) return;

                  setIsDisabled(true);

                  const isReSubmit = resultDeclarations.length > 0 && lastDeclaration !== null && lastDeclaration.isAccepted === null;

                  const body = 'userWon' in values ? {
                    isAccepted: isReSubmit ? false : undefined,
                    duel: duel.id,
                    user2: (user.id === user2.id) ? user1.id : user2.id,
                    userWon: values.userWon,
                  } : {
                    isAccepted: isReSubmit ? false : undefined,
                    duel: duel.id,
                    user1Score: (user.id === user2.id) ? values.user2Score : values.user1Score,
                    user2: (user.id === user2.id) ? user1.id : user2.id,
                    user2Score: (user.id === user2.id) ? values.user1Score : values.user2Score,
                  };

                  const response = isReSubmit && lastDeclaration !== null
                    ? await api.post(`/duels/result_declarations/${lastDeclaration.id}/respond/`, body)
                    : await api.post('/duels/result_declarations/', body);

                  const responseJson = await response.json();

                  if (response.ok) {
                    if (isReSubmit) {
                      sendGAEvent({ category, event: 'Click Decline Declaration', label: 'Duel Actions' });
                    }

                    await mutate(`/duels/${duel.id}/`);

                    await mutate(`/duels/result_declarations/?duel=${duel.id}`);

                    if (lastDeclaration !== null) {
                      if (user.id === lastDeclaration.user1) {
                        setResultDeclarationStep('waitForResponse');
                      } else {
                        setResultDeclarationStep('respondToDeclaration');
                      }
                    }
                  } else {
                    setErrors(responseJson);
                  }

                  setIsDisabled(false);
                }}
                size="large"
                type="button"
                variant="green"
              >
                <FormattedMessage defaultMessage="Declare Result" />
              </Button>
            )}

            {resultDeclarationStep === 'respondToDeclaration' && (
              <>
                <div className={styles.cta}>
                  <Button
                    onClick={() => {
                      setValues('userWon' in values ? {
                        userWon: null,
                      } : {
                        user1Score: null,
                        user2Score: null,
                      });

                      setResultDeclarationStep('declareResult');
                    }}
                    size="large"
                    type="button"
                  >
                    <FormattedMessage defaultMessage="Decline Result" />
                  </Button>

                  <Button
                    onClick={async () => {
                      if (lastDeclaration === null || user === null || user1 === undefined || user2 === undefined) return;

                      setIsDisabled(true);

                      const response = await api.post(`/duels/result_declarations/${lastDeclaration.id}/respond/`, {
                        isAccepted: true,
                      });

                      const responseJson = await response.json();

                      if (response.ok) {
                        sendGAEvent({ category, event: 'Click Accept Declaration', label: 'Duel Actions' });

                        await mutate(`/duels/${duel.id}/`);

                        await mutate(`/duels/result_declarations/?duel=${duel.id}`);
                      } else {
                        setErrors(responseJson);
                      }

                      setIsDisabled(false);
                    }}
                    size="large"
                    type="button"
                    variant="green"
                  >
                    <FormattedMessage defaultMessage="Accept Result" />
                  </Button>
                </div>

                <button
                  className={styles.notPlayed}
                  onClick={async () => {
                    if (lastDeclaration === null || user === null || user1 === undefined || user2 === undefined) return;

                    setIsDisabled(true);

                    const response = await api.post(`/duels/result_declarations/${lastDeclaration.id}/respond/`, {
                      isAccepted: false,
                    });

                    const responseJson = await response.json();

                    if (response.ok) {
                      sendGAEvent({ category, event: 'Click Match Not Played', label: 'Duel Actions' });

                      await mutate(`/duels/${duel.id}/`);

                      await mutate(`/duels/result_declarations/?duel=${duel.id}`);

                      setResultDeclarationStep('declareResult');

                      setValues('userWon' in values ? {
                        userWon: null,
                      } : {
                        user1Score: null,
                        user2Score: null,
                      });
                    } else {
                      setErrors(responseJson);
                    }

                    setIsDisabled(false);
                  }}
                  type="button"
                >
                  <FormattedMessage defaultMessage="This match is not played" />
                </button>
              </>
            )}

            {resultDeclarationStep === 'waitForResponse' && (
              <div className={styles.info}>
                <Info />

                <p>
                  <FormattedMessage defaultMessage="Waiting for your opponent to respond to your result declaration. After 1 hour, your declaration will be automatically accepted if not responded." />
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
