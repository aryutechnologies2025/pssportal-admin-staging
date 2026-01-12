import React from 'react'
import Sidebar from '../components/Sidebar';
import Company_Mainbar from '../components/company components/Company_Mainbar';

const Company = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Company_Mainbar/>
    </div>
  );
}

export default Company
