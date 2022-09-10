import { useRouter } from 'next/router';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { entryFeeChoices } from '../../constants';
import { AnalyticsContext, AuthAndApiContext, RegionContext } from '../../contexts';
import { hydrateGameMode, sendGAEvent } from '../../helpers';
import { useForm } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import GameModeTooltip from '../GameModeTooltip';
import Modal from '../Modal';
import Select from '../Select';
import TextInput from '../TextInput';
import UserInput from '../UserInput';
import styles from './DuelCreationModal.module.css';

type Form = {
  entryFee: number,
  game: number | null,
  gameMode: number | null,
  platform: number | null,
  user2: number | null,
};

const initialForm: Form = {
  entryFee: 20,
  game: null,
  gameMode: null,
  platform: null,
  user2: null,
};

const isOpenQueryParameter = 'duelCreation';
const userIdQueryParameter = 'userId';

export default function DuelCreationModal() {
  const router = useRouter();
  const intl = useIntl();
  const { api, user } = useContext(AuthAndApiContext);
  const { region } = useContext(RegionContext);
  const { category } = useContext(AnalyticsContext);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [requiredAccountFieldValue, setRequiredAccountFieldValue] = useState<string>('');
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>(initialForm);
  const [isDuelOpen, setIsDuelOpen] = useState<boolean>(true);

  const { data: games } = useSWR<Game[]>(`/games/?is_active=true&region=${region.id}`);
  const { data: platforms } = useSWR<Platform[]>(values.game === null ? null
    : `/games/platforms/?is_active=true&game=${values.game}&region=${region.id}`);
  const { data: gameModes } = useSWR<GameMode[]>(values.platform === null ? null
    : `/games/game_modes/?is_active=true&game=${values.game}&platform=${values.platform}&region=${region.id}`);

  const hydratedGameMode = useMemo<HydratedGameMode | null>(() => {
    if (gameModes === undefined || values.gameMode === null) return null;

    const gameMode = gameModes.find((g) => g.id === values.gameMode);

    if (gameMode === undefined) return null;

    return hydrateGameMode(gameMode);
  }, [gameModes, values.gameMode]);

  const isOpen = router.query[isOpenQueryParameter] === 'true';

  const userInvited: string | null = router.query[userIdQueryParameter] === undefined
    ? null : (router.query[userIdQueryParameter] as string);

  async function onClose() {
    const { [isOpenQueryParameter]: _, [userIdQueryParameter]: __, ...query } = router.query;

    await router.push({ pathname: router.pathname, query });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsDisabled(true);

    if (user !== null && hydratedGameMode !== null && user[hydratedGameMode.requiredAccountField] === null) {
      const meResponse = await api.patch('/users/me/', {
        [hydratedGameMode.requiredAccountField]: requiredAccountFieldValue,
      });
      const meResponseJson = await meResponse.json();

      if (meResponse.ok) {
        await mutate('/users/me/', meResponseJson);
      } else {
        setErrors(meResponseJson);

        return;
      }
    }

    const response = await api.post('/duels/', values);
    const responseJson = await response.json();

    if (response.ok) {
      sendGAEvent({ category, event: 'Click Create Duel' });

      await router.push(`/duels/duel?id=${responseJson.id}`);

      setValues(initialForm);
      setIsDisabled(false);
    } else {
      setErrors(responseJson);
      setIsDisabled(false);
    }
  }

  useEffect(() => {
    if (userInvited === null) {
      setIsDuelOpen(true);

      setValues({ ...values, user2: null });
    } else {
      setIsDuelOpen(false);
      setValues({ ...values, user2: Number(userInvited) });
    }
  }, [router, userInvited]);

  useEffect(() => {
    if (values.game === null && games?.length === 1) {
      setValues({
        ...values,
        game: games[0].id,
        gameMode: null,
        platform: null,
      });
    }
  }, [games, values.game]);

  useEffect(() => {
    if (values.platform === null && platforms?.length === 1) {
      setValues({
        ...values,
        game: values.game,
        gameMode: null,
        platform: platforms[0].id,
      });
    }
  }, [platforms, values.platform]);

  useEffect(() => {
    if (values.gameMode === null && gameModes?.length === 1) {
      setValues({
        ...values,
        gameMode: gameModes[0].id,
      });
    }
  }, [gameModes, values.gameMode]);

  return user === null ? null : (
    <Modal
      className={styles.duelCreationModal}
      isOpen={isOpen}
      onClose={onClose}
      title={intl.formatMessage({ defaultMessage: 'Create a Duel' })}
    >
      {games === undefined ? (
        <ActivityIndicator />
      ) : (
        <form onSubmit={onSubmit}>
          <fieldset disabled={isDisabled}>
            <Errors errors={errors.nonFieldErrors} />

            <FormGroup error={errors.entryFee}>
              <Select
                id="duel-creation-modal-select-entry-fee"
                label={intl.formatMessage({ defaultMessage: 'Entry Fee' })}
                name="entryFee"
                onChange={(event) => {
                  const value = Number(event.target.value);

                  updateValue('entryFee', value);

                  sendGAEvent({ category, event: 'Select Entry Fee', value });
                }}
                required
                value={values.entryFee.toString()}
              >
                {entryFeeChoices.map((e) => (
                  <option key={e} value={e}>{`${e} GAU Token`}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup error={errors.game}>
              <Select
                id="duel-creation-modal-select-game"
                label={intl.formatMessage({ defaultMessage: 'Game' })}
                onChange={(event) => {
                  const game = Number(event.target.value);

                  setValues({ ...values, game, platform: null, gameMode: null });

                  sendGAEvent({
                    category,
                    event: 'Select Game',
                    value: games.find((g) => g.id === game)?.name,
                  });
                }}
                required
                value={(values.game || '').toString()}
              >
                {values.game === null && (
                  <option aria-label="game" value="" />
                )}

                {games.map((game) => (
                  <option key={game.id} value={game.id}>{game.name}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup error={errors.platform}>
              <Select
                disabled={platforms === undefined}
                id="duel-creation-modal-select-platform"
                label={intl.formatMessage({ defaultMessage: 'Platform' })}
                onChange={(event) => {
                  const platform = Number(event.target.value);

                  setValues({ ...values, platform, gameMode: null });

                  if (platforms !== undefined) {
                    sendGAEvent({
                      category,
                      event: 'Select Platform',
                      value: platforms.find((p) => p.id === platform)?.name,
                    });
                  }
                }}
                required
                value={(values.platform || '').toString()}
              >
                {values.platform === null && (
                  <option aria-label="platform" value="" />
                )}

                {(platforms || []).map((platform) => (
                  <option key={platform.id} value={platform.id}>{platform.name}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup error={errors.gameMode}>
              <Select
                disabled={gameModes === undefined}
                id="duel-creation-modal-select-game-mode"
                label={intl.formatMessage({ defaultMessage: 'Game Mode' })}
                onChange={(event) => {
                  const gameMode = Number(event.target.value);

                  updateValue('gameMode', gameMode);

                  if (gameModes !== undefined) {
                    sendGAEvent({
                      category,
                      event: 'Select Game Mode',
                      value: gameModes.find((gm) => gm.id === gameMode)?.name,
                    });
                  }
                }}
                required
                value={(values.gameMode || '').toString()}
              >
                {values.gameMode === null && (
                  <option aria-label="game mode" value="" />
                )}

                {(gameModes || []).map((gameMode) => (
                  <option key={gameMode.id} value={gameMode.id}>{gameMode.name}</option>
                ))}
              </Select>
            </FormGroup>

            {(hydratedGameMode !== null && user[hydratedGameMode.requiredAccountField] === null) && (
              <FormGroup error={errors[hydratedGameMode.requiredAccountField]}>
                <TextInput
                  id="duel-creation-modal-text-input-required-account-field"
                  label={hydratedGameMode.requiredAccountFieldStatus}
                  name={hydratedGameMode.requiredAccountField}
                  onChange={(event) => setRequiredAccountFieldValue(event.target.value)}
                  required
                  value={requiredAccountFieldValue}
                />
              </FormGroup>
            )}

            <FormGroup>
              <Select
                id="duel-creation-modal-select-rival"
                label={intl.formatMessage({ defaultMessage: 'Rival' })}
                onChange={(event) => {
                  setIsDuelOpen(event.target.value === 'open');

                  if (event.target.value === 'invited') {
                    sendGAEvent({ category, event: 'Select Opponent' });
                  }
                }}
                value={isDuelOpen ? 'open' : 'invite'}
              >
                <option value="open">{intl.formatMessage({ defaultMessage: 'List my duel as open' })}</option>
                <option value="invite">{intl.formatMessage({ defaultMessage: 'I want to invite a user to duel' })}</option>
              </Select>
            </FormGroup>

            {!isDuelOpen && (
              <FormGroup error={errors.user2}>
                <UserInput
                  id="duel-creation-modal-user-input"
                  label={intl.formatMessage({ defaultMessage: 'Opponent Username' })}
                  name="username"
                  onChange={(userId) => updateValue('user2', userId)}
                  regionId={region.id}
                  required
                  value={values.user2}
                />
              </FormGroup>
            )}

            {values.gameMode !== null && (
              <FormGroup className={styles.gameModeFormGroup}>
                <GameModeTooltip gameModeId={values.gameMode} />
              </FormGroup>
            )}

            <Button fullWidth type="submit">
              <FormattedMessage defaultMessage="Create Duel" />
            </Button>
          </fieldset>
        </form>
      )}
    </Modal>
  );
}
