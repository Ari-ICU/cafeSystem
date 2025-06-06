// src/services/productService.ts
import axios from "axios";
import ApiConfig from "../Configs/ApiConfig";

export const getCategories = async () => {
  const response = await axios.get(ApiConfig.CATEGORIES);
  return response.data;
};

export const addCategory = async (payload: FormData) =>{
  const response = await axios.post(ApiConfig.CATEGORIES, payload)
  return response;
}

export const updateCategory = async (categoryId: number, payload: FormData) => {
  const response = await axios.post(`${ApiConfig.CATEGORIES}/${categoryId}`, payload);
  return response.data;
};

export const deleteCategory = async (categoryId: number) => {
  const response = await axios.post(`${ApiConfig.CATEGORIES}/${categoryId}/delete`);
  return response.data;
};
