// Recruiter.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Recruiter.css";
import { 
  FaBell,
  FaUserCircle,
  FaTachometerAlt,
  FaUserFriends,
  FaStar,
  FaCalendarAlt,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";

const Recruiter = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile-recruiter"); // route path for profile page
  };

  const handlePostjob = () => {
    navigate("/post-job"); // route path for post-job page
  };
const handleDahboard=()=>{
  navigate("/recruiter-dashboard");
};
// const handelcandidateprofile = ()=>{
//   navigate("/candidates/${jobId}"); // route path for candidate list page with jobId parameter
// };
  return (
    <header className="navbar">
      {/* Left - Logo */}
      <div className="navbar-left">
        <h4 className="logo">HIRESPHERE</h4>
      </div>

      {/* Center - Menu */}
      <nav className="navbar-center">
        <ul className="menu">
          <li className="active" onClick={handleDahboard} style={{ cursor: "pointer" }} >
            <FaTachometerAlt /> Dashboard
          </li>
          <li onClick={handlePostjob} style={{ cursor: "pointer" }}>
            <FaPlus /> Post a Job
          </li>
          {/* <li onClick={handelcandidateprofile} style={{ cursor: "pointer" }}>
            <FaUserFriends /> Candidates
          </li> */}
          <li onClick={() => navigate("/shortlisted")} style={{ cursor: "pointer" }}>
            <FaStar /> Shortlist
          </li>
          <li>
            <FaCalendarAlt /> Interviews
          </li>
          <li>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </nav>

      {/* Right - Notifications & Profile */}
      <div className="navbar-right">
        <FaUserCircle
          className="profile-icon"
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    </header>
  );
};

export default Recruiter;
