import React from "react";
import Sidebar from "../components/Sidebar";
import Vacany_Mainbar from "../components/vacancy components/Vacany_Mainbar";

const Vacancy = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Vacany_Mainbar/>
    </div>
  );
};

export default Vacancy;
