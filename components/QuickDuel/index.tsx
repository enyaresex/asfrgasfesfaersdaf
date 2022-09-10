import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { entryFeeChoices } from '../../constants';
import {
  AnalyticsContext,
  AuthAndApiContext,
  BreakpointContext,
  FilterSortContext,
  RegionContext,
} from '../../contexts';
import { createGtag, hydrateGameMode, sendGAEvent } from '../../helpers';

import { useForm } from '../../hooks';
import Button from '../Button';
import FormGroup from '../FormGroup';
import GameModeTooltip from '../GameModeTooltip';
import Modal from '../Modal';
import QuickDuelTournamentInfo from '../QuickDuelTournamentInfo';
import RequiredAccountFieldDisplay from '../RequiredAccountFieldDisplay';
import Select from '../Select';
import TextInput from '../TextInput';
import styles from './QuickDuel.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

type Form = {
  entryFee: number,
  requiredAccountField: string,
};

export default function QuickDuel({ className, ...props }: Props) {
  const router = useRouter();
  const intl = useIntl();
  const { api, user } = useContext(AuthAndApiContext);
  const { region } = useContext(RegionContext);
  const { breakpoint } = useContext(BreakpointContext);
  const { category } = useContext(AnalyticsContext);
  const { selectedDuelFilters, setSelectedDuelFilters } = useContext(FilterSortContext);
  const requiredAccountFieldRef = useRef<HTMLDivElement>(null);

  const [requiredAccountField, setRequiredAccountField] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [values, , updateValue, errors, setErrors] = useForm<Form>({
    entryFee: 20,
    requiredAccountField: '',
  });

  const { data: gameModes } = useSWR<GameMode[]>(selectedDuelFilters.game === null || selectedDuelFilters.platform === null ? null
    : `/games/game_modes/?is_active=true&game=${selectedDuelFilters.game}&platform=${selectedDuelFilters.platform}&region=${region.id}`);
  const { data: games } = useSWR<Game[]>(`/games/?is_active=true&region=${region.id}`);
  const { data: platforms } = useSWR<Platform[]>(selectedDuelFilters.game === null
    ? null
    : `/games/platforms/?is_active=true&game=${selectedDuelFilters.game}&region=${region.id}`);
  const { data: gameMode } = useSWR<GameMode>(selectedDuelFilters.gameMode === null ? null
    : `/games/game_modes/${selectedDuelFilters.gameMode}/?region=${region.id}`);

  const hydratedGameMode = useMemo<HydratedGameMode | null>(() => {
    if (gameMode === undefined) return null;

    return hydrateGameMode(gameMode);
  }, [gameMode]);

  useEffect(() => {
    if (selectedDuelFilters.game === null && games?.length === 1) {
      setSelectedDuelFilters({
        ...selectedDuelFilters,
        game: games[0].id,
        gameMode: null,
        platform: null,
      });
    }
  }, [games, selectedDuelFilters.game]);

  useEffect(() => {
    if (selectedDuelFilters.platform === null && platforms?.length === 1) {
      setSelectedDuelFilters({
        ...selectedDuelFilters,
        gameMode: null,
        platform: platforms[0].id,
      });
    }
  }, [platforms, selectedDuelFilters.platform]);

  useEffect(() => {
    if (selectedDuelFilters.gameMode === null && gameModes?.length === 1) {
      setSelectedDuelFilters({
        ...selectedDuelFilters,
        gameMode: gameModes[0].id,
      });
    }
  }, [gameModes, selectedDuelFilters.gameMode]);

  const gameRules = useMemo(() => (selectedDuelFilters.gameMode === null ? null : (
    <div className={classNames(['xl', 'xxl'].includes(breakpoint) ? styles.info : styles.subInfo)}>
      <GameModeTooltip gameModeId={selectedDuelFilters.gameMode} />
    </div>
  )), [breakpoint, selectedDuelFilters.gameMode]);

  return games === undefined || user === null
    ? null
    : (
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

                    if (requiredAccountFieldResponse.ok) {
                      await mutate('/users/me/', requiredAccountFieldResponseJson);
                    } else {
                      return;
                    }
                  }

                  const response = await api.post('/duels/get_or_create/', { ...selectedDuelFilters, ...values });
                  const responseJson = await response.json();

                  if (response.ok) {
                    sendGAEvent({
                      category,
                      event: 'Click Find Duel',
                      label: 'Quick Duel',
                    });

                    await router.push(`/duels/duel?id=${responseJson.id}`);
                  } else {
                    setErrors(responseJson);
                  }

                  setIsModalOpen(false);
                  setIsDisabled(false);
                }}
                type="button"
              >
                <FormattedMessage defaultMessage="Find Duel" />
              </Button>
            </>
          )}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <FormattedMessage defaultMessage="You will join a duel based on your rating or create a new duel if there aren't any open. Continue?" />
        </Modal>

        <section {...props} className={classNames(className, styles.quickDuel)} data-cy="quickDuel">
          <div className={styles.header}>
            <h4>
              <FormattedMessage defaultMessage="Quick Duel" />
            </h4>
          </div>

          <div className={styles.content}>
            <div className={styles.description}>
              <FormattedMessage defaultMessage="Quickly join or create the optimum duel for you." />
            </div>

            <form
              className={styles.form}
              onSubmit={async (event) => {
                event.preventDefault();

                setIsModalOpen(true);
              }}
            >
              <fieldset
                className={classNames(styles.fieldset,
                  (hydratedGameMode !== null && user[hydratedGameMode.requiredAccountField] === null) && styles.accountNeeded)}
                disabled={isDisabled}
              >
                <div className={classNames(styles.inputs,
                  hydratedGameMode !== null && user[hydratedGameMode.requiredAccountField] === null && styles.hydrated)}
                >
                  <FormGroup className={styles.formGroup} error={errors.game}>
                    <Select
                      id="quick-duel-select-game"
                      label={intl.formatMessage({ defaultMessage: 'Game' })}
                      name="game"
                      onChange={(event) => {
                        const game = Number(event.target.value);

                        setSelectedDuelFilters({ game, gameMode: null, platform: null });

                        sendGAEvent({
                          category,
                          event: 'Select Game',
                          label: 'Quick Duel',
                          value: games.find((g) => g.id === game)?.name,
                        });
                      }}
                      required
                      size="large"
                      value={selectedDuelFilters.game === null ? '' : selectedDuelFilters.game}
                    >
                      {selectedDuelFilters.game === null && (
                        <option aria-label="game" disabled value="" />
                      )}

                      {games.map(({ id, name }) => <option key={name} value={id}>{name}</option>)}
                    </Select>
                  </FormGroup>

                  <FormGroup className={styles.formGroup} error={errors.platform}>
                    <Select
                      disabled={selectedDuelFilters.game === null}
                      id="quick-duel-select-platform"
                      label={intl.formatMessage({ defaultMessage: 'Platform' })}
                      name="platform"
                      onChange={(event) => {
                        const platform = Number(event.target.value);

                        setSelectedDuelFilters({
                          ...selectedDuelFilters,
                          gameMode: null,
                          platform,
                        });

                        if (platforms !== undefined) {
                          sendGAEvent({
                            category,
                            event: 'Select Platform',
                            label: 'Quick Duel',
                            value: platforms.find((p) => p.id === platform)?.name,
                          });
                        }
                      }}
                      required
                      size="large"
                      value={selectedDuelFilters.platform === null ? '' : selectedDuelFilters.platform}
                    >
                      {selectedDuelFilters.platform === null && (
                        <option aria-label="platform" disabled value="" />
                      )}

                      {platforms !== undefined && platforms.map(({ id, name }) => (
                        <option key={name} value={id}>{name}</option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup className={styles.formGroup} error={errors.gameMode}>
                    <Select
                      disabled={selectedDuelFilters.platform === null}
                      id="quick-duel-select-game-mode"
                      label={intl.formatMessage({ defaultMessage: 'Game Mode' })}
                      name="gameMode"
                      onChange={(event) => {
                        const gameModeId = Number(event.target.value);

                        setSelectedDuelFilters({
                          ...selectedDuelFilters,
                          gameMode: gameModeId,
                        });

                        if (gameModes !== undefined) {
                          sendGAEvent({
                            category,
                            event: 'Select Game Mode',
                            label: 'Quick Duel',
                            value: gameModes.find((gm) => gm.id === gameModeId)?.name,
                          });
                        }
                      }}
                      required
                      size="large"
                      value={selectedDuelFilters.gameMode === null ? '' : selectedDuelFilters.gameMode}
                    >
                      {selectedDuelFilters.gameMode === null && (
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
                        ref={requiredAccountFieldRef}
                        required
                        size="large"
                        value={requiredAccountField || ''}
                      />
                    </FormGroup>
                  )}

                  <FormGroup className={styles.formGroup} error={errors.entryFee}>
                    <Select
                      id="quick-duel-select-entry-fee"
                      label={intl.formatMessage({ defaultMessage: 'Entry Fee' })}
                      name="entryFee"
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        updateValue('entryFee', value);

                        sendGAEvent({ category, event: 'Select Entry Fee', label: 'Quick Duel', value });
                      }}
                      required
                      size="large"
                      value={values.entryFee}
                    >
                      {entryFeeChoices.map((e) => (
                        <option key={e} value={e}>{`${e} GAU Token`}</option>
                      ))}
                    </Select>
                  </FormGroup>
                </div>

                <div className={styles.sub}>
                  {!['xl', 'xxl'].includes(breakpoint) && (
                    <div className={styles.subDetail}>
                      {gameRules}

                      <QuickDuelTournamentInfo />
                    </div>
                  )}

                  <div className={styles.submit}>
                    <Button className={styles.submitButton} size="large" type="submit">
                      <FormattedMessage defaultMessage="Find Duel" />
                    </Button>
                  </div>
                </div>
              </fieldset>
            </form>

            <div className={styles.subNav}>
              {['xl', 'xxl'].includes(breakpoint) && (
                <div className={styles.subDetail}>
                  {gameRules}

                  <QuickDuelTournamentInfo />
                </div>
              )}

              <div className={styles.redirect}>
                <Link href={{ pathname: router.pathname, query: { ...router.query, duelCreation: 'true' } }} passHref>
                  <a data-gtag={createGtag({ category, event: 'Click Find Duel', label: 'Open Custom Duel Modal' })}>
                    <FormattedMessage defaultMessage="or you can create custom duel" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}
