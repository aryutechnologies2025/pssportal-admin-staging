import React from 'react'
import Sidebar from '../components/Sidebar'
import Expense_History_Mainbar from '../components/finance components/Expense_History_Mainbar'

const Expense_History = () => {
  return (
   <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar/>
      </div>

      <Expense_History_Mainbar/>
    </div>
  )
}

export default Expense_History