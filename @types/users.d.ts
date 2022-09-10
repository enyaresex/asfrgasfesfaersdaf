type AuthUser = UserGameAccounts & {
  avatar: string,
  balance: number,
  bio: string,
  country: number,
  createdAt: string,
  discordUrl: string | null,
  email: string,
  facebookUrl: string | null,
  fullName: string,
  hasReceivedBalanceBonus: boolean,
  id: number,
  isActive: boolean,
  isDiscordVerificationBonusReceived: boolean,
  isEmailVerificationBonusReceived: boolean,
  isEmailVerified: boolean,
  isGameAccountBonusReceived: boolean,
  isPhoneNumberVerificationBonusReceived: boolean,
  isPhoneNumberVerified: boolean,
  isChallengeCampaignRewardReceived: boolean,
  isSettingAvatarBonusReceived: boolean,
  isShownWhenOnline: boolean,
  isStaff: boolean,
  isSubscribedToDiscord: boolean,
  isSubscribedToEmail: boolean,
  isSubscribedToPushNotifications: boolean,
  language: number,
  phoneNumber: string | null,
  depositCampaignUsedAt: string | null,
  steamUrl: string | null,
  twitchUrl: string | null,
  updatedAt: string
  username: string,
  withdrawThreshold: number,
};

type BlockedUser = {
  blockedUser: number,
  blockerUser: number,
  createdAt: string,
  id: number,
};

type NewGameUser = {
  id: number,
  user: number,
  rank: Rank,
};

type UserAccessToken = string;

type UserGameAccounts = {
  activisionAccount: string | null,
  basketballArenaTeamName: string | null,
  battleTag: string | null,
  codMobileUsername: string | null,
  eaAccount: string | null,
  epicGamesUsername: string | null,
  fifaUsername: string | null,
  freeFireUsername: string | null,
  headBallUsername: string | null,
  mobileLegendsUsername: string | null,
  psnUsername: string | null,
  pubgMobileUsername: string | null,
  pubgUsername: string | null,
  riotId: string | null,
  sabotajUsername: string | null,
  steamProfileName: string | null,
  supercellId: string | null,
  xboxGamertag: string | null,
  zulaUsername: string | null,
  arenaOfValorUsername: string | null,
};

type UserGameAccountDisplay =
  'Activision Account'
  | 'Basketball Arena Team Name'
  | 'Battle Tag'
  | 'CoD Mobile Username'
  | 'EA Account'
  | 'Epic Games Username'
  | 'FIFA Username'
  | 'Free Fire Username'
  | 'Head Ball Username'
  | 'Mobile Legends Username'
  | 'PSN Username'
  | 'PUBG Mobile Username'
  | 'PUBG Username'
  | 'Riot Id'
  | 'Sabotage Username'
  | 'Steam Profile Name'
  | 'Supercell ID'
  | 'Xbox Gamertag'
  | 'Zula Username'
  | 'Arena of Valor Username';

type Rank = 'bronze' | 'gold' | 'platinum' | 'silver';

type User = {
  avatar: string,
  bio: string,
  country: number,
  createdAt: string,
  discordUrl: string | null,
  facebookUrl: string | null,
  fullName: string,
  id: number,
  isActive: boolean,
  language: number,
  steamUrl: string | null,
  twitchUrl: string | null,
  username: string,
} & UserGameAccounts;

type UserGame = {
  game: number,
  gameAccount: string,
  id: number,
  isActive: boolean,
  loseCount: number,
  platform: number,
  rank: Rank,
  rating: number,
  user: number,
  winCount: number,
};

type UserDuelStatistics = {
  totalDuelCount: number,
  winCount: number,
  winRate: null | number,
};
