import axios from 'axios';

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
    // Use FormData to handle file uploads
    const formData = new FormData();

    // Append all other product data fields to the FormData
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    // Append the selected file (if any) to FormData
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const response = await axios.put(`${API_URL}/api/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
