import React, { useState, useEffect } from "react";
import "./ResumeAnalyzer.css";
import CandidateDashboardHeader from "../component/CandidateDashboardHeader";

const ResumeAnalyzer = () => {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dummy data (remove later)
  useEffect(() => {
    setData({
      score: 82,
      sections: [
        { name: "ATS COMPATIBILITY", value: 80, text: "Excellent formatting" },
        { name: "SKILLS MATCH", value: 70, text: "Some gaps identified" },
        { name: "EXPERIENCE", value: 85, text: "Strong progression" },
        { name: "FORMATTING", value: 90, text: "Clean layout" },
      ],
      matchedSkills: ["React", "Java", "Spring Boot", "Git"],
      missingSkills: ["Node.js", "Docker", "AWS"],
      skills: ["React", "Java", "Spring Boot", "REST APIs"],
      education: "B.Tech Computer Science",
      projects: "Laundry App, Portfolio",
      experience: "Software Engineer",
      insight:
        "Strong frontend profile. Improve backend (Node.js, AWS) to become full-stack.",
    });
  }, []);

  const handleAnalyze = async () => {
    if (!file) return alert("Upload resume");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("http://localhost:8080/api/resume/parseResume", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="main-container">
        

      {/* HEADER */}
      <h2 className="page-title1">Career Insight Dashboard</h2>

      {/* UPLOAD BOX */}
      <div className="upload-box">
  <div className="upload-card">

    <div className="upload-icon">📄</div>

    <h3>Upload Your Resume</h3>
    <p className="upload-text">
      Drag & drop your resume or click to browse (PDF only)
    </p>

    <label className="upload-btn">
      Choose File
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        hidden
      />
    </label>

    {file && <p className="file-name">📎 {file.name}</p>}

    <button className="analyze-btn" onClick={handleAnalyze}>
      {loading ? "Analyzing..." : "Analyze Resume"}
    </button>

  </div>
</div>

      {/* MAIN GRID */}
      <div className="layout">

        {/* LEFT SIDE */}
        <div className="left-section">

          {/* SCORE */}
          <div className="score-box">
            <h3>Overall Profile Score</h3>

            <div className="circle">
  <svg width="120" height="120">
    <circle cx="60" cy="60" r="50" className="bg" />
    <circle
      cx="60"
      cy="60"
      r="50"
      className="progress"
     style={{
  strokeDashoffset: 314 - (314 * (data?.score || 0)) / 100,
}}
    />
  </svg>
  <div className="circle-text">
    {data?.score}
  </div>
</div>

            <p className="score-status">
              {data?.score > 80 ? "STRONG PROFILE" : "IMPROVE PROFILE"}
            </p>
          </div>

          {/* BARS */}
          {data?.sections?.map((item, i) => (
            <div key={i} className="progress-card">
              <p>{item.name}</p>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <small>{item.text}</small>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">

          {/* SKILLS */}
          <div className="card-box">
            <h3>Skills Analysis</h3>

            <div className="skills-wrapper">
              <div>
                <p className="good">✔ Matching</p>
                <ul>
                  {data?.matchedSkills?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="bad">✖ Missing</p>
                <ul>
                  {data?.missingSkills?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          
          {/* INSIGHT */}
          <div className="right-section">

  {/* AI INSIGHT (TOP RIGHT BOX) */}
  <div className="card-box highlight-box insight-box">
    <h3>AI Insight</h3>

    <ul>
      {data?.insight?.split("\n").map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  </div>

          {/* RESUME DATA */}
          <div className="card-box">
  <h3>Resume Data Preview</h3>

  {/* Skills */}
  <p><b>Skills:</b> {data?.skills?.join(", ") || "No data"}</p>

  {/* Education */}
  <p><b>Education:</b></p>
  <ul>
    {Array.isArray(data?.education) ? (
      data.education.map((edu, i) => (
        <li key={i}>
          {edu.degree} - {edu.institution} ({edu.year})
        </li>
      ))
    ) : (
      <li>{data?.education || "No data"}</li>
    )}
  </ul>

  {/* Projects */}
  <p><b>Projects:</b></p>
  <ul>
    {Array.isArray(data?.projects) ? (
      data.projects.map((p, i) => (
        <li key={i}>
          {p.title}: {p.description}
        </li>
      ))
    ) : (
      <li>{data?.projects || "No data"}</li>
    )}
  </ul>

  {/* Experience */}
  <p><b>Experience:</b></p>
  <ul>
    {Array.isArray(data?.experience) ? (
      data.experience.map((exp, i) => (
        <li key={i}>
          {exp.role} @ {exp.company} ({exp.duration})
        </li>
      ))
    ) : (
      <li>{data?.experience || "No data"}</li>
    )}
  </ul>
</div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default ResumeAnalyzer;