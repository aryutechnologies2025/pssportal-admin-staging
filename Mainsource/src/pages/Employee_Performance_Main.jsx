import Employee_Performance_Details from "../components/performance report components/Employee_Performance_Details";
import Sidebar from "../components/Sidebar";


const Employee_Performance_Main = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Employee_Performance_Details/>
    </div>
  );
}

export default Employee_Performance_Main
