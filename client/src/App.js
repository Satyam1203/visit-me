import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import NavBar from "./components/NavBar";
import HomePage from "./container/HomePage";
import DetailForm from "./container/DetailForm";
import ShowSchedule from "./container/ShowSchedule";
import MySchedule from "./container/MySchedule";
import Login from "./container/Login";
import RegisterUser from "./container/Register/User";
import RegisterStore from "./container/Register/Store";
import NotFound from "./components/NotFound";
import Footer from "./container/Footer";

import authInit from "./helpers/authInit";

const Auth = createContext();

export function useAuth() {
  const context = useContext(Auth);
  if (context === undefined) {
    throw new Error("useAuth should be used within a provider ");
  }
  return context;
}

function App() {
  const [auth, setauth] = useState(false);

  useEffect(() => authInit(setauth), []);

  return (
    <div className="App">
      <Auth.Provider value={{ auth, setauth }}>
        <Router>
          <NavBar auth={auth} />
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/add" component={DetailForm} />
            <Route path="/show" component={MySchedule} />
            <Route path="/available" component={ShowSchedule} />
            <Route path="/login" component={Login} />
            <Route path="/register/user" component={RegisterUser} />
            <Route path="/register/store" component={RegisterStore} />
            <Route path="*" component={NotFound} />
          </Switch>
          {/* <Footer /> */}
        </Router>
      </Auth.Provider>
    </div>
  );
}

export default App;
