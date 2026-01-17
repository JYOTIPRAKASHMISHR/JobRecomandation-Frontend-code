import React, { useEffect, useState } from 'react';
import './Header.css';
import logo from '../assets/HsLogo.png';
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate(); // ✅ define navigate

  const [isZoomedIn, setIsZoomedIn] = useState(true); // ✅ move this here

  // ✅ toggle text every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setIsZoomedIn(prev => !prev);
    }, 1000); // 1 second

    return () => clearInterval(interval);
  }, []);

  const handleRegisterClick = () => {
    navigate("/register"); // ✅ go to register page
  };
  const handleLoginClick = () => {
    navigate("/login"); // ✅ go to register page
  };
 // ✅ "Get Started" logic with localStorage check
  const handleGetStarted = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "candidate") {
        navigate("/candidate-dashboard");
      } else if (user.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/"); // fallback if role missing
      }
    } else {
      navigate("/register"); // if no user in localStorage
    }
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>

      <div className={`middle-text ${isZoomedIn ? 'zoom-in' : 'zoom-out'}`}>
        <span>{isZoomedIn ? 'Hiresphere' : 'Smarter Hiring Here'}</span>
      </div>

      <div className="auth-buttons">
         <button className="btn get-started" onClick={handleGetStarted}>🚀 Get Started</button>
        <button className="btn signin" onClick={handleLoginClick}>Login</button>
        <button className="btn signup" onClick={handleRegisterClick}>Register</button>
      </div>
    </nav>
  );
}

export default Header;
