import React from "react";
import { useNavigate } from "react-router-dom";
import sample from "../../assets/sample.jpg";
import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { MdOutlineArrowCircleLeft } from "react-icons/md";

const Job_Applications_Mainbar = () => {
  let navigate = useNavigate();

  const [isAnimating, setIsAnimating] = useState(false);

  const [addCandidatesModalOpen, setAddCandidatesModalOpen] = useState(false);
  const openWorkExperienceModal = () => {
    setAddCandidatesModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };
  const closeAddWorkExperienceModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddCandidatesModalOpen(false), 250); // Matches animation duration
  };

  const [candidatesInfoModalOpen, setCandidatesInfoModalOpen] = useState(false);
  const openCandidatesInfoModal = () => {
    setCandidatesInfoModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };
  const closeCandidatesInfoModal = () => {
    setIsAnimating(false);
    setTimeout(() => setCandidatesInfoModalOpen(false), 250); // Matches animation duration
  };

  useEffect(() => {
    if (addCandidatesModalOpen || candidatesInfoModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [addCandidatesModalOpen, candidatesInfoModalOpen]);

  const candidateSkills = [
    "Leadership",
    "Communication",
    "Time Management",
    "Risk Management",
    "Problem-Solving",
    "Organization",
    "Team Collaboration",
    "Negotiation",
    "Critical Thinking",
    "Budget Management",
  ];

  const [skills, setSkills] = useState([]);
  const [skillsInputValue, setSkillsInputValue] = useState("");

  const handleSkillsKeyPress = (e) => {
    if (e.key === "Enter" && skillsInputValue) {
      setSkills([...skills, skillsInputValue.trim()]);
      setSkillsInputValue("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };
  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 py-2 md:py-10">
      <div>
        {/* breadcrumb */}
        <div className="flex gap-2 text-xs items-center">
          <p
            onClick={() => navigate("/vacancies")}
            className="cursor-pointer text-gray-500"
          >
            Vacancies
          </p>
          <p>{">"}</p>
          <p className=" text-blue-500">Job Application</p>
        </div>

        {/*heading */}
        <div className="flex flex-wrap gap-5 justify-between items-center mt-5">
          <p className="text-2xl font-semibold">JavaScript Developer</p>
          <button
            onClick={openWorkExperienceModal}
            className="bg-blue-500 text-sm md:text-base text-white px-2 md:px-4 h-fit py-1 md:py-2 rounded-full"
          >
            + Add Candidate
          </button>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-5">
          <div className="flex flex-col border bg-white p-3 rounded-2xl gap-2">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2 items-center">
                <p className="h-2.5 w-2.5 bg-yellow-500 rounded-full"></p>
                <p className="text-xs font-medium">New Application</p>
              </div>

              <div className="flex gap-1 items-center">
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
              </div>
            </div>
            <hr />

            {Array(5)
              .fill(0)
              .map((item, index) => (
                <div
                  onClick={openCandidatesInfoModal}
                  className="bg-gray-100 cursor-pointer gap-1 p-5 rounded-xl flex justify-between items-center flex-col"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex gap-2 items-center">
                      <img
                        src={sample}
                        alt=""
                        className="h-9 w-9 object-cover border border-gray-400 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-xs font-medium">Janani</p>
                        <p className="text-xs ms-5">-</p>
                      </div>
                    </div>

                    <p className="font-semibold h-fit text-gray-400 self-start">
                      ...
                    </p>
                  </div>

                  <div className="flex gap-x-3 flex-wrap mt-3 justify-between items-center w-full">
                    <p className="text-xs text-gray-500">APPLICATION DATE</p>
                    <p className="text-xs font-medium">Sep,12,2023 </p>
                  </div>
                  <div className="flex gap-x-3 flex-wrap justify-between items-center w-full">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-xs font-medium">john@gmail.com </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-col border bg-white p-3 rounded-2xl gap-2">
            <div className="flex gap-3 flex-wrap justify-between items-center">
              <div className="flex gap-2 items-center">
                <p className="h-2.5 w-2.5 bg-blue-500 rounded-full"></p>
                <p className="text-xs font-medium">Review</p>
              </div>

              <div className="flex gap-1 items-center">
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
              </div>
            </div>
            <hr />

            {Array(4)
              .fill(0)
              .map((item, index) => (
                <div
                  onClick={openCandidatesInfoModal}
                  className="bg-gray-100 cursor-pointer gap-1 p-5 rounded-xl flex justify-between items-center flex-col"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex gap-2 items-center">
                      <img
                        src={sample}
                        alt=""
                        className="h-9 w-9 object-cover border border-gray-400 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-xs font-medium">Janani</p>
                        <p className="text-xs ms-5">-</p>
                      </div>
                    </div>

                    <p className="font-semibold h-fit text-gray-400 self-start">
                      ...
                    </p>
                  </div>

                  <div className="flex mt-3 gap-x-3 flex-wrap justify-between items-center w-full">
                    <p className="text-xs text-gray-500">APPLICATION DATE</p>
                    <p className="text-xs font-medium">Sep,12,2023 </p>
                  </div>
                  <div className="flex gap-x-3 flex-wrap justify-between items-center w-full">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-xs font-medium">john@gmail.com </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-col border bg-white p-3 rounded-2xl gap-2">
            <div className="flex gap-3 flex-wrap justify-between items-center">
              <div className="flex gap-2 items-center">
                <p className="h-2.5 w-2.5 bg-violet-500 rounded-full"></p>
                <p className="text-xs font-medium">Interview 1</p>
              </div>

              <div className="flex gap-1 items-center">
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
              </div>
            </div>
            <hr />

            {Array(5)
              .fill(0)
              .map((item, index) => (
                <div
                  onClick={openCandidatesInfoModal}
                  className="bg-gray-100 cursor-pointer gap-1 p-5 rounded-xl flex justify-between items-center flex-col"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex gap-2 items-center">
                      <img
                        src={sample}
                        alt=""
                        className="h-9 w-9 object-cover border border-gray-400 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-xs font-medium">Janani</p>
                        <p className="text-xs ms-5">-</p>
                      </div>
                    </div>

                    <p className="font-semibold h-fit text-gray-400 self-start">
                      ...
                    </p>
                  </div>

                  <div className="flex mt-3 gap-x-3 flex-wrap justify-between items-center w-full">
                    <p className="text-xs text-gray-500">APPLICATION DATE</p>
                    <p className="text-xs font-medium">Sep,12,2023 </p>
                  </div>
                  <div className="flex gap-x-3 flex-wrap justify-between items-center w-full">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-xs font-medium">john@gmail.com </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-col border bg-white p-3 rounded-2xl gap-2">
            <div className="flex gap-3 flex-wrap justify-between items-center">
              <div className="flex gap-2 items-center">
                <p className="h-2.5 w-2.5 bg-green-500 rounded-full"></p>
                <p className="text-xs font-medium">Interview 2</p>
              </div>

              <div className="flex gap-1 items-center">
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-800"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
                <p className="h-1.5 w-4 rounded-full bg-violet-100"></p>
              </div>
            </div>
            <hr />

            {Array(3)
              .fill(0)
              .map((item, index) => (
                <div
                  onClick={openCandidatesInfoModal}
                  className="bg-gray-100 cursor-pointer gap-1 p-5 rounded-xl flex justify-between items-center flex-col"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex gap-2 items-center">
                      <img
                        src={sample}
                        alt=""
                        className="h-9 w-9 object-cover border border-gray-400 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-xs font-medium">Janani</p>
                        <p className="text-xs ms-5">-</p>
                      </div>
                    </div>

                    <p className="font-semibold h-fit text-gray-400 self-start">
                      ...
                    </p>
                  </div>

                  <div className="flex mt-3 gap-x-3 flex-wrap justify-between items-center w-full">
                    <p className="text-xs text-gray-500">APPLICATION DATE</p>
                    <p className="text-xs font-medium">Sep,12,2023 </p>
                  </div>
                  <div className="flex gap-x-3 flex-wrap justify-between items-center w-full">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-xs font-medium">john@gmail.com </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-col border bg-white p-3 rounded-2xl gap-2">
            <div className="flex gap-5 justify-between items-center">
              <div className="flex gap-2 items-center">
                <p className="h-2.5 w-2.5 bg-blue-700 rounded-full"></p>
                <p className="text-xs font-medium">Offer Extended</p>
              </div>
            </div>
            <hr />

            {Array(2)
              .fill(0)
              .map((item, index) => (
                <div
                  onClick={openCandidatesInfoModal}
                  className="bg-gray-100 cursor-pointer gap-1 p-5 rounded-xl flex justify-between items-center flex-col"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex gap-2 items-center">
                      <img
                        src={sample}
                        alt=""
                        className="h-9 w-9 object-cover border border-gray-400 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-xs font-medium">Janani</p>
                        <p className="text-xs ms-5">-</p>
                      </div>
                    </div>

                    <p className="font-semibold h-fit text-gray-400 self-start">
                      ...
                    </p>
                  </div>

                  <div className="flex mt-3 gap-x-3 flex-wrap justify-between items-center w-full">
                    <p className="text-xs text-gray-500">APPLICATION DATE</p>
                    <p className="text-xs font-medium">Sep,12,2023 </p>
                  </div>
                  <div className="flex gap-x-3 flex-wrap justify-between items-center w-full">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-xs font-medium">john@gmail.com </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {addCandidatesModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm  z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 "
              onClick={closeAddWorkExperienceModal}
            ></div>
            <div
              className={`fixed top-0 right-0 h-full overflow-y-scroll w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10 transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddWorkExperienceModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="flex flex-wrap gap-3 justify-between mt-8 ">
                <p className="text-2xl md:text-3xl font-medium ">
                  Add Candidate
                </p>
                <div className="flex gap-5 justify-end ">
                  <button
                    onClick={closeAddWorkExperienceModal}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 md:px-9 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 md:px-9 md:py-2 font-semibold rounded-full">
                    Save
                  </button>
                </div>
              </div>

              <div className="flex border border-gray-300 px-3 py-3 md:px-7 md:py-7 rounded-xl md:rounded-3xl flex-col gap-3 mt-8">
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <p className="font-semibold text-2xl">Basic Information</p>

                  <p className="font-medium text-sm">Upload Photo</p>
                </div>

                <div className="mt-8 flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="Full Name">
                    FULL NAME
                  </label>

                  <input
                    id="Full Name"
                    name="Full Name"
                    placeholder="Full Name"
                    className="border-2 rounded-xl ps-4 py-2 h-10 border-gray-300 outline-none w-full md:w-96"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label
                    className="font-medium text-sm"
                    htmlFor="COMPANY'S INDUSTRY"
                  >
                    COMPANY'S INDUSTRY
                  </label>

                  <input
                    name="COMPANY'S INDUSTRY"
                    id="COMPANY'S INDUSTRY"
                    placeholder="IT"
                    className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full md:w-96"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="COMPANY NAME">
                    COMPANY NAME
                  </label>

                  <input
                    id="COMPANY NAME"
                    name="COMPANY NAME"
                    placeholder="Aryu Technology"
                    className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full md:w-96"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label
                    className="font-medium text-sm"
                    htmlFor="PERIOD OF WORK"
                  >
                    PERIOD OF WORK
                  </label>

                  <div className="flex gap-3  w-full md:w-96">
                    <input
                      id="PERIOD OF WORK"
                      name="PERIOD OF WORK"
                      placeholder="Start work"
                      className="border-2 w-[50%] rounded-xl px-3 h-10 text-gray-400  border-gray-300 outline-none"
                    />
                    <input
                      placeholder="End work"
                      className="border-2 w-[50%] rounded-xl px-3 h-10 text-gray-400 border-gray-300 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="LINKEDIN ID">
                    LINKEDIN ID
                  </label>

                  <input
                    id="LINKEDIN ID"
                    name="LINKEDIN ID"
                    placeholder="www.example.com"
                    className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full md:w-96"
                  />
                </div>
              </div>

              <div className="flex border border-gray-300 px-3 py-3 md:px-7 md:py-7 rounded-xl md:rounded-3xl flex-col gap-3 mt-5 ">
                <p className="font-semibold text-2xl">Experience</p>

                <div className="mt-8 flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="JOB TITLE">
                    JOB TITLE
                  </label>

                  <input
                    id="JOB TITLE"
                    name="JOB TITLE"
                    placeholder="developer"
                    className="border-2 rounded-xl ps-4 py-2 h-10 border-gray-300 outline-none w-full md:w-96"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="APPLIED ROLE">
                    APPLIED ROLE
                  </label>

                  <input
                    id="APPLIED ROLE"
                    name="APPLIED ROLE"
                    placeholder="Developer"
                    className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full md:w-96"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label
                    className="font-medium text-sm"
                    htmlFor="EMAIL ADDRESS"
                  >
                    EMAIL ADDRESS
                  </label>

                  <input
                    name="EMAIL ADDRESS"
                    id="EMAIL ADDRESS"
                    placeholder="sdsd@sds.sds"
                    className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full md:w-96"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="PHONE NUMBER">
                    PHONE NUMBER
                  </label>

                  <input
                    name="PHONE NUMBER"
                    id="PHONE NUMBER"
                    placeholder="1234567890"
                    className="border-2 w-full md:w-96 rounded-xl px-3 h-10 text-gray-400  border-gray-300 outline-none"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="LINKEDIN ID">
                    LINKEDIN ID
                  </label>

                  <input
                    name="LINKEDIN ID"
                    id="LINKEDIN ID"
                    placeholder="www.sdsds.sds"
                    className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full md:w-96"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-2xl border-2 mt-5 border-gray-200 bg-white py-4 px-4 lg:px-6">
                <p className="text-xl font-semibold">Skills</p>

                <div className="bg-gray-100 p-4 rounded-xl mt-3">
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    className="w-full  rounded-md bg-gray-100 h-5 border-none outline-none"
                    value={skillsInputValue}
                    onChange={(e) => setSkillsInputValue(e.target.value)}
                    onKeyPress={handleSkillsKeyPress}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white text-gray-800 px-2 py-1 rounded-full"
                      >
                        <span className="mr-2">{skill}</span>
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
            </div>
          </div>
        )}

        {candidatesInfoModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm  z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 "
              onClick={closeCandidatesInfoModal}
            ></div>

            <div
              className={`fixed top-0 right-0 h-full overflow-y-scroll w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10 transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeCandidatesInfoModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="flex mt-5 justify-between">
                <div className="flex cursor-pointer items-center gap-1">
                  <MdOutlineArrowCircleLeft className="text-xl" />
                  <p className="text-gray-800">Previous</p>
                </div>

                <div className="flex cursor-pointer items-center gap-1">
                  <MdOutlineArrowCircleRight className="text-xl" />
                  <p className="text-gray-800">Next</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 items-center justify-between mt-5">
                <div className="flex flex-wrap  items-center gap-5">
                  <img
                    src={sample}
                    alt=""
                    className="h-16 w-16 object-cover border border-gray-500 rounded-full"
                  />
                  <div className="flex gap-1 flex-col">
                    <p className="font-bold text-lg ">Janani</p>
                    <p className="font-medium text-gray-800">
                      Applied for{" "}
                      <span className="bg-[#FAAB3C] px-2 py-2 rounded-full">
                        Full Stack Developer
                      </span>
                    </p>
                    <p className="cursor-pointer text-gray-800">Cv.pdf</p>
                  </div>
                </div>

                <div className="flex  items-center gap-5">
                  <p>STATUS</p>
                  <input
                    className="border w-44 px-3 py-2 rounded-xl border-gray-300 outline-none"
                    type="text"
                    name=""
                    id=""
                    value={"New Application"}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-start gap-5 mt-8">
                <div className=" w-full lg:basis-[50%]">
                  <div className="border-2 bg-white flex-grow rounded-2xl px-3 py-3 md:px-5 md:py-5">
                    <p className="text-xl md:text-2xl font-semibold">
                      Personal Details
                    </p>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between mt-3">
                        <p className="text-sm">FULL NAME</p>
                        <p className="font-medium text-sm">Janani</p>
                      </div>
                      <hr />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between mt-3">
                        <p className="text-sm">EMAIL</p>
                        <p className="font-medium text-sm">dfdf@dffs.ssd</p>
                      </div>
                      <hr />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between mt-3">
                        <p className="text-sm">PHONE</p>
                        <p className="font-medium text-sm">1234567890</p>
                      </div>
                      <hr />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between mt-3">
                        <p className="text-sm">LINKEDIN</p>
                        <p className="font-medium text-sm">
                          linkedin.com/in/j.steuber
                        </p>
                      </div>
                      <hr />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between mt-3">
                        <p className="text-sm">APPLIED</p>
                        <p className="font-medium text-sm">Aug 22,2024</p>
                      </div>
                      <hr />
                    </div>
                  </div>
                  <div className="border-2 bg-white px-3 py-3 md:px-5 md:py-5 rounded-2xl mt-3 ">
                    <p className="text-xl md:text-2xl font-semibold">
                      Educations Information
                    </p>

                    <div className="h-7 w-7 bg-gray-300 rounded-full mt-2"></div>
                    <p className="font-medium mt-1">
                      Bachelor of Science in Computer Science
                    </p>

                    <p className="text-sm font-medium  mt-1">
                      UNIVERSITY OF TECHNOLOGY
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Graduated may 2018
                    </p>

                    <hr className="my-5" />

                    <div className="h-7 w-7 bg-gray-300 rounded-full"></div>
                    <p className="font-medium mt-2">
                      Certificate in Full Stack Web Development
                    </p>
                    <p className="font-medium">CODING ACADEMY</p>
                  </div>
                </div>

                <div className="basis-[50%]">
                  <div className="border-2 bg-white px-3 py-3 md:px-5 md:py-5 flex-grow rounded-2xl ">
                    <p className="text-xl md:text-2xl font-semibold">
                      Professional Experience
                    </p>

                    {Array(3)
                      .fill(0)
                      .map((item, index) => (
                        <div>
                          <div className="flex justify-between mt-3">
                            <div className="flex flex-col items-end">
                              <p className="font-semibold text-lg">
                                Senior Project Manager
                              </p>
                              <p className="text-sm font-medium me-5">
                                Aug, 2023 - Present
                              </p>
                            </div>

                            <div className="flex flex-col items-end">
                              <div className="h-7 w-7 rounded-md bg-gray-200"></div>
                              <p className="text-sm">Daytor</p>
                            </div>
                          </div>

                          <p className="mt-3 text-sm font-medium">
                            Tech Solutions Pro
                          </p>

                          <p className="text-sm md:text-base">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. When an unknown printer took a
                            galley of type and
                          </p>

                          <hr className="my-3" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className=" bg-gray-100 px-3 py-3 md:px-5 md:py-5 rounded-2xl mt-3 ">
                <p className="text-2xl font-semibold">Skills</p>

                <div className="flex flex-wrap   rounded-3xl gap-2 mt-2">
                  {candidateSkills.map((item) => (
                    <p className="px-3 py-1 md:py-2 bg-white rounded-full border-2 w-fit ">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Job_Applications_Mainbar;
