import React, { useEffect, useState } from "react";
import "./InterviewPage.css";
import Recruiter from "./Recruiter";

const InterviewPage = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/applications/interviews")
      .then(res => res.json())
      .then(data => setInterviews(data))
      .catch(err => console.error(err));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:8080/api/applications/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    setInterviews(prev =>
      prev.map(i => (i.id === id ? { ...i, status } : i))
    );
  };

  return (
    <div>
      <Recruiter />

      <div className="interview-page">

        <h1>📅 Scheduled Interviews</h1>

        <div className="interview-grid">

          {interviews.map((c) => (
            <div className="interview-card" key={c.id}>

              {/* Avatar */}
              <div className="avatar">
                {c.name?.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <h3>{c.name}</h3>
              <p>{c.email}</p>
              <p>📞 {c.phone}</p>
              <p className="job">{c.jobTitle}</p>

              {/* Date */}
              <p className="date">
                📅 {new Date(c.interviewDate).toLocaleString()}
              </p>

              {/* Status */}
              <span className={`status ${c.status}`} >
                {c.status}
              </span>

              {/* Actions */}
             <div className="actions">

  {/* LEFT - HIRE */}
  <button
    className="hire1"
    onClick={() => updateStatus(c.id, "HIRED")}
  >
    Hire
  </button>

  {/* CENTER - INTERVIEW */}
  {c.status === "INTERVIEW" && (
  <button
    className="interview"
    onClick={() => window.open(c.interviewLink, "_blank")}
  >
    Join Interview
  </button>
)}

  {/* RIGHT - REJECT */}
  <button
    className="reject1"
    onClick={() => updateStatus(c.id, "REJECTED")}
  >
    Reject
  </button>

</div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default InterviewPage;