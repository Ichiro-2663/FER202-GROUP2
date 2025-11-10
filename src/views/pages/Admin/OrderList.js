import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import Sidebar from '../../components/Sidebar';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
      alert("You don't have permission to access this page!");
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          axios.get('http://localhost:9999/orders'),
          axios.get('http://localhost:9999/users'),
        ]);
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const mergedOrders = orders.map((order) => {
    const user = users.find((u) => u.id === order.customerId);
    return {
      ...order,
      userName: user ? user.name : 'Unknown User',
      userEmail: user ? user.email : '',
      userAddress: user?.profile?.address || order.shipping?.address || 'N/A',
    };
  });

  const filteredOrders = mergedOrders.filter((order) =>
    order.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = filteredOrders.sort((a, b) =>
    sortOrder === 'asc' ? a.total - b.total : b.total - a.total
  );

  return (
    <DashboardLayout sidebar={<Sidebar />} className="p-4">
      <h3>📦 List of Orders</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Search by user name..."
          style={{ width: '250px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() =>
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          }
        >
          Sort by Total ({sortOrder === 'asc' ? '↑' : '↓'})
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Email</th>
            <th>Total</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.userName}</td>
              <td>{order.userEmail}</td>
              <td>{order.total.toLocaleString()}₫</td>
              <td>{order.userAddress}</td>
              <td>
                <span
                  className={`badge ${
                    order.status === 'confirmed'
                      ? 'bg-success'
                      : 'bg-warning text-dark'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  Detail
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
