import React from 'react'
import Sidebar from '../components/Sidebar'
import DailyWorkReport_Details from '../components/Daily work report component/DailyWorkReport_Details'

const DailyWork_Report_Main = () => {
  return (
    <div className='flex'>
      <div>
        <Sidebar />
      </div>
      
      <DailyWorkReport_Details />
    </div>
  )
}

export default DailyWork_Report_Main
