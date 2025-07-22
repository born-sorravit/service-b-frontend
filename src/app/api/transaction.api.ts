import { IWithdraw } from "@/interfaces/transaction.interface";
import httpClient from "@/utils/httpClient";

const withdraw = async (walletId: string, withdrawDto: IWithdraw) => {
  const path = `/external/wallets/withdraw/${walletId}`;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY_SERVICE_A || "";
  const response = await httpClient().post(
    path,
    {
      ...withdrawDto,
    },
    {
      headers: {
        "x-api-key": apiKey,
      },
    }
  );
  return response.data;
};

export const TransactionServices = {
  withdraw,
};
