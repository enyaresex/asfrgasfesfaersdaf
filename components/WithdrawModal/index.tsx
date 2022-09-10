import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import { AuthAndApiContext } from '../../contexts';
import Button from '../Button';
import Modal from '../Modal';
import { ReactComponent as Success } from './success.svg';
import styles from './WithdrawModal.module.css';

type Props = {
  isOpen: boolean,
};

const providerDisplays: Record<WithdrawProvider, string> = {
  n11: 'N11',
  papara_masspayment: 'Papara',
  paypal_payments: 'Paypal',
  wirecard_emoney: 'Wirecard',
  icrypex: 'Icrypex',
};

export default function WithdrawModal({ isOpen }: Props) {
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);
  const { data: withdrawRequests } = useSWR<WithdrawRequest[]>(user === null ? null : '/wallet/my_withdraw_requests/');

  const withdrawRequest = useMemo<WithdrawRequest | null>(() => {
    if (withdrawRequests === undefined || withdrawRequests.length === 0) return null;

    return withdrawRequests[0];
  }, [withdrawRequests]);

  return withdrawRequest === null ? null : (
    <Modal
      dialogClassName={styles.withdrawModal}
      isOpen={isOpen}
      onClose={() => router.push('/wallet')}
    >
      <div className={styles.body}>
        <Success />

        <h4 className={styles.title}>
          <FormattedMessage defaultMessage="Withdraw is successful" />
        </h4>

        <p className={styles.muted}>
          <FormattedMessage
            defaultMessage="Your withdrawal request was issued on <wrap>{date} for {amount} {currency}</wrap> via <wrap>{provider}.</wrap> We will review and process it ASAP."
            values={{
              date: dayjs(withdrawRequest.createdAt).format('MMM D, YYYY'),
              amount: Math.round((withdrawRequest.currencyAmount || 0) * 100) / 100,
              currency: withdrawRequest.currencyCode,
              provider: providerDisplays[withdrawRequest.provider],
              wrap: (...chunks: string[]) => (
                <span className={styles.white}>{chunks}</span>
              ),
            }}
          />
        </p>

        <Link href="/wallet" passHref>
          <Button className={styles.button} variant="green">
            <FormattedMessage defaultMessage="Go To My Wallet" />
          </Button>
        </Link>
      </div>
    </Modal>
  );
}
