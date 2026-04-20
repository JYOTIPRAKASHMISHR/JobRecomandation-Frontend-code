import React, { useEffect, useState } from "react";
import "./ShortlistedCandidates.css";
import Recruiter from "./Recruiter";

const ShortlistedCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch jobs of recruiter
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    fetch(`http://localhost:8080/api/jobs/recruiter/${email}`)
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  }, []);

  // ✅ Fetch shortlisted candidates
  useEffect(() => {
    fetch("http://localhost:8080/api/candidates/shortlisted")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setCandidates(data);
        setFilteredCandidates(data);
      })
      .catch((err) => console.error("❌ Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Filter by selected job
 useEffect(() => {
  if (!selectedJob) {
    setFilteredCandidates(candidates);
  } else {
    const filtered = candidates.filter(
      (c) => String(c.jobId) === String(selectedJob)
    );

    console.log("Selected Job:", selectedJob);
    console.log("Candidate jobIds:", candidates.map(c => c.jobId));
    console.log("Filtered:", filtered);

    setFilteredCandidates(filtered);
  }
}, [selectedJob, candidates]);

  return (
    <div>
      <Recruiter />

      <div className="shortlisted-page">

        {/* 🔥 HEADER */}
        <div className="header">
          <h1>⭐ Shortlisted Candidates</h1>

          {/* 🎯 JOB DROPDOWN */}
          <div className="job-dropdown">
            <select
  value={selectedJob ?? ""}
  onChange={(e) =>
    setSelectedJob(e.target.value ? Number(e.target.value) : null)
  }
  className="job-select"
>
  <option value="">All Jobs</option>
  {jobs.map((job) => (
    <option key={job.id} value={job.id}>
      {job.jobTitle}
    </option>
  ))}
</select>
          </div>
        </div>

        {/* 📊 COUNT */}
        <p className="count">
          {filteredCandidates.length} Candidates Found
        </p>

        {/* 🧩 GRID */}
        {loading ? (
          <p className="no-data">Loading...</p>
        ) : filteredCandidates.length === 0 ? (
          <p className="no-data">No shortlisted candidates</p>
        ) : (
          <div className="candidate-grid">
            {filteredCandidates.map((c, index) => (
              <div className="candidate-card" key={index}>

                {/* Avatar */}
                <div className="avatar">
                  {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                </div>

                {/* Info */}
                <h3>{c.name}</h3>
                <p className="email">{c.email}</p>
                <p className="phone">📞 {c.phone}</p>

                {/* Skills */}
                <div className="skills">
                  {c.skills?.split(",").map((s, i) => (
                    <span key={i}>{s.trim()}</span>
                  ))}
                </div>

                {/* Match */}
                <div className="match-box">
                  <span>Match</span>
                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{ width: `${(c.similarity * 100)}%` }}
                    ></div>
                  </div>
                  <span className="percent">
                    {(c.similarity * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Date */}
                <p className="date">
                  📅 {c.shortlistedAt
                    ? new Date(c.shortlistedAt).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* Action */}
                <button className="view-btn">Take Interviw</button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistedCandidates;