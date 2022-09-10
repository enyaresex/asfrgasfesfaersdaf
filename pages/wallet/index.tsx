import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import {
  ActivityIndicator,
  Container,
  HeadTagsHandler,
  Layout,
  PageHeader,
  WalletBalance,
  WalletCurrencyRate,
  WalletDepositBox,
  WalletTransactions,
  WalletWithdrawBox,
  WalletWithdrawRequest,
  withAuth,
} from '../../components';
import { AuthAndApiContext, BreakpointContext, RegionContext } from '../../contexts';
import styles from './Wallet.module.css';

function Wallet() {
  const intl = useIntl();
  const { device } = useContext(BreakpointContext);
  const { user } = useContext(AuthAndApiContext);
  const { region } = useContext(RegionContext);

  return (user === null || region === null) ? <ActivityIndicator /> : (
    <>
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Wallet' })} | Gamer Arena`} />

      <Layout className={styles.wallet}>
        <PageHeader
          background="wallet"
          description={intl.formatMessage({ defaultMessage: 'You can withdraw and deposit via your wallet.' })}
          title={intl.formatMessage({ defaultMessage: 'My Wallet' })}
        />

        <Container className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.col}>
              <WalletCurrencyRate gauBalance={user.balance} region={region} />

              <WalletWithdrawRequest />

              <WalletDepositBox className={styles.depositBox} region={region} />

              <WalletBalance className={styles.balance} />

              {device !== 'desktop' && <WalletTransactions />}

              <WalletWithdrawBox region={region} />
            </div>

            {device === 'desktop' && (
              <div className={styles.col}>
                <WalletTransactions />
              </div>
            )}
          </div>
        </Container>
      </Layout>
    </>
  );
}

export default withAuth('user', Wallet);
