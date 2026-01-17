import React, { useState, useEffect } from "react";
import "./Jobmatcher.css";
import CandidateDashboardHeader from "../component/CandidateDashboardHeader";

function Jobmatcher() {
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Load username & email from localStorage
  useEffect(() => {
    const rawUser = localStorage.getItem("user");

    if (!rawUser) {
      console.warn("⚠️ No user found in localStorage!");
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser);
      if (parsedUser.username) setUsername(parsedUser.username);
      if (parsedUser.email) setEmail(parsedUser.email);
    } catch (err) {
      console.error("❌ Error parsing user data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch jobs once username is ready
  useEffect(() => {
    if (!username) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/jobs/recommended/username/${encodeURIComponent(
            username
          )}`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("❌ Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [username]);

  // ✅ Handle Apply — Save locally only
  const handleApply = (job) => {
    if (!username || !email) {
      alert("⚠️ Please log in first!");
      return;
    }

    const fullJobDetails = {
      username: username,
      email: email,
      jobId: job.id,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      location: job.location,
      description: job.description,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      skills: job.skills,
      similarity: job.similarity,
      postedDate: job.postedDate,
      appliedDate: new Date().toLocaleString(),
    };

    try {
      const stored = localStorage.getItem("appliedJobs");
      let appliedJobs = stored ? JSON.parse(stored) : [];

      // Prevent duplicates
      const alreadyApplied = appliedJobs.some(
        (a) => a.jobId === job.id && a.username === username
      );

      if (alreadyApplied) {
        alert("⚠️ You already applied for this job!");
        return;
      }

      appliedJobs.push(fullJobDetails);
      localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
      alert(`✅ Successfully applied for ${job.jobTitle}`);
    } catch (error) {
      console.error("❌ Error saving job locally:", error);
      alert("❌ Failed to save locally.");
    }
  };

  // ✅ Handle search by job title or company
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(query) ||
        job.companyName.toLowerCase().includes(query) ||
        (job.skills && job.skills.toLowerCase().includes(query))
    );

    setFilteredJobs(filtered);
  };

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="jobmatcher-container">
        <CandidateDashboardHeader />
        <div className="loading">Loading recommended jobs...</div>
      </div>
    );
  }

  return (
    <div className="jobmatcher-container">
      <CandidateDashboardHeader />

      <div className="dashboard">
        <div className="main">
          <h2>🎯 Recommended Jobs for You</h2>
          <p className="subtitle">
            Based on your skills and experience, here are your best matches.
          </p>

          {/* 🔍 Filter Bar */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              className="search-box"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters ▲" : "Show Filters ⬇"}
            </button>

            <div className={`filters ${showFilters ? "show" : ""}`}>
              <select>
                <option>Location</option>
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
              </select>
              <select>
                <option>Job Type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
              </select>
              <select>
                <option>Salary Range</option>
                <option>$50k–$80k</option>
                <option>$80k–$120k</option>
                <option>$120k+</option>
              </select>
            </div>
          </div>

          <p className="count">{filteredJobs.length} jobs found</p>

          {/* ✅ Job List */}
          <div className="job-grid">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, i) => (
                <div key={i} className="job-card">
                  <div className="job-header">
                    <h3>{job.jobTitle}</h3>
                    <span className="job-type">{job.jobType}</span>
                  </div>

                  <p className="company-name">{job.companyName}</p>
                  <p className="job-location">📍 {job.location}</p>

                  <p
                    style={{
                      color: "#08306b",
                      fontWeight: "bold",
                      fontSize: "0.95rem",
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.color = "#0b71ff")}
                    onMouseOut={(e) => (e.target.style.color = "#08306b")}
                  >
                    {Math.floor(
                      (Date.now() - new Date(job.postedDate)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days ago
                  </p>

                  <p className="job-description">{job.description}</p>

                  <div className="job-meta">
                    <span>💼 {job.experienceLevel}</span>
                    <span>
                      💰 ₹{job.salaryMin} - ₹{job.salaryMax}
                    </span>
                  </div>

                  <div className="job-skills">
                    {job.skills &&
                      job.skills.split(",").map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill.trim()}
                        </span>
                      ))}
                  </div>

                  <div className="similarity">
                    🔍 Match Score:{" "}
                    <strong>{(job.similarity * 100).toFixed(1)}%</strong>
                  </div>

                  <div className="card-footer">
                    <div
                      className="date-btn-wrapper"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "97px",
                        width: "100%",
                      }}
                    >
                      <span className="posted-date">
                        📅 {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                      <button
                        className="apply-btn"
                        onClick={() => handleApply(job)}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-jobs">No jobs found for your search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobmatcher;
