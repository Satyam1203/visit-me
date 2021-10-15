import React from "react";
import "./Input.css";

function Index({ upLabel, ...props }) {
  return (
    <div className="input-div">
      <input {...props} autoComplete="off" required />

      <label htmlFor="name-input" className="label-input">
        <span className="label-text">{props.label}</span>
        <span className="up-label-text">{upLabel}</span>
      </label>
    </div>
  );
}

export default Index;
