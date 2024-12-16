import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [isSecurityQuestionVisible, setIsSecurityQuestionVisible] = useState(false);

  // Reset form and messages
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('');
    setErrorMessage('');
    setSuccessMessage('');
    setSecurityAnswer('');
  };

  // Show Signup page
  const showSignup = () => {
    resetForm();
    setCurrentPage('signup');
  };

  // Show Login page
  const showLogin = () => {
    resetForm();
    setCurrentPage('login');
    setIsSecurityQuestionVisible(false);
  };

  // Validate Signup form
  const validateSignupForm = (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Email is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return false;
    }
    if (!role) {
      setErrorMessage('Please select a role.');
      return false;
    }

    setErrorMessage('');
    setSuccessMessage('Signup successful! Please log in.');
    setTimeout(showLogin, 2000); // Redirect to login after success message
    return true;
  };

  // Handle Security Question Submission
  const handleSecuritySubmit = () => {
    if (!securityAnswer || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Call backend API for password reset
    axios
      .post('http://localhost:5000/forgetpassword', {
        email: email,
        answer: securityAnswer,
        newPassword: password,
      })
      .then((response) => {
        setSuccessMessage('Password reset successful!');
        setTimeout(() => {
          showLogin(); // Redirect to login after 2 seconds
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || 'An error occurred');
      });
  };

  // Handle Email Validation for Forgot Password
  const handleEmailValidation = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setErrorMessage('Please enter a valid email address.');
    } else {
      setErrorMessage('');
    }
  };

  // Handle Login
  const handleLogin = () => {
    if (!email || !password || !role) {
      setErrorMessage('Email, password, and role are required!');
      return;
    }

    axios
      .post('http://localhost:5000/login', { email, password, role })
      .then((response) => {
        setSuccessMessage('Login successful!');
        setTimeout(() => {
          // Redirect to dashboard or next page
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || 'An error occurred');
      });
  };

  // Handle Signup
  const handleSignup = () => {
    if (!email || !password || !confirmPassword || !role) {
      setErrorMessage('All fields are required.');
      return;
    }

    axios
      .post('http://localhost:5000/register', {
        name: email.split('@')[0], // Use email prefix as name
        email,
        password,
        role,
        answer: securityAnswer, // Optional, in case security question is required
      })
      .then((response) => {
        setSuccessMessage('Signup successful! Please log in.');
        setTimeout(showLogin, 2000); // Redirect to login after success message
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || 'An error occurred');
      });
  };

  return (
    <div className="container">
      {/* Left Section with Vision and Tagline */}
      <div className="leftSection">
        <h1>Upskill Vision</h1>
        <p className="tagline">Empowering You to Achieve More!</p>
      </div>

      {/* Right Section with Form */}
      <div className="rightSection">
        {/* Login Page */}
        {currentPage === 'login' && (
          <div className="formContainer">
            <h1>Login</h1>
            <p>Select Your Role to Access the Portal</p>
            <select
              value={role}
              onChange={(e) => {
                const selectedRole = e.target.value;
                setRole(selectedRole);
                if (selectedRole === 'New User') {
                  showSignup();
                }
              }}
            >
              <option value="" disabled>Select Role</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
              <option value="New User">New User</option>
            </select>
            <input type="text" placeholder="Username" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <span className="error">{errorMessage}</span>
            <span className="success">{successMessage}</span>
            <div className="buttons">
              <button type="button" onClick={handleLogin}>Login</button>
            </div>
            <a href="#" onClick={() => setCurrentPage('forgot-password')}>Forgot Password?</a>
            <div className="account-message">
              <p>Don’t have an account? <a href="#" onClick={showSignup}>Create one here</a></p>
            </div>
          </div>
        )}

        {/* Signup Page */}
        {currentPage === 'signup' && (
          <div className="formContainer">
            <h1>Signup</h1>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>Select Role</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
            <span className="error">{errorMessage}</span>
            <div className="buttons">
              <button onClick={handleSignup}>Signup</button>
            </div>
          </div>
        )}

        {/* Forgot Password Page */}
        {currentPage === 'forgot-password' && !isSecurityQuestionVisible && (
          <div className="formContainer">
            <h1>Forgot Password</h1>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={handleEmailValidation}
              required
            />
            <div className="buttons">
              <button onClick={() => setIsSecurityQuestionVisible(true)}>Submit</button>
            </div>
          </div>
        )}

        {/* Security Question and Reset Password Page */}
        {isSecurityQuestionVisible && currentPage === 'forgot-password' && (
          <div className="formContainer">
            <p>What is your role model?</p>
            <input
              type="text"
              placeholder="Enter your answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="error">{errorMessage}</span>
            <span className="success">{successMessage}</span>
            <div className="buttons">
              <button onClick={handleSecuritySubmit}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;




// echo "# Artifact1_frontendCode" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/jyotirangu/Artifact1_frontendCode.git
// git push -u origin main