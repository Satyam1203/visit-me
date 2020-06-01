import React from 'react';
// import logo from './logo.svg';
import './App.css';

import DetailForm from './container/DetailForm';
import ShowSchedule from './container/ShowSchedule';
import MySchedule from './container/MySchedule';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DetailForm/>
        <ShowSchedule />
        <MySchedule />
      </header>
    </div>
  );
}

export default App;
