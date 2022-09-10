import React from 'react';
import useSWR from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import EndedDuelDisplay from '../EndedDuelDisplay';
import EndedDuelDisplayWithScore from '../EndedDuelDisplayWithScore';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  duel: Duel,
}>;

export default function DuelEnded({ className, duel, ...props }: Props) {
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}/`);

  return gameMode === undefined ? <ActivityIndicator /> : (
    <div {...props} className={className}>
      {gameMode.isScoreRequired ? (
        <EndedDuelDisplayWithScore duel={duel} />
      ) : (
        <EndedDuelDisplay duel={duel} />
      )}
    </div>
  );
}
