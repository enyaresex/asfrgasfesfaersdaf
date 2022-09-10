type Game = {
  id: number,
  image: string,
  isActive: boolean,
  name: string,
};

type GameMode = {
  game: number,
  id: number,
  isActive: number,
  isScoreRequired: boolean,
  sampleOcrImage: string | null,
  name: string,
  platform: number,
  requiredAccountField: keyof UserGameAccounts,
  rules: string,
};

type GameStatistic = {
  game: number,
  id: number,
  isActive: boolean,
  loseCount: number,
  platform: number,
  rank: Rank,
  rating: number,
  user: number,
  winCount: number,
};

type HydratedGameMode = GameMode & {
  requiredAccountFieldStatus: UserHydratedGameAccounts,
};

type Platform = {
  id: number,
  isActive: boolean,
  name: string,
};

type UserGamePlacement = {
  game: number,
  gameAccount: string | null,
  id: number,
  isActive: boolean,
  loseCount: number,
  nextRankName: Rank,
  nextRankRating: number,
  placement: number,
  platform: number,
  previousRankName: Rank,
  previousRankRating: number,
  rank: Rank,
  rating: number,
  user: number,
  winCount: number,
  winRate: number | null,
};
