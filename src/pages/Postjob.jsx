import React, { useState, useEffect } from "react";
import Recruiter from "./Recruiter";
import "./postjob.css";
import { useNavigate } from "react-router-dom";

const Postjob = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editJobId, setEditJobId] = useState(null);

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    jobType: "Full-Time",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "",
    skills: "",
    description: "",
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ FETCH JOBS
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    fetch(`http://localhost:8080/api/jobs/recruiter/${email}`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  // ✅ FORM CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    const payload = {
      ...formData,
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
      recruiterEmail: email,
    };

    const url = isEditing
      ? `http://localhost:8080/api/jobs/${editJobId}`
      : `http://localhost:8080/api/jobs`;

    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowModal(false);
      setIsEditing(false);
      setEditJobId(null);
      window.location.reload();
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/jobs/${id}`, {
      method: "DELETE",
    });
    window.location.reload();
  };

  // ✅ EDIT
  const handleEdit = (job) => {
    setFormData(job);
    setEditJobId(job.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewCandidates = (id) => {
    navigate(`/candidates/${id}`);
  };

  // ✅ DAYS AGO FUNCTION
  const getDaysAgo = (date) => {
    if (!date) return "";
    const diff = new Date() - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="dashboard-wrapper">
      <Recruiter />

      <div className="dashboard">

        {/* SIDEBAR */}
        <div className="sidebar1">
          <h2>Your Jobs</h2>

          {jobs.map((job) => (
            <div
              key={job.id}
              className="job-item"
              onClick={() => handleViewCandidates(job.id)}
            >
              <h4>{job.jobTitle}</h4>
              <p>{job.companyName}</p>
            </div>
          ))}
        </div>

        {/* MAIN */}
        <div className="main-content">

          <div className="top-bar">
            <h2>Job Dashboard</h2>
            <button
              className="post-btn"
              onClick={() => {
                setFormData({});
                setIsEditing(false);
                setShowModal(true);
              }}
            >
              + Post Job
            </button>
          </div>

          {/* TABLE */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="job-table">

              <div className="table-header">
                <span>Job</span>
                <span>Type</span>
                <span>Experience</span>
                <span>Salary</span>
                <span>Date</span>
                <span>Actions</span>
              </div>

              {jobs.map((job) => (
                <div key={job.id} className="table-row">

                  <div>
                    <h4>{job.jobTitle}</h4>
                    <p>{job.companyName}</p>
                  </div>

                  <span>{job.jobType}</span>
                  <span>{job.experienceLevel}</span>
                  <span>${job.salaryMin} - ${job.salaryMax}</span>

                  {/* ✅ DAYS AGO */}
                  <span className="date-badge">
                    {getDaysAgo(job.postedDate)}
                  </span>

                  <div className="actions">
                    <button onClick={() => handleEdit(job)}>✏️</button>
                    <button onClick={() => handleDelete(job.id)}>🗑️</button>
                    <button onClick={() => handleViewCandidates(job.id)}>
                      👁
                    </button>
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>{isEditing ? "Edit Job" : "Post Job"}</h2>

            <form onSubmit={handleSubmit} className="form-grid">

              <input name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required />
              <input name="companyName" placeholder="Company" value={formData.companyName} onChange={handleChange} required />

              <select name="location" value={formData.location} onChange={handleChange} required>
                <option value="">Location</option>
                <option>Onsite</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>

              <select name="jobType" value={formData.jobType} onChange={handleChange}>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
              </select>

              <input name="salaryMin" placeholder="Min Salary" value={formData.salaryMin} onChange={handleChange} required />
              <input name="salaryMax" placeholder="Max Salary" value={formData.salaryMax} onChange={handleChange} required />

              <input name="experienceLevel" placeholder="Experience" value={formData.experienceLevel} onChange={handleChange} required />
              <input name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} required />

              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">Save</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Postjob;