import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../Button';
import { ReactComponent as Wallet } from './wallet.svg';
import styles from './WalletDepositBox.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  region: Region,
}>;

export default function WalletDepositBox({ className, region, ...props }: Props) {
  return (
    <section {...props} className={classNames(styles.walletDepositBox, className)}>
      <div className={styles.header}>
        <h4><FormattedMessage defaultMessage="Get GAU Tokens" /></h4>
      </div>

      <div className={styles.body}>
        <div className={styles.content}>
          <Wallet />

          <div className={styles.info}>
            <h4 className={styles.rate}>
              <FormattedMessage
                defaultMessage="1 GAU Token = {rate} {currency}"
                values={{
                  rate: region.exchangeRate,
                  currency: region.currencyCode,
                }}
              />
            </h4>

            <p>
              <FormattedMessage defaultMessage="You should choose the amount of coins you want to deposit and your payment method." />
            </p>
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <Link href="/wallet/deposit/" passHref>
            <Button className={styles.button} size="large" type="button" variant="green">
              <FormattedMessage defaultMessage="Deposit" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
