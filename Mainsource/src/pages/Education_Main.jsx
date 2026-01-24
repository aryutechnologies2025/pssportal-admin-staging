import React from 'react'
import Sidebar from '../components/Sidebar'
import Education_Detail from '../components/education component/Education_Detail'

const Education_Main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Education_Detail />
    </div>
  )
}

export default Education_Main
