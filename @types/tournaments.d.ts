type Ladder = {
  buttonText: string,
  buttonUrl: string,
  description: string,
  endsAt: string,
  game: number,
  id: number,
  isButtonEnabled: boolean,
  name: string,
  rewards: number[],
  rosterSize: number,
  startsAt: string,
  status: LadderTournamentStatus,
  totalReward: number,
};

type LadderEntry = {
  id: number,
  createdAt: string,
  updatedAt: string,
  name: string,
  users: number[],
  points: number,
};

type LadderTournamentStatus = 'FINISHED' | 'FUTURE' | 'IN_PROGRESS' | 'PAUSED' | 'REGISTRATION';

type Leaderboard = {
  description: string,
  endsAt: string,
  game: number,
  id: number,
  isActive: boolean,
  name: string,
  rewards: number[],
  startsAt: string,
  status: LeaderboardTournamentStatus,
  totalReward: number,
};

type LeaderboardEntry = {
  id: number,
  loseCount: number,
  user: number,
  winCount: number,
};

type UserLeaderboardEntry = {
  id: number,
  leaderboard: number,
  loseCount: number,
  rank: number,
  reward: number,
  winCount: number,
};

type LeaderboardTournamentStatus = 'FINISHED' | 'FUTURE' | 'IN_PROGRESS' | 'IN_REVIEW' | 'PAUSED';
