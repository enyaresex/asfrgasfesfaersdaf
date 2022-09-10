import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage, useIntl } from 'react-intl';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useClickAway } from 'react-use';
import useSWR, { mutate } from 'swr';
import { AnalyticsContext, AuthAndApiContext, OnlineUsersContext, RegionContext } from '../../contexts';
import { createGtag, sendGAEvent } from '../../helpers';
import { useKeyDown } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import AnalyticsProvider from '../AnalyticsProvider';
import BackgroundShade from '../BackgroundShade';
import Button from '../Button';
import Checkbox from '../Checkbox';
import FormGroup from '../FormGroup';
import HeaderButton from '../HeaderButton';
import OnlineUser from '../OnlineUser';
import { ReactComponent as Arrow } from './arrow.svg';
import styles from './OnlineUsers.module.css';
import { ReactComponent as OnlineUsersIcon } from './onlineUsers.svg';
import { ReactComponent as Toggle } from './toggle.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

const pageSize = 10;

export default function OnlineUsers({ className, ...props }: Props): JSX.Element {
  const intl = useIntl();
  const section = useRef<HTMLElement>(null);
  const { region } = useContext(RegionContext);
  const { api, user } = useContext(AuthAndApiContext);
  const { category } = useContext(AnalyticsContext);
  const { onlineUsers } = useContext(OnlineUsersContext);

  const { data: games } = useSWR<Game[]>(region === null ? null : `/games/?is_active=true&region=${region.id}`);
  const { data: platforms } = useSWR<Platform[]>(region === null ? null : `/games/platforms/?is_active=true&region=${region.id}`);
  const { data: gameModes } = useSWR<GameMode[]>(region === null ? null : `/games/game_modes/?is_active=true&region=${region.id}`);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(pageSize);

  const [areGamesOpen, setAreGamesOpen] = useState<boolean>(false);
  const [arePlatformsOpen, setArePlatformsOpen] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  const filteredOnlineUsers = useMemo(() => onlineUsers.filter((u) => {
    if (selectedGame === null) return true;

    return u.userGames.filter((userGame) => (selectedPlatform === null
      ? userGame.game === selectedGame.id
      : userGame.game === selectedGame.id && userGame.platform === selectedPlatform.id)).length > 0;
  }), [onlineUsers, selectedGame, selectedPlatform]);

  useClickAway(section, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  useKeyDown(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, ['escape']);

  const availablePlatforms = useMemo<Platform[] | null>(() => {
    if (selectedGame === null || gameModes === undefined || platforms === undefined) return null;

    const platformIds = Array.from(new Set(gameModes
      .filter((g) => g.game === selectedGame.id)
      .map((g) => g.platform)));

    return platforms.filter((p) => platformIds.includes(p.id));
  }, [gameModes, platforms, selectedGame]);

  useEffect(() => {
    if (availablePlatforms === null || selectedGame === null || selectedPlatform !== null) return;

    if (availablePlatforms.length === 1) {
      setSelectedPlatform(availablePlatforms[0]);

      setArePlatformsOpen(false);
    }
  }, [availablePlatforms]);

  return (
    <>
      <BackgroundShade isVisible={isOpen} />

      <div {...props} className={classNames(className, styles.onlineUsers)}>
        <HeaderButton
          className={styles.headerButton}
          data-gtag={createGtag({ category, event: 'Open Online Users', label: 'Online Users' })}
          onClick={() => setIsOpen(!isOpen)}
        >
          <OnlineUsersIcon />

          <div className={styles.onlineIndicator} />
        </HeaderButton>

        <TransitionGroup component={null}>
          {isOpen && (
            <CSSTransition appear timeout={300}>
              <section
                className={classNames(styles.onlineUsersSideNav, isOpen && styles.open)}
                data-cy="onlineUsers"
                ref={section}
              >
                {games === undefined || platforms === undefined ? <ActivityIndicator /> : (
                  <AnalyticsProvider category="Online Users">
                    <div className={styles.wrapper}>
                      <div className={styles.toggle}>
                        <button
                          aria-label="toggle online users"
                          className={styles.toggleButton}
                          onClick={() => setIsOpen((prev) => !prev)}
                          type="button"
                        >
                          <Arrow />
                        </button>
                      </div>

                      <h5 className={styles.mainTitle}>
                        <FormattedMessage defaultMessage="Online Users" />
                      </h5>

                      <div className={styles.filters}>
                        {user !== null && (
                          <div className={styles.filter}>
                            <Checkbox
                              checked={user.isShownWhenOnline}
                              className={classNames(styles.isShownWhenOnline, styles.title)}
                              id="checkbox-is-shown-when-online"
                              label={intl.formatMessage({ defaultMessage: 'Share When I’m Online' })}
                              name="is-shown-when-online"
                              onChange={async (event) => {
                                const response = await api.patch(
                                  '/users/me/',
                                  { isShownWhenOnline: event.target.checked },
                                );

                                if (response.ok) {
                                  await mutate('/users/me/', await response.json());
                                }

                                sendGAEvent({
                                  category,
                                  event: 'Toggle Share When I\'m Online',
                                  value: event.target.checked ? 1 : 0,
                                });
                              }}
                            />
                          </div>
                        )}

                        <div className={styles.filter}>
                          <button
                            className={classNames(styles.title, styles.accordionButton)}
                            onClick={() => setAreGamesOpen((prev) => !prev)}
                            type="button"
                          >
                            <p className={styles.name}>
                              <FormattedMessage defaultMessage="Game Selection" />

                              {(selectedGame !== null) && (
                                <span>{`(${selectedGame.name})`}</span>
                              )}
                            </p>

                            <Toggle className={classNames(!areGamesOpen && styles.opened)} />
                          </button>

                          <AnimateHeight duration={50} height={areGamesOpen ? 'auto' : 0}>
                            <div className={styles.content}>
                              {games.map((g) => (
                                <FormGroup className={styles.formGroup} key={g.id}>
                                  <Checkbox
                                    checked={g.id === selectedGame?.id}
                                    id={`onlineUsersGames-${g.name}`}
                                    label={g.name}
                                    labelImage={g.image}
                                    name="online-users-game-filter"
                                    onChange={(event) => {
                                      if (event.target.checked) {
                                        setSelectedGame(g);
                                        setSelectedPlatform(null);

                                        setAreGamesOpen(false);
                                        setArePlatformsOpen(true);

                                        sendGAEvent({ category, event: 'Select Game', value: g.name });
                                      } else {
                                        setSelectedGame(null);
                                        setSelectedPlatform(null);
                                      }
                                    }}
                                    required
                                    value={g.id || ''}
                                  />
                                </FormGroup>
                              ))}
                            </div>
                          </AnimateHeight>
                        </div>

                        {availablePlatforms !== null && (
                          <div className={styles.filter}>
                            <button
                              className={classNames(styles.title, styles.accordionButton)}
                              onClick={() => {
                                setArePlatformsOpen((prev) => !prev);
                              }}
                              type="button"
                            >
                              <p className={styles.name}>
                                <FormattedMessage defaultMessage="Platform Selection" />

                                {(selectedPlatform !== null) && (
                                  <span>{`(${selectedPlatform.name})`}</span>
                                )}
                              </p>

                              <Toggle className={classNames(!arePlatformsOpen && styles.opened)} />
                            </button>

                            <AnimateHeight duration={50} height={arePlatformsOpen ? 'auto' : 0}>
                              <div className={classNames(styles.content, styles.inline)}>
                                {availablePlatforms.map((p) => (
                                  <FormGroup className={styles.formGroup} key={p.id}>
                                    <Checkbox
                                      checked={p.id === selectedPlatform?.id}
                                      id={`onlineUsersPlatforms-${p.name}`}
                                      label={p.name}
                                      name="platformIds"
                                      onChange={(event) => {
                                        if (event.target.checked) {
                                          setSelectedPlatform(p);

                                          setArePlatformsOpen(false);
                                        } else {
                                          setSelectedPlatform(null);
                                        }
                                      }}
                                      required
                                    />
                                  </FormGroup>
                                ))}
                              </div>
                            </AnimateHeight>
                          </div>
                        )}
                      </div>

                      {selectedGame !== null && (
                        <button
                          className={styles.clearFilters}
                          onClick={() => {
                            setSelectedPlatform(null);
                            setSelectedGame(null);
                          }}
                          type="button"
                        >
                          <FormattedMessage defaultMessage="Clear Filters" />
                        </button>
                      )}

                      <div className={styles.body}>
                        <>
                          {filteredOnlineUsers.length === 0 ? null : (
                            <>
                              <div className={styles.header}>
                                <p><FormattedMessage defaultMessage="Users" /></p>

                                <p><FormattedMessage defaultMessage="Action" /></p>
                              </div>

                              <div className={styles.users}>
                                {filteredOnlineUsers.slice(0, limit).map((u) => (
                                  <OnlineUser
                                    key={u.userId}
                                    onlineUser={u}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      </div>

                      {filteredOnlineUsers.length > limit && (
                        <div className={styles.showMoreButtonWrapper}>
                          <Button
                            onClick={() => setLimit((l) => l + pageSize)}
                            size="large"
                            type="button"
                            variant="secondary"
                          >
                            <FormattedMessage defaultMessage="Show More" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </AnalyticsProvider>
                )}
              </section>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </>
  );
}
