import React from "react";

import Privileges_Mainbar from "../components/Privilege components/Privileges_Mainbar";
import Sidebar from "../components/Sidebar";


const Permission = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar/>
      </div>

      <Privileges_Mainbar />
    </div>
  );
};

export default Permission;
