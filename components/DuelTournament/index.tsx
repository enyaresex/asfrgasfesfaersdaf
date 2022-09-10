import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import SectionCard from '../SectionCard';
import styles from './DuelTournament.module.css';
import { ReactComponent as Cup } from './cup.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  duel: HydratedDuel
}>;

export default function DuelTournament({ className, duel, ...props }: Props) {
  const { data: leaderboard } = useSWR<Leaderboard>(() => (
    duel.leaderboard === null ? null : `/tournaments/leaderboards/${duel.leaderboard}/`));
  const { data: gameMode } = useSWR<GameMode>(() => `/games/game_modes/${duel.gameMode}/`);
  const { data: game } = useSWR<Game>(() => (gameMode === undefined ? null : `/games/${gameMode.game}/`));

  return duel.leaderboard === null ? null : (
    <>
      {(leaderboard === undefined || game === undefined) ? <ActivityIndicator /> : (
        <SectionCard {...props} className={classNames(styles.duelTournament, className)}>
          <div className={styles.wrapper}>
            <div className={styles.info}>
              <div className={styles.game}>
                <img alt={game.name} className={styles.image} loading="lazy" src={game.image} />

                <div className={styles.icon}>
                  <Cup />
                </div>
              </div>

              <div className={styles.details}>
                <p className={styles.muted}>
                  <FormattedMessage defaultMessage="This duel is within the scope of leaderboard tournament" />
                </p>

                <p>{leaderboard.name}</p>
              </div>
            </div>

            <Link href={`/tournaments/leaderboard/?id=${leaderboard.id}`} passHref>
              <Button className={styles.link} outline>
                <FormattedMessage defaultMessage="Go to Tournament Page" />
              </Button>
            </Link>
          </div>
        </SectionCard>
      )}
    </>
  );
}
