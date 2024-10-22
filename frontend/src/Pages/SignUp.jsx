import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function SignUp() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        
   
        if (!email || !username || !password || !confirm_password) {
            const networkErrorMessage = "All fields are required.";
            setErrorMessage(networkErrorMessage);
            toast.error(networkErrorMessage);
            return;
        }
        if (password !== confirm_password) {
            const networkErrorMessage = "Passwords do not match.";
            setErrorMessage(networkErrorMessage);
            toast.error(networkErrorMessage);
            return;
        }

        console.log("Submitting:", { email, username, password, confirm_password});

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/signup/`, {
                email,
                username,
                password,
                confirm_password,
            });
            toast.success("Sign Up successful!");
            navigate("/");
            console.log(response)

        } catch (error) {
            if (error.response) {
                setErrorMessage(errorMessage);
                toast.error(errorMessage);
            } else {
                const networkErrorMessage = "Network error. Please try again later.";
                setErrorMessage(networkErrorMessage);
                toast.error(networkErrorMessage);
            }
        }
        
    };
    return (
        <div className="login-Page">
            <div className="container">
                <div className="login-box">
                    <img src="login.png" alt="" />
                    <h2>Sign Up</h2>
                    <form className="signUp-form" onSubmit={submitForm}>
                        <input type="text" placeholder="E-mail" autoComplete="email" required onChange={e => setEmail(e.target.value)} />
                        <input type="text" placeholder="Username" autoComplete="Username" required onChange={e => setUsername(e.target.value)} />
                        <input type="password" placeholder="Password" autoComplete="Password" required onChange={e => setPassword(e.target.value)} />
                        <input type="password" placeholder="Confirm-Password" autoComplete="Confirm-Password" required onChange={e => setConfirmPassword(e.target.value)} />
                        <button>Sign Up</button>
                    </form>
                    <div className="login-btn">
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
export default SignUp;