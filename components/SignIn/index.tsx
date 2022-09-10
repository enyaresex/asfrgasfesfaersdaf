/* eslint-disable arrow-body-style */
import React, { useContext, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import { mutate } from 'swr';
import { AuthAndApiContext, BreakpointContext, ToastsContext } from '../../contexts';
import { scrollTo } from '../../helpers/scrollTo';
import usernameRegExp from '../../helpers/usernameRegExp';
import { useForm } from '../../hooks';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import TextInput from '../TextInput';
import styles from './SignIn.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

type Form = {
  password: string,
  rememberMe: boolean,
  username: string,
};

export default function SignIn({ className, ...props }: Props) {
  const router = useRouter();
  const intl = useIntl();
  const { api, setUserAccessToken } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const { device } = useContext(BreakpointContext);

  const [values, , updateValue, errors, setErrors] = useForm<Form>({
    password: '',
    rememberMe: false,
    username: '',
  });
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

  useEffect(() => {
    if (device !== 'desktop') {
      const id = window.location.search.split('=')[1];
      scrollTo({ id, pixelSize: 195 });
    }
  }, []);

  return (
    <section {...props} className={classNames(styles.signIn, className)} id="sign-in">
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const response = await api.post('/users/sign_in/', {}, {
            headers: {
              Authorization: `Basic ${btoa(`${values.username}:${values.password}`)}`,
            },
          });

          const responseJson = await response.json();

          if (!response.ok) {
            setErrors(responseJson);

            return;
          }

          await mutate('/users/me/', responseJson.user);
          setUserAccessToken(responseJson.accessToken);

          addToast({
            content: intl.formatMessage({
              defaultMessage: 'You have been successfully signed in. GLHF!',
            }),
            kind: 'success',
          });

          await router.push(router.query.next !== undefined ? router.query.next.toString() : '/arena');
        }}
      >
        <fieldset>
          {errors.detail !== undefined && (
            <div className={styles.error}>
              {errors.detail}
            </div>
          )}

          <Errors errors={errors.nonFieldErrors} />

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
                  <FormattedMessage defaultMessage="Enter a valid 'slug' consisting of letters, numbers, underscores or hyphens." />
                </div>
              )
            }
          </FormGroup>

          <FormGroup error={errors.password}>
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

          <FormGroup className={styles.rememberMeFormGroup}>
            <Checkbox
              checked={values.rememberMe}
              id="checkbox-sign-in-remember-me"
              label={intl.formatMessage({ defaultMessage: 'Remember me' })}
              name="rememberMe"
              onChange={updateValue}
            />
          </FormGroup>

          <Button disabled={!isValidUsername} fullWidth type="submit" variant="secondary">
            <FormattedMessage defaultMessage="Sign In" />
          </Button>
        </fieldset>
      </form>

      <div className={styles.postForm}>
        <Link href="/password-recovery">
          <a className={styles.postFormLink}>
            <FormattedMessage defaultMessage="Forgot password?" />
          </a>
        </Link>
      </div>
    </section>
  );
}
