import React from 'react';
import { useIntl } from 'react-intl';
import {
  AnalyticsProvider,
  CallToAction,
  Container,
  Faq,
  GameBrowser,
  HeadTagsHandler,
  LadderTournamentCardList,
  Layout,
  LeaderboardTournamentCardList,
  Partners,
  ScrollIndicator,
  SignUpContainer,
  Testimonials,
} from '../components';
import styles from './index.module.css';

export default function Index() {
  const intl = useIntl();

  return (
    <AnalyticsProvider category="Landing">
      <HeadTagsHandler
        title={`Gamer Arena | ${intl.formatMessage({ defaultMessage: 'Competitive Gaming Platform' })}`}
      />

      <Layout className={styles.index} displayFooter>
        <SignUpContainer role="main" />
        <ScrollIndicator icon="mouse" />
        <GameBrowser />
        <Partners />

        <Container className={styles.container}>
          <LeaderboardTournamentCardList
            hideIfEmpty
            includeStatuses={['FUTURE', 'IN_PROGRESS']}
            title={intl.formatMessage({ defaultMessage: 'Ongoing Leaderboard Tournaments' })}
            viewAllLinkHref="/tournaments?section=leaderboard"
          />

          <LadderTournamentCardList
            hideIfEmpty
            includeStatuses={['FUTURE', 'IN_PROGRESS']}
            title={intl.formatMessage({ defaultMessage: 'Ongoing Ladder Tournaments' })}
            viewAllLinkHref="/tournaments?section=discord"
          />
        </Container>

        <Testimonials />
        <Faq id="FAQ" />
        <CallToAction
          content={intl.formatMessage({ defaultMessage: 'Join thousands of players competing in Gamer Arena and start winning right now.' })}
          title={intl.formatMessage({ defaultMessage: 'Welcome to the next level in esports!' })}
        />
      </Layout>
    </AnalyticsProvider>
  );
}
