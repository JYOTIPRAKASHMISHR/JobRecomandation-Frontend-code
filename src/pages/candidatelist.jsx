import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CandidateList.css";
import Recruiter from "./Recruiter";

function CandidateList() {

  const { jobId } = useParams(); // ✅ get jobId from URL

  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);


  // ✅ Fetch Candidates (API)
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        console.log("📡 Fetching candidates for jobId:", jobId);

        const response = await fetch(
          `http://localhost:8080/api/candidates/job/${jobId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();

        console.log("✅ API Response:", data);

        setCandidates(data);
      } catch (error) {
        console.error("❌ Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchCandidates();
  }, [jobId]);

  // ✅ Filter Candidates
  const filteredCandidates = candidates.filter((c) => {
    const name = c.name?.toLowerCase() || "";
    const skills = c.skills?.toLowerCase() || "";
    const query = search.toLowerCase();

    return name.includes(query) || skills.includes(query);
  });

  // ✅ Actions
  const handleShortlist = (id) => {
    alert("✅ Candidate shortlisted: " + id);
  };

  const handleReject = (id) => {
    alert("❌ Candidate rejected: " + id);
  };

  const fetchJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const recruiterEmail = user?.email;

      if (!recruiterEmail) {
        setError("Recruiter email not found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/jobs/recruiter/${recruiterEmail}`
      );
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/candidates/${id}`);

    if (!response.ok) {
      alert("Failed to fetch candidate details");
      return;
    }

    const data = await response.json();
    setSelectedCandidate(data);

  } catch (error) {
    console.error(error);
  }
};

  

  return (

    <div>
      <Recruiter />
    <div className="candidate-page">

     

      {/* 🧭 HEADER */}
      <h1 className="page-title">Candidate Applications</h1>
      <p className="page-subtitle">
        Review and manage candidates who applied for your jobs.
      </p>

      {/* 🔍 SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by name or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📊 COUNT */}
      <div className="candidate-count">
        {filteredCandidates.length} Candidates Found
      </div>

      {/* 🧩 GRID */}
      <div className="candidate-grid">

        {loading ? (

          <p className="no-data">Loading candidates...</p>

        ) : filteredCandidates.length === 0 ? (

          <p className="no-data">No candidates found.</p>

        ) : (

          filteredCandidates.map((c, index) => {

            const match = c.similarity
              ? (c.similarity * 100).toFixed(1)
              : "0.0";

            return (
              <div className="candidate-card" key={index}>

                {/* 🏷 STATUS */}
                <span className={`status-badge status-${c.status || "pending"}`}>
                  {c.status || "Pending"}
                </span>

                {/* 👤 HEADER */}
                <div className="candidate-header">

                  <div className="candidate-avatar">
                    {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                  </div>

                  <div>
                    <div className="candidate-name">{c.name || "Unknown"}</div>
                    <div className="candidate-email">{c.email || "No Email"}</div>
                  </div>

                </div>

                {/* 📍 INFO */}
                <div className="candidate-info">
                  <p>📞 {c.phone || "No Phone"}</p>
                  <p>💼 {c.username || "Candidate"}</p>
                </div>

                {/* 🧠 SKILLS */}
                <div className="candidate-skills">
                  {c.skills
                    ? c.skills.split(",").map((skill, i) => (
                        <span key={i} className="skill-tag">
                          {skill.trim()}
                        </span>
                      ))
                    : <span className="skill-tag">No Skills</span>
                  }
                </div>

                {/* 📊 MATCH SCORE */}
                <div className="match-section">
                  <div className="match-text">
                    Match Score: {match}%
                  </div>

                  <div className="match-bar">
                    <div
                      className="match-fill"
                      style={{ width: `${match}%` }}
                    ></div>
                  </div>
                </div>

                {/* 🕒 FOOTER */}
                <div className="card-footer">

                  <span className="applied-date">
                    📅 {c.appliedDate
                      ? new Date(c.appliedDate).toLocaleDateString()
                      : "N/A"}
                  </span>

                  <div className="action-buttons">

                    <button
                      className="btn btn-view"
                      onClick={() => handleView(c.userId)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-shortlist"
                      onClick={() => handleShortlist(c.applicationId)}
                    >
                      Shortlist
                    </button>

                    <button
                      className="btn btn-reject"
                      onClick={() => handleReject(c.applicationId)}
                    >
                      Reject
                    </button>

                  </div>

                  

                </div>

              </div>
            );
          })

        )}

      </div>
       {selectedCandidate && (
            <div className="modal">
              <h2>{selectedCandidate.name}</h2>
              <p>Email: {selectedCandidate.email}</p>
              <p>Skills: {selectedCandidate.skills}</p>
              <button onClick={() => setSelectedCandidate(null)}>Close</button>
            </div>
          )}  


    </div>
    </div>
  );
}

export default CandidateList;