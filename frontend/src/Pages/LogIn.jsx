import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const validUsername = "exotica";
  const validPassword = "123";

  const handleLogin = (e) => {
    e.preventDefault();

    
    if (username === validUsername && password === validPassword) {
      
      localStorage.setItem("userToken", "validUserToken");
      
      
      navigate("/dashboard");
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <img src="login.png" alt="Login" />
        <h2>Member Login</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
        </form>

        <div className="login-btn">
          <Link to="">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
