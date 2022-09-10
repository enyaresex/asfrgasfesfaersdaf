type Country = {
  code: string,
  flag: string,
  id: number,
  name: CountryName,
  phoneNumberCountryCode: string,
  region: number,
};

type CountryName = 'Türkiye' | 'Other';

type Language = {
  code: string,
  id: number,
  name: string,
};

type Region = {
  currencyCode: CurrencyCode,
  depositProviders: DepositProvider[],
  exchangeRate: number,
  id: number,
  name: string,
  withdrawFeePercentage: number,
  withdrawProviders: WithdrawProvider[]
  withdrawThreshold: number,
};
