import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setBooks }) => {
  const [searchTerm, setSearchTerm] = useState('');

const handleSearch = async () => {
  try {
    const response = await axios.get('http://localhost:3001/books/search', {
      params: { title: searchTerm }
    });
    console.log("Search Results:", response.data); //Log to detect issues
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
