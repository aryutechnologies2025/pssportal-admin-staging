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
import { formatIndianDateTime12Hr, formatToDDMMYYYY } from "../../Utils/dateformat";
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
  const [selectedEmployeeDeatils, setSelectedEmployeeDetails] = useState(null);
  const [selectedTask, setSelectedTask] = useState(false);

  //page
    const [page, setPage] = useState(1);
    // console.log("page...... : ", page)
    const limit = 10;
    const [rows, setRows] = useState(10);
    // console.log("rows........ : ", rows)
    const [totalRecords, setTotalRecords] = useState(0);
    // console.log("totalRecords...... : ", totalRecords)
   
  // Dummy data for demonstration - replace with your actual API data
  const [data, setData] = useState([
    {
      id: 1,
      date: "01/01/2028",
      status: "Present",
      workType: "WFO",
      loginTime: "10:14:25 AM",
      logoutTime: "7:15 PM",
      break: "0:30:20",
      totalHours: "08:30:25",
      payableTime: "08:30:25"
    },
    {
      id: 2,
      date: "02/01/2028",
      status: "Holiday",
      workType: "-",
      loginTime: "-",
      logoutTime: "-",
      break: "-",
      totalHours: "-",
      payableTime: "-"
    },
    {
      id: 3,
      date: "03/01/2028",
      status: "Present",
      workType: "WFO",
      loginTime: "10:14:25 AM",
      logoutTime: "7:15 PM",
      break: "0:30:20",
      totalHours: "08:30:25",
      payableTime: "08:30:25"
    },
    {
      id: 4,
      date: "04/01/2028",
      status: "Absent",
      workType: "WFO",
      loginTime: "10:14:25 AM",
      logoutTime: "7:15 PM",
      break: "0:30:20",
      totalHours: "00:00:00",
      payableTime: "00:00:00"
    }
  ]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        // `${API_URL}/api/emp-attendances/monthly-report`,
        {
          withCredentials: true,
          params: {
            month: selectedMonth
              .toLocaleString("default", { month: "short" })
              .toLocaleLowerCase(),
            year: selectedMonth.getFullYear(),
          },
        }
      );
      setMonthlyReportList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployeeList = async () => {
    try {
      const response = await axiosInstance.get(
        // `${API_URL}/api/employees/all-employees`,
        {
          withCredentials: true,
        }
      );

      const employeeIds = response.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
      }));
      const employeeName = response.data.data.map((emp) => emp.email);

      setSelectedEmployee(employeeIds);
      setSelectedEmployeeName(employeeName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
  }, [selectedMonth]);

  const handleSubmit = async () => {
    setLoading(true);
    const monthDate = new Date(selectedMonth);
    const payload = {
      month: `${monthDate.getMonth() + 1}-${monthDate.getFullYear()}`,
      employeeId: selectedEmployeeDeatils?.split(" - ")[0] || "",
    };

    try {
      const response = await axiosInstance.get(
        // `${API_URL}/api/task/particularday-report`,
        { params: payload, withCredentials: true }
      );
      setTasklist(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = ["S.No", "DATE", "STATUS", "WORK TYPE", "LOGIN TIME", "LOGOUT TIME", "BREAK", "TOTAL HOURS", "PAYABLE TIME"];
    
    const csvContent = [
      headers.join(","),
      ...data.map((record, index) => [
        index + 1,
        record.date,
        record.status,
        record.workType,
        record.loginTime,
        record.logoutTime,
        record.break,
        record.totalHours,
        record.payableTime
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClicklogs = () => {
    setSelectedTask(true);
  };

  const handleCloselogs = () => {
    setSelectedTask(false);
  };

  const columns = [
    {
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
      style: { width: "5%", textAlign: "center" },
    //   sortable: false,
    },
    {
      header: "DATE",
      field: "date",
    //   sortable: true,
      style: { width: "10%" },
      body: (rowData) => (
        <div className="font-medium text-gray-900">
          {rowData.date || "-"}
        </div>
      ),
    },
   {
  header: "STATUS",
  field: "status",
  style: { width: "10%" },
  body: (rowData) => {
    const statusStyles = {
      Present: "bg-green-100 text-green-700",
      Holiday: "bg-orange-100 text-orange-700",
      Absent: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusStyles[rowData.status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {rowData.status || "-"}
      </span>
    );
  },
}
,
    {
      header: "WORK TYPE",
      field: "workType",
    //   sortable: true,
      style: { width: "10%" },
      body: (rowData) => rowData.workType || "-",
    },
    {
      header: "LOGIN TIME",
      field: "loginTime",
    //   sortable: true,
      style: { width: "12%" },
      body: (rowData) => rowData.loginTime || "-",
    },
    {
      header: "LOGOUT TIME",
      field: "logoutTime",
    //   sortable: true,
      style: { width: "12%" },
      body: (rowData) => rowData.logoutTime || "-",
    },
    {
      header: "BREAK",
      field: "break",
    //   sortable: true,
      style: { width: "10%" },
      body: (rowData) => rowData.break || "-",
    },
    {
      header: "TOTAL HOURS",
      field: "totalHours",
    //   sortable: true,
      style: { width: "12%" },
      body: (rowData) => rowData.totalHours || "-",
    },
    {
  header: "PAYABLE TIME",
  field: "payableTime",
  style: { width: "12%" },
  body: (rowData) => {
    const time = rowData.payableTime;

    let textColor = "text-gray-500";
    if (time && time !== "00:00:00" && time !== "-") {
      textColor = "text-green-600";
    }
    if (time === "00:00:00") {
      textColor = "text-red-500";
    }

    return (
      <span className={`font-medium ${textColor}`}>
        {time || "-"}
      </span>
    );
  },
}

  ];

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
              <p className="text-sm text-green-500">Reports</p>
            </div>
            <div className="flex flex-col gap-3">
            <p className="text-2xl md:text-3xl mt-1 md:mt-4 font-semibold">
              Attendance Report
            </p>
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
                  value={selectedEmployeeDeatils}
                  onChange={(e) => setSelectedEmployeeDetails(e.value)}
                  options={selectedEmployee}
                  optionLabel="label"
                  placeholder="Select a Employee"
                  filter
                  className="w-full md:w-48 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                />

                <button
                  onClick={handleSubmit}
                  className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 py-2 rounded-md hover:scale-105 duration-300"
                >
                  Search
                </button>
              </div>

              
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm md:text-base text-[#4A4A4A]">Total Working Days</p>
            <span className="text-xl md:text-2xl font-bold text-[#7C7C7C]">23</span>
          </div>
          
          <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm md:text-base text-[#4A4A4A]">Late Login</p>
            <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">1</p>
          </div>
          
          <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm md:text-base text-[#4A4A4A]">Present Days</p>
            <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">17</p>
          </div>
          
          <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm md:text-base text-[#4A4A4A]">Last Thon & Hours</p>
            <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">1</p>
          </div>
          
          <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm md:text-base text-[#4A4A4A]">Absent Days</p>
            <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">5</p>
          </div>
          
          <div className="flex gap-2 justify-center items-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm md:text-base text-[#4A4A4A]">Holidays</p>
            <p className="text-xl md:text-2xl font-bold text-[#7C7C7C]">8</p>
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
                                   value={globalFilter}
                                   onChange={(e) => setGlobalFilter(e.target.value)}
                                   
                                   placeholder="Search......"
                                   className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-[#D9D9D9] 
                            focus:outline-none focus:ring-2 focus:ring-[#1ea600] placeholder:text-[#7C7C7C]  "
             
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
                    dataKey="_id"
                    paginator
                    rows={10}
                    showGridlines
                    globalFilter={globalFilter}
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