import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../../App";

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 1rem;
  padding-left: 2rem;
  align-items: center;
  background-color: darkslateblue;
  color: #fff;

  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    padding: 10px;

    &:hover {
      color: #eee;
    }
  }
`;

function Index() {
  const { auth } = useAuth();

  return (
    <Title>
      <h2>
        <Link to="/">visit-me</Link>
      </h2>
      <div className="nav-links">
        {auth ? (
          <Link to="/logout">Logout</Link>
        ) : (
          <>
            <Link to="/register/store">Store Registration</Link>
            <Link to="/register/user">User Registeration</Link>
            <Link to="/login">Log In</Link>
          </>
        )}
        <Link to="/">Home</Link>
      </div>
    </Title>
  );
}

export default Index;
