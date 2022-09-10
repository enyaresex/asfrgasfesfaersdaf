import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { mutate } from 'swr';
import { AuthAndApiContext } from '../../contexts';
import getRequiredAccountFieldDisplay from '../../helpers/getRequiredAccountFieldDisplay';
import { useForm } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import RequiredAccountFieldDisplay from '../RequiredAccountFieldDisplay';
import SettingsSectionTitle from '../SettingsSectionTitle';
import TextInput from '../TextInput';
import styles from './SettingsUpdateGameAccounts.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;
const gameAccounts: Array<keyof UserGameAccounts> = [
  'activisionAccount',
  'basketballArenaTeamName',
  'battleTag',
  'codMobileUsername',
  'eaAccount',
  'epicGamesUsername',
  'fifaUsername',
  'headBallUsername',
  'mobileLegendsUsername',
  'psnUsername',
  'pubgMobileUsername',
  'pubgUsername',
  'riotId',
  'sabotajUsername',
  'steamProfileName',
  'xboxGamertag',
  'zulaUsername',
  'arenaOfValorUsername',
];

type Form = Record<keyof UserGameAccounts, string | null>;

export default function SettingsUpdateGameAccounts({ className, ...props }: Props) {
  const intl = useIntl();
  const { api, user } = useContext(AuthAndApiContext);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({
    activisionAccount: user === null ? null : user.activisionAccount,
    basketballArenaTeamName: user === null ? null : user.basketballArenaTeamName,
    battleTag: user === null ? null : user.battleTag,
    codMobileUsername: user === null ? null : user.codMobileUsername,
    eaAccount: user === null ? null : user.eaAccount,
    epicGamesUsername: user === null ? null : user.epicGamesUsername,
    fifaUsername: user === null ? null : user.fifaUsername,
    freeFireUsername: user === null ? null : user.freeFireUsername,
    headBallUsername: user === null ? null : user.headBallUsername,
    mobileLegendsUsername: user === null ? null : user.mobileLegendsUsername,
    psnUsername: user === null ? null : user.psnUsername,
    pubgMobileUsername: user === null ? null : user.pubgMobileUsername,
    pubgUsername: user === null ? null : user.pubgUsername,
    riotId: user === null ? null : user.riotId,
    sabotajUsername: user === null ? null : user.sabotajUsername,
    steamProfileName: user === null ? null : user.steamProfileName,
    supercellId: user === null ? null : user.supercellId,
    xboxGamertag: user === null ? null : user.xboxGamertag,
    zulaUsername: user === null ? null : user.zulaUsername,
    arenaOfValorUsername: user === null ? null : user.arenaOfValorUsername,
  });

  useEffect(() => {
    if (user === null) return;

    setValues({
      activisionAccount: user.activisionAccount,
      basketballArenaTeamName: user.basketballArenaTeamName,
      battleTag: user.battleTag,
      codMobileUsername: user.codMobileUsername,
      eaAccount: user.eaAccount,
      epicGamesUsername: user.epicGamesUsername,
      fifaUsername: user.fifaUsername,
      freeFireUsername: user.freeFireUsername,
      headBallUsername: user.headBallUsername,
      mobileLegendsUsername: user.mobileLegendsUsername,
      psnUsername: user.psnUsername,
      pubgMobileUsername: user.pubgMobileUsername,
      pubgUsername: user.pubgUsername,
      riotId: user.riotId,
      sabotajUsername: user.sabotajUsername,
      steamProfileName: user.steamProfileName,
      supercellId: user.supercellId,
      xboxGamertag: user.xboxGamertag,
      zulaUsername: user.zulaUsername,
      arenaOfValorUsername: user.arenaOfValorUsername,
    });
  }, [user]);

  const userGames = useMemo<Array<keyof Partial<UserGameAccounts>> | null>(() => {
    if (user === null) return null;

    return gameAccounts.filter((gameAccount) => user[gameAccount] !== null);
  }, [user]);

  return (user === null || userGames === null) ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.settingUpdateGameAccounts, className)}>
      <SettingsSectionTitle title={intl.formatMessage({ defaultMessage: 'Update Game Accounts' })} />

      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();

          setIsDisabled(true);
          setErrors({});

          const response = await api.patch('/users/me/', values);

          const responseJson = await response.json();

          if (response.ok) {
            await mutate('/users/me/', responseJson);
          } else {
            setErrors(responseJson);
          }

          setIsDisabled(false);
        }}
      >
        <p className={styles.muted}><FormattedMessage defaultMessage="You can update your game accounts." /></p>

        <fieldset className={styles.fieldset} disabled={isDisabled}>
          <Errors errors={errors.nonFieldErrors} />

          {userGames.map((ug) => (
            <FormGroup error={errors[ug]} key={ug}>
              <TextInput
                id={`change-${ug}`}
                label={<RequiredAccountFieldDisplay field={getRequiredAccountFieldDisplay(ug)} />}
                name={ug}
                onChange={updateValue}
                value={values[ug] || ''}
              />
            </FormGroup>
          ))}

          <Button type="submit" variant="green">
            <FormattedMessage defaultMessage="Update Game Accounts" />
          </Button>
        </fieldset>
      </form>
    </section>
  );
}
