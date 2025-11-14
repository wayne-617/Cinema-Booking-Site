import React, { createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import SignIn from './components/loginPage';
import Register from './components/Register';
import CongratsPage from './components/congratsPage';
import WelcomePage from './components/welcomePage';
import MoviesPage from './components/moviesPage';
import MovieDescription from './components/movieDescription';
import ShowtimesPage from './components/showtimesPage';
import NotFoundPage from './components/notFoundPage';
import Layout from './components/pageLayout';
import AdminDashboard from './components/dashboardPage';
import AdminUsers from './components/adminUsers';
import AdminPromotions from './components/adminPromotions'
import AdminMovies from './components/adminMovies'
import SeatReservationPage from './components/seatReservationPage';
import OrderSummaryPage from './components/orderSummaryPage';
import CheckoutPage from './components/checkoutPage';
import OrderConfirmationPage from './components/orderConfirmationPage';
import EditProfilePage from './components/editProfilePage';
import ForgotPassword from './components/forgetPassword';
import ResetPassword from './components/resetPassword'
import Verify from './components/Verify';
import './app.css'; 
function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/congrats" element={<CongratsPage />} />
          <Route path="/movieDescription/:id" element={<MovieDescription/>} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/editProfile" element={<EditProfilePage />} />
          <Route path="/showtimes" element={<ShowtimesPage />} />
          <Route path="/seat-reservation/:showtimeId" element={<SeatReservationPage />} />
          <Route path="/forgetPassword" element={<ForgotPassword/>} />
          <Route path="/reset" element={<ResetPassword/>} />
          <Route path="/verify" element={<Verify/>} />
           <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminpromotions" element={<AdminPromotions />} />
          <Route path="/adminmovies" element={<AdminMovies />} />
          <Route path="/adminusers" element={<AdminUsers />} />
          <Route path="/customer" element={<WelcomePage />} />
          <Route path="/editProfilePage" element={<EditProfilePage />} />
          //fix movie desc page to adhere to customer view
          <Route path="/customer/movieDescription/:id" element={<MovieDescription/>} />
          <Route path="/customer/movies" element={<MoviesPage />} />
          <Route path="/customer/showtimes" element={<ShowtimesPage />} />
          //fix reservation to adhere to customer view
          <Route path="/customer/seat-reservation/:showtimeId" element={<SeatReservationPage />} />
            //fix order summary to adhere to customer view
          <Route path="/customer/order-summary" element={<OrderSummaryPage />} />
            //fix checkout to adhere to customer view
          <Route path="/customer/checkout" element={<CheckoutPage />} />
            //fix order confirmation to adhere to customer view
          <Route path="/customer/order-confirmation" element={<OrderConfirmationPage />} />
        {<Route path="*" element={<NotFoundPage />} /> }
          

        </Route>
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;