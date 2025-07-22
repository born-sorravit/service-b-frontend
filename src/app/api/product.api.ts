import httpClient from "@/utils/httpClient";

const getProducts = async () => {
  const path = `/common/products/all`;
  const response = await httpClient().get(path);
  return response.data;
};

export const ProductServices = {
  getProducts,
};
