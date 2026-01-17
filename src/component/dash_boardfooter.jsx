import React from "react";
import "./dash_boardfooterr.css";

const DashBoardFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-column">
          <h4>About Us</h4>
          <ul>
            <li>Our Story</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Help Center</h4>
          <ul>
            <li>FAQ</li>
            <li>Support</li>
            <li>Tutorials</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Contact</h4>
          <ul>
            <li>Email Us</li>
            <li>Phone</li>
          </ul>
        </div>
        <div className="footer-icons">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-linkedin-in"></i>
          <i className="fab fa-github"></i>
        </div>
      </div>
    </footer>
  );
};

export default DashBoardFooter;
