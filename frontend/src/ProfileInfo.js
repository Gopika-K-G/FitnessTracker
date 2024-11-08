import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Styled Components for Profile Circle and Image
const ProfileCircle = styled.div`
  width: 150px;
  height: 150px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  overflow: hidden;
  border: 2px solid #ddd;
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = () => {
  const location = useLocation(); // Access location state
  const userProfile = location.state; // Get profile data from location.state

  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    age: '',
    height: '',
    weight: '',
    profilePhoto: 'https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg', // Default profile photo URL
    newUsername: '', // Add newUsername for update
  });

  // Pre-populate fields with data passed from location.state
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        fullName: userProfile.fullName || '',
        username: userProfile.username || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        age: userProfile.age || '',
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        profilePhoto: userProfile.profilePhoto || 'https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg', // Use default if no photo passed
        newUsername: userProfile.username || '', // Initialize newUsername as current username
      });
    }
  }, [userProfile]);

  const { fullName, username, email, phoneNumber, age, height, weight, profilePhoto, newUsername } = profileData;

  // Handle input change for each field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  // Handle form submission to update the user profile
  const handleUpdate = async () => {
    const updatedProfile = {
      fullName,
      username,
      email,
      phoneNumber,
      age,
      height,
      weight,
      profilePhoto,
      newUsername, // Pass the new username here
    };

    try {
      const response = await axios.put('http://localhost:5000/api/updateProfile', updatedProfile); // Backend API call to update profile
      console.log(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center mb-4">
            {/* Profile Photo */}
            <ProfileCircle>
              <ProfileImg src={profilePhoto} alt="Profile" />
            </ProfileCircle>
            <h1>{username}'s Profile</h1>
          </div>
          <div className="card p-4">
            <div className="mb-3">
              <label><i className="fas fa-user"></i> <strong>Username:</strong></label>
              <input
                type="text"
                name="newUsername" // Changed to 'newUsername'
                value={newUsername}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label><i className="fas fa-id-card"></i> <strong>Fullname:</strong></label>
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label><i className="fas fa-envelope"></i> <strong>Email:</strong></label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label><i className="fas fa-phone"></i> <strong>Phone Number:</strong></label>
              <input
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label><i className="fas fa-calendar-alt"></i> <strong>Age:</strong></label>
              <input
                type="number"
                name="age"
                value={age}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label><i className="fas fa-ruler-vertical"></i> <strong>Height:</strong></label>
              <input
                type="number"
                name="height"
                value={height}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label><i className="fas fa-weight"></i> <strong>Weight:</strong></label>
              <input
                type="number"
                name="weight"
                value={weight}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="text-center">
              <button onClick={handleUpdate} className="btn btn-primary">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
