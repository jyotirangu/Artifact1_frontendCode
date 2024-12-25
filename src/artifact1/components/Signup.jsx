import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [roleModel, setRoleModel] = useState(''); // New state for the role model answer
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate()

  const handleSignup = () => {
    if (!email || !password || !confirmPassword || !role || !roleModel) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    axios
      .post('http://localhost:5000/register', {
        name: email.split('@')[0],
        email,
        password,
        role,
        answer: roleModel, // Send the role model answer in the request
      })
      .then((response) => {
        setSuccessMessage('Signup successful! Please log in.');
        setTimeout(() => {
          navigate("/");  // Navigate to login
          console.log("Navigated to login page");
        }, 2000);

        // navigate('/');  // Navigate to login immediately
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || 'An error occurred');
      });
  };

  return (
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
        <option value="Instructor">Instructor</option>
      </select>

      {/* Security Question */}
      <input
        type="text"
        placeholder="Who is your role model?"
        value={roleModel}
        onChange={(e) => setRoleModel(e.target.value)}
        required
      />
      
      {/* <span className="error">{errorMessage}</span> */}
      <div className="buttons">
        <button onClick={handleSignup}>Signup</button>
        
      </div>
      {successMessage && <span className="success">{successMessage}</span>}
    </div>
  );
}

export default Signup;
