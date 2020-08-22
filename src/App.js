import React from 'react';
import logo from './logo.png';
import './App.css';

import Header from './components/Header';
import Main from './components/Main.jsx'

function App() {
  return (
    <div className="App TheBody">
      <Header logo={logo} />
      <Main />
    </div>
  );
}

export default App;
