import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { entryFeeChoices } from '../../constants';
import { AuthAndApiContext, FilterSortContext, RegionContext } from '../../contexts';
import { hydrateGameMode } from '../../helpers';
import { useForm } from '../../hooks';
import Button from '../Button';
import Container from '../Container';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import GameModeTooltip from '../GameModeTooltip';
import Modal from '../Modal';
import QuickDuelTournamentInfo from '../QuickDuelTournamentInfo';
import RequiredAccountFieldDisplay from '../RequiredAccountFieldDisplay';
import Select from '../Select';
import TextInput from '../TextInput';
import styles from './QuickDuel2.module.css';
import { ReactComponent as Swords } from './swords.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

type Form = {
  entryFee: number,
  requiredAccountField: string,
};

export default function QuickDuel2({ className, ...props }: Props) {
  const router = useRouter();
  const intl = useIntl();
  const { api, user } = useContext(AuthAndApiContext);
  const { region } = useContext(RegionContext);
  const { selectedDuelFilters, setSelectedDuelFilters } = useContext(FilterSortContext);
  const [requiredAccountField, setRequiredAccountField] = useState<string | null>(null);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [values, , updateValue, errors, setErrors] = useForm<Form>({
    entryFee: 50,
    requiredAccountField: '',
  });

  const { data: gameModes } = useSWR<GameMode[]>(selectedDuelFilters.game === null || selectedDuelFilters.platform === null ? null
    : `/games/game_modes/?is_active=true&game=${selectedDuelFilters.game}&platform=${selectedDuelFilters.platform}&region=${region.id}`);
  const { data: games } = useSWR<Game[]>(`/games/?is_active=true&region=${region.id}`);
  const { data: platforms } = useSWR<Platform[]>(selectedDuelFilters.game === null
    ? null
    : `/games/platforms/?is_active=true&game=${selectedDuelFilters.game}&region=${region.id}`);
  const { data: gameMode } = useSWR<GameMode>(selectedDuelFilters.gameMode === null ? null
    : `/games/game_modes/${selectedDuelFilters.gameMode}/`);
  const hydratedGameMode = useMemo<HydratedGameMode | null>(() => {
    if (gameMode === undefined) return null;

    return hydrateGameMode(gameMode);
  }, [gameMode]);

  useEffect(() => {
    if (selectedDuelFilters.game === null && games?.length === 1) {
      setSelectedDuelFilters({
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

                    if (!requiredAccountFieldResponse.ok) {
                      // patch failed, let's not continue.
                      return;
                    }

                    await mutate('/users/me/', requiredAccountFieldResponseJson);
                  }

                  const response = await api.post('/duels/get_or_create/', { ...selectedDuelFilters, ...values });
                  const responseJson = await response.json();

                  if (response.ok) {
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
        <section {...props} className={classNames(className, styles.quickDuel)}>
          <div className={styles.background} />

          <Container className={styles.container}>
            <div className={styles.header}>
              <Swords />

              <div className={styles.title}>
                <h2>
                  <FormattedMessage defaultMessage="Let’s Join a Duel" />
                </h2>

                <p className={styles.description}>
                  <FormattedMessage defaultMessage="Let’s find or join a duel with your choices." />
                </p>
              </div>
            </div>

            <div className={styles.content}>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();

                  setIsModalOpen(true);
                }}
              >
                <fieldset disabled={isDisabled}>
                  <Errors errors={errors.nonFieldErrors} />

                  <FormGroup error={errors.game}>
                    <Select
                      id="quick-duel-select-game"
                      label={intl.formatMessage({ defaultMessage: 'Game' })}
                      name="game"
                      onChange={(e) => {
                        setSelectedDuelFilters({
                          game: Number(e.target.value),
                          gameMode: null,
                          platform: null,
                        });

                        window.dataLayer.push({
                          category: 'Arena',
                          event: 'Select Game',
                          label: 'Quick Duel',
                          value: games.find((g) => g.id === selectedDuelFilters.game)?.name,
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

                  <QuickDuelTournamentInfo />

                  <FormGroup error={errors.platform}>
                    <Select
                      disabled={selectedDuelFilters.game === null}
                      id="quick-duel-select-platform"
                      label={intl.formatMessage({ defaultMessage: 'Platform' })}
                      name="platform"
                      onChange={(e) => setSelectedDuelFilters({
                        ...selectedDuelFilters,
                        gameMode: null,
                        platform: Number(e.target.value),
                      })}
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

                  <FormGroup error={errors.gameMode}>
                    <Select
                      disabled={selectedDuelFilters.platform === null}
                      id="quick-duel-select-game-mode"
                      label={intl.formatMessage({ defaultMessage: 'Game Mode' })}
                      name="gameMode"
                      onChange={(e) => setSelectedDuelFilters({
                        ...selectedDuelFilters,
                        gameMode: Number(e.target.value),
                      })}
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
                    <FormGroup>
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

                  <FormGroup error={errors.entryFee}>
                    <Select
                      id="quick-duel-select-entry-fee"
                      label={intl.formatMessage({ defaultMessage: 'Entry Fee' })}
                      name="entryFee"
                      onChange={(e) => updateValue('entryFee', parseInt(e.target.value))}
                      required
                      size="large"
                      value={values.entryFee}
                    >
                      {entryFeeChoices.map((e) => (
                        <option key={e} value={e}>{`${e} GAU Token`}</option>
                      ))}
                    </Select>
                  </FormGroup>

                  <div className={styles.sub}>
                    <div className={styles.info}>
                      <GameModeTooltip gameModeId={selectedDuelFilters.gameMode} />
                    </div>

                    <div className={styles.submit}>
                      <Button className={styles.submitButton} size="large" type="submit">
                        <FormattedMessage defaultMessage="Find Duel" />
                      </Button>
                    </div>

                    <div className={styles.redirect}>
                      <Link
                        href={{ pathname: router.pathname, query: { ...router.query, duelCreation: 'true' } }}
                        passHref
                      >
                        <a>
                          <FormattedMessage defaultMessage="or you can create custom duel" />
                        </a>
                      </Link>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </Container>
        </section>
      </>
    );
}
