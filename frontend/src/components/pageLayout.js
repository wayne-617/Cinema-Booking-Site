import React from "react";
import NavBar from "./navBar";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../AuthContext";

export default function PageLayout() {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <main>
          <Outlet />
        </main>
      </AuthProvider>
    </>
  );
}
