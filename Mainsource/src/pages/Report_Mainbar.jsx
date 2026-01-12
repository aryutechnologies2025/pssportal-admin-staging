import Reports_Details from "../components/report components/Reports_Details"
import Sidebar from "../components/Sidebar"

const Reports_Mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Reports_Details/>
    </div>
  )
}

export default Reports_Mainbar