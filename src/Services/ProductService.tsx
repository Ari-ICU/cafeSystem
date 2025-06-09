import axios from "axios";
import ApiConfig from "../Configs/ApiConfig";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.warn("No auth token found. Please log in.");
    }
    config.headers = {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

const ProductService = {
  getProducts: async () => {
    try {
      const response = await axios.get(ApiConfig.PRODUCTS, {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      });
      const data = response.data as any;
      return { data: Array.isArray(data?.data) ? data.data : data || [] };
    } catch (error: any) {
      console.error("Error fetching products:", error);
      throw new Error(
        error.response?.status === 401
          ? "Unauthorized. Please log in again."
          : error.response?.status === 404
          ? "Products endpoint not found. Please check the API URL."
          : error.response?.data?.message || "Failed to load products."
      );
    }
  },

  getProductById: async (productId: number) => {
    try {
      const response = await axios.get(`${ApiConfig.PRODUCTS}/${productId}`, {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      });
      const data = response.data as any;
      return { data: data.data || data };
    } catch (error: any) {
      console.error(`Error fetching product ${productId}:`, error);
      throw new Error(
        error.response?.status === 401
          ? "Unauthorized. Please log in again."
          : error.response?.status === 404
          ? `Product with ID ${productId} not found.`
          : error.response?.data?.message || "Failed to load product."
      );
    }
  },

  addProduct: async (payload: FormData) => {
    try {
      const response = await axios.post(ApiConfig.PRODUCTS, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        withCredentials: true,
      });
      const data = response.data as any;
      return { data: data.data || data };
    } catch (error: any) {
      console.error("Error adding product:", error);
      throw new Error(
        error.response?.data?.message || "Failed to add product."
      );
    }
  },

  updateProduct: async (productId: number, payload: FormData) => {
    try {
      const response = await axios.post(
        `${ApiConfig.PRODUCTS}/${productId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      const data = response.data as any;
      return { data: data.data || data };
    } catch (error: any) {
      console.error("Error updating product:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update product."
      );
    }
  },

  deleteProduct: async (productId: number) => {
    try {
      const response = await axios.post(
        `${ApiConfig.PRODUCTS}/${productId}/delete`,
        {},
        {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      const data = response.data as any;
      return { data: data.data || data };
    } catch (error: any) {
      console.error("Error deleting product:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete product."
      );
    }
  },
};

export default ProductService;