import axios from "axios";
import ApiConfig from "../Configs/ApiConfig";

// In-memory token (shared with LoginService)
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

const CategoriesService = {
  // GET /categories
  getCategories: async () => {
    try {
      const response = await axios.get(ApiConfig.CATEGORIES, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = response.data as { data?: any };
      return data.data || data;
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories. Please check the API URL."
      );
    }
  },

  // GET /categories/:id
  getCategory: async (categoryId: number) => {
    try {
      const response = await axios.get(`${ApiConfig.CATEGORIES}/${categoryId}`, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = response.data as { data?: any };
      return data.data || data;
    } catch (error: any) {
      console.error("Error fetching category:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch category. Please check the API URL."
      );
    }
  },

  // POST /categories
  addCategory: async (payload: FormData) => {
    try {
      const response = await axios.post(ApiConfig.CATEGORIES, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      const data = response.data as { data?: any };
      return data.data || data;
    } catch (error: any) {
      console.error("Error adding category:", error);
      throw new Error(
        error.response?.data?.message || "Failed to add category."
      );
    }
  },

  // PUT /categories/:id
  updateCategory: async (categoryId: number, payload: FormData) => {
    try {
      const response = await axios.post(
        `${ApiConfig.CATEGORIES}/${categoryId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      const data = response.data as { data?: any };
      return data.data || data;
    } catch (error: any) {
      console.error("Error updating category:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update category."
      );
    }
  },

  // DELETE /categories/:id
  deleteCategory: async (categoryId: number) => {
    try {
      const response = await axios.post(`${ApiConfig.CATEGORIES}/${categoryId}/delete`, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = response.data as { data?: any };
      return data.data || data;
    } catch (error: any) {
      console.error("Error deleting category:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete category."
      );
    }
  },
};

export default CategoriesService;