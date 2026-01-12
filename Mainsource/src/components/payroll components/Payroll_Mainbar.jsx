import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState } from "react";
import { BsBellFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
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

const Payroll_Mainbar = () => {
  let navigate = useNavigate();

  const [globalFilter, setGlobalFilter] = useState("");
  const data = [
    {
      name: "zarav",
      position: "Software Engineer",
      rate: "$800",
      period: "3/08/2023 - 4/09/2023",
      leave_days: "2 days",
      work_type: "Full Time",
      salary: "$2400",
      status: "In Progress",
    },
    {
      name: "zarav",
      position: "Software Engineer",
      rate: "$800",
      period: "3/08/2023 - 4/09/2023",
      leave_days: "2 days",
      work_type: "Full Time",
      salary: "$2400",
      status: "Pending",
    },
    {
      name: "zarav",
      position: "Software Engineer",
      rate: "$800",
      period: "3/08/2023 - 4/09/2023",
      leave_days: "2 days",
      work_type: "Full Time",
      salary: "$2400",
      status: "completed",
    },
  ];
  const columns = [
    {
      field: "name",
      header: "Name",
    },
    {
      field: "position",
      header: "Position",
      // body: (rowData) => {
      //   const bgColor = rowData.position.includes("Developer")
      //     ? "violet"
      //     : rowData.position.includes("Designer")
      //     ? "orange"
      //     : rowData.position.includes("Analyst")
      //     ? "blue"
      //     : "green";
      //   return (
      //     <div
      //       style={{
      //         display: "inline-block",
      //         padding: "4px 8px",
      //         backgroundColor: bgColor,
      //         color: "white",
      //         borderRadius: "50px",
      //         textAlign: "center",
      //         // textWrap: 'nowrap',
      //       }}
      //     >
      //       {rowData.position}
      //     </div>
      //   );
      // },
    },
    { field: "rate", header: "Rate" },
    { field: "period", header: "Period" },
    { field: "leave_days", header: "Leave Days" },
    { field: "work_type", header: "Work Type" },
    { field: "salary", header: "Salary" },
    {
      field: "status",
      header: "Status",
      body: (rowData) => {
        const bgColor = rowData.status.toLowerCase().includes("new leave")
          ? "blue"
          : rowData.status.toLowerCase().includes("in progress")
          ? "#FAAB3C"
          : rowData.status.toLowerCase().includes("pending")
          ? "#9566F2"
          : "green";
        return (
          <div
            style={{
              display: "inline-block",
              padding: "8px 8px",
              backgroundColor: bgColor,
              color: "white",
              borderRadius: "50px",
              textAlign: "center",
              width: "100px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {rowData.status}
          </div>
        );
      },
    },
  ];

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
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 min-h-screen px-3 md:px-5 py-2 md:py-5 w-screen ">
      <div>
        
        <Mobile_Sidebar/>

        {/* header */}
        <div className="flex  justify-between items-center bg-white px-2 py-2 mt-5 rounded-2xl">
          <input
            type="text"
            className="w-32 sm:w-56 md:basis-[50%] ps-2   placeholder-black border-none outline-none  py-2 "
            placeholder="Search by name, position"
          />

          <div className="flex w-fit md:basis-[50%] flex-row items-center justify-end gap-4 lg:gap-8 lg:w-auto">
            <div className="flex items-center gap-2 lg:gap-5">
              <BsBellFill className="text-lg lg:text-xl text-gray-400 cursor-pointer" />
              <IoMdSettings className="text-lg lg:text-xl text-gray-400 cursor-pointer" />
              <div className="h-6 w-6  bg-gray-200 rounded-full cursor-pointer"></div>
              <p className="cursor-pointer ">ENG</p>
            </div>

            <div className="font-medium text-sm max-md:hidden lg:text-base text-center lg:text-left">
              <span>{day}, </span>
              <span>{month} </span>
              <span>{date}, </span>
              <span className="inline-block  text-center">
                {hours}:{minutes} {amPm}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5 text-sm items-center">
          <p className=" text-blue-500 ">Payroll</p>
          <p>{">"}</p>
        </div>

        <p className="text-2xl md:text-3xl mt-5 md:mt-8 font-semibold">Payroll</p>

        {/* data table */}
        <div  style={{ width: "auto", margin: "0 auto" }}>
          {/* Global Search Input */}
          <div className="mt-8 flex justify-end">
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="px-2 py-2 rounded-md"
            />
          </div>

          <DataTable
            className="mt-8"
            value={data}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            globalFilter={globalFilter} // This makes the search work
            showGridlines
            resizableColumns
          >
            {columns.map((col, index) => (
              <Column
                key={index}
                field={col.field}
                header={col.header}
                body={col.body}
                style={{
                  textAlign: 'center',
                  minWidth: "150px",
                  wordWrap: "break-word", // Allow text to wrap
                  overflow: "hidden", // Prevent text overflow
                  whiteSpace: "normal", // Ensure that text wraps within the available space }}
                }}
              />
            ))}
          </DataTable>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payroll_Mainbar;
