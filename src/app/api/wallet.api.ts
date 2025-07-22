import httpClient from "@/utils/httpClient";

const getWallet = async (walletId: string) => {
  const path = `/external/wallets/${walletId}`;
  const response = await httpClient().get(path);
  return response.data;
};

export const WalletServices = {
  getWallet,
};
