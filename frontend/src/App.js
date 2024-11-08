import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './SignUp';
import Login from './Login';
import ProfileInfo from './ProfileInfo';
import UserDashboard from './UserDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<ProfileInfo/>} />
        <Route path="/user-dashboard" element={<UserDashboard/>} />
      </Routes>
    </Router>
  );
};

export default App;
