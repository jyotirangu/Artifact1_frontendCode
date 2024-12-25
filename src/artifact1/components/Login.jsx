import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();  // Initialize navigate

  const handleLogin = () => {
    if (!email || !password || !role) {
      setErrorMessage('Email, password, and role are required!');
      return;
    }
  
    axios
      .post('http://localhost:5000/login', { email, password, role })
      .then((response) => {
        // Store the response data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        

        setSuccessMessage('Login successful!');
        console.log(response.data.user.role)
        // Navigate to /courses
        setTimeout(() => {
          navigate('/courses');  // Navigate to /courses after login
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || 'An error occurred');
      });
  };


  return (
    <div className="formContainer">
      <h1>Login</h1>
      <p>Select Your Role to Access the Portal</p>
      <select
        value={role}
        onChange={(e) => {
          const selectedRole = e.target.value;
          setRole(selectedRole);
        }}
      >
        <option value="" disabled>Select Role</option>
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="Employee">Employee</option>
        <option value="Instructor">Instructor</option> {/* New Role Option */}
      </select>
      <input
        type="text"
        placeholder="Username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <span className="error">{errorMessage}</span>
      <span className="success">{successMessage}</span>
      <div className="buttons">
        <button type="button" onClick={handleLogin}>Login</button>
      </div>
      <a href="#" onClick={() => navigate('/ForgotPassword')}>Forgot Password?</a>
      <div className="account-message">
        <p>Don’t have an account? <a href="#" onClick={()=>{
          navigate('/Signup')
        }}>Create one here</a></p>
      </div>
    </div>
  );
}

export default Login;





// …or create a new repository on the command line
// echo "# InfosysSpringboard" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/jyotirangu/InfosysSpringboard.git
// git push -u origin main

// or push an existing repository from the command line
// git remote add origin https://github.com/jyotirangu/InfosysSpringboard.git
// git branch -M main
// git push -u origin ma