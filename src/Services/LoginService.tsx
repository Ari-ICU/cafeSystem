import axios from "axios";
import ApiConfig from "../Configs/ApiConfig";

const LoginService = {
  login: async (payload: {
    email: string;
    password: string;
    captcha: string;
  }) => {
    try {
      const response = await axios.post(ApiConfig.LOGIN, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const { token, user } = (response.data as { data: { token: string; user: any } }).data;

      // Store token in localStorage
      localStorage.setItem("auth_token", token);

      console.log("Login response:", {
        data: response.data,
        headers: response.headers,
      });

      return { user, token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed.";
      const validationErrors = error.response?.data?.errors || {};
      throw { message: errorMessage, errors: validationErrors };
    }
  },

  logout: async () => {
    try {
      await axios.post(
        ApiConfig.LOGOUT,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      // Clear token from localStorage
      localStorage.removeItem("auth_token");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return false;

      const response = await axios.get(ApiConfig.CHECK_AUTH, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data as { data: { user: any } };
      return !!data.data.user;
    } catch (error: any) {
      console.error("Check auth error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return false;
    }
  },

 getCaptcha: async () => {
  try {
    const response = await axios.get(ApiConfig.RELOAD_CAPTCHA, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = response.data as { captcha: string };
    if (!data.captcha) {
      throw new Error("Captcha response is missing the image source string.");
    }
    return data.captcha;
  } catch (error: any) {
    console.error("Captcha load error:", error);
    if (error.response?.status === 500) {
      throw new Error("Server error while loading CAPTCHA. Please try again later.");
    } else if (error.message.includes("Network Error")) {
      throw new Error("Failed to connect to the server. Check your network or server status.");
    }
    throw error;
  }
},
};

// Axios interceptor to add Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default LoginService;