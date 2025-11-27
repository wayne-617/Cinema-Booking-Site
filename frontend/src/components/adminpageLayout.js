import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavBar from "./adminnavBar"; 

export default function AdminLayout() {
  return (
    <>
      <AdminNavBar />
      <Outlet />
    </>
  );
}
