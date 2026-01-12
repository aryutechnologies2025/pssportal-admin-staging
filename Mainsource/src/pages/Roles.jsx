import React from "react";
import Sidebar from "../components/Sidebar";
import Roles_Mainbar from "../components/roles components/Roles_Mainbar";

const Roles = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Roles_Mainbar/>
    </div>
  );
};

export default Roles;
