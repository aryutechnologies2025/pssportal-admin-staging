import Leaves_Mainbar from "../components/leaves components/Leaves_Mainbar";
import Sidebar from "../components/Sidebar";

const Leaves = () => {
  return (
    <div className="flex ">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Leaves_Mainbar />
    </div>
  );
};

export default Leaves;
