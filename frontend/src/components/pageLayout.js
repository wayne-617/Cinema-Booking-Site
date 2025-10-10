import React from 'react';
import Navbar from './navBar';
import { Outlet } from 'react-router-dom';

export default function pageLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />  {}
      </main>
    </>
  );
}
