import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './artifact1.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate()

  const handleSecuritySubmit = () => {
    if (!securityAnswer || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    axios
      .post('http://localhost:5000/forgetpassword', {
        email: email,
        answer: securityAnswer,
        newPassword: password,
      })
      .then(() => {
        setSuccessMessage('Password reset successful!');
        setTimeout(()=>{navigate('/')},2000);
        // navigate('/')
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || 'An error occurred');
      });
  };

  return (
    <div className="formContainer">
        <>
        <h1>Reset Password</h1>
          <p align="center">What is your role model?</p>
          <input
            type="text"
            placeholder="Enter your answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter your resgistered mail id"
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            required
          >  
          </input>
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
        </>
        
          
          
    </div>
  );
}

export default ForgotPassword;