import React from "react";
import "./style.css";

function index() {
  return (
    <div className="loader-bubble">
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
