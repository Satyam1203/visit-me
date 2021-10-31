import React from "react";

function index({ schedule }) {
  return (
    <table cellSpacing={0} cellPadding={10}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Visiting Date</th>
          <th>Time Slot</th>
          <th>Booking Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((dt, i) => (
          <tr
            key={i}
            className={
              !dt.active || new Date(dt.date) < new Date()
                ? "inactive"
                : undefined
            }
          >
            <td>{dt.user.name}</td>
            <td>{new Date(dt.date).toLocaleDateString()}</td>
            <td>
              {parseInt(dt.time)}:00 - {parseInt(dt.time) + 1}:00
            </td>
            <td>{new Date(dt.created_at).toLocaleDateString()}</td>
            <td>
              {dt.active && new Date(dt.date) >= new Date()
                ? "Active"
                : "Inactive"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default index;
