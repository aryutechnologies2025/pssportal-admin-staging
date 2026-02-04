import React, { useRef } from "react";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import medics_logo from "../assets/medics_logo.svg";
import { IoPeopleOutline, IoSettings } from "react-icons/io5";
import { BsCalendar2Check } from "react-icons/bs";
import { FaRegBuilding, FaRegMessage } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { TbReportSearch, TbUrgent } from "react-icons/tb";
import { CiMoneyCheck1 } from "react-icons/ci";
import { MdLogout, MdManageAccounts, MdOutlineContactMail } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";
import admin_icon from "../assets/admin_icon.png";
import { FaFileContract } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { RxActivityLog } from "react-icons/rx";
import { TbReport } from "react-icons/tb";
import { VscReport } from "react-icons/vsc";
import contractcandidates from "../assets/contract_Candidates.svg";
import { LiaFileContractSolid } from "react-icons/lia";
import { MdCampaign } from "react-icons/md";

const Mobile_Sidebar = () => {
  let navigate = useNavigate();

  const [buttonLoading, setButtonLoading] = useState(false);
  const [arrowClicked, setArrowClicked] = useState(false);
  const [openContract, setOpenContract] = useState(false);
  const [openReport, setOpenReport] = useState(false);
 const [openInterview, setOpenInterview] = useState(false);
  const [hamburgerIconClicked, setHamburgerIconClicked] = useState(false);
  const [selectAnyOneClicked, setSelectAnyOneClicked] = useState(false);
  const [selectOneClicked, setSelectOneClicked] = useState(false);

  const onClickSidebarMenu = (label) => {
    if (label === "/") {
      setButtonLoading(true);
      setTimeout(() => {
        localStorage.removeItem("pssuser");

        window.location.reload();


        localStorage.removeItem("pssuser");


        window.scrollTo({ top: 0, behavior: "instant" });
        setButtonLoading(false);
      }, 300);
      navigate("/");
    } else {
      navigate(`/${label.toLowerCase()}`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const user = JSON.parse(localStorage.getItem("pssuser"));
  const onClickHamburgerIcon = () => {
    setHamburgerIconClicked(!hamburgerIconClicked);
  };

  useEffect(() => {
    if (hamburgerIconClicked) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [hamburgerIconClicked]);

  const [openSection, setOpenSection] = useState(null);

  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  // CLOSE MENU ON OUTSIDE CLICK
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex my-3 justify-start items-center w-full md:hidden">
        <div className="flex justify-between items-center w-full bg-white px-4 py-2 shadow-md">

          {/* hamburger icon */}
          <GiHamburgerMenu className="text-xl" onClick={onClickHamburgerIcon} />

          {/* logo */}
          <img
            src="/pssAgenciesLogo.svg"
            alt="PSS Logo"
            className="w-40 md:w-48 h-auto mx-auto mb-2 cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* user icon */}
          <div className="relative" ref={menuRef}>
            <img
              src={admin_icon}
              alt="profile"
              className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer object-cover"
              onClick={() => setOpenMenu(!openMenu)}
            />


            {/* Dropdown Menu */}
            {openMenu && (
              <div className="absolute right-1 mt-3 w-44 bg-white shadow-lg rounded-xl py-3 z-50 animate-fadeIn border border-gray-100">

                {/* Settings */}
                <div
                  onClick={() => onClickSidebarMenu("settings")}
                  className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-green-600 cursor-pointer rounded-lg transition"
                >
                  <IoSettings className="text-lg" />
                  <span className="text-sm font-medium">Settings</span>
                </div>

                {/* Divider */}
                <div className="border-t my-2"></div>

                {/* Logout Button */}
                <div
                  onClick={() => onClickSidebarMenu("/")}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer 
                 bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  {buttonLoading ? (
                    <Button_Loader />
                  ) : (
                    <>
                      <MdLogout className="text-lg" />
                      <span className="text-sm font-medium">Logout</span>
                    </>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {hamburgerIconClicked && (
        <div className="fixed block md:hidden h-screen  inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 backdrop-blur-sm bg-opacity-25"
            onClick={() => setHamburgerIconClicked(false)}
          ></div>

          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-[70vw] sm:w-[50vw] bg-white shadow-lg transform transition-transform duration-1000 ease-in-out${hamburgerIconClicked ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex mt-4 ps-5">
                <IoClose
                  className="text-2xl"
                  onClick={() => setHamburgerIconClicked(false)}
                />
              </div>

              {/* Logo */}
              <div className="flex items-center justify-center">
                <img
                  src="/pssAgenciesLogo.svg"
                  alt="PSS Logo"
                  className="w-40 md:w-48 h-auto mx-auto mb-2"
                />
              </div>

              {/* Sidebar Menu */}
              <div className="flex-grow overflow-y-auto w-full flex flex-col justify-start">
                <div className="flex flex-col gap-1 mt-3 px-4">
                  <div
                    onClick={() => onClickSidebarMenu("Dashboard")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <CiBoxList />
                    </div>
                    <p>Dashboard</p>
                  </div>
                  
                  {/* report */}
                   {/* <div className="w-full">
                    <div
                      onClick={() => setOpenReport(!openReport)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer
      ${openReport ? "bg-green-100 text-[#4BB452]" : "text-gray-500 hover:bg-green-100"}
    `}
                    >
                      <div className="flex items-center gap-2">
                        <VscReport  />
                        <span className="text-sm font-medium">Report</span>
                      </div>

                      {openReport ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>

                    {openReport && (
                      <div className="ml-6 mt-1 flex flex-col gap-1">
                        <button
                          onClick={() => onClickSidebarMenu("contract-report")}
                          className="text-left text-sm font-medium text-green-600 px-2 py-1 rounded-md hover:bg-green-50"
                        >
                          Contracts
                        </button>
                      </div>
                    )}
                  </div> */}

                  {/* pss */}
                  <div className="w-full">
                  <div
                    onClick={() => setSelectAnyOneClicked(!selectAnyOneClicked)}
                    className="flex items-center justify-between w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-md gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <IoPeopleOutline />
                      <p>PSS</p>
                    </div>
                    
                    {selectAnyOneClicked ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}{" "}
                  </div>

                  {selectAnyOneClicked && (
                    <div
                      className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${selectAnyOneClicked
                        ? "max-h-45 opacity-100"
                        : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="flex gap-2 items-start ms-10 flex-col text-sm font-medium text-gray-500">
                       
                       <button
                          onClick={() => onClickSidebarMenu("psscompany")}
                          className="hover:bg-green-100  w-full text-left px-2 py-1 rounded-md"
                        >
                          Companies
                        </button>
                       <button
                          onClick={() => onClickSidebarMenu("branches")}
                          className="hover:bg-green-100  w-full text-left px-2 py-1 rounded-md"
                        >
                          Branches
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("departments")}
                          className="hover:bg-green-100  w-full text-left px-2 py-1 rounded-md"
                        >
                          Departments
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("roles")}
                          className="hover:bg-green-100  w-full text-left px-2 py-1 rounded-md"
                        >
                          Roles
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("employees")}
                          className="hover:bg-green-100 w-full text-left px-2 py-1 rounded-md"

                        >
                          Employees
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("permission")}
                          className="hover:bg-green-100 w-full text-left px-2 py-1 rounded-md"

                        >
                          Privileges
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("pssdailyattendance")}
                          className="hover:bg-green-100 w-full text-left px-2 py-1 rounded-md"

                        >
                          Attendance
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("dailywork-report")}
                          className="hover:bg-green-100 w-full text-left px-2 py-1 rounded-md"

                        >
                          Work Report
                        </button>
                         {/* <button
                          onClick={() => onClickSidebarMenu("/shift")}
                          className="hover:bg-green-100 w-full text-left px-2 py-1 rounded-md"

                        >
                          shifts
                        </button> */}

                      </div>
                    </div>
                  )}
                  </div>

                  {/* company */}
                  <div
                    onClick={() => onClickSidebarMenu("company")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <FaRegBuilding />
                    </div>
                    <p>Company</p>
                  </div>

                  {/* Interview */}
                   <div className="w-full">
                    <div
                      onClick={() => setOpenInterview(!openInterview)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer
      ${openInterview ? "bg-green-100 text-[#4BB452]" : "text-gray-600 hover:bg-green-100"}
    `}
                    >
                      <div className="flex items-center gap-2">
                        <img
                                            src={contractcandidates}
                                            alt="contract"
                                            className={`sidebar-icon transition-all duration-200 ${
                                              openInterview === "/contractcandidates"
                                                ? "brightness-0 invert pointer-events-none"
                                                : "group-hover:brightness-0 group-hover:[filter:invert(45%)_sepia(65%)_saturate(450%)_hue-rotate(85deg)_brightness(95%)_contrast(95%)]"
                                            }`}
                                          />
                        <span className="text-sm font-medium">Interview</span>
                      </div>

                      {openInterview ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>

                    {openInterview && (
                      <div className="ml-6 mt-1 flex flex-col gap-1">
                        <button
                          onClick={() => onClickSidebarMenu("contractcandidates")}
                          className="text-left text-sm font-medium text-green-600 px-2 py-1 rounded-md hover:bg-green-50"
                        >
                          Candidates
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Contract */}
                   <div className="w-full">
                  <div
                    onClick={() => setSelectOneClicked(!selectOneClicked)}
                    className="flex items-center justify-between w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-md gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LiaFileContractSolid />
                      <p>Contract</p>
                    </div>
                    
                    {selectOneClicked ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}{" "}
                  </div>

                  {selectOneClicked && (
                    <div
                      className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${selectOneClicked
                        ? "max-h-45 opacity-100"
                        : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="flex gap-2 items-start ms-10 flex-col text-sm font-medium text-gray-500">
                       
                       <button
                          onClick={() => onClickSidebarMenu("employeecontract")}
                          className="hover:bg-green-100  w-full text-left px-2 py-1 rounded-md"
                        >
                          Employee
                        </button>
                       <button
                          onClick={() => onClickSidebarMenu("attendance")}
                          className="hover:bg-green-100  w-full text-left px-2 py-1 rounded-md"
                        >
                          Attendence
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("boarding-point")}
                          className="hover:bg-green-100  w-full text-left px-2 py-1 rounded-md"
                        >
                          Boarding Point
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("education")}
                          className="hover:bg-green-100  w-full text-left px-2 py-1 rounded-md"
                        >
                          Education
                        </button>
                        {/* <button
                          onClick={() => onClickSidebarMenu("relieved-contract")}
                          className="hover:bg-green-100 w-full text-left px-2 py-1 rounded-md"

                        >
                          Relieved
                        </button> */}
                

                      </div>
                    </div>
                  )}
                  </div>

                  {/* <div
                    onClick={() => onClickSidebarMenu("Payroll")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <CiMoneyCheck1 />
                    </div>
                    <p>Payroll</p>
                  </div>
                  <div
                    onClick={() => onClickSidebarMenu("Finance")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <GrMoney />
                    </div>
                    <p>Finance</p>
                  </div>
                  <div
                    onClick={() => onClickSidebarMenu("Message")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <FaRegMessage />
                    </div>
                    <p>Message</p>
                  </div> */}
                  {/* job form */}
                  <div
                    onClick={() => onClickSidebarMenu("job-form")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <FaWpforms />
                    </div>
                    <p>Job Form</p>
                  </div>

                  {/* <div
                    onClick={() => onClickSidebarMenu("dailywork-report")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <TbReport />
                    </div>
                    <p>Daily Work Report</p>
                  </div> */}
                  
                  {/* lead engine */}
                  <div
                    onClick={() => onClickSidebarMenu("lead-engine")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <MdLeaderboard />
                    </div>
                    <p>Lead Engine</p>
                  </div>
                  
                  {/* contact */}
                  <div
                    onClick={() => onClickSidebarMenu("contact")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <MdOutlineContactMail />

                    </div>
                    <p>Contact</p>
                  </div>

                  {/* announcement */}
                  {/* <div
                    onClick={() => onClickSidebarMenu("announcement")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                       <MdCampaign />

                    </div>
                    <p>Announcement</p>
                  </div> */}

{/* activity */}
                      <div
                    onClick={() => onClickSidebarMenu("activity")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <RxActivityLog />

                    </div>
                    <p>Activity</p>
                  </div>



{/* attendance report */}
                    {/* <div
                    onClick={() => onClickSidebarMenu("assetmanagement")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                     <MdManageAccounts />
                    </div>
                    <p>Asset</p>
                  </div> */}

                  <div
                    onClick={() => onClickSidebarMenu("setting")}
                    className="flex items-center w-full hover:bg-green-100 hover:text-[#4BB452] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <IoSettings />

                    </div>
                    <p>Settings</p>
                  </div>

                </div>




                {/* Logout */}
                <div
                  onClick={() => onClickSidebarMenu("/")}
                  className={`flex items-center text-center ${arrowClicked ? "justify-center" : "justify-normal w-36"
                    } ${buttonLoading ? "justify-center" : "justify-normal"
                    } px-3 py-3 rounded-full gap-3 mx-5  items-center text-center my-2 border border-black  hover:bg-[#E0E0E0] hover:border-[#E0E0E0] transition-all duration-200  cursor-pointer`}
                >
                  {buttonLoading ? (
                    <Button_Loader />
                  ) : (
                    <>
                      <div className="text-black flex items-center justify-center">
                        <MdLogout />
                      </div>
                      {!arrowClicked && (
                        <p className="text-sm font-medium text-black">Logout</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* User Section */}
              <div>
                <hr className="border-gray-300" />
                <div className="flex items-center gap-3 px-4 py-4">
                  <img src={admin_icon} alt="" className="h-8 w-8 rounded-full" />
                  <div className="flex flex-col">
                    <p className="text-xs font-medium  text-gray-500">
                      Welcome back
                    </p>
                    <p className="font-medium text-sm">PSS Agencies</p>
                  </div>
                  <IoIosArrowForward className="ml-auto text-gray-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mobile_Sidebar;
