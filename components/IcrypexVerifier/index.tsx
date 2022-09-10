import axios from 'axios';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AuthAndApiContext, LocalizationContext } from '../../contexts';
import Button from '../Button';
import FormGroup from '../FormGroup';
import TextInput from '../TextInput';
import { ReactComponent as Info } from '../WithdrawPaymentMethod/info.svg';
import styles from './IcrypexVerifier.module.css';

type IcrypexUserInfo = {
  email: string | null,
  phone: string | null,
  firstName: string | null,
  lastName: string | null,
  identity: string | null,
  isVerified: boolean | null,
  smsPassword: string | null,
};

type IcrypexResponse = {
  returnCode: string | null,
  returnMessage: string | null,
  gaValidation: Record<string, Array<string>> | null,
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  errors: Record<string, Array<string>>,
  paymentMethod: 'icrypex' | 'icrypex_deposit' | null,
  icrypexUserInfo: IcrypexUserInfo,
  icrypexResponse: IcrypexResponse,
  gaCoinAmount: number | null,
  setIcrypexUserInfo: (paymentMethod: Props['icrypexUserInfo']) => void,
  setIcrypexResponse: (paymentMethod: Props['icrypexResponse']) => void,
}>;

export default function IcrypexVerifier({
  className,
  errors,
  paymentMethod,
  gaCoinAmount,
  icrypexUserInfo,
  icrypexResponse,
  setIcrypexUserInfo,
  setIcrypexResponse,
  ...props
}: Props) {
  const intl = useIntl();
  const { languageCode } = useContext(LocalizationContext);
  const { userAccessToken } = useContext(AuthAndApiContext);

  return (
    <section {...props} className={classNames(styles.icrypexVerifier, className)}>
      <div className={styles.icrypexInputs}>
        <FormGroup error={icrypexResponse.gaValidation?.firstName ? icrypexResponse.gaValidation.firstName : errors.firstName}>
          <TextInput
            disabled={icrypexUserInfo.isVerified || false}
            id="icrypex-wallet-name"
            label={intl.formatMessage({ defaultMessage: 'First Name' })}
            name="name"
            onChange={(e) => setIcrypexUserInfo({ ...icrypexUserInfo, firstName: e.target.value })}
            required={paymentMethod === 'icrypex_deposit' || paymentMethod === 'icrypex'}
            size="large"
            value={icrypexUserInfo.firstName || ''}
          />
        </FormGroup>

        <FormGroup error={icrypexResponse.gaValidation?.lastName ? icrypexResponse.gaValidation.lastName : errors.lastName}>
          <TextInput
            disabled={icrypexUserInfo.isVerified || false}
            id="icrypex-wallet-lastname"
            label={intl.formatMessage({ defaultMessage: 'Last Name' })}
            name="lastname"
            onChange={(e) => setIcrypexUserInfo({ ...icrypexUserInfo, lastName: e.target.value })}
            required={paymentMethod === 'icrypex_deposit' || paymentMethod === 'icrypex'}
            size="large"
            value={icrypexUserInfo.lastName || ''}
          />
        </FormGroup>

        <FormGroup error={icrypexResponse.gaValidation?.email ? icrypexResponse.gaValidation.email : errors.email}>
          <TextInput
            disabled={icrypexUserInfo.isVerified || false}
            id="icrypex-wallet-email"
            label={intl.formatMessage({ defaultMessage: 'Email' })}
            name="email"
            onChange={(e) => setIcrypexUserInfo({ ...icrypexUserInfo, email: e.target.value })}
            required={paymentMethod === 'icrypex_deposit' || paymentMethod === 'icrypex'}
            size="large"
            value={icrypexUserInfo.email || ''}
          />
        </FormGroup>

        <FormGroup error={icrypexResponse.gaValidation?.identity ? icrypexResponse.gaValidation.identity : errors.identity}>
          <TextInput
            disabled={icrypexUserInfo.isVerified || false}
            id="icrypex-wallet-identity"
            label={intl.formatMessage({ defaultMessage: 'TC No' })}
            name="identity"
            onChange={(e) => setIcrypexUserInfo({ ...icrypexUserInfo, identity: e.target.value })}
            required={paymentMethod === 'icrypex_deposit' || paymentMethod === 'icrypex'}
            size="large"
            value={icrypexUserInfo.identity || ''}
          />
        </FormGroup>

        <FormGroup error={icrypexResponse.gaValidation?.phone ? icrypexResponse.gaValidation.phone : errors.phone}>
          <TextInput
            disabled={icrypexUserInfo.isVerified || false}
            id="icrypex-wallet-phone"
            label={intl.formatMessage({ defaultMessage: 'Phone (90532.......)' })}
            name="phone"
            onChange={(e) => setIcrypexUserInfo({ ...icrypexUserInfo, phone: e.target.value })}
            required={paymentMethod === 'icrypex_deposit' || paymentMethod === 'icrypex'}
            size="large"
            value={icrypexUserInfo.phone || ''}
          />
        </FormGroup>

        {/* eslint-disable-next-line max-len */}
        <FormGroup error={icrypexResponse.gaValidation?.smsPassword ? icrypexResponse.gaValidation.smsPassword : errors.smsPassword}>
          <TextInput
            id="icrypex-wallet-sms-password"
            label={intl.formatMessage({ defaultMessage: 'SMS Password' })}
            name="smsPassword"
            onChange={(e) => setIcrypexUserInfo({ ...icrypexUserInfo, smsPassword: e.target.value })}
            required={paymentMethod === 'icrypex_deposit' || paymentMethod === 'icrypex'}
            size="large"
            value={icrypexUserInfo.smsPassword || ''}
          />
        </FormGroup>

        {icrypexResponse.returnCode !== '0' && (
          <Button
            className={styles.button}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();

              if (paymentMethod === 'icrypex') {
                // WITHDRAW
                axios.post(
                  `${process.env.NEXT_PUBLIC_GAMERARENA_API_URL}/wallet/icrypex/sms/`,
                  {
                    email: icrypexUserInfo.email,
                    phone: icrypexUserInfo.phone,
                    firstName: icrypexUserInfo.firstName,
                    lastName: icrypexUserInfo.lastName,
                    identity: icrypexUserInfo.identity,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Token ${userAccessToken}`,
                      'Accept-Language': languageCode,
                    },
                  },
                ).then((response) => {
                  setIcrypexResponse({
                    ...icrypexResponse,
                    returnCode: response.data.returnCode,
                    returnMessage: response.data.returnMessage,
                    gaValidation: {},
                  });
                }).catch((error) => {
                  if (error.response.status === 400) {
                    setIcrypexResponse({
                      ...icrypexResponse,
                      gaValidation: error.response.data,
                    });
                  } else {
                    // eslint-disable-next-line no-alert
                    window.alert('Couldn\'t connect to IcrypexAPI!');
                  }
                });
              } else if (paymentMethod === 'icrypex_deposit') {
                // DEPOSIT
                axios.post(
                  `${process.env.NEXT_PUBLIC_GAMERARENA_API_URL}/wallet/icrypex/deposit_sms/`,
                  {
                    email: icrypexUserInfo.email,
                    phone: icrypexUserInfo.phone,
                    firstName: icrypexUserInfo.firstName,
                    lastName: icrypexUserInfo.lastName,
                    identity: icrypexUserInfo.identity,
                    amount: gaCoinAmount,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Token ${userAccessToken}`,
                      'Accept-Language': languageCode,
                    },
                  },
                ).then((response) => {
                  setIcrypexResponse({
                    ...icrypexResponse,
                    returnCode: response.data.returnCode,
                    returnMessage: response.data.returnMessage,
                    gaValidation: {},
                  });
                }).catch((error) => {
                  if (error.response.status === 400) {
                    setIcrypexResponse({
                      ...icrypexResponse,
                      gaValidation: error.response.data,
                    });
                  } else {
                    // eslint-disable-next-line no-alert
                    window.alert('Couldn\'t connect to IcrypexAPI!');
                  }
                });
              }
            }}
            variant="green"
          >
            <FormattedMessage defaultMessage="Get SMS Password" />
          </Button>
        )}

        {icrypexResponse.returnCode !== '0' && icrypexResponse.returnCode !== null && (
          <div className={styles.error}>
            <br />
            <p>{icrypexResponse.returnMessage}</p>
          </div>
        )}
      </div>

      {icrypexUserInfo.isVerified && (
        <div className={styles.disclaimer}>
          <Info />

          <p>
            <FormattedMessage defaultMessage="If you want to change your Icrypex account, please contact us." />
          </p>
        </div>
      )}
    </section>
  );
}
