import React from "react";
import Sidebar from "../components/Sidebar";
import Employees_Card from "../components/employees components/Employees_Card";

const Employees = () => {
  return (
    <div className="flex ">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Employees_Card />
    </div>
  );
};

export default Employees;
