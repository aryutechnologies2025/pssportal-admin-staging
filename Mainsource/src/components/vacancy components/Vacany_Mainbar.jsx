import React from "react";
import { FaJsSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";

const Vacany_Mainbar = () => {
  let navigate = useNavigate();
  const [showFilterBtnClicked, setShowFilterBtnClicked] = useState(false);

  const onClickAddVacancy = () => {
    navigate("/createvacancy");
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 pt-2 md:pt-10">
      <div>
        <Mobile_Sidebar />

        <div className="flex gap-2 text-sm items-center">
          <p className=" text-blue-500">Vacancies</p>
          <p>{">"}</p>
        </div>

        <div className="flex gap-5 flex-wrap justify-between items-end mt-5 ">
          <div className="flex flex-col md:flex-row flex-wrap gap-2">
            <p className="font-semibold text-2xl">Vacancies</p>

            <div className="flex items-center flex-wrap gap-2">
              <button className="text-xs font-medium ms-0 xl:ms-8 bg-blue-100 px-5 py-2 rounded-full">
                All Vacancies
              </button>
              <button className="text-xs font-medium text-white bg-blue-600 px-5 py-2 rounded-full">
                Open
              </button>
              <button className="text-xs font-medium bg-blue-100 px-5 py-2 rounded-full">
                Completed
              </button>
              <button className="text-xs font-medium bg-blue-100 px-5 py-2 rounded-full">
                In Progress
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <button className="text-xs font-medium text-blue-600 bg-blue-100 px-5 py-2 rounded-full">
              Import
            </button>
            <button
              onClick={onClickAddVacancy}
              className="text-xs font-medium text-white bg-blue-600 px-5 py-2 rounded-full"
            >
              + Add Vacancy
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className={`${
              showFilterBtnClicked ? "bg-red-500" : "bg-gray-500"
            } px-5 lg:hidden py-0.5 md:py-1 h-fit  mt-3 w-32 text-white rounded-xl`}
            onClick={() => setShowFilterBtnClicked(!showFilterBtnClicked)}
          >
            {showFilterBtnClicked ? "Close Filter" : "Filter"}
          </button>
        </div>

        <div className=" flex flex-col-reverse lg:flex-row  gap-5">
          {/* leftsidebar */}
          <div className="basis-[60vw] flex gap-3 flex-wrap mt-5 md:mt-8 ">
            {Array(20)
              .fill(null)
              .map((item) => (
                <div onClick={() => navigate("/jobapplication")} className="border cursor-pointer bg-white flex-grow  rounded-2xl px-5 py-3">
                  <div className="flex gap-1 items-center">
                    <FaJsSquare className="text-yellow-500 text-3xl " />
                    <p className="font-medium text-sm">Javascript Developer</p>
                  </div>

                  <div className="flex justify-between mt-3">
                    <div className="flex flex-col gap-1 ms-2">
                      <p className="font-medium text-xs">Salt Lake City</p>
                      <p className="font-medium text-xs">Aug 24 2023</p>
                    </div>
                    <button className="text-[9px] font-semibold bg-green-100 rounded-full px-3 h-fit py-1">
                      OPEN
                    </button>
                  </div>

                  <hr className="my-3" />

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 items-center">
                      <p className="text-2xl font-semibold">45</p>
                      <p className="font-semibold text-xs">Appls</p>
                    </div>

                    <div className="flex gap-1 items-center">
                      <div className="flex items-center">
                        <div className="h-7 w-7 rounded-full border-2 border-white/60 bg-gray-300"></div>
                        <div className="h-7 w-7 rounded-full -ms-2 border-2 border-white/60 bg-gray-300"></div>
                        <div className="h-7 w-7 rounded-full -ms-2 border-2 border-white/60 bg-gray-300"></div>
                      </div>

                      <button className="text-[9px] font-semibold text-white rounded-full px-  h-fit bg-violet-800">
                        +2 new
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* rightsidebar */}
          <div
            className={`flex flex-col ${
              showFilterBtnClicked ? "block" : "max-lg:hidden"
            }  h-fit flex-grow basis-[20vw] gap-5 bg-white rounded-2xl px-5 py-3  mt-5 md:mt-8`}
          >
            <div className="flex gap-3 flex-wrap items-center justify-between">
              <p className="font-semibold ">Vacancies Filter</p>
              <button className="text-xs underline font-medium underline-offset-4">
                CLEAR ALL
              </button>
            </div>

            {/* department */}
            <div className="flex flex-grow flex-col gap-2">
              <p className="text-sm font-medium">Department</p>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  "All Positions",
                  "UX/UI Designer",
                  "PM",
                  "React Developer",
                  "QA",
                  "Data Analyst",
                  "Backend Java Developer",
                  "DevOps",
                  "Python Django Developer",
                ].map((item) => (
                  <p className="border cursor-pointer hover:bg-blue-600 hover:text-white rounded-full px-2 py-1 text-xs">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* position type */}
            <div className="flex flex-grow flex-col gap-2">
              <p className="text-sm font-medium">Position Type</p>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  "All Department",
                  "Development",
                  "Sales & Marketing",
                  "Project Management",
                  "Support",
                  "Analytics & Data",
                ].map((item, index, array) => (
                  <React.Fragment key={index}>
                    <p className="border cursor-pointer hover:bg-blue-600 hover:text-white rounded-full px-2 py-1 text-xs">
                      {item}
                    </p>
                    {index === array.length - 1 && (
                      <span className="ml-2 text-xs text-blue-600 cursor-pointer underline-offset-4 hover:underline">
                        More positions
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* work experience */}
            <div className="flex flex-grow flex-col gap-2">
              <p className="text-sm font-medium">Work Experience</p>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  "Any Experience",
                  "Less than 1 year",
                  "1-2 years",
                  "2-3 years",
                  "3-5 years",
                  "More than 5 years",
                ].map((item) => (
                  <p className="border cursor-pointer hover:bg-blue-600 hover:text-white rounded-full px-2 py-1 text-xs">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* loction */}
            <div className="flex flex-grow flex-col gap-2">
              <p className="text-sm font-medium">Location</p>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  "Any Location",
                  "United States",
                  "Ukraine",
                  "Germany",
                  "France",
                  "Remote",
                ].map((item) => (
                  <p className="border cursor-pointer hover:bg-blue-600 hover:text-white rounded-full px-2 py-1 text-xs">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vacany_Mainbar;
