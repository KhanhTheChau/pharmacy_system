import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <div className="flex-1 container mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
