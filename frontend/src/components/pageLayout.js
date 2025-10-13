import React from 'react';
import NavBar from './navBar';
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