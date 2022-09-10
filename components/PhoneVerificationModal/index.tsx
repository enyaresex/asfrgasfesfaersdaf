import range from 'lodash/range';
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { mutate } from 'swr';
import { AuthAndApiContext, ToastsContext } from '../../contexts';
import Button from '../Button';
import Modal from '../Modal';
import styles from './PhoneVerificationModal.module.css';

const queryParameter = 'phoneVerification';
const length: number = 6;

export default function PhoneVerificationModal() {
  const router = useRouter();
  const intl = useIntl();
  const { api } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const inputRefs = useRef<(HTMLDivElement | null)[]>(range(0, length).map(() => null));
  const [codes, setCodes] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function onClose() {
    const { [queryParameter]: _, ...query } = router.query;

    await router.push({
      pathname: router.pathname,
      query,
    });
  }

  return (
    <Modal
      dialogClassName={styles.phoneVerificationModal}
      isOpen={router.query[queryParameter] === 'true'}
      onClose={onClose}
    >
      <p className={styles.muted}>
        <FormattedMessage defaultMessage="We have sent you an SMS with a 6 digit code to verification code. In order to verify your phone number, please type it in." />
      </p>

      <form
        className={styles.body}
        onSubmit={async (e) => {
          e.preventDefault();

          setIsDisabled(true);
          setError(null);

          const response = await api.post('/users/verify_phone_number/', {
            phoneNumberVerificationToken: codes.join(''),
          });

          const responseJson = await response.json();

          if (response.ok) {
            await mutate('/users/me/');

            addToast({
              content: intl.formatMessage({ defaultMessage: 'Your phone number is successfully verified.' }),
              kind: 'success',
            });

            await onClose();
          } else {
            setIsDisabled(false);
            setError(responseJson.phoneNumberVerificationToken);
          }
        }}
      >
        <fieldset className={styles.fieldset} disabled={isDisabled}>
          <div className={styles.inputs}>
            {range(0, length).map((i) => (
              <input
                autoFocus={i === 0}
                className={styles.input}
                id={`code-input-${i}`}
                key={i}
                onChange={(event) => {
                  setError(null);

                  const indexValue = event.target.value.slice(0, 1) || '';

                  codes[i] = indexValue;

                  setCodes([...codes]);

                  if (indexValue !== '') {
                    if (i < length - 1) {
                      inputRefs.current[i + 1]?.focus();
                    }
                  }
                }}
                onFocus={(event) => {
                  event.target.select();
                }}
                onKeyUp={(event) => {
                  if (i > 0 && event.key === 'Backspace' && codes[i] === '') {
                    inputRefs.current[i - 1]?.focus();
                  }
                }}
                ref={(ref) => {
                  inputRefs.current[i] = ref;
                }}
                required
                type="tel"
                value={codes[i]}
              />
            ))}
          </div>

          {error !== null && <p className={styles.error}>{error}</p>}

          <Button type="submit" variant="green">
            <FormattedMessage defaultMessage="Verify" />
          </Button>
        </fieldset>
      </form>
    </Modal>
  );
}
