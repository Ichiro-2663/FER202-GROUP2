import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import DashboardLayout from '../../components/DashboardLayout';

const API_URL = 'http://localhost:9999/blogPosts';

export default function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("You don't have permission to access this page!");
      navigate("/"); // quay lại trang chủ
    }
  }, [navigate]);
  useEffect(() => {
    axios.get(API_URL).then((res) => setPosts(res.data)).catch(console.error);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Do you want to delete this blog post?')) {
      axios.delete(`${API_URL}/${id}`)
        .then(() => {
          window.alert('✅ Delete successful!');
          window.location.reload();
        })
        .catch(() => window.alert('❌ Error deleting blog post.'));
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      {/* <Col md={10}> */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <h3>📚 Quản lý Blog</h3>
          <Button variant="primary" onClick={() => navigate('/admin/manage-blog-admin/add')}>Add new Blog</Button>
        </div>

        <Row>
          {posts.map((post) => (
            <Col md={4} key={post.id} className="mb-4">
              <Card>
                <Card.Img variant="top" src={post.featuredImage} />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.excerpt}</Card.Text>
                  <Card.Text><strong>Category:</strong> {post.category}</Card.Text>
                  <Card.Text><strong>Tags:</strong> {post.tags.join(', ')}</Card.Text>
                  <Button variant="warning" size="sm" onClick={() => navigate(`/admin/manage-blog-admin/edit/${post.id}`)}>Edit</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      {/* </Col> */}
    </DashboardLayout>
  );
}
