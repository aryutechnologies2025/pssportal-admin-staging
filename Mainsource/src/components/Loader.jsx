import React from "react";

const Loader = () => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
    
  );
};

export default Loader;
