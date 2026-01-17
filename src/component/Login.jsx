import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !role) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
        role,
      });

      console.log("✅ Backend login response:", response.data);

      // Extract values
      const userId =
        response.data.userId ||
        response.data.id ||
        response.data.user?.id ||
        null;

      const userRole = response.data.role || response.data.user?.role || role;
      const token = response.data.token || response.data.jwt || null;

      if (!userId) {
        setError("Login failed: userId missing from backend response.");
        return;
      }

      // Build user object
      const userData = {
        userId,
        username: response.data.username || username,
        firstName:
          response.data.firstName || response.data.user?.firstName || "",
        lastName: response.data.lastName || response.data.user?.lastName || "",
        email: response.data.email || response.data.user?.email || "",
        phoneNumber:
          response.data.phoneNumber || response.data.user?.phone || "",
        role: userRole,
        resumeFileName: response.data.resumeFileName || "",
        token: token || "",
      };

      // 🚀 Clear old localStorage keys
      localStorage.clear();

      // 🚀 Save one clean object
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("💾 Saved to localStorage:", userData);

      alert(`Login successful! Role: ${userRole}`);

      // Redirect based on role
      if (userRole === "candidate") {
        navigate("/candidate-dashboard");
      } else if (userRole === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        setError("Unknown role from backend.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again later.");
      }
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.form
        className="login-form"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        onSubmit={handleLogin}
      >
        <motion.h2
          className="form-title"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Login
        </motion.h2>

        {error && <p className="error-msg">{error}</p>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="role-select"
          >
            <option value="">Select Role</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <motion.button
          type="submit"
          className="login-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

export default Login;
