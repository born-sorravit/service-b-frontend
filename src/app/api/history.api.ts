import httpClient from "@/utils/httpClient";

const getHistory = async (username: string) => {
  const path = `/common/history/${username}`;
  const response = await httpClient().get(path);
  return response.data;
};

export const HistoryServices = {
  getHistory,
};
