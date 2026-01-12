import React from "react";
import Sidebar from "../components/Sidebar";
import Finance_Mainbar from "../components/finance components/Finance_Mainbar";

const Finance = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Finance_Mainbar />
    </div>
  );
};

export default Finance;
