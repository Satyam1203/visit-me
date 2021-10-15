import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import "../Login/style.css";
import { useAuth } from "../../App";

function User() {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStatus("");

    axios(`/api/user`, {
      method: "POST",
      data: formData,
      "Content-Type": "application/json",
    })
      .then((res) => {
        console.log(res.data);
        setStatus(res.data.msg);
      })
      .catch(console.error);
  };

  if (auth) return <Redirect to="/" />;
  return (
    <>
      <div className="form-wrapper">
        <h2>Register yourself</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="input-wrapper">
            <div>Name</div>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="input-wrapper">
            <div>Phone</div>
            <input
              type="text"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              pattern="[0-9]{10}"
              required
            />
          </div>
          <div className="input-wrapper">
            <div>Email</div>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}"
              required
            />
          </div>
          <div className="input-wrapper">
            <div>Password</div>
            <input
              type="password"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <p>{status}</p>
      </div>
    </>
  );
}

export default User;
