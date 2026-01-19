
import Pss_Company_Details from "../components/Pss company components/Pss_Company_Details";
import Sidebar from "../components/Sidebar";


const Pss_company_Mainbar = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Pss_Company_Details/>
    </div>
  );
};

export default Pss_company_Mainbar;
