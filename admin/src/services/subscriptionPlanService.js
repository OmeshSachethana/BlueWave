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

// Add a new subscription plan
export const addPlan = async (planData) => {
  try {
    const response = await axios.post(`${API_URL}/api/subscriptionPlans`, planData);
    return response.data; // Return the newly created plan
  } catch (error) {
    console.error("Error adding subscription plan", error);
    throw error; // Re-throw error for handling by the caller
  }
};

// Update an existing subscription plan
export const updatePlan = async (planId, planData) => {
  try {
    const response = await axios.put(`${API_URL}/api/subscriptionPlans/${planId}`, planData);
    return response.data; // Return the updated plan
  } catch (error) {
    console.error("Error updating subscription plan", error);
    throw error; // Re-throw error for handling by the caller
  }
};

// Delete a subscription plan
export const deletePlan = async (planId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/subscriptionPlans/${planId}`);
    return response.data; // Return a success message or the deleted plan
  } catch (error) {
    console.error("Error deleting subscription plan", error);
    throw error; // Re-throw error for handling by the caller
  }
};
