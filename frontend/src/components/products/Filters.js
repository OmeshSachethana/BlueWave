const Filters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className="w-64 p-4 bg-white border rounded-lg shadow">
      <h4 className="text-xl font-bold mb-4">Filters</h4>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Price Range</label>
        <input
          type="range"
          min="0"
          max="10000"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full"
        />
        <p className="text-gray-700 mt-2">Up to Rs. {priceRange}</p>
      </div>

      {/* Add more filters here as needed */}
    </div>
  );
};

export default Filters;
