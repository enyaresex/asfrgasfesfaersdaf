import classNames from 'classnames';
import Link from 'next/link';
import React, { useContext, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useClickAway } from 'react-use';
import { AuthAndApiContext, BreakpointContext, RegionContext } from '../../contexts';
import BackgroundShade from '../BackgroundShade';
import Button from '../Button';
import GACoin from '../GACoin';
import HeaderButton from '../HeaderButton';
import { ReactComponent as GAU } from './gau.svg';
import { ReactComponent as Transactions } from './transactions.svg';
import { ReactComponent as Wallet } from './wallet.svg';
import styles from './WalletMenu.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

export default function WalletMenu({ className, ...props }: Props) {
  const { user } = useContext(AuthAndApiContext);
  const { device } = useContext(BreakpointContext);
  const { region } = useContext(RegionContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const box = useRef<HTMLDivElement>(null);

  useClickAway(box, () => {
    if (isOpen) setIsOpen(false);
  });

  return user === null ? null : (
    <div {...props} className={classNames(className, styles.walletMenu)}>
      <BackgroundShade isVisible={isOpen} />

      <HeaderButton className={styles.balanceButton} onClick={() => setIsOpen((o) => !o)}>
        {device === 'desktop' ? (
          <FormattedMessage
            defaultMessage="{balance} GAU {gaCoin}"
            values={{
              balance: user.balance,
              gaCoin: <GACoin triple />,
            }}
          />
        ) : (
          <>
            {user.balance}
            <GACoin triple />
          </>
        )}
      </HeaderButton>

      <TransitionGroup>
        {isOpen && (
          <CSSTransition timeout={300}>
            <div className={styles.box} ref={box}>
              <div className={styles.header}>
                <p className={styles.title}>
                  <FormattedMessage defaultMessage="My Wallet" />
                </p>
              </div>

              <div className={styles.body}>
                <div className={styles.balance}>
                  <div className={styles.cell}>
                    <GAU />

                    <div>
                      <p className={styles.cellTitle}>
                        <FormattedMessage defaultMessage="Total Tokens" />
                      </p>

                      <p className={styles.cellValue}>
                        {`${user.balance} GAU`}
                      </p>
                    </div>
                  </div>

                  <div className={styles.cell}>
                    <Wallet />

                    <div>
                      <p className={styles.cellTitle}>
                        <FormattedMessage defaultMessage="Cash Value" />
                      </p>

                      <p className={styles.cellValue}>
                        {`${parseFloat((user.balance * region.exchangeRate).toFixed(2))} ${region.currencyCode}`}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className={styles.separator} />

                <div className={styles.actions}>
                  <div className={styles.actionWrapper}>
                    <Link href="/wallet/withdraw" passHref>
                      <Button variant="secondary">
                        <FormattedMessage defaultMessage="Withdraw" />
                      </Button>
                    </Link>
                  </div>

                  <div className={styles.actionWrapper}>
                    <Link href="/wallet/deposit" passHref>
                      <Button variant="green">
                        <FormattedMessage defaultMessage="Deposit" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className={styles.footer}>
                <Link href="/wallet">
                  <a className={styles.footerButton}>
                    <Transactions />

                    <FormattedMessage defaultMessage="View all transactions" />
                  </a>
                </Link>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
}
