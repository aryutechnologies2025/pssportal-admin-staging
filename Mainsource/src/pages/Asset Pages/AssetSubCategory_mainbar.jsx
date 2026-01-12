import AssetSubCategory_details from "../../components/Asset management components/AssetSubCategory_details"
import Sidebar from "../../components/Sidebar"


const AssetSubCategory_mainbar = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
       <Sidebar />
      </div>
      <AssetSubCategory_details />
    </div>
  )
}

export default AssetSubCategory_mainbar
