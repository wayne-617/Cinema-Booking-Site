import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Layout from './components/pageLayout';
import CustomerLayout from './components/customerLayout';
import SignIn from './components/loginPage';
import Register from './components/Register';
import CongratsPage from './components/congratsPage';
import WelcomePage from './components/welcomePage';
import MoviesPage from './components/moviesPage';
import MovieDescription from './components/movieDescription';
import ShowtimesPage from './components/showtimesPage';
import NotFoundPage from './components/notFoundPage';

import AdminDashboard from './components/dashboardPage';
import AdminUsers from './components/adminUsers';
import AdminPromotions from './components/adminPromotions';
import AdminMovies from './components/adminMovies';
import RequireAdmin from "./components/RequireAdmin";


import OrderSummaryPage from './components/orderSummaryPage';
import CheckoutPage from './components/checkoutPage';
import OrderConfirmationPage from './components/orderConfirmationPage';
import EditProfilePage from './components/editProfilePage';
import ForgotPassword from './components/forgetPassword';
import ResetPassword from './components/resetPassword';
import Verify from './components/Verify';
import OrderHistory from "./components/orderHistory";
import SeatSelection from './components/seatSelectionPage';

import './app.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
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

            {/* Public seat selection */}
            <Route path="/seat-selection/:showtimeId" element={<SeatSelection />} />

            <Route path="/forgetPassword" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/verify" element={<Verify />} />
            

            <Route path="*" element={<NotFoundPage />} />

             {/* ADMIN ROUTES */}
            <Route
              path="/admindashboard"
              element={<RequireAdmin><AdminDashboard /></RequireAdmin>}
            />
            <Route
              path="/adminmovies"
              element={<RequireAdmin><AdminMovies /></RequireAdmin>}
            />
            <Route
              path="/adminpromotions"
              element={<RequireAdmin><AdminPromotions /></RequireAdmin>}
            />
            <Route
              path="/adminusers"
              element={<RequireAdmin><AdminUsers /></RequireAdmin>}
            />
            <Route
              path="/admin/orders"
              element={<RequireAdmin><OrderHistory /></RequireAdmin>}
            />
          </Route>
         


          {/* ---------- CUSTOMER ROUTES ---------- */}
          <Route element={<CustomerLayout />}>
            <Route path="/customer" element={<WelcomePage />} />

            <Route path="/customer/movies" element={<MoviesPage />} />
            <Route path="/customer/movieDescription/:id" element={<MovieDescription />} />
            <Route path="/customer/showtimes" element={<ShowtimesPage />} />

            <Route path="/customer/seat-selection/:showtimeId" element={<SeatSelection />} />

            {/* Order flow */}
            <Route path="/customer/order-summary" element={<OrderSummaryPage />} />
            <Route path="/customer/checkout" element={<CheckoutPage />} />
            <Route path="/customer/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/customer/orders" element={<OrderHistory />} />

            {/* Profile */}
            <Route path="editProfile" element={<EditProfilePage />} />
          </Route>

        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
