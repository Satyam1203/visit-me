import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import "./style.css";

function Login({ auth, setauth }) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("user");
  const [loginStatus, setLoginStatus] = useState("");

  const handleFormSubmit = () => {
    console.log(email, password, type);
    if (!email || !password) {
      setLoginStatus("Enter credentials");
      return;
    }
    setLoginStatus("");
    axios(`/api/${type}/login`, {
      method: "POST",
      data: { email, password },
      "Content-Type": "application/json",
      withCredentials: true,
    })
      .then((res) => {
        setLoginStatus(res.data.msg);
        if (res.data.authenticated && res.data.accessToken !== undefined) {
          localStorage.setItem("accessToken", res.data.accessToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.accessToken}`;
          setauth(true);
        }
      })
      .catch(console.error);
  };

  if (auth) return <Redirect to="/" />;
  return (
    <div className="form-wrapper">
      <h2>Log In</h2>
      <div id="loginForm" className="form-item">
        <label>
          Email
          <br />
          <input
            type="text"
            value={email}
            autoFocus
            title="Please enter your registered email"
            onChange={(e) => setemail(e.target.value)}
          />
        </label>
      </div>
      <div className="form-item">
        <label>
          Password
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div className="form-item">
        Login as <br />
        <label>
          <input
            type="radio"
            value="user"
            name="type"
            defaultChecked
            onClick={(e) => setType(e.target.value)}
          />
          User
        </label>
        <label>
          <input
            type="radio"
            value="store"
            name="type"
            onClick={(e) => setType(e.target.value)}
          />
          Store
        </label>
      </div>
      <div style={{ color: "red", fontSize: "12px", height: "20px" }}>
        {loginStatus}
      </div>
      <button onClick={handleFormSubmit}>Log In</button>
    </div>
  );
}

export default Login;
