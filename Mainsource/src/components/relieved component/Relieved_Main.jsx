import React from 'react'
import Sidebar from '../Sidebar'
import Relieved_Detail from './Relieved_Detail'

const Relieved_Main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Relieved_Detail />
    </div>
  )
}

export default Relieved_Main
