import getRequiredAccountFieldDisplay from './getRequiredAccountFieldDisplay';

export default function hydrateGameMode(gameMode: GameMode): HydratedGameMode {
  return {
    ...gameMode,
    requiredAccountFieldStatus: getRequiredAccountFieldDisplay(gameMode.requiredAccountField),
  };
}
