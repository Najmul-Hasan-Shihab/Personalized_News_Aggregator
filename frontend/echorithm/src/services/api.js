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

// === Reading History & Recommendations APIs ===
export const trackArticleView = async (articleData) => {
  try {
    const response = await apiClient.post("/articles/track/", {
      article_url: articleData.url,
      article_title: articleData.title,
      category: articleData.category,
      reading_time: articleData.reading_time || 0,
    });
    return response.data;
  } catch (error) {
    console.error("Error tracking article view:", error);
    // Don't throw error - tracking failures shouldn't break UX
    return null;
  }
};

export const fetchPersonalizedRecommendations = async (limit = 50) => {
  try {
    const response = await apiClient.get(`/articles/personalized/?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    throw error;
  }
};

export const fetchReadingHistory = async (limit = 50) => {
  try {
    const response = await apiClient.get(`/reading-history/?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reading history:", error);
    throw error;
  }
};

// === Search APIs ===
export const searchArticles = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams({ q: query });
    
    if (filters.category) params.append('category', filters.category);
    if (filters.sentiment) params.append('sentiment', filters.sentiment);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/articles/search/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error searching articles:", error);
    throw error;
  }
};

export const trackSearchQuery = async (query, resultsCount) => {
  try {
    const response = await apiClient.post("/search/track/", {
      query,
      results_count: resultsCount
    });
    return response.data;
  } catch (error) {
    console.error("Error tracking search query:", error);
    // Don't throw - tracking is non-critical
    return null;
  }
};

export const fetchSearchSuggestions = async (limit = 10) => {
  try {
    const response = await apiClient.get(`/search/suggestions/?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return { recent_searches: [], popular_searches: [] };
  }
};

export default apiClient;
