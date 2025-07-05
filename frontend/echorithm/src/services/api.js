import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const fetchArticles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/articles/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};
