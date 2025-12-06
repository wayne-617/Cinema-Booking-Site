import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Layout from './components/pageLayout';
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

import MoviesPageShows from './components/moviePageShows';
import OrderSummaryPage from './components/orderSummaryPage';
import CheckoutPage from './components/checkoutPage';
import OrderConfirmationPage from './components/orderConfirmationPage';
import EditProfilePage from './components/editProfilePage';
import ForgotPassword from './components/forgetPassword';
import ResetPassword from './components/resetPassword';
import Verify from './components/Verify';
import OrderHistory from "./components/orderHistory";
import SeatSelection from './components/seatSelectionPage';
import RequireCustomer from './components/requireCustomer';

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
            <Route path="/movies/showtimes" element={<MoviesPageShows />} />
            <Route path="/movieDescription/:id" element={<MovieDescription />} />

            <Route path="/showtimes" element={<ShowtimesPage />} />

            {/* Public seat selection */}
            <Route path="/seat-selection/:showtimeId" element={<SeatSelection />} />

            <Route path="/forgetPassword" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/verify" element={<Verify />} />

             {/* ---------- CUSTOMER ROUTES ---------- */}
          <Route
            path="/order-summary"
            element={<RequireCustomer><OrderSummaryPage /></RequireCustomer>}
          />
          <Route
            path="/checkout"
            element={<RequireCustomer><CheckoutPage /></RequireCustomer>}
          />
          <Route
            path="/order-confirmation"
            element={<RequireCustomer><OrderConfirmationPage /></RequireCustomer>}
          />
          <Route
            path="/orders"
            element={<RequireCustomer><OrderHistory /></RequireCustomer>}
          />
          <Route
            path="/editProfile"
            element={<RequireCustomer><EditProfilePage /></RequireCustomer>}
          />
            

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

         

        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
