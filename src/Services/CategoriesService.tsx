// src/services/productService.ts
import axios from "axios";
import ApiConfig from "../Configs/ApiConfig";

export const getCategories = async () => {
  const response = await axios.get(ApiConfig.CATEGORIES);
  return response.data;
};
