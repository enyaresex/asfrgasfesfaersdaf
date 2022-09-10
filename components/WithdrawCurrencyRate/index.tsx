import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { AuthAndApiContext } from '../../contexts';
import { ReactComponent as Equality } from './equality.svg';
import styles from './WithdrawCurrencyRate.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  amount: number | null,
  paymentMethod: string | null,
  region: Region,
}>;

export default function WithdrawCurrencyRate({ amount, className, paymentMethod, region, ...props }: Props) {
  const { user } = useContext(AuthAndApiContext);
  const base = useMemo(() => (user?.withdrawThreshold ? user.withdrawThreshold : region.withdrawThreshold), []);
  const transactionFee = useMemo<number>(() => {
    if (paymentMethod === 'icrypex') {
      return 0;
    }
    return region.withdrawFeePercentage * ((amount === null || amount <= 0 ? base : amount) / 100);
  }, [amount, paymentMethod, base, region]);

  return (
    <section {...props} className={classNames(styles.withdrawCurrencyRate, className)}>
      <div className={styles.inline}>
        <div className={styles.info}>
          <p className={styles.muted}>
            <FormattedMessage defaultMessage="Withdraw Amount" />
          </p>

          <h3 className={styles.amount}>
            <FormattedMessage
              defaultMessage="{amount} GAU"
              values={{ amount: (amount === null || amount <= 0) ? base : Math.round(amount * 100) / 100 }}
            />
          </h3>
        </div>

        <div className={styles.separator} />

        <div className={styles.info}>
          <p className={styles.muted}>
            <FormattedMessage defaultMessage="Transaction Fee" />
          </p>

          <h3 className={styles.amount}>
            <FormattedMessage
              defaultMessage="{amount} GAU"
              values={{ amount: Math.round(transactionFee * 100) / 100 }}
            />
          </h3>
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.muted}>
          <FormattedMessage defaultMessage="Net Amount" />
        </p>

        <h3 className={styles.amount}>
          <FormattedMessage
            defaultMessage="{amount} GAU"
            values={{
              amount: (amount === null || amount <= 0)
                ? Math.round((base - transactionFee) * 100) / 100
                : Math.round((amount - transactionFee) * 100) / 100,
            }}
          />

          {' = '}

          {(amount === null || amount <= 0)
            ? Math.round(((base - transactionFee) * region.exchangeRate) * 100) / 100
            : Math.round(((amount - transactionFee) * region.exchangeRate) * 100) / 100}

          {' '}

          {region.currencyCode}
        </h3>
      </div>

      <div className={styles.equality}>
        <Equality />
      </div>
    </section>
  );
}
