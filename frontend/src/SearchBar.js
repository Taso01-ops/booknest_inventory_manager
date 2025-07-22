import React, { useState } from 'react';
import API from './api';

const SearchBar = ({ setBooks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = async () => {
    if (!searchTerm && !minPrice && !maxPrice) {
      alert("Please enter a title or price range to search.");
      return;
    }

    try {
      const params = {
        ...(searchTerm && { title: searchTerm }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      };

      const response = await API.get('/books/search', { params });
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search by title"
      />
      <input
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min Price"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max Price"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;

