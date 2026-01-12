import React from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  let navigate=useNavigate()

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <div className="bg-gray-100 flex flex-col items-center justify-center gap-1 min-h-screen w-full ">

        <p className="text-3xl md:text-6xl font-semibold">404</p>
        <p className="font-medium text-base md:text-3xl">Look like you're lost</p>    
        <p className="text-gray-600 text-sm">The page you are looking is not available !</p>
        <button onClick={()=>navigate('/dashboard')} className="bg-blue-500  mt-3 text-white px-3 py-2 rounded-2xl">Go To Dashboard</button>    
    
      </div>
    </div>
  );
};

export default PageNotFound;
