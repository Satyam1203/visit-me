import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "./style.css";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { weekDays } from "../Register/Store";

import { useAuth } from "../../App";

function Index() {
  const { isUser } = useAuth();
  const [stores, setStores] = useState([]);

  const [storeId, setStoreId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const error = useRef();

  useEffect(() => {
    const source = axios.CancelToken.source();

    axios("/api/store/find", { method: "GET", cancelToken: source.token })
      .then((res) => {
        console.log(res.data);
        setStores(res.data.stores);
      })
      .catch(console.error);

    return () => {
      source.cancel("due to unmounting");
    };
  }, []);

  const addAppointment = (e) => {
    e.preventDefault();
    const selectedStore = stores.filter((store) => store._id === storeId);
    const workingDays = selectedStore[0].working_days;
    const day = new Date(date).getDay();

    if (!workingDays.includes(day)) {
      error.current.innerText = `This shop does not open on ${weekDays[day]}`;
      return;
    }
    error.current.innerText = "";

    axios("/api/schedule", {
      method: "POST",
      data: {
        purpose,
        date,
        time,
        storeId,
      },
    })
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.err);
          error.current.innerText = res.data.err;
        } else {
          console.log(res.data);
          document.querySelector("#form-add").reset();
          error.current.innerText = "Slot Booked";
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (!isUser) return <Redirect to="/" />;

  return (
    <div className="add-form" style={{ height: "95vh" }}>
      <h3>Add a Visiting Schedule</h3>
      <div className="form-div">
        <form id="form-add" onSubmit={addAppointment}>
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
            type="text"
            label="Visiting Purpose"
            name="purpose"
            onChange={(e) => setPurpose(e.target.value)}
          />
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
          <Input
            type="time"
            upLabel="Time"
            name="time"
            inputMode="text"
            min={stores?.find((s) => s._id === storeId)?.opens_at}
            max={stores?.find((s) => s._id === storeId)?.closes_at}
            step="3600"
            onChange={(e) => setTime(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </form>
        <span ref={error} style={{ color: "red" }}></span>
      </div>
    </div>
  );
}

export default Index;
