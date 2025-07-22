import httpClient from "@/utils/httpClient";

const login = async (username: string, password: string) => {
  const path = `/common/users/login`;
  const response = await httpClient().post(path, {
    username,
    password,
  });
  return response.data;
};

export const AuthServices = {
  login,
};
