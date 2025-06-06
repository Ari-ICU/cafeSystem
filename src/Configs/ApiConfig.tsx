// src/config/ApiConfig.ts
const BASE_URL = "http://127.0.0.1:8000/api";

const ApiConfig = {
  BASE_URL,


  //product
  PRODUCTS: `${BASE_URL}/products`,

  CATEGORIES: `${BASE_URL}/categories`,
  USERS: `${BASE_URL}/users`,
};

export default ApiConfig;
