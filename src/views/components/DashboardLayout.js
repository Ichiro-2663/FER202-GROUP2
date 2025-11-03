import React from "react";
import Sidebar from "./Sidebar";



function DashboardLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        {/* <Topbar /> */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;