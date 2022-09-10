import classNames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext } from '../../contexts';
import { hydrateGameMode, sendGAEvent } from '../../helpers';
import { useForm } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import Modal from '../Modal';
import RequiredAccountFieldDisplay from '../RequiredAccountFieldDisplay';
import TextInput from '../TextInput';
import styles from './DuelJoin.module.css';
import { ReactComponent as Warning } from './warning.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  duel: HydratedDuel,
}>;

export default function DuelJoin({ className, duel, ...props }: Props) {
  const intl = useIntl();
  const { category } = useContext(AnalyticsContext);
  const { api, user } = useContext(AuthAndApiContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isJoinVerificationModalOpen, setIsJoinVerificationModalOpen] = useState<boolean>(false);
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}/`);
  const { data: userGamePlacementsUser1 } = useSWR<UserGamePlacement[]>(`/games/user_game_placements/?user=${duel.user1}`);
  const { data: userGamePlacementsUser2 } = useSWR<UserGamePlacement[]>(user === null ? null
    : `/games/user_game_placements/?user=${user.id}`);
  const [values, , updateValue, errors, setErrors] = useForm({
    gameUsername: '',
  });
  const hydratedGameMode = useMemo<HydratedGameMode | null>(() => {
    if (gameMode === undefined) return null;

    return hydrateGameMode(gameMode);
  }, [gameMode]);

  const user1UserGamePlacement = useMemo<UserGamePlacement | null>(() => {
    // TODO: If the user1 didn't participate in any duels of this game, they won't have a rank ¯\_(ツ)_/¯
    if (userGamePlacementsUser1 === undefined || gameMode === undefined) return null;

    return userGamePlacementsUser1
      .find((placement) => placement.game === gameMode.game && placement.platform === gameMode.platform) || null;
  }, [gameMode, userGamePlacementsUser1]);

  const user2UserGamePlacement = useMemo<UserGamePlacement | null>(() => {
    if (userGamePlacementsUser2 === undefined || gameMode === undefined) return null;

    return userGamePlacementsUser2
      .find((placement) => placement.game === gameMode.game && placement.platform === gameMode.platform) || null;
  }, [gameMode, userGamePlacementsUser2]);

  return hydratedGameMode === null || user === null ? null
    : (
      <>
        <Modal
          actions={(
            <>
              <Button
                onClick={async () => {
                  setIsDisabled(true);

                  const response = await api.post(`/duels/${duel.id}/join/`, {});

                  const responseJson = await response.json();

                  if (response.ok) {
                    sendGAEvent({ category, event: 'Click Join', label: 'Duel Actions' });

                    await mutate(`/duels/${duel.id}/`, responseJson);
                  } else {
                    setErrors(responseJson);
                  }

                  setIsJoinVerificationModalOpen(false);
                  setIsDisabled(false);
                }}
                type="button"
              >
                <FormattedMessage defaultMessage="Join" />
              </Button>

              <Button
                onClick={() => {
                  setIsJoinVerificationModalOpen(false);

                  setIsDisabled(false);
                }}
                type="button"
                variant="secondary"
              >
                <FormattedMessage defaultMessage="Close" />
              </Button>
            </>
          )}
          isOpen={isJoinVerificationModalOpen}
          onClose={() => {
            setIsJoinVerificationModalOpen(false);

            setIsDisabled(false);
          }}
        >
          <FormattedMessage defaultMessage="Are you sure you want to join the duel?" />
        </Modal>

        {isDisabled ? <ActivityIndicator />
          : (
            <div
              {...props}
              className={classNames(className, styles.duelJoin,
                user[hydratedGameMode.requiredAccountField] !== null && styles.onlyButton)}
            >
              <Errors errors={errors.nonFieldErrors} textAlign="center" />

              {user[hydratedGameMode.requiredAccountField] === null ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsDisabled(true);

                    const response = await api.patch('/users/me/', {
                      [hydratedGameMode.requiredAccountField]: values.gameUsername,
                    });

                    const responseJson = await response.json();

                    if (response.ok) {
                      await mutate('/users/me/', responseJson);

                      setIsJoinVerificationModalOpen(true);
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

                    <Button type="submit">
                      <FormattedMessage defaultMessage="Join" />
                    </Button>
                  </fieldset>
                </form>
              ) : (
                <div className={styles.joinButton}>
                  <Button
                    disabled={isDisabled}
                    onClick={() => setIsJoinVerificationModalOpen(true)}
                    type="button"
                  >
                    <FormattedMessage defaultMessage="Join" />
                  </Button>
                </div>
              )}

              <p className={styles.warning}>
                <FormattedMessage
                  defaultMessage="You should read {DuelRules} before joining duel."
                  values={{
                    DuelRules: (
                      <a href="#duelRules">
                        {intl.formatMessage({ defaultMessage: 'Game Mode and Duel Rules' })}
                      </a>
                    ),
                  }}
                />
              </p>

              {(user1UserGamePlacement !== null
                && user2UserGamePlacement !== null
                && user1UserGamePlacement.rating > user2UserGamePlacement.rating
                && user1UserGamePlacement.rank !== user2UserGamePlacement.rank) && (
                <div className={styles.ratingWarning}>
                  <Warning />

                  <p>
                    <FormattedMessage
                      defaultMessage="<wrap>WARNING:</wrap> Opponent’s rank is higher"
                      values={{
                        wrap: (...chunks: string[]) => (
                          <span className={styles.bold}>{chunks}</span>
                        ),
                      }}
                    />
                  </p>
                </div>
              )}
            </div>
          )}
      </>
    );
}
