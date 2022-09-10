import classNames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { mutate } from 'swr';
import { AuthAndApiContext, ToastsContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import Modal from '../Modal';
import SettingsSectionTitle from '../SettingsSectionTitle';
import { ReactComponent as Discord } from './discord.svg';
import { ReactComponent as Facebook } from './facebook.svg';
import { ReactComponent as MutedDiscord } from './mutedDiscord.svg';
import { ReactComponent as MutedFacebook } from './mutedFacebook.svg';
import { ReactComponent as MutedSteam } from './mutedSteam.svg';
import { ReactComponent as MutedTwitch } from './mutedTwitch.svg';
import styles from './SettingsSocialAccounts.module.css';
import { ReactComponent as Steam } from './steam.svg';
import { ReactComponent as Trash } from './trash.svg';
import { ReactComponent as Twitch } from './twitch.svg';

type LinkDetail = {
  endpoint: string,
  icon: React.ReactNode,
  label: string,
  mutedIcon: React.ReactNode,
};
type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;
type Social = 'discord' | 'facebook' | 'steam' | 'twitch';

export default function SettingsSocialAccounts({ className, ...props }: Props) {
  const intl = useIntl();
  const { api, user, userAccessToken } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<Social | null>(null);

  const userSocialLinkStatus = useMemo<Record<Social, string | null> | null>(() => {
    if (user === null) return null;

    return {
      discord: user.discordUrl,
      facebook: user.facebookUrl,
      steam: user.steamUrl,
      twitch: user.twitchUrl,
    };
  }, [user]);

  const socials = useMemo<Record<Social, LinkDetail>>(() => ({
    discord: {
      endpoint: 'discord',
      icon: <Discord />,
      label: 'Discord',
      mutedIcon: <MutedDiscord />,
    },
    twitch: {
      endpoint: 'twitch',
      icon: <Twitch />,
      label: 'Twitch',
      mutedIcon: <MutedTwitch />,
    },
    steam: {
      endpoint: 'steam',
      icon: <Steam />,
      label: 'Steam',
      mutedIcon: <MutedSteam />,
    },
    facebook: {
      endpoint: 'facebook',
      icon: <Facebook />,
      label: 'Facebook',
      mutedIcon: <MutedFacebook />,
    },
  }), []);

  return userSocialLinkStatus === null ? <ActivityIndicator /> : (
    <>
      <Modal
        actions={(
          <>
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              <FormattedMessage defaultMessage="Cancel" />
            </Button>

            <Button
              onClick={async () => {
                if (selectedAccount === null) return;

                const response = await api.destroy(`/social/disconnect/${socials[selectedAccount].endpoint}/`, {});

                if (response.ok) {
                  await mutate('/users/me/');

                  addToast({
                    content: intl.formatMessage({ defaultMessage: 'Account is successfully deleted.' }),
                    kind: 'success',
                  });
                } else {
                  addToast({
                    content: intl.formatMessage({ defaultMessage: 'An error occurred while deleting your account.' }),
                    kind: 'warning',
                  });
                }

                setIsModalOpen(false);
              }}
              type="button"
            >
              <FormattedMessage defaultMessage="Disconnect Account" />
            </Button>
          </>
        )}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <FormattedMessage defaultMessage="Are you sure you want to disconnect your account?" />
      </Modal>

      <section {...props} className={classNames(styles.settingsSocialAccounts, className)}>
        <SettingsSectionTitle title={intl.formatMessage({ defaultMessage: 'Social Accounts' })} />

        {(Object.keys(socials) as Social[]).map((key) => (
          <>
            <div className={styles.social} key={key}>
              {userSocialLinkStatus[key] === null && socials[key].mutedIcon}
              {userSocialLinkStatus[key] !== null && socials[key].icon}

              <div className={styles.content}>
                <div className={styles.details}>
                  <p>{socials[key].label}</p>

                  <p className={styles.muted}>
                    {userSocialLinkStatus[key] === null ? (
                      <FormattedMessage defaultMessage="Not Connected" />
                    ) : (
                      <FormattedMessage defaultMessage="Connected" />
                    )}
                  </p>
                </div>

                <div className={classNames(userSocialLinkStatus[key] === null ? styles.cta : styles.trash)}>
                  {userSocialLinkStatus[key] === null
                    ? (
                      <Button
                        href={[process.env.NEXT_PUBLIC_GAMERARENA_API_URL,
                          `/social/login/${socials[key].endpoint}`,
                          `/?accessToken=${userAccessToken}`,
                        ].join('')}
                        outline
                      >
                        <FormattedMessage defaultMessage="Connect" />
                      </Button>
                    ) : (
                      <>
                        <button
                          className={styles.delete}
                          onClick={() => {
                            setSelectedAccount(key);
                            setIsModalOpen(true);
                          }}
                          type="button"
                        >
                          <Trash className={styles.trash} />
                        </button>
                      </>
                    )}
                </div>
              </div>
            </div>
          </>
        ))}
      </section>
    </>
  );
}
