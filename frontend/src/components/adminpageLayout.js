import React from 'react';
import Navbar from './adminnavBar';
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
