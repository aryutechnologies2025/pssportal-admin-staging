import Attendance_Mainbar from "../components/attendance components/Attendance_Mainbar";
import Sidebar from "../components/Sidebar";

const Attendance = () => {
  return (
    <div className="flex">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Attendance_Mainbar />
    </div>
  );
};

export default Attendance;
