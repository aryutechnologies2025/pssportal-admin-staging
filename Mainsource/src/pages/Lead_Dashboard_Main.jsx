import Lead_Dashboard from "../components/Lead Management/Lead_Dashboard";
import Lead_Sidebar from "../components/Lead_Sidebar";


const Lead_Dashboard_Main = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Lead_Sidebar />
      </div>

      <Lead_Dashboard />
    </div>
  );
};

export default Lead_Dashboard_Main;
