import React from "react";
import Sidebar from "../components/Sidebar";
import Setting_Mainbar from "../components/Setting Component/Setting_Mainbar";

const Setting = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Setting_Mainbar />
    </div>
  );
};

export default Setting;