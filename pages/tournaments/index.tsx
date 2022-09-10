import { useRouter } from 'next/router';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Button,
  Container,
  HeadTagsHandler,
  LadderTournamentCardList,
  Layout,
  LeaderboardTournamentCardList,
  Tab,
  Tabs,
} from '../../components';
import styles from './Tournaments.module.css';

export default function Tournaments() {
  const router = useRouter();
  const intl = useIntl();

  return (
    <>
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Tournaments' })} | Gamer Arena`} />

      <Layout className={styles.tournaments}>
        <div className={styles.header}>
          <div className={styles.headerBody}>
            <h1>
              <FormattedMessage defaultMessage="Tournaments" />
            </h1>

            <div className={styles.description}>
              {router.query.section === 'leaderboard' && (
                <p>
                  <FormattedMessage defaultMessage="Leaderboard tournaments are held in a period of time where whoever gets the most duel wins (excluding free entry duels) ranks higher." />
                </p>
              )}

              {router.query.section === 'discord' && (
                <p>
                  <FormattedMessage defaultMessage="Discord tournaments are point based and organized via our tournament Discord channel." />
                </p>
              )}
            </div>

            <div className={styles.helpButton}>
              <Button href="https://help.gamerarena.com/tr/collections/2234906-turnuvalar" rel="noopener noreferrer" target="_blank">
                <FormattedMessage defaultMessage="How Does It Work?" />
              </Button>
            </div>
          </div>
        </div>

        <Container>
          <Tabs>
            <Tab slug="leaderboard" title={intl.formatMessage({ defaultMessage: 'Leaderboard Tournaments' })}>
              <LeaderboardTournamentCardList />
            </Tab>

            <Tab slug="discord" title={intl.formatMessage({ defaultMessage: 'Discord Tournaments' })}>
              <LadderTournamentCardList />
            </Tab>
          </Tabs>
        </Container>
      </Layout>
    </>
  );
}
