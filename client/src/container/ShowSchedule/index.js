import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";

import Loader from "../../components/Loader";
import NavBar from "../../components/NavBar";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { weekDays } from "../Register/Store";

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  padding: 20px;
`;

function Index() {
  const [stores, setStores] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  const [storeId, setStoreId] = useState("");
  const [date, setDate] = useState("");

  const error = useRef();

  useEffect(() => {
    axios("/api/store/find", { method: "GET" })
      .then((res) => {
        console.log(res.data);
        setStores(res.data.stores);
      })
      .catch(console.error);
  }, []);

  const getSchedule = (e) => {
    e.preventDefault();
    setSchedule([]);
    const selectedStore = stores.filter((store) => store._id === storeId);
    const workingDays = selectedStore[0].working_days;
    const day = new Date(date).getDay();

    if (!workingDays.includes(day)) {
      error.current.innerText = `This shop does not open on ${weekDays[day]}`;
      return;
    }

    error.current.innerText = "";
    setLoading(true);
    axios("/api/schedule/find/date", {
      method: "POST",
      data: {
        storeId,
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
          setLoading(false);
          // error.current.innerHTML='';
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <NavBar />
      <div style={{ height: "95vh" }}>
        <h3 style={{ marginTop: "50px" }}>See available list of slots</h3>
        <MainDiv>
          <form id="form-schedule" onSubmit={getSchedule}>
            <select
              name="store"
              className="input-div"
              onChange={(e) => setStoreId(e.target.value)}
              required
            >
              {stores.length > 0 && [
                <option value="" key="0">
                  Select Store
                </option>,
                stores.map((store) => (
                  <option value={store._id} key={store._id}>
                    {store.name}
                  </option>
                )),
              ]}
            </select>
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
                Number(new Date().getDate() + 1) < 10
                  ? `0${new Date().getDate() + 1}`
                  : new Date().getDate() + 1
              }`}
            />
            <Button type="submit">Submit</Button>
          </form>
          <span ref={error} style={{ color: "red" }}></span>
        </MainDiv>
        {loading ? (
          <Loader />
        ) : (
          schedule.length > 0 && (
            <div className="table">
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
            </div>
          )
        )}
      </div>
    </>
  );
}

export default Index;
