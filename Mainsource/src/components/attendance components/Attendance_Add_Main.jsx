import React from 'react'
import Sidebar from '../../components/Sidebar'
import Attendance_add_details from './Attendance_Add_Details'


const Attendance_add_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Attendance_add_details/>
    </div>
  )
}

export default Attendance_add_main