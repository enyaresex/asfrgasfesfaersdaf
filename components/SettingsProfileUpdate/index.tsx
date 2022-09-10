import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AuthAndApiContext, ToastsContext } from '../../contexts';
import { useForm } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import LanguageSelector from '../LanguageSelector';
import Select from '../Select';
import { ReactComponent as Info } from '../SettingsAddDropGames/info.svg';
import SettingsSectionTitle from '../SettingsSectionTitle';
import Textarea from '../Textarea';
import TextInput from '../TextInput';
import Tippy from '../Tippy';
import styles from './SettingsProfileUpdate.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

type Form = {
  bio: string | null,
  country: number | null,
  email: string | null,
  fullName: string | null,
  phoneNumber: string | null,
  phoneNumberCountryCode: string | null,
};

export default function SettingsProfileUpdate({ className, ...props }: Props) {
  const intl = useIntl();
  const router = useRouter();
  const { api, user } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const { data: countries } = useSWR<Country[]>('/i18n/countries/');
  const { data: country } = useSWR<Country>(user === null ? null : `/i18n/countries/${user.country}/`);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({
    bio: user === null ? null : user.bio,
    country: user === null ? null : user.country,
    email: user === null ? null : user.email,
    fullName: user === null ? null : user.fullName,
    phoneNumber: user === null ? null : user.phoneNumber,
    phoneNumberCountryCode: country === undefined ? null : country.phoneNumberCountryCode,
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (user === null || countries === undefined || values.country === null || values.country === user.country) return;

    const phoneCodeCountry = countries.find(({ id }) => id === Number(values.country));

    if (phoneCodeCountry !== undefined) {
      updateValue('phoneNumberCountryCode', phoneCodeCountry.phoneNumberCountryCode);
    }
  }, [countries, user, values.country]);

  useEffect(() => {
    if (user === null) return;

    setValues({
      ...values,
      bio: user.bio,
      country: user.country,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
    });
  }, [user]);

  useEffect(() => {
    if (country === undefined) return;
    setValues({
      ...values,
      phoneNumberCountryCode: country.phoneNumberCountryCode,
    });
  }, [country]);

  return user === null ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.settingsProfileUpdate, className)}>
      <SettingsSectionTitle title={intl.formatMessage({ defaultMessage: 'Profile Settings' })} />

      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();

          setIsDisabled(true);

          const response = await api.patch('/users/me/', values);

          const responseJson = await response.json();

          if (response.ok) {
            await mutate('/users/me/', responseJson);

            addToast({
              content: intl.formatMessage({ defaultMessage: 'Your profile is successfully updated.' }),
              kind: 'success',
            });
          } else {
            setErrors(responseJson);
          }

          setIsDisabled(false);
        }}
      >
        <fieldset className={styles.fieldset} disabled={isDisabled}>
          <Errors className={styles.errors} errors={errors.nonFieldErrors} />

          <FormGroup error={errors.fullName}>
            <TextInput
              id="profile-settings-fullName"
              label={intl.formatMessage({ defaultMessage: 'Full Name' })}
              name="fullName"
              onChange={updateValue}
              required
              size="large"
              value={values.fullName || ''}
            />
          </FormGroup>

          <FormGroup
            className={classNames((!user.isEmailVerified || values.email !== user.email) && styles.notVerified)}
            error={errors.email}
          >
            <TextInput
              id="profile-settings-email"
              label={user.isEmailVerified && user.email === values.email ? intl.formatMessage({ defaultMessage: 'E-mail (Verified)' })
                : intl.formatMessage({ defaultMessage: 'E-mail (Not Verified)' })}
              name="email"
              onChange={updateValue}
              required
              size="large"
              type="email"
              value={values.email || ''}
            />

            {(!user.isEmailVerified || user.email !== values.email) && (
              <Button
                onClick={async () => {
                  setIsDisabled(true);

                  const response = await api.patch('/users/me/', {
                    email: values.email,
                  });

                  const responseJson = await response.json();

                  if (response.ok) {
                    await mutate('/users/me/', responseJson);
                  } else {
                    setErrors(responseJson);
                  }

                  const verificationResponse = await api.get('/users/dispatch_verification_email/');

                  const verificationResponseJson = await verificationResponse.json();

                  if (verificationResponse.ok) {
                    addToast({
                      content: intl.formatMessage({ defaultMessage: 'E-mail verification mail is sent. Please check your e-mail.' }),
                      kind: 'success',
                    });
                  } else {
                    setErrors(verificationResponseJson);
                  }

                  setIsDisabled(false);
                }}
                type="button"
                variant="green"
              >
                <FormattedMessage defaultMessage="Verify" />
              </Button>
            )}
          </FormGroup>

          {countries !== undefined && (
            <FormGroup error={errors.country}>
              <Select
                id="profile-settings-country"
                label={intl.formatMessage({ defaultMessage: 'Country' })}
                name="country"
                onChange={updateValue}
                required
                value={(values.country || '').toString()}
              >
                {values.country === null && (
                  <option aria-label="country" value="" />
                )}

                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </FormGroup>
          )}

          <FormGroup>
            <LanguageSelector />
          </FormGroup>

          <FormGroup
            className={classNames(
              (!user.isPhoneNumberVerified && values.phoneNumber !== null && values.phoneNumber !== '') && styles.notVerified,
            )}
            error={errors.phoneNumber || errors.phoneNumberCountryCode}
          >

            <div className={classNames(styles.phoneInput, className)}>
              <Tippy
                content={(
                  <p className={styles.tooltip}>
                    <FormattedMessage defaultMessage="The country code section of your phone number is automatically set according to the country setting of your account. In order to change the country code, you need to change the country setting of your account." />
                  </p>
                )}
              >
                <div className={styles.inputPrepend}>
                  {values.phoneNumberCountryCode}
                </div>
              </Tippy>

              <TextInput
                className={styles.input}
                disabled={user.isPhoneNumberVerified}
                id="profile-settings-phone-number"
                label={user.isPhoneNumberVerified && user.phoneNumber === values.phoneNumber
                  ? intl.formatMessage({ defaultMessage: 'Phone Number (Verified)' })
                  : intl.formatMessage({ defaultMessage: 'Phone Number (Not Verified)' })}
                name="phoneNumber"
                onChange={updateValue}
                placeholder="5321234567"
                size="large"
                value={values.phoneNumber || ''}
              />
            </div>

            {user.isPhoneNumberVerified ? (
              <p className={styles.warning}>
                <Info />

                <FormattedMessage defaultMessage="Contact support to change your phone number." />
              </p>
            ) : (
              <>
                {(!user.isPhoneNumberVerified && values.phoneNumber !== null && values.phoneNumber !== '') && (
                  <Button
                    onClick={async () => {
                      setIsDisabled(true);
                      setErrors({});

                      const response = await api.patch('/users/me/', {
                        country: values.country,
                        phoneNumber: values.phoneNumber,
                        phoneNumberCountryCode: values.phoneNumberCountryCode,
                      });

                      const responseJson = await response.json();

                      if (response.ok) {
                        await mutate('/users/me/', responseJson);
                      } else {
                        setErrors(responseJson);
                        setIsDisabled(false);

                        return;
                      }

                      const verificationResponse = await api.get('/users/verify_phone_number/');

                      const verificationResponseJson = await verificationResponse.json();

                      if (verificationResponse.ok) {
                        await router.replace({
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            phoneVerification: 'true',
                          },
                        });
                      } else {
                        setErrors(verificationResponseJson);
                      }

                      setIsDisabled(false);
                    }}
                    type="button"
                    variant="green"
                  >
                    <FormattedMessage defaultMessage="Verify" />
                  </Button>
                )}
              </>
            )}
          </FormGroup>

          <FormGroup error={errors.bio}>
            <Textarea
              id="profile-settings-bio"
              label={intl.formatMessage({ defaultMessage: 'Bio' })}
              name="bio"
              onChange={updateValue}
              rows={4}
              value={values.bio || ''}
            />
          </FormGroup>

          <div className={styles.buttonWrapper}>
            <Button type="submit">
              <FormattedMessage defaultMessage="Save Updates" />
            </Button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
