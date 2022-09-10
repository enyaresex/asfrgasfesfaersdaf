import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import {
  ActivityIndicator,
  AnalyticsProvider,
  Container,
  HeadTagsHandler,
  LadderTournamentDescription,
  LadderTournamentHeader,
  LadderTournamentInfo,
  LadderTournamentPrizes,
  LadderTournamentRanking,
  Layout,
  Tab,
  Tabs,
  TournamentChat,
} from '../../../components';
import styles from './Ladder.module.css';

export default function Ladder() {
  const intl = useIntl();
  const router = useRouter();

  const ladderId = useMemo<string | null>(() => (router.query.id === undefined
    ? null : router.query.id.toString()), [router.query.id]);

  const { data: ladder } = useSWR<Ladder>(ladderId === null ? null : `/tournaments/ladders/${ladderId}/`);
  const { data: game } = useSWR<Game>(ladder === undefined ? null : `/games/${ladder.game}/`);

  return ladderId === null ? null : (
    <AnalyticsProvider category="Tournament Detail">
      <HeadTagsHandler
        imageUrl={game === undefined ? game : game.image}
        title={intl.formatMessage({ defaultMessage: '{game} Leaderboard Tournament | Gamer Arena' },
          { game: game === undefined ? '' : game.name })}
      />

      <Layout className={styles.ladder}>
        {ladder === undefined ? <ActivityIndicator /> : (
          <>
            <LadderTournamentHeader ladder={ladder} />

            <Container className={styles.container}>
              <Tabs className={styles.tabs}>
                <Tab slug="general" title={intl.formatMessage({ defaultMessage: 'General' })}>
                  <div className={styles.generalWrapper}>
                    <LadderTournamentInfo className={styles.tournamentInfo} ladder={ladder} />

                    <LadderTournamentPrizes className={styles.tournamentPrizes} ladder={ladder} />

                    <LadderTournamentDescription ladder={ladder} />

                    <TournamentChat id={ladder.id} kind="ladder" />
                  </div>
                </Tab>

                <Tab slug="rankings" title={intl.formatMessage({ defaultMessage: 'Rankings' })}>
                  <LadderTournamentRanking ladder={ladder} />
                </Tab>
              </Tabs>
            </Container>
          </>
        )}
      </Layout>
    </AnalyticsProvider>
  );
}
