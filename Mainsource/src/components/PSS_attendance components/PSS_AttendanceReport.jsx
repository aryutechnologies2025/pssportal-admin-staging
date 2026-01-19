import React, { useState, useEffect, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { TfiPencilAlt } from "react-icons/tfi";
import axiosInstance from "../../axiosConfig.js";
import { API_URL } from "../../Config";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "primereact/multiselect";
import { useRef } from "react";
import customise from "../../assets/customise.svg";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"
import { Editor } from "primereact/editor";
import Loader from "../Loader.jsx";
import Mobile_Sidebar from "../Mobile_Sidebar.jsx";
import Footer from "../Footer.jsx";
import { formatToYYYYMMDD, formatToDDMMYYYY, formatDateTimeDDMMYYYY } from "../../Utils/dateformat.js";
import DatePicker from "react-datepicker";
import WFH from "../../assets/WFH.svg";
import { IoClose } from "react-icons/io5";
import { Capitalise } from "../../hooks/useCapitalise.jsx";


const DailyWorkReport_Details = () => {
  let navigate = useNavigate();

  const [monthlyReportList, setMonthlyReportList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasklist, setTasklist] = useState([]);
  const [selectedEmployeeDeatils, setSelectedEmployeeDetails] = useState(null);
  const [selectedTask, setSelectedTask] = useState(false);
  const [data, setData] = useState([]);
  const storedDetatis = localStorage.getItem("pssuser");
  const parsedDetails = JSON.parse(storedDetatis);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");;

  const [workReports, setWorkReports] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [absentlistIsOpen, setAbsentlistIsOpen] = useState(false);
  const [absentlistData,setAbsentlistData]=useState([]);
  const [attendanceCount, setAttendanceCount] = useState({});
  const [attendanceData, setAttendanceData] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  console.log(" selectedDate", selectedDate);

  const [allWorkReports, setAllWorkReports] = useState([]);

  const [dailyForm, setDailyForm] = useState({
    report_date: "",
    report: ""
  });

  const [editDailyForm, setEditDailyForm] = useState({
    id: null,
    report_date: "",
    report: ""
  });
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    employee_id: ""
  });
  const [summary, setSummary] = useState({
    total_working_days: 0,
    present_days: 0,
    absent_days: 0,
  });


  // Fetch attendance report
  // const fetchDailyAttendanceReport = async () => {
  //   try {
  //     setLoading(true);

  //     const month = selectedMonth.getMonth() + 1;
  //     const year = selectedMonth.getFullYear();

  //     const response = await axiosInstance.get(
  //        `${API_URL}/api/attendance-report/attendance/${date} `,
  //     );

  //     console.log("response check", response.data);

  //     setSummary(response.data.summary);

  //     const employeeOptions = response.data.employees.map(emp => ({
  //       label: emp.full_name,
  //       value: emp.id,
  //     }));
  //     setSelectedEmployee(employeeOptions);

  //     const formattedData = response.data.data.map((item, index) => ({
  //       id: index + 1,
  //       employee_name: item.employee_name,
  //       // date: formatToDDMMYYYY(item.date),
  //       date: item.date, 
  //       status: item.status,
  //       login_time: item.login_time || "-",
  //       logout_time: item.logout_time || "-",
  //       break_time: item.break_time || "-",
  //       total_hours: item.total_hours || "-",
  //       payable_time: item.payable_time || "-",
  //     }));

  //     setData(formattedData);


  //   } catch (error) {
  //     console.error("Attendance API Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };




useEffect(() => {
  if (selectedDate) {
    getAttendanceData();
  }
}, [selectedDate]);



const getAttendanceData = async () => {
  try {
    const res = await axiosInstance.get(
      `${API_URL}api/attendance-report/attendance`,
      {
        params: { month: selectedDate },
      }
    );

    setAttendanceCount(res.data.summary || {});

    const formattedData = res.data.data.map((item, index) => ({
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
    setAbsentlistData(
      res.data.data.filter(item => item.status === "Absent")
    );

  } catch (err) {
    console.error("Attendance API Error:", err);
  }
};



  function onClickMonthlyDetails() {
    navigate("/reports");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  const columns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
    },
    // {
    //     field: "employee.gen_employee_id",
    //     header: "Employee ID",
    // },
    {
      field: "employee_name",
      header: "EMPLOYEE NAME",
      body: (row) => Capitalise(row.employee_name) || row.employee_name || "-",
    },
    {
      field: "date",
      header: "Date",
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
      body: (row) => row.login_time || "-",
    },
    {
      header: "LOGOUT TIME",
      field: "logout_time",
      body: (row) => row.logout_time || "-",
    },
    {
      header: "BREAK",
      field: "break_time",
      body: (row) => row.break_time || "-",
    },
    {
      header: "TOTAL HOURS",
      field: "total_hours",
      body: (row) => row.total_hours || "-",
    },
    {
      header: "PAYABLE TIME",
      field: "payable_time",
      body: (row) => row.payable_time || "-",
    },

    // {
    //     field: "action",
    //     header: "Action",
    //     body: (row) => (
    //         <div className="flex justify-center gap-3">
    //             <TfiPencilAlt
    //                 className="text-[#1ea600] cursor-pointer hover:scale-110 transition"
    //                 onClick={() => openEditModal(row)}
    //             />
    //         </div>
    //     ),
    //     style: { textAlign: "center" }
    // }
  ];

  const AbsentDatacolumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
    },
    {
      field: "employee_name",
      header: "Name",
      body: (row) => Capitalise(row.employee_name) || "-",
    },
    // { field: "employeeId", header: "ID" },
  ];






  return (
    <div className="flex  flex-col justify-between bg-gray-50  px-3 md:px-5 pt-2 md:pt-10 w-full min-h-screen overflow-x-auto ">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className="">
              <Mobile_Sidebar />
            </div>

            <div className="flex justify-start gap-2 mt-2 md:mt-0 items-center">
              <ToastContainer position="top-right" autoClose={3000} />

              <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-sm  md:text-md  text-[#1ea600]">Daily Work Report</p>
            </div>

            {/* Filter Section */}
            <div className="w-full  mt-5 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-4 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between ">
                <div className="flex flex-wrap  items-end gap-4">

                  <p className="text-xl md:text-3xl font-semibold  ">
                    Attendance
                  </p>
                  {/* <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="w-full md:w-48  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600] p-2"

                    dateFormat="DD-MM-yyyy"
                    dropdownMode="select"
                    popperPlacement="bottom-start"
                    popperClassName="datepicker-popper"
                    portalId="root"
                  /> */}
                  <input
                  type="date"
                  value={selectedDate}
                  className="w-full md:w-48  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600] p-2"
                  onChange={(e) => setSelectedDate(e.target.value)}
                />


                </div>
                <div className="">
                  <button
                    onClick={onClickMonthlyDetails}
                    className="px-4 py-2 rounded-lg text-white bg-[#1ea600] hover:bg-[#23880c]"
                  >
                    Monthly Details
                  </button>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="hidden md:flex flex-col sm:flex-row mt-5 flex-grow gap-3">
              <div
                className="flex flex-grow gap-2 w-full sm:w-1/4  transition-all duration-100 flex-col justify-between bg-white px-5 py-5 rounded-xl"
              >
                <div className="flex items-center justify-between gap-3 text-4xl">
                  <img src={WFH} alt="" className="h-12 w-12" />
                  {summary?.present}
                </div>

                <p className="text-xl font-semibold text-gray-500 mt-3 md:mt-8 uppercase">
                  Present
                </p>

                <p className="hidden md:block text-gray-400 mt-2">
                  {selectedDate ? formatToDDMMYYYY(selectedDate) : ""}
                </p>

                <p className="text-2xl font-semibold text-green-500">
                  {attendanceCount?.present || 0}
                </p>
              </div>

              <div onClick={() => setAbsentlistIsOpen(true)}
                className="flex flex-grow gap-2 w-full sm:w-1/4  transition-all duration-100 flex-col justify-between bg-white px-5 py-5 rounded-xl"
              >
                <div className="flex items-center justify-between gap-3 text-4xl">
                  <img src={WFH} alt="" className="h-12 w-12 text-green-500" />
                  {attendanceCount?.absent}
                </div>

                <p className="text-xl font-semibold text-gray-500 mt-3 md:mt-8 uppercase">
                  absent
                </p>

                <p className="hidden md:block text-gray-400 mt-2">
                  {selectedDate ? formatToDDMMYYYY(selectedDate) : ""}
                </p>

                <p className="text-2xl font-semibold text-green-500">
                  {attendanceCount?.absent || 0}
                </p>
              </div>
            </div>

            {/* MOBILE — Combined Absent + WFH Card */}
            <div className="flex md:hidden flex-row justify-between items-center gap-2 bg-white px-5 py-3 rounded-xl mt-5">

              <div className="flex flex-1 gap-2 justify-center cursor-pointer">
                <p className="text-xl font-bold text-green-500">{attendanceCount?.present}</p>
                <p className="text-lg font-semibold text-gray-500 uppercase">Present</p>
              </div>


              <div onClick={() => setAbsentlistIsOpen(true)} className="flex flex-1 gap-2 justify-center cursor-pointer">
                <p className="text-xl font-bold text-green-500">{attendanceCount?.absent}</p>
                <p className="text-lg font-semibold text-gray-500 uppercase">Absent</p>
              </div>



            </div>
            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6">
              <div className="datatable-container mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">

                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map(v => ({ label: v, value: v }))}
                      onChange={(e) => setRows(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                    />
                    <span className=" text-sm text-[#6B7280]">Entries Per Page</span>



                  </div>

                  <div className="flex justify-between items-center gap-5">
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
               focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                      />
                    </div>


                  </div>
                </div>
                <div className="table-scroll-container" id="datatable">
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
            </div>
            {absentlistIsOpen && (
              <div>
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  onClick={() => setAbsentlistIsOpen(false)}
                >
                  <div
                    className="bg-white p-6 rounded-lg shadow-lg w-[600px] h-[600px] overflow-y-auto relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    <button
                      className="absolute top-4 right-4 text-gray-600 hover:text-black"
                      onClick={() => setAbsentlistIsOpen(false)}
                    >
                      <IoClose size={24} />
                    </button>

                    <h2 className="text-xl font-semibold mb-2">
                      Absent List{" "}
                      <span className="text-gray-500 text-[16px]">
                        ({formatToDDMMYYYY(selectedDate)})
                      </span>
                    </h2>

                    <DataTable
                      className="mt-8"
                      value={absentlistData}
                      paginator
                      rows={5}
                      rowsPerPageOptions={[5, 10, 20]}
                      showGridlines
                      resizableColumns
                    >
                      {AbsentDatacolumns.map((col, index) => (
                        <Column
                          key={index}
                          field={col.field}
                          header={col.header}
                          body={col.body}
                          style={col.style}
                          bodyStyle={col.bodyStyle}
                        />
                      ))}
                    </DataTable>
                  </div>
                </div>
              </div>
            )}



          </div>
        </>
      )
      }
      <Footer />
    </div >
  );
};
export default DailyWorkReport_Details;
