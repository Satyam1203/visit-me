import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "./style.css";
import { useAuth } from "../../App";
import NavBar from "../../components/NavBar";

function Index() {
  const { isUser } = useAuth();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    axios("/api/schedule/find/user", {
      method: "POST",
      cancelToken: source.token,
    })
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.err);
          setSchedule([]);
        } else {
          console.log(res.data);
          setSchedule(res.data.schedule);
        }
      })
      .catch((e) => {
        console.error(e);
      });
    return () => {
      source.cancel("due to unmounting");
    };
  }, []);

  const deleteAppointment = (id) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/remove-appt/${id}`,
    })
      .then((res) => {
        if (res.data.msg) {
          console.log(res.data.msg);
        } else console.error(res.data.err);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (!isUser) return <Redirect to="/" />;

  return (
    <>
      <NavBar />
      <div style={{ height: "95vh" }}>
        <h3 style={{ marginTop: "50px" }}>My appointments</h3>
        <div>
          {schedule?.length > 0 && (
            <div className="table">
              <table cellSpacing={0} cellPadding={10}>
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Visiting Date</th>
                    <th>Time Slot</th>
                    <th>Booking Date</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((dt, i) => (
                    <tr key={i}>
                      <td>{dt.store.name}</td>
                      <td>{new Date(dt.date).toLocaleDateString()}</td>
                      <td>
                        {parseInt(dt.time)}:00 - {parseInt(dt.time) + 1}:00
                      </td>
                      <td>{new Date(dt.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
