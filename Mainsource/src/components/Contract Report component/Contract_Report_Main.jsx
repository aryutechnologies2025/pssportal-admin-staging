import React from 'react'
import Sidebar from '../Sidebar'
import Contract_Report_Detail from './Contract_Report_Detail'

const Contract_Report_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Contract_Report_Detail />
    </div>
  )
}

export default Contract_Report_main
