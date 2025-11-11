import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';

function DeleteBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:9999/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:9999/books/${id}`);
      alert(`Book "${book.title}" deleted successfully!`);
      navigate('/seller/manage-book');
    } catch (err) {
      console.error(err);
      alert('Failed to delete book.');
    }
  };

  if (!book) {
    return (
      <DashboardLayout>
        <h2>Book not found</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h2>Delete Book</h2>
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{book.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{book.author}</Card.Subtitle>
            <Card.Text>
              <strong>Price:</strong> {book.price}
            </Card.Text>
            <p>Are you sure you want to delete this book?</p>
            <Button variant="danger" onClick={handleDelete}>
              Yes, Delete
            </Button>
            <Button variant="secondary" onClick={() => navigate('/seller/manage-book')} className="ms-2">
              Cancel
            </Button>
          </Card.Body>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DeleteBook;
