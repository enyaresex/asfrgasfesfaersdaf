import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { RegionContext } from '../../contexts';
import { sendEcommerceEvent } from '../../helpers';
import Button from '../Button';
import Modal from '../Modal';
import styles from './DepositModal.module.css';
import { ReactComponent as Fail } from './fail.svg';
import { ReactComponent as Success } from './success.svg';

export default function DepositModal() {
  const router = useRouter();
  const { region } = useContext(RegionContext);

  const isDepositSuccessful = useMemo<boolean | null>(() => {
    if (router.query.success === 'true') return true;

    if (router.query.success === 'false') return false;

    return null;
  }, [router.query.success]);

  useEffect(() => {
    const { gaCoinAmount, success, transactionId } = router.query;

    if (success === 'true' && gaCoinAmount !== undefined && transactionId !== undefined) {
      sendEcommerceEvent({
        currencyCode: region.currencyCode,
        transactionId: transactionId.toString(),
        transactionTotal: Number(gaCoinAmount) * region.exchangeRate,
      });
    }
  }, [region, router.query]);

  return (
    <Modal
      dialogClassName={styles.depositModal}
      isOpen={router.query.success === 'true' || router.query.success === 'false'}
    >
      <div className={styles.body}>
        {isDepositSuccessful ? (
          <>
            <Success />

            <h4 className={styles.title}>
              <FormattedMessage defaultMessage="Deposit is Successful" />
            </h4>

            <p className={styles.muted}>
              {router.query.message === undefined
                ? <FormattedMessage defaultMessage="Your deposit transaction is completed successfully. You can check all transactions in your wallet." />
                : router.query.message}
            </p>

            <Link href="/wallet" passHref>
              <Button className={styles.button} variant="green">
                <FormattedMessage defaultMessage="Go To My Wallet" />
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Fail />

            <h4 className={classNames(styles.title, styles.red)}>
              <FormattedMessage defaultMessage="Deposit has Failed" />
            </h4>

            <p className={styles.muted}>
              {router.query.message === undefined
                ? <FormattedMessage defaultMessage="Your deposit could not be completed." />
                : router.query.message}
            </p>

            <Link href="/wallet" passHref>
              <Button className={styles.button}>
                <FormattedMessage defaultMessage="Go To My Wallet" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </Modal>
  );
}
