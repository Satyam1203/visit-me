import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Input from "../../components/Input";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  padding: 20px;
`;

const ListSchedule = styled.div`
  table {
    margin: auto;

    th,
    td {
      border: 1px solid black;
      padding: 8px;
    }
  }
`;

function Index() {
  const [date, setDate] = useState("");
  const [schedule, setSchedule] = useState([]);

  const show = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/schedule`,
      data: {
        date,
      },
    })
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.err);
          setSchedule([]);
          // error.current.innerHTML=res.data.err;
        } else {
          console.log(res.data);
          document.querySelector("#form-schedule").reset();
          setSchedule(res.data.timings);
          // error.current.innerHTML='';
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div style={{ height: "95vh" }}>
      <NavBar />
      <h3 style={{ marginTop: "50px" }}>See available list of slots</h3>
      <MainDiv>
        <form id="form-schedule" onSubmit={show}>
          <Input
            type="date"
            upLabel="Date"
            name="date"
            inputMode="none"
            onChange={(e) => setDate(e.target.value)}
            min={`${new Date().getFullYear()}-${
              Number(new Date().getMonth()) < 9
                ? `0${Number(new Date().getMonth()) + 1}`
                : Number(new Date().getMonth()) + 1
            }-${
              Number(new Date().getDate()) < 10
                ? `0${new Date().getDate()}`
                : new Date().getDate()
            }`}
          />
          <Button type="submit">Submit</Button>
        </form>
      </MainDiv>
      {schedule.length ? (
        <ListSchedule>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Available slots</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, i) => (
                <tr key={i}>
                  <td>{s.slot}</td>
                  <td>{s.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ListSchedule>
      ) : null}
    </div>
  );
}

export default Index;
