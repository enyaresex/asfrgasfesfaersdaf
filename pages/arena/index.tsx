import React, { useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  AnalyticsProvider,
  Container,
  DuelCardList,
  FilterSort,
  HeadTagsHandler,
  Jumbotron,
  Layout,
  QuickDuel,
  RamadanDuelsProgress,
  UserCardList,
} from '../../components';
import { AuthAndApiContext, BreakpointContext, FilterSortContext, RamadanCampaignContext } from '../../contexts';
import styles from './Arena.module.css';

export default function Arena() {
  const intl = useIntl();
  const { user } = useContext(AuthAndApiContext);
  const { device } = useContext(BreakpointContext);
  const { selectedDuelFilters, selectedDuelStatus } = useContext(FilterSortContext);
  const { isRamadan } = useContext(RamadanCampaignContext);

  const isUserCardListVisible = useMemo<boolean>(() => {
    if (device === 'desktop') {
      return selectedDuelFilters.game !== null;
    }

    return selectedDuelFilters.game !== null;
  }, [device, selectedDuelFilters.game]);

  return (
    <AnalyticsProvider category="Arena">
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Arena' })} | Gamer Arena`} />

      <Layout className={styles.arena}>
        {device !== 'desktop' && <FilterSort type="fixedBottom" />}

        <Jumbotron />

        <Container className={styles.container}>
          <div className={styles.wrapper}>
            {user != null && isRamadan && <RamadanDuelsProgress />}

            {user !== null && (
              <DuelCardList
                excludeStatus={['CANCELED', 'DECLINED', 'ENDED', 'EXPIRED']}
                includeUsers={[user.id]}
                title={intl.formatMessage({ defaultMessage: 'My Ongoing Duels' })}
              />
            )}

            {device === 'desktop' && <QuickDuel />}

            <DuelCardList
              excludeStatus={['CANCELED', 'EXPIRED']}
              excludeUsers={user === null ? null : [user.id]}
              game={selectedDuelFilters.game}
              gameMode={selectedDuelFilters.gameMode}
              includeStatus={device === 'desktop' ? ['OPEN'] : [...selectedDuelStatus]}
              platform={selectedDuelFilters.platform}
              title={device === 'desktop'
                ? intl.formatMessage({ defaultMessage: 'Open Duels' })
                : intl.formatMessage({ defaultMessage: 'Matching Duels Based On Your Search' })}
            />

            {isUserCardListVisible && (
              <UserCardList
                gameId={(selectedDuelFilters.game as number)}
                platformId={selectedDuelFilters.platform}
              />
            )}
          </div>
        </Container>
      </Layout>
    </AnalyticsProvider>
  );
}
