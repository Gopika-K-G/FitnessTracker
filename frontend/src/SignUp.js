import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Assuming you have a separate CSS file for custom styles

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    age: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Password validation logic
    if (name === 'password') {
      const isValid = validatePassword(value);
      setPasswordValid(isValid);
      setPasswordTouched(true);
    }

    // Check if passwords match
    if (name === 'confirmPassword') {
      setPasswordsMatch(value === formData.password);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!validatePassword(formData.password)) {
      alert('Password does not meet the requirements!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Sending form data to the server to create a new user
      const response = await axios.post('https://fitnesstracker-6y74.onrender.com/api/signup', {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password, // Ensure server hashes the password
        height: formData.height,
        heightUnit: formData.heightUnit,
        weight: formData.weight,
        weightUnit: formData.weightUnit,
        age: formData.age,
        role: 'user', // Default role
      });

      if (response.data.success) {
        console.log('User added with ID: ', response.data.userId);
        alert('Now you can login using your account');
        navigate('/'); // Redirect to the home page after registration
      } else {
        alert('Error creating user: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error creating user: ', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
            <h2 className="mb-4 text-center">Create Account</h2>

            {/* Full Name */}
            <div className="form-group mb-3">
              <label htmlFor="fullName" className="form-label">
                <i className="fas fa-user"></i> Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </div>

            {/* Username */}
            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">
                <i className="fas fa-user-circle"></i> Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                <i className="fas fa-envelope"></i> Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                <i className="fas fa-phone"></i> Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="^\d{10}$" // Validate a 10-digit phone number
                placeholder="Phone number"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group mb-3 position-relative">
              <label htmlFor="password" className="form-label">
                <i className="fas fa-lock"></i> Password
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'} // Toggle visibility
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordTouched(true)}
                placeholder="Create password"
                required
              />
              <i
                className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'} position-absolute`}
                style={{ right: '10px', top: '35px', cursor: 'pointer' }}
                onClick={() => setPasswordVisible(!passwordVisible)}
              ></i>
              {passwordTouched && (
                <div className={`password-requirements ${passwordValid ? 'text-success' : 'text-danger'}`}>
                  <small>
                    Password must be at least 8 characters, contain at least one uppercase
                    letter, one lowercase letter, one number, and one special character.
                  </small>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group mb-3 position-relative">
              <label htmlFor="confirmPassword" className="form-label">
                <i className="fas fa-lock"></i> Confirm Password
              </label>
              <input
                type={confirmPasswordVisible ? 'text' : 'password'} // Toggle visibility
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
              <i
                className={`fas ${confirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} position-absolute`}
                style={{ right: '10px', top: '35px', cursor: 'pointer' }}
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              ></i>
              {!passwordsMatch && (
                <div className="text-danger">
                  <small>Passwords do not match!</small>
                </div>
              )}
            </div>
            
             {/* Age */}
             <div className="form-group mb-3">
              <label htmlFor="age" className="form-label">
                <i className="fas fa-birthday-cake"></i> Age
              </label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                required
              />
            </div>
            
            {/* Height */}
            <div className="form-group mb-3">
              <label htmlFor="height" className="form-label">
                <i className="fas fa-ruler"></i> Height
              </label>
              <div className="d-flex">
                <input
                  type="number"
                  className="form-control me-2"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height"
                />
                <select
                  className="form-control"
                  name="heightUnit"
                  value={formData.heightUnit}
                  onChange={handleChange}
                >
                  <option value="cm">cm</option>
                  <option value="inches">inches</option>
                </select>
              </div>
            </div>

            {/* Weight */}
            <div className="form-group mb-3">
              <label htmlFor="weight" className="form-label">
                <i className="fas fa-weight"></i> Weight
              </label>
              <div className="d-flex">
                <input
                  type="number"
                  className="form-control me-2"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight"
                />
                <select
                  className="form-control"
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleChange}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
              />
              <label className="form-check-label" htmlFor="termsAccepted">
                I accept the terms and conditions
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
