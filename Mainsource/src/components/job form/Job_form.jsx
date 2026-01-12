import React from "react";
import Sidebar from "../Sidebar";
import Job_form_details from "./Job_form_details";

const Job_form = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <Job_form_details/>
    </div>
  );
};

export default Job_form;