import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import "./style.css";
import { useAuth } from "../../App";
import NavBar from "../../components/NavBar";

function Login() {
  const { auth, setauth, setIsUser } = useAuth();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("user");
  const [loginStatus, setLoginStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const requestLogin = (id, pwd, userType = null) => {
    setLoading(true);
    setLoginStatus("");

    axios(`/api/${userType ?? type}/login`, {
      method: "POST",
      data: { email: id, password: pwd },
      "Content-Type": "application/json",
      withCredentials: true,
    })
      .then((res) => {
        setLoginStatus(res.data.msg);
        setLoading(false);
        if (res.data.authenticated && res.data.accessToken !== undefined) {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("isUser", res.data.isUser);
          setIsUser(res.data.isUser);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.accessToken}`;
          setauth(true);
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  const handleFormSubmit = () => {
    if (loading) return;
    if (!email || !password) {
      setLoginStatus("Please enter credentials");
      return;
    }

    requestLogin(email, password);
  };

  const loginAsGuestUser = () => {
    if (loading) return;
    requestLogin("sa@12.com", "12");
  };

  const loginAsGuestStore = () => {
    if (loading) return;
    requestLogin("shah@hmail.com", "12", "store");
  };

  if (auth) return <Redirect to="/" />;
  return (
    <>
      <NavBar />
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
          <label style={{ marginLeft: "16px" }}>
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
        <button onClick={handleFormSubmit} disabled={loading}>
          Log In
        </button>
      </div>
      <span>
        OR <br />
        Log In as
      </span>
      <div>
        <button
          className="form-submit-btn"
          onClick={loginAsGuestUser}
          disabled={loading}
        >
          Guest user
        </button>
        <button
          className="form-submit-btn"
          onClick={loginAsGuestStore}
          disabled={loading}
        >
          Guest store
        </button>
      </div>
    </>
  );
}

export default Login;
