import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style.css";

import Button from "../../components/Button";
import Input from "../../components/Input";

function Index() {
  const [stores, setStores] = useState([]);

  const [storeId, setStoreId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const error = useRef();

  useEffect(() => {
    axios("/api/store/find", { method: "GET" })
      .then((res) => {
        console.log(res.data);
        setStores(res.data.stores);
      })
      .catch(console.error);
  }, []);

  const addAppointment = (e) => {
    e.preventDefault();

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
          error.current.innerHTML = res.data.err;
        } else {
          console.log(res.data);
          document.querySelector("#form-add").reset();
          error.current.innerHTML = "";
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

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
            step="1800"
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
