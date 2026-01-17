import React, { useEffect, useState } from "react";
import "./Application.css";
import CandidateDashboardHeader from "../component/CandidateDashboardHeader";
import Lenis from "lenis";

function Application() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Enable Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  // ✅ Load applied jobs from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    setAppliedJobs(stored);
  }, []);

  // ✅ Delete job from list & update localStorage
  const handleDelete = (index) => {
    const updated = [...appliedJobs];
    updated.splice(index, 1);
    setAppliedJobs(updated);
    localStorage.setItem("appliedJobs", JSON.stringify(updated));
  };

  // ✅ Filter jobs based on search
  const filteredJobs = appliedJobs.filter(
    (job) =>
      job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase())
  );
  // ✅ Filter jobs by Job Title only
  // const filteredJobs = appliedJobs.filter((job) =>
  //   job.jobTitle.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div className="jobmatcher-container">
      <CandidateDashboardHeader />
      <div className="applications-page">
        <h1 className="page-title">My Applied Jobs</h1>
        <p className="page-subtitle">
          View and manage the jobs you’ve applied for.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="applications-count">
          <i className="fa fa-briefcase"></i> {filteredJobs.length} Applications Found
        </div>

        <div className="job-card-grid">
          {filteredJobs.length === 0 ? (
            <p className="no-data">No matching job applications found.</p>
          ) : (
            filteredJobs.map((job, index) => (
              <div className="job-card" key={index}>
                <div className="job-card-header">
                  <div>
                    <h3>{job.jobTitle}</h3>
                    <p className="company-name">{job.companyName}</p>
                  </div>
                  <span className="job-type-badge">
                    {job.jobType || "Full-time"}
                  </span>
                </div>

                <div className="job-info">
                  <p>👤 <strong>{job.username}</strong></p>
                  <p>📍 {job.location || "Not specified"}</p>
                  <p>📅 Applied on: {job.appliedDate}</p>
                </div>

                <div className="job-meta">
                  <p>💼 Experience: {job.experienceLevel || "N/A"}</p>
                  <p>🧠 Skills: {job.skills || "N/A"}</p>
                  <p>🕓 Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
                </div>

                <div className="salary-score">
                  <p>💰 ₹{job.salaryMin} - ₹{job.salaryMax} LPA</p>
                  <p>📊 Match Score: {(job.similarity * 100).toFixed(1)}%</p>
                </div>

                <div className="job-description">
                  <p>{job.description}</p>
                </div>

                <div className="job-footer">
                  <button className="delete-btn" onClick={() => handleDelete(index)}>
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Application;
