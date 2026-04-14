import React, { useEffect, useState } from "react";
import "./Application.css";
import CandidateDashboardHeader from "../component/CandidateDashboardHeader";
import Lenis from "lenis";

function Application() {

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [search, setSearch] = useState("");

    
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || "User";

  // ✅ Smooth scroll
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

    return () => {
      lenis.destroy();
    };
  }, []);

  // ✅ Load from localStorage
  useEffect(() => {
    const fetchApplicaions = async () => {
      try{
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.warn("⚠️ No user found in localStorage!");
          return;
        }
        const response = await fetch(
          `http://localhost:8080/api/applications/user/${user.userId}`
        );
        const data = await response.json();

           // IMPORTANT: extract job details from application
      const jobs = data.map(app => ({
        id: app.id, // application id
        jobId: app.job?.id,
        jobTitle: app.job?.jobTitle,
        companyName: app.job?.companyName,
        jobType: app.job?.jobType,
        location: app.job?.location,
        description: app.job?.description,
        salaryMin: app.job?.salaryMin,
        salaryMax: app.job?.salaryMax,
        experienceLevel: app.job?.experienceLevel,
        skills: app.job?.skills,
        postedDate: app.job?.postedDate,
        similarity: app.job?.similarity,
        // appliedDate: app.appliedDate
      }));

      setAppliedJobs(jobs);
      } catch (err) {
        console.error("❌ Error fetching applications:", err);
        
      }
    };
    fetchApplicaions();
  }, []);

  // ✅ Delete using ID
  const handleDelete = (jobId) => {
    const updated = appliedJobs.filter(job => job.id !== jobId);
    setAppliedJobs(updated);
    localStorage.setItem("appliedJobs", JSON.stringify(updated));
  };

  // ✅ Safe filter (NO CRASH)
  const filteredJobs = appliedJobs.filter((job) => {
    const title = job.jobTitle?.toLowerCase() || "";
    const company = job.companyName?.toLowerCase() || "";
    const query = search.toLowerCase();

    return title.includes(query) || company.includes(query);
  });

  return (
    <div className="jobmatcher-container">

      <CandidateDashboardHeader />

      <div className="applications-page">

        <h1 className="page-title">My Applied Jobs</h1>

        <p className="page-subtitle">
          View and manage the jobs you’ve applied for.
        </p>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* COUNT */}
        <div className="applications-count">
          <i className="fa fa-briefcase"></i> {filteredJobs.length} Applications Found
        </div>

        {/* JOB LIST */}
        <div className="job-card-grid">

          {filteredJobs.length === 0 ? (

            <p className="no-data">No matching job applications found.</p>

          ) : (

            filteredJobs.map((job) => (

              <div className="job-card" key={job.id}>

                <div className="job-card-header">

                  <div>
                    <h3>{job.jobTitle || "No Title"}</h3>
                    <p className="company-name">{job.companyName || "No Company"}</p>
                  </div>

                  <span className="job-type-badge">
                    {job.jobType || "Full-time"}
                  </span>

                </div>

                <div className="job-info">
                  
                  <p>👤 <strong>{username || "User"}</strong></p>
                  <p>📍 {job.location || "Not specified"}</p>
                  {/* <p>📅 Applied on: {job.appliedDate || "N/A"}</p> */}
                </div>

                <div className="job-meta">
                  <p>💼 Experience: {job.experienceLevel || "N/A"}</p>
                  <p>🧠 Skills: {job.skills || "N/A"}</p>
                  <p>
                    🕓 Posted:{" "}
                    {job.postedDate
                      ? new Date(job.postedDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div className="salary-score">
                  <p>💰 ₹{job.salaryMin || 0} - ₹{job.salaryMax || 0} LPA</p>
                  <p>
                    📊 Match Score:{" "}
                    {job.similarity
                      ? (job.similarity * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>

                <div className="job-description">
                  <p>{job.description || "No description available."}</p>
                </div>

                <div className="job-footer">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(job.id)}
                  >
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