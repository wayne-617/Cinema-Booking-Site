import React from 'react';
<<<<<<< HEAD
import NavBar from './navBar';  
=======
import Navbar from './navBar';
>>>>>>> 254b64b (fixed navbar)
import { Outlet } from 'react-router-dom';

export default function PageLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}