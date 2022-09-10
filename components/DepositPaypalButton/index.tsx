import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { AuthAndApiContext, RegionContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';

type Props = {
  amount: number | null,
  termsAgreed: boolean,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  setPaymentMethod: React.Dispatch<React.SetStateAction<DepositProvider | null>>,
};

export default function DepositPaypalButton({ amount, setErrors, termsAgreed, setPaymentMethod }: Props) {
  const intl = useIntl();
  const router = useRouter();
  const { api } = useContext(AuthAndApiContext);

  const { region } = useContext(RegionContext);

  return region === undefined ? null : (
    <PayPalButtons
      createOrder={async () => {
        setPaymentMethod('paypal_checkout');

        const response = await api.post('/wallet/transactions/', {
          currencyCode: region.currencyCode,
          gaCoinAmount: amount,
          kind: 'deposit',
          provider: 'paypal_checkout',
        });

        const responseJson = await response.json();

        if (!response.ok) {
          setErrors(responseJson);
        }

        return responseJson.result.id;
      }}
      forceReRender={[termsAgreed]}
      onApprove={async (data: Record<string, unknown>) => {
        const response = await api.post('/wallet/paypal/success/', {
          orderID: data?.orderID,
        });

        const responseJson = await response.json();

        if (response.ok) {
          sendGAEvent({ category: 'Wallet', event: 'Click Deposit', label: 'Deposit' });

          await router.push('/wallet/deposit?success=true');
        } else {
          setErrors(responseJson);
        }
      }}
      onCancel={async (data: Record<string, unknown>) => {
        const response = await api.post('/wallet/paypal/fail/', {
          orderID: data?.orderID,
        });

        if (!response.ok) {
          const responseJson = await response.json();

          setErrors(responseJson);
        }
      }}
      onClick={(data, actions) => {
        if (amount === null || !termsAgreed) {
          setErrors({ termsAgreed: [intl.formatMessage({ defaultMessage: 'You need to accept the terms in order to continue.' })] });

          return actions.reject();
        }

        return actions.resolve();
      }}
      onInit={async (data, actions) => {
        if (amount === null || !termsAgreed) {
          await actions.disable();
        }
      }}
      style={{ color: 'black', label: 'pay', layout: 'horizontal', shape: 'pill', tagline: false }}
    />
  );
}
