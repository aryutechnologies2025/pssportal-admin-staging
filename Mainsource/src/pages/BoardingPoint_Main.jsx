import React from 'react'
import Sidebar from '../components/Sidebar'
import BoardingPoint_Detail from '../components/boarding point component/BoardingPoint_Detail'

const BoardingPoint_Main = () => {
  return (
    <div className='flex'>
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <BoardingPoint_Detail />
    </div>
  )
}

export default BoardingPoint_Main
