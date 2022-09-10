import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { AuthAndApiContext, BreakpointContext } from '../../contexts';
import { ReactComponent as Arena } from './arena.svg';
import { ReactComponent as FilledArena } from './arenaFilled.svg';
import styles from './BottomNavbar.module.css';
import { ReactComponent as Chat } from './chat.svg';
import { ReactComponent as Menu } from './menu.svg';
import { ReactComponent as Support } from './support.svg';
import { ReactComponent as Sword } from './sword.svg';
import { ReactComponent as SignUp } from './signUp.svg';
import { ReactComponent as SignIn } from './signIn.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['nav']>, {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>,
}>;

export default function BottomNavbar({ className, setIsSidebarOpen, ...props }: Props) {
  const router = useRouter();
  const { device } = useContext(BreakpointContext);
  const { user } = useContext(AuthAndApiContext);

  return device === 'desktop' ? null : (
    <nav {...props} className={classNames(styles.bottomNavbar, user === null && styles.notAuthenticated, className)}>
      <div className={styles.container}>
        <Link href="/arena">
          <a className={classNames(styles.navItem, router.pathname.startsWith('/arena') && styles.active)}>
            {router.pathname.startsWith('/arena') ? <FilledArena /> : <Arena />}

            <p><FormattedMessage defaultMessage="Arena" /></p>
          </a>
        </Link>

        {user !== null && (
          <button
            className={styles.navItem}
            onClick={() => {
              window?.$crisp?.push(['do', 'chat:show']);
              window?.$crisp?.push(['do', 'chat:toggle']);
            }}
            type="button"
          >
            <Support />

            <p><FormattedMessage defaultMessage="Support" /></p>
          </button>
        )}

        {user !== null && (
          <div className={classNames(styles.navItem, styles.quickDuel)}>
            <Link href="/quick-duel">
              <a className={styles.circle}>
                <Sword />
              </a>
            </Link>

            <p><FormattedMessage defaultMessage="Play" /></p>
          </div>
        )}

        {user === null && (
          <div className={classNames(styles.navItem, styles.quickDuel)}>
            <Link href="/?action=sign-up">
              <a className={styles.circle}>
                <SignUp />
              </a>
            </Link>

            <p><FormattedMessage defaultMessage="Sign Up" /></p>
          </div>
        )}

        {user !== null && (
          <Link href="/chat">
            <a className={classNames(styles.navItem, router.pathname.startsWith('/chat') && styles.active)}>
              <Chat />

              <p><FormattedMessage defaultMessage="Chat" /></p>
            </a>
          </Link>
        )}

        {(router.pathname === '/' && user === null) && (
          <Link href="/?action=sign-in">
            <a className={classNames(styles.navItem, router.pathname.startsWith('/arena') && styles.active)}>
              <SignIn />

              <p><FormattedMessage defaultMessage="Sign In" /></p>
            </a>
          </Link>
        )}

        {(router.pathname !== '/' || user !== null) && (
          <button className={styles.navItem} onClick={() => setIsSidebarOpen((prev) => !prev)} type="button">
            <Menu />

            <p><FormattedMessage defaultMessage="Menu" /></p>
          </button>
        )}
      </div>
    </nav>
  );
}
