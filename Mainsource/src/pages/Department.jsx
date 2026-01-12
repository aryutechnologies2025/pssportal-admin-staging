import React from "react";
import Sidebar from "../components/Sidebar";

import Department_Mainbar from "../components/Department Components/Department_Mainbar";

const Department = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Department_Mainbar/>
    </div>
  );
};

export default Department;
