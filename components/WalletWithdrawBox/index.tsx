import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../Button';
import { ReactComponent as IBAN } from './iban.svg';
import n11 from './n11.png';
import Icrypex from './icrypex.png';
import { ReactComponent as Papara } from './papara.svg';
import { ReactComponent as Paypal } from './paypal.svg';
import styles from './WalletWithdrawBox.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  region: Region,
}>;

export default function WalletWithdrawBox({ className, region, ...props }: Props) {
  return (
    <section {...props} className={classNames(styles.walletWithdrawBox, className)}>
      <div className={styles.header}>
        <h4><FormattedMessage defaultMessage="How You Get Paid" /></h4>
      </div>

      <div className={styles.body}>
        <div className={styles.wrapper}>
          {region.withdrawProviders.includes('wirecard_emoney') && (
            <div className={styles.method}>
              <IBAN className={styles.iban} />
            </div>
          )}

          {region.withdrawProviders.includes('papara_masspayment') && (
            <div className={styles.method}>
              <Papara className={styles.papara} />
            </div>
          )}

          {region.withdrawProviders.includes('icrypex') && (
            <div className={styles.method}>
              <img alt="icrypex" className={styles.n11} loading="lazy" src={Icrypex.src} />
            </div>
          )}

          {region.withdrawProviders.includes('n11') && (
            <div className={styles.method}>
              <img alt="n11" className={styles.n11} loading="lazy" src={n11.src} />
            </div>
          )}

          {region.withdrawProviders.includes('paypal_payments') && (
            <div className={styles.method}>
              <Paypal className={styles.paypal} />
            </div>
          )}
        </div>

        <div className={styles.buttonWrapper}>
          <Link href="/wallet/withdraw/" passHref>
            <Button className={styles.button} size="large">
              <FormattedMessage defaultMessage="Withdraw" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
