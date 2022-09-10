/* eslint-disable arrow-body-style */
import React, { useEffect, useContext, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMeasure } from 'react-use';
import useSWR, { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext, BreakpointContext, ToastsContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import { useForm } from '../../hooks';
import Button from '../Button';
import Checkbox from '../Checkbox';
import DateInput from '../DateInput';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import Select from '../Select';
import TextInput from '../TextInput';
import styles from './SignUp.module.css';
import { ReactComponent as Info } from './info.svg';
import { scrollTo } from '../../helpers/scrollTo';
import usernameRegExp from '../../helpers/usernameRegExp';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

type Form = Overwrite<Pick<AuthUser, 'country' | 'email' | 'fullName' | 'language' | 'username'>, {
  country: number | null,
  dateOfBirth: string,
  password2: string,
  password: string,
  region: number | null,
  termsAgreed: boolean,
}>;

export default function SignUp({
  className,
  ...props
}: Props) {
  const router = useRouter();
  const intl = useIntl();
  const [signUp, { width }] = useMeasure<HTMLDivElement>();
  const { category } = useContext(AnalyticsContext);
  const {
    api,
    setUserAccessToken
  } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const { device } = useContext(BreakpointContext);

  const { data: countries } = useSWR<Country[]>('/i18n/countries/');
  const { data: regions } = useSWR<Region[]>('/i18n/regions/');
  const [termsAgreed2, setTermsAgreed2] = useState<boolean>(false);

  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({
    country: null,
    dateOfBirth: '',
    email: '',
    fullName: '',
    language: 1,
    password2: '',
    password: '',
    region: null,
    termsAgreed: false,
    username: '',
  });

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);

  const debouncedUsername = useRef(
    debounce((res) => {
      setIsValidUsername(res);
    }, 300),
  ).current;

  const usernameHandleChange = (value: string) => {
    updateValue('username', value);
    debouncedUsername(usernameRegExp(value));
  };

  useEffect(() => {
    return () => {
      debouncedUsername.cancel();
    };
  }, [debouncedUsername]);

  const gridClassName = useMemo<string[]>(() => {
    const c = [styles.grid];

    if (width >= 400) {
      c.push(styles.gridWide);
    }

    return c;
  }, [width]);
  const region = useMemo<Region | null>(
    () => regions?.find((r) => r.id === values.region) || null,
    [values.region, regions],
  );

  useEffect(() => {
    if (device !== 'desktop') {
      const id = window.location.search.split('=')[1];
      scrollTo({
        id,
        pixelSize: 195
      });
    }
  }, []);

  return (
    <div {...props} className={classNames(styles.signUp, className)} id="sign-up" ref={signUp}>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          setIsDisabled(true);

          if (dayjs()
            .diff(values.dateOfBirth, 'year') < 13) {
            setErrors({
              dateOfBirth: [intl.formatMessage({ defaultMessage: 'In order to sign up with Gamer Arena, you need to be older than 13 years old.' })],
            });

            setIsDisabled(false);

            return;
          }

          const response = await api.post('/users/sign_up/', values);
          const responseJson = await response.json();

          if (response.ok) {
            setUserAccessToken(responseJson.accessToken);
            await mutate('/users/me/', responseJson.user);

            sendGAEvent({
              category,
              event: 'Sign Up'
            });

            addToast({
              content: intl.formatMessage({
                defaultMessage: 'We have sent you an e-mail containing the instructions to validate your e-mail address.',
              }),
              kind: 'success',
            });

            await router.push('/arena');
          } else {
            setErrors(responseJson);
          }

          setIsDisabled(false);
        }}
      >
        <fieldset disabled={isDisabled}>
          <Errors errors={errors.nonFieldErrors}/>

          <FormGroup error={errors.fullName}>
            <TextInput
              id="text-input-full-name"
              label={intl.formatMessage({ defaultMessage: 'Full Name' })}
              name="fullName"
              onChange={updateValue}
              required
              value={values.fullName}
            />
          </FormGroup>

          <FormGroup error={errors.email}>
            <TextInput
              id="text-input-email"
              label={intl.formatMessage({ defaultMessage: 'E-mail Address' })}
              name="email"
              onChange={updateValue}
              required
              type="email"
              value={values.email}
            />
          </FormGroup>

          <FormGroup error={errors.username}>
            <TextInput
              id="text-input-username"
              label={intl.formatMessage({ defaultMessage: 'Username' })}
              name="username"
              onChange={(e) => {
                usernameHandleChange(e.target.value);
              }}
              required
              value={values.username}
            />
            {
              !isValidUsername && (
                <div className={styles.hasError}>
                  <FormattedMessage
                    defaultMessage="Enter a valid 'slug' consisting of letters, numbers, underscores or hyphens."/>
                </div>
              )
            }
          </FormGroup>

          <div className={classNames(gridClassName)}>
            <FormGroup className={styles.gridFormGroup} error={errors.password}>
              <TextInput
                id="text-input-password"
                label={intl.formatMessage({ defaultMessage: 'Password' })}
                name="password"
                onChange={updateValue}
                required
                type="password"
                value={values.password}
              />
            </FormGroup>

            <FormGroup className={styles.gridFormGroup} error={errors.password2}>
              <TextInput
                id="text-input-password2"
                label={intl.formatMessage({ defaultMessage: 'Password (again)' })}
                name="password2"
                onChange={updateValue}
                required
                type="password"
                value={values.password2}
              />
            </FormGroup>
          </div>

          <FormGroup error={errors.dateOfBirth}>
            <DateInput
              dateFormat="MM/dd/yyyy"
              id="date-input-sign-up"
              label={intl.formatMessage({ defaultMessage: 'Date of Birth' })}
              onChange={(v) => {
                if (v === null) {
                  updateValue('dateOfBirth', '');
                }

                if (v instanceof Date) {
                  updateValue('dateOfBirth', dayjs(v)
                    .format('YYYY-MM-DD'));
                }
              }}
              onSelect={(v) => {
                updateValue('dateOfBirth', dayjs(v)
                  .format('YYYY-MM-DD'));
              }}
              selected={values.dateOfBirth === '' ? null : dayjs(values.dateOfBirth, 'YYYY-MM-DD')
                .toDate()}
              showMonthDropdown
              showYearDropdown
            />
          </FormGroup>

          <div className={classNames(gridClassName)}>
            <FormGroup className={styles.gridFormGroup} error={errors.country}>
              <Select
                id="select-sign-up-country"
                label={intl.formatMessage({ defaultMessage: 'Country' })}
                name="country"
                onChange={(event) => {
                  const countryId = Number(event.target.value);

                  const newValues = {
                    ...values,
                    country: countryId,
                  };

                  const country = countries?.find((c) => c.id === countryId);

                  if (country !== undefined) {
                    newValues.region = regions?.find((r) => r.id === country.region)?.id || null;
                  }

                  setValues(newValues);
                }}
                required
                value={values.country || ''}
              >
                {values.country === null && (
                  <option aria-label="country" disabled value=""/>
                )}

                {countries !== undefined && (
                  <>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </>
                )}
              </Select>
            </FormGroup>

            <FormGroup className={styles.gridFormGroup} error={errors.region}>
              <Select
                disabled
                id="select-sign-up-region"
                label={intl.formatMessage({ defaultMessage: 'Region' })}
                name="region"
                onChange={(event) => updateValue('region', Number(event.target.value))}
                required
                value={values.region || ''}
              >
                {values.region === null && (
                  <option aria-label="region" disabled value=""/>
                )}

                {regions !== undefined && (
                  <>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </>
                )}
              </Select>
            </FormGroup>
          </div>

          {region !== null && (
            <div className={styles.regionDescription}>
              <Info/>

              <div className={styles.regionDescriptionContent}>
                <FormattedMessage
                  defaultMessage="Your region CAN'T be changed after you sign up and cross-region competition isn't allowed."/>
              </div>
            </div>
          )}

          <Button
            className={styles.button}
            disabled={!isValidUsername}
            type="submit"
            variant="secondary"
          >
            <FormattedMessage defaultMessage="Free Signup"/>
          </Button>

          <FormGroup error={errors.termsAgreed}>
            <Checkbox
              checked={values.termsAgreed}
              className={styles.conditions}
              id="checkbox-terms-agreed"
              label={(
                <FormattedMessage
                  defaultMessage="By checking this box I agree to Gamer Arena's <termsOfService>Terms of Service</termsOfService> and <privacyPolicy>Privacy Policy</privacyPolicy>. Also I agree that I am above 13, and to participate in paid duels I have to be above 18."
                  values={{
                    privacyPolicy: (...chunks: string[]) => (
                      <Link href="/privacy-policy">
                        <a target="_blank">{chunks}</a>
                      </Link>
                    ),
                    termsOfService: (...chunks: string[]) => (
                      <Link href="/terms-of-service">
                        <a target="_blank">{chunks}</a>
                      </Link>
                    ),
                  }}
                />
              )}
              name="termsAgreed"
              onChange={updateValue}
              required
            />
          </FormGroup>

          <FormGroup>
            <Checkbox
              checked={termsAgreed2}
              className={styles.conditions}
              id="checkbox-terms-agreed2"
              label={(
                <FormattedMessage
                  defaultMessage="I hereby confirm that I don't have another Gamer Arena account. Also I acknowledge that my account will be banned if I use a shared device that accessed another Gamer Arena account before."
                />
              )}
              name="termsAgreed2"
              onChange={(event) => setTermsAgreed2(event.target.checked)}
              required
            />
          </FormGroup>
        </fieldset>
      </form>
    </div>
  );
}
