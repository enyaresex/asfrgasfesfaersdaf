import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import { AnalyticsContext, RegionContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import { ReactComponent as Card } from '../DepositPaymentMethod/card.svg';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import IcrypexVerifier from '../IcrypexVerifier';
import RadioInput from '../RadioInput';
import TextInput from '../TextInput';
import Icrypex from './icrypex.png';
import { ReactComponent as Info } from './info.svg';
import N11 from './n11.png';
import Papara from './papara.png';
import { ReactComponent as PayPal } from './paypal.svg';
import styles from './WithdrawPaymentMethod.module.css';

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

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  errors: Record<string, Array<string>>,
  paparaUserInfo: PaparaUserInfo,
  icrypexUserInfo: IcrypexUserInfo,
  icrypexResponse: IcrypexResponse,
  paymentMethod: PaymentProvider | null,
  setPaparaUserInfo: (paymentMethod: Props['paparaUserInfo']) => void,
  setIcrypexUserInfo: (paymentMethod: Props['icrypexUserInfo']) => void,
  setIcrypexResponse: (paymentMethod: Props['icrypexResponse']) => void,
  setPaymentMethod: (paymentMethod: Props['paymentMethod']) => void,
}>;

export default function WithdrawPaymentMethod({
  className,
  errors,
  paparaUserInfo,
  icrypexUserInfo,
  icrypexResponse,
  paymentMethod,
  setPaparaUserInfo,
  setIcrypexUserInfo,
  setIcrypexResponse,
  setPaymentMethod,
  ...props
}: Props) {
  const intl = useIntl();
  const { category } = useContext(AnalyticsContext);
  const { region } = useContext(RegionContext);
  const { data: wallet } = useSWR<WalletDetail>('/wallet/wirecard/', { shouldRetryOnError: false });
  const { data: papara } = useSWR<PaparaWallet>('/wallet/papara/', { shouldRetryOnError: false });
  const singleWidthdrawMethod = region.withdrawProviders.length === 1;

  useEffect(() => {
    if (paymentMethod !== null) {
      sendGAEvent({
        category,
        event: 'Set Provider',
        label: 'Withdraw',
        value: paymentMethod || ''
      });
    }
  }, [paymentMethod]);

  return region === undefined ? null : (
    <section {...props}
             className={classNames(styles.withdrawPaymentMethod, className)}>
      <div className={styles.header}>
        <h4><FormattedMessage defaultMessage="How You Get Paid"/></h4>
      </div>

      <div className={classNames(styles.body, singleWidthdrawMethod && styles.singleWidthdrawMethodBody)}>
        {wallet !== undefined && region.withdrawProviders.includes('wirecard_emoney') && (
          <div className={styles.wirecard}>
            <RadioInput
              checked={paymentMethod === 'wirecard_emoney'}
              className={styles.radio}
              id="wirecard_emoney"
              label={(
                <div className={styles.content}>
                  <Card/>

                  <div className={styles.info}>
                    <p className={styles.muted}>
                      <FormattedMessage defaultMessage="Default Method"/>
                    </p>

                    <p>
                      IBAN
                      {' '}
                      {/* {wallet.iban} */}
                    </p>
                  </div>
                </div>
              )}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentProvider)}
              required
              value="wirecard_emoney"
            />

            <div className={styles.disclaimer}>
              <Info/>

              <p>
                <FormattedMessage defaultMessage="If you want to change your bank account, please contact us."/>
              </p>
            </div>
          </div>
        )}

        {region.withdrawProviders.includes('papara_masspayment') && (
          <div>
            <RadioInput
              checked={paymentMethod === 'papara_masspayment'}
              className={styles.radio}
              id="papara_masspayment"
              label={(
                <div className={styles.content}>
                  <img alt="papara" className={styles.papara} loading="lazy" src={Papara.src}/>
                </div>
              )}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentProvider)}
              required
              value="papara_masspayment"
            />

            {(paymentMethod === 'papara_masspayment') && (
              <>
                <div className={styles.paparaInputs}>
                  <FormGroup error={errors.tckn}>
                    <TextInput
                      disabled={papara !== undefined && papara.isVerified}
                      id="papara-wallet-tc-id-number"
                      label={intl.formatMessage({ defaultMessage: 'TC ID Number' })}
                      name="tcIdNumber"
                      onChange={(e) => setPaparaUserInfo({
                        ...paparaUserInfo,
                        tcIdNumber: e.target.value
                      })}
                      required={paymentMethod === 'papara_masspayment'}
                      size="large"
                      value={paparaUserInfo.tcIdNumber || ''}
                    />
                  </FormGroup>

                  <FormGroup error={errors.paparaId}>
                    <TextInput
                      disabled={papara !== undefined && papara.isVerified}
                      id="papara-wallet-papara-id"
                      label={intl.formatMessage({ defaultMessage: 'Papara Id' })}
                      name="paparaId"
                      onChange={(e) => setPaparaUserInfo({
                        ...paparaUserInfo,
                        paparaId: e.target.value
                      })}
                      required={paymentMethod === 'papara_masspayment'}
                      size="large"
                      value={paparaUserInfo.paparaId || ''}
                    />
                  </FormGroup>
                </div>

                {papara !== undefined && papara.isVerified && (
                  <div className={styles.disclaimer}>
                    <Info/>

                    <p>
                      <FormattedMessage defaultMessage="If you want to change your Papara account, please contact us."/>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* {region.withdrawProviders.includes('icrypex') && (
        <div>
          <RadioInput
            checked={paymentMethod === 'icrypex'}
            className={styles.radio}
            id="icrypex"
            label={(
              <div className={styles.content}>
                <img alt="icrypex" className={styles.icrypex} loading="lazy" src={Icrypex.src}/>
              </div>
            )}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentProvider)}
            required
            value="icrypex"
          />

          {paymentMethod === 'icrypex' && (
            <IcrypexVerifier
              errors={errors}
              gaCoinAmount={0}
              icrypexResponse={icrypexResponse}
              icrypexUserInfo={icrypexUserInfo}
              paymentMethod={paymentMethod}
              setIcrypexResponse={setIcrypexResponse}
              setIcrypexUserInfo={setIcrypexUserInfo}
            />
          )}
        </div>
        )} */}

        {region.withdrawProviders.includes('n11') && (
          <RadioInput
            checked={paymentMethod === 'n11'}
            className={styles.radio}
            id="n11"
            label={(
              <div className={styles.content}>
                <img alt="n11" className={styles.n11} loading="lazy" src={N11.src}/>
              </div>
            )}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentProvider)}
            required
            value="n11"
          />
        )}

        {region.withdrawProviders.includes('paypal_payments') && (
          <RadioInput
            checked={paymentMethod === 'paypal_payments'}
            className={classNames(styles.radio, styles.paypal)}
            id="paypal_payments"
            label={<PayPal/>}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentProvider)}
            required
            value="paypal_payments"
          />
        )}

        <Errors errors={errors.provider}/>
      </div>
    </section>
  );
}
