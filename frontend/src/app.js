import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import axios from './api/axiosConfig'; 
import 'bootstrap/dist/css/bootstrap.min.css';

import SignIn from './components/loginPage';
import Register from './components/Register';
import CongratsPage from './components/congratsPage';
import WelcomePage from './components/welcomePage';

import './app.css'; 

function App() {
  return (
    <div className="App">
      {/* <Header /> */}

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
         <Route path="/congrats" element={<CongratsPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;