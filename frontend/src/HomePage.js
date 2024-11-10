import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HomePage.css'; // For custom styling

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
          <li><Link to="/signup" className="hover-link">Sign Up</Link></li>
          <li><Link to="/login" className="hover-link">Login</Link></li>
        </ul>
      </nav>

      {/* Home Section */}
      <section id="home" className="section home-section">
        <div className="home-content">
          <div className="home-image">
            <img 
              src="https://img.freepik.com/free-vector/male-friends-exercising-gym-together_74855-7600.jpg?ga=GA1.1.1034630086.1726026318&semt=ais_hybrid" 
              alt="Friends exercising" 
              className="exercise-image"
            />
          </div>
          <div className="animated-text">
            <h2>Welcome to Fitness Tracker</h2>
            <p>Track your workouts, set goals, and monitor your progress!</p>
          </div>
        </div>
      </section>

      {/* About Us Section with Carousel */}
      <section id="about" className="section about-section">
        <h2>About Us</h2>
        <p>Our app helps you stay on track with your fitness goals by logging your workouts and giving you insights into your progress.</p>
        <Carousel 
          showThumbs={false} 
          autoPlay 
          interval={3000} 
          infiniteLoop 
          showStatus={false}
        >
          <div>
            <img 
              src="https://img.freepik.com/free-vector/business-man-with-desktop-computer_24877-57668.jpg?t=st=1731251439~exp=1731255039~hmac=cffd42f4acbe21eeba87342a856b3c58e93a1becf53ac682861e2410377bb979&w=740" 
              alt="Workout entry"
            />
            <p className="legend">Enter your workout details</p>
          </div>
          <div>
            <img 
              src="https://img.freepik.com/free-vector/serious-hardworking-employee-standing-middle-side-facing-backward-holding-magnifying-glass-illustration-marketing-strategy-with-graphs-symbols-leadership_1150-40162.jpg?t=st=1731251538~exp=1731255138~hmac=a5c9940ca7df6a8231b0fa3c018b94dda9de1d2150250ea39bf89446d6c555a7&w=740" 
              alt="Monitor progress"
            />
            <p className="legend">Monitor your progress</p>
          </div>
          <div>
            <img 
              src="https://img.freepik.com/free-vector/food-nutritional-quality-abstract-concept-vector-illustration-nutrition-value-health-maintenance-human-metabolism-organic-food-livestock-quality-inspection-certification-abstract-metaphor_335657-2594.jpg?t=st=1731251648~exp=1731255248~hmac=eec4b5b8e11e02d9dcb281485325ba9f18f33ea4f76a75019cca7d9257b57761&w=740" 
              alt="Nutritional info"
            />
            <p className="legend">Know about the nutritional content of your food</p>
          </div>
          <div>
            <img 
              src="https://img.freepik.com/free-vector/media-player-concept-illustration_114360-2852.jpg?t=st=1731251762~exp=1731255362~hmac=1b772453dbbd75540a9bcba08499e67a550c6a34c5488f09fa40237042c4164a&w=740" 
              alt="Watch tutorials"
            />
            <p className="legend">Watch tutorials related to fitness</p>
          </div>
        </Carousel>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <h2>If you have any questions or need help, feel free to reach out to our support team!</h2>
          <h2>Contact Us</h2>
          <div className="contact-info">
            <p><i className="fas fa-envelope"></i> Email: support@trackfit.com</p>
            <p><i className="fas fa-phone"></i> Phone: +1 (555) 123-4567</p>
            <p><i className="fas fa-map-marker-alt"></i> Address: 123 Fitness St, Fit City, CA 98765</p>
          </div>
          <div className="social-icons">
            <a href="mailto:support@trackfit.com" className="social-link"><i className="fas fa-envelope"></i></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
        <p className="footer-note">© 2024 TrackFit. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
