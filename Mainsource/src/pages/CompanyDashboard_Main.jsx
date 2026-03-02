
import { useNavigate } from "react-router-dom";
import CompanyDashboard_Details from "../components/company dashboard component/CompanyDashboard_Details";
import Sidebar from "../components/Sidebar";

const CompanyDashboard_Main = () => {
  
  
  return (
    <div className="flex  ">
      <div className="bg-gray-100 h-screen md:bg-white">
        <Sidebar />
      </div>

      <CompanyDashboard_Details />
    </div>
  );
};

export default CompanyDashboard_Main;
