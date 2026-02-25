import React from 'react'
import Sidebar from '../components/Sidebar';
import LeadManagement_Details from '../components/Lead Assign Report/LeadManagement_Details';
import Lead_Sidebar from '../components/Lead_Sidebar';

const LeadManagement = () => {
  return (
    <div className="flex ">
      <div className="bg-gray-100 md:bg-white">
        <Lead_Sidebar />
        {/* <Sidebar /> */}
      </div>
     <LeadManagement_Details />
    </div>
  );
}

export default LeadManagement
