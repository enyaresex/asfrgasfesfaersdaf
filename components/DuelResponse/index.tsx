import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext } from '../../contexts';
import { hydrateGameMode, sendGAEvent } from '../../helpers';
import { useForm } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import Avatar from '../Avatar';
import Button from '../Button';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import RequiredAccountFieldDisplay from '../RequiredAccountFieldDisplay';
import TextInput from '../TextInput';
import styles from './DuelResponse.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  duel: HydratedDuel,
}>;

export default function DuelResponse({ className, duel, ...props }: Props) {
  const { data: user1 } = useSWR<User>(`/users/${duel.user1}/`);
  const { category } = useContext(AnalyticsContext);
  const { api, user } = useContext(AuthAndApiContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean | null>(null);
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}/`);
  const [values, , updateValue, errors, setErrors] = useForm({
    gameUsername: '',
  });
  const hydratedGameMode = useMemo<HydratedGameMode | null>(() => {
    if (gameMode === undefined) return null;

    return hydrateGameMode(gameMode);
  }, [gameMode]);

  useEffect(() => {
    async function handleResponse() {
      if (isAccepted === null) return;

      setIsDisabled(true);

      const response = await api.post(`/duels/${duel.id}/respond/`, {
        accepted: isAccepted,
      });

      const responseJson = await response.json();

      if (response.ok) {
        sendGAEvent({ category, event: isAccepted ? 'Click Accept Invitation' : 'Click Decline Invitation', label: 'Duel Actions' });

        await mutate(`/duels/${duel.id}/`, responseJson);
      } else {
        setErrors(responseJson);
      }

      setIsDisabled(false);
    }

    handleResponse();
  }, [isAccepted]);

  return user1 === undefined || hydratedGameMode === null || user === null ? null : (
    <>
      {isDisabled ? <ActivityIndicator /> : (
        <div {...props} className={classNames(className, styles.duelResponse)}>
          <Errors errors={errors.nonFieldErrors} textAlign="center" />

          <div className={styles.wrapper}>
            <div className={styles.inviteMessage}>
              <Avatar image={user1.avatar} size={30} />

              <p>
                <FormattedMessage
                  defaultMessage="{username} is inviting you to duel."
                  values={{ username: <span className={styles.user}>{user1.username}</span> }}
                />
              </p>
            </div>

            {user[hydratedGameMode.requiredAccountField] === null ? (
              <form
                className={styles.form}
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsDisabled(true);

                  const response = await api.patch('/users/me/', {
                    [hydratedGameMode.requiredAccountField]: values.gameUsername,
                  });

                  const responseJson = await response.json();

                  if (response.ok) {
                    await mutate('/users/me/', responseJson);

                    await setIsAccepted(true);
                  } else {
                    setErrors(responseJson);
                    setIsDisabled(false);
                  }
                }}
              >
                <fieldset className={styles.fieldset} disabled={isDisabled}>
                  <FormGroup error={errors.gameUsername}>
                    <TextInput
                      id="duel-join-username"
                      label={<RequiredAccountFieldDisplay field={hydratedGameMode.requiredAccountFieldStatus} />}
                      name="gameUsername"
                      onChange={updateValue}
                      required
                      value={values.gameUsername}
                    />
                  </FormGroup>

                  <div className={styles.buttons}>
                    <Button disabled={isDisabled} type="submit" variant="green">
                      <FormattedMessage defaultMessage="Accept" />
                    </Button>

                    <Button disabled={isDisabled} onClick={() => setIsAccepted(false)}>
                      <FormattedMessage defaultMessage="Decline" />
                    </Button>
                  </div>
                </fieldset>
              </form>
            ) : (
              <div className={styles.buttons}>
                <Button
                  disabled={isDisabled}
                  onClick={() => setIsAccepted(true)}
                  variant="green"
                >
                  <FormattedMessage defaultMessage="Accept" />
                </Button>

                <Button disabled={isDisabled} onClick={() => setIsAccepted(false)}>
                  <FormattedMessage defaultMessage="Decline" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
