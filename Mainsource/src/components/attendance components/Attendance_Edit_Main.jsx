import React from 'react'
import Sidebar from '../../components/Sidebar'

import Attendance_Edit_Page from './Attendance_Edit_page'


const Attendance_Edit_Main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Attendance_Edit_Page/>
    </div>
  )
}

export default Attendance_Edit_Main