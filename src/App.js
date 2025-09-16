import { Routes, Route, Link } from "react-router-dom";
import Home from "./views/pages/Home";
import AdminDashboard from "./views/pages/AdminDasboard";
import SalerDashboard from "./views/pages/SalerDashboard";
import Login from "./views/pages/Login";
import Register from "./views/pages/Register";

function App() {
  return (
    <div>
      {/* Menu điều hướng */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/admin">Admin</Link> |{" "}
        <Link to="/saler">Saler</Link> |{" "}
        <Link to="/login">Login</Link>
      </nav>

      {/* Định nghĩa route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/saler" element={<SalerDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
