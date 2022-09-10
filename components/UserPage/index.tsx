import { useRouter } from 'next/router';
import qs from 'qs';
import React, { useContext, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useSWR from 'swr';
import { AuthAndApiContext, BreakpointContext, RamadanCampaignContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import AnalyticsProvider from '../AnalyticsProvider';
import Container from '../Container';
import DuelCardList from '../DuelCardList';
import HeadTagsHandler from '../HeadTagsHandler';
import RamadanDuelsProgress from '../RamadanDuelsProgress';
import Tab from '../Tab';
import Tabs from '../Tabs';
import UserAbout from '../UserAbout';
import UserDuelRivals from '../UserDuelRivals';
import UserGames from '../UserGames';
import UserHeader from '../UserHeader';
import UserProfileProgress from '../UserProfileProgress';
import UserStats from '../UserStats';
import UserTrophies from '../UserTrophies';
import styles from './UserPage.module.css';

const bodyClassName = 'has-user-page-open';

export default function UserPage() {
  const intl = useIntl();
  const router = useRouter();
  const { breakpoint, device } = useContext(BreakpointContext);
  const { user } = useContext(AuthAndApiContext);
  const { isRamadan } = useContext(RamadanCampaignContext);

  async function closePage() {
    const { username: _, userDetail: __, ...query } = router.query;

    await router.replace({ pathname: router.pathname, query }, undefined, { scroll: false });
  }

  const username = useMemo<string | null>(() => {
    const { username: qsUsername } = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    return (qsUsername === undefined || qsUsername.toString() === '') ? null : qsUsername.toString();
  }, [router.query.username]);
  const isOpen = useMemo<boolean>(() => username !== null, [username]);

  const { data: profileUser, error: profileUserError } = useSWR<User>(
    (username === null || username === '') ? null : `/users/${username}/?field=username`,
    { shouldRetryOnError: false },
  );

  useEffect(() => {
    if (profileUserError) {
      closePage();
    }
  }, [profileUserError]);

  useEffect(() => {
    const bodyHasClass = device !== 'desktop' && isOpen;

    if (bodyHasClass) {
      document.body.classList.add(bodyClassName);
    } else {
      document.body.classList.remove(bodyClassName);
    }
  }, [device, isOpen]);

  const content = (username === null || profileUser === undefined) ? <ActivityIndicator flex /> : (
    <AnalyticsProvider category="User Detail">
      <HeadTagsHandler
        imageUrl={profileUser.avatar}
        title={`${intl.formatMessage({ defaultMessage: '{username} Profile' },
          { username: profileUser.username })} | Gamer Arena`}
      >
        <meta content="profile" key="og:type" property="og:type" />
        <meta content={profileUser.username} key="profile:username" property="profile:username" />
      </HeadTagsHandler>

      <UserHeader closePage={closePage} userId={profileUser.id} />

      <Container className={styles.user}>
        {(user?.username === username && device !== 'desktop') && <UserProfileProgress />}

        <Tabs activeTabSlugQueryKey="userDetail" className={styles.tabs}>
          <Tab slug="general" title={intl.formatMessage({ defaultMessage: 'General' })}>
            {device !== 'desktop' ? (
              <>
                {user !== null && profileUser.id === user.id && isRamadan && <RamadanDuelsProgress />}

                <UserAbout userId={profileUser.id} />

                <UserStats userId={profileUser.id} />

                <UserGames userId={profileUser.id} />
              </>
            ) : (
              <div className={styles.general}>
                <div className={styles.col}>
                  <UserAbout userId={profileUser.id} />

                  {breakpoint === 'xl' && <UserTrophies userId={profileUser.id} />}

                  <UserStats userId={profileUser.id} />
                </div>

                <div className={styles.col}>
                  {user !== null && profileUser.id === user.id && isRamadan && <RamadanDuelsProgress />}

                  {(user?.username === username && device === 'desktop') && <UserProfileProgress />}

                  <UserGames userId={profileUser.id} />
                </div>
              </div>
            )}
          </Tab>

          <Tab slug="duels" title={intl.formatMessage({ defaultMessage: 'Duels' })}>
            <DuelCardList
              emptyStatus={intl.formatMessage({ defaultMessage: 'This user didn\'t participate in any duels yet.' })}
              hideIfEmpty={false}
              includeUsers={[profileUser.id]}
            />
          </Tab>

          <Tab slug="rivals" title={intl.formatMessage({ defaultMessage: 'Rivals' })}>
            <UserDuelRivals userId={profileUser.id} />
          </Tab>

          {breakpoint !== 'xl' && (
            <Tab slug="trophies" title={intl.formatMessage({ defaultMessage: 'Trophies' })}>
              <UserTrophies userId={profileUser.id} />
            </Tab>
          )}
        </Tabs>
      </Container>
    </AnalyticsProvider>
  );

  return (
    <TransitionGroup component={null}>
      {isOpen && (
        <CSSTransition timeout={500}>
          <div className={styles.userPage}>
            {content}
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}
