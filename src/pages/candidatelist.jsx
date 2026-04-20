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

const handleShortlist = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/applications/${id}/shortlist`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to shortlist");
    }

    alert("✅ Candidate shortlisted!");

    // ✅ Update UI without reload
    setCandidates((prev) =>
      prev.map((c) =>
        c.applicationId === id
          ? { ...c, status: "SHORTLISTED" }
          : c
      )
    );

  } catch (error) {
    console.error(error);
    alert("❌ Error while shortlisting");
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
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        width: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "25px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        position: "relative",
      }}
    >

      {/* ❌ Close Button */}
      <button
        onClick={() => setSelectedCandidate(null)}
        style={{
          position: "absolute",
          top: "10px",
          right: "15px",
          border: "none",
          background: "transparent",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        ✖
      </button>

      {/* 👤 HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#007bff",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {selectedCandidate.name
            ? selectedCandidate.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div>
          <h2 style={{ margin: 0 }}>
            {selectedCandidate.name || "No Name"}
          </h2>
          <p style={{ margin: "5px 0", color: "gray" }}>
            {selectedCandidate.email || "N/A"}
          </p>
        </div>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* 📞 CONTACT */}
      <div style={{ marginBottom: "15px" }}>
        <h4>Contact</h4>
        <p><strong>Phone:</strong> {selectedCandidate.phone || "N/A"}</p>
      </div>

      {/* 🧠 SKILLS */}
      <div style={{ marginBottom: "15px" }}>
        <h4>Skills</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {selectedCandidate.skills
            ? selectedCandidate.skills.split(",").map((skill, i) => (
                <span
                  key={i}
                  style={{
                    background: "#e3f2fd",
                    color: "#007bff",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                  }}
                >
                  {skill.trim()}
                </span>
              ))
            : "N/A"}
        </div>
      </div>

      {/* 🎯 OBJECTIVE */}
      <div style={{ marginBottom: "15px" }}>
        <h4>Career Objective</h4>
        <p style={{ lineHeight: "1.6" }}>
          {selectedCandidate.careerObjective || "N/A"}
        </p>
      </div>

      {/* 🎓 EDUCATION */}
      <div style={{ marginBottom: "15px" }}>
        <h4>Education</h4>
        <p>{selectedCandidate.graduation || "N/A"}</p>
        <p>{selectedCandidate.secondaryEducation || ""}</p>
      </div>

      {/* 💼 EXPERIENCE */}
      <div style={{ marginBottom: "15px" }}>
        <h4>Experience</h4>
        <p>{selectedCandidate.jobs || "N/A"}</p>
      </div>

      {/* 🚀 PROJECTS */}
      <div style={{ marginBottom: "15px" }}>
  <h4>Projects</h4>

  {selectedCandidate.academicProjects ? (
    selectedCandidate.academicProjects.split(";").map((project, index) => (
      <div
        key={index}
        style={{
          background: "#f8f9fa",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
          borderLeft: "4px solid #007bff",
        }}
      >
        {project.trim()}
      </div>
    ))
  ) : (
    <p>N/A</p>
  )}
</div>

    </div>
  </div>
)}


    </div>
    </div>
  );
}

export default CandidateList;