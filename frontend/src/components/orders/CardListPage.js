import React, { useEffect, useState } from "react";
import axios from "axios";

const CardListPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/payments`);
        setCards(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching cards: {error}</p>;

  return (
    <div className="bg-white dark:bg-gray-900 py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Saved Cards
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card._id} className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                {card.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Card Number: **** **** **** {card.cardNumber.slice(-4)}
              </p>
              <p className="text-gray-700 dark:text-gray-400">
                Expiry: {card.expiryDate}
              </p>
              <p className="text-gray-700 dark:text-gray-400">
                Card Type: {card.type}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardListPage;
