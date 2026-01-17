import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Profile_recruiter from "./pages/Profile_recruiter";
import Header from './component/Header';
import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/candidate_profile'; // Updated import path
import RecruiterProfile from "./pages/recruiter_progile.jsx";
import Postjob from './pages/Postjob';
import Application from './pages/Application';
import Jobmatcher from './pages/Jobmatcher';



function AppContent() {
  const location = useLocation();

  // Hide Header on register and login routes
  const hideHeader = ['/register', '/login','/candidate-dashboard','/candidate-profile','/recruiter-dashboard','/profile-recruiter','/post-job','/job-matches','/applications'].includes(location.pathname);

  return (
    <div className="app-container">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
         <Route path="/candidate-profile" element={<CandidateProfile />} />
        <Route path="/recruiter-dashboard" element={<RecruiterProfile />} />
        <Route path="/profile-recruiter" element={<Profile_recruiter />} />
        <Route path="/post-job" element={<Postjob />} />
        <Route path="/job-matches" element={<Jobmatcher />} />  
        <Route path="/applications" element={<Application />} />  

      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
