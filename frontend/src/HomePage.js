import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';  // For custom styling

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img 
            src="https://st4.depositphotos.com/1842549/21134/i/450/depositphotos_211344650-stock-photo-running-man-icon-running-man.jpg" 
            alt="Fitness Tracker Logo" 
            className="logo" 
          />
          <h1 className="logo-text">TRACKFIT</h1>
        </div>
        <ul className="navbar-links">
          <li><a href="#home" className="hover-link">Home</a></li>
          <li><a href="#about" className="hover-link">About Us</a></li>
          <li><a href="#contact" className="hover-link">Contact</a></li>
          <li><Link to="/signup" className="hover-link">Sign Up</Link></li>
          <li><Link to="/login" className="hover-link">Login</Link></li>
        </ul>
      </nav>

      {/* Home Section */}
      <section id="home" className="section home-section">
        <header className="hero-section">
          <h2>Welcome to Fitness Tracker</h2>
          <p>Track your workouts, set goals, and monitor your progress!</p>
        </header>
      </section>

      {/* About Us Section */}
      <section id="about" className="section about-section">
        <h2>About Us</h2>
        <p>Our app helps you stay on track with your fitness goals by logging your workouts and giving you insights into your progress.</p>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="section contact-section">
        <h2>Contact Us</h2>
        <p>If you have any questions or need help, feel free to reach out to our support team!</p>
      </section>
    </div>
  );
};

export default HomePage;
