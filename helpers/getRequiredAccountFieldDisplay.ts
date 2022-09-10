const requiredAccountFieldDisplays: Record<keyof UserGameAccounts, UserGameAccountDisplay> = {
  activisionAccount: 'Activision Account',
  basketballArenaTeamName: 'Basketball Arena Team Name',
  battleTag: 'Battle Tag',
  codMobileUsername: 'CoD Mobile Username',
  eaAccount: 'EA Account',
  epicGamesUsername: 'Epic Games Username',
  fifaUsername: 'FIFA Username',
  freeFireUsername: 'Free Fire Username',
  headBallUsername: 'Head Ball Username',
  mobileLegendsUsername: 'Mobile Legends Username',
  psnUsername: 'PSN Username',
  pubgMobileUsername: 'PUBG Mobile Username',
  pubgUsername: 'PUBG Username',
  riotId: 'Riot Id',
  sabotajUsername: 'Sabotage Username',
  steamProfileName: 'Steam Profile Name',
  supercellId: 'Supercell ID',
  xboxGamertag: 'Xbox Gamertag',
  zulaUsername: 'Zula Username',
  arenaOfValorUsername: 'Arena of Valor Username',
};

export default function getRequiredAccountFieldDisplay(field: keyof UserGameAccounts): UserGameAccountDisplay {
  return requiredAccountFieldDisplays[field];
}
