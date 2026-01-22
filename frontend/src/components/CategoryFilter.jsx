import React from 'react';

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['all', 'male', 'female'];

  return (
    <div className="filter-section">
      <h3>Gender</h3>
      <div className="filter-group">
        {categories.map((category) => (
          <div key={category} className="filter-option">
            <input
              type="radio"
              id={`category-${category}`}
              name="category"
              value={category}
              checked={selectedCategory === category}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            <label htmlFor={`category-${category}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;