import classNames from 'classnames';
import Link from 'next/link';
import React, { useMemo } from 'react';
import useSWR from 'swr';
import Avatar from '../Avatar';
import Progress from '../Progress';
import UserRank from '../UserRank';
import styles from './UserGameAccount.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  userId: number,
  userGame: UserGame,
}>;

export default function UserGameAccount({ className, userId, userGame, ...props }: Props) {
  const { data: userGamePlacements } = useSWR<UserGamePlacement[]>(`/games/user_game_placements/?user=${userId}`);
  const { data: game } = useSWR<Game>(() => `/games/${userGame.game}/`);
  const { data: platform } = useSWR<Platform>(() => `/games/platforms/${userGame.platform}/`);

  const placement = useMemo<UserGamePlacement | null>(() => {
    if (userGamePlacements === undefined || game === undefined || platform === undefined) return null;

    const temp = userGamePlacements.find((p) => p.platform === platform.id && p.game === game.id);

    return temp === undefined ? null : temp;
  }, [game, platform, userGamePlacements]);

  return game === undefined || platform === undefined || placement === null ? null : (
    <Link href={`/game-statistics?id=${userGame.game}`}>
      <a {...props} className={classNames(styles.userGamesAccount, className)}>
        <Avatar image={game.image} rank={placement?.placement} size={62} />

        <div className={styles.details}>
          <p className={styles.name}>{game.name}</p>

          <p className={styles.platform}>{platform.name}</p>

          <p className={styles.username}>{`@${placement.gameAccount}`}</p>
        </div>

        <div className={styles.rank}>
          <UserRank rank={placement.rank} />

          <Progress
            height={7}
            partitions={1}
            progress={((placement.rating - placement.previousRankRating) / (placement.nextRankRating - placement.previousRankRating)) * 100}
          />
        </div>
      </a>
    </Link>
  );
}
