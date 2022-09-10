import { useRouter } from 'next/router';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import {
  ActivityIndicator,
  Container,
  GameStatisticsRanking,
  HeadTagsHandler,
  Layout,
  PageHeader,
} from '../../components';

export default function GameStatistic() {
  const intl = useIntl();
  const router = useRouter();
  const [gameId, setGameId] = useState<number | null | undefined>(undefined);
  const { data: game } = useSWR<Game>((gameId === undefined || gameId === null) ? null : `/games/${gameId}/`);
  const { data: gameStatistics } = useSWR<GameStatistic[]>(game === undefined ? null : `/games/user_game_statistics/?game=${game.id}`);

  useEffect(() => {
    const { id: qsId } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const parsedQsId = parseInt((qsId || '').toString()) || null;

    if (gameId !== parsedQsId) {
      setGameId(parsedQsId);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (gameId === null) {
      router.replace('/arena/');
    }
  }, [gameId]);

  return (
    <>
      <HeadTagsHandler
        imageUrl={game === undefined ? game : game.image}
        title={`${intl.formatMessage({ defaultMessage: '{game} Statistics' },
          { game: game === undefined ? '' : game.name })} | Gamer Arena`}
      />

      <Layout>
        {(game === undefined || gameStatistics === undefined) ? <ActivityIndicator />
          : (
            <>
              <PageHeader
                background={game.image}
                title={game.name}
              />

              <Container>
                <GameStatisticsRanking gameId={game.id} />
              </Container>
            </>
          )}
      </Layout>
    </>
  );
}
