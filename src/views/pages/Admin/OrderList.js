import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import Sidebar from '../../components/Sidebar';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("You don't have permission to access this page!");
      navigate("/"); // return to home page
    }
  }, [navigate]);
  useEffect(() => {
    axios.get('http://localhost:9999/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <DashboardLayout sidebar={<Sidebar />} className="p-4">
      <h3> List of order</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.username}</td>
              <td>{order.total.toLocaleString()}₫</td>
              <td>{order.address}</td>
              <td>
                <Button variant="info" onClick={() => navigate(`/admin/orders/${order.id}`)}>Detail</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
