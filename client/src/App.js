import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import NavBar from "./components/NavBar";
import HomePage from "./container/HomePage";
import DetailForm from "./container/DetailForm";
import ShowSchedule from "./container/ShowSchedule";
import MySchedule from "./container/MySchedule";
import Login from "./container/Login";
import Register from "./container/Register";
import Footer from "./container/Footer";

function App() {
  const [auth, setauth] = useState(false);

  return (
    <Router>
      <div className="App">
        <NavBar auth={auth} />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/add" component={DetailForm} />
          <Route path="/show" component={MySchedule} />
          <Route path="/available" component={ShowSchedule} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
