import React from "react";
import "./style.css";

function index({ inline }) {
  return (
    <div className={`loader-bubble ${inline && "inline"}`}>
      <div className="bubble">
        <div className="bubble-child bubble-first"></div>
      </div>
      <div className="bubble">
        <div className="bubble-child bubble-second"></div>
      </div>
      <div className="bubble">
        <div className="bubble-child bubble-third"></div>
      </div>
    </div>
  );
}

export default index;
