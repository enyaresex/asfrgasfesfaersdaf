import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useClickAway } from 'react-use';
import { AnalyticsContext, AuthAndApiContext } from '../../contexts';
import { createGtag } from '../../helpers';
import { useKeyDown } from '../../hooks';
import Avatar from '../Avatar';
import BackgroundShade from '../BackgroundShade';
import HeaderButton from '../HeaderButton';
import { ReactComponent as DropdownIcon } from './down.svg';
import { ReactComponent as Duels } from './duels.svg';
import { ReactComponent as Profile } from './profile.svg';
import { ReactComponent as Settings } from './settings.svg';
import { ReactComponent as SignOut } from './signOut.svg';
import { ReactComponent as Gift } from './gift.svg';
import styles from './UserMenu.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

export default function UserMenu({ className, ...props }: Props) {
  const router = useRouter();
  const content = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { category } = useContext(AnalyticsContext);
  const { user } = useContext(AuthAndApiContext);

  function closeIfOpen() {
    if (isOpen) setIsOpen(false);
  }

  useClickAway(content, closeIfOpen);
  useKeyDown(closeIfOpen, ['escape']);

  return user === null ? null : (
    <>
      <BackgroundShade isVisible={isOpen} />

      <div {...props} className={classNames(className, styles.userMenu)}>
        <HeaderButton className={styles.headerButton} onClick={() => setIsOpen(true)}>
          <Avatar
            borderColor={user.isShownWhenOnline ? 'green' : 'red'}
            image={user.avatar}
            size={40}
          />

          <p className={styles.username}>{user.username}</p>

          <DropdownIcon className={styles.dropdownIcon} />
        </HeaderButton>

        <TransitionGroup component={null}>
          {isOpen && (
            <CSSTransition timeout={150} unmountOnExit>
              <div className={styles.content} ref={content}>
                <div className={styles.header}>
                  <FormattedMessage defaultMessage="My Account" />
                </div>

                <div className={styles.body}>
                  <Link
                    href={{
                      pathname: router.pathname,
                      query: { ...router.query, username: user.username },
                    }}
                    passHref
                  >
                    <a className={styles.link}>
                      <Profile />

                      <FormattedMessage defaultMessage="Profile" />
                    </a>
                  </Link>

                  <Link
                    href={{
                      pathname: router.pathname,
                      query: { ...router.query, username: user.username, userDetail: 'duels' },
                    }}
                    passHref
                  >
                    <a
                      className={styles.link}
                      data-gtag={createGtag({ category, event: 'Visit My Duels', label: 'User Menu' })}
                    >
                      <Duels />

                      <FormattedMessage defaultMessage="My Duels" />
                    </a>
                  </Link>

                  <Link
                    href="/coupon-redemption"
                    passHref
                  >
                    <a
                      className={styles.link}
                      data-gtag={createGtag({ category, event: 'Redeem Code', label: 'User Menu' })}
                    >
                      <Gift />

                      <FormattedMessage defaultMessage="Redeem Code" />
                    </a>
                  </Link>

                  <Link href="/settings" passHref>
                    <a className={styles.link}>
                      <Settings />

                      <FormattedMessage defaultMessage="Settings" />
                    </a>
                  </Link>
                </div>

                <div className={styles.footer}>
                  <Link href="/sign-out" passHref>
                    <a
                      className={styles.signOut}
                      data-gtag={createGtag({ category, event: 'Click Sign Out', label: 'User Menu' })}
                    >
                      <SignOut />

                      <FormattedMessage defaultMessage="Sign Out" />
                    </a>
                  </Link>
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </>
  );
}
