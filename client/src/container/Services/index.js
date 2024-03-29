import React from "react";
import "./style.css";

import ContentBox from "../../components/ContentBox";

function Index() {
  return (
    <div className="services" id="services-section">
      <h1>Services</h1>
      <ContentBox
        title="Add a visiting schedule"
        description="You can schedule your visit as per your convenience from the touch of a button in this pandemic. This will help us follow social distancing norms by allowing limited number of persons in given time."
        link="/add"
        button="Add Schedule ➡"
        img="https://images.pexels.com/photos/768472/pexels-photo-768472.jpeg?auto=compress&cs=tinysrgb&h=300"
      />

      <ContentBox
        title="See available Slots"
        description="Schedule you visit today by selecting the best available time slot for you according to a particular date. Try this now!"
        link="/available"
        button="See Availability ➡"
        img="https://images.pexels.com/photos/273153/pexels-photo-273153.jpeg?auto=compress&cs=tinysrgb&h=300"
        direction="row-reverse"
      />

      <ContentBox
        title="Manage Appointments"
        description="One place to look for all the appointment/schedules linked to your profile and lookup your schedule and cancel any time before the scheduled day"
        link="/show"
        button="Manage my appoinments ➡"
        img="https://images.pexels.com/photos/162583/work-workplace-office-computer-162583.jpeg?auto=compress&cs=tinysrgb&h=300"
      />
    </div>
  );
}

export default Index;
