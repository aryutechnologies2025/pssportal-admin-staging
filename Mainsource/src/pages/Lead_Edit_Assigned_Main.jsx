import React from 'react'
import Lead_Sidebar from '../components/Lead_Sidebar'
import Lead_Edit_Assigned_Details from '../components/Lead Management/Lead_Edit_Assigned_Details'

const Lead_Edit_Assigned_Main = () => {
  return (
     <div className="flex ">
      <div className="bg-gray-100 md:bg-white">
        <Lead_Sidebar />
        {/* <Sidebar /> */}
      </div>
     <Lead_Edit_Assigned_Details />
    </div>
  )
}

export default Lead_Edit_Assigned_Main
