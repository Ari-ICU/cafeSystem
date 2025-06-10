// Configs/ApiConfig.ts
const BASE_URL = "http://127.0.0.1:8000/api";


const ApiConfig = {
  BASE: BASE_URL,
  PRODUCTS: `${BASE_URL}/products`,
  CATEGORIES: `${BASE_URL}/categories`,
  LOGIN: `${BASE_URL}/login`,
  LOGOUT: `${BASE_URL}/logout`,
  RELOAD_CAPTCHA: `${BASE_URL}/captcha`, 
  CHECK_AUTH: `${BASE_URL}/me`,
  REFRESH_TOKEN: `${BASE_URL}/refresh`,

};

export default ApiConfig;
