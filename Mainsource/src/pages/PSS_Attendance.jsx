import PSS_AttendanceReport from "../components/PSS_attendance components/PSS_AttendanceReport";
import Sidebar from "../components/Sidebar";

const PSS_Attendance = () => {
  return (
    <div className="flex">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <PSS_AttendanceReport />
    </div>
  );
};

export default PSS_Attendance;
