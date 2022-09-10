import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AuthAndApiContext, ToastsContext } from '../../contexts';
import { useForm } from '../../hooks';
import Button from '../Button';
import EmptyStateDisplay from '../EmptyStateDisplay';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import Modal from '../Modal';
import SettingsBlockedUser from '../SettingsBlockedUser';
import SettingsSectionTitle from '../SettingsSectionTitle';
import UserInput from '../UserInput';
import styles from './SettingsBlockUsers.module.css';

type Form = {
  user: number | null,
}

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

export default function SettingsBlockUsers({ className, ...props }: Props) {
  const intl = useIntl();
  const { api, user } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [values, , updateValue, errors, setErrors] = useForm<Form>({ user: null });
  const { data: blockedUsers } = useSWR<BlockedUser[]>('/users/blocked/');
  const { data: userBlocked } = useSWR(values.user === null ? null : `/users/blocked/?blocked_user=${values.user}`);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <section {...props} className={classNames(styles.settingsBlockUsers, className)}>
      <SettingsSectionTitle title={intl.formatMessage({ defaultMessage: 'Block Users' })} />

      <Modal
        actions={(
          <>
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              <FormattedMessage defaultMessage="Close" />
            </Button>

            <Button
              onClick={async () => {
                const response = await api.post('/users/blocked/', {
                  blockedUser: values.user,
                });

                const responseJSON = await response.json();

                if (response.ok) {
                  await mutate('/users/blocked/');
                  await mutate(`/users/blocked/?blocked_user=${values.user}`);

                  updateValue('user', null);
                } else {
                  setErrors(responseJSON);
                }

                setIsDisabled(false);

                setIsModalOpen(false);
              }}
              type="button"
            >
              <FormattedMessage defaultMessage="Block User" />
            </Button>
          </>
        )}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <FormattedMessage defaultMessage="Are you sure you want to block this user?" />
      </Modal>

      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();

          if (userBlocked === undefined) return;

          setIsDisabled(true);

          if (userBlocked.length !== 0) {
            setIsDisabled(false);

            addToast({
              content: intl.formatMessage({ defaultMessage: 'This user is already blocked.' }),
              isPersistent: true,
              kind: 'warning',
            });

            return;
          }

          setIsModalOpen(true);
        }}
      >
        <fieldset className={styles.fieldset} disabled={isDisabled}>
          <Errors errors={errors.nonFieldErrors} />

          <FormGroup error={errors.user}>
            <UserInput
              id="settings-block-users-user-input"
              idExclude={user === null ? undefined : [user.id]}
              label={intl.formatMessage({ defaultMessage: 'Username' })}
              name="user"
              onChange={(userId) => updateValue('user', userId)}
              required
              size="large"
              value={values.user}
            />
          </FormGroup>

          <Button fullWidth type="submit" variant="secondary">
            <FormattedMessage defaultMessage="Block User" />
          </Button>
        </fieldset>
      </form>

      {blockedUsers === undefined ? null : (
        <>
          <div className={styles.header}>
            <h3><FormattedMessage defaultMessage="Blocked Users" /></h3>
          </div>

          {blockedUsers.length === 0
            ? (
              <EmptyStateDisplay
                className={styles.empty}
                kind="noUserGame"
                message={intl.formatMessage({ defaultMessage: 'There are no blocked users.' })}
              />
            ) : (
              <div className={styles.blockedUsers}>
                {blockedUsers.map((u) => (
                  <SettingsBlockedUser
                    blockedUser={u}
                    key={u.blockedUser}
                  />
                ))}
              </div>
            )}
        </>
      )}
    </section>
  );
}
