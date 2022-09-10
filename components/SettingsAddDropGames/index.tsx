import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext, RegionContext, ToastsContext } from '../../contexts';
import { hydrateGameMode, sendGAEvent } from '../../helpers';
import { useForm } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import EmptyStateDisplay from '../EmptyStateDisplay';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import RequiredAccountFieldDisplay from '../RequiredAccountFieldDisplay';
import Select from '../Select';
import SettingsSectionTitle from '../SettingsSectionTitle';
import SettingsUpdateGameAccounts from '../SettingsUpdateGameAccounts';
import SettingsUserGames from '../SettingsUserGame';
import TextInput from '../TextInput';
import { ReactComponent as Info } from './info.svg';
import styles from './SettingsAddDropGames.module.css';

type Form = {
  game: number | null,
  gameMode: number | null,
  platform: number | null,
  requiredAccountField: string | null,
};

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

const initialForm: Form = {
  game: null,
  gameMode: null,
  platform: null,
  requiredAccountField: null,
};

export default function SettingsAddDropGames({ className, ...props }: Props) {
  const intl = useIntl();
  const { category } = useContext(AnalyticsContext);
  const { region } = useContext(RegionContext);
  const { api, user } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>(initialForm);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { data: userGames } = useSWR<UserGame[]>(user === null ? null : `/games/user_games/?user=${user.id}`);
  const { data: games } = useSWR<Game[]>(`/games/?is_active=true&region=${region.id}`);
  const { data: platforms } = useSWR<Platform[]>(values.game === null ? null
    : `/games/platforms/?is_active=true&game=${values.game}&region=${region.id}`);
  const { data: gameModes } = useSWR<GameMode[]>(values.game === null || values.platform === null ? null
    : `/games/game_modes/?game=${values.game}&platform=${values.platform}&region=${region.id}`);
  const { data: gameMode } = useSWR<GameMode>(values.gameMode === null ? null
    : `/games/game_modes/${values.gameMode}/?region=${region.id}`);

  useEffect(() => {
    if (values.game !== null && values.platform !== null && gameModes !== undefined && gameModes.length === 1) {
      updateValue('gameMode', gameModes[0].id);
    }
  }, [gameModes, values.game, values.platform]);

  const hydratedGameMode = useMemo<HydratedGameMode | null>(() => {
    if (gameMode === undefined) return null;

    return hydrateGameMode(gameMode);
  }, [gameMode]);

  async function handleSubmit() {
    if (hydratedGameMode === null || user === null || userGames === undefined) return;

    setIsDisabled(true);

    // Add required account field
    if (values.requiredAccountField) {
      const requiredAccountFieldResponse = await api.patch('/users/me/', {
        [hydratedGameMode.requiredAccountField]: values.requiredAccountField,
      });

      const requiredAccountFieldResponseJson = await requiredAccountFieldResponse.json();

      if (requiredAccountFieldResponse.ok) {
        await mutate('/users/me/', requiredAccountFieldResponseJson);
      } else {
        return;
      }
    }

    const existingUserGame = userGames.find((ug) => ug.game === values.game && ug.platform === values.platform);

    if (existingUserGame !== undefined) {
      if (!existingUserGame.isActive) {
        const response = await api.patch(`/games/user_games/${existingUserGame.id}/`, {
          isActive: true,
        });

        if (response.ok) {
          await mutate(`/games/user_games/?user=${user.id}`);
        }

        setIsDisabled(false);

        setValues(initialForm);

        return;
      }

      setIsDisabled(false);

      setValues(initialForm);

      addToast({
        content: intl.formatMessage({ defaultMessage: 'This game already exists in your added games.' }),
        isPersistent: true,
        kind: 'warning',
      });

      return;
    }

    const response = await api.post('/games/user_games/', {
      game: values.game,
      platform: values.platform,
    });

    const responseJson = await response.json();

    if (response.ok) {
      sendGAEvent({ category, event: 'Click Connect My Account', label: 'Add/Drop Games' });

      await mutate(`/games/user_games/?user=${user.id}`);

      setValues(initialForm);
    } else {
      setErrors(responseJson);
    }

    setIsDisabled(false);
  }

  return games === undefined ? <ActivityIndicator /> : (
    <div {...props} className={classNames(styles.settingsAddDropGames, className)}>
      <section className={styles.addDropGames}>
        <SettingsSectionTitle title={intl.formatMessage({ defaultMessage: 'Add/Drop Games' })} />

        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();

            await handleSubmit();
          }}
        >
          <p className={styles.muted}><FormattedMessage defaultMessage="You can add new game to your profile" /></p>

          <fieldset className={styles.fieldset} disabled={isDisabled}>
            <Errors errors={errors.nonFieldErrors} />

            <FormGroup error={errors.game}>
              <Select
                id="add-drop-games-select-game"
                label={intl.formatMessage({ defaultMessage: 'Game' })}
                name="game"
                onChange={(e) => {
                  const game = Number(e.target.value);

                  setValues({ ...initialForm, game });

                  sendGAEvent({
                    category,
                    event: 'Select Game',
                    label: 'Add/Drop Games',
                    value: games.find((g) => g.id === game)?.name,
                  });
                }}
                required
                size="large"
                value={values.game === null ? '' : values.game}
              >
                {values.game === null && (
                <option aria-label="game" disabled value="" />
                )}

                {games.map(({ id, name }) => <option key={name} value={id}>{name}</option>)}
              </Select>
            </FormGroup>

            <FormGroup error={errors.platform}>
              <Select
                disabled={values.game === null}
                id="add-drop-games-select-platform"
                label={intl.formatMessage({ defaultMessage: 'Platform' })}
                name="platform"
                onChange={(e) => {
                  const platform = Number(e.target.value);

                  setValues({ ...initialForm, game: values.game, platform });

                  if (platforms !== undefined) {
                    sendGAEvent({
                      category,
                      event: 'Select Platform',
                      label: 'Add/Drop Games',
                      value: platforms.find((p) => p.id === platform)?.name,
                    });
                  }
                }}
                required
                size="large"
                value={values.platform === null ? '' : values.platform}
              >
                {values.platform === null && (
                <option aria-label="platform" disabled value="" />
                )}

                {platforms !== undefined && platforms.map(({ id, name }) => (
                  <option key={name} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {gameModes === undefined || gameModes.length === 1 ? null : (
              <FormGroup error={errors.gameMode}>
                <Select
                  disabled={values.game === null || values.platform === null}
                  id="add-drop-games-select-gameMode"
                  label={intl.formatMessage({ defaultMessage: 'Game Mode' })}
                  name="gameMode"
                  onChange={(e) => setValues({
                    ...values,
                    [e.target.name]: Number(e.target.value),
                  })}
                  required
                  size="large"
                  value={values.gameMode === null ? '' : values.gameMode}
                >
                  {values.gameMode === null && (
                  <option aria-label="gameMode" disabled value="" />
                  )}

                  {gameModes.map(({ id, name }) => (
                    <option key={name} value={id}>
                      {name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            )}

            {hydratedGameMode !== null && user !== null && (
            <>
              {user[hydratedGameMode.requiredAccountField] === null
                ? (
                  <FormGroup className={styles.formGroup}>
                    <TextInput
                      id="add-drop-games-required-account-field"
                      label={<RequiredAccountFieldDisplay field={hydratedGameMode.requiredAccountFieldStatus} />}
                      name="requiredAccountField"
                      onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                      required
                      size="large"
                      value={values.requiredAccountField || ''}
                    />
                  </FormGroup>
                ) : (
                  <FormGroup error={errors.game}>
                    <TextInput
                      disabled
                      id="add-drop-games-required-account-field"
                      label={<RequiredAccountFieldDisplay field={hydratedGameMode.requiredAccountFieldStatus} />}
                      name="requiredAccountField"
                      onChange={() => {
                      }}
                      required
                      size="large"
                      value={user[hydratedGameMode.requiredAccountField] || ''}
                    />

                    <p className={styles.warning}>
                      <Info />

                      <FormattedMessage defaultMessage="Contact support to change your username." />
                    </p>
                  </FormGroup>
                )}
            </>
            )}

            <Button disabled={hydratedGameMode === null || user === null} fullWidth type="submit" variant="green">
              <FormattedMessage defaultMessage="Connect My Account" />
            </Button>
          </fieldset>
        </form>

        {userGames === undefined ? null : (
          <>
            <div className={styles.header}>
              <h3><FormattedMessage defaultMessage="Added Games" /></h3>
            </div>

            <div className={styles.addedGames}>
              {userGames.filter((u) => u.isActive).length === 0 ? (
                <EmptyStateDisplay
                  className={styles.emptyState}
                  kind="noUserGame"
                  message={intl.formatMessage({ defaultMessage: 'Game account not found.' })}
                />
              ) : (
                <>
                  {userGames.filter((ug) => ug.isActive).map((ug) => (
                    <SettingsUserGames
                      key={`${ug.game}-${ug.platform}-${ug.gameAccount}`}
                      userGame={ug}
                    />
                  ))}
                </>
              )}
            </div>
          </>
        )}
      </section>

      {userGames === undefined || userGames.length === 0 ? null : <SettingsUpdateGameAccounts />}
    </div>
  );
}
