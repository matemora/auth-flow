import React from 'react';
import { ToastContainer } from 'react-toastify';
import Routes from './Routes';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <Routes />
      <ToastContainer />
    </div>
  )
}

export default App;
