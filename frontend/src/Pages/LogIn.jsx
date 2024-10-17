import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LogIn() {

  const navigate = useNavigate();
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 

  const submitForm = async (e) => {
    e.preventDefault();
   

    console.log("Submitting:", { email, password });
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login/`, {
        email,
        password,
      });
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      toast.success("Login successful!");
      navigate("/dashboard");

    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData.email ? errorData.email.join(', ') : "Login failed. Please try again.";
        toast.error(errorMsg);
      } else {
        const networkErrorMessage = "Network error. Please try again later.";
        toast.error(networkErrorMessage);
      }
    }
  };

  return (
    <div className="login-Page">
      <div className="container">
        <div className="login-box">

          <img src="login.png" alt="Login Illustration" />
          <h2>Login</h2>

          <form className="login-form" onSubmit={submitForm}>
            <input name="name" type="text" placeholder="Username" required onChange={e => setUsername(e.target.value)} autoComplete="email" />

            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              onChange={e => setPassword(e.target.value.trim())}
              autoComplete="password"
            />
            <div className="eye-logo">
              <button
                type="button"
                onClick={() => setShowPassword(prevState => !prevState)}
                className="eye-button"

              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit">Login</button>
          </form>

          <div className="login-btn">
            <Link to="">Forgot Password?</Link>
          </div>
          <div className="signup-btn">
            <Link to="/signup">Registration</Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default LogIn;