import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Fetch all subscription plans
export const getPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/subscriptionPlans`);
    return response.data; // Return the plans data
  } catch (error) {
    console.error("Error fetching subscription plans", error);
    throw error; // Re-throw error for handling by the caller
  }
};
