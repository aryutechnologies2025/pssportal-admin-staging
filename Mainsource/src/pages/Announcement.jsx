
import Announcement_Mainbar from "../components/announcement/Announcement";
import Sidebar from "../components/Sidebar";


const Announcement_Mainbar_page = () => {
  return (
    <div className="flex">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Announcement_Mainbar/>
    </div>
  );
};

export default Announcement_Mainbar_page;
