import React from "react";
import Sidebar from "../components/Sidebar";
import CreateVacancy_Mainbar from "../components/vacancy components/CreateVacancy_Mainbar";

const CreateVacancy = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <CreateVacancy_Mainbar />
    </div>
  );
};

export default CreateVacancy;
