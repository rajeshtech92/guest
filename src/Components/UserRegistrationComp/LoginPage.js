import React, { useState } from "react";
import "./LoginPage.css";
import { Link } from "@mui/material";
import { useNavigate, useParams  } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { userId } = useParams()
  function validateForm() {
    if (email === "" || password === "") {
      setError(<span style={{color:'rgb(171,73,53)'}}>All fields are required.</span>);
      return false;
    }
    return true;
  }
 
  function loginUser(event) {
    console.log(`Fetching data for userId: ${userId}`);
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    console.log(email, password);
    fetch(`https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Auth/login`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, userId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid login credentials');
        }
        return response.json();
      })
      .then((data) => {
        console.log("result", data.id);
        let id = data.id;
       
        localStorage.setItem('userId', id);
        console.log("here is the id ==>",id);
        localStorage.setItem("items", JSON.stringify({ email, password,id  }));
        toast.success("Login successful!", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/headerHome");
        }, 1000); // Navigate after 1 seconds to allow the toast to be displayed
      })
      .catch((error) => {
        console.error("error occurred. Please try again later.");
        setError(<span style={{color:'rgb(171,73,53)'}}>Invalid login credentials.</span>);
      });
  }
 
  function SignUp() {
    navigate("/register");
  }
 
  function ForGot() {
    navigate("/forgot");
  }
 
  return (
    <div className="back-color">
      <div className="container-fluid">
        <div className="wrappers">
          <div className="titles">
            <span>Login</span>
          </div>
          <form className="input-fields" onSubmit={loginUser}>
            {error && <div className="error">{error}</div>}
            <div className="rows">
              <i className="fa fa-user"></i>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                name="email"
                placeholder="Email or Phone"
                required
              />
            </div>
            <div className="rows" style={{ position: "relative" }}>
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                name="password"
                placeholder="Password"
                required
                style={{ paddingRight: "30px" }}
              />
              <span
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color:"GrayText"
                }}
                title="show/hide(password)"
              ></span>
            </div>
 
            <div className="pass">
              <Link href="#" onClick={ForGot}>
                Forgot password?
              </Link>
            </div>
            <div className="rows button">
              <input type="submit" value="Login" />
            </div>
            <div className="signup-link">
              Not a member?{" "}
              <Link href="#" onClick={SignUp}>
                Signup now
              </Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
 
export default LoginPage;