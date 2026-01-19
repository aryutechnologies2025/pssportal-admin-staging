import Sidebar from "../components/Sidebar";
import Holiday_Mainbar from "../components/holiday_page/Holiday_Mainbar";

const Holiday = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Holiday_Mainbar />
    </div>
  );
};

export default Holiday;
