import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCampaign, MdLogout, MdManageAccounts } from "react-icons/md";
import medics_logo from "../assets/medics_logo.svg";
import admin_icon from "../assets/admin_icon.png";
import employee from "../assets/employee.svg";
import company from "../assets/company.svg";
import contact from "../assets/contact.svg";
import contractcandidates from "../assets/contract_Candidates.svg";
import jobform from "../assets/job-form.svg";
import attendance from "../assets/attendance.svg";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MdOutlineContactMail } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { IoSettings } from "react-icons/io5";
import { RxActivityLog } from "react-icons/rx";
import axiosInstance from "../axiosConfig";
import { API_URL } from "../Config";
import { TbReportSearch } from "react-icons/tb";
import { MdLeaderboard } from "react-icons/md";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { BsBuildingUp } from "react-icons/bs";
import { TbReport } from "react-icons/tb";
import { AiOutlineMessage } from "react-icons/ai";
import { VscReport } from "react-icons/vsc";

const Sidebar = () => {
  const AdminData = JSON.parse(
    localStorage.getItem("pss_dateformat") || "null",
  );

  const sitelogo = AdminData?.setting?.site_logo;

  const favicon = AdminData?.setting?.fav_icon;

  const logoURL = `${API_URL.replace(/\/$/, "")}/${sitelogo}`;

  const faviconURL = `${API_URL.replace(/\/$/, "")}/${favicon}`;
  // const logoURL = sitelogo ? `${API_URL.sitelogo}` : "/pssAgenciesLogo.svg";

  console.log("AdminData sitelogo", sitelogo);
  const [arrowClicked, setArrowClicked] = useState(() => {
    // Get the persisted state from localStorage
    const savedState = localStorage.getItem("sidebarState");
    return savedState === "true";
  });

  const [currentOpen, setCurrentOpen] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  let navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Path matchers for active states
  const isAttendanceActive = location.pathname.startsWith("/attendance");

  const toggleMenu = (menu) => {
    setCurrentOpen(currentOpen === menu ? null : menu);
  };

  const onClickArrow = () => {
    const newState = !arrowClicked;
    setArrowClicked(newState);
    localStorage.setItem("sidebarState", newState);
  };

  const logoutUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("pssuser"));
      console.log("USER....... : ", user);

      if (!user?.id) {
        console.warn("User ID not found");
        return;
      }

      await axiosInstance.post(`${API_URL}api/logout`, {
        id: user.id,
      });
      console.log("Logout API success");
    } catch (error) {
      console.error("Logout API failed", error);
    }
  };

  const onClickSidebarMenu = async (label) => {
    if (label === "/") {
      setButtonLoading(true);
      // setTimeout(() => {
      //   localStorage.removeItem("pssuser");
      //   window.location.reload();
      //   window.scrollTo({ top: 0, behavior: "instant" });
      //   setButtonLoading(false);
      // }, 300);
      await logoutUser();
      localStorage.removeItem("pssuser");
      setButtonLoading(false);

      navigate("/");
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      navigate(`/${label.toLowerCase()}`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <div>
      <section
        className={`bg-white max-md:hidden max-h-dvh transition-all duration-500 flex flex-col ${
          arrowClicked ? "w-[60px]" : "w-52 "
        }`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <div
          className={`fixed flex flex-col h-screen ${
            arrowClicked ? "w-[60px]" : "w-48"
          }`}
        >
          {/* Toggle Button */}
          <div
            className="flex justify-end mt-3 items-center"
            onClick={onClickArrow}
            title="Toggle Sidebar"
          >
            <div
              className={`${
                arrowClicked ? "-me-3" : "-me-8"
              } w-6 h-6 rounded-full border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer`}
            >
              {arrowClicked ? (
                <IoIosArrowForward className="w-3 h-3" />
              ) : (
                <IoIosArrowBack className="w-3 h-3" />
              )}
            </div>
          </div>

          {/* Logo */}
          {arrowClicked ? (
            <div className="h-6 my-3 ms-2 text-xl font-semibold">
              <p className="text-[#4BB452]">
                {/* <img
                  src="/pss-favicon.jpeg"
                  alt="PSS Logo"
                  className="h-7 w-7 cursor-pointer rounded-full"
                  onClick={() => navigate("/")}
                /> */}
                <img
                  // src={sitelogo ? sitelogo : "/pssAgenciesLogo.svg"}
                  src={faviconURL ? faviconURL : "/pss-favicon.jpeg"}
                  alt="Site Logo"
                  className="h-7 w-7 cursor-pointer rounded-full"
                  onClick={() => navigate("/")}
                />
              </p>
            </div>
          ) : (
            // <img
            //   src="/pssAgenciesLogo.svg"
            //   alt="PSS Logo"
            //   className="w-40 md:w-48 h-auto mx-auto mb-2 cursor-pointer"
            //   onClick={() => navigate("/")}
            // />
            <img
              src={logoURL ? logoURL : "/pssAgenciesLogo.svg"}
              alt="PSS Logo"
              className="w-40 md:w-48 h-auto mx-auto mb-2 cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}

          {/* Sidebar Menu */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden px-1"
            style={{ scrollbarGutter: "stable" }}
          >
            <div
              className={`flex gap-1 mt-2 mx-2 flex-col ${
                arrowClicked ? "items-center" : "items-start"
              }`}
            >
              {/* dashboard */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-[7px]"}`}>
                <div
                  onClick={() => onClickSidebarMenu("Dashboard")}
                  className={`flex items-center h-10 w-full flex-grow ${
                    arrowClicked ? "justify-center  " : "justify-normal"
                  } hover:bg-green-100 hover:text-[#4BB452] px-2 py-3 rounded-md gap-2 text-gray-500 text-sm font-medium cursor-pointer ${
                    currentPath === "/dashboard"
                      ? "bg-[#4BB452] text-white"
                      : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                  }`}
                >
                  <CiBoxList className="w-5" />
                  {!arrowClicked && <p className="text-sm">Dashboard</p>}
                </div>
              </div>

              {/* report */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                {/* Parent Item */}
                <div
                  onClick={() => toggleMenu("report")}
                  className={`flex items-center w-full flex-grow
      ${arrowClicked ? "justify-center" : "justify-normal"}
      px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
      ${
        currentPath === "/contract-report"
          ? "bg-[#4BB452] text-white"
          : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
      }`}
                >
                  <VscReport className="w-5" />

                  {!arrowClicked && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium">Report</span>
                      {currentOpen === "report" ||
                      currentPath === "/contract-report" ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown Items */}
                {!arrowClicked && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      currentOpen === "report" ||
                      currentPath === "/contract-report"
                        ? "max-h-40 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex gap-2 ms-8 flex-col text-sm font-medium text-gray-500">
                      {/* Contract */}
                      <button
                        onClick={() => {
                          navigate("/contract-report");
                          setCurrentOpen("report");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${
              currentPath === "/contract-report"
                ? "text-[#4BB452]"
                : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
            }`}
                      >
                        Contracts
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* PSS Employee Dropdown */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                {/* Parent Item */}
                <div
                  onClick={() => toggleMenu("employee")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/roles" ||
      currentPath === "/departments" ||
      currentPath === "/permission" ||
      currentPath === "/branches" ||
      currentPath === "/dailywork-report" ||
      currentPath === "/shift" ||
      currentPath === "/psscompany" ||
      currentPath === "/pssdailyattendance" ||
      currentPath === "/employees"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }`}
                >
                  <img
                    src={employee}
                    alt="employee"
                    className={`sidebar-icon transition-all duration-200 ${
                      currentPath === "/roles" ||
                      currentPath === "/permission" ||
                      currentPath === "/departments" ||
                      currentPath === "/branches" ||
                      currentPath === "/dailywork-report" ||
                      currentPath === "/psscompany" ||
                      currentPath === "/shift" ||
                      currentPath === "/pssdailyattendance" ||
                      currentPath === "/employees"
                        ? "brightness-0 invert pointer-events-none"
                        : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                    }`}
                  />

                  {!arrowClicked && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium">PSS</span>
                      {currentOpen === "employee" ||
                      currentPath === "/psscompany" ||
                      currentPath === "/roles" ||
                      currentPath === "/departments" ||
                      currentPath === "/permission" ||
                      currentPath === "/branches" ||
                      currentPath === "/dailywork-report" ||
                      currentPath === "/shift" ||
                      currentPath === "/pssdailyattendance" ||
                      currentPath === "/employees" ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown Items */}
                {!arrowClicked && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      currentOpen === "employee" ||
                      currentPath === "/psscompany" ||
                      currentPath === "/roles" ||
                      currentPath === "/departments" ||
                      currentPath === "/permission" ||
                      currentPath === "/employees" ||
                      currentPath === "/shift" ||
                      currentPath === "/pssdailyattendance" ||
                      currentPath === "/branches" ||
                      currentPath === "/dailywork-report"
                        ? "max-h-50 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex gap-2  items-start  ms-8 flex-col text-sm font-medium text-gray-500">
                      <button
                        onClick={() => {
                          navigate("/psscompany");
                          if (currentOpen !== "employee") {
                            setCurrentOpen("employee");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition 
                          ${
                            currentPath === "/psscompany"
                              ? "text-[#4BB452]"
                              : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                          }`}
                      >
                        Companies
                      </button>

                      <button
                        onClick={() => {
                          navigate("/branches");
                          if (currentOpen !== "employee") {
                            setCurrentOpen("employee");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition 
                          ${
                            currentPath === "/branches"
                              ? "text-[#4BB452]"
                              : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                          }`}
                      >
                        Branches
                      </button>
                      <button
                        onClick={() => {
                          navigate("/departments");
                          if (currentOpen !== "employee") {
                            setCurrentOpen("employee");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
                          ${
                            currentPath === "/departments"
                              ? "text-[#4BB452]"
                              : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                          }`}
                      >
                        Departments
                      </button>

                      <button
                        onClick={() => {
                          navigate("/roles");
                          if (currentOpen !== "employee") {
                            setCurrentOpen("employee");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
                          ${
                            currentPath === "/roles"
                              ? "text-[#4BB452]"
                              : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                          }`}
                      >
                        Roles
                      </button>

                      <button
                        onClick={() => {
                          navigate("/employees");
                          if (currentOpen !== "employee") {
                            setCurrentOpen("employee");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
                          ${
                            currentPath === "/employees"
                              ? "text-[#4BB452]"
                              : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452] "
                          }`}
                      >
                        Employees
                      </button>

                      <button
                        onClick={() => {
                          navigate("/permission");
                          if (currentOpen !== "employee") {
                            setCurrentOpen("employee");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition 
                          ${
                            currentPath === "/permission"
                              ? "text-[#4BB452]"
                              : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                          }`}
                      >
                        Privileges
                      </button>

                      <button
                        onClick={() => {
                          navigate("/pssdailyattendance");
                          if (currentOpen !== "pssdailyattendance") {
                            setCurrentOpen("dailywork-report");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
                          ${
                            currentPath === "/pssdailyattendance"
                              ? "text-[#4BB452]"
                              : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                          }`}
                      >
                        Attendance
                      </button>

                      {/* daily work report */}
                      <button
                        onClick={() => {
                          navigate("/dailywork-report");
                          if (currentOpen !== "dailywork-report") {
                            setCurrentOpen("dailywork-report");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
                          ${
                            currentPath === "/dailywork-report"
                              ? "text-[#4BB452]"
                              : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                          }`}
                      >
                        Work Report
                      </button>

                      {/* <button
                        onClick={() => {
                          navigate("/shift");
                          if (currentOpen !== "employee") {
                            setCurrentOpen("employee");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
                          ${currentPath === "/shift"
                            ? "text-[#4BB452]"
                            : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452] "
                          }`}
                      >
                        shifts
                      </button> */}
                    </div>
                  </div>
                )}
              </div>

              {/* Pss company */}
              {/* <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("psscompany")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${currentPath === "/psscompany"
                      ? "bg-[#4BB452] text-white"
                      : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                    }`}
                >
                  <BsBuildingUp className="w-5 "/>

                  {!arrowClicked && (
                    <p className="text-sm font-medium">PSS Company</p>
                  )}
                </div>
              </div> */}

              {/* Company  */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("company")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/company"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }
  `}
                >
                  <img
                    src={company}
                    alt="company"
                    className={`sidebar-icon transition-all duration-200 ${
                      currentPath === "/company"
                        ? "brightness-0 invert pointer-events-none"
                        : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                    }`}
                  />

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Company</p>
                  )}
                </div>
              </div>

              {/* interview */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                {/* Parent Item */}
                <div
                  onClick={() => toggleMenu("interview")}
                  className={`flex items-center w-full flex-grow
      ${arrowClicked ? "justify-center" : "justify-normal"}
      px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
      ${
        currentPath === "/contractcandidates"
          ? "bg-[#4BB452] text-white"
          : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
      }`}
                >
                  <img
                    src={contractcandidates}
                    alt="contract"
                    className={`sidebar-icon transition-all duration-200 ${
                      currentPath === "/contractcandidates"
                        ? "brightness-0 invert pointer-events-none"
                        : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                    }`}
                  />

                  {!arrowClicked && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium">Interview</span>
                      {currentOpen === "interview" ||
                      currentPath === "/contractcandidates" ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown Items */}
                {!arrowClicked && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      currentOpen === "interview" ||
                      currentPath === "/contractcandidates"
                        ? "max-h-40 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex gap-2 ms-8 flex-col text-sm font-medium text-gray-500">
                      {/* Candidates */}
                      <button
                        onClick={() => {
                          navigate("/contractcandidates");
                          setCurrentOpen("interview");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${
              currentPath === "/contractcandidates"
                ? "text-[#4BB452]"
                : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
            }`}
                      >
                        Candidates
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Contract Candidates */}
              {/* Contract Dropdown */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                {/* Parent Item */}
                <div
                  onClick={() => toggleMenu("contract")}
                  className={`flex items-center w-full flex-grow
      ${arrowClicked ? "justify-center" : "justify-normal"}
      px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
      ${
        currentPath === "/employeecontract" ||
        currentPath === "/attendance" ||
        currentPath === "/boarding-point" ||
        currentPath === "/relieved-contract" ||
        currentPath === "/education"
          ? "bg-[#4BB452] text-white"
          : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
      }`}
                >
                  <img
                    src={contractcandidates}
                    alt="contract"
                    className={`sidebar-icon transition-all duration-200 ${
                      currentPath === "/employeecontract" ||
                      currentPath === "/attendance" ||
                      currentPath === "/boarding-point" ||
                      currentPath === "/relieved-contract" ||
                      currentPath === "/education"
                        ? "brightness-0 invert pointer-events-none"
                        : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                    }`}
                  />

                  {!arrowClicked && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium">Contract</span>
                      {currentOpen === "contract" ||
                      currentPath === "/employeecontract" ||
                      currentPath === "/boarding-point" ||
                      currentPath === "/relieved-contract" ||
                      currentPath === "/education" ||
                      currentPath === "/attendance" ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown Items */}
                {!arrowClicked && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      currentOpen === "contract" ||
                      currentPath === "/employeecontract" ||
                      currentPath === "/attendance" ||
                      currentPath === "/boarding-point" ||
                      currentPath === "/relieved-contract" ||
                      currentPath === "/education"
                        ? "max-h-60 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex gap-2 ms-8 flex-col text-sm font-medium text-gray-500">
                      {/* Candidates */}
                      <button
                        onClick={() => {
                          navigate("/employeecontract");
                          setCurrentOpen("contract");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${
              currentPath === "/employeecontract"
                ? "text-[#4BB452]"
                : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
            }`}
                      >
                        Employee
                      </button>

                      {/* Attendance */}
                      <button
                        onClick={() => {
                          navigate("/attendance");
                          setCurrentOpen("contract");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${
              currentPath === "/attendance"
                ? "text-[#4BB452]"
                : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
            }`}
                      >
                        Attendance
                      </button>
                      <button
                        onClick={() => {
                          navigate("/boarding-point");
                          setCurrentOpen("contract");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${
              currentPath === "/boarding-point"
                ? "text-[#4BB452]"
                : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
            }`}
                      >
                        Boarding Point
                      </button>
                      <button
                        onClick={() => {
                          navigate("/education");
                          setCurrentOpen("contract");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${
              currentPath === "/education"
                ? "text-[#4BB452]"
                : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
            }`}
                      >
                        Education
                      </button>
                      <button
                        onClick={() => {
                          navigate("/relieved-contract");
                          setCurrentOpen("contract");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${
              currentPath === "/relieved-contract"
                ? "text-[#4BB452]"
                : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
            }`}
                      >
                        Relieved 
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Form */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("job-form")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/job-form"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }`}
                >
                  <img
                    src={jobform}
                    alt="jobform"
                    className={`sidebar-icon transition-all duration-200 ${
                      currentPath === "/job-form"
                        ? "brightness-0 invert pointer-events-none"
                        : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                    }`}
                  />

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Job Form</p>
                  )}
                </div>
              </div>

              {/* lead management */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("lead-engine")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/lead-engine"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }`}
                >
                  <MdLeaderboard className="w-5 " />

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Lead Engine</p>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("contact")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/contact"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }`}
                >
                  <img
                    src={contact}
                    alt="contact"
                    className={`sidebar-icon transition-all duration-200 ${
                      currentPath === "/contact"
                        ? "brightness-0 invert pointer-events-none"
                        : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                    }`}
                  />
                  {/* <MdOutlineContactMail  className="w-5 h-5 text-gray-500  "/> */}

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Contact</p>
                  )}
                </div>
              </div>

              {/* Announcement */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("announcement")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/announcement"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }`}
                >
                 
                  <MdCampaign
                    size={24} 
                    className={`sidebar-icon transition-all duration-200 ${
                      currentPath === "/announcement"
                        ? "brightness-0 invert pointer-events-none"
                        : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                    }`}
                  />

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Announcement</p>
                  )}
                </div>
              </div> 

              {/* activity */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("activity")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/activity"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }`}
                >
                  {/* <img
                    src={activity}
                    alt="activity"
                    className={`sidebar-icon transition-all duration-200 ${currentPath === "/activity"
                        ? "brightness-0 invert pointer-events-none"
                        : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                      }`}
                  /> */}

                  <RxActivityLog className="w-5" />

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Activity</p>
                  )}
                </div>
              </div>

              {/* asset management */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("assetmanagement")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${currentPath === "/assetmanagement"
                      ? "bg-[#4BB452] text-white"
                      : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                    }`}
                >
                  {/* <img
                    src={activity}
                    alt="activity"
                    className={`sidebar-icon transition-all duration-200 ${currentPath === "/activity"
                        ? "brightness-0 invert pointer-events-none"
                        : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                      }`}
                  /> */}

                  <MdManageAccounts className="w-5" />


                  {!arrowClicked && (
                    <p className="text-sm font-medium">Asset</p>
                  )}
                </div>
              </div>  

              {/* attendance reports */}
              {/* <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("reports")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${currentPath === "/reports"
                      ? "bg-[#4BB452] text-white"
                      : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                    }`}
                >
                  

                  <TbReportSearch className="w-5" />



                  {!arrowClicked && (
                    <p className="text-sm font-medium">Reports</p>
                  )}
                </div>
              </div> */}

              {/* setting */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("setting")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/setting"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }`}
                >
                  <IoSettings className="w-5 " />
                  {/* <MdOutlineContactMail  className="w-5 h-5 text-gray-500  "/> */}

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Settings</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="sticky bottom-0 bg-white">
            <div className="p-1">
              <div className="w-full px-2">
                <div
                  onClick={() => onClickSidebarMenu("/")}
                  className={`group flex items-center w-full ${
                    arrowClicked ? "justify-center" : "justify-normal"
                  } px-3 py-3 rounded-full gap-3 mt-1 h-10 border border-black hover:bg-[#E0E0E0]`}
                >
                  <MdLogout />
                  {!arrowClicked && <p className="text-sm">Logout</p>}
                </div>
              </div>
              <hr />
              <div className="flex items-center gap-3 px-2 py-4">
                <img src={admin_icon} className="h-8 w-8 rounded-full" />
                {!arrowClicked && (
                  <div>
                    <p className="text-xs text-gray-500">Welcome back</p>
                    <p className="text-sm font-medium">PSS Agencies</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
