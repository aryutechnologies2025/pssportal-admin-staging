import Sidebar from "../components/Sidebar";
import Shift_Mainbar from "../components/shift components/Shift_Mainbar";

const Shift = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Shift_Mainbar />
    </div>
  );
};

export default Shift;
