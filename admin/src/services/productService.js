import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/api/products`, productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

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

// Update a product by ID
export const updateProduct = async (productId, productData, selectedFile) => {
  try {
    // If there's a base64 encoded image, add it to productData
    if (selectedFile) {
      productData.image = selectedFile; // Add the base64 image string to productData
    }

    // Send the product data (including image) as JSON
    const response = await axios.put(
      `${API_URL}/api/products/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "application/json", // Content type is now JSON
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
