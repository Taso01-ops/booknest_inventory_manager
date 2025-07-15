import React, { useState } from 'react';
import BookList from './BookList';
import SearchBar from './SearchBar';

const App = () => {
  const [books, setBooks] = useState([]);

  return (
    <div>
      <h1>Book Inventory</h1>
      <SearchBar setBooks={setBooks} />
      <BookList books={books} setBooks={setBooks} />
    </div>
  );
};

export default App;
