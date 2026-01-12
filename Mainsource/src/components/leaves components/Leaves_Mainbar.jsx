import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { BsBellFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { BsCalendar4 } from "react-icons/bs";
import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";
import sample from "../../assets/sample.jpg";
import Footer from "../Footer";


import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import Mobile_Sidebar from "../Mobile_Sidebar";

const Leaves_Mainbar = () => {
  let navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [globalFilter, setGlobalFilter] = useState("");

  const data = [
    {
      name: "zarav",
      position: "Software Engineer",
      department: "Engineering",
      leavetype: "Sick Leave",
      period: "Nov 1, 2024 - Nov 5, 2024",
      reason: "Flu",
      status: "APPROVED",
    },
    {
      name: "aravq",
      position: "Software Engineer",
      department: "Engineering",
      leavetype: "Sick Leave",
      period: "Nov 1, 2024 - Nov 5, 2024",
      reason: "Flu",
      status: "DENIED",
    },
    {
      name: "aravq",
      position: "Software Engineer",
      department: "Engineering",
      leavetype: "Sick Leave",
      period: "Nov 1, 2024 - Nov 5, 2024",
      reason: "Flu",
      status: "NEW LEAVE",
    },
    {
      name: "aravq",
      position: "Software Engineer",
      department: "Engineering",
      leavetype: "Sick Leave",
      period: "Nov 1, 2024 - Nov 5, 2024",
      reason: "Flu",
      status: "PENDING",
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
      //       }}
      //     >
      //       {rowData.position}
      //     </div>
      //   );
      // },
    },
    { field: "department", header: "Department" },
    { field: "leavetype", header: "Leave Type" },
    { field: "period", header: "Period" },
    { field: "reason", header: "Reason" },
    {
      field: "status",
      header: "Status",
      body: (rowData) => {
        const textAndBorderColor = rowData.status
          .toLowerCase()
          .includes("new leave")
          ? "blue"
          : rowData.status.toLowerCase().includes("approved")
          ? "#0EB01D"
          : rowData.status.toLowerCase().includes("pending")
          ? "#4E1BD9"
          : rowData.status.toLowerCase().includes("new leave")
          ? "#1F74EC"
          : "#BE6F00";
        return (
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              color: textAndBorderColor,
              border: `1px solid ${textAndBorderColor}`,
              borderRadius: "50px",
              textAlign: "center",
              width: "100px",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {rowData.status}
          </div>
        );
      },
    },
  ];

  const employeeDetails = [
    {
      employee_Name: "Abdul Rahman",
      employee_Department: "Web Development",
    },
    {
      employee_Name: "Rahmalman",
      employee_Department: "Weas;lmb Development",
    },
    {
      employee_Name: "Abdul paskdpRahman",
      employee_Department: "Web saldDevelopment",
    },
    {
      employee_Name: "Rahman",
      employee_Department: "Web Development",
    },
  ];

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

  const [addLeaveRequestModalOpen, setAddLeaveRequestModalOpen] =
    useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openAddLeaveRequestModal = () => {
    setAddLeaveRequestModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeAddLeaveRequestModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddLeaveRequestModalOpen(false), 250); // Delay to trigger animation
  };

  const [leaveReason, setLeaveReason] = useState([]);
  const [leaveReasonInputValue, setLeaveReasonInputValue] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && leaveReasonInputValue) {
      setLeaveReason([...leaveReason, leaveReasonInputValue.trim()]);
      setLeaveReasonInputValue("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setLeaveReason(leaveReason.filter((skill) => skill !== skillToDelete));
  };

  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 px-5 pt-2 md:pt-5 min-h-screen  w-screen">
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
        
        {/* breadcrumb */}
        <div className="flex gap-2 mt-5 text-sm items-center">
          <p className=" text-blue-500 ">Leaves</p>
          <p>{">"}</p>
        </div>

        <div>
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-2xl md:text-3xl font-semibold mt-5 md:mt-8">Leaves</p>

            <div className="flex items-center gap-5 justify-end mt-5 md:mt-8 ">
              <select className="px-3 py-2 rounded-md border-none outline-none ">
                <option value="Leave">Leave</option>
                <option value="Permission">Permission</option>
                <option value="WFH">WFH</option>
              </select>
              <button
                onClick={openAddLeaveRequestModal}
                className="bg-blue-600  ml-auto md:ml-0 w-fit cursor-pointer px-5 md:px-7 py-0.5 md:py-2 font-medium rounded-full text-white"
              >
                + request
              </button>
            </div>
          </div>
        </div>

        {/* data table */}
        <div style={{ width: "auto", margin: "0 auto" }}>
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
                  minWidth: "150px",
                  wordWrap: "break-word", // Allow text to wrap
                  overflow: "hidden", // Prevent text overflow
                  whiteSpace: "normal", // Ensure that text wraps within the available space }}
                }}
              />
            ))}
          </DataTable>
        </div>

        {addLeaveRequestModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 "
              onClick={closeAddLeaveRequestModal}
            ></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddLeaveRequestModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="px-5 lg:px-14 py-10">
                <p className="text-2xl md:text-3xl font-medium">Leave Request</p>

                {employeeDetails.map((item, index) => (
                  <div className="mt-5" key={index}>
                    {/* Accordion Header */}
                    <div
                      onClick={() => toggleAccordion(index)}
                      className="cursor-pointer bg-gray-100 flex justify-between items-center px-2 py-2 sm:px-4 sm:py-4 rounded-xl border-2 border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row gap-2">
                        <h2 className="font-normal  md:font-medium">Employee Name : </h2>
                        <span className="font-normal md:font-medium">
                          {item.employee_Name}
                        </span>
                      </div>

                      <svg
                        className={`w-5 h-5 transition-transform ${
                          expandedIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {/* Accordion Content */}
                    {expandedIndex === index && (
                      <div className="flex flex-col px-5 gap-3 mt-5 transition ease-in-out duration-1000">
                        {/* Content here */}
                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <div className="flex flex-col">
                            <label
                              className="font-medium text-sm"
                              htmlFor="jobTitle"
                            >
                              EMPLOYEE NAME
                            </label>
                            <p className="text-sm">Employee name</p>
                          </div>
                          <input
                            type="text"
                            id="jobTitle"
                            placeholder="Enter Employee Name"
                            className="border-2 rounded-xl ps-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                          />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <div className="flex flex-col">
                            <label
                              className="font-medium text-sm"
                              htmlFor="companyName"
                            >
                              EMPLOYEE DEPARTMENT
                            </label>
                            <p className="text-sm">Select Department</p>
                          </div>
                          <input
                            type="text"
                            id="companyName"
                            placeholder="Sales & Marketing"
                            className="border-2 rounded-xl ps-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                          />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <div className="flex flex-col">
                            <label
                              className="font-medium text-sm"
                              htmlFor="companyName"
                            >
                              EMPLOYEE POSITION
                            </label>
                            <p className="text-sm">Select Position</p>
                          </div>
                          <input
                            type="text"
                            id="companyName"
                            placeholder="Graphic Designer"
                            className="border-2 rounded-xl ps-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                          />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <div className="flex flex-col">
                            <label
                              className="font-medium text-sm"
                              htmlFor="previousSalary"
                            >
                              LEAVE TYPE
                            </label>
                            <p className="text-sm">Select Leave Type</p>
                          </div>
                          <input
                            type="text"
                            id="previousSalary"
                            placeholder="Sick Leave"
                            className="border-2 rounded-xl text-sm ps-4 border-gray-300 outline-none h-10 w-full md:w-96"
                          />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <div className="flex flex-col">
                            <label
                              className="font-medium text-sm"
                              htmlFor="previousSalary"
                            >
                              REMAINING LEAVES
                            </label>
                            <p className="text-sm">Only numbers</p>
                          </div>
                          <input
                            type="text"
                            id="previousSalary"
                            placeholder="12"
                            className="border-2 rounded-xl ps-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                          />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <div className="flex flex-col">
                            <label
                              className="font-medium text-sm"
                              htmlFor="periodOfWork"
                            >
                              PERIOD OF LEAVE
                            </label>
                            <p className="text-sm">Select Period</p>
                          </div>
                          <div className="flex gap-3  h-10 w-full md:w-96">
                            <input
                              type="text"
                              id="startWork"
                              placeholder="Aug 9 2023"
                              className="border-2 w-[50%] text-sm rounded-xl ps-4 border-gray-300 outline-none"
                            />
                            <input
                              type="text"
                              id="endWork"
                              placeholder="Aug 15 2023"
                              className="border-2 w-[50%] text-sm rounded-xl ps-4 border-gray-300 outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <div className="flex flex-col">
                            <label
                              className="font-medium text-sm"
                              htmlFor="responsibilities"
                            >
                              LEAVE REASON*
                            </label>
                            <p className="text-sm">Short description</p>
                          </div>

                          <div className=" border-2 border-gray-300 rounded-2xl  w-full md:w-96">
                            <div className="h-7 w-full border-b-2 border-gray-300"></div>
                            <input
                              type="text"
                              placeholder="The concise explanation for leave, providing context for their absence"
                              className="w-full  text-sm rounded-md px-3 mt-3 h-5 border-none outline-none"
                              value={leaveReasonInputValue}
                              onChange={(e) =>
                                setLeaveReasonInputValue(e.target.value)
                              }
                              onKeyPress={handleKeyPress}
                            />
                            <div className="mt-1 py-3 px-3 flex flex-wrap ">
                              {leaveReason.map((skill, index) => (
                                <div
                                  key={index}
                                  className="flex items-center  text-gray-800 px-3 "
                                >
                                  {skill}
                                  <button
                                    className="text-black hover:text-red-600"
                                    onClick={() => handleDeleteSkill(skill)}
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <div className="flex flex-col">
                            <label
                              className="font-medium text-sm"
                              htmlFor="responsibilities"
                            >
                              PROJECT
                            </label>
                            <p className="text-sm">Project description</p>
                          </div>

                          <div className=" border-2 border-gray-300 rounded-2xl  w-full md:w-96">
                            <div className="h-7 w-full border-b-2 border-gray-300"></div>
                            <input
                              type="text"
                              placeholder="The concise explanation for leave, providing context for their absence"
                              className="w-full text-sm  rounded-md px-3 mt-3 h-5 border-none outline-none"
                              value={leaveReasonInputValue}
                              onChange={(e) =>
                                setLeaveReasonInputValue(e.target.value)
                              }
                              onKeyPress={handleKeyPress}
                            />
                            <div className="mt-1 py-3 px-3 flex flex-wrap ">
                              {leaveReason.map((skill, index) => (
                                <div
                                  key={index}
                                  className="flex items-center  text-gray-800 px-3 "
                                >
                                  {skill}
                                  <button
                                    className="text-black hover:text-red-600"
                                    onClick={() => handleDeleteSkill(skill)}
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap md:justify-end gap-2 md:gap-5">
                          <button className="px-8 py-2 text-sm rounded-full bg-red-500 font-bold text-white">
                            Reject
                          </button>
                          <button className="px-8 py-2 text-sm rounded-full bg-gray-400 font-bold text-white">
                            Hold
                          </button>
                          <button className="px-8 py-2 text-sm rounded-full bg-green-600 font-bold text-white">
                            Accept
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Leaves_Mainbar;
