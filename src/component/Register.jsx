import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: '',   // ✅ Added username field
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    jobRole: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

  const jobRoles = [
    "Java Developer", "Android Developer", "Spring Developer", "SQL Developer", "Frontend Developer",
    "Backend Developer", "Full Stack Developer", "Software Developer", "Data Analyst", "Data Scientist",
    "DevOps Engineer", "Machine Learning Engineer", "UI/UX Designer", "QA Tester", "Network Engineer",
    "System Administrator", "Technical Support", "Cybersecurity Analyst", "Cloud Engineer", "Technical Writer",
    "Project Manager", "Product Manager", "HR Executive", "Recruiter", "Sales Executive", "Marketing Specialist",
    "Business Analyst", "Customer Support", "Content Creator", "Teacher", "Trainer", "Academic Coordinator"
  ];

  const validatePassword = (pwd) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return pattern.test(pwd);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError('');

    try {
      await axios.post('http://localhost:8080/api/register', {
        username: formData.username,  // ✅ Sending username to backend
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        role: formData.role,
        jobRole: formData.jobRole,
      });

      setSuccessMessage("Registration successful!");
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
        jobRole: '',
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create Your Account</h2>

        {error && <p className="error-text">{error}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Job Role</label>
          <select name="jobRole" value={formData.jobRole} onChange={handleChange} required>
            <option value="" disabled>Select a job role</option>
            {jobRoles.map((job, index) => (
              <option key={index} value={job}>{job}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Choose Role</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="" disabled>Select your role</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Register</button>

        <div className="login-link">
          <p>Already registered? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Register;
