import React from 'react'
import Sidebar from '../components/Sidebar'
import MonthlyAttendanceDetails_Mainbar from '../components/attendance components/MonthlyAttendanceDetails_Mainbar'

const MonthlyAttendanceDetails = () => {
  return (
    <div className='flex'>

     <div className="bg-gray-100 md:bg-white">
          <Sidebar/>
     </div>

     <MonthlyAttendanceDetails_Mainbar/>

    </div>
  )
}

export default MonthlyAttendanceDetails