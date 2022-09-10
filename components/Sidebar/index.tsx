import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useClickAway } from 'react-use';
import useSWR from 'swr';
import { AnalyticsContext, AuthAndApiContext, RegionContext } from '../../contexts';
import { createGtag } from '../../helpers';
import { useKeyDown } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import FormGroup from '../FormGroup';
import LanguageSelector from '../LanguageSelector';
import Logo from '../Logo';
import RegionSelector from '../RegionSelector';
import { ReactComponent as Arena } from './arena.svg';
import { ReactComponent as Chat } from './chat.svg';
import { ReactComponent as Close } from './close.svg';
import { ReactComponent as Duels } from './duels.svg';
import { ReactComponent as Faq } from './faq.svg';
import { ReactComponent as HelpCenter } from './help_center.svg';
import { ReactComponent as Notifications } from './notifications.svg';
import styles from './Sidebar.module.css';
import { ReactComponent as Tournaments } from './tournaments.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['aside']>, {
  onClose?: () => void,
  renderLogo?: boolean,
}>;

export default function Sidebar({ className, onClose, renderLogo = true, ...props }: Props) {
  const router = useRouter();
  const { region } = useContext(RegionContext);
  const { user } = useContext(AuthAndApiContext);
  const { category } = useContext(AnalyticsContext);
  const sidebar = useRef<HTMLElement>(null);

  const { data: games } = useSWR<Game[]>(`/games/?is_active=true&region=${region.id}`);

  useClickAway(sidebar, () => {
    if (onClose !== undefined) {
      onClose();
    }
  });

  useKeyDown(() => {
    if (onClose !== undefined) {
      onClose();
    }
  }, ['escape']);

  return (
    <aside {...props} className={classNames(styles.sidebar, className)} ref={sidebar}>
      {onClose !== undefined && (
        <div className={styles.closeContainer}>
          <button className={styles.closeButton} onClick={() => onClose()} type="button">
            <Close />
          </button>
        </div>
      )}

      {renderLogo && (
        <div className={styles.logoWrapper}>
          <Link href={user === null ? '/' : '/arena'}>
            <a className={styles.logoLink}>
              <Logo className={styles.logo} />
            </a>
          </Link>
        </div>
      )}

      <nav className={classNames(styles.nav, renderLogo && styles.marginTop90)}>
        <div className={styles.section}>
          <p className={styles.sectionTitle}>
            <FormattedMessage defaultMessage="MENU" />
          </p>

          <div className={styles.items}>
            {user !== null && (
              <Link href="/arena">
                <a className={classNames(styles.item, router.asPath.startsWith('/arena') && styles.active)}>
                  <Arena />

                  <div className={styles.itemBody}>
                    <FormattedMessage defaultMessage="Arena" />
                  </div>
                </a>
              </Link>
            )}

            <Link href="/duels">
              <a className={classNames(styles.item, router.asPath.startsWith('/duels') && styles.active)}>
                <Duels />

                <div className={styles.itemBody}>
                  <FormattedMessage defaultMessage="Duels" />
                </div>
              </a>
            </Link>

            <Link href="/tournaments">
              <a className={classNames(styles.item, router.asPath.startsWith('/tournaments') && styles.active)}>
                <Tournaments />

                <div className={styles.itemBody}>
                  <FormattedMessage defaultMessage="Tournaments" />
                </div>
              </a>
            </Link>

            <Link href="/chat">
              <a className={classNames(styles.item, router.asPath.startsWith('/chat') && styles.active)}>
                <Chat />

                <div className={styles.itemBody}>
                  <FormattedMessage defaultMessage="Chat" />
                </div>
              </a>
            </Link>

            {user !== null && (
              <Link href="/notifications">
                <a className={classNames(styles.item, router.asPath.startsWith('/notifications') && styles.active)}>
                  <Notifications />

                  <div className={styles.itemBody}>
                    <FormattedMessage defaultMessage="Notifications" />
                  </div>
                </a>
              </Link>
            )}
          </div>
        </div>

        <div className={classNames(styles.section, styles.gamesSection)}>
          <p className={styles.sectionTitle}>
            <FormattedMessage defaultMessage="GAMES" />
          </p>

          {games === undefined ? (
            <ActivityIndicator />
          ) : (
            <div className={styles.items}>
              {games.map((game) => (
                <Link href={`/game-statistics?id=${game.id}`} key={game.id}>
                  <a className={styles.item}>
                    <div className={styles.itemImage}>
                      {game.image !== null && (
                        <img alt={game.name} loading="lazy" src={game.image} />
                      )}
                    </div>

                    <div className={styles.itemBody}>
                      {game.name}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>
            <FormattedMessage defaultMessage="SUPPORT CENTER" />
          </p>

          <div className={styles.items}>
            <a
              className={styles.item}
              data-gtag={createGtag({
                category,
                event: 'Click CTA',
                label: 'Help Center',
                value: 'http://help.gamerarena.com',
              })}
              href="http://help.gamerarena.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <HelpCenter />

              <FormattedMessage defaultMessage="Help Center" />
            </a>

            <Link href="/#FAQ">
              <a
                className={styles.item}
                data-gtag={createGtag({ category, event: 'Click CTA', label: 'FAQ', value: '/#FAQ' })}
              >
                <Faq />

                <FormattedMessage defaultMessage="FAQ" />
              </a>
            </Link>
          </div>
        </div>
      </nav>

      <FormGroup>
        <LanguageSelector />
      </FormGroup>

      <FormGroup>
        <RegionSelector />
      </FormGroup>
    </aside>
  );
}
