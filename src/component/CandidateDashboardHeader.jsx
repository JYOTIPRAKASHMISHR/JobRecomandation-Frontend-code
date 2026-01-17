// CandidateDashboardHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CandidateDashboardHeader.css';
import HsLogo from '../assets/HsLogo.png'; // Adjust path based on your project structure

const CandidateDashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="logo-section">
        <img src={HsLogo} alt="HireSphere" className="logo-img" />
        <span className="logo-text">HireSphere</span>
      </div>
      <nav className="nav-links">
        <Link to="/candidate-dashboard">Dashboard</Link>
        <Link to="/resume-analyzer">Resume Analyzer</Link>
        <Link to="/job-matches">Job Matches</Link>
        <Link to="/applications">Applications</Link>
        <Link to="/candidate-profile">Profile</Link>
      </nav>
    </header>
  );
};

export default CandidateDashboardHeader;
