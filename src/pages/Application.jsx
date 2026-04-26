import React, { useEffect, useState } from "react";
import "./Application.css";
import CandidateDashboardHeader from "../component/CandidateDashboardHeader";
import Lenis from "lenis";

function Application() {

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [search, setSearch] = useState("");

    
  const user = JSON.parse(localStorage.getItem("user"));
  const fullName = user?`${user.firstName} ${user.lastName}` : "User";

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
    const appliedLocal = JSON.parse(localStorage.getItem("appliedJobs")) || [];
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
        similarity: app.similarity,
        // appliedDate: app.appliedDate

         status: app.status,
         interviewDate: app.interviewDate,
         interviewLink: app.interviewLink,
         isAppliedLocal: appliedLocal.includes(app.job?.id)
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


  const handelDelete = async (jobId) => {
    try {
      const response = await fetch (` http://localhost:8080/api/applications/delete/${jobId} `, {
        method: "DELETE"
      });

      if(!response.ok){
        throw new Error (`HTTP ${response.status}`);

      }


      const update = appliedJobs.filter(job=>job.id !== jobId);
      setAppliedJobs(update);
     const updatedIds = update.map(j => j.jobId);
     localStorage.setItem("appliedJobs", JSON.stringify(updatedIds));
      alert("✅ Application removed successfully!");
    } catch (error) {
      console.error("❌ Error deleting application:", error);
      alert("⚠️ Failed to delete application. Please try again.");
    }
  };

  return (
    <div className="jobmatcher-container1">

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
      <h3>{job.jobTitle}</h3>
      <p className="company-name">{job.companyName}</p>
    </div>

    <span className="job-type-badge">
      {job.jobType}
    </span>
  </div>

  <div className="job-info">
    <p>👤 {fullName}</p>
    <p>📍 {job.location}</p>
  </div>

  <div className="job-meta">
    <p>💼 {job.experienceLevel}</p>
    <p>🧠 {job.skills}</p>
    <p>🕓 {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "N/A"}</p>
  </div>

  {/* ✅ SALARY + PROGRESS SECTION */}
  <div className="salary-score">

    <p className="salary">
      ₹{job.salaryMin} - ₹{job.salaryMax} LPA
    </p>

    <div className="circular-wrapper">

      <svg className="progress-ring" width="80" height="80">

        <defs>
          <linearGradient id={`gradient-${job.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {/* Background */}
        <circle
          cx="40"
          cy="40"
          r="30"
          stroke="#e5e7eb"
          strokeWidth="6"
          fill="none"
        />

        {/* Progress */}
        <circle
          cx="40"
          cy="40"
          r="30"
          stroke={`url(#gradient-${job.id})`}
          strokeWidth="6"
          fill="none"
          strokeDasharray={2 * Math.PI * 30}
          strokeDashoffset={
            2 * Math.PI * 30 * (1 - (job.similarity ? job.similarity : 0))
          }
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.6s ease"
          }}
        />

      </svg>

      {/* ✅ CENTER TEXT */}
      <div className="progress-text">
        {job.similarity ? (job.similarity * 100).toFixed(0) : 0}%
      </div>

    </div>

  </div>

  {/* ✅ DESCRIPTION */}
  <div className="job-description">
    {job.description}
  </div>

  <div className="status-tracker">

  <span className={(job.isAppliedLocal || job.status === "APPLIED") ? "active" : ""}>
    Applied
  </span>

  <span className={job.status === "SHORTLISTED" ? "active" : ""}>
    Shortlisted
  </span>

  <span className={job.status === "INTERVIEW" ? "active" : ""}>
    Interview
  </span>

  <span className={job.status === "OFFERED" ? "active" : ""}>
  Offer
</span>

<span className={job.status === "REJECTED" ? "rejected" : ""}>
  Rejected
</span>

</div>

{job.status === "INTERVIEW" && (
  <div className="interview-box">
    <h4>🎥 Interview Scheduled</h4>

    <p>
      📅 {job.interviewDate
        ? new Date(job.interviewDate).toLocaleString()
        : "Not Scheduled"}
    </p>

    {job.interviewLink && (
      <a
        href={job.interviewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="join-btn"
      >
        🔗 Join Interview
      </a>
    )}
  </div>
)}
{job.status === "OFFERED" && (
  <div className="offer-box">
    <h4>🎉 Offer Received</h4>

    <button
      className="offer-download-btn"
      onClick={() =>
        window.open(
          `http://localhost:8080/api/applications/offer/${job.id}`,
          "_blank"
        )
      }
    >
      📄 Download Offer Letter
    </button>
  </div>
)}

  {/* ✅ FOOTER */}
  <div className="job-footer">
    <button onClick={() => handelDelete(job.id)} className="delete-btn">
      Remove
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