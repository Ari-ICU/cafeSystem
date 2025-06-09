import axios from "axios";
import ApiConfig from "../Configs/ApiConfig";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
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
      const data = response.data as any;
      return data.data || data;
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      throw new Error(
        error.response?.data?.message || "Category endpoint not found. Please check the API URL."
      );
    }
    
  },
  // GET /categories/:id
  getCategory: async (categoryId: number) => {
    try {
      const response = await axios.get(
        `${ApiConfig.CATEGORIES}/${categoryId}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = response.data as any;
      return data.data || data;
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      throw new Error(
        error.response?.data?.message || "Category endpoint not found. Please check the API URL."
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
      const data = response.data as any;
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
      const data = response.data as any;
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
      const response = await axios.post(
        `${ApiConfig.CATEGORIES}/${categoryId}/delete`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = response.data as any;
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
