import httpClient from "@/utils/httpClient";

const getCurrency = async () => {
  const path = `/external/rates/all`;
  const response = await httpClient().get(path);
  return response.data;
};

export const CurrencyServices = {
  getCurrency,
};
