import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import "../Login/style.css";
import { useAuth } from "../../App";

export const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Store() {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("regForm");
    setStatus("");

    const workingDaysInputs = Array.from(
      document.getElementsByName("working_days")
    );
    const working_days = workingDaysInputs.map((el) => el.value);

    axios(`/api/store`, {
      method: "POST",
      data: { ...formData, working_days },
      "Content-Type": "application/json",
    })
      .then((res) => {
        console.log(res.data);
        setStatus(res.data.msg);
        if (res.data.registered !== undefined) form.reset();
      })
      .catch(console.error);
  };

  if (auth) return <Redirect to="/" />;
  return (
    <>
      <div className="form-wrapper">
        <h2>Register your store</h2>
        <form id="regForm" onSubmit={handleFormSubmit}>
          <div className="input-wrapper">
            <div>Store Name</div>
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
            <div>Opens at</div>
            <input
              type="time"
              value={formData.opens_at || ""}
              onChange={(e) =>
                setFormData({ ...formData, opens_at: e.target.value })
              }
              step="3600"
              required
            />
          </div>
          <div className="input-wrapper">
            <div>Closes at</div>
            <input
              type="time"
              value={formData.closes_at || ""}
              onChange={(e) =>
                setFormData({ ...formData, closes_at: e.target.value })
              }
              step="3600"
              required
            />
          </div>
          <div className="input-wrapper">
            <div>Working Days</div>
            <div style={{ textAlign: "left" }}>
              {weekDays.map((day, i) => (
                <label className="inline-label" key={i}>
                  <input type="checkbox" name="working_days" value={i} />
                  {day}
                </label>
              ))}
            </div>
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

export default Store;
