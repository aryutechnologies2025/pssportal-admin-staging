import React, { useState } from 'react'
import Loader from '../Loader';
import Mobile_Sidebar from '../Mobile_Sidebar';
import { ToastContainer } from 'react-toastify';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useDateUtils } from '../../utils/useDateUtils';
import { Capitalise } from '../../hooks/useCapitalise';
import exportToPDF from '../../utils/exportToPDF';
import exportToCSV from '../../utils/exportToCSV';

const Employee_Performance_Details = () => {
    const navigate = useNavigate();

      const formatDateTime = useDateUtils();

    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupData, setPopupData] = useState([]);
    const [popupType, setPopupType] = useState(""); // 'joining', 'relieving', 'working', 'present', 'absent', 'submitted', 'not_submitted'

    const today = new Date().toISOString().split("T")[0];
    const [filters, setFilters] = useState({
        from_date: today,
        to_date: today,
        employee_id: "",
    });
    const [employees, setEmployees] = useState([]);
    const [dashboardData, setDashboardData] = useState([]);
    const [allWorkReports, setAllWorkReports] = useState([]);
    const [workReports, setWorkReports] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [globalFilter, setGlobalFilter] = useState("");

    const selectedEmployee = employees.find(emp => emp.id === Number(filters.employee_id));

    // Sample data for demonstration - replace with actual API data
    const [employeePerformanceData, setEmployeePerformanceData] = useState({
        company: {
            name: "Tech Solutions Inc.",
            total_employees: 10,
            joining_today: 5,
            relieving_today: 2,
            working_today: 3,
            joining_list: [
                { id: 1, name: "John Doe", department: "IT", designation: "Developer", joining_date: "2026-03-03" },
                { id: 2, name: "Jane Smith", department: "HR", designation: "Manager", joining_date: "2026-03-03" },
            ],
            relieving_list: [
                { id: 3, name: "Bob Johnson", department: "Sales", designation: "Executive", relieving_date: "2026-03-03" },
            ],
            working_list: [
                { id: 1, name: "John Doe", department: "IT", status: "Working" },
                { id: 2, name: "Jane Smith", department: "HR", status: "Working" },
                // ... more employees
            ]
        },
        attendance: {
            summary: [
                {
                    date: today,
                    present: 7,
                    absent: 3,
                    present_list: [
                        { id: 1, name: "John Doe", department: "IT", check_in: "09:00 AM", check_out: "06:00 PM" },
                        { id: 2, name: "Jane Smith", department: "HR", check_in: "09:15 AM", check_out: "06:30 PM" },
                    ],
                    absent_list: [
                        { id: 3, name: "Bob Johnson", department: "Sales", reason: "Sick Leave" },
                        { id: 4, name: "Alice Brown", department: "Marketing", reason: "Personal" },
                    ]
                }
            ]
        },
        workReport: {
            submitted: 5,
            not_submitted: 2,
            submitted_list: [
                { id: 1, name: "John Doe", department: "IT", submitted_time: "10:30 AM", tasks_completed: 5 },
                { id: 2, name: "Jane Smith", department: "HR", submitted_time: "11:15 AM", tasks_completed: 3 },
            ],
            not_submitted_list: [
                { id: 3, name: "Bob Johnson", department: "Sales", pending_since: "2 days" },
                { id: 4, name: "Alice Brown", department: "Marketing", pending_since: "1 day" },
            ]
        }
    });

    const applyFilters = () => {
        let filtered = [...allWorkReports];

        if (filters.from_date) {
            filtered = filtered.filter(item =>
                new Date(item.report_date) >= new Date(filters.from_date)
            );
        }

        if (filters.to_date) {
            filtered = filtered.filter(item =>
                new Date(item.report_date) <= new Date(filters.to_date)
            );
        }

        if (filters.employee_id) {
            filtered = filtered.filter(
                item => item.employee?.id === Number(filters.employee_id)
            );
        }

        setWorkReports(filtered);
        setTotalRecords(filtered.length);
    };

    const openPopup = (title, data, type) => {
        setPopupTitle(title);
        setPopupData(data);
        setPopupType(type);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle("");
        setPopupData([]);
        setPopupType("");
    };



    const workReport = dashboardData?.workreports?.[0] || {};

    return (
        <div className="flex flex-col justify-between bg-gray-50 px-3 md:px-5 pt-2 md:pt-10 w-full min-h-screen overflow-x-auto">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        <div>
                            <Mobile_Sidebar />
                        </div>

                        <div className="flex justify-start gap-2 mt-2 md:mt-0 items-center">
                            <ToastContainer position="top-right" autoClose={3000} />
                            <p className="text-sm md:text-md text-gray-500 cursor-pointer" onClick={() => navigate("/dashboard")}>
                                Dashboard
                            </p>
                            <p>{">"}</p>
                            <p className="text-sm md:text-md text-[#1ea600]">Employee Performance Report</p>
                        </div>

                        {/* Filter Section */}
                        <div className="hidden md:flex justify-between w-full mt-2 md:mt-5 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-4 py-4">
                            <div className="flex flex-wrap items-end gap-4">
                                {/* Start Date */}
                                <div className="flex flex-col gap-1 w-[50%] md:w-[20%]">
                                    <label className="text-sm font-medium text-[#6B7280]">Start Date</label>
                                    <input
                                        type="date"
                                        className="border h-10 px-3 rounded-md"
                                        value={filters.from_date}
                                        onChange={(e) =>
                                            setFilters(prev => ({ ...prev, from_date: e.target.value }))
                                        }
                                    />
                                </div>

                                {/* End Date */}
                                <div className="flex flex-col gap-1 w-[50%] md:w-[20%]">
                                    <label className="text-sm font-medium text-[#6B7280]">End Date</label>
                                    <input
                                        type="date"
                                        className="border h-10 px-3 rounded-md"
                                        value={filters.to_date}
                                        onChange={(e) =>
                                            setFilters(prev => ({ ...prev, to_date: e.target.value }))
                                        }
                                    />
                                </div>

                                {/* Employee Dropdown */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-[#6B7280]">Employee</label>
                                    <Dropdown
                                        value={filters.employee_id}
                                        options={employees}
                                        optionLabel="full_name"
                                        optionValue="id"
                                        placeholder="Select Employee"
                                        className="h-10 w-48 border"
                                        filter
                                        onChange={(e) =>
                                            setFilters(prev => ({
                                                ...prev,
                                                employee_id: e.value
                                            }))
                                        }
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 mt-6 md:mt-0">
                                    <button
                                        onClick={applyFilters}
                                        className="h-10 w-20 rounded-lg bg-[#1ea600] hover:bg-[#23880c] text-white"
                                    >
                                        Apply
                                    </button>

                                    <button
                                        onClick={() => {
                                            setFilters({
                                                from_date: today,
                                                to_date: today,
                                                employee_id: ""
                                            });
                                            setWorkReports(allWorkReports);
                                            setTotalRecords(allWorkReports.length);
                                            setGlobalFilter("");
                                        }}
                                        className="h-10 w-20 border rounded-lg hover:bg-[#c7c7c7] text-black"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Employee Performance Dashboard Cards */}
                        <div className="mt-6 space-y-6">
                            {/* Company Section */}

                            {/* {filters.employee_id && selectedEmployee && (
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
            Showing data for: <span className="font-semibold">{selectedEmployee.full_name}</span>
        </p>
    </div>
)} */}

                            <div className="bg-white rounded-2xl shadow-sm border p-4">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                                    {employeePerformanceData.company.name}
                                </h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Total Employees */}
                                    <div className="p-4 rounded-2xl border bg-purple-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Total Employees", 
                                            [{ label: "Total Employees", value: employeePerformanceData.company.total_employees }], 
                                            "total")}>
                                        <p className="text-sm text-gray-600">Total Count For Refered</p>
                                        <h3 className="text-2xl font-bold text-purple-700 mt-3">
                                            {employeePerformanceData.company.total_employees}
                                        </h3>
                                    </div>

                                    {/* Joining */}
                                    <div className="p-4 rounded-2xl border bg-green-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Employees Joining Today", 
                                            employeePerformanceData.company.joining_list, 
                                            "joining")}>
                                        <p className="text-sm text-gray-600">Joined </p>
                                        <h3 className="text-2xl font-bold text-green-700 mt-3">
                                            {employeePerformanceData.company.joining_today}
                                        </h3>
                                    </div>

                                    {/* Relieving  */}
                                    <div className="p-4 rounded-2xl border bg-red-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Employees Relieving Today", 
                                            employeePerformanceData.company.relieving_list, 
                                            "relieving")}>
                                        <p className="text-sm text-gray-600">Relived </p>
                                        <h3 className="text-2xl font-bold text-red-700 mt-3">
                                            {employeePerformanceData.company.relieving_today}
                                        </h3>
                                    </div>

                                    {/* Working Today */}
                                    <div className="p-4 rounded-2xl border bg-blue-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Currently Working Employees", 
                                            employeePerformanceData.company.working_list, 
                                            "working")}>
                                        <p className="text-sm text-gray-600">Selected </p>
                                        <h3 className="text-2xl font-bold text-blue-700 mt-3">
                                            {employeePerformanceData.company.working_today}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Summary Section */}
                            <div className="bg-white rounded-2xl shadow-sm border p-4">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                                    {/* Attendance Summary - {formatDateTime(today)} */}
                                    Attendance Summary
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Present Employees */}
                                    <div className="p-4 rounded-2xl border bg-green-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Present Employees", 
                                            employeePerformanceData.attendance.summary[0].present_list, 
                                            "present")}>
                                        <p className="text-sm text-gray-600">Present</p>
                                        <h3 className="text-2xl font-bold text-green-700 mt-3">
                                            {employeePerformanceData.attendance.summary[0].present}
                                        </h3>
                                        
                                    </div>

                                    {/* Absent Employees */}
                                    <div className="p-4 rounded-2xl border bg-red-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Absent Employees", 
                                            employeePerformanceData.attendance.summary[0].absent_list, 
                                            "absent")}>
                                        <p className="text-sm text-gray-600">Absent</p>
                                        <h3 className="text-2xl font-bold text-red-700 mt-3">
                                            {employeePerformanceData.attendance.summary[0].absent}
                                        </h3>
                                        
                                    </div>
                                </div>
                            </div>

                            {/* Work Report Summary Section */}
                            <div className="bg-white rounded-2xl shadow-sm border p-4">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                                    {/* Work Report Summary - {formatDateTime(today)} */}
                                    Work Report Summary
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Submitted */}
                                    <div className="p-4 rounded-2xl border bg-blue-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Employees Who Submitted Work Report", 
                                            employeePerformanceData.workReport.submitted_list, 
                                            "submitted")}>
                                        <p className="text-sm text-gray-600">Submitted</p>
                                        <h3 className="text-2xl font-bold text-blue-700 mt-3">
                                            {employeePerformanceData.workReport.submitted}
                                        </h3>
                                        
                                    </div>

                                    {/* Not Submitted */}
                                    <div className="p-4 rounded-2xl border bg-yellow-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Employees Who Haven't Submitted Work Report", 
                                            employeePerformanceData.workReport.not_submitted_list, 
                                            "not_submitted")}>
                                        <p className="text-sm text-gray-600">Not Submitted</p>
                                        <h3 className="text-2xl font-bold text-yellow-700 mt-3">
                                            {employeePerformanceData.workReport.not_submitted}
                                        </h3>
                                        
                                    </div>
                                </div>
                            </div>

                                {/* company attendance marked Summary Section */}
                            <div className="bg-white rounded-2xl shadow-sm border p-4">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                                    {/* Work Report Summary - {formatDateTime(today)} */}
                                    Company Attendance Summary
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Submitted */}
                                    <div className="p-4 rounded-2xl border bg-blue-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Employees Who Marked Attendance", 
                                            employeePerformanceData.workReport.marked_list, 
                                            "marked")}>
                                        <p className="text-sm text-gray-600">Marked</p>
                                        <h3 className="text-2xl font-bold text-blue-700 mt-3">
                                            {employeePerformanceData.workReport.marked}
                                        </h3>
                                        
                                    </div>

                                    {/* Not Submitted */}
                                    <div className="p-4 rounded-2xl border bg-yellow-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Employees Who Haven't Marked Attendance", 
                                            employeePerformanceData.workReport.not_marked_list, 
                                            "not_marked")}>
                                        <p className="text-sm text-gray-600">Not Marked</p>
                                        <h3 className="text-2xl font-bold text-yellow-700 mt-3">
                                            {employeePerformanceData.workReport.not_marked}
                                        </h3>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Popup Modal */}
                    {showPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-hidden">
                                <div className="flex items-center justify-between bg-green-700 px-4 sm:px-5 py-3 sm:py-4">
                                    <h3 className="text-white text-base sm:text-lg font-bold">
                    {popupTitle} 
                    {selectedEmployee && filters.employee_id && (
                        <span className="text-[#1ea600] ml-2">
                            - {selectedEmployee.full_name}
                        </span>
                    )}
                </h3>

                   <div className="flex items-center gap-3">
                      {/* Excel Button */}
                      <button
                        onClick={() =>
                          exportToCSV(
                            employeeList.map((emp, index) => ({
                              "S.No": index + 1,
                              "Full Name": Capitalise(emp.employee_name),
                            })),
                            popupTitle.replaceAll(" ", "_"),
                          )
                        }
                        className="px-3 py-1 rounded bg-white text-green-600 text-sm font-semibold hover:bg-gray-100 transition"
                      >
                        Excel
                      </button>

                      {/* PDF Button */}
                      <button
                        onClick={() =>
                          exportToPDF(
                            employeeList.map((emp, index) => ({
                              "S.No": index + 1,
                              "Full Name": Capitalise(emp.employee_name),
                            })),
                            popupTitle.replaceAll(" ", "_"),
                            popupTitle,
                          )
                        }
                        className="px-3 py-1 rounded bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition"
                      >
                        PDF
                      </button>

                      <button
                                        onClick={closePopup}
                                        className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                      >
                        ✕
                                    </button>
                    </div>
                                    
                                </div>
                                
                                {/* body */}
                                <div className="p-4 overflow-y-auto max-h-[60vh]">
                                    {popupData.length > 0 ? (
                                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                                        <table className="w-full text-sm">
                                            <thead >
                                                <tr className="bg-green-50 text-green-900">
                                                    <th className="px-4 py-3 text-center w-[70px]">S.No</th>
                                                    {/* <th className="p-3 text-left text-sm font-medium text-gray-600">Name</th> */}
                                                    {popupType === "present" && (
                                                        <>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                                                            
                                                        </>
                                                    )}
                                                    {popupType === "absent" && (
                                                        <>
                                                           <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                                                        </>
                                                    )}
                                                    {popupType === "joined" && (
                                                        <>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Name</th>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Joining Date</th>
                                                        </>
                                                    )}
                                                    {popupType === "relieved" && (
                                                        <>
                                                          <th className="p-3 text-left text-sm font-medium text-gray-600">Name</th>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Relieving Date</th>
                                                        </>
                                                    )}
                                                    {popupType === "selected" && (
                                                        <>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Name</th>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Selected Date</th>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Status</th>
                                                        </>
                                                    )}
                                                    {popupType === "submitted" && (
                                                        <>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                                                        </>
                                                    )}
                                                    {popupType === "not_submitted" && (
                                                        <>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                                                        </>
                                                    )}
                                                    {popupType === "marked" && (
                                                        <>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                                                        </>
                                                    )}
                                                    {popupType === "not_marked" && (
                                                        <>
                                                            <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {popupData.map((item, index) => (
                                                    <tr key={item.id || index} className="border-b hover:bg-gray-50">
                                                        <td className="p-3 text-sm text-gray-800">{index + 1}</td>
                                                        <td className="p-3 text-sm text-gray-800">{item.name}</td>
                                                        
                                                        {popupType === "present" && (
                                                            <>
                                                                <td className="p-3 text-sm text-gray-600">{item.date}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.check_in} - {item.check_out}</td>
                                                            </>
                                                        )}
                                                        {popupType === "absent" && (
                                                            <>
                                                                <td className="p-3 text-sm text-gray-600">{item.date}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.reason}</td>
                                                            </>
                                                        )}
                                                        {popupType === "joined" && (
                                                            <>
                                                                <td className="p-3 text-sm text-gray-600">{item.name}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.joining_date}</td>
                                                            </>
                                                        )}
                                                        {popupType === "relieved" && (
                                                            <>
                                                                <td className="p-3 text-sm text-gray-600">{item.name}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.reason}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.relieving_date}</td>
                                                            </>
                                                        )}
                                                        {popupType === "selected" && (
                                                            <>
                                                                <td className="p-3 text-sm text-gray-600">{item.selected_date}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.name}</td>
                                                                <td className="p-3 text-sm text-gray-600">
                                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                                        {item.status}
                                                                    </span>
                                                                </td>
                                                            </>
                                                        )}
                                                        {popupType === "submitted" && (
                                                            <>
                                                                <td className="p-3 text-sm text-gray-600">{item.date}</td>
                                                                
                                                            </>
                                                        )}
                                                        {popupType === "not_submitted" && (
                                                            <>
                                                                <td className="p-3 text-sm text-gray-600">{item.date}</td>
                                                                
                                                            </>
                                                        )}
                                                        {popupType === "marked" && (
                                                            <>
                                                                <td className="p-3 text-sm text-gray-600">{item.company}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.name}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.date}</td>
                                                                
                                                            </>
                                                        )}
                                                        {popupType === "not_marked" && (
                                                            <>
                                                                    <td className="p-3 text-sm text-gray-600">{item.company}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.name}</td>
                                                                <td className="p-3 text-sm text-gray-600">{item.date}</td>
                                                                
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">No data available</p>
                                    )}
                                </div>
                                
                                <div className="flex justify-end p-4 border-t">
                                    <button
                                        onClick={closePopup}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <Footer />
        </div>
    );
};

export default Employee_Performance_Details;