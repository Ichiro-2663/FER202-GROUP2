import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

export default function AddBlog() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: '',
    visible: true,
  });

  const [nextId, setNextId] = useState('');
  const [nextProductId, setNextProductId] = useState('');
  const [existingTitles, setExistingTitles] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("You don't have permission to access this page!");
      navigate("/"); // return to home page
    }
  }, [navigate]);
  // Generate next post ID + linkedProductId + fetch titles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:9999/blogPosts');
        const posts = res.data;

        // Next post ID
        const postIds = posts
          .map(p => p.id)
          .filter(id => id.startsWith('post_'))
          .map(id => parseInt(id.replace('post_', '')))
          .sort((a, b) => b - a);
        const nextPostNumber = postIds.length > 0 ? postIds[0] + 1 : 1;
        setNextId(`post_${String(nextPostNumber).padStart(3, '0')}`);

        // Next linked product ID
        const productIds = posts
          .flatMap(p => p.linkedProductIds || [])
          .filter(id => id.startsWith('b_'))
          .map(id => parseInt(id.replace('b_', '')))
          .sort((a, b) => b - a);
        const nextProductNumber = productIds.length > 0 ? productIds[0] + 1 : 1;
        setNextProductId(`b_${String(nextProductNumber).padStart(3, '0')}`);

        // Existing titles
        setExistingTitles(posts.map(p => p.title.trim().toLowerCase()));
      } catch (err) {
        console.error('Failed to fetch blogPosts:', err);
      }
    };
    fetchData();
  }, []);

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

    // Check for duplicate title
    const titleCheck = formData.title.trim().toLowerCase();
    if (existingTitles.includes(titleCheck)) {
      window.alert('❌ Title already exists. Please choose a different one.');
      return;
    }

    const payload = {
      id: nextId,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      linkedProductIds: [nextProductId],
      authorId: 'u_admin',
      visible: Boolean(formData.visible),
    };

    try {
      await axios.post('http://localhost:9999/blogPosts', payload);
      window.alert(`✅ Blog post ${nextId} added successfully!`);
      navigate('/admin/manage-blog-admin');
    } catch (err) {
      console.error(err);
      window.alert('❌ Failed to add blog post!');
    }
  };

  return (
    <DashboardLayout>
      {/* <Col md={5}> */}
        <h3 className="mt-4 mb-4">📝 Add New Blog Post</h3>
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
              <Button type="submit">Add New</Button>
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
      {/* </Col> */}
    </DashboardLayout>
  );
}


// import React, { useState, useEffect } from 'react';
// import { Form, Button, Row, Col, Image } from 'react-bootstrap';
// import axios from 'axios';
// import DashboardLayout from '../../components/DashboardLayout';
// import { useNavigate } from 'react-router-dom';

// export default function AddBlog() {
//   const [formData, setFormData] = useState({
//     title: '',
//     excerpt: '',
//     content: '',
//     featuredImage: '',
//     category: '',
//     tags: '',
//     linkedProductIds: '',
//     visible: true,
//   });

//   const [nextId, setNextId] = useState('');

//   const navigate = useNavigate();
//   // Generate next post ID
//   useEffect(() => {
//     const fetchNextId = async () => {
//       try {
//         const res = await axios.get('http://localhost:9999/blogPosts');
//         const posts = res.data;
//         const ids = posts
//           .map(p => p.id)
//           .filter(id => id.startsWith('post_'))
//           .map(id => parseInt(id.replace('post_', '')))
//           .sort((a, b) => b - a);
//         const nextNumber = ids.length > 0 ? ids[0] + 1 : 1;
//         const formattedId = `post_${String(nextNumber).padStart(3, '0')}`;
//         setNextId(formattedId);
//       } catch (err) {
//         console.error('Failed to fetch next ID:', err);
//       }
//     };
//     fetchNextId();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === 'file' && files[0]) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, featuredImage: reader.result }));
//       };
//       reader.readAsDataURL(files[0]);
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       id: nextId,
//       ...formData,
//       tags: formData.tags.split(',').map(tag => tag.trim()),
//       linkedProductIds: formData.linkedProductIds.split(',').map(id => id.trim()),
//       authorId: 'u_admin',
//       visible: Boolean(formData.visible),
//     };

//     try {
//       await axios.post('http://localhost:9999/blogPosts', payload);
//       window.alert(`✅ Blog post ${nextId} added successfully!`);
//       navigate('/manage-blog-admin');
//     } catch (err) {
//       console.error(err);
//       window.alert('❌ Failed to add blog post!');
//     }
//   };

//   return (
//     <DashboardLayout>
//       <Col md={10}>
//         <h3 className="mt-4 mb-4">📝 Add New Blog Post</h3>
//         <Form onSubmit={handleSubmit}>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Title</Form.Label>
//                 <Form.Control name="title" value={formData.title} onChange={handleChange} required />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Excerpt</Form.Label>
//                 <Form.Control name="excerpt" value={formData.excerpt} onChange={handleChange} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>HTML Content</Form.Label>
//                 <Form.Control as="textarea" rows={4} name="content" value={formData.content} onChange={handleChange} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Category</Form.Label>
//                 <Form.Control name="category" value={formData.category} onChange={handleChange} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Tags (comma separated)</Form.Label>
//                 <Form.Control name="tags" value={formData.tags} onChange={handleChange} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Linked Product IDs</Form.Label>
//                 <Form.Control name="linkedProductIds" value={formData.linkedProductIds} onChange={handleChange} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Check type="checkbox" label="Visible" name="visible" checked={formData.visible} onChange={handleChange} />
//               </Form.Group>
//               <Button type="submit">Add New</Button>
//             </Col>

//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Featured Image</Form.Label>
//                 <Form.Control type="file" accept="image/*" onChange={handleChange} />
//                 {formData.featuredImage && (
//                   <div className="mt-3">
//                     <Image src={formData.featuredImage} thumbnail style={{ width: '120px' }} />
//                   </div>
//                 )}
//               </Form.Group>
//             </Col>
//           </Row>
//         </Form>
//       </Col>
//     </DashboardLayout>
//   );
// }
