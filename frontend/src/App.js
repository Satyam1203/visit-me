import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';

import DetailForm from './container/DetailForm';
import ShowSchedule from './container/ShowSchedule';
import MySchedule from './container/MySchedule';

function App() {
  return (
    <Router>
      <div className="App">
        <h1 style={{textAlign: 'left', color: 'blue'}}>Appointment System</h1>
        <header className="App-header">
          <Switch>
            {/* <Route path="/" exact component={<div>Hello</div>} /> */}
            <Route path="/add" component={DetailForm} />
            <Route path="/show" component={MySchedule} />
            <Route path="/available" component={ShowSchedule} />
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
