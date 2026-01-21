import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Dropdown } from "primereact/dropdown";
import { FaFileExport } from "react-icons/fa6";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";
import { Capitalise } from "../../hooks/useCapitalise";
import { formatIndianDateTime12Hr, formatToDDMMYYYY, } from "../../Utils/dateformat";
import Footer from "../Footer";
import Loader from "../Loader";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { FiSearch } from "react-icons/fi";

function Reports_Details() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [globalFilter, setGlobalFilter] = useState("");
  const [monthlyReportList, setMonthlyReportList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasklist, setTasklist] = useState([]);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [selectedTask, setSelectedTask] = useState(false);
  const [data, setData] = useState([]);
  console.log("data", data)
  const [page, setPage] = useState(1);
  const limit = 10;
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [summary, setSummary] = useState({
    total_working_days: 0,
    present_days: 0,
    absent_days: 0,
  });

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });

  // search submit

  const handleSubmit = () => {
    fetchAttendanceReport();
  };


  // search reset
  // const handleReset = () => {
  //   setSelectedMonth(new Date());
  //   setSelectedEmployeeDetails(null);

  //   setFilters({
  //     global: { value: null, matchMode: "contains" },
  //   });

  //   fetchAttendanceReport();
  // };

  const handleReset = () => {
    setSelectedMonth(new Date());
    setSelectedEmployeeDetails(null);
    fetchAttendanceReport();
  };


  const getMonthPayload = () => {
    const month = String(selectedMonth.getMonth() + 1).padStart(2, "0");
    const year = selectedMonth.getFullYear();

    return `${year}-${month}`;
  };



  useEffect(() => {
    fetchAttendanceReport();
  }, [selectedMonth]);

  // list 
  const fetchAttendanceReport = async () => {
    try {
      setLoading(true);

      const payload = {
        month: getMonthPayload(),
        employee_id: selectedEmployeeDetails || null,
      };

      const response = await axiosInstance.get(
        `${API_URL}api/attendance-report`,
        { params: payload }
      );

      console.log("API Payload:", payload);
      console.log("response check", response.data);

      setSummary(response.data.summary);

      const employeeOptions = response.data.employees.map(emp => ({
        label: emp.full_name,
        value: emp.id,
      }));
      setSelectedEmployee(employeeOptions);

      const formattedData = response.data.data.map((item, index) => ({
        id: index + 1,
        employee_name: item.employee_name,
        date: item.date,
        status: item.status,
        login_time: item.login_time || "-",
        logout_time: item.logout_time || "-",
        break_time: item.break_time || "-",
        total_hours: item.total_hours || "-",
        payable_time: item.payable_time || "-",
      }));

      setData(formattedData);

    } catch (error) {
      console.error("Attendance API Error:", error);
    } finally {
      setLoading(false);
    }
  };



  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = [
      "S.No",
      "Employee",
      "Date",
      "Status",
      "Login Time",
      "Logout Time",
      "Break",
      "Total Hours",
      "Payable Time",
    ];

    const rows = data.map((item, index) => [
      index + 1,
      `"${item.employee_name}"`,
      `"${item.date}"`,
      item.status,
      item.login_time,
      item.logout_time,
      item.break_time,
      item.total_hours,
      item.payable_time,
    ]);

    const csvContent =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // column
  const columns = [
    {
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
    },
    {
      header: "EMPLOYEE",
      field: "employee_name",
    },
    {
      header: "DATE",
      field: "date",
      body: (row) => formatToDDMMYYYY(row.date),
    },
    {
      header: "STATUS",
      field: "status",
      body: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Present"
          ? "bg-green-100 text-green-700"
          : row.status === "Absent"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600"
          }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "LOGIN TIME",
      field: "login_time",
    },
    {
      header: "LOGOUT TIME",
      field: "logout_time",
    },
    {
      header: "BREAK",
      field: "break_time",
    },
    {
      header: "TOTAL HOURS",
      field: "total_hours",
    },
    {
      header: "PAYABLE TIME",
      field: "payable_time",
    },
  ];
  console.log("columns", columns);


  return (
    <div className="flex flex-col justify-between w-screen min-h-screen bg-gray-100 px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div>
              <Mobile_Sidebar />
            </div>

            {/* Breadcrumbs */}
            <div className="flex justify-start mt-2 md:mt-0 gap-1 items-center">
              <p
                className="text-xs md:text-sm text-gray-500 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p
                className="text-xs md:text-sm text-gray-500 cursor-pointer"
                onClick={() => navigate("/pssdailyattendance")}
              >
                Daily Attendance
              </p>
              <p>{">"}</p>
              <p className="text-sm text-[#1ea600]">Reports</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-2xl md:text-3xl mt-1 md:mt-4 font-semibold">
                Attendance Report
              </p>

              {/* filter */}
              <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-8 justify-between items-center md:mt-5 h-auto rounded-2xl bg-white 
  shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6  ">
                {/* Global Search Input */}
                <div className="card flex flex-wrap md:flex-nowrap gap-5 md:z-50">
                  <DatePicker
                    selected={selectedMonth}
                    onChange={(date) => setSelectedMonth(date)}
                    className="w-full md:w-48  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600] p-2"
                    showMonthDropdown
                    showMonthYearPicker
                    dateFormat="MMM-yyyy"
                    dropdownMode="select"
                    popperPlacement="bottom-start"
                    popperClassName="datepicker-popper"
                    portalId="root"
                  />

                  {/* Global Search Input */}
                  <Dropdown
                    value={selectedEmployeeDetails}
                    onChange={(e) => setSelectedEmployeeDetails(e.value)}
                    options={selectedEmployee}
                    optionLabel="label"
                    placeholder="Select Employee"
                    filter
                    className="w-full md:w-48 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmit}
                      className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 py-2 rounded-md hover:scale-105 duration-300"
                    >
                      Search
                    </button>

                    <button
                      onClick={handleReset}
                      className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md hover:scale-105 duration-300"
                    >
                      Reset
                    </button>
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm md:text-base text-[#4A4A4A]">Total Working Days</p>
                  <span className="text-xl md:text-2xl font-bold text-[#7C7C7C]">{summary.total_working_days}</span>
                </div>

                <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm md:text-base text-[#4A4A4A]">Late Login</p>
                  <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">{summary.lateLogin}</p>
                </div>

                <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm md:text-base text-[#4A4A4A]">Present Days</p>
                  <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">{summary.present_days}</p>
                </div>

                <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm md:text-base text-[#4A4A4A]">Last Thon & Hours</p>
                  <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">{summary.lateThonHours}</p>
                </div>

                <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm md:text-base text-[#4A4A4A]">Absent Days</p>
                  <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">{summary.absent_days}</p>
                </div>

                <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm md:text-base text-[#4A4A4A]">Holidays</p>
                  <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">{summary.holidays}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full mt-1 md:mt-6 h-auto  rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] d px-3 py-3 md:px-6 md:py-6 ">
              <div className="flex flex-col lg:flex-row lg:items-center  md:justify-between gap-3 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-semibold text-base text-[#6B7280] border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]">Show</span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({ label: v, value: v }))}
                      onChange={(e) => setRows(e.value)}

                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className="text-sm text-[#6B7280]">Entries Per Page</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between  gap-5 mb-4">
                  {/* Search box */}
                  <div className="relative w-64">
                    <FiSearch
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <InputText
                      value={filters.global.value || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          global: { value: e.target.value, matchMode: "contains" },
                        })
                      }
                      placeholder="Search......"
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-[#D9D9D9] 
    focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />

                  </div>

                  <div className="">
                    <button
                      onClick={exportToCSV}
                      className=" flex items-center gap-2 bg-[#7C7C7C] hover:bg-[#9C9C9C] text-white font-medium px-4 py-2 rounded-md "
                    >
                      + Export CSV
                      <FaFileExport />
                    </button>
                  </div>
                </div>
              </div>

              <DataTable
                value={data}
                dataKey="id"
                paginator
                rows={rows}
                showGridlines
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={[
                  "employee_name",
                  "date",
                  "status",
                  "login_time",
                  "logout_time",
                  "break_time",
                  "total_hours",
                  "payable_time",
                ]}
                emptyMessage="No Data found"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              >
                {columns.map((col, index) => (
                  <Column
                    key={index}
                    field={col.field}
                    header={col.header}
                    body={col.body}
                    sortable={col.sortable}
                    style={col.style}
                  />
                ))}
              </DataTable>
            </div>
          </div>
        </>
      )}

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default Reports_Details;