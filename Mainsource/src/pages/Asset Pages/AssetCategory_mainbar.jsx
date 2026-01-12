import AssetCategory_details from "../../components/Asset management components/AssetCategory_details"
import Sidebar from "../../components/Sidebar"

const AssetCategory_mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar />
      </div>
      
      <AssetCategory_details />
    </div>
  )
}

export default AssetCategory_mainbar
