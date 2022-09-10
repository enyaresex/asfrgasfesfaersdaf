import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { mutate } from 'swr';
import { AuthAndApiContext, ToastsContext } from '../../contexts';
import { useForm } from '../../hooks';
import Button from '../Button';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import SettingsSectionTitle from '../SettingsSectionTitle';
import TextInput from '../TextInput';
import styles from './SettingsPasswordChange.module.css';

type Form = {
  newPassword2: string,
  newPassword: string,
  password: string,
};

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

const initialForm: Form = {
  newPassword2: '',
  newPassword: '',
  password: '',
};

export default function SettingsPasswordChange({ className, ...props }: Props) {
  const intl = useIntl();
  const router = useRouter();
  const { api, setUserAccessToken, user } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>(initialForm);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <section {...props} className={classNames(styles.settingsPasswordChange, className)}>
      <SettingsSectionTitle title={intl.formatMessage({ defaultMessage: 'Password Settings' })} />

      <p className={styles.message}>
        <FormattedMessage defaultMessage="In order to change your password please enter your current and new password." />
      </p>

      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();

          if (user === null) return;

          setIsDisabled(true);

          const response = await api.post('/users/change_password/', {
            ...values,
            username: user.username,
          });

          const responseJson = await response.json();

          if (response.ok) {
            setValues(initialForm);

            addToast({
              content: intl.formatMessage({ defaultMessage: 'Your password has been changed. Please sign in again to continue.' }),
              isPersistent: true,
              kind: 'success',
            });

            setUserAccessToken(null);

            await mutate('/users/me/', null);
            await router.replace('/?action=sign-in');
          } else {
            setErrors(responseJson);
          }

          setIsDisabled(false);
        }}
      >
        <fieldset className={styles.fieldset} disabled={isDisabled}>
          <Errors errors={errors.nonFieldErrors} />

          <FormGroup error={errors.password}>
            <TextInput
              id="settings-password"
              label={intl.formatMessage({ defaultMessage: 'Current Password' })}
              name="password"
              onChange={updateValue}
              required
              size="large"
              type="password"
              value={values.password}
            />
          </FormGroup>

          <FormGroup error={errors.newPassword}>
            <TextInput
              id="settings-new-password"
              label={intl.formatMessage({ defaultMessage: 'New Password' })}
              name="newPassword"
              onChange={updateValue}
              required
              size="large"
              type="password"
              value={values.newPassword}
            />
          </FormGroup>

          <FormGroup error={errors.newPassword2}>
            <TextInput
              id="settings-new-password"
              label={intl.formatMessage({ defaultMessage: 'New Password (Again)' })}
              name="newPassword2"
              onChange={updateValue}
              required
              size="large"
              type="password"
              value={values.newPassword2}
            />
          </FormGroup>

          <div className={styles.buttonWrapper}>
            <Button type="submit" variant="secondary">
              <FormattedMessage defaultMessage="Save Updates" />
            </Button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
