import React, { useEffect } from 'react';
import './Home.css';
import Lenis from 'lenis';
import CTASection from '../component/CTASection';
import jobImg from '../assets/job.png'; // Make sure this path is correct

function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); // clean up on unmount
    };
  }, []);
  return (
    <div className="home-container">
      {/* Section 1: Intro */}
      <section className="intro-section">
        <div className="intro-image">
          <img src={jobImg} alt="Job search" />
        </div>
        <div className="intro-text">
          <h2>Find Your Perfect Job</h2>
          <p>
            Discover job opportunities tailored to your skills, experience, and passion. Our platform connects you with the right employers faster than ever.
            Whether you're a seasoned professional or just starting out, our AI-powered matching engine ensures you never miss out on the perfect role.
            From resume optimization to real-time job alerts, we streamline your career journey every step of the way.
          </p>
        </div>
      </section>

      {/* Section 2: Job Matcher Title */}
      <section className="matcher-section">
        <h1 className="matcher-text">JOB MATCHER</h1>
      </section>

      {/* Section 3: Why Choose Us */}
      <section className="why-choose-us">
        <div className="why-left">
          <h2>Why Choose Us?</h2>
          <p>Experience smart job matching tailored to you.</p>
          <button className="learn-more-btn">Learn More</button>
        </div>
        <div className="why-right">
          <div className="feature-card">
            <h3>AI Matching</h3>
            <p>Our platform leverages AI to align your profile with the best opportunities available.</p>
            <a href="#">Show More</a>
          </div>

          <div className="feature-card">
            <h3>Personalized Results</h3>
            <p>We deliver results tailored to your goals, not just generic listings.</p>
            <a href="#">Show More</a>
          </div>

          <div className="feature-card">
            <h3>User-Friendly</h3>
            <p>Our intuitive interface makes job hunting simple and effective.</p>
            <a href="#">Show More</a>
          </div>

          <div className="feature-card">
            <h3>Instant Feedback</h3>
            <p>Receive immediate insights to help you improve and move forward.</p>
            <a href="#">Show More</a>
          </div>
        </div>
      </section>

      {/* Section 4: Resume Analyzer */}
      <section className="analyzer-section">
        <h2 className="analyzer-title">
          The AI-Powered Resume Analyzer <br />
          & Job Matcher revolutionizes <br />
          recruitment with advanced AI <br />
          technology, enhancing job <br />
          matching accuracy and efficiency.
        </h2>
        <button className="btn-outline">Get Started</button>

        <div className="card-grid">
          <div className="card">
            <span
              style={{
                color: 'white',
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              Best Seller
            </span>
          </div>
          <div className="card"></div>
          <div className="card"></div>
        </div>

        <button className="btn-outline">Load More</button>
      </section>

      {/* Section 5: Testimonials */}
      <section className="testimonial-section">
        <h2>What Users Say</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>“Efficient and user-friendly—highly recommend.”</p>
            <strong>Priya Gupta</strong>
            <span>Kratos Portal</span>
          </div>
          <div className="testimonial">
            <p>“I secured interviews thanks to the match score!”</p>
            <strong>Michael Smith</strong>
            <span>Fabrica Khan</span>
          </div>
          <div className="testimonial">
            <p>“An incredible way to streamline recruitment!”</p>
            <strong>Rita Chen</strong>
            <span>Search Cooper</span>
          </div>
        </div>
      </section>

      {/* Section 6: CTA Image Carousel */}
      <CTASection />

      {/* ✅ Section 7: Contact Us */}
      <section className="contact-section">
        <div className="contact-header">
          <h2>Contact Us</h2>
          <p>Have a question or feedback? We'd love to hear from you!</p>
        </div>

        <div className="contact-container">
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>

          <div className="contact-info">
            <h3>Get in Touch – Hiresphere</h3>
            <p><strong>Email:</strong> <a href="mailto:dugulumishra123@gmail.com">dugulumishra123@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+918847892002">+91 88478 92002</a></p>
            <p><strong>Company:</strong> Hiresphere</p>
            <div className="social-icons">
              <a href="https://www.instagram.com/_duguu_58/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/in/jyotiprakash-mishra-470522289/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
