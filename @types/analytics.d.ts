type AnalyticsEvent = {
  category: string,
  event: string,
  label?: string,
  value?: string | number,
};

type AnalyticsEcommerceEvent = {
  currencyCode: CurrencyCode,
  event?: string,
  transactionId: string,
  transactionTotal: number,
};

type AnalyticsCategory = 'Arena' |
  'Duel Creation Modal' |
  'Duel Detail' |
  'Duels' |
  'External' |
  'Header' |
  'Landing' |
  'Notifications' |
  'Online Users' |
  'Settings' |
  'Sidebar' |
  'Tournament Detail' |
  'User Detail' |
  'Wallet';
