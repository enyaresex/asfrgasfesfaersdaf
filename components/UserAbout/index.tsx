import classNames from 'classnames';
import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import { ReactComponent as Plus } from '../DuelRules/plus.svg';
import Markdown from '../Markdown';
import { ReactComponent as Discord } from './discord.svg';
import { ReactComponent as Twitch } from './twitch.svg';
import { ReactComponent as Facebook } from './facebook.svg';
import { ReactComponent as Steam } from './steam.svg';
import styles from './UserAbout.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  userId: number,
}>;

export default function UserAbout({ className, userId, ...props }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { data: user } = useSWR<User>(() => `/users/${userId}/`);
  const { data: country } = useSWR<Country>(user === undefined ? null : `/i18n/countries/${user.country}/`);
  const { data: language } = useSWR<Language>(user === undefined ? null : `/i18n/languages/${user.language}/`);

  return user === undefined ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.userAbout, isOpen && styles.open, className)}>
      <button
        className={styles.header}
        onClick={() => setIsOpen((prev) => (!prev))}
        type="button"
      >
        <h4>
          <FormattedMessage defaultMessage="About" />
        </h4>

        <Plus />
      </button>

      <AnimateHeight duration={150} height={isOpen ? 'auto' : 0}>
        <div className={styles.content}>
          <div className={styles.info}>
            <p className={styles.title}>
              <FormattedMessage defaultMessage="Bio" />
            </p>

            {user.bio.length > 0 ? (
              <Markdown className={styles.markdown}>
                {user.bio}
              </Markdown>
            ) : (
              <p className={styles.bio}>
                <FormattedMessage defaultMessage="This user prefers to keep a low profile." />
              </p>
            )}
          </div>

          <div className={styles.info}>
            <p className={styles.title}>
              <FormattedMessage defaultMessage="Country" />
            </p>

            {country === undefined ? (
              <ActivityIndicator />
            ) : (
              <div className={styles.country}>
                <img alt={country.name} loading="lazy" src={country.flag} />

                <p>{country.name}</p>
              </div>
            )}
          </div>

          <div className={styles.info}>
            <p className={styles.title}>
              <FormattedMessage defaultMessage="Languages" />
            </p>

            {language === undefined ? (
              <ActivityIndicator />
            ) : (
              <p className={styles.language}>{language.name}</p>
            )}
          </div>

          {[user.discordUrl, user.twitchUrl, user.steamUrl, user.facebookUrl].filter((a) => a !== null).length !== 0 && (
            <div className={styles.info}>
              <p className={styles.title}>
                <FormattedMessage defaultMessage="Social" />
              </p>

              <div className={styles.socials}>
                {user.discordUrl !== null && (
                  <a
                    aria-label="discord"
                    className={styles.socialLink}
                    href={user.discordUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Discord />
                  </a>
                )}

                {user.twitchUrl !== null && (
                  <a
                    aria-label="twitch"
                    className={styles.socialLink}
                    href={user.twitchUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Twitch />
                  </a>
                )}

                {user.steamUrl !== null && (
                  <a
                    aria-label="steam"
                    className={styles.socialLink}
                    href={user.steamUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Steam />
                  </a>
                )}

                {user.facebookUrl !== null && (
                  <a
                    aria-label="facebook"
                    className={styles.socialLink}
                    href={user.facebookUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Facebook />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </AnimateHeight>
    </section>
  );
}
