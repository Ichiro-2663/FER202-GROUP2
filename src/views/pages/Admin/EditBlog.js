import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: '',
    visible: true,
  });

  const [loading, setLoading] = useState(true);

  // Fetch blog post by ID
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/blogPosts/${id}`);
        const post = res.data;
        setFormData({
          title: post.title || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featuredImage: post.featuredImage || '',
          category: post.category || '',
          tags: post.tags ? post.tags.join(', ') : '',
          visible: post.visible ?? true,
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        window.alert('❌ Không tìm thấy bài viết!');
        navigate('/manage-blog-admin');
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, featuredImage: reader.result }));
      };
      reader.readAsDataURL(files[0]); // base64
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      authorId: 'u_admin',
      visible: Boolean(formData.visible),
    };

    try {
      await axios.put(`http://localhost:9999/blogPosts/${id}`, payload);
      window.alert('✅ Blog updated successfull!');
      navigate('/manage-blog-admin');
    } catch (err) {
      console.error(err);
      window.alert('❌ Error updating blog!');
    }
  };

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <Col md={10}>
        <h3 className="mt-4 mb-4">✏️ Edit Blog Post</h3>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" value={formData.title} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Excerpt</Form.Label>
                <Form.Control name="excerpt" value={formData.excerpt} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>HTML Content</Form.Label>
                <Form.Control as="textarea" rows={4} name="content" value={formData.content} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control name="category" value={formData.category} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tags (comma separated)</Form.Label>
                <Form.Control name="tags" value={formData.tags} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="Visible" name="visible" checked={formData.visible} onChange={handleChange} />
              </Form.Group>
              <Button type="submit">Update</Button>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Featured Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleChange} />
                {formData.featuredImage && (
                  <div className="mt-3">
                    <Image src={formData.featuredImage} thumbnail style={{ width: '120px' }} />
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Col>
    </DashboardLayout>
  );
}
