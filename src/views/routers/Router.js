import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home"; 
import AdminDashboard from "../pages/Admin/AdminDasboard"; 
import SalerDashboard from "../pages/SalerDashboard"; 
import Login from "../pages/Login"; 
import Register from "../pages/Register"; 
import ManageAccount from "../pages/Admin/ManageAccount"; 
import AdminProfile from "../pages/Admin/AdminProfile"; 
import SellerRequests from "../pages/Admin/SellerRequest"; 
import CreateVoucher from "../pages/Admin/CreateVoucherByAdmin"; 
import CategoryAdmin from "../pages/Admin/CategoryAdmin"; 
import ManageBlog from "../pages/Admin/ManageBlog"; 
import AddBlog from "../pages/Admin/AddBlog";
import EditBlog from "../pages/Admin/EditBlog";
import OrderList from "../pages/Admin/OrderList";
import OrderDetail from "../pages/Admin/OrderDetail";
function Router() {
  return (
    <div>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manageAccount" element={<ManageAccount />} /> 
        <Route path="/saler" element={<SalerDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminProfile" element={<AdminProfile />} />
        <Route path="/sellerRequests" element={<SellerRequests />} />
        <Route path="/createVoucher-admin" element={<CreateVoucher />} />
        <Route path="/category-admin" element={<CategoryAdmin />} />
        <Route path="/manage-blog-admin" element={<ManageBlog />} />
        <Route path="/manage-blog-admin/add" element={<AddBlog />} />
        <Route path="/manage-blog-admin/edit/:id" element={<EditBlog />} />
  <Route path="/orders" element=[<ordert ist />} />
<Route path="/orders/:id" element=(<OrderDetail /> />
      </Routes>
    </div>
  );
}

export default Router;
