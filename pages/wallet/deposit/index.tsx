import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import {
  ActivityIndicator,
  AnalyticsProvider,
  Button,
  Container,
  DepositAmountSelection,
  DepositCurrencyRate,
  DepositModal,
  DepositPaymentMethod,
  HeadTagsHandler,
  Layout,
  PageHeader,
  WalletTransactions,
  withAuth,
} from '../../../components';
import DepositPaypalButton from '../../../components/DepositPaypalButton';
import { AuthAndApiContext, BreakpointContext, RegionContext } from '../../../contexts';
import { sendGAEvent } from '../../../helpers';
import { useForm } from '../../../hooks';
import styles from './Deposit.module.css';

type Form = {
  gaCoinAmount: number | null,
  provider: DepositProvider | null,
  termsAgreed: boolean,
}

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

function Deposit() {
  const intl = useIntl();
  const { device } = useContext(BreakpointContext);
  const { api } = useContext(AuthAndApiContext);

  const { region } = useContext(RegionContext);
  const { data: icrypex, error: icrypexError } = useSWR<IcrypexWallet>(
    '/wallet/icrypex/',
    { shouldRetryOnError: false },
  );
  const [icrypexUserInfo, setIcrypexUserInfo] = useState<IcrypexUserInfo>({
    email: null,
    phone: null,
    firstName: null,
    lastName: null,
    identity: null,
    isVerified: null,
    smsPassword: null,
  });
  const [icrypexResponse, setIcrypexResponse] = useState<IcrypexResponse>({
    returnCode: null,
    returnMessage: null,
    gaValidation: null,
  });
  const [values, , updateValue, errors, setErrors] = useForm<Form>({
    gaCoinAmount: 200,
    provider: null,
    termsAgreed: false,
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (values.provider !== null) {
      sendGAEvent({ category: 'Wallet', event: 'Set Provider', label: 'Deposit', value: values.provider });
    }
  }, [values.provider]);

  useEffect(() => {
    if (icrypex !== undefined) {
      setIcrypexUserInfo({
        email: icrypex.email,
        phone: icrypex.phone,
        firstName: icrypex.firstName,
        lastName: icrypex.lastName,
        identity: icrypex.identity,
        isVerified: icrypex.isVerified,
        smsPassword: null,
      });
    }
  }, [icrypex]);

  const providerDetails = useMemo<Record<string, unknown> | null>(() => {
    if (values.provider === 'icrypex_deposit') {
      return {
        provider: 'icrypex_deposit',
        email: icrypexError?.status === 404 ? icrypexUserInfo.email : icrypex?.email,
        phone: icrypexError?.status === 404 ? icrypexUserInfo.phone : icrypex?.phone,
        firstName: icrypexError?.status === 404 ? icrypexUserInfo.firstName : icrypex?.firstName,
        lastName: icrypexError?.status === 404 ? icrypexUserInfo.lastName : icrypex?.lastName,
        identity: icrypexError?.status === 404 ? icrypexUserInfo.identity : icrypex?.identity,
        smsPassword: icrypexUserInfo.smsPassword,
      };
    }

    if (values.provider === 'wirecard_pos') {
      return {
        provider: 'wirecard_pos',
      };
    }

    if (values.provider === 'paypal_checkout') {
      return {
        provider: 'paypal_checkout',
      };
    }

    return null;
  }, [icrypexError, icrypexUserInfo, icrypexResponse, values.provider]);

  const depositPage = (
    <AnalyticsProvider category="Wallet">
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Deposit' })} | Gamer Arena`} />

      <DepositModal />

      <Layout className={styles.deposit}>
        <PageHeader
          background="wallet"
          description={intl.formatMessage({ defaultMessage: 'You can easily deposit to your wallet.' })}
          title={intl.formatMessage({ defaultMessage: 'Deposit' })}
        />

        <Container className={styles.container}>
          {region === undefined ? <ActivityIndicator /> : (
            <div className={styles.wrapper}>
              <form
                className={styles.col}
                onSubmit={async (e) => {
                  e.preventDefault();

                  setIsDisabled(true);

                  if (values.provider === null) {
                    setErrors({
                      ...errors,
                      provider: [intl.formatMessage({ defaultMessage: 'Select a payment method' })],
                    });

                    setIsDisabled(false);

                    return;
                  }

                  const response = await api.post('/wallet/transactions/', {
                    ...providerDetails,
                    gaCoinAmount: values.gaCoinAmount,
                    kind: 'deposit',
                  });

                  const responseJson = await response.json();

                  if (response.ok) {
                    sendGAEvent({ category: 'Wallet', event: 'Click Deposit', label: 'Deposit' });

                    if (values.provider === 'wirecard_pos') {
                      document.location.href = responseJson.result.redirectUrl;
                    }
                  } else {
                    setErrors(responseJson);
                  }

                  setIsDisabled(false);
                }}
              >
                <fieldset className={styles.fieldset} disabled={isDisabled}>
                  <DepositCurrencyRate amount={values.gaCoinAmount} />

                  <DepositAmountSelection
                    amount={values.gaCoinAmount}
                    error={errors.gaCoinAmount}
                    setAmount={(gaCoinAmount) => updateValue('gaCoinAmount', gaCoinAmount)}
                  />

                  <DepositPaymentMethod
                    errors={errors}
                    gaCoinAmount={values.gaCoinAmount}
                    icrypexResponse={icrypexResponse}
                    icrypexUserInfo={icrypexUserInfo}
                    paymentMethod={values.provider}
                    setIcrypexResponse={setIcrypexResponse}
                    setIcrypexUserInfo={setIcrypexUserInfo}
                    setPaymentMethod={(provider) => updateValue('provider', provider)}
                    setTermsAgreed={(termsAgreed) => updateValue('termsAgreed', termsAgreed)}
                    termsAgreed={values.termsAgreed}
                    termsAgreedError={errors.termsAgreed}
                  />

                  {values.provider !== 'paypal_checkout' && (
                    <Button disabled={!values.provider || !values.termsAgreed} size="large" type="submit" variant="green">
                      <FormattedMessage defaultMessage="Deposit" />
                    </Button>
                  )}

                  {values.provider === 'paypal_checkout' && (
                    <DepositPaypalButton
                      amount={values.gaCoinAmount}
                      setErrors={setErrors}
                      setPaymentMethod={(provider) => updateValue('provider', provider)}
                      termsAgreed={values.termsAgreed}
                    />
                  )}
                </fieldset>
              </form>

              {device === 'desktop' && (
                <div className={styles.col}>
                  <WalletTransactions />
                </div>
              )}
            </div>
          )}
        </Container>
      </Layout>
    </AnalyticsProvider>
  );

  return region !== undefined && region.depositProviders.includes('paypal_checkout') ? (
    <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string }}>
      {depositPage}
    </PayPalScriptProvider>
  ) : depositPage;
}

export default withAuth('user', Deposit);
