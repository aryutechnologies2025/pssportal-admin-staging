import FinanceDetails_Mainbar from "../components/finance components/FinanceDetails_Mainbar";
import Sidebar from "../components/Sidebar";


const Finance_Request = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <FinanceDetails_Mainbar />
    </div>
  );
};

export default Finance_Request;
