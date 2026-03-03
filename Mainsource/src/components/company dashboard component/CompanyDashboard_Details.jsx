import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { API_URL } from '../../Config';
import Footer from '../Footer';
import Loader from '../Loader';
import Mobile_Sidebar from '../Mobile_Sidebar';
import exportToCSV from '../../Utils/exportToCSV';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Capitalise } from '../../hooks/useCapitalise';
import { capitalize } from '@mui/material';
import { useDateUtils } from '../../Utils/useDateUtils';
import CompanyAttendanceCard from '../ChartCard';

const CompanyDashboard_Details = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();
  const [loading, setLoading] = useState(false);

  // Absent Popup State
  const [openAbsentPopup, setOpenAbsentPopup] = useState(false);
  const [absentPopupTitle, setAbsentPopupTitle] = useState("");
  const [absentPopupData, setAbsentPopupData] = useState([]);

  // Continuous Absent Popup State
  const [openContinuousPopup, setOpenContinuousPopup] = useState(false);
  const [continuousPopupTitle, setContinuousPopupTitle] = useState("");
  const [continuousPopupData, setContinuousPopupData] = useState([]);

  const openAbsentEmployeePopup = (title, list) => {
    console.log("Popup opening", title, list);
    setAbsentPopupTitle(title);
    setAbsentPopupData(list || []);
    setOpenAbsentPopup(true);
  };

  const closeAbsentEmployeePopup = () => {
    setOpenAbsentPopup(false);
    setAbsentPopupTitle("");
    setAbsentPopupData([]);
  };

  const openContinuousEmployeePopup = (title, list) => {
    const continuousList = (list || []).filter(emp => emp.continuous_days > 0);
    setContinuousPopupTitle(title);
    setContinuousPopupData(continuousList);
    setOpenContinuousPopup(true);
  };

  const closeContinuousEmployeePopup = () => {
    setOpenContinuousPopup(false);
    setContinuousPopupTitle("");
    setContinuousPopupData([]);
  };

  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [dashboardData, setDashboardData] = useState(null); // Start with null


  const handleYesterdayFilter = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split("T")[0];
    setFromDate(formattedDate);
    fetchCompanyDashboard(formattedDate);
  };

  const handleFromDateChange = (e) => {
    const date = e.target.value;
    setFromDate(date);
    fetchCompanyDashboard(date);
  };

  useEffect(() => {
    fetchCompanyDashboard(today);
  }, []);

  const fetchCompanyDashboard = async (date) => {
    if (!date) return;

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `${API_URL}api/contract-dashboard`, {
          params: {
            start_date: date,
            end_date: date, 
          },
        }
      );

      console.log("API Response:", res.data.data); 

      if (res.data.success) {
       
        setDashboardData(res.data.data || []);
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const getAbsentColor = (type) => {
  switch (type) {
    case "red":
      return "bg-red-100 text-red-700";

    case "orange":
      return "bg-orange-100 text-orange-700";

    case "yellow":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

  return (
    <div className="w-screen min-h-screen flex flex-col justify-between bg-gray-100 md:px-5 px-3 py-2 md:pt-5">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div>
              <Mobile_Sidebar />
              <div className="flex gap-2 justify-end items-center cursor-pointer">
                <p
                  className="text-sm md:text-md text-gray-500 cursor-pointer"
                  onClick={() => navigate("/company-dashboard")}
                >
                  Dashboard
                </p>
                <p>{">"}</p>
                <p className="text-sm md:text-md text-[#1ea600]">Company</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <p className="hidden md:block font-semibold">Dashboard</p>
              <div className="flex flex-col sm:flex-row gap-4 items-end p-3 rounded-lg w-full md:w-auto">
                <button
                  onClick={handleYesterdayFilter}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
                >
                  Yesterday
                </button>

                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="border p-2 rounded-lg w-full sm:w-[180px]"
                    value={fromDate}
                    onChange={handleFromDateChange}
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setFromDate(today);
                      fetchCompanyDashboard(today);
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Company Attendance Summary Cards */}
            <div className="bg-white rounded-xl shadow-md p-4 mt-4">
              {/* Heading */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800">
                  Company Attendance Summary
                </h2>
                <span className="bg-gray-100 text-xs px-3 py-1 rounded-full">
                  {dashboardData?.company_wise_summary?.length || 0}
                </span>
              </div>

              {/* Cards Grid */}
              {dashboardData?.company_wise_summary && dashboardData.company_wise_summary.length > 0 ? (
                // <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[500px] overflow-auto pr-1 pb-2">
                //   {dashboardData.company_wise_summary.map((company, index) => (
                //     <div
                //       key={index}
                //       className="rounded-lg border bg-green-50 hover:shadow-md transition-all duration-200 p-3"
                //     >
                //       {/* Company Name */}
                //       <p 
                //         className="text-xs font-semibold text-green-700 truncate border-b pb-1 mb-2"
                //         title={company.company_name}
                //       >
                //         {company.company_name}
                //       </p>

                //       <div className='flex justify-between items-center'>
                        
                //         {/* Present / Total */}
                //         <div className="flex justify-between items-center text-xs">
                //           {/* <span className="text-gray-500">Present/Total</span> */}
                //           <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                //             {company.present_employees || 0}/{company.total_employees || 0}
                //           </span>
                //         </div>

                //         {/* Absent - Clickable */}
                //         <div 
                //           className="flex justify-between items-center text-xs cursor-pointer hover:bg-red-50 p-1 rounded transition"
                //           onClick={() => 
                //             openAbsentEmployeePopup(
                //               `${company.company_name} - Absent Employees`,
                //               company.absentees || []
                //             )
                //           }
                //           title="Click to view absent employees"
                //         >
                //           {/* <span className="text-gray-500">Absent</span> */}
                //           <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                //             {company.absent_employees || 0}
                //           </span>
                //         </div>

                //         {/* Continuous Absentees - Clickable */}
                //         <div 
                //           className="flex justify-between items-center text-xs cursor-pointer hover:bg-orange-50 p-1 rounded transition"
                //           onClick={() => 
                //             openContinuousEmployeePopup(
                //               `${company.company_name} - Continuous Absentees`,
                //               company.absentees || []
                //             )
                //           }
                //           title="Click to view employees with continuous absence"
                //         >
                //           {/* <span className="text-gray-500">Continuous</span> */}
                //           <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                //             {getContinuousAbsentees(company.absentees).length}
                //           </span>
                //         </div>
                //       </div>
                      
                //     </div>
                //   ))}
                // </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-auto">
  {dashboardData.company_wise_summary.map((company, index) => (
    <CompanyAttendanceCard
      key={index}
      company={company}
      openAbsentEmployeePopup={openAbsentEmployeePopup}
      openContinuousEmployeePopup={openContinuousEmployeePopup}
    />
  ))}


</div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-500">
                    No company attendance data found.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Absent Employees Popup */}
          {openAbsentPopup && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4"
              onClick={closeAbsentEmployeePopup}
            >
              <div
                className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between bg-green-700 px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-white text-base sm:text-lg font-bold">
                    {absentPopupTitle}
                  </h2>
                  <div className="flex items-center gap-3">
                    {/* Excel Button */}
                    <button
                      onClick={() => {
                        const formattedData = absentPopupData.map((emp, index) => ({
                          "S.No": index + 1,
                          "Employee Name": capitalize(emp?.employee_name || "-"),
                          "Employee ID": emp?.employee_id || "-",
                          "Absent Dates": emp?.absent_dates?.join(", ") || "-",
                          "Continuous Days": emp?.continuous_days || "N/A"
                        }));
                        exportToCSV(formattedData, "Absent_Employees");
                      }}
                      className="px-3 py-1 rounded bg-white text-green-700 text-sm font-semibold hover:bg-gray-100 transition"
                    >
                      Excel
                    </button>

                    {/* PDF Button */}
                    <button
                      onClick={() => {
                        if (!absentPopupData || absentPopupData.length === 0) return;
                        const doc = new jsPDF();
                        doc.text(absentPopupTitle, 14, 15);
                        const tableColumn = [
                          "S.No",
                          "Employee Name",
                          "Employee ID",
                          "Absent Dates",
                          "Continuous Days"
                        ];
                        const tableRows = absentPopupData.map((emp, index) => ([
                          index + 1,
                         capitalize( emp?.employee_name || "-"),
                          emp?.employee_id || "-",
                          emp?.absent_dates?.join(", ") || "-",
                          emp?.continuous_days || "N/A"
                        ]));
                        autoTable(doc, {
                          head: [tableColumn],
                          body: tableRows,
                          startY: 20,
                        });
                        doc.save("Absent_Employees.pdf");
                      }}
                      className="px-3 py-1 rounded bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition"
                    >
                      PDF
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={closeAbsentEmployeePopup}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-3 sm:p-5 max-h-[70vh] overflow-y-auto">
                  {absentPopupData?.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-green-50 text-green-900">
                            <th className="px-4 py-3 text-center w-[70px]">S.No</th>
                            <th className="px-4 py-3 text-center">Employee ID</th>
                            <th className="px-4 py-3 text-center">Employee Name</th>
                            <th className="px-4 py-3 text-center">Absent Dates</th>
                            <th className="px-4 py-3 text-center">Continuous Days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {absentPopupData.map((emp, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-center">{index + 1}</td>
                              <td className="px-4 py-3 text-center font-semibold text-gray-800">
                                {emp?.employee_id || "-"}
                              </td>
                              <td className="px-4 py-3 text-center text-gray-800">
                                {Capitalise(emp?.employee_name) || "-"}
                              </td>
                              <td className="px-4 py-3 text-center text-gray-700">
                                {emp?.absent_dates?.join(", ") || "-"}
                              </td>
                              <td className="px-4 py-3 text-center text-gray-700">
                                {emp?.continuous_days || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 font-medium">No Absent Employees</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t bg-white px-4 sm:px-6 py-3 sm:py-4">
                  <button
                    onClick={closeAbsentEmployeePopup}
                    className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Continuous Absentees Popup */}
          {openContinuousPopup && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4"
              onClick={closeContinuousEmployeePopup}
            >
              <div
                className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between bg-green-700 px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-white text-base sm:text-lg font-bold">
                    {continuousPopupTitle}
                  </h2>
                  <div className="flex items-center gap-3">
                    {/* Excel Button */}
                    <button
                      onClick={() => {
                        const formattedData = continuousPopupData.map((emp, index) => ({
                          "S.No": index + 1,
                          "Employee Name": Capitalise(emp?.employee_name || "-"),
                        //   "Employee ID": emp?.employee_id || "-",
                          "Continuous Days": emp?.continuous_days || "N/A",
                          "Absent Dates": formatDateTime(emp?.absent_dates?.join(", ") || "-")
                        }));
                        exportToCSV(formattedData, "Continuous_Absentees");
                      }}
                      className="px-3 py-1 rounded bg-white text-green-700 text-sm font-semibold hover:bg-gray-100 transition"
                    >
                      Excel
                    </button>

                    {/* PDF Button */}
                    <button
                      onClick={() => {
                        if (!continuousPopupData || continuousPopupData.length === 0) return;
                        const doc = new jsPDF();
                        doc.text(continuousPopupTitle, 14, 15);
                        const tableColumn = [
                          "S.No",
                          "Employee Name",
                          "Employee ID",
                          "Continuous Days",
                          "Absent Dates"
                        ];
                        const tableRows = continuousPopupData.map((emp, index) => ([
                          index + 1,
                         Capitalise( emp?.employee_name || "-"),
                          emp?.employee_id || "-",
                          emp?.continuous_days || "N/A",
                          formatDateTime(emp?.absent_dates?.join(", ") || "-")
                        ]));
                        autoTable(doc, {
                          head: [tableColumn],
                          body: tableRows,
                          startY: 20,
                                          didParseCell: function (data) {
                  if (data.section === "body") {
                    const rowIndex = data.row.index;
                    const rowType = absentPopupData[rowIndex]?.type;

                    if (rowType === "yellow") {
                      data.cell.styles.fillColor = [255, 255, 150]; // Light yellow
                    } else if (rowType === "red") {
                      data.cell.styles.fillColor = [255, 150, 150]; // Light red
                    } else if (rowType === "orange") {
                      data.cell.styles.fillColor = [255, 200, 120]; // Light orange
                    }
                  }
                }
                        });
                        doc.save("Continuous_Absentees.pdf");
                      }}
                      className="px-3 py-1 rounded bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition"
                    >
                      PDF
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={closeContinuousEmployeePopup}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-3 sm:p-5 max-h-[70vh] overflow-y-auto">
                  {continuousPopupData?.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-green-50 text-green-900">
                            <th className="px-4 py-3 text-center w-[70px]">S.No</th>
                            <th className="px-4 py-3 text-center">Employee ID</th>
                            <th className="px-4 py-3 text-center">Employee Name</th>
                            <th className="px-4 py-3 text-center">Continuous Days</th>
                            <th className="px-4 py-3 text-center">Absent Dates</th>
                          </tr>
                        </thead>
                        <tbody>
                          {continuousPopupData.map((emp, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-center">{index + 1}</td>
                              <td className="px-4 py-3 text-center font-semibold text-gray-800">
                                {emp?.employee_id || "-"}
                              </td>
                              <td className="px-4 py-3 text-center text-gray-800">
                                {Capitalise(emp?.employee_name || "-")}
                              </td>
                              <td className="px-4 py-3 text-center">
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold
      ${getAbsentColor(emp?.type)}
    `}
  >
    {emp?.continuous_days || 0}
  </span>
</td>
                              <td className="px-4 py-3 text-center text-gray-700">
                                {formatDateTime(emp?.absent_dates?.join(", ") || "-")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 font-medium">No Continuous Absentees</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t bg-white px-4 sm:px-6 py-3 sm:py-4">
                  <button
                    onClick={closeContinuousEmployeePopup}
                    className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </>
      )}
    </div>
  );
};

export default CompanyDashboard_Details
