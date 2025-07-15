import React, { useState } from 'react';
import BookList from './BookList';
import SearchBar from './SearchBar';
import DeleteButton from './DeleteButton';
import AddBook from './AddBook';
import UpdateBook from './UpdateBook';

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
