import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";

import logo from "../../logo.svg";
import { useAuth } from "../../App";

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 1rem;
  align-items: center;
  background-color: darkslateblue;
  color: #fff;

  h2 {
    margin: 0;
  }

  .dropdown-select {
    display: inline-block;
    padding: 10px;
    cursor: pointer;
    .register-links {
      display: none;
      background: white;
      position: absolute;
      margin-top: 10px;
      margin-left: -120px;
      z-index: 1;
      border: 1px solid grey;
      border-radius: 12px 0 12px 12px;
      width: max-content;
      padding: 12px;
      a {
        background: darkslateblue;
      }
    }

    &:hover,
    &:active {
      .register-links {
        display: grid;
        grid-gap: 2px;
      }
    }
  }

  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    padding: 10px;

    &:hover {
      color: #ddd;
    }
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 20px;
    }
    .nav-links {
      font-size: 14px;
    }
  }
`;

function Index() {
  const { auth, setauth } = useAuth();

  const logout = () => {
    axios("/api/logout", { method: "POST" })
      .then((res) => {
        console.log(res.data);
        if (res.data.authenticated === false) {
          localStorage.removeItem("isUser");
          setauth(res.authenticated);
        }
      })
      .catch(console.error);
  };

  return (
    <Title>
      <h2>
        <img src={logo} height="24" />
        <Link to="/">visit-me</Link>
      </h2>
      <div className="nav-links">
        {auth ? (
          <a onClick={logout}>Logout</a>
        ) : (
          <>
            <div className="dropdown-select">
              Register
              <div className="register-links">
                <Link to="/register/store">Store Registration</Link>
                <Link to="/register/user">User Registeration</Link>
              </div>
            </div>
            <Link to="/login">Log In</Link>
          </>
        )}
      </div>
    </Title>
  );
}

export default Index;
