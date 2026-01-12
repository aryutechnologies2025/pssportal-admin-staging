import React from "react";
import { useEffect, useState } from "react";
import { BsBellFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { BsCalendar4 } from "react-icons/bs";
import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";
import Footer from "../Footer";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import Mobile_Sidebar from "../Mobile_Sidebar";

const MonthlyAttendanceDetails_Mainbar = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const data = [
    {
      employee_number: "5573",
      employee_name: "Sophi es",
      department_name: "Web Development",
      date: " 12-23-24",
      login_time: "9.00 AM",
      logout_time: "5.30 PM",
      break: "1h",
      total_hours: "7h 30m",
    },
    {
      employee_number: "5573",
      employee_name: "Sophia L.",
      department_name: "Web Development",
      date: " 12-23-24",
      login_time: "9.00 AM",
      logout_time: "5.30 PM",
      break: "1h",
      total_hours: "7h 30m",
    },
    
  ];

  const columns = [
    { field: "employee_number", header: "Employee Number" },
    {
      field: "employee_name",
      header: "Employee Name",
    },
    {
      field: "department_name", // Match the field to the data structure
      header: "Department",
    },
    {
      field: "date",
      header: "Date",
    },
    { field: "login_time", header: "Login Time" },
    { field: "logout_time", header: "Logout Time" },
    { field: "break", header: "Break" },
    { field: "total_hours", header: "Total Hours" },
  ];
  let navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the currentTime every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatHours = (hours) =>
    hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const formatNumber = (number) => (number < 10 ? `0${number}` : number);

  const day = days[currentTime.getDay()];
  const month = months[currentTime.getMonth()];
  const date = currentTime.getDate();
  const hours = formatHours(currentTime.getHours());
  const minutes = formatNumber(currentTime.getMinutes());
  const seconds = formatNumber(currentTime.getSeconds());
  const amPm = currentTime.getHours() >= 12 ? "PM" : "AM";

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 min-h-screen px-5 pt-2 md:pt-5 w-screen ">
      <div>
        <Mobile_Sidebar />

        {/* header */}
       

        <div className="flex gap-2 mt-5 text-sm items-center">
          <p
            className=" text-gray-500 cursor-pointer"
            onClick={() => navigate("/attendance")}
          >
            Attendance
          </p>
          <p>{">"}</p>
          <p className=" text-[#1ea600]">Monthly Attendance</p>
          <p>{">"}</p>
        </div>

        <p className="text-2xl md:text-3xl mt-8 font-semibold">Attendance</p>

        <div className="bg-white mt-8 px-5 py-5 rounded-2xl">
          <p className="text-xl font-bold text-gray-500">Attendance List</p>

          <div
            style={{ width: "auto", margin: "0 auto" }}
            className="overflow-x-hidden"
          >
            {/* Global Search Input */}
            <div className="mt-5 flex justify-end">
              <InputText
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search"
                className="px-2 py-2 bg-gray-200 rounded-md"
              />
            </div>

            <DataTable
              className="mt-8"
              value={data}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              globalFilter={globalFilter} // Global search filter
              showGridlines
              resizableColumns
              emptyMessage="No result found"
            >
              {columns.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  style={{
                    minWidth: "150px",
                    wordWrap: "break-word", // Allow text to wrap
                    overflow: "hidden", // Prevent text overflow
                    whiteSpace: "normal", // Ensure that text wraps within the available space
                  }}
                />
              ))}
            </DataTable>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MonthlyAttendanceDetails_Mainbar;
