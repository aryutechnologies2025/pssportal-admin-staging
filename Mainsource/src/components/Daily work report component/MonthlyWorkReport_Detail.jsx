import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Dropdown } from "primereact/dropdown";
import { FaFileExport } from "react-icons/fa6";
import { API_URL } from '../../Config';
import axiosInstance from '../../axiosConfig';
import { useDateUtils } from '../../Utils/useDateUtils';
import Mobile_Sidebar from '../Mobile_Sidebar';
import Footer from '../Footer';
import { ToastContainer } from 'react-toastify';

function MonthlyWorkReport_Detail() {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  // console.log("selectedMonth", selectedMonth);
  const [globalFilter, setGlobalFilter] = useState("");
  const [monthlyReportList, setMonthlyReportList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log("selectedEmployeeName", selectedEmployeeName);
  const [tasklist, setTasklist] = useState([]);
  console.log("tasklist", tasklist)
  const storedDetatis = localStorage.getItem("pssemployee");
  const parsedDetails = JSON.parse(storedDetatis);
  const userid = parsedDetails ? parsedDetails.id : null;
  // const userId = user?.id;
  console.log("user", userid)

  const reset = () => {
    const today = new Date();
    setSelectedMonth(today); // reset to current month
    setSelectedEmployee(null); // reset employee dropdown
    setGlobalFilter(""); // if you have global search filter
    if (userid) {
      // fetch default report for current month
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
      fetchMonthlyReport(userid, currentMonth);
    }
  };


  useEffect(() => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;

    if (userid) {
      fetchMonthlyReport(userid, currentMonth);
    }
  }, [userid]);




  const fetchMonthlyReport = async (employeeId, month) => {
    try {
      setLoading(true);
      console.log("Calling API with:", employeeId, month);

      const response = await axiosInstance.get(
        `${API_URL}api/employee/monthly-report`,
        {
          params: {
            employee_id: employeeId,
            month: month,
          },
        }
      );

      console.log("API RESPONSE ", response.data);

      // Set the task list
      setTasklist(response.data.data || []);

      // Set employee data for dropdown
      if (response.data.employees) {
        setEmployeeData(response.data.employees);
      }
    } catch (error) {
      console.error("Monthly report error:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = () => {
    const monthDate = new Date(selectedMonth);

    const formattedMonth = `${monthDate.getFullYear()}-${String(
      monthDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const employeeId = selectedEmployee || userid;

    if (!employeeId) {
      alert("Please select employee");
      return;
    }

    fetchMonthlyReport(employeeId, formattedMonth);
  };


  const exportToCSV = () => {
    if (!tasklist || tasklist.length === 0) {
      alert("No data available to export");
      return;
    }

    const firstDate = new Date(tasklist[0].date);
    const monthName = firstDate.toLocaleString("default", { month: "long" });
    const year = firstDate.getFullYear();

    const headers = ["Date", "Day", "Employee ID", "Employee Name", "Login Time", "Logout Time", "Total Hours", "Message"];

    const rows = tasklist.flatMap((day) => {
  const employeeId =
    day.employee_id ||
    day.employee?.id ||
    day.emp_id ||
    "-";

  const employeeName =
    day.employee_name ||
    day.employee?.name ||
    day.emp_name ||
    "-";

  if (!day.messages || day.messages.length === 0) {
    return [[
      day.date,
      day.day,
      employeeId,
      employeeName,
      day.login_time || "-",
      day.logout_time || "-",
      day.total_hours || "-",
      "No messages"
    ]];
  }

  return day.messages.map((msg) => [
    day.date,
    day.day,
    employeeId,
    employeeName,
    day.login_time || "-",
    day.logout_time || "-",
    day.total_hours || "-",
    msg.replace(/<[^>]+>/g, "")
  ]);
});


    const csvContent = [
      headers,
      ...rows
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Monthly_Report_${monthName}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };




  return (
    <div className="flex flex-col justify-between w-full min-h-screen bg-gray-100 px-3 md:px-5 pt-4 overflow-x-auto ">
      <div>
        <Mobile_Sidebar />

        <div className="flex justify-start gap-2 mt-2 md:mt-0 items-center">
          <ToastContainer position="top-right" autoClose={3000} />

          <p className="text-xs md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
            Dashboard
          </p>
          <p>{">"}</p>
          <p className="text-xs md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/dailywork-report")}>
            Daily Work Report
          </p>
          <p>{">"}</p>
          <p className="text-xs md:text-md  text-[#1ea600]">Monthly Work Reports</p>
        </div>

        <div className="bg-white mt-2 md:mt-8 px-5 py-5 rounded-2xl">
          {/* <p className="text-2xl font-bold text-gray-500">Attendance List</p> */}
          <div
            style={{ width: "auto", margin: "0 auto" }}
            className="overflow-x-hidden"
          >
            <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-8 justify-between items-center  mt-2 md:mt-5 ">
              {/* Global Search Input */}
              <div className="card flex flex-wrap gap-2 md:gap-4 mb-2  md:mb-4">
                <DatePicker
                  id="DATE OF JOINING"
                  placeholderText="Start work"
                  selected={selectedMonth}
                  onChange={(date) => setSelectedMonth(date)}
                  className="border-2 rounded-xl w-full md:w-44 h-10 px-4 border-gray-300 outline-none"
                  showMonthDropdown
                  showMonthYearPicker
                  dateFormat="MMM-YYYY"
                  dropdownMode="select" // This shows a select-style dropdown
                />
                {/* Global Search Input */}

                {/* <Dropdown
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.value)}
                  options={Array.isArray(employeeData) ? employeeData : []}
                  optionLabel="full_name"
                  optionValue="id"
                  placeholder="Select Employee"
                  filter
                  className="h-10 w-full md:w-48 border-2 rounded-xl border-gray-300"
                /> */}

                <Dropdown
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.value)}
                  options={Array.isArray(employeeData) ? employeeData : []}
                  optionLabel="name"    // <--- use "name" instead of "full_name"
                  optionValue="id"
                  placeholder="Select Employee"
                  filter
                  className="h-10 w-full md:w-48 border-2 rounded-xl border-gray-300"
                />

                <button
                  onClick={handleSubmit}
                  className="bg-[#1ea600] hover:bg-[#23880c] text-white px-4 py-2 rounded-md  duration-300"
                >
                  Search
                </button>

                <button
                  onClick={reset}
                  className="bg-[#1ea600] hover:bg-[#23880c] text-white px-4 py-2 rounded-md  duration-300"
                >
                  Reset
                </button>


              </div>

              <div className="flex items-center justify-center gap-2">
                {/* <InputText
                          value={globalFilter}
                          onChange={(e) => setGlobalFilter(e.target.value)}
                          placeholder="Search"
                          className="px-2 py-2 bg-gray-200 rounded-md"
                        /> */}
                <button
                  onClick={exportToCSV}
                  className="mb-4 bg-[#1ea600] hover:bg-[#23880c] text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2"
                >
                  Export CSV
                  <FaFileExport />
                </button>
              </div>
            </div>

            {/* reports desgins */}
            <div className=" mt-2 md:mt-0 p-2 md:p-5 bg-gray-100 min-h-screen">
              <h1 className="text-2xl font-bold mb-6">Monthly Work Reports</h1>
              {/* {selectedEmployeeDeatils && selectedEmployeeDeatils.length > 0 ? ( */}
              <div className="max-h-[800px] overflow-y-auto p-1 md:p-4 bg-gray-100 rounded-xl">
                {loading ? (
                  <div className="flex items-center justify-center h-[500px]">
                    <div className="w-12 h-12 border-4  border-[#1ea600] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  (() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // filter without map (filter is ok, map not used)
                    const filteredTaskList = tasklist.filter((day) => {
                      const dayDate = new Date(day.date);
                      dayDate.setHours(0, 0, 0, 0);
                      return dayDate <= today;
                    });

                    let hasAnyMessage = false;
                    for (let i = 0; i < filteredTaskList.length; i++) {
                      if (
                        Array.isArray(filteredTaskList[i].messages) &&
                        filteredTaskList[i].messages.length > 0
                      ) {
                        hasAnyMessage = true;
                        break;
                      }
                    }

                    if (filteredTaskList.length === 0) {
                      return (
                        <p className="text-center text-gray-500">
                          No data available
                        </p>
                      );
                    }

                    const tableRows = [];

                    for (let i = 0; i < filteredTaskList.length; i++) {
                      const day = filteredTaskList[i];

                      const messageItems = [];

                      if (day.messages && day.messages.length > 0) {
                        for (let j = 0; j < day.messages.length; j++) {
                          messageItems.push(
                            <li
                              key={j}
                              dangerouslySetInnerHTML={{ __html: day.messages[j] }}
                            />
                          );
                        }
                      }

                      tableRows.push(
                        <tr
                          key={day.date}
                          className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-2 py-3 w-[20%] md:w-[30%] md:sticky left-0 border-r  border-gray-200 z-10">
                            <div className="flex flex-col items-center  px-3 py-5 rounded-xl shadow-md bg-gradient-to-b from-white via-gray-50 to-gray-100">
                              <div className="text-lg font-bold text-[#1ea600]">
                                {day.day}
                              </div>
                              <div className="text-xs md:text-sm font-semibold text-white px-2 md:px-4 py-1 rounded-full bg-green-500">
                                {day.date}
                              </div>
                              <div className="gap-2 font-semibold text-gray-600">
                                <label className='text-xs md:text-sm'>Login Time:</label>
                                {day.login_time || "-"}
                              </div>
                              <div className="gap-2 font-semibold text-gray-600">
                                <label className='text-xs md:text-sm'>Logout Time:</label>
                                {day.logout_time || "-"}
                              </div>
                              <div className="gap-2 font-semibold text-gray-600">
                                <label className='text-xs md:text-sm'>Total Time:</label>
                                {day.total_hours || "-"}
                              </div>

                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {messageItems.length > 0 ? (
                              <ul className="list-disc list-inside space-y-1 text-gray-700 text-xs">
                                {messageItems}
                              </ul>
                            ) : (
                              <span className="italic text-gray-400">
                                No messages
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <>
                        {!hasAnyMessage && (
                          <p className="text-center text-gray-400 italic mb-3">
                            No work logs submitted for this month
                          </p>
                        )}

                        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                          <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-gradient-to-r from-green-100 to-green-50 text-gray-700">
                                  <th className="px-6 py-3 font-semibold text-center md:sticky left-0 z-10">
                                    Date
                                  </th>
                                  <th className="px-6 py-3 font-semibold">
                                    Message
                                  </th>
                                </tr>
                              </thead>
                              <tbody>{tableRows}</tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    );
                  })()


                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MonthlyWorkReport_Detail
