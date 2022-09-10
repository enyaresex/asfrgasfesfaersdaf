type Duel = {
  createdAt: string,
  didUser2Accept: boolean | null,
  endedAt: string,
  entryFee: number,
  gameMode: number,
  id: number,
  leaderboard: number | null,
  pingedAt: string | null,
  region: number,
  resultDeclarationStartsAt: string | null,
  reward: number,
  startedAt: string | null,
  status: DuelStatus,
  user1: number,
  user1CheckInExpiresAt: string | null,
  user1CheckedInAt: string | null,
  user1Score: number | null,
  user2: number | null,
  user2CheckInExpiresAt: string | null,
  user2CheckedInAt: string | null,
  user2Score: number,
  userWon: number | null,
};

type DuelHydratedStatus =
  'Canceled'
  | 'Checking In'
  | 'Declaring Result'
  | 'Declined'
  | 'Ended'
  | 'Expired'
  | 'Invited'
  | 'In Dispute'
  | 'In Progress'
  | 'Open';

type DuelStatus =
  'CANCELED'
  | 'CHECKING_IN'
  | 'DECLARING_RESULT'
  | 'DECLINED'
  | 'ENDED'
  | 'EXPIRED'
  | 'INVITED'
  | 'IN_DISPUTE'
  | 'IN_PROGRESS'
  | 'OPEN';

type HydratedDuel = Duel & {
  statusDisplay: DuelHydratedStatus,
};

type UserDuelRival = {
  duelCount: number,
  user: number,
  winRate: number,
};
