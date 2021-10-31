import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "./style.css";
import { useAuth } from "../../App";
import NavBar from "../../components/NavBar";
import Loader from "../../components/Loader";
import UserSchedule from "../UserSchedule";
import StoreSchedule from "../StoreSchedule";

function Index() {
  const { isUser } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const source = axios.CancelToken.source();

    axios(`/api/schedule/find/${isUser ? "user" : "store"}`, {
      method: "POST",
      cancelToken: source.token,
    })
      .then((res) => {
        setLoading(false);
        if (res.data.error) {
          console.log(res.data.error);
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
              {isUser ? (
                <UserSchedule
                  schedule={schedule}
                  deleteAppointment={deleteAppointment}
                />
              ) : (
                <StoreSchedule schedule={schedule} />
              )}
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
