type CurrencyCode = 'EUR' | 'TRY' | 'USD';

type DepositProvider = 'paypal_checkout' | 'wirecard_pos' | 'icrypex_deposit';

type PaparaWallet = {
  accountNumber: string,
  createdAt: string,
  isVerified: boolean,
  tckn: string,
  updatedAt: string,
  user: number,
};

type IcrypexWallet = {
  createdAt: string,
  updatedAt: string,
  user: number,
  isVerified: boolean,
  email: string,
  phone: string,
  firstName: string,
  lastName: string,
  identity: string,
};

type PaymentProvider = DepositProvider & WithdrawProvider;

type PaypalWallet = {
  createdAt: string,
  email: string,
  payerId: string,
  updatedAt: string,
  user: number,
};

type Transaction = {
  createdAt: string,
  currencyAmount: number,
  currencyCode: CurrencyCode,
  exchangeRate: number,
  gaCoinAmount: number,
  id: number,
  isCompleted: boolean | null,
  kind: TransactionKind,
  kindDescription: TransactionKindDescription,
  provider: PaymentProvider,
  updatedAt: string,
  user: number,
};

type TransactionKind =
  'admin_increase'
  | 'admin_decrease'
  | 'coupon'
  | 'deposit'
  | 'entry_fee'
  | 'promotion'
  | 'return'
  | 'win'
  | 'withdraw'
  | 'withdraw_fee';

type TransactionKindDescription =
  'Admin increase'
  | 'Admin decrease'
  | 'Coupon'
  | 'Deposit'
  | 'Entry fee'
  | 'Promotion'
  | 'Return'
  | 'Win'
  | 'Withdraw'
  | 'Withdraw Fee';

type WalletDetail = {
  createdAt: string,
  updatedAt: string,
  user: number,
  withdrawThreshold: number,
  isCreated: boolean,
  tckn: string,
  gsm: string,
  name: string,
  surname: string,
  dateOfBirth: string,
  email: string,
  iban: string,
  placeOfBirth: string,
  city: string,
  district: string
};

type WithdrawProvider = 'n11' | 'papara_masspayment' | 'paypal_payments' | 'icrypex' | 'wirecard_emoney';

type WithdrawRequest = {
  id: number,
  createdAt: string,
  updatedAt: string,
  user: number,
  kind: TransactionKind,
  kindDescription: TransactionKindDescription,
  tokenAmount: number,
  exchangeRate: number,
  currencyCode: CurrencyCode,
  provider: WithdrawProvider,
  isCompleted: boolean | null,
  currencyAmount: null,
};
