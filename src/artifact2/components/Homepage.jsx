import React from 'react';
import Navbar from './Navbar';
import './Homepage.css';

const Homepage = () => {
  const data = JSON.parse(localStorage.getItem('user'));


  return (
    <div className="containerD">
      {/* Left Side: Navbar */}
      <div className="left-side">
        <Navbar />
      </div>

      {/* Right Side: Homepage Interface */}
      <div className="dataD">
        
          <div className="right-side">
          <div className='namebro'>Welcome <br /> {data.user.name.toUpperCase()} <br /> to </div>
            <div className="homepage-content">
              <h1>Upskill Vision</h1>
              <p className="tagline">Empower Your Future with Knowledge</p>
            </div>
          </div>

          <div className="image">
          <img src="./src/assets/bg.png" alt="" srcset="" width={700} />
        </div>

      </div>
      
    </div>
  );
};

export default Homepage;








