import React, { useState } from 'react';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom'; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function validateForm() {
    if (email === "") {
      setError(<span style={{color:'rgb(171,73,53)'}}>Email is required.</span>);
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError(<span style={{color:'rgb(171,73,53)'}}>Email address is invalid.</span>);
      return false;
    }
    return true;
  }

  function ChangePassword(event) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    console.log(email);
    fetch("https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Email/send-otp", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ To: email }), // Updated to include 'To' field
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid login credentials');
        }
        return response.json();
      })
      .then((data) => {
        console.log("result", data);
        localStorage.setItem("items", JSON.stringify({ email }));
        toast.success("OTP email sent successfully!", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/changePassword");
        }, 1000); // Navigate after 2 seconds to allow the toast to be displayed
      })
      .catch((error) => {
        console.error("error occurred. Please try again later.");
        setError(<span style={{color:'rgb(171,73,53)'}}>Invalid login credentials.</span>);
      });
  }

  return (
    <div className="wrapper">
      <div className="containers">
        <div className="forgot-password-form">
          <h2>Forgot Password</h2>
          <p>Please enter your email address to reset your password.</p>
          <form className="button" onSubmit={ChangePassword}>
            {error && <div className="error">{error}</div>}
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required 
            />
            <div className='button'>
              <button type="submit">Reset Password</button>
            </div>               
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
