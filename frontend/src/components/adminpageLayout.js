import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavBar from "./adminnavBar";  // FIXED EXACT filename

export default function AdminLayout() {
  return (
    <>
      <AdminNavBar />
      <Outlet />
    </>
  );
}
