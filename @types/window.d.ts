type Crisp = {
  push: (params: any) => any,
};

type DiscordCrate = {
  hide: () => void,
  show: () => void,
};

type GaEvent = {
  category?: string,
  event?: string,
  label?: string,
  value?: number | string,
};

type GaAuthEvent = {
  event: 'auth',
  userId: number,
  userUsername: string,
};

interface Window {
  $crisp?: Crisp,
  Intercom: any,
  discordCrate?: DiscordCrate; // this one comes from the tag manager
  dataLayer: (AnalyticsEcommerceEvent | GaEvent | GaAuthEvent)[];
}
