import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import EmptyStateDisplay from '../EmptyStateDisplay';
import Select from '../Select';
import { ReactComponent as DuelsLost } from './duelsLost.svg';
import { ReactComponent as DuelsWon } from './duelsWon.svg';
import styles from './UserStats.module.css';
import { ReactComponent as WinRate } from './winRate.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  userId: number,
}>;

type GameOptionProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['option']>, {
  gameId: number,
}>;

const GameOption = ({ className, gameId, ...props }: GameOptionProps) => {
  const { data: game } = useSWR<Game>(`/games/${gameId}/`);

  return game === undefined ? null : (
    <option {...props} className={className} value={gameId}>{game.name}</option>
  );
};

export default function UserStats({ className, userId, ...props }: Props) {
  const intl = useIntl();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const { data: userGamePlacements } = useSWR<UserGamePlacement[]>(`/games/user_game_placements/?user=${userId}`);

  const userGamePlacement = useMemo<UserGamePlacement | null>(() => {
    if (userGamePlacements === undefined) return null;

    const gameDetails = userGamePlacements.find((gs) => gs.game === selectedGame);

    return gameDetails === undefined ? null : gameDetails;
  }, [selectedGame, userGamePlacements]);

  useEffect(() => {
    if (userGamePlacements !== undefined && userGamePlacements.length > 0 && selectedGame === null) {
      setSelectedGame(userGamePlacements[0].game);
    }
  }, [selectedGame, userGamePlacements]);

  return userGamePlacements === undefined ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.userStats, className)}>
      <div className={styles.header}>
        <h4>
          <FormattedMessage defaultMessage="User Stats" />
        </h4>

        <>
          {userGamePlacement === null ? null : (
            <Select
              disabled={isDisabled}
              id="sort-dropdown"
              name="selectedGame"
              onChange={(e) => {
                setIsDisabled(true);

                setSelectedGame(Number(e.target.value));

                setIsDisabled(false);
              }}
              size="small"
              value={selectedGame || ''}
            >
              {selectedGame === null && (
                <option aria-label="sortBy" disabled value="" />
              )}

              {userGamePlacements.map((o) => <GameOption gameId={o.game} key={o.id} />)}
            </Select>
          )}
        </>
      </div>

      <div className={classNames(styles.body)}>
        {userGamePlacement === null
          ? <EmptyStateDisplay kind="noUserStat" message={intl.formatMessage({ defaultMessage: 'No stats found' })} />
          : (
            <>
              <div className={styles.stat}>
                <DuelsWon />

                <p className={styles.statName}>
                  <FormattedMessage defaultMessage="Duels Won" />
                </p>

                <p className={styles.statValue}>
                  {userGamePlacement.winCount}
                </p>
              </div>

              <div className={styles.stat}>
                <DuelsLost />

                <p className={styles.statName}>
                  <FormattedMessage defaultMessage="Duels Lost" />
                </p>

                <p className={styles.statValue}>
                  {userGamePlacement.loseCount}
                </p>
              </div>

              <div className={styles.stat}>
                <WinRate />

                <p className={styles.statName}>
                  <FormattedMessage defaultMessage="Win Rate" />
                </p>

                <p className={styles.statValue}>
                  {userGamePlacement.winRate ? (
                    <FormattedMessage
                      defaultMessage="{number}%"
                      values={{ number: userGamePlacement.winRate }}
                    />
                  ) : 'N/A'}
                </p>
              </div>
            </>
          )}
      </div>
    </section>
  );
}
