import { ECurrency } from "@/enums/currency.enum";

export interface IDeposit {
  amount: number;
  currency: string;
}

export interface IWithdraw {
  username: string;
  toUsers: {
    amount: number;
    currency: ECurrency;
    username: string;
  }[];
  products: {
    id: string;
    quantity: number;
  }[];
}

export interface IDepositResponse {
  id: string;
  depositAmount: number;
  depositCurrency: string;
  rateToUSD: number;
  totalBalance: number;
  currencyBalance: string;
}

export interface IWithdrawResponse {
  id: string;
  totalWithdrawnUSD: number;
  totalBalance: number;
  currencyBalance: string;
  transactions: {
    to: string;
    amount: number;
    currency: string;
    amountInUSD: number;
    rateToUSD: number;
  };
}
