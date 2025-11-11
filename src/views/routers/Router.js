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
import ForgotPassword from "../pages/ForgotPassword";
import ProductList from "../pages/ProductList";
import ProductDetail from "../pages/ProductDetail";
import ManageBook from "../pages/Saler/ManageBook";
import AddBook from "../pages/Saler/AddBook";
import EditBook from "../pages/Saler/EditBook";
import DeleteBook from "../pages/Saler/DeleteBook";
import ManageFeedback from "../pages/Saler/ManageFeedback";

function Router() {
  return (
    <div>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:categoryName" element={<ProductList />} />
        <Route path="/seller" element={<SalerDashboard />} />
        <Route path="/login" element={<Login />} />
         <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        {/* Seller routes */}
        <Route path="/seller/manage-book" element={<ManageBook />} />
        <Route path="/seller/add-book" element={<AddBook />} />
        <Route path="/seller/edit-book/:id" element={<EditBook />} />
        <Route path="/seller/delete-book/:id" element={<DeleteBook />} />
        <Route path="/seller/manage-feedback" element={<ManageFeedback />} />
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/manageAccount" element={<ManageAccount />} /> 
        <Route path="/admin/adminProfile" element={<AdminProfile />} />
        <Route path="/admin/sellerRequests" element={<SellerRequests />} />
        <Route path="/admin/createVoucher-admin" element={<CreateVoucher />} />
        <Route path="/admin/category-admin" element={<CategoryAdmin />} />
        <Route path="/admin/manage-blog-admin" element={<ManageBlog />} />
        <Route path="/admin/manage-blog-admin/add" element={<AddBlog />} />
        <Route path="/admin/manage-blog-admin/edit/:id" element={<EditBlog />} />
        <Route path="/admin/orders" element={<OrderList />} />
        <Route path="/admin/orders/:id" element={<OrderDetail />} />
      </Routes>
    </div>
  );
}

export default Router;