import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setBooks }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/books/search/${searchTerm}`);
      setBooks(response.data); // Update the parent component with search results
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
        placeholder="Search by title"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
