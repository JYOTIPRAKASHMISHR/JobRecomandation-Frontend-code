// RecruiterProfile.jsx
import React, { useState, useEffect } from "react";
import "./RecruiterProfile.css";
import Recruiter from "./Recruiter";
import {
  FaBell,
  FaClipboardList,
  FaUsers,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";

const RecruiterProfile = () => {
  const [username, setUsername] = useState("");

 useEffect(() => {
  // Get recruiter object from localStorage
  const storedUser = localStorage.getItem("user");
  
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      setUsername(userData.username || `${userData.firstName} ${userData.lastName}` || "Recruiter");
    } catch (error) {
      console.error("Error parsing stored user:", error);
      setUsername("Recruiter");
    }
  } else {
    setUsername("Recruiter");
  }
}, []);


  return (
    <div className="recruiter-profile">
      <Recruiter />

      <div className="dashboard-container">
        <aside className="sidebar">
          <h2 className="sidebar-title">Favorite Candidates</h2>
          <ul className="candidate-list">
            <li>
              <span className="avatar">AJ</span>
              <div>
                <p className="candidate-name">Alex Johnson</p>
                <p className="candidate-role">React Developer</p>
              </div>
              <span className="score">95%</span>
            </li>
            <li>
              <span className="avatar">SK</span>
              <div>
                <p className="candidate-name">Sarah Kim</p>
                <p className="candidate-role">UX Designer</p>
              </div>
              <span className="score">92%</span>
            </li>
            <li>
              <span className="avatar">MC</span>
              <div>
                <p className="candidate-name">Mike Chen</p>
                <p className="candidate-role">DevOps Engineer</p>
              </div>
              <span className="score">88%</span>
            </li>
          </ul>

          <h2 className="sidebar-title">Saved Searches</h2>
          <ul className="search-list">
            <li>
              Senior React Developers <span>24</span>
            </li>
            <li>
              Mid-level Designers <span>18</span>
            </li>
            <li>
              DevOps Remote <span>12</span>
            </li>
          </ul>
        </aside>

        <main className="main-dashboard">
          <div className="welcome-card">
            <div className="welcome-text">
              <h1>Welcome, {username}</h1>
            </div>
            <div className="welcome-icon">
              <FaBell />
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card blue">
              <FaClipboardList className="stat-icon" />
              <h3>Job Posts</h3>
              <p className="stat-value">0</p>
              <span className="stat-change">+0%</span>
            </div>

            <div className="stat-card green">
              <FaUsers className="stat-icon" />
              <h3>Applications</h3>
              <p className="stat-value">0</p>
              <span className="stat-change">+0%</span>
            </div>

            <div className="stat-card purple">
              <FaStar className="stat-icon" />
              <h3>Shortlisted</h3>
              <p className="stat-value">0</p>
              <span className="stat-change">+0%</span>
            </div>

            <div className="stat-card orange">
              <FaCalendarAlt className="stat-icon" />
              <h3>Interviews</h3>
              <p className="stat-value">0</p>
              <span className="stat-change">+0%</span>
            </div>
          </div>

          <div className="pipeline">
            <h2>Hiring Pipeline</h2>
            <div className="pipeline-stages">
              <div className="stage">
                <span>0</span>
                <p>Applications</p>
              </div>
              <div className="stage">
                <span>0</span>
                <p>Shortlist</p>
              </div>
              <div className="stage">
                <span>0</span>
                <p>Interviews</p>
              </div>
              <div className="stage">
                <span>0</span>
                <p>Offers</p>
              </div>
              <div className="stage">
                <span>0</span>
                <p>Hired</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterProfile;
