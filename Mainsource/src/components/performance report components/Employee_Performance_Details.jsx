import React, { useState } from 'react'
import Loader from '../Loader';
import Mobile_Sidebar from '../Mobile_Sidebar';
import { ToastContainer } from 'react-toastify';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useDateUtils } from '../../Utils/useDateUtils';
import exportToPDF from '../../Utils/exportToPDF';
import exportToCSV from '../../Utils/exportToCSV';
import { formatToDDMMYYYY } from '../../Utils/dateformat';

const Employee_Performance_Details = () => {
    const navigate = useNavigate();
    const formatDateTime = useDateUtils();
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupData, setPopupData] = useState([]);
    const [popupType, setPopupType] = useState(""); // 'referred', 'joined', 'relieved', 'selected', 'present', 'absent', 'submitted', 'not_submitted', 'marked', 'not_marked'

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
                { id: 1, name: "John Doe", company: "Tech Solutions Inc.", joining_date: "2026-03-03" },
                { id: 2, name: "Jane Smith", company: "Tech Solutions Inc.", joining_date: "2026-03-03" },
            ],
            relieving_list: [
                { id: 3, name: "Bob Johnson", company: "Tech Solutions Inc.", relieving_date: "2026-03-03" },
            ],
            working_list: [
                { id: 1, name: "John Doe", company: "Tech Solutions Inc.", status: "Working" },
                { id: 2, name: "Jane Smith", company: "Tech Solutions Inc.", status: "Working" },
            ]
        },
        referred_count: [
            { company_name: "Tech Solutions Inc.", count: 5 },
            { company_name: "ABC Corp", count: 3 },
            { company_name: "XYZ Ltd", count: 2 },
        ],
        attendance: {
            summary: [
                {
                    date: today,
                    present: 7,
                    absent: 3,
                    present_list: [
                        { id: 1, name: "John Doe", date: today, check_in: "09:00 AM", check_out: "06:00 PM" },
                        { id: 2, name: "Jane Smith", date: today, check_in: "09:15 AM", check_out: "06:30 PM" },
                    ],
                    absent_list: [
                        { id: 3, name: "Bob Johnson", date: today, reason: "Sick Leave" },
                        { id: 4, name: "Alice Brown", date: today, reason: "Personal" },
                    ]
                }
            ]
        },
        workReport: {
            submitted: 5,
            not_submitted: 2,
            submitted_list: [
                { id: 1, name: "John Doe", date: today },
                { id: 2, name: "Jane Smith", date: today },
            ],
            not_submitted_list: [
                { id: 3, name: "Bob Johnson", date: today },
                { id: 4, name: "Alice Brown", date: today },
            ]
        },
        markedReport: {
            marked: 5,
            not_marked: 2,
            marked_list: [
                { id: 1, name: "John Doe", company: "Tech Solutions Inc.", date: today },
                { id: 2, name: "Jane Smith", company: "Tech Solutions Inc.", date: today },
            ],
            not_marked_list: [
                { id: 3, name: "Bob Johnson", company: "Tech Solutions Inc.", date: today },
                { id: 4, name: "Alice Brown", company: "ABC Corp", date: today },
            ]
        }
    });

    const applyFilters = () => {
        // Your filter logic
    };

    const openPopup = (title, data, type) => {
        const employeeName = selectedEmployee ? ` - ${selectedEmployee.full_name}` : "";
        setPopupTitle(title + employeeName);
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

    const getExportData = () => {
        return popupData.map((item, index) => {
            const base = {
                "S.No": index + 1,
            };

            switch (popupType) {
                case "referred":
                    return {
                        ...base,
                        "Company": item.company_name || "-",
                        "Count": item.count || "-"
                    };

                case "joined":
                    return {
                        ...base,
                        "Company": item.company || "-",
                        "Employee Name": item.name || "-",
                        "Joining Date": item.joining_date || "-"
                    };

                case "relieved":
                    return {
                        ...base,
                        "Company": item.company || "-",
                        "Employee Name": item.name || "-",
                        "Relieving Date": item.relieving_date || "-"
                    };

                case "selected":
                    return {
                        ...base,
                        "Company": item.company || "-",
                        "Employee Name": item.name || "-",
                        "Status": item.status || "-"
                    };

                case "present":
                    return {
                        ...base,
                        "Date": item.date || "-",
                        // "Employee Name": item.name || "-",
                        "Check In": item.check_in || "-",
                        "Check Out": item.check_out || "-"
                    };

                case "absent":
                    return {
                        ...base,
                        "Date": item.date || "-",
                        // "Employee Name": item.name || "-",
                        // "Reason": item.reason || "-"
                    };

                case "submitted":
                case "not_submitted":
                    return {
                        ...base,
                        "Date": item.date || "-",
                        // "Employee Name": item.name || "-"
                    };

                case "marked":
                case "not_marked":
                    return {
                        ...base,
                        "Company": item.company || "-",
                        "Employee Name": item.name || "-",
                        "Date": item.date || "-"
                    };

                default:
                    return {
                        ...base,
                        "Name": item.name || "-"
                    };
            }
        });
    };

    return (
        <div className="flex flex-col justify-between bg-gray-50 px-3 md:px-5 pt-2 md:pt-10 w-full min-h-screen overflow-x-auto">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        <Mobile_Sidebar />

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
                            <div className="bg-white rounded-2xl shadow-sm border p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Total Referred Count */}
                                    <div className="p-4 rounded-2xl border bg-purple-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Referred Count", 
                                            employeePerformanceData.referred_count, 
                                            "referred")}>
                                        <p className="text-sm text-gray-600">Total Count For Referred</p>
                                        <h3 className="text-2xl font-bold text-purple-700 mt-3">
                                            {employeePerformanceData.referred_count.reduce((sum, item) => sum + item.count, 0)}
                                        </h3>
                                    </div>

                                    {/* Joined */}
                                    <div className="p-4 rounded-2xl border bg-green-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Joined Contract Employees", 
                                            employeePerformanceData.company.joining_list, 
                                            "joined")}>
                                        <p className="text-sm text-gray-600">Joined</p>
                                        <h3 className="text-2xl font-bold text-green-700 mt-3">
                                            {employeePerformanceData.company.joining_today}
                                        </h3>
                                    </div>

                                    {/* Relieved */}
                                    <div className="p-4 rounded-2xl border bg-red-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Relieved Contract Employees", 
                                            employeePerformanceData.company.relieving_list, 
                                            "relieved")}>
                                        <p className="text-sm text-gray-600">Relieved</p>
                                        <h3 className="text-2xl font-bold text-red-700 mt-3">
                                            {employeePerformanceData.company.relieving_today}
                                        </h3>
                                    </div>

                                    {/* Selected */}
                                    <div className="p-4 rounded-2xl border bg-blue-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Selected Employees", 
                                            employeePerformanceData.company.working_list, 
                                            "selected")}>
                                        <p className="text-sm text-gray-600">Selected</p>
                                        <h3 className="text-2xl font-bold text-blue-700 mt-3">
                                            {employeePerformanceData.company.working_today}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div>
                                {/* Attendance Summary Section */}
                                <div className="bg-white rounded-2xl shadow-sm border p-4">
                                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Attendance Summary</h2>
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

                                        {/* Submitted */}
                                        <div className="p-4 rounded-2xl border bg-blue-50 hover:shadow-md transition cursor-pointer"
                                             onClick={() => openPopup("Submitted Employees", 
                                                employeePerformanceData.workReport.submitted_list, 
                                                "submitted")}>
                                            <p className="text-sm text-gray-600">Submitted</p>
                                            <h3 className="text-2xl font-bold text-blue-700 mt-3">
                                                {employeePerformanceData.workReport.submitted}
                                            </h3>
                                        </div>

                                        {/* Not Submitted */}
                                        <div className="p-4 rounded-2xl border bg-yellow-50 hover:shadow-md transition cursor-pointer"
                                             onClick={() => openPopup("Not Submitted Employees", 
                                                employeePerformanceData.workReport.not_submitted_list, 
                                                "not_submitted")}>
                                            <p className="text-sm text-gray-600">Not Submitted</p>
                                            <h3 className="text-2xl font-bold text-yellow-700 mt-3">
                                                {employeePerformanceData.workReport.not_submitted}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Company Attendance Marked Summary Section */}
                            <div className="bg-white rounded-2xl shadow-sm border p-4">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Company Attendance Summary</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Marked */}
                                    <div className="p-4 rounded-2xl border bg-blue-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Marked Employees", 
                                            employeePerformanceData.markedReport.marked_list, 
                                            "marked")}>
                                        <p className="text-sm text-gray-600">Marked</p>
                                        <h3 className="text-2xl font-bold text-blue-700 mt-3">
                                            {employeePerformanceData.markedReport.marked}
                                        </h3>
                                    </div>

                                    {/* Not Marked */}
                                    <div className="p-4 rounded-2xl border bg-yellow-50 hover:shadow-md transition cursor-pointer"
                                         onClick={() => openPopup("Not Marked Employees", 
                                            employeePerformanceData.markedReport.not_marked_list, 
                                            "not_marked")}>
                                        <p className="text-sm text-gray-600">Not Marked</p>
                                        <h3 className="text-2xl font-bold text-yellow-700 mt-3">
                                            {employeePerformanceData.markedReport.not_marked}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Popup Modal */}
                    {showPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between bg-green-700 px-6 py-4">
                                    <h3 className="text-white text-lg font-bold">
                                        {popupTitle}
                                        {selectedEmployee && filters.employee_id && (
                        <span className="text-[#1ea600] ml-2">
                            - {selectedEmployee.full_name}
                        </span>
                    ) } 

                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {/* Excel Button */}
                                        <button
                                            onClick={() => exportToCSV(getExportData(), popupTitle.replaceAll(" ", "_"))}
                                            className="px-4 py-2 rounded-lg bg-white text-green-600 text-sm font-semibold hover:bg-gray-100 transition"
                                        >
                                            Excel
                                        </button>

                                        {/* PDF Button */}
                                        <button
                                            onClick={() => exportToPDF(getExportData(), popupTitle.replaceAll(" ", "_"), popupTitle)}
                                            className="px-4 py-2 rounded-lg bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition"
                                        >
                                            PDF
                                        </button>

                                        {/* Close Button */}
                                        <button
                                            onClick={closePopup}
                                            className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition text-xl"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                    {Array.isArray(popupData) && popupData.length > 0 ? (
                                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-green-50 text-green-900">
                                                        <th className="px-4 py-3 text-center w-[70px]">S.No</th>
                                                        
                                                        {popupType === "referred" && (
                                                            <>
                                                                <th className="px-4 py-3 text-center">Company Name</th>
                                                                <th className="px-4 py-3 text-center">Count</th>
                                                            </>
                                                        )}
                                                        
                                                        {popupType === "joined" && (
                                                            <>
                                                                <th className="px-4 py-3 text-center">Employee Name</th>
                                                                <th className="px-4 py-3 text-center">Company Name</th>
                                                                <th className="px-4 py-3 text-center">Joining Date</th>
                                                            </>
                                                        )}
                                                        
                                                        {popupType === "relieved" && (
                                                            <>
                                                                <th className="px-4 py-3 text-center">Employee Name</th>
                                                                <th className="px-4 py-3 text-center">Company Name</th>
                                                                <th className="px-4 py-3 text-center">Relieving Date</th>
                                                            </>
                                                        )}
                                                        
                                                        {popupType === "selected" && (
                                                            <>
                                                                <th className="px-4 py-3 text-center">Employee Name</th>
                                                                <th className="px-4 py-3 text-center">Company Name</th>
                                                                <th className="px-4 py-3 text-center">Status</th>
                                                            </>
                                                        )}
                                                        
                                                        {popupType === "present" && (
                                                            <>
                                                                {/* <th className="px-4 py-3 text-center">Employee Name</th> */}
                                                                <th className="px-4 py-3 text-center">Date</th>
                                                                <th className="px-4 py-3 text-center">Check In - Check Out</th>
                                                            </>
                                                        )}
                                                        
                                                        {popupType === "absent" && (
                                                            <>
                                                                {/* <th className="px-4 py-3 text-center">Employee Name</th> */}
                                                                <th className="px-4 py-3 text-center">Date</th>
                                                            </>
                                                        )}
                                                        
                                                        {popupType === "submitted" && (
                                                            <>
                                                                {/* <th className="px-4 py-3 text-center">Employee Name</th> */}
                                                                <th className="px-4 py-3 text-center">Date</th>
                                                            </>
                                                        )}
                                                        
                                                        {popupType === "not_submitted" && (
                                                            <>
                                                                {/* <th className="px-4 py-3 text-center">Employee Name</th> */}
                                                                <th className="px-4 py-3 text-center">Date</th>
                                                            </>
                                                        )}
                                                        
                                                        {popupType === "marked" && (
                                                            <>
                                                                <th className="px-4 py-3 text-center">Company Name</th>
                                                                <th className="px-4 py-3 text-center">Employee Name</th>
                                                                <th className="px-4 py-3 text-center">Date</th>
                                                            </>
                                                        )}
                                                        
                                                        {popupType === "not_marked" && (
                                                            <>
                                                                <th className="px-4 py-3 text-center">Company Name</th>
                                                                <th className="px-4 py-3 text-center">Employee Name</th>
                                                                <th className="px-4 py-3 text-center">Date</th>
                                                            </>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {popupData.map((item, index) => (
                                                        <tr key={item.id || index} className="border-t hover:bg-gray-50 transition">
                                                            <td className="px-4 py-3 font-semibold text-gray-800 text-center">{index + 1}</td>
                                                            
                                                            {popupType === "referred" && (
                                                                <>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.company_name || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.count || "-"}</td>
                                                                </>
                                                            )}
                                                            
                                                            {popupType === "joined" && (
                                                                <>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.name || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.company || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{formatToDDMMYYYY(item.joining_date || "-")}</td>
                                                                </>
                                                            )}
                                                            
                                                            {popupType === "relieved" && (
                                                                <>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.name || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.company || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{formatToDDMMYYYY(item.relieving_date || "-")}</td>
                                                                </>
                                                            )}
                                                            
                                                            {popupType === "selected" && (
                                                                <>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.name || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.company || "-"}</td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                                            {item.status || "Working"}
                                                                        </span>
                                                                    </td>
                                                                </>
                                                            )}
                                                            
                                                            {popupType === "present" && (
                                                                <>
                                                                    {/* <td className="px-4 py-3 text-center text-gray-800">{item.name || "-"}</td> */}
                                                                    <td className="px-4 py-3 text-center text-gray-800">{formatToDDMMYYYY(item.date || "-")}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.check_in} - {item.check_out}</td>
                                                                </>
                                                            )}
                                                            
                                                            {popupType === "absent" && (
                                                                <>
                                                                    {/* <td className="px-4 py-3 text-center text-gray-800">{item.name || "-"}</td> */}
                                                                    <td className="px-4 py-3 text-center text-gray-800">{formatToDDMMYYYY(item.date || "-")}</td>
                                                                </>
                                                            )}
                                                            
                                                            {popupType === "submitted" && (
                                                                <>
                                                                    {/* <td className="px-4 py-3 text-center text-gray-800">{item.name || "-"}</td> */}
                                                                    <td className="px-4 py-3 text-center text-gray-800">{formatToDDMMYYYY(item.date || "-")}</td>
                                                                </>
                                                            )}
                                                            
                                                            {popupType === "not_submitted" && (
                                                                <>
                                                                    {/* <td className="px-4 py-3 text-center text-gray-800">{item.name || "-"}</td> */}
                                                                    <td className="px-4 py-3 text-center text-gray-800">{formatToDDMMYYYY(item.date || "-")}</td>
                                                                </>
                                                            )}
                                                            
                                                            {popupType === "marked" && (
                                                                <>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.company || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.name || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{formatToDDMMYYYY(item.date || "-")}</td>
                                                                </>
                                                            )}
                                                            
                                                            {popupType === "not_marked" && (
                                                                <>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.company || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{item.name || "-"}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-800">{formatToDDMMYYYY(item.date || "-")}</td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">No data available</p>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
                                    <button
                                        onClick={closePopup}
                                        className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
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