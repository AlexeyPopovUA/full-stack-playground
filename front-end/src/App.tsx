import React from 'react';

// @ts-ignore
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Counter</p>
        <p>
          "123"
        </p>
        <button>Increment</button>
      </header>
    </div>
  );
}

export default App;
