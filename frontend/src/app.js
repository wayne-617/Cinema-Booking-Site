import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import CustomerLayout from './components/customerLayout';
import AdminLayout from './components/adminpageLayout';
import Layout from './components/pageLayout';

import SignIn from './components/loginPage';
import WrongLoginPage from './components/wrongLogin';
import Register from './components/Register';
import CongratsPage from './components/congratsPage';
import WelcomePage from './components/welcomePage';
import MoviesPage from './components/moviesPage';
import MovieDescription from './components/movieDescription';
import ShowtimesPage from './components/showtimesPage';
import TheatersPage from './components/theatersPage';
import NotFoundPage from './components/notFoundPage';

import AdminDashboard from './components/dashboardPage';
import AdminUsers from './components/adminUsers';
import AdminPromotions from './components/adminPromotions';
import AdminMovies from './components/adminMovies';

import OrderSummaryPage from './components/orderSummaryPage';
import CheckoutPage from './components/checkoutPage';
import OrderConfirmationPage from './components/orderConfirmationPage';
import EditProfilePage from './components/editProfilePage';
import WrongPassPage from './components/wrongPass';
import ForgotPassword from './components/forgetPassword';
import ResetPassword from './components/resetPassword';
import Verify from './components/Verify';
import OrderHistory from "./components/orderHistory";
import SeatSelection from './components/seatSelectionPage';

import './app.css'; 

function App() {
  return (
    <div className="App">

      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route element={<Layout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/congrats" element={<CongratsPage />} />

          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movieDescription/:id" element={<MovieDescription />} />

          <Route path="/showtimes" element={<ShowtimesPage />} />
          <Route path="/theaters" element={<TheatersPage />} />

          {/* Public seat selection */}
          <Route path="/seat-selection/:showtimeId" element={<SeatSelection />} />

          <Route path="/forgetPassword" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/verify" element={<Verify />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>


        {/* ---------- ADMIN ROUTES ---------- */}
        <Route element={<AdminLayout />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminmovies" element={<AdminMovies />} />
          <Route path="/adminpromotions" element={<AdminPromotions />} />
          <Route path="/adminusers" element={<AdminUsers />} />

          <Route path="/admin/orders" element={<OrderHistory />} />
        </Route>


        {/* ---------- CUSTOMER ROUTES ---------- */}
        <Route element={<CustomerLayout />}>
          {/* Redirect base /customer → /customer/movies */}
          <Route path="/customer" element={<WelcomePage />} />

          <Route path="/customer/movies" element={<MoviesPage />} />
          <Route path="/customer/movieDescription/:id" element={<MovieDescription />} />

          <Route path="/customer/showtimes" element={<ShowtimesPage />} />
          <Route path="/customer/theaters" element={<TheatersPage />} />

          <Route path="/customer/seat-selection/:showtimeId" element={<SeatSelection />} />

          {/* Order flow */}
          <Route path="/customer/order-summary" element={<OrderSummaryPage />} />
          <Route path="/customer/checkout" element={<CheckoutPage />} />
          <Route path="/customer/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/customer/orders" element={<OrderHistory />} />

          {/* Profile */}
          <Route path="/customer/editProfile" element={<EditProfilePage />} />
        </Route>

      </Routes>


    </div>
  );
}

export default App;
