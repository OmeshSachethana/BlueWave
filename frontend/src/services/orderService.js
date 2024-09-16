import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const orderService = {
  placeOrder: async (orderData) => {
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
  },
};

export default orderService;
