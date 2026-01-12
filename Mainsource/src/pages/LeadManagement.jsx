import React from 'react'
import Sidebar from '../components/Sidebar';
import LeadManagement_Details from '../components/Lead Management/LeadManagement_Details';

const LeadManagement = () => {
  return (
    <div className="flex ">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
     <LeadManagement_Details />
    </div>
  );
}

export default LeadManagement
