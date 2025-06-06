import axios from "axios";
import ApiConfig from "../Configs/ApiConfig";

export const getProducts = async () => {
  const response = await axios.get(ApiConfig.PRODUCTS);
  return response.data;
};


export const addProduct = async (payload: FormData) => {
  const response = await axios.post(ApiConfig.PRODUCTS, payload);
  return response.data;
};

export const updateProduct = async (productId: number, payload: FormData) => {
  const response = await axios.post(`${ApiConfig.PRODUCTS}/${productId}`, payload);
  return response.data;
};

export const deleteProduct = async (productId: number) => {
  const response = await axios.post(`${ApiConfig.PRODUCTS}/${productId}/delete`);
  return response.data;
};

