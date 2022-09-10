import classNames from 'classnames';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import { hydrateGameMode } from '../../helpers';
import Avatar from '../Avatar';
import DuelStatus from '../DuelStatus';
import RequiredAccountFieldDisplay from '../RequiredAccountFieldDisplay';
import SectionCard from '../SectionCard';
import UserRank from '../UserRank';
import styles from './DuelPlayers.module.css';
import { ReactComponent as QuestionMark } from './questionMark.svg';
import { ReactComponent as Sword } from './sword.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  duel: HydratedDuel,
}>;

type CheckInStep = 'declined' | 'invited' | 'notReady'| 'ready';

export default function DuelPlayers({ className, duel, ...props }: Props) {
  const router = useRouter();
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}/`);
  const { data: game } = useSWR<Game>(gameMode === undefined ? null : `/games/${gameMode.game}/`);
  const { data: user1 } = useSWR<AuthUser>(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR<AuthUser>(duel.user2 === null ? null : `/users/${duel.user2}/`);
  const { data: userGamePlacementsUser1 } = useSWR<UserGamePlacement[]>(`/games/user_game_placements/?user=${duel.user1}`);
  const { data: userGamePlacementsUser2 } = useSWR<UserGamePlacement[]>(duel.user2 === null
    ? null
    : `/games/user_game_placements/?user=${duel.user2}`);
  const { data: user1Country } = useSWR<Country>(user1 === undefined ? null : `/i18n/countries/${user1.country}/`);
  const { data: user2Country } = useSWR<Country>(user2 === undefined ? null : `/i18n/countries/${user2.country}/`);

  const hydratedGameMode = useMemo<HydratedGameMode | null>(() => {
    if (gameMode === undefined) return null;

    return hydrateGameMode(gameMode);
  }, [gameMode]);

  const statusMessages = useMemo<Record<CheckInStep, React.ReactNode>>(() => ({
    declined: <p className={styles.declined}><FormattedMessage defaultMessage="Declined" /></p>,
    invited: <p className={styles.invited}><FormattedMessage defaultMessage="Invited" /></p>,
    notReady: <p className={styles.notReady}><FormattedMessage defaultMessage="Not Ready" /></p>,
    ready: <p className={styles.ready}><FormattedMessage defaultMessage="Ready" /></p>,
  }), []);

  const user1Status = useMemo<React.ReactNode>(() => {
    if (duel.user1CheckedInAt === null) {
      return statusMessages.notReady;
    }

    return statusMessages.ready;
  }, [duel]);

  const user1Rank = useMemo<Rank | null>(() => {
    if (userGamePlacementsUser1 === undefined || gameMode === undefined) return null;

    const temp = userGamePlacementsUser1.find((gp) => gp.game === gameMode.game && gp.platform === gameMode.platform);

    return temp === undefined ? null : temp.rank;
  }, [gameMode, userGamePlacementsUser1]);

  const user2Rank = useMemo<Rank | null>(() => {
    if (userGamePlacementsUser2 === undefined || gameMode === undefined) return null;

    const temp = userGamePlacementsUser2.find((gp) => gp.game === gameMode.game && gp.platform === gameMode.platform);

    return temp === undefined ? null : temp.rank;
  }, [gameMode, userGamePlacementsUser2]);

  const user2Status = useMemo<React.ReactNode | null>(() => {
    if (user2 === undefined) return null;

    if (duel.status === 'INVITED') {
      return statusMessages.invited;
    }

    if (duel.status === 'DECLINED') {
      return statusMessages.declined;
    }

    if (duel.user2CheckedInAt === null) {
      return statusMessages.notReady;
    }

    return statusMessages.ready;
  }, [duel, user2]);

  return (hydratedGameMode === null || game === undefined || user1 === undefined || user1Country === undefined) ? null
    : (
      <>
        <section {...props} className={classNames(className, styles.duelPlayers)}>
          <SectionCard
            header={(
              <div className={styles.header}>
                <div className={styles.game}>
                  <Avatar image={game.image} size={36} />

                  <p>{game.name}</p>
                </div>

                <div className={styles.details}>
                  <p className={styles.createdAt}>{dayjs(duel.createdAt).fromNow()}</p>

                  <DuelStatus status={duel.status} />
                </div>
              </div>
            )}
          >
            <div className={styles.content}>
              <Link href={{ query: { ...router.query, username: user1.username } }} scroll={false}>
                <a className={styles.user}>
                  <Avatar flag={user1Country.flag} image={user1.avatar} isBanned={!user1.isActive} size={66} />

                  <p className={styles.fullName}>{user1.username}</p>

                  {user1Rank !== null && <UserRank rank={user1Rank} />}

                  <p className={styles.userName}>
                    {user1[hydratedGameMode.requiredAccountField] === null ? 'N/A'
                      : `@${user1[hydratedGameMode.requiredAccountField]}`}
                  </p>

                  <p className={styles.gameName}>
                    <RequiredAccountFieldDisplay field={hydratedGameMode.requiredAccountFieldStatus} />
                  </p>

                  <hr className={styles.line} />

                  {user1Status}
                </a>
              </Link>

              <div className={styles.icon}>
                <Sword />
              </div>

              {user2 === undefined || user2Country === undefined ? (
                <div className={classNames(styles.user, styles.waiting)}>
                  <QuestionMark />

                  <p>
                    <FormattedMessage defaultMessage="Waiting for Opponent" />
                  </p>
                </div>
              ) : (
                <Link href={{ query: { ...router.query, username: user2.username } }} scroll={false}>
                  <a className={styles.user}>
                    <Avatar flag={user2Country.flag} image={user2.avatar} isBanned={!user2.isActive} size={66} />

                    <p className={styles.fullName}>{user2.username}</p>

                    {user2Rank !== null && <UserRank rank={user2Rank} />}

                    <p className={styles.userName}>
                      {user2[hydratedGameMode.requiredAccountField] === null ? 'N/A'
                        : `@${user2[hydratedGameMode.requiredAccountField]}`}
                    </p>

                    <p className={styles.gameName}>
                      <RequiredAccountFieldDisplay field={hydratedGameMode.requiredAccountFieldStatus} />
                    </p>

                    <div className={styles.line} />

                    {user2Status}
                  </a>
                </Link>
              )}
            </div>
          </SectionCard>
        </section>
      </>
    );
}
