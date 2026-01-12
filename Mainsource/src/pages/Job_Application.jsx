import React from 'react'
import Sidebar from '../components/Sidebar'
import Job_Applications_Mainbar from '../components/vacancy components/Job_Applications_Mainbar'

const Job_Application = () => {

  return (
    <div className='flex'>

      <div>
        <Sidebar/>
      </div>
    
        <Job_Applications_Mainbar/>
      

    </div>
  )
}

export default Job_Application