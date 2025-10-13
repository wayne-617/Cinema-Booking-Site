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
import AdminLayout from './components/adminpageLayout';
import Dashboard from './components/dashboardPage'
import AdminPromotions from './components/adminPromotions'
import AdminMovies from './components/adminMovies'
import SeatReservationPage from './components/seatReservationPage';
import OrderSummaryPage from './components/orderSummaryPage';
import CheckoutPage from './components/checkoutPage';
import OrderConfirmationPage from './components/orderConfirmationPage';

import './app.css'; 
import EditProfilePage from './components/editProfilePage';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/congrats" element={<CongratsPage />} />
          <Route path="/editProfile" element={<EditProfilePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/showtimes" element={<ShowtimesPage />} />
          <Route path="/theaters" element={<TheatersPage />} />
          <Route path="/seat-reservation/:showtimeId" element={<SeatReservationPage />} />
          <Route path="/order-summary" element={<OrderSummaryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

        {<Route path="*" element={<NotFoundPage />} /> }
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/adminpromotions" element={<AdminPromotions />} />
          <Route path="/adminmovies" element={<AdminMovies />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;