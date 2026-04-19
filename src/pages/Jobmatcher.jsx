import React, { useState, useEffect, use } from "react";
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
  const [appliedJobs, setAppliedJobs] = useState([]);



  useEffect(() => {
    const storedApplied = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    setAppliedJobs(storedApplied);
  }, []);


  // Load user from localStorage
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

  // Fetch recommended jobs
  useEffect(() => {

    if (!username) return;

    const fetchJobs = async () => {

      try {

        setLoading(true);

        const response = await fetch(
          `http://localhost:8080/api/jobs/recommended/username/${encodeURIComponent(username)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Filter jobs above 50% similarity
        const highMatchScoreJobs = data.filter(job => job.similarity >= 0.5);

        setJobs(highMatchScoreJobs);
        setFilteredJobs(highMatchScoreJobs);

      } catch (error) {

        console.error("❌ Error fetching jobs:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchJobs();

  }, [username]);



  // APPLY JOB
  const handleApply = async (job) => {


    const updated = [...appliedJobs, job.id];
    setAppliedJobs(updated);
    localStorage.setItem("appliedJobs", JSON.stringify(updated));


    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("⚠️ Please login first!");
      return;
    }

    const payload = {
  jobId: job.id,
  recruiterId: job.recruiterId,
  userId: user.userId,
  similarity: job.similarity ?? 0
};

    try {

      const response = await fetch("http://localhost:8080/api/applications/applyy", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)

      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      alert(`✅ Successfully applied for ${job.jobTitle}`);


    
      setAppliedJobs(prev => [...prev, job.id]);

      // Remove applied job from UI
      setJobs(prev => prev.filter(j => j.id !== job.id));
      setFilteredJobs(prev => prev.filter(j => j.id !== job.id));

    } catch (error) {

      console.error("❌ Error applying:", error);
      alert("❌ Failed to apply for job");

    }

  };



  // Search Function
  const handleSearch = (e) => {

    const query = e.target.value.toLowerCase();

    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter(job =>
      job.jobTitle.toLowerCase().includes(query) ||
      job.companyName.toLowerCase().includes(query) ||
      (job.skills && job.skills.toLowerCase().includes(query))
    );

    setFilteredJobs(filtered);

  };



  // Loading Screen
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



          {/* SEARCH BAR */}

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

          </div>



        <p className="count">
  {filteredJobs.filter(job => !appliedJobs.includes(job.id)).length} jobs found
</p>


          {/* JOB LIST */}

          <div className="job-grid">

            {filteredJobs.length > 0 ? (

            filteredJobs
        .filter(job => !appliedJobs.includes(job.id))
        .map((job) => (

                <div key={job.id} className="job-card">

                  <div className="job-header">

                    <h3>{job.jobTitle}</h3>
                    <span className="job-type">{job.jobType}</span>

                  </div>

                  <p className="company-name">{job.companyName}</p>

                  <p className="job-location">📍 {job.location}</p>



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
  Match Score: {(job.similarity * 100).toFixed(1)}%

  <div className="similarity-bar">
    <div
      className="similarity-fill"
      style={{ width: `${job.similarity * 100}%` }}
    ></div>
  </div>
</div>



                  <div className="card-footer">

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