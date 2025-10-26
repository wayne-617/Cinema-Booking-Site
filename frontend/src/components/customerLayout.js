import React from 'react';
import Navbar from './customerNav';
import { Outlet } from 'react-router-dom';

export default function CustomerLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />  {}
      </main>
    </>
  );
}
