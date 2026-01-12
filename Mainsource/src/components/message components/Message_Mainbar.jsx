import React from "react";
import sample from "../../assets/sample.jpg";
import { IoMdSend } from "react-icons/io";

const Message_Mainbar = () => {
  return (
    <div className="w-screen h-full min-h-screen bg-gray-100 flex flex-col sm:flex-row">
      {/* Left Sidebar */}
      <div className="bg-white/50 relative w-full md:w-72 lg:basis-[30%] h-[60%] sm:h-screen overflow-y-scroll sm:overflow-y-auto overflow-x-hidden flex flex-col">
        {/* Header Buttons */}
        <div className="flex  py-5 justify-center px-5 gap-5 mb-4 sm:mb-8">
          <button className="bg-blue-500 text-white text-sm rounded px-10 py-2">
            Chat
          </button>
          <button className="bg-gray-200 px-10 py-2 text-sm rounded">
            Group
          </button>
        </div>

        {/* Chat List */}
        <div className="flex flex-col gap-4 px-2">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="flex items-start relative hover:bg-blue-100/70 p-3 rounded-md transition"
            >
              <img
                src={sample}
                alt="Chat Avatar"
                className="h-12 w-12 object-cover rounded-lg"
              />
              <div className="flex flex-col flex-grow ml-4">
                <p className="font-semibold">Gewen</p>
                <p className="text-gray-400 text-sm truncate">
                  Hi, how are you?
                </p>
              </div>
              <p className="text-gray-400 text-xs whitespace-nowrap z-30 right-4 absolute ">
                12:36 PM
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="flex-1 justify-between  max-md:hidden flex flex-col">
        <div className="flex py-5 px-5 bg-blue-50 items-center gap-5">
          <img
            className="h-12 w-12 rounded-xl object-cover"
            src={sample}
            alt="User Avatar"
          />
          <div className="flex flex-col">
            <p className="font-semibold">Winsmok Sanji</p>
            <p className="text-gray-400">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-5 mb-5 mx-8">
          <div className="bg-white rounded-full w-full h-12">
            <input
              type="text"
              name=""
              id=""
              placeholder="Type a message..."
              className="border-none outline-none ms-5 h-12 w-[95%]"
            />
          </div>

          <button className="bg-[#4F46E5] px-8 rounded-full h-full">
            <IoMdSend  className="text-xl text-white"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message_Mainbar;
