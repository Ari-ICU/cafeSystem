import axios from "axios";
import ApiConfig from "../Configs/ApiConfig";

// In-memory token (shared with other services)
let authToken: string | null = null;

// Export setter for LoginService to update token
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Axios interceptor to add Authorization header
axios.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authToken}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ProductService = {
  // GET /products
  getProducts: async () => {
    try {
      const response = await axios.get(ApiConfig.PRODUCTS, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = response.data as { data?: any };
      return { data: Array.isArray(data?.data) ? data.data : data || [] };
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refreshToken();
          // Retry the request
          const response = await axios.get(ApiConfig.PRODUCTS, {
            headers: {
              Accept: "application/json",
            },
          });
          const data = response.data as { data?: any };
          return { data: Array.isArray(data?.data) ? data.data : data || [] };
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          throw new Error("Unauthorized. Please log in again.");
        }
      }
      console.error("Error fetching products:", error);
      throw new Error(
        error.response?.status === 404
          ? "Products endpoint not found. Please check the API URL."
          : error.response?.data?.message || "Failed to load products."
      );
    }
  },

  // GET /products/:id
  getProductById: async (productId: number) => {
    try {
      const response = await axios.get(`${ApiConfig.PRODUCTS}/${productId}`, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = response.data as { data?: any };
      return { data: data.data || data };
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refreshToken();
          // Retry the request
          const response = await axios.get(`${ApiConfig.PRODUCTS}/${productId}`, {
            headers: {
              Accept: "application/json",
            },
          });
          const data = response.data as { data?: any };
          return { data: data.data || data };
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          throw new Error("Unauthorized. Please log in again.");
        }
      }
      console.error(`Error fetching product ${productId}:`, error);
      throw new Error(
        error.response?.status === 404
          ? `Product with ID ${productId} not found.`
          : error.response?.data?.message || "Failed to load product."
      );
    }
  },

  // POST /products
  addProduct: async (payload: FormData) => {
    try {
      const response = await axios.post(ApiConfig.PRODUCTS, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      const data = response.data as { data?: any };
      return { data: data.data || data };
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refreshToken();
          // Retry the request
          const response = await axios.post(ApiConfig.PRODUCTS, payload, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          });
          const data = response.data as { data?: any };
          return { data: data.data || data };
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          throw new Error("Unauthorized. Please log in again.");
        }
      }
      console.error("Error adding product:", error);
      throw new Error(
        error.response?.data?.message || "Failed to add product."
      );
    }
  },

  // PUT /products/:id
  updateProduct: async (productId: number, payload: FormData) => {
    try {
      const response = await axios.post(`${ApiConfig.PRODUCTS}/${productId}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      const data = response.data as { data?: any };
      return { data: data.data || data };
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refreshToken();
          // Retry the request
          const response = await axios.post(`${ApiConfig.PRODUCTS}/${productId}`, payload, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          });
          const data = response.data as { data?: any };
          return { data: data.data || data };
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          throw new Error("Unauthorized. Please log in again.");
        }
      }
      console.error("Error updating product:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update product."
      );
    }
  },

  // DELETE /products/:id
  deleteProduct: async (productId: number) => {
    try {
      const response = await axios.post(`${ApiConfig.PRODUCTS}/${productId}/delete`, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = response.data as { data?: any };
      return { data: data.data || data };
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refreshToken();
          // Retry the request
          const response = await axios.delete(`${ApiConfig.PRODUCTS}/${productId}`, {
            headers: {
              Accept: "application/json",
            },
          });
          const data = response.data as { data?: any };
          return { data: data.data || data };
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          throw new Error("Unauthorized. Please log in again.");
        }
      }
      console.error("Error deleting product:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete product."
      );
    }
  },
};

// Token refresh function
const refreshToken = async () => {
  try {
    const response = await axios.post(ApiConfig.REFRESH_TOKEN, {}, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const newToken = response.data.data.token;
    setAuthToken(newToken);
    return newToken;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

export default ProductService;