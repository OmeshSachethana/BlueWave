import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Place an order
export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/api/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error.response ? error.response.data : new Error('Error placing order');
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response ? error.response.data : new Error('Error fetching orders');
  }
};

// Get a single order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error.response ? error.response.data : new Error('Error fetching order');
  }
};

// Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/orders/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error.response ? error.response.data : new Error('Error deleting order');
  }
};

// Update delivery status
export const updateDeliveryStatus = async (orderId, deliveryStatus) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/${orderId}/delivery`, { deliveryStatus }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating delivery status:', error);
    throw error.response ? error.response.data : new Error('Error updating delivery status');
  }
};

// Update approval status
export const updateApprovalStatus = async (orderId, approvalStatus) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/${orderId}/approve`, { approvalStatus }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating approval status:', error);
    throw error.response ? error.response.data : new Error('Error updating approval status');
  }
};
