import React, { useState } from 'react';
import BookList from './BookList';
import SearchBar from './SearchBar';
import DeleteButton from './DeleteButton';
import AddBook from './AddBook';
import UpdateBook from './UpdateBook';


const fetchBooks = async () => {
  try {
    const res = await axios.get('http://localhost:3001/books');
    setBooks(res.data);
  } catch (err) {
    console.error('Failed to fetch books', err);
  }
};

useEffect(() => {
  fetchBooks();
}, []);

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

<SearchBar setBooks={setBooks} />
<BookList books={books} setBooks={setBooks} />
<AddBook onSuccess={fetchBooks} />

export default App;
