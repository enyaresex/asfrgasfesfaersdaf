import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSWRInfinite } from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import EmptyStateDisplay from '../EmptyStateDisplay';
import { ReactComponent as Down } from './down.svg';
import { ReactComponent as Plus } from './plus.svg';
import { ReactComponent as Up } from './up.svg';
import styles from './WalletTransactions.module.css';

type Pagination = {
  next: null | string,
  previous: null | string,
  results: Transaction[],
};

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

const getTransactionPlusOrMinus = (t: TransactionKind) => (
  ['admin_decrease', 'entry_fee', 'withdraw', 'withdraw_fee'].includes(t) ? 'minus' : 'plus'
);

export default function WalletTransactions({ className, ...props }: Props) {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { data, size, setSize } = useSWRInfinite<Pagination>((pageIndex, previousPageData) => {
    if (pageIndex === 0 || previousPageData === null || previousPageData.next === null) return '/wallet/transactions/';

    return new URL(previousPageData.next).pathname + new URL(previousPageData.next).search;
  });

  const transactions = useMemo<Transaction[] | null>(() => (data === undefined
    ? null
    : data[data.length - 1].results), [data]);

  const transactionKinds = useMemo<Record<TransactionKind, React.ReactNode>>(() => ({
    admin_increase: <FormattedMessage defaultMessage="Admin Increase" />,
    admin_decrease: <FormattedMessage defaultMessage="Admin Decrease" />,
    coupon: <FormattedMessage defaultMessage="Coupon" />,
    deposit: <FormattedMessage defaultMessage="Deposit" />,
    entry_fee: <FormattedMessage defaultMessage="Entry Fee" />,
    promotion: <FormattedMessage defaultMessage="Promotion" />,
    return: <FormattedMessage defaultMessage="Return" />,
    win: <FormattedMessage defaultMessage="Win" />,
    withdraw: <FormattedMessage defaultMessage="Withdraw" />,
    withdraw_fee: <FormattedMessage defaultMessage="Withdraw Fee" />,
  }), [data, transactions]);

  return data === undefined || transactions === null ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.walletTransactions, isOpen && styles.open, className)}>
      <button
        className={styles.header}
        onClick={() => setIsOpen((prev) => (!prev))}
        type="button"
      >
        <h4>
          <FormattedMessage defaultMessage="Transactions" />
        </h4>

        <Plus />
      </button>

      <AnimateHeight duration={150} height={isOpen ? 'auto' : 0}>
        <div className={styles.body}>
          <div className={styles.content}>
            {transactions.length === 0 ? (
              <EmptyStateDisplay message={intl.formatMessage({ defaultMessage: 'No transactions found.' })} />
            ) : (
              <>
                {transactions.map((t) => {
                  const minusOrPlus = getTransactionPlusOrMinus(t.kind);

                  return (
                    <div className={styles.item} key={t.id}>
                      <div className={styles.icon}>
                        {minusOrPlus === 'minus' ? <Down /> : <Up />}
                      </div>

                      <div className={styles.details}>
                        <p className={styles.date}>{dayjs(t.createdAt).format('D MMMM')}</p>

                        <p className={styles.kind}>{transactionKinds[t.kind]}</p>
                      </div>

                      <div className={styles.amount}>
                        {minusOrPlus === 'minus' ? '-' : '+'}
                        {t.gaCoinAmount}
                        {' '}
                        <FormattedMessage defaultMessage="GAU Tokens" />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {transactions.length !== 0 && (
            <div className={styles.sub}>
              <Button
                className={styles.submit}
                disabled={data.slice(-1)[0].previous === null}
                onClick={() => setSize(size + 1)}
                size="large"
                type="button"
                variant={data.slice(-1)[0].previous === null ? 'secondary' : 'primary'}
              >
                <FormattedMessage defaultMessage="Newer" />
              </Button>

              <Button
                className={styles.submit}
                disabled={data.slice(-1)[0].next === null}
                onClick={() => setSize(size + 1)}
                size="large"
                type="button"
                variant={data.slice(-1)[0].next === null ? 'secondary' : 'primary'}
              >
                <FormattedMessage defaultMessage="Older" />
              </Button>
            </div>
          )}
        </div>
      </AnimateHeight>
    </section>
  );
}
