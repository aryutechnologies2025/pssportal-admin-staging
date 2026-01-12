import React from 'react'
import Sidebar from '../components/Sidebar';
import Employee_contract_details from '../components/employee contract component/Employee_contract_details';


const Employee_contract_main = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Employee_contract_details/>
    </div>
  );
}

export default Employee_contract_main
