/* eslint-disable arrow-body-style */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { debounce } from 'lodash';
import {
  Button,
  Container,
  FormGroup,
  HeadTagsHandler,
  Layout,
  PageHeader,
  Select,
  TextInput,
  withAuth,
} from '../../components';
import Errors from '../../components/Errors';
import { AuthAndApiContext } from '../../contexts';
import usernameRegExp from '../../helpers/usernameRegExp';
import { useForm } from '../../hooks';
import { ReactComponent as Done } from './done.svg';
import styles from './PasswordRecovery.module.css';

type Field = 'email' | 'username';

type Form = {
  field: Field,
  email: string,
  username: string,
};

type Payload = {
  field: Field,
  value: string,
};

function PasswordRecovery() {
  const intl = useIntl();
  const { api } = useContext(AuthAndApiContext);

  const [values, , updateValue, errors, setErrors] = useForm<Form>({ field: 'username', email: '', username: '' });
  const [isDone, setIsDone] = useState<boolean>(false);
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const payload: Payload = {
      field: values.field,
      value: values[values.field],
    };

    const response = await api.post('/users/recover_password/', payload);
    const responseJson = await response.json();

    if (response.ok) {
      setIsDone(true);
    } else {
      setErrors(responseJson);
    }
  }

  return (
    <>
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Password Recovery' })} | Gamer Arena`} />

      <Layout className={styles.passwordRecovery}>
        <PageHeader
          background="passwordRecovery"
          description={intl.formatMessage({ defaultMessage: 'In order to recover your password please enter your username or e-mail address.' })}
          title={intl.formatMessage({ defaultMessage: 'Password Recovery' })}
        />

        <Container>
          <div className={styles.body}>
            {isDone ? (
              <div className={styles.done}>
                <Done />

                <p className={styles.doneDescription}>
                  <FormattedMessage defaultMessage="We have sent you an e-mail with instructions to reset your password. Please check your inbox." />
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <Errors errors={errors.nonFieldErrors} />

                <FormGroup>
                  <Select
                    id="select-field"
                    label={intl.formatMessage({ defaultMessage: 'Username or E-mail Address' })}
                    name="field"
                    onChange={updateValue}
                    required
                    value={values.field}
                  >
                    <option value="username">
                      {intl.formatMessage({ defaultMessage: 'Username' })}
                    </option>

                    <option value="email">
                      {intl.formatMessage({ defaultMessage: 'E-mail Address' })}
                    </option>
                  </Select>
                </FormGroup>

                {values.field === 'username' && (
                  <FormGroup error={errors.username}>
                    <TextInput
                      id="text-input-username"
                      label={intl.formatMessage({ defaultMessage: 'Username' })}
                      name="username"
                      onChange={(e) => usernameHandleChange(e.target.value)}
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
                )}

                {values.field === 'email' && (
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
                )}

                <Button disabled={values.field === 'username' && !isValidUsername} fullWidth type="submit">
                  <FormattedMessage defaultMessage="Continue" />
                </Button>
              </form>
            )}
          </div>
        </Container>
      </Layout>
    </>
  );
}

export default withAuth('anonymous', PasswordRecovery);
