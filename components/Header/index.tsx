import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { AnalyticsContext, AuthAndApiContext, BreakpointContext } from '../../contexts';
import { createGtag } from '../../helpers';
import Button from '../Button';
import Container from '../Container';
import LanguageSelector from '../LanguageSelector';
import Logo from '../Logo';
import NotificationMenu from '../NotificationMenu';
import OnlineUsers from '../OnlineUsers';
import UserMenu from '../UserMenu';
import WalletMenu from '../WalletMenu';
import styles from './Header.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['header']>;

export default function Header({ className, ...props }: Props) {
  const router = useRouter();
  const { device } = useContext(BreakpointContext);
  const { category } = useContext(AnalyticsContext);
  const { user } = useContext(AuthAndApiContext);

  return (
    <header {...props} className={classNames(styles.header, className)}>
      <Container className={styles.container} fluid>
        {(user === null) ? (
          <>
            {device !== 'mobile' && (
              <div className={styles.logoWrapper}>
                <Link href="/">
                  <a aria-label="Gamer Arena" className={classNames(device === 'desktop' && styles.logoWithSpace)}>
                    <Logo className={styles.logo} />
                  </a>
                </Link>
              </div>
            )}

            <div className={styles.separator} />

            <LanguageSelector className={styles.languageSelector} />

            <Link href="/?action=sign-in" passHref>
              <Button size="small" variant="secondary">
                <FormattedMessage defaultMessage="Sign In" />
              </Button>
            </Link>
          </>
        ) : (
          <>
            {device !== 'mobile' && (
              <div className={styles.logoWrapper}>
                <Link href="/">
                  <a aria-label="Gamer Arena" className={classNames(styles.logoWithSpace)}>
                    <Logo className={styles.logo} />
                  </a>
                </Link>
              </div>
            )}

            {device !== 'mobile' && (
              <Link href={{ pathname: router.pathname, query: { ...router.query, duelCreation: 'true' } }} passHref>
                <Button
                  data-gtag={createGtag({ category, event: 'Open Custom Duel Modal', label: 'Header' })}
                  size="small"
                  variant="secondary"
                >
                  <FormattedMessage defaultMessage="Create Duel" />
                </Button>
              </Link>
            )}

            {device === 'mobile' && <UserMenu />}

            {device === 'mobile' && <WalletMenu />}

            <div className={styles.separator} />

            {device !== 'mobile' && <WalletMenu />}

            <NotificationMenu />

            <OnlineUsers />

            {device !== 'mobile' && <UserMenu />}
          </>
        )}
      </Container>
    </header>
  );
}
