import React from 'react'
import Lead_Add_Assigned_Details from '../components/Lead Management/Lead_Add_Assigned_Details'
import Lead_Sidebar from '../components/Lead_Sidebar'

const Lead_Add_Assigned_Main = () => {
  return (
 <div className="flex ">
      <div className="bg-gray-100 md:bg-white">
        <Lead_Sidebar />
        {/* <Sidebar /> */}
      </div>
     <Lead_Add_Assigned_Details />
    </div>
  )
}

export default Lead_Add_Assigned_Main
