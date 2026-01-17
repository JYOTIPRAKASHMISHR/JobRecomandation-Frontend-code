import React, { useState, useEffect, useRef } from "react";
import "./ProfileRecruiter.css";
import Recruiter from "./Recruiter";
import { FaUserCircle } from "react-icons/fa";
import Lenis from "lenis";

const Profile_Recruiter = () => {
  const [recruiter, setRecruiter] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  
  // ✅ Enable Lenis Smooth Scrolling
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
  }, []);

  // ✅ Load recruiter data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const baseData = {
      firstName: storedUser.firstName || "",
      lastName: storedUser.lastName || "",
      email: storedUser.email || "",
      phoneNumber: storedUser.phoneNumber || "",
    };
    setRecruiter(baseData);

    // ✅ Fetch recruiter details from backend by email
    if (storedUser.email) {
      fetch(`http://localhost:8080/api/recruiters/email/${storedUser.email}`)
        .then((res) => res.json())
        .then((data) => setRecruiter((prev) => ({ ...prev, ...data })))
        .catch((err) => console.error("Error fetching recruiter:", err));
    }
  }, []);

  // ✅ Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setRecruiter({ ...recruiter, [e.target.name]: e.target.value });
  };

  // ✅ Save updated recruiter details
  const handleSave = () => {
    fetch("http://localhost:8080/api/recruiters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recruiter),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecruiter(data);
        localStorage.setItem("recruiterDetails", JSON.stringify(data));
        setIsModalOpen(false);
        alert("✅ Profile updated successfully!");
      })
      .catch((err) => console.error("Error saving recruiter:", err));
  };

  return (
    <div className="recruiter-profile-container">
      <Recruiter />

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-icon">
            <FaUserCircle className="user-avatar" />
          </div>
          <h2>Recruiter Profile</h2>
          <button className="edit-btn" onClick={() => setIsModalOpen(true)}>
            Edit
          </button>
        </div>

        <div className="profile-info">
          <p><strong>Name:</strong> {`${recruiter.firstName || "N/A"} ${recruiter.lastName || ""}`.trim()}</p>
          <p><strong>Email:</strong> {recruiter.email || "N/A"}</p>
          <p><strong>Phone:</strong> {recruiter.phoneNumber || "N/A"}</p>
          <p><strong>Company:</strong> {recruiter.companyName || "Not provided"}</p>
          <p><strong>Job Role:</strong> {recruiter.jobRole || "Not provided"}</p>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate" ref={modalRef}>
            <h3>Edit Profile</h3>
            <div className="form-grid">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={recruiter.companyName || ""}
                onChange={handleChange}
              />
              <input
                type="text"
                name="companyWebsite"
                placeholder="Company Website"
                value={recruiter.companyWebsite || ""}
                onChange={handleChange}
              />
              <input
                type="text"
                name="companyAddress"
                placeholder="Company Address"
                value={recruiter.companyAddress || ""}
                onChange={handleChange}
              />
              <input
                type="text"
                name="industry"
                placeholder="Industry"
                value={recruiter.industry || ""}
                onChange={handleChange}
              />
              <input
                type="text"
                name="jobRole"
                placeholder="Job Role"
                value={recruiter.jobRole || ""}
                onChange={handleChange}
              />
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn Profile"
                value={recruiter.linkedin || ""}
                onChange={handleChange}
              />
            </div>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile_Recruiter;
