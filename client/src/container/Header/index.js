import React from "react";
import "./style.css";

import Button from "../../components/Button";

export default function Index() {
  return (
    <div className="header">
      <div className="title">
        <h1 style={{ padding: "10px 0px" }}>visit-me</h1>
        <p>
          Book online appointments for your offline visits. Register now and
          book an appointment to any registered store.
        </p>
        <a href="#services-section">
          <Button borderRadius="2rem">Get started</Button>
        </a>
      </div>
      <div className="arrow-down">
        <a href="#services-section">&#8675;</a>
      </div>
    </div>
  );
}
