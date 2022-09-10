import fs from 'fs';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import path from 'path';
import qs from 'qs';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import {
  AnalyticsProvider,
  Container,
  DuelAction,
  DuelChat,
  DuelFormat,
  DuelHeader,
  DuelPlayers,
  DuelProgress,
  DuelRules,
  DuelTournament,
  HeadTagsHandler,
  Layout,
} from '../../../components';
import { BreakpointContext, LocalizationContext } from '../../../contexts';
import { hydrateDuel } from '../../../helpers';
import styles from './DuelDetail.module.css';

type Contents = Record<LanguageCode, string>;

type Props = {
  contents: Contents,
};

export default function DuelDetail({ contents }: Props) {
  const router = useRouter();
  const intl = useIntl();
  const { device } = useContext(BreakpointContext);
  const { languageCode } = useContext(LocalizationContext);

  const [id, setId] = useState<number | null | undefined>(undefined);

  const { data: duel } = useSWR<Duel>(id ? `/duels/${id}/` : null, { refreshInterval: 10000 });
  const { data: gameMode } = useSWR<GameMode>(duel === undefined ? null : `/games/game_modes/${duel.gameMode}/`);
  const { data: game } = useSWR<Game>(gameMode === undefined ? null : `/games/${gameMode.game}/`);

  const hydratedDuel = useMemo<HydratedDuel | null>(() => {
    if (duel === undefined) return null;

    return hydrateDuel(duel);
  }, [duel]);

  useEffect(() => {
    const { id: qsId } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const parsedQsId = parseInt((qsId || '').toString()) || null;

    if (id !== qsId) {
      setId(parsedQsId);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (id === null) {
      router.replace('/arena');
    }
  }, [id]);

  return (
    <AnalyticsProvider category="Duel Detail">
      <HeadTagsHandler
        imageUrl={game === undefined ? game : game.image}
        title={`${intl.formatMessage({ defaultMessage: '{game} Duel' },
          { game: game === undefined ? '' : game.name })} | Gamer Arena`}
      />

      <Layout>
        {hydratedDuel === null ? null : (
          <>
            {device !== 'desktop' && <DuelProgress duel={hydratedDuel} />}

            <DuelHeader duel={hydratedDuel} />

            <Container className={styles.duelDetail}>
              <div className={styles.wrapper}>
                <div className={styles.col}>
                  <DuelAction duel={hydratedDuel} />

                  <DuelChat id={hydratedDuel.id} />

                  <DuelPlayers duel={hydratedDuel} />

                  <DuelFormat duel={hydratedDuel} />

                  <DuelTournament duel={hydratedDuel} />
                </div>

                <div className={styles.col}>
                  {device === 'desktop' && <DuelProgress duel={hydratedDuel} />}

                  <DuelRules content={contents[languageCode]} duel={hydratedDuel} />
                </div>
              </div>
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
  const markdownPathAr = path.join(process.cwd(), 'pages', 'duels', 'duel', 'duel-rules-en.md');
  const markdownPathEn = path.join(process.cwd(), 'pages', 'duels', 'duel', 'duel-rules-en.md');
  const markdownPathTr = path.join(process.cwd(), 'pages', 'duels', 'duel', 'duel-rules-en.md');

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
