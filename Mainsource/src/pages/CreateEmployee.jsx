import React from "react";
import Sidebar from "../components/Sidebar";
import CreateEmployee_Mainbar from "../components/employees components/CreateEmployee_Mainbar";

const CreateEmployee = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
      <CreateEmployee_Mainbar />
    </div>
  );
};

export default CreateEmployee;
