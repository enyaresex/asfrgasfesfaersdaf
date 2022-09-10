import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import styles from './WalletWithdrawRequest.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

const providerDisplays: Record<WithdrawProvider, string> = {
  n11: 'N11',
  papara_masspayment: 'Papara',
  paypal_payments: 'Paypal',
  wirecard_emoney: 'Wirecard',
  icrypex: 'Icrypex',
};

export default function WalletWithdrawRequest({ className, ...props }: Props) {
  const { data: withdrawRequests } = useSWR<WithdrawRequest[]>('/wallet/my_withdraw_requests/');

  return withdrawRequests === undefined ? <ActivityIndicator /> : (
    <>
      {withdrawRequests.length === 0 ? null : (
        <section {...props} className={classNames(styles.walletWithdrawRequest, className)}>
          <div className={styles.header}>
            <h4><FormattedMessage defaultMessage="Withdraw Requests" /></h4>

            <p className={styles.status}>
              <FormattedMessage defaultMessage="Pending" />
            </p>
          </div>

          <div className={styles.body}>
            <ul>
              {withdrawRequests.map((r) => (
                <li key={r.id}>
                  <p>
                    <FormattedMessage
                      defaultMessage="Your withdraw request was issued on <wrap>{date} for {amount} {currency}</wrap> via <wrap>{provider}.</wrap>"
                      values={{
                        amount: Math.round((r.currencyAmount || 0) * 100) / 100,
                        currency: r.currencyCode,
                        date: dayjs(r.createdAt).format('MMM D, YYYY'),
                        provider: providerDisplays[r.provider],
                        wrap: (...chunks: string[]) => (
                          <span className={styles.white}>{chunks}</span>
                        ),
                      }}
                    />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
