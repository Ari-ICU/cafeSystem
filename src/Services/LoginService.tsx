import axios from "axios";
import ApiConfig from "../Configs/ApiConfig";

// Store token in memory
let authToken: string | null = null;

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

      // Store token in memory
      authToken = token;

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
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Clear token from memory
      authToken = null;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

 async isAuthenticated(): Promise<boolean> {
    try {
      if (!authToken) {
        console.log("No auth token available");
        return false;
      }

      const response = await axios.get(ApiConfig.CHECK_AUTH, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = response.data as { data: { user?: any } | any };
      return !!data.data.user || !!data.data; // Flexible for different response structures
    } catch (error: any) {
      console.error("Check auth error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        try {
          await refreshToken();
          // Retry the auth check
          const response = await axios.get(ApiConfig.CHECK_AUTH, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
          const data = response.data as { data: { user?: any } | any };
          return !!data.data.user || !!data.data;
        } catch (refreshError) {
          console.error("Refresh token failed during auth check:", refreshError);
          return false;
        }
      }

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
    if (authToken) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default LoginService;