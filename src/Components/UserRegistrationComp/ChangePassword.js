import React, { useState } from 'react';
import './ChangePassword.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function validateForm() {
    if (otp === "" || newPassword === "" || confirmPassword === "") {
      setError("All fields are required.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  }

  function handleChangePassword(event) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    fetch("https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Email/verify-otp-reset-password", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp, newPassword, confirmPassword }), // Include confirmPassword here
    })
      .then((response) => response.json().then((data) => ({
        status: response.status,
        body: data
      })))
      .then(({ status, body }) => {
        if (status >= 400 && status < 500) {
          // Handle client-side validation errors
          const errorMessages = body.errors ? Object.values(body.errors).flat().join(" ") : "An error occurred. Please check your input.";
          setError(errorMessages);
          throw new Error(errorMessages);
        }
        toast.success("Password changed successfully!", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/Home");
        }, 1000); // Navigate after 2 seconds to allow the toast to be displayed
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        if (!error.message.includes("An error occurred. Please check your input.")) {
          setError("An error occurred. Please try again later.");
        }
      });
  }

  return (
    <div className="wrapper">
      <div className="containers">
        <div className="change-password-form">
          <h2>Change Password</h2>
          <p>Please enter the OTP sent to your email and set a new password.</p>
          <form onSubmit={handleChangePassword}>
            {error && <div className="error">{error}</div>}
            <div className="form-group">
              <label htmlFor="otp">OTP:</label>
              <input 
                type="text" 
                id="otp" 
                name="otp" 
                value={otp}
                onChange={(e) => { setOtp(e.target.value); setError(""); }}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input 
                type="password" 
                id="newPassword" 
                name="newPassword" 
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                required 
              />
            </div>
            <div className="button">
              <button type="submit">Change Password</button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
