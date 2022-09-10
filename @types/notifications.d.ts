type FSNotification = {
  action: FSNotificationAction,
  id: string,
  isUnread: boolean,
  key: 'balanceDecreased'
    | 'balanceIncreased'
    | 'checkIn'
    | 'checkInExpired'
    | 'duelAccepted'
    | 'duelDeclined'
    | 'duelHasStarted'
    | 'duelInvitation'
    | 'duelPinged'
    | 'leaderboardEntryWinCountIncreased'
    | 'leaderboardHasEnded'
    | 'resultDeclaration'
    | 'resultDeclarationAccepted'
    | 'resultDeclarationAutoAccepted'
    | 'resultDeclarationDeclined'
    | 'resultDeclarationNotResponded'
    | 'temporaryBanRemoved'
    | 'welcome'
    | 'welcome2'
    | 'withdrawRequestApproved'
    | 'withdrawRequestDenied',
  kind: 'duel'
    | 'info'
    | 'tournament'
    | 'wallet',
  textVars: Record<string, number | string> | null,
  timestamp: firebase.default.firestore.Timestamp,
};

type FSNotificationAction = {
  action: 'navigate'
    | 'open',
  id?: number,
  key: 'goToDuel'
    | 'goToLeaderboard'
    | 'goToLink'
    | 'goToSettings'
    | 'goToTournament'
    | 'goToWallet'
    | 'readRules'
    | 'verifyPhone'
    | 'watchVideo',
  route: 'duel'
    | 'leaderboard'
    | 'verifyPhoneNumber'
    | 'wallet',
};

type HydratedNotification = Overwrite<FSNotification, {
  action: HydratedNotificationAction,
  dateTimeDisplay: string,
  description: string,
  title: string,
}>;

type HydratedNotificationAction = Overwrite<FSNotificationAction, {
  title: string,
}>;
