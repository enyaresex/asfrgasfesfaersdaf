import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { AuthAndApiContext, RegionContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import Progress from '../Progress';
import styles from './WalletBalance.module.css';
import { ReactComponent as Coins } from './coins.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

export default function WalletBalance({ className, ...props }: Props) {
  const { user } = useContext(AuthAndApiContext);
  const { region } = useContext(RegionContext);
  const progress = useMemo(() => {
    if (user === null) return null;

    return (user.balance / user.withdrawThreshold) * 100;
  }, [user]);

  return user === null || progress === null ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.walletBalance, className)}>
      <div className={styles.header}>
        <h4><FormattedMessage defaultMessage="My Balance" /></h4>
      </div>

      <div className={styles.body}>
        <p className={styles.disclaimer}>
          <FormattedMessage
            defaultMessage="You will be paid if your balance total is at least {threshold}"
            values={{
              threshold: <span className={styles.bold}>{`${user.withdrawThreshold} GAU Token`}</span>,
            }}
          />
        </p>

        <div className={styles.rate}>
          <Coins />

          <h4>
            <FormattedMessage
              defaultMessage="{userBalance} GAU Tokens = {rate} {currency}"
              values={{
                userBalance: user.balance,
                rate: user.balance * region.exchangeRate,
                currency: region.currencyCode,
              }}
            />
          </h4>
        </div>

        <Progress barColor="red" height={16} partitions={1} progress={progress} />

        <div className={styles.sub}>
          <p className={styles.remaining}>
            <span className={styles.bold}>{100 - progress <= 0 ? `${0}%` : `${100 - progress}%`}</span>
            <br />
            <FormattedMessage defaultMessage="Remaining" />
          </p>

          <p className={styles.threshold}>
            <span className={styles.bold}>
              <FormattedMessage
                defaultMessage="{threshold} GAU Tokens"
                values={{ threshold: user.withdrawThreshold }}
              />
            </span>

            <br />

            <FormattedMessage defaultMessage="Withdraw Threshold" />
          </p>
        </div>
      </div>
    </section>
  );
}
