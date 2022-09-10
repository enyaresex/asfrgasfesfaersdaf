import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useContext, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext, BreakpointContext, RegionContext } from '../../contexts';
import { hydrateGameMode, sendGAEvent } from '../../helpers';
import { useForm } from '../../hooks';
import Button from '../Button';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import GameModeTooltip from '../GameModeTooltip';
import Modal from '../Modal';
import RequiredAccountFieldDisplay from '../RequiredAccountFieldDisplay';
import Select from '../Select';
import TextInput from '../TextInput';
import styles from './LeaderboardTournamentQuickDuel.module.css';

type Form = {
  entryFee: number,
  gameMode: number | null,
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  leaderboard: Leaderboard,
}>;

export default function LeaderboardTournamentQuickDuel({ className, leaderboard, ...props }: Props) {
  const intl = useIntl();
  const router = useRouter();
  const { category } = useContext(AnalyticsContext);
  const { device } = useContext(BreakpointContext);
  const { api, user } = useContext(AuthAndApiContext);
  const { region } = useContext(RegionContext);
  const { data: gameModes } = useSWR<GameMode[]>(`/games/game_modes?is_active=true&game=${leaderboard.game}&region=${region.id}`);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [requiredAccountField, setRequiredAccountField] = useState<string | null>(null);
  const [values, , updateValue, errors, setErrors] = useForm<Form>({
    entryFee: 50,
    gameMode: null,
  });

  const { data: gameMode } = useSWR<GameMode>(values.gameMode === null
    ? null
    : `/games/game_modes/${values.gameMode}/?region=${region.id}`);

  const hydratedGameMode = useMemo<HydratedGameMode | null>(() => {
    if (gameMode === undefined) return null;

    return hydrateGameMode(gameMode);
  }, [gameMode]);

  const subInfo = useMemo(() => (
    <div className={styles.sub}>
      <GameModeTooltip className={styles.gameModeTooltip} gameModeId={values.gameMode} />
    </div>
  ), [values]);

  return user === null ? null : (
    <>
      <Modal
        actions={(
          <>
            <Button disabled={isDisabled} onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              <FormattedMessage defaultMessage="Cancel" />
            </Button>

            <Button
              disabled={isDisabled}
              onClick={async () => {
                // this is here only as a type guard
                if (hydratedGameMode === null) return;

                setIsDisabled(true);

                if (requiredAccountField !== null) {
                  const requiredAccountFieldResponse = await api.patch('/users/me/', {
                    [hydratedGameMode.requiredAccountField]: requiredAccountField,
                  });

                  const requiredAccountFieldResponseJson = await requiredAccountFieldResponse.json();

                  if (!requiredAccountFieldResponse.ok) {
                    // patch failed, let's not continue.
                    return;
                  }

                  await mutate('/users/me/', requiredAccountFieldResponseJson);
                }

                const response = await api.post('/duels/get_or_create/', {
                  ...values,
                  leaderboard: leaderboard.id,
                });

                const responseJson = await response.json();

                if (response.ok) {
                  sendGAEvent({ category, event: 'Click Find Duel', label: leaderboard.name });

                  await router.push(`/duels/duel?id=${responseJson.id}`);
                } else {
                  setIsDisabled(false);
                  setErrors(responseJson);
                }

                setIsModalOpen(false);
              }}
              type="button"
            >
              <FormattedMessage defaultMessage="Join Duel" />
            </Button>
          </>
      )}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <FormattedMessage defaultMessage="You will join a duel based on your rating or create a new duel if there aren't any open. Continue?" />
      </Modal>

      <section {...props} className={classNames(styles.leaderboardTournamentQuickDuel, className)}>
        <div className={styles.header}>
          <h4><FormattedMessage defaultMessage="Matchmaking" /></h4>
        </div>

        <div className={styles.body}>
          <p className={styles.muted}>
            <FormattedMessage defaultMessage="Find the opponent with the closest rank." />
          </p>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              setIsModalOpen(true);
            }}
          >
            <fieldset className={styles.fieldset} disabled={isDisabled}>
              <Errors errors={errors.nonFieldErrors} />
              <Errors errors={errors.leaderboard} />

              <FormGroup className={styles.formGroup} error={errors.gameMode}>
                <Select
                  id="quick-duel-select-game-mode"
                  label={intl.formatMessage({ defaultMessage: 'Game Mode' })}
                  name="gameMode"
                  onChange={(e) => {
                    updateValue('gameMode', Number(e.target.value));

                    if (gameModes !== undefined) {
                      sendGAEvent({
                        category,
                        event: 'Select Game Mode',
                        label: leaderboard.name,
                        value: gameModes.find((gm) => gm.id === Number(e.target.value))?.name,
                      });
                    }
                  }}
                  required
                  size="large"
                  value={values.gameMode === null ? '' : values.gameMode}
                >
                  {values.gameMode === null && (
                  <option aria-label="gameMode" disabled value="" />
                  )}

                  {gameModes !== undefined && gameModes.map(({ id, name }) => (
                    <option key={name} value={id}>{name}</option>
                  ))}
                </Select>
              </FormGroup>

              {(hydratedGameMode !== null && user[hydratedGameMode.requiredAccountField] === null) && (
              <FormGroup className={styles.formGroup}>
                <TextInput
                  id="quickDuel-required-account-field"
                  label={<RequiredAccountFieldDisplay field={hydratedGameMode.requiredAccountFieldStatus} />}
                  name="requiredAccountField"
                  onChange={(e) => setRequiredAccountField(e.target.value)}
                  required
                  size="large"
                  value={requiredAccountField || ''}
                />
              </FormGroup>
              )}

              <FormGroup className={styles.formGroup} error={errors.entryFee}>
                <Select
                  disabled={values.gameMode === null}
                  id="quick-duel-select-entry-fee"
                  label={intl.formatMessage({ defaultMessage: 'Entry Fee' })}
                  name="entryFee"
                  onChange={updateValue}
                  required
                  size="large"
                  value={values.entryFee}
                >
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                </Select>
              </FormGroup>

              {device === 'mobile' && subInfo}

              <Button className={styles.button} type="submit">
                <FormattedMessage defaultMessage="Join Duel" />
              </Button>
            </fieldset>
          </form>

          {device !== 'mobile' && subInfo}
        </div>
      </section>
    </>
  );
}
