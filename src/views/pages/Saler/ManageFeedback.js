import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';
import { updateFeedbackOnServer } from '../../../services/api';

function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [booksMap, setBooksMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || currentUser.role !== 'seller') {
      alert("You don't have permission to access this page!");
      window.location.href = '/';
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        // Load from public database.json
        const db = await axios.get('/database.json');
        const books = db.data.books || [];
        const fb = db.data.feedbacks || [];

        // Build map for bookId -> title
        const map = {};
        books.forEach((b) => {
          map[b.id] = b.title;
        });
        setBooksMap(map);

        // For now, show all feedbacks present in database.json
        setFeedbacks(fb);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleToggleVisibility = async (fb) => {
    try {
      const nextHidden = !Boolean(fb.hidden);
      await updateFeedbackOnServer(fb.id, { hidden: nextHidden });
      setFeedbacks((prev) =>
        prev.map((x) => (x.id === fb.id ? { ...x, hidden: nextHidden } : x))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update feedback visibility.');
    }
  };

  const rows = useMemo(() => {
    return feedbacks
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [feedbacks]);

  return (
    <DashboardLayout>
      <h2 className="mb-3">Manage Feedback</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Book</th>
              <th>User</th>
              <th>Rate</th>
              <th>Comment</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f, idx) => (
              <tr key={f.id}>
                <td>{idx + 1}</td>
                <td>{booksMap[f.bookId] || f.bookId}</td>
                <td>{f.userName || f.userId}</td>
                <td>{f.rate}</td>
                <td style={{ maxWidth: 400, whiteSpace: 'pre-wrap' }}>{f.comment}</td>
                <td>
                  {f.hidden ? (
                    <Badge bg="secondary">Hidden</Badge>
                  ) : (
                    <Badge bg="success">Visible</Badge>
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant={f.hidden ? 'success' : 'warning'}
                    onClick={() => handleToggleVisibility(f)}
                  >
                    {f.hidden ? 'Show' : 'Hide'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </DashboardLayout>
  );
}

export default ManageFeedback;


