import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get('/database.json');
        const book = response.data.books.find((b) => b.id === id);
        if (book) {
          setTitle(book.title);
          setAuthor(book.author);
          setPrice(book.price);
          setDescription(book.description);
        }
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBook = {
      id: id,
      title,
      author,
      price,
      description,
    };

    try {
      // This is a mock update. In a real application, you would make a PUT request to your API endpoint.
      console.log('Updated book data:', updatedBook);
      alert(`Book with ID ${id} updated successfully!`);
      navigate('/saler/manage-book');
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book.');
    }
  };

  return (
    <DashboardLayout>
      <h2>Edit Book</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBookTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBookAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter book author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBookPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter book price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBookDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter book description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </DashboardLayout>
  );
}

export default EditBook;
