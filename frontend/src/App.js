import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import HomePage from './container/HomePage';
import DetailForm from './container/DetailForm';
import ShowSchedule from './container/ShowSchedule';
import MySchedule from './container/MySchedule';

function App() {
  return (
    <Router>
      <div className="App">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/add" component={DetailForm} />
            <Route path="/show" component={MySchedule} />
            <Route path="/available" component={ShowSchedule} />
          </Switch>
      </div>
    </Router>
  );
}

export default App;
