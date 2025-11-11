import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { createBookOnServer, fetchBooksFromServer } from '../../../services/api';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Compute next sequential string id based on existing books in db
      const existing = await fetchBooksFromServer();
      const maxId = existing
        .map(b => parseInt(b.id, 10))
        .filter(n => !Number.isNaN(n))
        .reduce((m, n) => Math.max(m, n), 0);
      const nextId = String(maxId + 1);

      const newBook = {
        id: nextId,
        title,
        author,
        price: Number(price),
        description,
        inStock: true,
        source: "new",
        rating: 0,
        reviews: 0,
        image: image || "",
        category: "**Literature**"
      };
      await createBookOnServer(newBook);
      alert(`Book "${title}" by ${author} added successfully!`);
      navigate('/seller/manage-book');
    } catch (err) {
      console.error(err);
      alert('Failed to add book.');
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h2>Add New Book</h2>
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

          <Form.Group className="mb-3" controlId="formBookImage">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
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
            Add Book
          </Button>
        </Form>
      </div>
    </DashboardLayout>
  );
}

export default AddBook;
