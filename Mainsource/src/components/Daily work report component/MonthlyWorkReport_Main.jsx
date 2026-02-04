import React from 'react'
import Sidebar from '../Sidebar'
import MonthlyWorkReport_Detail from './MonthlyWorkReport_Detail'

const MonthlyWorkReport_Main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <MonthlyWorkReport_Detail />
    </div>
  )
}

export default MonthlyWorkReport_Main
