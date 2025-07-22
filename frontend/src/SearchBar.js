import React, { useState } from 'react';
import API from './api';

const SearchBar = ({ setBooks }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const response = await API.get(`/books/search/${searchTerm}`);
      console.log("Search Results:", response.data);
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
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
