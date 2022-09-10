import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import { Container, DuelCardList, FilterSortLayout, HeadTagsHandler, Layout, PageHeader } from '../../components';
import { BreakpointContext, FilterSortContext } from '../../contexts';

export default function DuelList() {
  const intl = useIntl();
  const router = useRouter();
  const { breakpoint } = useContext(BreakpointContext);
  const {
    selectedDuelFilters,
    selectedDuelStatus,
    selectedOrderingOption,
    setSelectedDuelFilters,
  } = useContext(FilterSortContext);

  const { data: game } = useSWR<Game>(selectedDuelFilters.game === null ? null : `/games/${selectedDuelFilters.game}/`);

  useEffect(() => {
    if (router.query.game !== undefined) {
      setSelectedDuelFilters({ ...selectedDuelFilters, game: Number(router.query.game) });
    }
  }, [router.query]);

  const content = (
    <DuelCardList
      cardsPerRow={(() => {
        if (breakpoint === 'xxl') return 3;
        if (breakpoint === 'xl') return 2;

        return undefined;
      })()}
      emptyStatus={intl.formatMessage({ defaultMessage: 'We couldn\'t find a duel according to your criteria.' })}
      excludeStatus={['CANCELED', 'EXPIRED']}
      game={selectedDuelFilters.game}
      gameMode={selectedDuelFilters.gameMode}
      hideIfEmpty={false}
      includeStatus={selectedDuelStatus}
      ordering={selectedOrderingOption}
      platform={selectedDuelFilters.platform}
      title={intl.formatMessage({ defaultMessage: 'Matching Duels Based On Your Search' })}
    />
  );

  return (
    <>
      <HeadTagsHandler
        imageUrl={game === undefined ? game : game.image}
        title={`${intl.formatMessage({ defaultMessage: 'Duels' })} | Gamer Arena`}
      />

      <Layout>
        <FilterSortLayout>
          <PageHeader
            background="duelsListing"
            description={intl.formatMessage({ defaultMessage: 'Are you ready for a new challenge?' })}
            title={intl.formatMessage({ defaultMessage: 'Gamer Arena Duels' })}
          />

          <Container>
            {content}
          </Container>
        </FilterSortLayout>
      </Layout>
    </>
  );
}
