import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    event: '',
    by: '',
    meta: '',
  });
 const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("You don't have permission to access this page!");
      navigate("/"); // quay lại trang chủ
    }
  }, [navigate]);
  useEffect(() => {
    axios.get(`http://localhost:9999/orders/${id}`).then(res => setOrder(res.data));
    axios.get(`http://localhost:9999/orderEvents?orderId=${id}`).then(res => setEvents(res.data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const payload = {
      id: Math.random().toString(36).substring(2, 6),
      orderId: parseInt(id),
      event: newEvent.event,
      by: newEvent.by,
      meta: newEvent.meta ? { transactionId: newEvent.meta } : {},
      createdAt: new Date().toISOString(),
    };
    await axios.post('http://localhost:9999/orderEvents', payload);
    setEvents(prev => [...prev, payload]);
    setNewEvent({ event: '', by: '', meta: '' });
  };

  if (!order) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <h3> Order Detail for #{order.id}</h3>
      <Card className="mb-4">
        <Card.Body>
          <p><strong>User:</strong> {order.user?.username}</p>
          <p><strong>Email:</strong> {order.user?.email}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Total money:</strong> {order.total.toLocaleString()}₫</p>
        </Card.Body>
      </Card>

      <h5> Order Event</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Time</th>
            <th>Event</th>
            <th>Create by</th>
            <th>Meta</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td>{new Date(ev.createdAt).toLocaleString()}</td>
              <td>{ev.event}</td>
              <td>{ev.by}</td>
              <td>{ev.meta?.transactionId || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h5 className="mt-4"> Add new Order Event</h5>
      <Form onSubmit={handleAddEvent}>
        <Form.Group className="mb-2">
          <Form.Label>Event</Form.Label>
          <Form.Control name="event" value={newEvent.event} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Created by</Form.Label>
          <Form.Control name="by" value={newEvent.by} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Transaction ID </Form.Label>
          <Form.Control name="meta" value={newEvent.meta} onChange={handleChange} />
        </Form.Group>
        <Button type="submit">Add Event</Button>
      </Form>
    </DashboardLayout>
  );
}
