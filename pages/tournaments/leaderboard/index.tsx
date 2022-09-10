import fs from 'fs';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import path from 'path';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import {
  ActivityIndicator,
  AnalyticsProvider,
  Container,
  DuelCardList,
  HeadTagsHandler,
  Layout,
  LeaderboardTournamentDescription,
  LeaderboardTournamentHeader,
  LeaderboardTournamentInfo,
  LeaderboardTournamentPrizes,
  LeaderboardTournamentQuickDuel,
  LeaderboardTournamentRanking,
  LeaderboardTournamentRules,
  Tab,
  Tabs,
  TournamentChat,
} from '../../../components';
import { AuthAndApiContext, BreakpointContext, LocalizationContext } from '../../../contexts';
import styles from './Leaderboard.module.css';

type Contents = Record<LanguageCode, string>;

type Props = {
  contents: Contents,
};

export default function Leaderboard({ contents }: Props) {
  const intl = useIntl();
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);
  const { device } = useContext(BreakpointContext);
  const { languageCode } = useContext(LocalizationContext);
  const [leaderboardId, setLeaderboardId] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    const { id: qsId } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const parsedQsId = parseInt((qsId || '').toString()) || null;

    if (leaderboardId !== parsedQsId) {
      setLeaderboardId(parsedQsId);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (leaderboardId === null) {
      router.replace('/arena/');
    }
  }, [leaderboardId]);

  const { data: leaderboard } = useSWR<Leaderboard>(((leaderboardId === null || leaderboardId === undefined)
    ? null : `/tournaments/leaderboards/${leaderboardId}/`));
  const { data: game } = useSWR<Game>(leaderboard === undefined ? null : `/games/${leaderboard.game}/`);

  return leaderboardId === null ? null : (
    <AnalyticsProvider category="Tournament Detail">
      <HeadTagsHandler
        imageUrl={game === undefined ? game : game.image}
        title={intl.formatMessage({ defaultMessage: '{game} Leaderboard Tournament | Gamer Arena' },
          { game: game === undefined ? '' : game.name })}
      />

      <Layout className={styles.leaderboard}>
        {leaderboard === undefined ? <ActivityIndicator /> : (
          <>
            <LeaderboardTournamentHeader leaderboard={leaderboard} />

            <Container className={styles.container}>
              <Tabs className={styles.tabs}>
                <Tab slug="general" title={intl.formatMessage({ defaultMessage: 'General' })}>
                  <div className={styles.generalWrapper}>
                    <div className={styles.col}>
                      {leaderboard.status === 'IN_PROGRESS' && (
                        <LeaderboardTournamentQuickDuel className={styles.quickDuel} leaderboard={leaderboard} />
                      )}

                      <LeaderboardTournamentInfo className={styles.tournamentInfo} leaderboard={leaderboard} />

                      <LeaderboardTournamentPrizes className={styles.tournamentPrizes} leaderboard={leaderboard} />

                      <LeaderboardTournamentDescription
                        className={styles.tournamentDescription}
                        leaderboard={leaderboard}
                      />

                      <TournamentChat id={leaderboard.id} kind="leaderboard" />
                    </div>

                    {device === 'desktop' && (
                      <div className={styles.col}>
                        <LeaderboardTournamentRules
                          className={styles.tournamentRules}
                          contents={contents[languageCode]}
                        />
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab slug="rankings" title={intl.formatMessage({ defaultMessage: 'Rankings' })}>
                  <LeaderboardTournamentRanking leaderboard={leaderboard} />
                </Tab>

                {user !== null && (
                  <Tab slug="myDuels" title={intl.formatMessage({ defaultMessage: 'My Duels' })}>
                    {game === undefined ? <ActivityIndicator /> : (
                      <DuelCardList
                        emptyStatus={intl.formatMessage({ defaultMessage: 'You didn\'t participate in any duels for this tournament.' })}
                        game={game.id}
                        hideIfEmpty={false}
                        includeUsers={[user.id]}
                        leaderboard={leaderboard.id}
                      />
                    )}
                  </Tab>
                )}

                {device !== 'desktop' && (
                  <Tab slug="rules" title={intl.formatMessage({ defaultMessage: 'Rules' })}>
                    <LeaderboardTournamentRules contents={contents[languageCode]} />
                  </Tab>
                )}
              </Tabs>
            </Container>
          </>
        )}
      </Layout>
    </AnalyticsProvider>
  );
}

type StaticProps = {
  props: Props,
};

export function getStaticProps(): StaticProps {
  const markdownPathAr = path.join(process.cwd(), 'pages', 'tournaments', 'leaderboard', 'tournament-rules-ar.md');
  const markdownPathEn = path.join(process.cwd(), 'pages', 'tournaments', 'leaderboard', 'tournament-rules-en.md');
  const markdownPathTr = path.join(process.cwd(), 'pages', 'tournaments', 'leaderboard', 'tournament-rules-tr.md');

  const markdownFileContentAr = fs.readFileSync(markdownPathAr);
  const markdownFileContentEn = fs.readFileSync(markdownPathEn);
  const markdownFileContentTr = fs.readFileSync(markdownPathTr);

  const markdownAr = matter(markdownFileContentAr);
  const markdownEn = matter(markdownFileContentEn);
  const markdownTr = matter(markdownFileContentTr);

  return {
    props: {
      contents: {
        ar: markdownAr.content,
        en: markdownEn.content,
        tr: markdownTr.content,
      },
    },
  };
}
