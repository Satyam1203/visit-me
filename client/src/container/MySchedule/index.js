import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "./style.css";
import { useAuth } from "../../App";
import NavBar from "../../components/NavBar";
import Loader from "../../components/Loader";

function Index() {
  const { isUser } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const source = axios.CancelToken.source();

    axios("/api/schedule/find/user", {
      method: "POST",
      cancelToken: source.token,
    })
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
          setSchedule([]);
        } else {
          console.log(res.data);
          setLoading(false);
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

  const deleteAppointment = (id, idx) => {
    axios("/api/schedule/delete", {
      method: "POST",
      data: { id },
    })
      .then((res) => {
        if (res.data.updated) {
          const updatedSchedule = [...schedule];
          updatedSchedule[idx].active = false;

          setSchedule(updatedSchedule);
          console.log(res.data.msg);
        } else {
          console.error(res.data.error);
        }
        console.log(schedule);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (isUser === null) return <Redirect to="/login" />;
  else if (isUser === false) return <Redirect to="/" />;

  return (
    <>
      <NavBar />
      <div style={{ height: "95vh" }}>
        <h3 style={{ marginTop: "50px" }}>My appointments</h3>
        <div>
          {loading ? (
            <Loader />
          ) : schedule?.length > 0 ? (
            <div className="table">
              <table cellSpacing={0} cellPadding={10}>
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Visiting Date</th>
                    <th>Time Slot</th>
                    <th>Booking Date</th>
                    <th>Status</th>
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
                      <td>
                        {dt.active ? (
                          <button onClick={() => deleteAppointment(dt._id, i)}>
                            Delete
                          </button>
                        ) : (
                          "Inactive"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            "No schedule found"
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
