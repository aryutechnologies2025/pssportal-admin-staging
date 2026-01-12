import React from "react";
import Sidebar from "../components/Sidebar";
import Income_History_Mainbar from "../components/finance components/Income_History_Mainbar";

const Income_History = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Income_History_Mainbar />
    </div>
  );
};

export default Income_History;
