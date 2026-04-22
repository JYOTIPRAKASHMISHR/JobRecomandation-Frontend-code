import React, { useEffect, useState } from "react";
import "./ShortlistedCandidates.css";
import Recruiter from "./Recruiter";

const ShortlistedCandidates = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewLink, setInterviewLink] = useState("");
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

const handleSchedule = async () => {
  await fetch(`http://localhost:8080/api/applications/${selectedId}/schedule`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: interviewDate,
      link: interviewLink
    })
  });

  alert("Interview Scheduled!");
  setShowSchedule(false); // ✅ close modal
};
const openScheduleModal = (id) => {
  setSelectedId(id);
  setShowSchedule(true);
};

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
            {filteredCandidates.map((c) => (
              <div className="candidate-card" key={c.id}>

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
                <button className="view-btn" onClick={() => openScheduleModal(c.applicationId)}>📅 Schedule Interview</button>

              </div>
            ))}
          </div>
        )}
        {showSchedule && (
  <div className="modal-overlay">
    <div className="modal-box">

      <div className="modal-header">
        <h3>📅 Schedule Interview</h3>
        <button
          className="close-btn"
          onClick={() => setShowSchedule(false)}
        >
          ✖
        </button>
      </div>

      <div className="modal-body">

        <label>Interview Date & Time</label>
        <input
          type="datetime-local"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
        />

        <label>Meeting Link</label>
        <input
          type="text"
          placeholder="Paste Google Meet / Zoom link"
          value={interviewLink}
          onChange={(e) => setInterviewLink(e.target.value)}
        />

      </div>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => setShowSchedule(false)}
        >
          Cancel
        </button>

        <button
          className="confirm-btn"
          onClick={handleSchedule}
        >
          Confirm
        </button>
      </div>

    </div>
  </div>

)}

      </div>
    </div>
  );
};

export default ShortlistedCandidates;