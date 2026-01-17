import React, { useState } from 'react';
import './CTASection.css';

// Import your 5 job images
import img1 from '../assets/frontend.png';
import img2 from '../assets/backend.png';
import img3 from '../assets/devops.png';
import img4 from '../assets/fullstack.png';
import img5 from '../assets/data.png';

const jobImages = [img1, img2, img3, img4, img5];

function CTASection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const handleNext = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % jobImages.length);
      setFade(false);
    }, 200); // Matches fade duration
  };

  const handleBack = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + jobImages.length) % jobImages.length
      );
      setFade(false);
    }, 200);
  };

  return (
    <section className="cta-section">
      {/* Left Section */}
      <div className="cta-left">
        <h1 className="cta-title">Start Now</h1>
        <p className="cta-subtitle">
          Join thousands of professionals using our smart resume & job matcher to land their dream jobs.
        </p>
        <button className="btn-signup">Sign Up</button>
      </div>

      {/* Right Section */}
      <div className="cta-right">
        <div className="job-image-box">
          <img
            src={jobImages[currentIndex]}
            alt={`Job ${currentIndex + 1}`}
            className={`job-image ${fade ? 'fade-in' : ''}`}
          />
        </div>
        <div className="cta-nav-buttons">
          <button className="nav-btn" onClick={handleBack}>← Back</button>
          <button className="nav-btn" onClick={handleNext}>Next →</button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
