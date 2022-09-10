import classNames from 'classnames';
import firebase from 'firebase/app';
import 'firebase/messaging'; // eslint-disable-line import/no-duplicates
import Link from 'next/link';
import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext, ToastsContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import FormGroup from '../FormGroup';
import SettingsSectionTitle from '../SettingsSectionTitle';
import ToggleSwitch from '../ToggleSwitch';
import styles from './SettingsNotifications.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

export default function SettingsNotifications({ className, ...props }: Props) {
  const intl = useIntl();
  const { category } = useContext(AnalyticsContext);
  const { api, user } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (user === null) return;
    // I had to read event.target.checked at the beginning because even if it is true, it changes back to `false` after some time. -G
    const { checked, name } = event.target;

    if (event.target.name === 'isSubscribedToPushNotifications') {
      if (checked && firebase.messaging.isSupported()) {
        const messaging = firebase.messaging();

        try {
          const token = await messaging.getToken();

          await api.post('/notifications/firebase_registration_token/', { token });
        } catch (e) {
          addToast({
            content: intl.formatMessage({ defaultMessage: 'To receive push notifications, you need to configure your browser to allow notifications.' }),
            kind: 'warning',
          });
        }
      }
    }

    if (event.target.name === 'isSubscribedToDiscord' && user.discordUrl === null) {
      addToast({
        content: (
          <>
            {intl.formatMessage({ defaultMessage: 'To receive Discord notifications, you need to connect your discord account. Click <wrap>here</wrap> to connect your account.' },
              {
                wrap: (...chunks: string[]) => (
                  <Link href="/settings?section=socialAccounts"><a className={styles.link}>{chunks}</a></Link>
                ),
              })}
          </>),
        kind: 'warning',
      });

      return;
    }

    const response = await api.patch('/users/me/', { [name]: checked });

    const responseJson = await response.json();

    if (response.ok) {
      sendGAEvent({
        category,
        event: (() => {
          if (name === 'isSubscribedToEmail') return 'Toggle Email Notification';
          if (name === 'isSubscribedToPushNotifications') return 'Toggle Push Notification';
          return 'Toggle Discord Notification';
        })(),
        label: 'Notifications',
      });

      await mutate('/users/me/', responseJson);

      addToast({
        content: intl.formatMessage({ defaultMessage: 'Notification preferences are updated.' }),
        kind: 'success',
      });
    }
  }

  return (
    <section {...props} className={classNames(styles.settingsNotifications, className)}>
      <SettingsSectionTitle title={intl.formatMessage({ defaultMessage: 'Notifications' })} />

      <p className={styles.muted}>
        <FormattedMessage defaultMessage="We send you notifications about your duels, tournaments, and other important stuff. Please select the ways you want to get notified via." />
      </p>

      <FormGroup>
        <ToggleSwitch
          checked={user === null ? false : user.isSubscribedToEmail}
          id="settings-email-notification"
          label={intl.formatMessage({ defaultMessage: 'Notify me via e-mail' })}
          name="isSubscribedToEmail"
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <ToggleSwitch
          checked={user === null ? false : user.isSubscribedToPushNotifications}
          id="settings-push-notification"
          label={intl.formatMessage({ defaultMessage: 'Notify me via push notifications' })}
          name="isSubscribedToPushNotifications"
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <ToggleSwitch
          checked={user === null ? false : user.isSubscribedToDiscord}
          id="settings-discord-notification"
          label={intl.formatMessage({ defaultMessage: 'Notify me via Discord' })}
          name="isSubscribedToDiscord"
          onChange={handleChange}
        />
      </FormGroup>
    </section>
  );
}
