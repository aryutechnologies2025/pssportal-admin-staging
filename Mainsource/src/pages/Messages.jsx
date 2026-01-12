import React from 'react'
import Sidebar from '../components/Sidebar'
import Message_Mainbar from '../components/message components/Message_Mainbar'

const Messages = () => {
  return (
    <div className='flex'>

     <div className="bg-gray-100 md:bg-white">
          <Sidebar/>
     </div>

     <Message_Mainbar/>

    </div>
  )
}

export default Messages