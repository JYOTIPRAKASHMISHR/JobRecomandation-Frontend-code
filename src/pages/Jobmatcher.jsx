import React, { useState, useEffect } from "react";
import "./Jobmatcher.css";
import CandidateDashboardHeader from "../component/CandidateDashboardHeader";

function Jobmatcher() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const storedApplied = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    setAppliedJobs(storedApplied);
  }, []);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(rawUser);
    setUsername(parsedUser.username);
  }, []);

  useEffect(() => {
    if (!username) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:8080/api/jobs/recommended/username/${username}`
        );
        const data = await res.json();

        const storedApplied =
          JSON.parse(localStorage.getItem("appliedJobs")) || [];

        const filtered = data
          .filter((job) => job.similarity >= 0.5)
          .filter((job) => !storedApplied.includes(Number(job.id)));

        setJobs(filtered);
        setFilteredJobs(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [username]);

  const handleApply = async (job) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const payload = {
      jobId: job.id,
      userId: user.userId,
      similarity: job.similarity ?? 0,
    };

    try {
      const res = await fetch(
        "http://localhost:8080/api/applications/applyy",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      const updated = [...new Set([...appliedJobs, Number(job.id)])];
      setAppliedJobs(updated);
      localStorage.setItem("appliedJobs", JSON.stringify(updated));

      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      setFilteredJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch {
      alert("Failed to apply");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = jobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(query) ||
        job.companyName.toLowerCase().includes(query)
    );

    setFilteredJobs(filtered);
  };

  if (loading) {
    return <div className="loading">Loading Jobs...</div>;
  }

  return (
    <div className="jobmatcher-container">
      <CandidateDashboardHeader />

      <div className="main">
        <h2>🎯 Recommended Jobs</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="job-grid">
          {filteredJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <div className="top">
                <h3>{job.jobTitle}</h3>
                <span className="badge">{job.jobType}</span>
              </div>

              <p className="company">{job.companyName}</p>
              <p className="location">📍 {job.location}</p>

              <div className="skills">
                {job.skills?.split(",").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>

              <div className="match">
                <div className="bar">
                  <div
                    className="fill"
                    style={{ width: `${job.similarity * 100}%` }}
                  />
                </div>
                <span>{(job.similarity * 100).toFixed(0)}%</span>
              </div>

              <button onClick={() => handleApply(job)}>
                Apply Now 🚀
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Jobmatcher;