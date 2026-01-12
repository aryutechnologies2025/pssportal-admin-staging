import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";

const Sitemap = () => {
  const navigate = useNavigate();
  const [employeeButtonClicked, setEmployeeButtonClicked] = useState(false);

  function onClickButton(location) {
    navigate(location);
  }

  return (
    <div className="flex gap-8 bg-gray-100">
      <div className="flex basis-1/5 flex-col gap-5 items-center justify-center">
        <div className="flex gap-5 items-center justify-center">
          <p className="h-5 w-5 bg-blue-500 rounded-full"></p>
          <p>Main Page</p>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <p className="h-5 w-5 bg-gray-500 rounded-full"></p>
          <p>Sub Page</p>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <p className="h-5 w-5 bg-slate-300 rounded-full"></p>
          <p>Dropdown</p>
        </div>

      </div>
      <div className=" flex  flex-col gap-5 items-center justify-center min-h-screen w-screen">
        <button
          onClick={() => onClickButton("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Login
        </button>

        <button
          onClick={() => onClickButton("/dashboard")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Dashboard
        </button>

        <button
          onClick={() => setEmployeeButtonClicked(!employeeButtonClicked)}
          className="bg-slate-300 hover:bg-slate-400 text-slate-900 px-4 py-2 rounded-md flex items-center gap-2"
        >
          Employee <FaAngleDown />
        </button>

        <div
          className={`overflow-hidden flex flex-col ms-[500px] gap-5 items-start justify-center  transition-all duration-700 ease-in-out ${
            employeeButtonClicked
              ? "max-h-max opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <button
            onClick={() => onClickButton("/roles")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Roles
          </button>
          <button
            onClick={() => onClickButton("/permission")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Permission
          </button>
          <div className="flex flex-col  items-start ">
            <div className="flex items-center">
              <button
                onClick={() => onClickButton("/employees")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Employees
              </button>
              <p className="-my-1">{"--->"}</p>
              <div className="flex items-center ">
                <button
                  onClick={() => onClickButton("/employeedetails")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Employee Details
                </button>
                <p className="-my-1">{"--->"}</p>
                <button
                  onClick={() => onClickButton("/editemployeedetails")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Edit Employee Details
                </button>
              </div>
            </div>

            <p className="-my-1 ms-8 flex flex-col items-center">
              {" "}
              <span>|</span>{" "}
              <span className="text-sm">
                <FaAngleDown className="-mt-3" />
              </span>
            </p>

            <button
              onClick={() => onClickButton("/createemployee")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Add New Member
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => onClickButton("/attendance")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Attendance
          </button>
          <p className="-my-1">{"--->"}</p>
          <button
            onClick={() => onClickButton("/monthlyattendancedetails")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Monthly Details
          </button>
        </div>

        <button
          onClick={() => onClickButton("/leaves")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Leaves
        </button>
        <button
          onClick={() => onClickButton("/payroll")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Payroll
        </button>
        <button
          onClick={() => onClickButton("/finance")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Finance
        </button>
      </div>
    </div>
  );
};

export default Sitemap;
