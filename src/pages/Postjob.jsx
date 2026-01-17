import React, { useState, useEffect } from "react";
import Recruiter from "./Recruiter";
import "./postjob.css";
import {
  FaMapMarkerAlt,
  FaClock,
  FaBriefcase,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const Postjob = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 🆕 track edit mode
  const [editJobId, setEditJobId] = useState(null);  // 🆕 track which job is being edited

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
  const [error, setError] = useState("");

  // ✅ Fetch jobs for recruiter email stored in localStorage
  useEffect(() => {
    fetchJobs();
  }, []);

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

  // ✅ Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle new job post or update existing job
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const recruiterEmail = user?.email;

    if (!recruiterEmail) {
      alert("Recruiter email not found. Please log in again.");
      return;
    }

    const payload = {
      ...formData,
      salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      recruiterEmail,
    };

    try {
      let response;

      if (isEditing && editJobId) {
        // 🆕 UPDATE existing job (PUT)
        response = await fetch(`http://localhost:8080/api/jobs/${editJobId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // 🆕 CREATE new job (POST)
        response = await fetch("http://localhost:8080/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        alert(isEditing ? "✅ Job Updated Successfully!" : "✅ Job Posted Successfully!");
        setShowModal(false);
        setIsEditing(false);
        setEditJobId(null);
        resetForm();
        fetchJobs();
      } else {
        const errorText = await response.text();
        alert(`❌ Operation failed: ${errorText}`);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Error connecting to server!");
    }
  };

  // 🆕 Delete job
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const response = await fetch(`http://localhost:8080/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("🗑️ Job deleted successfully!");
        fetchJobs();
      } else {
        alert("❌ Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Error connecting to server!");
    }
  };

  // 🆕 Edit job — open modal pre-filled
  const handleEdit = (job) => {
    setFormData({
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      location: job.location,
      jobType: job.jobType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      experienceLevel: job.experienceLevel,
      skills: job.skills,
      description: job.description,
    });
    setEditJobId(job.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
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
  };

  // Helper to show "x days ago"
  const getDaysAgo = (postedDate) => {
    if (!postedDate) return "";
    const today = new Date();
    const posted = new Date(postedDate);
    const diffTime = today - posted;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "Today" : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="postjob-page">
      <Recruiter />

      <div className="postjob-container">
        <button
          className="post-job-btn"
          onClick={() => {
            resetForm();
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          Post a Job
        </button>
      </div>

      {/* ✅ Modal Form (for both add + edit) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? "Edit Job" : "Post a New Job"}</h2>
            <form onSubmit={handleSubmit} className="job-form">
              <label>
                Job Title:
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Company Name:
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Work Location:
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option>Onsite</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </label>

              <label>
                Job Type:
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                >
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </label>

              <label>
                Salary Range (USD):
                <div className="salary-range">
                  <input
                    type="number"
                    name="salaryMin"
                    placeholder="Min"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    required
                  />
                  <span>to</span>
                  <input
                    type="number"
                    name="salaryMax"
                    placeholder="Max"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <label>
                Experience Level:
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option>Fresher</option>
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>5+ Years</option>
                </select>
              </label>

              <label>
                Skills (comma separated):
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Job Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {isEditing ? "Update Job" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Posted Jobs */}
      <div className="posted-jobs-container">
  <div className="posted-jobs-header">
    <h2>Posted Jobs</h2>
    <span className="jobs-count">{jobs.length} Jobs</span>
  </div>

  {loading ? (
    <p>Loading jobs...</p>
  ) : error ? (
    <p className="error-text">{error}</p>
  ) : jobs.length === 0 ? (
    <p>No jobs posted yet.</p>
  ) : (
    <div className="job-card-container">
      {jobs.map((job) => (
        <div className="job-card" key={job.id}>
          <div className="job-card-left">
            <h3 className="job-title">{job.jobTitle}</h3>
            <p className="company-name">{job.companyName}</p>

            <div className="job-info">
              <span><FaMapMarkerAlt /> {job.location}</span>
              <span><FaBriefcase /> {job.jobType}</span>
              <span><FaClock /> {job.experienceLevel}</span>
            </div>

            <p className="salary">${job.salaryMin} - ${job.salaryMax}</p>

            <div className="skills">
              {job.skills?.split(",").map((skill, index) => (
                <span key={index} className="skill">{skill.trim()}</span>
              ))}
            </div>

            <p className="description">{job.description}</p>
          </div>

          <div className="job-card-right">
            <div className="actions">
              <button onClick={() => handleEdit(job)}><FaEdit /></button>
              <button onClick={() => handleDelete(job.id)}><FaTrash /></button>
            </div>
            <span className="date-badge">{getDaysAgo(job.postedDate)}</span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
};

export default Postjob;
