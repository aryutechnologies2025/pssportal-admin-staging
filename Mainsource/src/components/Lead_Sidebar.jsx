import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCampaign, MdLogout, MdManageAccounts, MdOutlineAssignmentTurnedIn } from "react-icons/md";
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
import { IoHomeOutline, IoSettings } from "react-icons/io5";
import { RxActivityLog } from "react-icons/rx";
import axiosInstance from "../axiosConfig";
import { API_URL } from "../Config";
import { TbCategory, TbReportSearch } from "react-icons/tb";
import { MdLeaderboard } from "react-icons/md";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { BsBuildingUp } from "react-icons/bs";
import { TbReport } from "react-icons/tb";
import { AiOutlineMessage } from "react-icons/ai";

const Lead_Sidebar = () => {
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

                {/* home */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-[7px]"}`}>
                <div
                  onClick={() => onClickSidebarMenu("dashboard")}
                  className={`flex items-center h-10 w-full flex-grow ${
                    arrowClicked ? "justify-center  " : "justify-normal"
                  } hover:bg-green-100 hover:text-[#4BB452] px-2 py-3 rounded-md gap-2 text-gray-500 text-sm font-medium cursor-pointer ${
                    currentPath === "/dashboard"
                      ? "bg-[#4BB452] text-white"
                      : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                  }`}
                >
                  <IoHomeOutline className="w-5" />
                  {!arrowClicked && <p className="text-sm">Home</p>}
                </div>
              </div>


              {/* dashboard */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-[7px]"}`}>
                <div
                  onClick={() => onClickSidebarMenu("lead-dashboard")}
                  className={`flex items-center h-10 w-full flex-grow ${
                    arrowClicked ? "justify-center  " : "justify-normal"
                  } hover:bg-green-100 hover:text-[#4BB452] px-2 py-3 rounded-md gap-2 text-gray-500 text-sm font-medium cursor-pointer ${
                    currentPath === "/lead-dashboard"
                      ? "bg-[#4BB452] text-white"
                      : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                  }`}
                >
                  <CiBoxList className="w-5" />
                  {!arrowClicked && <p className="text-sm">Dashboard</p>}
                </div>
              </div>

                            {/* category */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("lead-category")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/lead-category"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }`}
                >
                 
                  <TbCategory className="w-5 h-5 "/>

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Category</p>
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

{/* assign lead */}

  <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("lead-assignedto")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${
      currentPath === "/lead-assignedto"
        ? "bg-[#4BB452] text-white"
        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
    }`}
                >
                  <MdOutlineAssignmentTurnedIn className="w-5 " />

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Assigned Leads</p>
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

export default Lead_Sidebar;
