import React from 'react'
import Sidebar from '../components/Sidebar'
import EmployeeDetails_Mainbar from '../components/employees components/EmployeeDetails_Mainbar'

const EmployeeDetails = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <EmployeeDetails_Mainbar/>
    </div>
  )
}

export default EmployeeDetails