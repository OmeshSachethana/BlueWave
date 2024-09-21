import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get a product by ID
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Search products based on query parameters
export const searchProducts = async (searchParams) => {
  try {
    const queryString = new URLSearchParams(searchParams).toString(); // Convert search params to query string
    const response = await axios.get(`${API_URL}/api/products/search?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
