import React from 'react'
import Sidebar from '../components/Sidebar';
import LeadManagement_Details from '../components/Lead Management/LeadManagement_Details';
import Lead_Sidebar from '../components/Lead_Sidebar';
import Lead_AssignedTo from '../components/Lead Management/Lead_AssignedTo';

const Lead_AssignedTo_Main = () => {
  return (
    <div className="flex ">
      <div className="bg-gray-100 md:bg-white">
        <Lead_Sidebar />
        {/* <Sidebar /> */}
      </div>
     <Lead_AssignedTo/>
    </div>
  );
}

export default Lead_AssignedTo_Main
