// EditProfileModal.jsx
import React, { useEffect, useState } from "react";
import "../pages/ProfileRecruiter.css";

const EditProfileModal = ({ onClose, onSave }) => {
  // ---- Profile States ----
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("XYZ Pvt Ltd");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [industry, setIndustry] = useState("Information Technology");
  const [jobRole, setJobRole] = useState("Senior HR Manager");
  const [linkedin, setLinkedin] = useState("");
  const [about, setAbout] = useState("");

  // ---- Skills & Certifications ----
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [expertise, setExpertise] = useState("");

  const [certifications, setCertifications] = useState([]);
  const [certInput, setCertInput] = useState("");

  // ✅ Load recruiter profile directly from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setFormData(parsedUser);
      } catch (error) {
        console.error("❌ Error parsing stored user:", error);
      }
    }
  }, []);

  // ✅ Helper to set all form data
  const setFormData = (data) => {
    setFirstName(data.firstName || "");
    setLastName(data.lastName || "");
    setEmail(data.email || "");
    setPhone(data.phone || data.phoneNumber || "");
    setCompanyName(data.companyName || "XYZ Pvt Ltd");
    setCompanyWebsite(data.companyWebsite || "");
    setCompanyAddress(data.companyAddress || "");
    setIndustry(data.industry || "Information Technology");
    setJobRole(data.jobRole || "Senior HR Manager");
    setLinkedin(data.linkedin || "");
    setAbout(data.about || "");
    setSkills(data.skills || []);
    setCertifications(data.certifications || []);
  };

  // ---- Skills Handlers ----
  const handleAddSkill = () => {
    if (skillInput.trim() && expertise) {
      setSkills([...skills, { skill: skillInput.trim(), level: expertise }]);
      setSkillInput("");
      setExpertise("");
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // ---- Certifications Handlers ----
  const handleAddCert = () => {
    if (certInput.trim()) {
      setCertifications([...certifications, certInput.trim()]);
      setCertInput("");
    }
  };

  const handleRemoveCert = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // ✅ Save recruiter profile (localStorage only)
  const handleSave = (e) => {
    e.preventDefault();

    const recruiterData = {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      companyWebsite,
      companyAddress,
      industry,
      jobRole,
      linkedin,
      about,
      skills,
      certifications,
    };

    // Save directly to localStorage
    localStorage.setItem("user", JSON.stringify(recruiterData));
    if (onSave) onSave(recruiterData);

    alert("✅ Profile saved successfully!");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Recruiter Profile</h2>

        <form className="edit-form" onSubmit={handleSave}>
          {/* Read-only section */}
          <fieldset className="readonly-section">
            <legend>Basic Info (Read-only)</legend>
            <label>
              First Name:
              <input type="text" value={firstName} readOnly />
            </label>
            <label>
              Last Name:
              <input type="text" value={lastName} readOnly />
            </label>
            <label>
              Email:
              <input type="email" value={email} readOnly />
            </label>
            <label>
              Phone:
              <input type="text" value={phone} readOnly />
            </label>
          </fieldset>

          {/* Editable section */}
          <fieldset>
            <legend>Company Info</legend>
            <label>
              Company Name:
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </label>

            <label>
              Company Website:
              <input
                type="url"
                placeholder="https://company.com"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </label>

            <label>
              Company Address:
              <textarea
                rows="2"
                placeholder="City, Country"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </label>

            <label>
              Industry:
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </label>

            <label>
              Your Job Role:
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </label>
          </fieldset>
{/* ---- Skills Section ---- */}
<fieldset className="fieldset-wrapper">
  <legend>Skills & Expertise</legend>
  <div className="skills-wrapper">
    <input
      type="text"
      placeholder="e.g. Recruitment"
      className="skill-input"
      value={skillInput}
      onChange={(e) => setSkillInput(e.target.value)}
    />
    <select
      className="expertise-select"
      value={expertise}
      onChange={(e) => setExpertise(e.target.value)}
    >
      <option value="">Select Level</option>
      <option value="Beginner">Beginner</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Advanced">Advanced</option>
      <option value="Expert">Expert</option>
    </select>
    <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
      + Add
    </button>
  </div>

  {skills.length > 0 && (
    <ul className="skills-list">
      {skills.map((item, index) => (
        <li key={index} className={`skill-chip ${item.level.toLowerCase()}`}>
          <span>{item.skill}</span>
          <span className="level">({item.level})</span>
          <button type="button" className="remove-skill" onClick={() => handleRemoveSkill(index)}>
            ✖
          </button>
        </li>
      ))}
    </ul>
  )}
</fieldset>

{/* ---- Certifications Section ---- */}
<fieldset className="fieldset-wrapper">
  <legend>Certifications</legend>
  <div className="cert-wrapper">
    <input
      type="text"
      placeholder="Enter certification"
      className="cert-input"
      value={certInput}
      onChange={(e) => setCertInput(e.target.value)}
    />
    <button type="button" className="add-cert-btn" onClick={handleAddCert}>
      + Add
    </button>
  </div>

  {certifications.length > 0 && (
    <ul className="cert-list">
      {certifications.map((cert, index) => (
        <li key={index} className="cert-chip">
          <span>{cert}</span>
          <button type="button" className="remove-cert" onClick={() => handleRemoveCert(index)}>
            ✖
          </button>
        </li>
      ))}
    </ul>
  )}
</fieldset>

          <fieldset>
            <legend>Additional Info</legend>
            <label>
              LinkedIn Profile:
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </label>

            <label>
              About You:
              <textarea
                rows="3"
                placeholder="Briefly describe yourself and your work..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>
          </fieldset>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
