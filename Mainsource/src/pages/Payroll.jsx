import React from "react";
import Sidebar from "../components/Sidebar";
import Payroll_Mainbar from "../components/payroll components/Payroll_Mainbar";

const Payroll = () => {
  return (
    <div className="flex ">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Payroll_Mainbar />
    </div>
  );
};

export default Payroll;
