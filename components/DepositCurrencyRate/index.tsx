import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { AuthAndApiContext, RamadanCampaignContext, RegionContext } from '../../contexts';
import styles from './DepositCurrencyRate.module.css';
import { ReactComponent as Equality } from './equality.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  amount: number | null,
}>;

function calculatePromotion(amount: number): string {
  if (amount === 50) {
    return '60';
  }

  if (amount === 100) {
    return '130';
  }

  if (amount === 200) {
    return '270';
  }

  return '';
}

export default function DepositCurrencyRate({ amount, className, ...props }: Props) {
  const { user } = useContext(AuthAndApiContext);
  const { isRamadan } = useContext(RamadanCampaignContext);

  const { region } = useContext(RegionContext);

  const calculatedAmount = useMemo<number>(() => {
    if (amount === null || amount === 0) return 200;

    return amount;
  }, [amount]);

  const inRamadanCampaign = useMemo<boolean>(() => user !== null
    && user.depositCampaignUsedAt === null
    && [50, 100, 200].includes(calculatedAmount)
    && isRamadan,
  [calculatedAmount, isRamadan, user]);

  return region === undefined ? null : (
    <section
      {...props}
      className={classNames(styles.depositCurrencyRate,
        inRamadanCampaign && styles.ramadanCampaign,
        className)}
    >
      {inRamadanCampaign && (
        <div className={styles.discount}>
          {calculatedAmount === 50 && '+10'}
          {calculatedAmount === 100 && '+30'}
          {calculatedAmount === 200 && '+70'}
        </div>
      )}

      <div className={classNames(styles.box, inRamadanCampaign && styles.coin)}>
        <p className={styles.muted}>
          <FormattedMessage defaultMessage="Deposit Amount" />
        </p>

        <h3 className={styles.amount}>
          <FormattedMessage defaultMessage="{amount} GAU" values={{ amount: calculatedAmount }} />
        </h3>

        {inRamadanCampaign && (
          <h2 className={styles.discountAmount}>
            <FormattedMessage
              defaultMessage="{amount} GAU"
              values={{ amount: (calculatePromotion(calculatedAmount)) }}
            />
          </h2>
        )}
      </div>

      <div className={styles.equality}>
        <Equality />
      </div>

      <div className={styles.box}>
        <p className={styles.muted}>
          <FormattedMessage defaultMessage="Total Amount" />
        </p>

        <h3 className={styles.amount}>
          {`${(calculatedAmount * region.exchangeRate).toFixed(2)} ${region.currencyCode}`}
        </h3>
      </div>

      {inRamadanCampaign && (
        <div className={styles.ramadanCampaign}>
          <h4 className={styles.title}>
            <FormattedMessage defaultMessage="Deposit Campaign" />
          </h4>

          <p className={styles.disclaimer}>
            <FormattedMessage defaultMessage="Between 26th December - 10th January, you get 10 GAU Token for your deposit of 50 GAU Token, 30 GAU Token for your deposit of 100 GAU Token and 70 GAU Token for your deposit of 200 GAU Token for free! You can only use this campaign once and you need to finish at least 2 paid duels to be able to request withdraw." />
          </p>
        </div>
      )}
    </section>
  );
}
