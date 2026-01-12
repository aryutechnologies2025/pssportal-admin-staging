import React from 'react'
import Sidebar from '../../components/Sidebar'
import Attendance_View_Details from './Attendance_View_Details'


const Attendance_view_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Attendance_View_Details/>
    </div>
  )
}

export default Attendance_view_main