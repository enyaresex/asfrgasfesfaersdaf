import { useRouter } from 'next/router';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  ActivityIndicator,
  Button,
  Container,
  FormGroup,
  HeadTagsHandler,
  Layout,
  PageHeader,
  TextInput,
  withAuth,
} from '../../components';
import Errors from '../../components/Errors';
import { AuthAndApiContext, ToastsContext } from '../../contexts';
import { useForm } from '../../hooks';
import styles from './PasswordReset.module.css';

type Form = {
  password2: string,
  password: string,
  passwordResetToken: string | null,
  uid: string | null,
};

function PasswordReset() {
  const intl = useIntl();
  const { api, setUserAccessToken } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const router = useRouter();

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({
    password: '',
    password2: '',
    passwordResetToken: null,
    uid: null,
  });

  async function validate(): Promise<void> {
    const { passwordResetToken, uid } = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    if (passwordResetToken !== undefined && uid !== undefined) {
      const response = await api.post('/users/validate_password_reset_token/', { passwordResetToken, uid });

      if (response.ok) {
        setValues({ ...values, passwordResetToken: passwordResetToken.toString(), uid: uid.toString() });
        return;
      }
    }

    addToast({
      content: intl.formatMessage({ defaultMessage: 'This link is not valid. Please contact support if you need help.' }),
      kind: 'warning',
    });

    await router.replace('/');
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsDisabled(true);

    const response = await api.post('/users/reset_password/', values);
    const responseJson = await response.json();

    if (response.ok) {
      setUserAccessToken(responseJson.accessToken);

      addToast({
        content: intl.formatMessage({ defaultMessage: 'Your password is successfully reset. Welcome back!' }),
        kind: 'success',
      });
    } else {
      setErrors(responseJson);

      setIsDisabled(false);
    }
  }

  useEffect(() => {
    validate();
  }, []);

  return (
    <>
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Password Reset' })} | Gamer Arena`} />

      <Layout className={styles.passwordReset}>
        {values.passwordResetToken === null || values.uid === null ? (
          <ActivityIndicator flex />
        ) : (
          <>
            <PageHeader
              background="passwordReset"
              description={intl.formatMessage({ defaultMessage: 'Please enter your new password.' })}
              title={intl.formatMessage({ defaultMessage: 'Password Reset' })}
            />

            <Container>
              <div className={styles.body}>
                <Errors errors={errors.nonFieldErrors} textAlign="center" />

                <form onSubmit={onSubmit}>
                  <fieldset disabled={isDisabled}>
                    <Errors errors={errors.nonFieldErrors} />

                    <FormGroup error={errors.password}>
                      <TextInput
                        id="text-input-password"
                        label={intl.formatMessage({ defaultMessage: 'New Password' })}
                        name="password"
                        onChange={updateValue}
                        type="password"
                      />
                    </FormGroup>

                    <FormGroup error={errors.password2}>
                      <TextInput
                        id="text-input-password2"
                        label={intl.formatMessage({ defaultMessage: 'New Password (again)' })}
                        name="password2"
                        onChange={updateValue}
                        type="password"
                      />
                    </FormGroup>

                    <Button fullWidth type="submit">
                      <FormattedMessage defaultMessage="Reset Password" />
                    </Button>
                  </fieldset>
                </form>
              </div>
            </Container>
          </>
        )}
      </Layout>
    </>
  );
}

export default withAuth('anonymous', PasswordReset);
