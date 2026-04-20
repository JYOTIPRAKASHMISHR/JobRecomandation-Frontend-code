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
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [open, setOpen] = useState(false);

  // ✅ Get recruiter name
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUsername(
          userData.username ||
            `${userData.firstName} ${userData.lastName}` ||
            "Recruiter"
        );
      } catch (error) {
        console.error("Error parsing user:", error);
        setUsername("Recruiter");
      }
    }
  }, []);

  // ✅ Fetch Jobs of recruiter
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const recruiterEmail = user?.email;

        const res = await fetch(
          `http://localhost:8080/api/jobs/recruiter/${recruiterEmail}`
        );

        const data = await res.json();
        setJobs(data);

        if (data.length > 0) {
          setSelectedJobId(data[0].id); // auto select first job
        }
      } catch (err) {
        console.error("❌ Failed to fetch jobs", err);
      }
    };

    fetchJobs();
  }, []);

  // ✅ Fetch Candidates when job changes
  useEffect(() => {
    if (!selectedJobId) return;

    const fetchCandidates = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/candidates/job/${selectedJobId}`
        );

        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        console.error("❌ Failed to fetch candidates", err);
      }
    };

    fetchCandidates();
  }, [selectedJobId]);

  return (
    <div className="recruiter-profile">
      <Recruiter />

      <div className="dashboard-container">
        {/* 🔥 SIDEBAR */}
        <aside className="sidebar">

          {/* ✅ JOB DROPDOWN */}
          <h2 className="sidebar-title">Select Job</h2>
          <div className="custom-dropdown">
  <div 
    className="dropdown-header"
    onClick={() => setOpen(!open)}
  >
    {jobs.find(j => j.id === selectedJobId)?.jobTitle || "Select Job"}
    <span className="arrow">▼</span>
  </div>

  {open && (
    <div className="dropdown-list">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="dropdown-item"
          onClick={() => {
            setSelectedJobId(job.id);
            setOpen(false);
          }}
        >
          {job.jobTitle}
        </div>
      ))}
    </div>
  )}
</div>

          {/* ✅ TOP MATCHED CANDIDATES */}
          <h2 className="sidebar-title">Top Matches</h2>
          <ul className="candidate-list">
            {candidates.length === 0 ? (
              <p className="no-data">No candidates</p>
            ) : (
              candidates
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 3)
                .map((c, index) => (
                  <li key={index}>
                    <span className="avatar">
                      {c.name ? c.name.charAt(0) : "U"}
                    </span>

                    <div>
                      <p className="candidate-name">{c.name}</p>
                      <p className="candidate-role">
                        {c.skills?.split(",")[0] || "Candidate"}
                      </p>
                    </div>

                    <span className="score">
                      {c.similarity
                        ? (c.similarity * 100).toFixed(0)
                        : 0}
                      %
                    </span>
                  </li>
                ))
            )}
          </ul>

          {/* ✅ RECENT APPLICATIONS */}
          <h2 className="sidebar-title">Recent Applicants</h2>
          <ul className="search-list">
            {candidates.length === 0 ? (
              <p className="no-data">No data</p>
            ) : (
              candidates
                .sort(
                  (a, b) =>
                    new Date(b.appliedDate) - new Date(a.appliedDate)
                )
                .slice(0, 3)
                .map((c, index) => (
                  <li key={index}>
                    {c.name}
                    <span>
                      {c.appliedDate
                        ? new Date(c.appliedDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </li>
                ))
            )}
          </ul>
        </aside>

        {/* 🔵 MAIN DASHBOARD */}
        <main className="main-dashboard">
          <div className="welcome-card">
            <div className="welcome-text">
              <h1>Welcome, {username}</h1>
            </div>
            <div className="welcome-icon">
              <FaBell />
            </div>
          </div>

          {/* 📊 STATS */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <FaClipboardList className="stat-icon" />
              <h3>Job Posts</h3>
              <p className="stat-value">{jobs.length}</p>
            </div>

            <div className="stat-card green">
              <FaUsers className="stat-icon" />
              <h3>Applications</h3>
              <p className="stat-value">{candidates.length}</p>
            </div>

            <div className="stat-card purple">
              <FaStar className="stat-icon" />
              <h3>Top Match</h3>
              <p className="stat-value">
                {candidates.length > 0
                  ? (Math.max(...candidates.map(c => c.similarity)) * 100).toFixed(0)
                  : 0}%
              </p>
            </div>

            <div className="stat-card orange">
              <FaCalendarAlt className="stat-icon" />
              <h3>Interviews</h3>
              <p className="stat-value">0</p>
            </div>
          </div>

          {/* 🧩 PIPELINE */}
          <div className="pipeline">
            <h2>Hiring Pipeline</h2>
            <div className="pipeline-stages">
              <div className="stage">
                <span>{candidates.length}</span>
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