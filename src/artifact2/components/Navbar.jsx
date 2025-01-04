import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navbar.css';

const Navbar = () => {

  const data = JSON.parse(localStorage.getItem('user'));
  const userId = data.user.id;
  const userRole = data.user.role;

  return (
    <>
   
      
    <div className="sidebar">
      
      <div>
      <div className="headerD">
        <Link to="/homepage" className="logodashboard">Dashboard</Link> {/* Link to Homepage */}
      </div>
      <nav className="navbar">
        <Link to="/homepage">Home</Link> {/* Link to Home */}
        <Link to="/courses">Courses</Link> {/* Link to Courses */}
        {(userRole == 'HR' || userRole == 'Manager')?(<Link to="/AuditTrail">Audit Trail</Link>):<div></div>}
        {(userRole == 'HR')?(<Link to="/UserManagement">Manage User</Link>):<div></div>}
        <a href="/">Profile</a>
        <a href="/">Settings</a>
        <Link to="/">Logout</Link> {/* Link to Logout */}
      </nav>
      </div>
      <div className="imageCourse">
              <img src="./src/assets/coursebg.png" alt="" srcSet="" width={400} />
      </div>
    </div>
 

    </>
  );
};

export default Navbar;





