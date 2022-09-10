import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Container from '../Container';
import Logo from '../Logo';
import { ReactComponent as Discord } from './discord.svg';
import { ReactComponent as Facebook } from './facebook.svg';
import styles from './Footer.module.css';
import { ReactComponent as Instagram } from './instagram.svg';
import { ReactComponent as Twitter } from './twitter.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['footer']>;

type SocialLink = {
  icon: React.ReactNode,
  link: string,
  name: string,
};

const socials: SocialLink[] = [{
  icon: <Instagram />,
  link: 'https://www.instagram.com/gamerarena_com/',
  name: 'instagram',
}, {
  icon: <Facebook />,
  link: 'https://www.facebook.com/gamerarenacom/',
  name: 'facebook',
}, {
  icon: <Twitter />,
  link: 'https://twitter.com/gamerarena_com',
  name: 'twitter',
}, {
  icon: <Discord />,
  link: 'https://discord.com/invite/SFhnqCd',
  name: 'discord',
}];

export default function Footer({ className, ...props }: Props): JSX.Element {
  return (
    <footer {...props} className={classNames(styles.footer, className)}>
      <Container className={styles.container}>
        <div className={styles.column}>
          <Logo className={styles.logo} />

          <p className={styles.notice}>
            <FormattedMessage
              defaultMessage="Gamer Arena is not endorsed by, directly affiliated with, maintained or sponsored by Electronic Arts,
            Activision Blizzard, Valve Corporation, Miniclip, Epic Games, Blizzard Entertainment, Microsoft, Xbox,
            Sony or Playstation. All content, games titles, trade names and/or trade dress, trademarks, artwork and
            associated imagery are trademarks and/or copyright material of their respective owners."
            />
          </p>

          <p className={styles.copyright}>
            {`© ${new Date().getFullYear()} Gamer Arena`}
          </p>
        </div>

        <div className={styles.column}>
          <nav className={styles.navigation}>
            <Link href="/">
              <a>
                <FormattedMessage defaultMessage="Homepage" />
              </a>
            </Link>

            <Link href="/privacy-policy">
              <a>
                <FormattedMessage defaultMessage="Privacy Policy" />
              </a>
            </Link>

            <a
              href="mailto:info@gamerarena.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FormattedMessage defaultMessage="Corporate Contact" />
            </a>

            <a
              href="http://help.gamerarena.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FormattedMessage defaultMessage="Help & Support" />
            </a>

            <Link href="/terms-of-service">
              <a>
                <FormattedMessage defaultMessage="Terms of Service" />
              </a>
            </Link>
          </nav>

          <div className={styles.social}>
            {socials.map(({ icon, link, name }) => (
              <a
                aria-label={name}
                className={styles.socialLink}
                href={link}
                key={name}
                rel="noopener noreferrer"
                target="_blank"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
