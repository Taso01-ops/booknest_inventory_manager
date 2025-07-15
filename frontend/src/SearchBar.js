import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => {
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);  // Call the handleSearch function passed down from the parent
  };

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={handleInputChange} 
        placeholder="Search by book title..." 
      />
    </div>
  );
};

export default SearchBar;
