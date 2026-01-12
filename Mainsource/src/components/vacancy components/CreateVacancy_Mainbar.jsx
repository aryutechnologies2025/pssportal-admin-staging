import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";

const CreateVacancy_Mainbar = () => {
  let navigate = useNavigate();

  const [searchedDepartment, setSearchedDepartment] = useState("");
  const [departmentIsOpen, setDepartmentIsOpen] = useState(false);
  const [selectedDepartmentOption, setSelectedDepartmentOption] =
    useState(null); // To store the selected option
  const departmentOptions = [
    "Development",
    "SEO",
    "Digital Marketing",
    "Accounts",
  ];

  const filteredDepartmentOptions = departmentOptions.filter((option) =>
    option.toLowerCase().includes(searchedDepartment.toLowerCase())
  );

  const onClickCancelBtn = () => {
    navigate("/vacancies");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };
  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 pt-2 md:pt-5">
      <div>
        <Mobile_Sidebar />
        <div className="flex gap-2 text-sm items-center">
          <p
            className=" text-gray-500 cursor-pointer"
            onClick={() => navigate("/vacancies")}
          >
            Vacancies
          </p>
          <p>{">"}</p>
          <p className=" text-blue-500">Create Vacancy</p>
          <p>{">"}</p>
        </div>

        <div>
          <div className="flex flex-col md:items-center sm:flex-row justify-between mt-5">
            <p className="text-2xl md:text-3xl font-semibold ">Create Vacancy</p>

            {/* Heading */}
            <div className="flex w-full sm:w-fit justify-end  items-end gap-5 mt-8 md:mt-0">
              <button
                onClick={onClickCancelBtn}
                className="bg-blue-100  hover:bg-blue-200  text-blue-600 px-5 md:px-9 py-0.5 md:py-2 md:font-semibold rounded-full"
              >
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-5 md:px-9 py-0.5 md:py-2 md:font-semibold rounded-full">
                Save
              </button>
            </div>
          </div>

          {/*main flex */}
          <div className="flex flex-col  lg:flex-row gap-3 my-5">
            {/* leftside bar */}
            <div className="basis-[50vw] flex-grow  flex flex-col gap-3 ">
              <div className="rounded-2xl border-2 border-gray-200 bg-white  py-4 px-4 xl:px-6">
                <p className="text-xl font-semibold">Basic Information</p>
                <p className="text-xs text-end md:text-sm mt-3 font-medium cursor-pointer">
                  Upload Photo
                </p>

                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm">JOB TITLE</label>
                      <p className="text-xs">Add position name</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Position Name"
                      className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full  xl:w-60 "
                    />
                  </div>

                  {/* Department */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm">DEPARTMENT</label>
                      <p className="text-xs">Choose department</p>
                    </div>

                    <div className="relative border-2 rounded-xl ps-4 border-gray-300 outline-none w-full  xl:w-60">
                      <button
                        onClick={() => setDepartmentIsOpen(!departmentIsOpen)}
                        className={`w-full ${
                          selectedDepartmentOption
                            ? "text-black"
                            : "text-gray-400"
                        } py-2 text-left bg-white rounded-xl shadow-sm focus:outline-none`}
                      >
                        {selectedDepartmentOption || "Choose department"}
                      </button>

                      {departmentIsOpen && (
                        <div className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-xl shadow-xl">
                          <input
                            type="text"
                            value={searchedDepartment}
                            onChange={(e) =>
                              setSearchedDepartment(e.target.value)
                            }
                            placeholder="Search..."
                            className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                          />
                          <ul className="max-h-48 overflow-y-auto">
                            {filteredDepartmentOptions.length > 0 ? (
                              filteredDepartmentOptions.map((option, index) => (
                                <li
                                  key={index}
                                  onClick={() => {
                                    setSelectedDepartmentOption(option);
                                    setDepartmentIsOpen(false);
                                  }}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                  {option}
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-2 text-gray-500">
                                No results found
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* job description*/}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm">
                        JOB DESCRIPTION
                      </label>
                      <p className="text-xs">
                        for effective canditate selection
                      </p>
                    </div>
                    <textarea
                      name=""
                      id=""
                      placeholder="Enter job description"
                      className="border-2 rounded-xl ps-4 py-1 h-36 border-gray-300 outline-none w-full  xl:w-60"
                    ></textarea>
                  </div>

                  {/*EMPLOYMENT TYPE*/}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm">
                        EMPLOYMENT TYPE
                      </label>
                      <p className="text-xs">Pick one or multiple options</p>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full  xl:w-60">
                      <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="fulltime" />
                        <label
                          className="font-medium text-sm"
                          htmlFor="fulltime"
                        >
                          Full Time
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="parttime" />
                        <label
                          className="font-medium text-sm"
                          htmlFor="parttime"
                        >
                          Part Time
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="Contract" />
                        <label
                          className="font-medium text-sm"
                          htmlFor="Contract"
                        >
                          Contract
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="Freelance" />
                        <label
                          className="font-medium text-sm"
                          htmlFor="Freelance"
                        >
                          Freelance
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="Remote" />
                        <label className="font-medium text-sm" htmlFor="Remote">
                          Remote
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* job location */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm">
                        JOB LOCATION
                      </label>
                      <p className="text-xs">
                        Choose multiple options if available
                      </p>
                    </div>
                    <input
                      type="email"
                      placeholder="@example.com"
                      className="border-2 h-10 rounded-xl ps-4 border-gray-300 outline-none w-full  xl:w-60"
                    />
                  </div>

                  {/* SALARY */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm">SALARY</label>
                      <p className="text-xs">
                        Choose how you prefer for this job
                      </p>
                    </div>
                    <input
                      type="number"
                      placeholder="Passport No."
                      className="border-2 h-10 rounded-xl ps-4 border-gray-300 outline-none w-full  xl:w-60"
                    />
                  </div>

                  {/*MULTIPLE CANDIDATES*/}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm">
                        MULTIPLE CANDIDATES
                      </label>
                      <p className="text-xs">
                        This will be displayed on job page
                      </p>
                    </div>

                    <div className="flex items-center gap-1 w-full xl:w-60">
                      <input type="checkbox" id="hiringmultiple" />
                      <label htmlFor="hiring multiple">
                        Yes, I am hiring multiple candidates
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates and Status */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 xl:px-6 ">
                <p className="text-xl font-semibold ">Dates and Status</p>

                <div className="flex flex-col gap-4 mt-4">
                  {/* Vacancy Status */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm">
                        VACANCY STATUS
                      </label>
                      <p className="text-xs">Choose current stage </p>
                    </div>
                    <input
                      type="text"
                      placeholder="Choose Status"
                      className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full  xl:w-60"
                    />
                  </div>

                  {/* Opening & Closing Date  */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm">
                        OPENING & CLOSING DATE
                      </label>
                      <p className="text-xs">if applicable</p>
                    </div>

                    <div className="flex gap-3 w-full  xl:w-60">
                      <input
                        type="text"
                        placeholder="PF Exp Date"
                        className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-1/2 "
                      />
                      <input
                        type="text"
                        placeholder="PF Exp Date"
                        className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-1/2 "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* rightside bar */}
            <div className=" flex flex-grow basis-[50vw]   flex-col gap-3 ">
              {/*Applicant requirements*/}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 xl:px-6">
                <p className="text-xl font-semibold">Applicant requirements </p>
                <div className="flex flex-col gap-4 mt-4">
                  {/* Work experience* */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm">
                        WORK EXPERIENCE
                      </label>
                      <p className="text-xs">
                        Provide details about experience
                      </p>
                    </div>
                    <input
                      type="number"
                      placeholder="no experience required"
                      className="border-2 h-10 rounded-xl ps-4 border-gray-300 outline-none w-full xl:w-60"
                    />
                  </div>

                  {/* Education */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm">Education</label>
                      <p className="text-xs">Select Education</p>
                    </div>
                    <input
                      type="number"
                      placeholder="Higher"
                      className="border-2 rounded-xl h-10 ps-4 w-full xl:w-60 border-gray-300 outline-none"
                    />
                  </div>

                  {/* The job is suitable for: */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm">
                        THE JOB IS SUITABLE FOR
                      </label>
                      <p className="text-xs">Pick one or multiple options</p>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full  xl:w-60">
                      <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="fulltime" />
                        <label
                          className="font-medium text-sm"
                          htmlFor="fulltime"
                        >
                          A student
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="parttime" />
                        <label
                          className="font-medium text-sm"
                          htmlFor="parttime"
                        >
                          A veteran
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="Contract" />
                        <label
                          className="font-medium text-sm"
                          htmlFor="Contract"
                        >
                          A person with disabilities
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col w-52">
                      <label className="font-medium text-sm">
                        RESPONSIBILITIES
                      </label>
                      <p className="text-xs">
                        Main tasks that the candidate will be accountable for in
                        this role
                      </p>
                    </div>

                    <textarea
                      name=""
                      id=""
                      placeholder="Performing tasks related to... Organizing and coordinating... Analyzing and optimizing..."
                      className="border-2 rounded-xl h-36 ps-4 py-2 w-full xl:w-60 border-gray-300 outline-none"
                    ></textarea>
                  </div>

                  {/* Duties */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col w-full lg:w-52">
                      <label className="font-medium text-sm">DUTIES</label>
                      <p className="text-xs">
                        specific tasks and actions that the candidate will be
                        responsible for on a day-to-day basis
                      </p>
                    </div>

                    <textarea
                      name=""
                      id=""
                      placeholder="Planning and executing...Ensuring the efficient functioning of...
Supporting processes..."
                      className="border-2 rounded-xl h-36 ps-4 w-full py-2  xl:w-60 border-gray-300 outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Contact information */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 xl:px-6">
                <p className="text-xl font-semibold">Contact information</p>

                <div className="flex flex-col gap-4 mt-4">
                  {/* Contact Person */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm">
                        CONTACT PERSON
                      </label>
                      <p className="text-xs">Person to contact for inquiries</p>
                    </div>

                    <input
                      type="number"
                      placeholder="Name"
                      className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full xl:w-60"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm">
                        CONTACT PHONE
                      </label>
                      <p className="text-xs">Phone for enquiries</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full xl:w-60"
                    />
                  </div>

                  {/* Additional Contact */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm">
                        ADDITIONAL CONTACT
                      </label>
                      <p className="text-xs">Extra contact info if needed</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Skype, whatsapp, etc"
                      className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full xl:w-60"
                    />
                  </div>

                  {/* Show contacts */}
                  <div className="flex flex-col xl:flex-row justify-between  ">
                    <div className="flex flex-col w-full lg:w-52">
                      <label className="font-medium text-sm">
                        SHOW CONTACT
                      </label>
                      <p className="text-xs">
                        This will be displayed on job page
                      </p>
                    </div>
                    <div className="flex items-center gap-1 w-full lg:w-52">
                      <input type="checkbox" />
                      <label className="text-sm font-medium" htmlFor="">
                        Show the name and phone number on this job page
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateVacancy_Mainbar;
