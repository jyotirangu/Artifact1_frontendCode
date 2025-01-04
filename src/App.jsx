import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './artifact1/components/Login';
import Signup from './artifact1/components/Signup';
import ForgotPassword from './artifact1/components/ForgotPassword';
import Addcourses from './artifact2/components/courses';
import Homepage from './artifact2/components/Homepage';
import NavBar from './artifact2/components/Navbar';
import ViewCourseData from "./artifact2/components/ViewCourse";
import AuditTrail from "./artifact2/components/AuditTrail";
import UserManagement from './artifact2/components/UserManagement';


function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isSecurityQuestionVisible, setIsSecurityQuestionVisible] = useState(false);

  const showSignup = () => setCurrentPage('signup');
  const showLogin = () => {
    setCurrentPage('login');
    setIsSecurityQuestionVisible(false);
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/courses" element={<Addcourses />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/Navbar" element={<NavBar/>}  />   
      <Route path="/ViewCourse" element={<ViewCourseData />} />
      <Route path="/AuditTrail" element={<AuditTrail />} />
      <Route path="/UserManagement" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
