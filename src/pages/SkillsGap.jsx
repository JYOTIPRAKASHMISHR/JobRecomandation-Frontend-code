import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./SkillsGap.css";

const SkillsGap = () => {
  const { state } = useLocation();

  const jobTitle = state?.jobTitle;
  const skills = state?.skills;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
//   const job = location.state?.job; 

const location = useLocation();
const job = location.state?.job;

  const analyzeSkills = async () => {
  if (!jobTitle || !skills) {
    alert("Job data missing");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:8080/api/resume/improveForJob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: Number(localStorage.getItem("userId")),
        jobTitle: jobTitle,
        skills: Array.isArray(skills)
          ? skills.join(", ")
          : skills
      })
    });

    const data = await res.json();
    setResult(data);

  } catch (err) {
    console.error(err);
  }

  setLoading(false);
};
  return (
    <div className="skills-container">
      <h2>📈 Skills Gap Analysis</h2>

      <h3>🎯 Job: {jobTitle || "No job selected"}</h3>

      <button className="analyze-btn" onClick={analyzeSkills}>
        Analyze 🚀
      </button>

      {loading && <p>Analyzing...</p>}

      {result && (
        <div className="result-box">
          <h3>📄 Improved Resume</h3>
          <p>{result.improved_resume}</p>

          <h3>🚀 Suggested Projects</h3>
          {result.projects?.map((p, i) => (
            <div key={i} className="project-card">{p}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsGap;