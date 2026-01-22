import React from 'react';

const PriceFilter = ({ minPrice, setMinPrice, maxPrice, setMaxPrice }) => {
  return (
    <div className="filter-section">
      <h3>Price Range</h3>
      <div className="price-inputs">
        <div className="price-input">
          <label htmlFor="min-price">Min Price ($)</label>
          <input
            id="min-price"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="price-input">
          <label htmlFor="max-price">Max Price ($)</label>
          <input
            id="max-price"
            type="number"
            placeholder="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;