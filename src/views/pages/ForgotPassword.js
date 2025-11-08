import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [foundUser, setFoundUser] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    // Bước 1: Kiểm tra email
    const handleCheckEmail = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:9999/users?email=${email}`);
            const users = await res.json();

            if (users.length === 0) {
                setError("❌ Không tìm thấy tài khoản với email này!");
            } else {
                setFoundUser(users[0]);
                setMessage("✅ Tìm thấy tài khoản, vui lòng nhập mật khẩu mới!");
            }
        } catch (err) {
            console.error(err);
            setError("⚠️ Không thể kết nối đến server!");
        } finally {
            setLoading(false);
        }
    };

    // Bước 2: Cập nhật mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ mật khẩu!");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("❌ Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            const updatedUser = {
                ...foundUser,
                password: newPassword,   // ghi đè luôn mật khẩu cũ
                passwordHash: "",         // xóa hash nếu có
            };

            await fetch(`http://localhost:9999/users/${foundUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });

            setMessage("✅ Cập nhật mật khẩu thành công! Đang quay lại đăng nhập...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.error(err);
            setError("⚠️ Không thể cập nhật mật khẩu!");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3 className="text-center mb-4">🔐 Quên mật khẩu</h3>

            {!foundUser ? (
                <form onSubmit={handleCheckEmail}>
                    <div className="mb-3">
                        <label className="form-label">Email đăng ký</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập email của bạn..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {message && <div className="alert alert-success">{message}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Đang kiểm tra..." : "Tiếp tục"}
                    </button>

                    <p className="text-center mt-3">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/login");
                            }}
                            style={{ color: "#007bff" }}
                        >
                            Quay lại đăng nhập
                        </a>
                    </p>
                </form>
            ) : (
                <form onSubmit={handleChangePassword}>
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu mới</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Nhập mật khẩu mới..."
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Nhập lại mật khẩu..."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {message && <div className="alert alert-success">{message}</div>}

                    <button type="submit" className="btn btn-success w-100">
                        Đổi mật khẩu
                    </button>
                </form>
            )}
        </div>
    );
}

export default ForgotPassword;
