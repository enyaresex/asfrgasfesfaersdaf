import getDuelStatusDisplay from './getDuelStatusDisplay';

export default function hydrateDuel(duel: Duel): HydratedDuel {
  return {
    ...duel,
    statusDisplay: getDuelStatusDisplay(duel.status),
  };
}
