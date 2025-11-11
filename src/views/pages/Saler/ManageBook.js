import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { fetchBooksFromServer } from '../../../services/api';

function ManageBook() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooksFromServer()
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div>
        <h2>Manage Books</h2>
        <Link to="/seller/add-book">
          <Button variant="primary" className="mb-3">
            Add Book
          </Button>
        </Link>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.price}</td>
                <td>
                  <Link to={`/seller/edit-book/${book.id}`}>
                    <Button variant="warning" className="me-2">
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/seller/delete-book/${book.id}`}>
                    <Button variant="danger">
                      Delete
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </DashboardLayout>
  );
}

export default ManageBook;
