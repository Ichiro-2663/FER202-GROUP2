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

    // Step 1: Check email
    const handleCheckEmail = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:9999/users?email=${email}`);
            const users = await res.json();

            if (users.length === 0) {
                setError("❌ No account found with this email!");
            } else {
                setFoundUser(users[0]);
                setMessage("✅ Account found, please enter new password!");
            }
        } catch (err) {
            console.error(err);
            setError("⚠️ Cannot connect to server!");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Update password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!newPassword || !confirmPassword) {
            setError("Please enter complete password!");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("❌ Password confirmation does not match!");
            return;
        }

        try {
            const updatedUser = {
                ...foundUser,
                password: newPassword,   // overwrite old password
                passwordHash: "",         // remove hash if exists
            };

            await fetch(`http://localhost:9999/users/${foundUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });

            setMessage("✅ Password updated successfully! Returning to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.error(err);
            setError("⚠️ Cannot update password!");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3 className="text-center mb-4">🔐 Forgot Password</h3>

            {!foundUser ? (
                <form onSubmit={handleCheckEmail}>
                    <div className="mb-3">
                        <label className="form-label">Registered Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email..."
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
                        {loading ? "Checking..." : "Continue"}
                    </button>

                    <p className="text-center mt-3">
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => navigate("/login")}
                            style={{ color: "#007bff", textDecoration: "none", border: "none", background: "none" }}
                        >
                            Back to login
                        </button>
                    </p>
                </form>
            ) : (
                <form onSubmit={handleChangePassword}>
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter new password..."
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Re-enter password..."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {message && <div className="alert alert-success">{message}</div>}

                    <button type="submit" className="btn btn-success w-100">
                        Change Password
                    </button>
                </form>
            )}
        </div>
    );
}

export default ForgotPassword;
