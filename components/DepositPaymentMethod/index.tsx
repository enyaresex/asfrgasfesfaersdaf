import classNames from 'classnames';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { RegionContext } from '../../contexts';
import Checkbox from '../Checkbox';
import Errors from '../Errors';
import FormGroup from '../FormGroup';
import IcrypexVerifier from '../IcrypexVerifier';
import RadioInput from '../RadioInput';
import { ReactComponent as Card } from './card.svg';
import styles from './DepositPaymentMethod.module.css';
import { ReactComponent as Paypal } from './paypal.svg';

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
  gaCoinAmount: number | null,
  icrypexUserInfo: IcrypexUserInfo,
  icrypexResponse: IcrypexResponse,
  paymentMethod: DepositProvider | null,
  termsAgreed: boolean,
  termsAgreedError: Array<string>,
  setIcrypexUserInfo: (paymentMethod: Props['icrypexUserInfo']) => void,
  setIcrypexResponse: (paymentMethod: Props['icrypexResponse']) => void,
  setPaymentMethod: React.Dispatch<React.SetStateAction<Props['paymentMethod']>>,
  setTermsAgreed: React.Dispatch<React.SetStateAction<Props['termsAgreed']>>,
}>;

export default function DepositPaymentMethod({
  className,
  errors,
  gaCoinAmount,
  icrypexUserInfo,
  icrypexResponse,
  paymentMethod,
  setIcrypexUserInfo,
  setIcrypexResponse,
  setPaymentMethod,
  setTermsAgreed,
  termsAgreed,
  termsAgreedError,
  ...props
}: Props) {
  const { region } = useContext(RegionContext);

  return region === undefined ? null : (
    <section {...props} className={classNames(styles.depositPaymentMethod, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <FormattedMessage defaultMessage="Choose Payment Method" />
        </h3>

        <p className={styles.muted}>
          <FormattedMessage defaultMessage="You will be directed to Wirecard to add your payment information." />
        </p>
      </div>

      <div className={styles.wrapper}>
        <FormGroup className={styles.formGroup}>
          {region.depositProviders.includes('wirecard_pos') && (
            <RadioInput
              checked={paymentMethod === 'wirecard_pos'}
              className={styles.radio}
              id="wirecard_pos"
              label={(
                <div className={styles.content}>
                  <Card />

                  <div className={styles.info}>
                    <p className={styles.muted}>
                      <FormattedMessage defaultMessage="Payment Method" />
                    </p>

                    <p>
                      <FormattedMessage defaultMessage="Credit Card or Bank Card" />
                    </p>
                  </div>
                </div>
              )}
              onChange={(e) => setPaymentMethod(e.target.value as DepositProvider)}
              value="wirecard_pos"
            />
          )}

          {region.depositProviders.includes('icrypex_deposit') && (
            <div>
              <RadioInput
                checked={paymentMethod === 'icrypex_deposit'}
                className={styles.radio}
                id="icrypex"
                label={(
                  <div className={styles.content}>
                    <Card />

                    <div className={styles.info}>
                      <p className={styles.muted}>
                        <FormattedMessage defaultMessage="Payment Method" />
                      </p>

                      <p>
                        <FormattedMessage defaultMessage="Icrypex" />
                      </p>
                    </div>
                  </div>
                )}
                onChange={(e) => setPaymentMethod(e.target.value as DepositProvider)}
                value="icrypex_deposit"
              />

              {paymentMethod === 'icrypex_deposit' && (
                <IcrypexVerifier
                  errors={errors}
                  gaCoinAmount={gaCoinAmount}
                  icrypexResponse={icrypexResponse}
                  icrypexUserInfo={icrypexUserInfo}
                  paymentMethod={paymentMethod}
                  setIcrypexResponse={setIcrypexResponse}
                  setIcrypexUserInfo={setIcrypexUserInfo}
                />
              )}
            </div>
          )}

          {region.depositProviders.includes('paypal_checkout') && (
            <RadioInput
              checked={paymentMethod === 'paypal_checkout'}
              className={styles.radio}
              id="paypal_checkout"
              label={(
                <div className={styles.content}>
                  <Paypal className={styles.paypal} />

                  <div className={styles.info}>
                    <p className={styles.muted}>
                      <FormattedMessage defaultMessage="Payment Method" />
                    </p>

                    <p>PayPal</p>
                  </div>
                </div>
              )}
              onChange={(e) => setPaymentMethod(e.target.value as DepositProvider)}
              value="paypal_checkout"
            />
          )}
        </FormGroup>

        <div className={styles.terms}>
          <FormGroup className={styles.formGroup} error={termsAgreedError}>
            <Checkbox
              checked={termsAgreed}
              className={styles.conditions}
              id="checkbox-deposit-terms-agreed"
              label={(
                <p className={styles.label}>
                  <FormattedMessage
                    defaultMessage="I confirm that I’m 18 years of age and older. By clicking the button below I accept all the legal responsibilities."
                  />
                </p>
              )}
              name="depositTermsAgreed"
              onChange={(e) => setTermsAgreed(e.target.checked)}
              required
            />
          </FormGroup>
        </div>
        <Errors errors={errors.provider} />
      </div>
    </section>
  );
}
