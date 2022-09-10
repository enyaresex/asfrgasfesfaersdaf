import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import {
  AnalyticsProvider,
  Container,
  HeadTagsHandler,
  Layout,
  PageHeader,
  SettingsSidebar,
  SettingsUserDisplay,
  withAuth,
} from '../../components';
import { BreakpointContext } from '../../contexts';
import styles from './Settings.module.css';

const content = (
  <div className={styles.wrapper}>
    <Container fluid>
      <SettingsUserDisplay />
    </Container>

    <SettingsSidebar />
  </div>
);

function Settings() {
  const intl = useIntl();
  const { device } = useContext(BreakpointContext);

  return (
    <AnalyticsProvider category="Settings">
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Settings' })} | Gamer Arena`} />

      <Layout className={styles.settings}>
        {device === 'desktop' && (
          <PageHeader background="settings" title={intl.formatMessage({ defaultMessage: 'Settings' })} />
        )}

        {device === 'desktop' ? (
          <Container>{content}</Container>
        ) : content}
      </Layout>
    </AnalyticsProvider>
  );
}

export default withAuth('user', Settings);
