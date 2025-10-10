import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import SignIn from './components/loginPage';
import Register from './components/Register';
import CongratsPage from './components/congratsPage';
import WelcomePage from './components/welcomePage';
import MoviesPage from './components/moviesPage';
import ShowtimesPage from './components/showtimesPage';
import TheatersPage from './components/theatersPage';
import NotFoundPage from './components/notFoundPage';
import Layout from './components/pageLayout';

import './app.css'; 

function App() {
  return (
    <div className="App">

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/admin" element={<NotFoundPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/congrats" element={<CongratsPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/showtimes" element={<ShowtimesPage />} />
          <Route path="/theaters" element={<TheatersPage />} />
        {<Route path="*" element={<NotFoundPage />} /> }
        </Route>
      </Routes>
    </div>
  );
}

export default App;