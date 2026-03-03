import Company_Performance_Details from "../components/performance report components/Company_Performance_Details";
import Sidebar from "../components/Sidebar";

const Company_Performance_Main = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Company_Performance_Details/>
    </div>
  );
}

export default Company_Performance_Main
