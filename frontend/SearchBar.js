import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setBooks }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/books/search/${query}`);
      setBooks(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
