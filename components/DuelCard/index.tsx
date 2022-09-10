import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import Avatar from '../Avatar';
import DuelStatus from '../DuelStatus';
import GACoin from '../GACoin';
import styles from './DuelCard.module.css';
import { ReactComponent as GameMode } from './gameMode.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']> & {
  duel: HydratedDuel,
  expand?: boolean,
};

export default function DuelCard({ className, duel, expand = false, ...props }: Props) {
  const intl = useIntl();
  const { data: user1 } = useSWR<User>(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR<User>(duel.user2 === null ? null : `/users/${duel.user2}/`);
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}/`);
  const { data: game } = useSWR<Game>(gameMode === undefined ? null : `/games/${gameMode.game}/`);

  const expandedImageStyle = {
    backgroundImage: expand && game !== undefined ? `url(${game.image})` : 'none',
  };

  return user1 === undefined || gameMode === undefined || game === undefined
    ? <ActivityIndicator /> : (
      <div
        {...props}
        className={classNames(styles.duelCard, className)}
      >
        <Link href={`/duels/duel/?id=${duel.id}`}>
          <a className={classNames(styles.wrapper, expand && styles.expand)}>
            <div className={styles.header} style={expandedImageStyle}>
              <div className={styles.headerWrapper}>
                <div className={styles.game}>
                  <Avatar alt={game.name} borderType={duel.status} image={game.image} size={36} />

                  <p className={styles.duelGame}>{game.name}</p>
                </div>

                <DuelStatus status={duel.status} />
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.opponents}>
                <div className={classNames(styles.player, styles.player1)}>
                  <p
                    className={classNames(
                      duel.status === 'ENDED' && duel.userWon === duel.user1 && styles.won,
                      duel.status === 'ENDED' && duel.userWon !== null && duel.userWon !== duel.user1 && styles.lost,
                    )}
                  >
                    {user1.username}
                  </p>
                </div>

                <DuelStatus className={styles.vs} status={duel.status} text="VS" />

                {user2 !== undefined ? (
                  <div className={classNames(styles.player, styles.player2)}>
                    <p
                      className={classNames(
                        duel.status === 'ENDED' && duel.userWon === duel.user2 && styles.won,
                        duel.status === 'ENDED' && duel.userWon !== null && duel.userWon !== duel.user2 && styles.lost,
                      )}
                    >
                      {user2.username}
                    </p>
                  </div>
                ) : (
                  <div className={classNames(styles.player, styles.player2, styles.waiting)}>
                    <p title={intl.formatMessage({ defaultMessage: 'Waiting For Opponent' })}>
                      {'? '}
                      <FormattedMessage defaultMessage="Waiting For Opponent" />
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.gameDetails}>
                <div className={styles.coins}>
                  <GACoin grayscale={duel.status === 'ENDED' || duel.status === 'CANCELED' || duel.status === 'DECLINED'} />

                  {duel.entryFee}

                  {' '}

                  GAU Token
                </div>
                <div className={styles.gameMode}>
                  <GameMode />

                  <p>{gameMode.name}</p>
                </div>
              </div>
            </div>
          </a>
        </Link>
      </div>
    );
}
