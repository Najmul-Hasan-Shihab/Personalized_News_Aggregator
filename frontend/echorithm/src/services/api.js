import axios from "axios";

// Get base URL from environment variable or use default
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// === Article APIs ===
export const fetchArticles = async () => {
  try {
    const response = await apiClient.get("/articles/");
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const updateArticles = async () => {
  try {
    const response = await apiClient.get("/articles/update/");
    return response.data;
  } catch (error) {
    console.error("Error updating articles:", error);
    throw error;
  }
};

export const fetchFilteredArticles = async () => {
  try {
    const response = await apiClient.get("/articles/filtered/");
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered articles:", error);
    throw error;
  }
};

// === Authentication APIs ===
export const registerUser = async (username, password) => {
  try {
    const response = await apiClient.post("/register/", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post("/login/", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await apiClient.post("/token/refresh/", {
      refresh: refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// === Preferences APIs ===
export const fetchPreferences = async () => {
  try {
    const response = await apiClient.get("/preferences/");
    return response.data;
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw error;
  }
};

export const updatePreferences = async (categories) => {
  try {
    const response = await apiClient.post("/preferences/update/", {
      categories,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
};

export default apiClient;
