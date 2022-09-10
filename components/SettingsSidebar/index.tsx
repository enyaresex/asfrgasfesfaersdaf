import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { BreakpointContext } from '../../contexts';
import Container from '../Container';
import SettingsAddDropGames from '../SettingsAddDropGames';
import SettingsBlockUsers from '../SettingsBlockUsers';
import SettingsNotifications from '../SettingsNotifications';
import SettingsPasswordChange from '../SettingsPasswordChange';
import SettingsProfileUpdate from '../SettingsProfileUpdate';
import SettingsSocialAccounts from '../SettingsSocialAccounts';
import SideTab from '../SideTab';
import SideTabs from '../SideTabs';
import SideTabsSectionTitle from '../SideTabsSectionTitle';
import { ReactComponent as Blocked } from './blocked.svg';
import { ReactComponent as Games } from './games.svg';
import { ReactComponent as Notifications } from './notifications.svg';
import { ReactComponent as Password } from './password.svg';
import { ReactComponent as Profile } from './profile.svg';
import styles from './SettingsSidebar.module.css';
import { ReactComponent as Socials } from './socials.svg';

type GeneralSettings = 'addDropGames' | 'notifications' | 'profileSettings';

type Link = {
  content: React.ReactNode,
  icon: React.ReactNode,
  label: string,
}

type PrivacySettings = 'blockedUsers' | 'password';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

export default function SettingsSidebar({ className, ...props }: Props) {
  const intl = useIntl();
  const { device } = useContext(BreakpointContext);

  const generalSettings = useMemo<Record<GeneralSettings, Link>>(() => ({
    profileSettings: {
      content: <SettingsProfileUpdate />,
      icon: <Profile />,
      label: intl.formatMessage({ defaultMessage: 'Profile Settings' }),
    },
    addDropGames: {
      content: <SettingsAddDropGames />,
      icon: <Games />,
      label: intl.formatMessage({ defaultMessage: 'Add/Drop Games' }),
    },
    socialAccounts: {
      content: <SettingsSocialAccounts />,
      icon: <Socials />,
      label: intl.formatMessage({ defaultMessage: 'Social Accounts' }),
    },
    notifications: {
      content: <SettingsNotifications />,
      icon: <Notifications />,
      label: intl.formatMessage({ defaultMessage: 'Notifications' }),
    },
  }), []);

  const privacySettings = useMemo<Record<PrivacySettings, Link>>(() => ({
    password: {
      content: <SettingsPasswordChange />,
      icon: <Password />,
      label: intl.formatMessage({ defaultMessage: 'Password' }),
    },
    blockedUsers: {
      content: <SettingsBlockUsers />,
      icon: <Blocked />,
      label: intl.formatMessage({ defaultMessage: 'Blocked Users' }),
    },
  }), []);

  const sideTabs = (
    <SideTabs>
      <SideTabsSectionTitle>
        <FormattedMessage defaultMessage="General Settings" />
      </SideTabsSectionTitle>

      {(Object.keys(generalSettings) as GeneralSettings[]).map((key) => (
        <SideTab
          icon={generalSettings[key].icon}
          key={generalSettings[key].label}
          slug={key}
          title={generalSettings[key].label}
        >
          {generalSettings[key].content}
        </SideTab>
      ))}

      <SideTabsSectionTitle>
        <FormattedMessage defaultMessage="Privacy Settings" />
      </SideTabsSectionTitle>

      {(Object.keys(privacySettings) as PrivacySettings[]).map((key) => (
        <SideTab
          icon={privacySettings[key].icon}
          key={privacySettings[key].label}
          slug={key}
          title={privacySettings[key].label}
        >
          {privacySettings[key].content}
        </SideTab>
      ))}
    </SideTabs>
  );

  return (
    <section {...props} className={classNames(styles.settingsSidebar, className)}>
      <div className={styles.wrapper}>

        {device === 'desktop' ? (
          <Container fluid>{sideTabs}</Container>
        ) : sideTabs}
      </div>
    </section>
  );
}
