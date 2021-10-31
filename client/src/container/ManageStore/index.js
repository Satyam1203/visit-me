import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import "../Login/style.css";
import { useAuth } from "../../App";
import { logout } from "../../helpers/logout";
import { weekDays } from "../Register/Store";
import NavBar from "../../components/NavBar";

function Store() {
  const { setauth, isUser, setIsUser } = useAuth();
  const [storeDeleted, setDeleted] = useState(false);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (storeDeleted) {
      logout(setauth, setIsUser);
    }
  }, [storeDeleted]);

  useEffect(() => {
    axios("/api/store/find/current", {
      method: "POST",
    })
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
        } else {
          console.log(res.data.store);
          setFormData(res.data.store);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const deleteStore = (e) => {
    e.preventDefault();

    axios("/api/store/delete", {
      method: "POST",
    })
      .then((res) => {
        if (res.data.deleted) {
          console.log(res.data.msg);
          setDeleted(res.data.deleted);
        } else {
          console.error(res.data.error);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("manageStoreForm");

    const workingDaysInputs = Array.from(
      document.getElementsByName("working_days")
    );
    const working_days = workingDaysInputs
      .map((el) => (el.checked ? Number(el.value) : null))
      .filter((el) => el !== null);
    console.log(working_days);

    if (parseInt(formData.opens_at) >= parseInt(formData.closes_at)) {
      setStatus("Opening time should be before closing time");
      return;
    } else if (working_days.length === 0) {
      setStatus("Please select working days");
      return;
    }
    setStatus("");

    axios(`/api/store/update`, {
      method: "POST",
      data: { ...formData, working_days },
      "Content-Type": "application/json",
    })
      .then((res) => {
        console.log(res.data);
        setStatus(res.data.msg);
        if (res.data.updated) setFormData({});
      })
      .catch(console.error);
  };

  if (isUser === true) return <Redirect to="/" />;
  else if (isUser === null) return <Redirect to="/login" />;

  return (
    <>
      <NavBar />
      <div className="form-wrapper">
        <h2>Update Store Preferences</h2>
        <form id="manageStoreForm" onSubmit={handleFormSubmit}>
          <div className="input-wrapper">
            <div>Store Name</div>
            <input type="text" value={formData.name || ""} disabled />
          </div>
          <div className="input-wrapper">
            <div>Email</div>
            <input type="email" value={formData.email || ""} disabled />
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
            <div>Opens at</div>
            <input
              type="time"
              value={formData.opens_at || ""}
              onChange={(e) =>
                setFormData({ ...formData, opens_at: e.target.value })
              }
              min="00:00"
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
              min="00:00"
              step="3600"
              required
            />
          </div>
          <div className="input-wrapper">
            <div>Working Days</div>
            <div style={{ textAlign: "left" }}>
              {formData.working_days &&
                weekDays.map((day, i) => (
                  <label className="inline-label" key={i}>
                    <input
                      type="checkbox"
                      name="working_days"
                      value={i}
                      defaultChecked={
                        formData.working_days.includes(i) || false
                      }
                    />
                    {day}
                  </label>
                ))}
            </div>
          </div>
          <div className="input-wrapper">
            <div>Allowed (per hour)</div>
            <input
              type="number"
              value={formData.max_allowed || ""}
              placeholder={8}
              min={1}
              max={12}
              inputMode="numeric"
              onChange={(e) =>
                setFormData({ ...formData, max_allowed: e.target.value })
              }
              required
            />
          </div>
          <div>
            <button className="update-btn" type="submit">
              Update
            </button>
            <button className="delete-btn" onClick={deleteStore} type="button">
              Delete
            </button>
          </div>
        </form>
        <p style={{ color: "red" }}>{status}</p>
      </div>
    </>
  );
}

export default Store;
