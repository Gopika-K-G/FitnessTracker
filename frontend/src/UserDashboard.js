import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // For making API requests
import Workouts from './Workouts';
import Statistics from './Statistics';
import Tutorials from './Tutorials';
import DietPlan from './DietPlan';
import './UserDashboard.css';

const UserDashboard = () => {
  const location = useLocation();
  const { username } = location.state || { username: 'User' };
  const [activeTab, setActiveTab] = useState('statistics');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's profile data when the component mounts
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://fitnesstracker-6y74.onrender.com/api/profile/${username}`);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const navigateToProfile = () => {
    if (userProfile) {
      // Navigate to the user profile page, passing user data in location state
      navigate('/profile', { state: userProfile });
    }
  };

  const handleLogout = () => {
    // Clear any authentication state here, like user token or session
    // Navigate to the home page after logout
    navigate('/');
  };

  return (
    <div className="user-dashboard"
      style={{
        backgroundImage: 'url("https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-63490.jpg?semt=ais_hybrid")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="header">
        <h1>Welcome, {username}!</h1>
        
        <div className="profile">
          <div className="profile-icon" onClick={navigateToProfile}>👤</div>
          <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        </div>
        
      </div>

      <div className="navbar">
        <button onClick={() => handleTabChange('statistics')} className={activeTab === 'statistics' ? 'active' : ''}>
          Statistics
        </button>
        <button onClick={() => handleTabChange('workouts')} className={activeTab === 'workouts' ? 'active' : ''}>
          Workouts
        </button>
        <button onClick={() => handleTabChange('dietPlan')} className={activeTab === 'dietPlan' ? 'active' : ''}>
          Diet Plan
        </button>
        <button onClick={() => handleTabChange('tutorials')} className={activeTab === 'tutorials' ? 'active' : ''}>
          Tutorials
        </button>
      </div>

      <div className="content">
        {loading ? <p>Loading...</p> : (
          <>
            {activeTab === 'statistics' && <Statistics username={username} />}
            {activeTab === 'workouts' && <Workouts username={username} />}
            {activeTab === 'dietPlan' && <DietPlan username={username} />}
            {activeTab === 'tutorials' && <Tutorials />}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
