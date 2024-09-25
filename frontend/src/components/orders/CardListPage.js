import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments, updatePayment, deletePayment } from "../../features/payment/paymentSlice";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate for redirection

const CardListPage = () => {
  const location = useLocation();
  const { orderId, orderAmount } = location.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate(); // To handle redirection
  const { payments, loading, error } = useSelector((state) => state.payment);
  const [editingCard, setEditingCard] = useState(null); // Track which card is being edited
  const [cardData, setCardData] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    type: "",
    cvv: "",
  });

  useEffect(() => {
    dispatch(fetchPayments()); // Fetch cards from the backend
  }, [dispatch]);

  const handleEditClick = (card) => {
    setEditingCard(card._id); // Set the current card being edited
    setCardData({
      name: card.name,
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      type: card.type,
      cvv: card.cvv,
    });
  };

  const handleCancelEdit = () => {
    setEditingCard(null); // Cancel editing
    setCardData({
      name: "",
      cardNumber: "",
      expiryDate: "",
      type: "",
      cvv: "",
    });
  };

  const handleDeleteClick = (cardId) => {
    dispatch(deletePayment(cardId)).then(() => {
      dispatch(fetchPayments()); // Fetch the latest payments after delete
    });
  };

  const handleSaveEdit = (cardId) => {
    const updatedCardData = {
      id: cardId,
      name: cardData.name,
      cardNumber: cardData.cardNumber,
      expiryDate: cardData.expiryDate,
      type: cardData.type,
      cvv: cardData.cvv,
    };
    dispatch(updatePayment(updatedCardData))
      .unwrap()
      .then(() => {
        dispatch(fetchPayments()); // Fetch the latest payments after update
        setEditingCard(null); // End editing after save
      })
      .catch((error) => {
        console.error("Failed to update card:", error);
        alert("Error updating card. Please try again.");
      });
  };

  const handleSelectCard = (card) => {
    // Navigate to the payment form page and pass the selected card details and order amount
    navigate("/payment", { state: { selectedCard: card, orderAmount, orderId } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching cards: {error}</p>;

  return (
    <> <br/>
    <div className="bg-white dark:bg-gray-900 py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Saved Cards
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {payments.map((card) => (
            <div key={card._id} className="p-6 border rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
              {editingCard === card._id ? (
                <div>
                  {/* Editing Form */}
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Card Number"
                  />
                  <input
                    type="text"
                    value={cardData.expiryDate}
                    onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                    className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Expiry Date"
                  />
                  <input
                    type="text"
                    value={cardData.type}
                    onChange={(e) => setCardData({ ...cardData, type: e.target.value })}
                    className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Card Type"
                  />
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="CVV"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleSaveEdit(card._id)}
                      className="mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Card Details */}
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {card.name}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400">
                    Card Number: {card.cardNumber}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    Expiry: {card.expiryDate}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    Card Type: {card.type}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    CVV: {card.cvv}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEditClick(card)}
                      className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(card._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleSelectCard(card)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
                    >
                      Select
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default CardListPage;
