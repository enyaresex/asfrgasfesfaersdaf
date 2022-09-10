import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import {
  AnalyticsProvider,
  Button,
  Container,
  Errors,
  HeadTagsHandler,
  Layout,
  Modal,
  PageHeader,
  WalletTransactions,
  withAuth,
  WithdrawAmountSelection,
  WithdrawCurrencyRate,
  WithdrawModal,
  WithdrawPaymentMethod,
} from '../../../components';
import { AuthAndApiContext, BreakpointContext, RegionContext } from '../../../contexts';
import { sendGAEvent } from '../../../helpers';
import { useForm } from '../../../hooks';
import styles from './Withdraw.module.css';

type Form = {
  amount: number | null,
  paymentMethod: PaymentProvider | null,
};

type PaparaUserInfo = {
  paparaId: string | null,
  tcIdNumber: string | null,
};

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

function Withdraw() {
  const intl = useIntl();
  const { api } = useContext(AuthAndApiContext);
  const { region } = useContext(RegionContext);
  const { data: wallet } = useSWR<WalletDetail>('/wallet/wirecard/', { shouldRetryOnError: false });
  const {
    data: papara,
    error: paparaError
  } = useSWR<PaparaWallet>('/wallet/papara/', { shouldRetryOnError: false });
  const {
    data: icrypex,
    error: icrypexError
  } = useSWR<IcrypexWallet>('/wallet/icrypex/', { shouldRetryOnError: false });
  const { data: paypal } = useSWR<PaypalWallet>('/wallet/paypal/', { shouldRetryOnError: false });
  const { device } = useContext(BreakpointContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [paparaUserInfo, setPaparaUserInfo] = useState<PaparaUserInfo>({
    paparaId: null,
    tcIdNumber: null,
  });
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
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({
    amount: null,
    paymentMethod: null,
  });

  const base = useMemo<number | null>(() => {
    if (region === undefined) return null;

    return 50;
  }, [region]);

  useEffect(() => {
    if (base === null) return;

    if (values.amount === null) {
      updateValue('amount', base);
    }
  }, [base]);

  useEffect(() => {
    const singleWidthdrawMethod = region.withdrawProviders.length > 0 && region.withdrawProviders.length === 1;

    if (singleWidthdrawMethod) {
      setValues(prevState => ({
        ...prevState,
        paymentMethod: region.withdrawProviders[0] as PaymentProvider
      }));
    }
  }, [region]);

  const providerDetails = useMemo<Record<string, unknown> | null>(() => {
    if (values.paymentMethod === 'papara_masspayment') {
      return {
        provider: 'papara_masspayment',
        tcIdNumber: paparaError?.status === 404 ? paparaUserInfo.tcIdNumber : papara?.tckn,
        paparaId: paparaError?.status === 404 ? paparaUserInfo.paparaId : papara?.accountNumber,
      };
    }

    if (values.paymentMethod === 'icrypex') {
      return {
        provider: 'icrypex',
        email: icrypexError?.status === 404 ? icrypexUserInfo.email : icrypex?.email,
        phone: icrypexError?.status === 404 ? icrypexUserInfo.phone : icrypex?.phone,
        firstName: icrypexError?.status === 404 ? icrypexUserInfo.firstName : icrypex?.firstName,
        lastName: icrypexError?.status === 404 ? icrypexUserInfo.lastName : icrypex?.lastName,
        identity: icrypexError?.status === 404 ? icrypexUserInfo.identity : icrypex?.identity,
        smsPassword: icrypexUserInfo.smsPassword,
      };
    }

    if (values.paymentMethod === 'wirecard_emoney') {
      if (wallet === undefined) return null;

      return {
        provider: 'wirecard_emoney',
      };
    }

    if (values.paymentMethod === 'n11') {
      return {
        provider: 'n11',
      };
    }

    if (values.paymentMethod === 'paypal_payments') {
      return {
        provider: 'paypal_payments',
      };
    }

    return null;
  }, [paparaError, paparaUserInfo, icrypexError, icrypexUserInfo, icrypexResponse, paypal, values.paymentMethod, wallet]);

  useEffect(() => {
    if (papara !== undefined) {
      setPaparaUserInfo({
        paparaId: papara.accountNumber,
        tcIdNumber: papara.tckn,
      });
    }

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
  }, [papara, icrypex]);

  const withdrawPage = region === undefined ? null : (
    <AnalyticsProvider category="Wallet">
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Withdraw' })} | Gamer Arena`}/>

      <WithdrawModal isOpen={isOpen}/>

      <Modal
        actions={(
          <>
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              <FormattedMessage defaultMessage="Close"/>
            </Button>

            <Button
              onClick={async () => {
                if (region === undefined) return;

                setIsDisabled(true);

                const response = await api.post('/wallet/transactions/', {
                  ...providerDetails,
                  currencyCode: region.currencyCode,
                  gaCoinAmount: values.amount,
                  kind: 'withdraw',
                });

                const responseJson = await response.json();

                if (response.ok) {
                  sendGAEvent({
                    category: 'Wallet',
                    event: 'Click Withdraw',
                    label: 'Withdraw'
                  });

                  setIsOpen(true);
                } else {
                  setErrors(responseJson);
                }

                setIsDisabled(false);
                setIsModalOpen(false);
              }}
              type="button"
            >
              <FormattedMessage defaultMessage="Withdraw"/>
            </Button>
          </>
        )}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <FormattedMessage defaultMessage="Are you sure you want to request withdrawal?"/>
      </Modal>

      <Layout className={styles.withdraw}>
        <PageHeader
          background="wallet"
          description={intl.formatMessage({ defaultMessage: 'You can easily withdraw from your wallet.' })}
          title={intl.formatMessage({ defaultMessage: 'Withdraw' })}
        />

        <Container className={styles.container}>
          <div className={styles.wrapper}>
            <form
              className={styles.col}
              onSubmit={async (e) => {
                e.preventDefault();

                if (base === null) return;

                if (values.amount === null) return;

                setErrors({});
                setIsDisabled(true);

                /* Round Amount */
                if (values.amount % base !== 0) {
                  if (values.amount <= base) {
                    setValues({
                      ...values,
                      amount: 0
                    });
                  } else {
                    const modulo = values.amount % base === 0 ? base : values.amount % base;

                    setValues({
                      ...values,
                      amount: values.amount - modulo
                    });
                  }

                  setIsDisabled(false);

                  return;
                }

                if (providerDetails === null) {
                  setIsDisabled(false);

                  setErrors({
                    ...errors,
                    provider: [intl.formatMessage({ defaultMessage: 'Select a payment method.' })],
                  });

                  setIsDisabled(false);

                  return;
                }

                setIsModalOpen(true);

                setIsDisabled(false);
              }}
            >
              <fieldset className={styles.fieldset} disabled={isDisabled}>
                <WithdrawCurrencyRate amount={values.amount} paymentMethod={values.paymentMethod}
                                      region={(region as Region)}/>

                <WithdrawAmountSelection
                  amount={values.amount}
                  error={errors.tokenAmount}
                  setAmount={(amount) => updateValue('amount', amount)}
                />

                <WithdrawPaymentMethod
                  errors={errors}
                  icrypexResponse={icrypexResponse}
                  icrypexUserInfo={icrypexUserInfo}
                  paparaUserInfo={paparaUserInfo}
                  paymentMethod={values.paymentMethod}
                  setIcrypexResponse={setIcrypexResponse}
                  setIcrypexUserInfo={setIcrypexUserInfo}
                  setPaparaUserInfo={setPaparaUserInfo}
                  setPaymentMethod={(paymentMethod) => updateValue('paymentMethod', paymentMethod)}
                />

                <Errors errors={errors.nonFieldErrors}/>

                {(values.paymentMethod === 'paypal_payments' && paypal === undefined) ? (
                  <Button
                    href={'https://www.sandbox.paypal.com/connect?flowEntry=static'
                      + `&client_id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`
                      + '&response_type=code'
                      + `&scope=${['openid', 'profile', 'email'].join(' ')}`
                      + `&redirect_uri=${process.env.NEXT_PUBLIC_PAYPAL_URL}`}
                    variant="secondary"
                  >
                    <FormattedMessage defaultMessage="Connect with Paypal"/>
                  </Button>
                ) : (
                  <Button size="large" type="submit" variant="green">
                    <FormattedMessage defaultMessage="Withdraw"/>
                  </Button>
                )}
              </fieldset>
            </form>

            {device === 'desktop' && (
              <div className={styles.col}>
                <WalletTransactions/>
              </div>
            )}
          </div>
        </Container>
      </Layout>
    </AnalyticsProvider>
  );

  return region !== undefined && region.depositProviders.includes('paypal_checkout') ? (
    <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string }}>
      {withdrawPage}
    </PayPalScriptProvider>
  ) : withdrawPage;
}

export default withAuth('user', Withdraw);
