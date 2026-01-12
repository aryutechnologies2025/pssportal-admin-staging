import Sidebar from "../components/Sidebar";

import Branch_Mainbar from "../components/Branch components/Branch_Mainbar";

const Branch = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Branch_Mainbar />
    </div>
  );
};

export default Branch;
