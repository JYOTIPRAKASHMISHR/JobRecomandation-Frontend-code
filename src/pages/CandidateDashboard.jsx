import React, { useEffect } from "react";
import Lenis from "lenis"; // 👈 Smooth scroll
import { Link } from "react-router-dom";
import "./CandidateDashboard.css";
import CandidateDashboardHeader from "../component/CandidateDashboardHeader";
import DashBoardFooter from "../component/dash_boardfooter";

const features = [
  {
    icon: "🧠",
    title: "AI Resume Analysis",
    description:
      "Advanced AI analyzes your resume structure, content, and formatting to provide detailed insights and improvement suggestions.",
  },
  {
    icon: "🟩",
    title: "Smart Job Matching",
    description:
      "Our intelligent algorithm matches your skills and experience with relevant job opportunities from top companies.",
  },
  {
    icon: "📈",
    title: "Skills Gap Analysis",
    description:
      "Identify missing skills and get personalized recommendations to improve your career prospects.",
  },
  {
    icon: "📄",
    title: "Resume Optimization",
    description:
      "Get actionable suggestions to optimize your resume for ATS systems and improve your chances of getting hired.",
  },
  {
    icon: "🔔",
    title: "Real-time Alerts",
    description:
      "Receive instant notifications when new job opportunities match your profile and preferences.",
  },
  {
    icon: "📊",
    title: "Application Tracking",
    description:
      "Track your job applications, interview schedules, and follow-up reminders all in one place.",
  },
];

const stats = [
  { icon: "📄", number: "50,000+", label: "Resumes Analyzed" },
  { icon: "💼", number: "25,000+", label: "Jobs Matched" },
  { icon: "😊", number: "15,000+", label: "Happy Users" },
  { icon: "🏆", number: "95%", label: "Success Rate" },
];

const CandidateDashboard = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easing
      smooth: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); // Clean up on unmount
    };
  }, []);

  return (
    <>
      <CandidateDashboardHeader />

      {/* Hero Section */}
      <div className="dashboard-container">
        <div className="hero-section">
          <h1 className="hero-title">
            AI-Powered Resume Analyzer <br /> & Job Matcher
          </h1>
          <p className="hero-description">
            Upload your resume and let our AI analyze your skills, match you
            with perfect job opportunities, and optimize your career prospects
            with intelligent insights.
          </p>
          <div className="hero-buttons">
            <Link to="/resume-analyzer">
              <button className="analyze-button">🚀 Analyze My Resume</button>
            </Link>
            <Link to="/job-matches">
              <button className="find-jobs-button">🔍 Find Jobs</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="ai-features">
        <h2 className="section-title">✨ Powerful AI Features</h2>
        <p className="section-subtitle">
          Leverage cutting-edge AI technology to accelerate your job search and
          career growth
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((item, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{item.icon}</div>
              <h3 className="stat-number">{item.number}</h3>
              <p className="stat-label">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-title">🚀 Ready to Transform Your Career?</h2>
        <p className="cta-subtitle">
          Join thousands of professionals who have successfully landed their
          dream jobs with our AI-powered platform.
        </p>
        <div className="cta-buttons">
          <button className="cta-btn primary">Get Started</button>
          <button className="cta-btn secondary">Learn More</button>
        </div>
      </section>

      <DashBoardFooter />
    </>
  );
};

export default CandidateDashboard;
