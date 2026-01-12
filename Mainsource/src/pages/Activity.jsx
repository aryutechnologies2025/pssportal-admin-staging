import Activity_Mainbar from "../components/activity components/Activity_Mainbar";
import Sidebar from "../components/Sidebar";


const Activity = () => {
  return (
    <div className="flex">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Activity_Mainbar />
    </div>
  );
};

export default Activity;
