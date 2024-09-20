import React, { useState } from "react";

const ProductSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    // Call the onSearch function passed from the parent (App.js)
    onSearch(searchTerm);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update the local searchTerm state
          placeholder="Search products..."
          className="px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-400 focus:outline-none"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default ProductSearch;
