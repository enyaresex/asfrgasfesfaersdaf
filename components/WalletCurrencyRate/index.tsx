import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './WalletCurrencyRate.module.css';
import { ReactComponent as GAU } from './gau.svg';
import { ReactComponent as Currency } from './currency.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  gauBalance: number,
  region: Region,
}>;

export default function WalletCurrencyRate({ className, gauBalance, region, ...props }: Props) {
  return (
    <section {...props} className={classNames(styles.walletCurrencyRate, className)}>
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <GAU />

          <h3>
            <FormattedMessage
              defaultMessage="{gauBalance} GAU"
              values={{
                gauBalance,
              }}
            />
          </h3>
        </div>

        <div className={styles.info}>
          <Currency />

          <h3>
            {parseFloat((gauBalance * region.exchangeRate).toFixed(2))}

            {' '}

            {region.currencyCode}
          </h3>
        </div>
      </div>

      <p className={styles.equality}>
        =
      </p>
    </section>
  );
}
