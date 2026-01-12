
import { MdArrowForwardIos, MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Footer from "../Footer";
import {
  FaEye,
} from "react-icons/fa";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { Dropdown } from "primereact/dropdown";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { TfiPencilAlt } from "react-icons/tfi";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";
import { set } from "zod";
import Swal from "sweetalert2";
import { formatToDDMMYYYY } from "../../Utils/dateformat";
const Attendance_Mainbar = () => {

  const [globalFilter, setGlobalFilter] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate, setFilterDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [companyName, setCompanyName] = useState("ABC Company");
  const [selectedCompany, setSelectedCompany] = useState("Company A");
  const companyOptions = ["Company A", "Company B", "Company C"];
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  
  const [createdbyData, setCreatedbyData] = useState([]);


  const fetchCompaniesAttendance = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}api/attendance`,
        {
          params: {
            from_date: filterStartDate,
            to_date: filterEndDate,
            created_by: filterCreatedBy,
            company_id: filterCompanyname
          }
        }
      );
      console.log("res", res);

      const companyData = res?.data?.data.map((company) => ({
        id: company.id,
        company_id: company.company_id,
        name: company.company?.company_name || "-",
        attendanceDate: company.attendance_date,

       shifts: company.
company?.shifts?.map((shift) => shift.shift_name) || [],
        employee: company.employee
      }));



      const companyOptions = res?.data?.companies.map((company) => ({
        id: company?.id,
        name: company?.company_name,

      }));
      console.log("companyData", companyData)

      setCompanies(companyOptions);

      setCreatedbyData(res?.data?.createdby || []);
      setAttendanceData(companyData);

    } catch (err) {
      console.error("Error fetching companies", err);
      setAttendanceData([]);
    }
  };

  useEffect(() => {
    fetchCompaniesAttendance();
  }, []);


  const [filterStartDate, setFilterStartDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [filterEndDate, setFilterEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [filterCreatedBy, setFilterCreatedBy] = useState(null);
  const [filterCompanyname, setFilterCompanyname] = useState(null);


  const handleApplyFilter = () => {
    console.log({
      filterStartDate,
      filterEndDate,
      filterCreatedBy,
      filterCompanyname
    });
    fetchCompaniesAttendance();
  };


  const handleResetFilter = () => {
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterCreatedBy("");
    setFilterCompanyname("");

  };

  function onClickaddadtence() {
    navigate("/attendance-add");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  //view state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  // View Modal Handler
  // const handleView = async (id) => {
  //     try {
  //       setLoading(true);
  //       // Find the attendance record
  //       const record = attendanceData.find(item => item.id === id);
  //       if (!record) {
  //         toast.error("Record not found");
  //         return;
  //       }

  //       // Calculate attendance statistics for this company on this date
  //       const companyData = attendanceData.filter(
  //         item => item.companyName === record.companyName && item.date === record.date
  //       );

  //       const totalEmployees = companyData.length;
  //       const presentCount = companyData.filter(item => 
  //         item.attendance === "present" || item.attendance === "half-day"
  //       ).length;
  //       const absentCount = companyData.filter(item => item.attendance === "absent").length;
  //       const halfDayCount = companyData.filter(item => item.attendance === "half-day").length;

  //       setViewData(record);
  //       setAttendanceStats({
  //         totalEmployees,
  //         presentCount,
  //         absentCount,
  //         halfDayCount,
  //         companyName: record.companyName,
  //         date: record.date,
  //         createdBy: record.createdBy,
  //         employees: companyData
  //       });

  //       setIsViewModalOpen(true);
  //     } catch (error) {
  //       console.error("Error fetching view data:", error);
  //       toast.error("Failed to load attendance details");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };


  // View Handler - Navigate to view page
  const handleView = (id) => {
    const record = attendanceData.find(item => item.id === id);
    if (record) {
      navigate(`/attendance-view/${id}`, {
        state: {
          company: record.companyName,
          date: record.date,
          attendanceId: id
        }
      });
    }
  };
  const getAttendanceData = async (date) => {
    try {
      let response = await axiosInstance.get(
        // `${API_URL}/api/employees/today-logs/${date} `,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAttendanceData(response?.data?.data);
      setAttendanceCount(response?.data?.count);
      setAbsentlistData(response?.data?.todayAttendanceDetails?.absent);
      setWfhlistData(response?.data?.todayAttendanceDetails?.wfh);

      // console.log(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  // Delete Handler
  const handleDelete = async (id) => {
    const record = attendanceData.find(item => item.id === id);

    Swal.fire({
      title: 'Delete Attendance Record?',
      text: `Are you sure you want to delete attendance record ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // API call to delete attendance
          await axiosInstance.delete(`${API_URL}api/attendance/delete/${id}`);

          fetchCompaniesAttendance();

          toast.success("Attendance record deleted successfully!");

        } catch (error) {
          console.error("Delete error:", error);
          toast.error("Failed to delete attendance record");
        }
      }
    });
  };

  // Edit Handler - Navigate to edit page
  const handleEdit = (id) => {
    const record = attendanceData.find(item => item.id === id);
    if (record) {
      navigate(`/attendance-edit/${id}`, {
        state: {
          company: record.companyName,
          date: record.date,
          attendanceId: id
        }
      });
    }
  };




  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setSelectedDate(date);
    getAttendanceData(date);
  }, []);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
  }
  const [errors, setErrors] = useState({});
  const handleSubmit = async () => {
    const newErrors = {};

    //  Validation
    if (!selectedCompany) {
      newErrors.company = "Company is required";
    }

    if (!selectedDate) {
      newErrors.date = "Date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    //  Payload
    const payload = {
      company_id: selectedCompany,
      date: selectedDate,
      created_by: JSON.parse(localStorage.getItem("pssuser"))?.username || "admin",
    };

    try {
      setLoading(true);



      if (response.data.success || response.data.status) {
        toast.success("Attendance added successfully");
        closeAddModal();
        resetAttendanceForm();
        fetchAttendance(); // refresh table
      } else {
        toast.error(response.data.message || "Failed to add attendance");
      }
    } catch (error) {
      console.error("Attendance error:", error);
      toast.error("Something went wrong while adding attendance");
    } finally {
      setLoading(false);
    }
  };

  const resetAttendanceForm = () => {
    setSelectedCompany(null);
    setSelectedDate("");
    setErrors({});
  };



  const handleSelectAll = () => {
    setSelectedUsers(attendanceData.map((item) => item.id));
  };

  const handleClearAll = () => {
    setSelectedUsers([]);
  };

  const handleAttendanceChange = (id, value) => {
    setAttendanceData((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, attendance: value } : emp
      )
    );
  };



  const columns = [
    // {
    //   field: "attendanceHeader",
    //   header: (
    //     <div className="flex flex-col items-center">
    //       <span className="font-semibold">Attendance</span>

    //       {/* Buttons BELOW Title */}
    //       <div className="flex gap-2 mt-2">
    //         <button
    //           onClick={handleSelectAll}
    //           className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
    //         >
    //           Select All
    //         </button>

    //         <button
    //           onClick={handleClearAll}
    //           className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
    //         >
    //           Clear
    //         </button>
    //       </div>
    //     </div>
    //   ),

    //   body: (rowData) => (
    //     <input
    //       type="checkbox"
    //       checked={selectedUsers.includes(rowData.id)}
    //       onChange={(e) => {
    //         if (e.target.checked) {
    //           setSelectedUsers([...selectedUsers, rowData.id]);
    //         } else {
    //           setSelectedUsers(selectedUsers.filter((id) => id !== rowData.id));
    //         }
    //       }}
    //       className="h-5 w-5"
    //     />
    //   ),
    // },

    {
      field: "sno",
      header: "S.No",
      body: (rowData, options) => options.rowIndex + 1,
    },

    {
      field: "companyName",
      header: "Company Name",
      body: (rowData) => (
        <div>
          <p className="">{rowData.name}</p>
          {/* <p className="text-sm text-gray-600">{rowData.employee_number}</p> */}
        </div>
      ),
    },

    // {
    //   field: "role",
    //   header: "Role",
    //   body: (rowData) => <p>{rowData.roleName}</p>,
    // },

    // {
    //   field: "attendance",
    //   header: "Mark Attendance",
    //   body: (rowData) => (
    //     <div className="flex gap-6">
    //       <label className="flex items-center gap-2">
    //         <input
    //           type="radio"
    //           name={`attend-${rowData.id}`}
    //           value="present"
    //           checked={rowData.attendance === "present"}
    //           onChange={() => handleAttendanceChange(rowData.id, "present")}
    //         />
    //         Present
    //       </label>

    //       <label className="flex items-center gap-2">
    //         <input
    //           type="radio"
    //           name={`attend-${rowData.id}`}
    //           value="absent"
    //           checked={rowData.attendance === "absent"}
    //           onChange={() => handleAttendanceChange(rowData.id, "absent")}
    //         />
    //         Absent
    //       </label>
    //     </div>
    //   ),
    // },

    {
      field: "date",
      header: "Date",
      body: (rowData) => formatToDDMMYYYY(rowData.attendanceDate),
    },
    {
      field: "shifts",
      header: "Shift Allocation",
      body: (rowData) => {
        if (!rowData.shifts || rowData.shifts.length === 0) {
          return <span className="text-gray-400">-</span>;
        }

        return (
          <div className="flex flex-wrap gap-2 items-center justify-center ">
            {rowData.shifts.map((shiftName, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700"
              >
                {shiftName}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      field: "createdBy",
      header: "Created By",
      body: (rowData) => (
        <p>{rowData?.employee?.full_name || "-"}</p>
      ),
    },
    {
      header: "Actions",
      body: (row) => (
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => handleView(row.id)}
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>

          <button
            onClick={() => handleEdit(row.id)}
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]">
            <TfiPencilAlt />
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 bg-[#FFD1D1] text-[#DC2626] hover:bg-[#FFE2E2] rounded-[10px] "
          >
            <MdOutlineDeleteOutline />
          </button>
        </div>
      ),
      style: { textAlign: "center" },
      fixed: "true",
    }
  ];

  // Chart data for pie chart
  const getChartData = () => {
    if (!attendanceStats) return null;

    return {
      labels: ['Present', 'Absent'],
      datasets: [
        {
          data: [
            attendanceStats.presentCount,
            attendanceStats.absentCount,
          ],
          backgroundColor: ['#4BB452', '#DC2626'],
          borderWidth: 1,
        },
      ],
    };
  };


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  let navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  // Update the currentTime every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatHours = (hours) =>
    hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const formatNumber = (number) => (number < 10 ? `0${number}` : number);

  const day = days[currentTime.getDay()];
  const month = months[currentTime.getMonth()];
  const date = currentTime.getDate();
  const hours = formatHours(currentTime.getHours());
  const minutes = formatNumber(currentTime.getMinutes());
  const seconds = formatNumber(currentTime.getSeconds());
  const amPm = currentTime.getHours() >= 12 ? "PM" : "AM";

  function onClickMonthlyDetails() {
    navigate("/monthlyattendancedetails");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-5">

      {loading ? (
        <Loader />
      ) : (
        <>
          <div>

            <div className=" cursor-pointer ">
              <Mobile_Sidebar />
            </div>

            {/* Breadcrumbs */}

            <div className="flex gap-1 items-center cursor-pointer">
              <ToastContainer position="top-right" autoClose={3000} />
              <p
                className="text-xs md:text-sm text-gray-500  cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>

              <p className="text-xs md:text-sm   text-[#1ea600]">Attendance</p>
            </div>



            {/* <div className="flex  justify-between w-full mt-1 md:mt-5 h-auto  rounded-2xl bg-white shadow-lg px-2 py-2 md:px-6 md:py-6 ">


<div className="mt-4 flex items-center gap-5">
  <label className="block text-sm font-medium mb-1">
    Date
  </label>

  <input
    type="date"
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
    className="w-fit p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
  />
</div>
        <button
            onClick={openAddModal}
            className="bg-[#1ea600] px-3 py-2 text-white w-20 rounded-2xl"
          >
            Add
          </button>
          </div> */}

            {/* <div className="flex flex-col w-full mt-1 md:mt-5 h-auto  rounded-2xl bg-white shadow-lg px-3 py-3 md:px-6 md:py-6 "> */}

            {/* <h1 className="text-2xl mt-8 font-semibold text-gray-500 md:font-bold ">
          Attendance List
        </h1> */}
            {/* Filter Section */}
            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-3 py-4 md:px-6 md:py-6">
              {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"> */}
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
                {/* Start Date */}
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#6B7280]">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filterStartDate || ""}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="px-2 py-2 rounded-md text-sm border border-[#D9D9D9] text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#6B7280]">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filterEndDate || ""}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="px-2 py-2 rounded-md text-sm border border-[#D9D9D9] text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>

                {/* company */}
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#6B7280]">
                    Company
                  </label>
                  <select
                    value={filterCompanyname}
                    onChange={(e) => setFilterCompanyname(e.target.value)}
                    className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  >
                    <option value="">Select Company</option>
                    {/* Get unique references from data */}
                    {companies // Remove null/undefined
                      .map((com, index) => (
                        <option key={index} value={com.id}>
                          {com.name}
                        </option>
                      ))}
                  </select>
                </div>


                {/* Created By */}
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#6B7280]">
                    Created By
                  </label>
                  <select
                    value={filterCreatedBy}
                    onChange={(e) => setFilterCreatedBy(e.target.value)}
                    className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  >
                    <option value="">Select Employee</option>
                    {/* Get unique references from data */}
                    {createdbyData // Remove null/undefined
                      .map((data, index) => (
                        <option key={index} value={data.id}>
                          {data.full_name}
                        </option>
                      ))}
                  </select>
                  {/* <input
                    type="text"
                    placeholder="Enter creator name"
                    value={filterCreatedBy}
                    onChange={(e) => setFilterCreatedBy(e.target.value)}
                    className="px-2 py-2 rounded-md border border-[#D9D9D9] text-[#7C7C7C]
               focus:outline-none focus:ring-2 focus:ring-[#1ea600] placeholder:text-sm"
                  /> */}
                </div>


                {/* Buttons */}
                <div className="w-full flex gap-4">
                  <button
                    onClick={handleApplyFilter}
                    className="px-2 md:px-3 py-2 h-10 rounded-lg bg-[#4BB452] text-white font-medium w-20  hover:bg-[#5FD367] transition "
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleResetFilter}
                    className="px-2 md:px-3 py-2 h-10 rounded-lg bg-gray-100 text-[#7C7C7C] font-medium w-20 hover:bg-gray-200 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
              {/* </div> */}
            </div>
            {/* data table */}
            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6">
              <div className="datatable-container">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-semibold text-base text-[#6B7280]">Show</span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({ label: v, value: v }))}
                      onChange={(e) => setRows(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">Entries Per Page</span>
                  </div>

                  {/* <input
                  type="date"
                  value={selectedDate}
                  className="px-1 py-1 md:px-3 md:py-2 hidden md:block rounded-lg border border-[#D9D9D9] 
               focus:outline-none focus:ring-2 focus:ring-[#1ea600] text-[#7C7C7C] cursor-pointer "
                  onChange={(e) => {
                    getAttendanceData(e.target.value);
                    setSelectedDate(e.target.value);

                  }}
                /> */}

                  <div className="flex items-center gap-11">
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
                        className="w-full pl-10 pr-3 py-2 rounded-md border text-sm border-[#D9D9D9] 
               focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                      />
                    </div>

                    <button
                      onClick={() => navigate('/attendance-add')}
                      className="px-2 py-2  text-white bg-[#4BB452] hover:bg-[#5FD367] font-medium   w-fit rounded-lg transition-all duration-200"
                    >
                      + Add Attendance
                    </button>
                  </div>
                </div>

                <DataTable
                  className="mt-8 overflow-x-hidden"
                  value={attendanceData}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  globalFilter={globalFilter} // Global search filter
                  showGridlines
                  resizableColumns
                >
                  {columns.map((col, index) => (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      body={col.body}
                      style={{
                        minWidth: "150px",
                        wordWrap: "break-word", // Allow text to wrap
                        overflow: "hidden", // Prevent text overflow
                        whiteSpace: "normal", // Ensure that text wraps within the available space
                      }}
                    />
                  ))}
                </DataTable>
              </div>
            </div>

            {/* View Modal */}
            {isViewModalOpen && attendanceStats && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                {/* Overlay */}
                <div
                  className="absolute inset-0 z-40"
                  onClick={() => setIsViewModalOpen(false)}
                ></div>

                <div className="relative z-50 bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Attendance Details</h2>
                      <button
                        onClick={() => setIsViewModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        ×
                      </button>
                    </div>

                    {/* Company Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Company Name</p>
                          <p className="text-lg font-semibold">{attendanceStats.companyName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="text-lg font-semibold">{attendanceStats.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Created By</p>
                          <p className="text-lg font-semibold">{attendanceStats.createdBy}</p>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      {/* Pie Chart */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
                        <div className="h-64">
                          {getChartData() && (
                            <Doughnut data={getChartData()} options={chartOptions} />
                          )}
                        </div>
                      </div>

                      {/* Statistics Cards */}
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-green-600">Total Employees</p>
                              <p className="text-3xl font-bold text-green-700">{attendanceStats.totalEmployees}</p>
                            </div>
                            <div className="text-green-600">
                              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-blue-600">Present</p>
                              <p className="text-3xl font-bold text-blue-700">{attendanceStats.presentCount}</p>
                            </div>
                            <div className="text-blue-600">
                              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-red-600">Absent</p>
                              <p className="text-3xl font-bold text-red-700">{attendanceStats.absentCount}</p>
                            </div>
                            <div className="text-red-600">
                              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Employee List */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Employee List</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {attendanceStats.employees.map((employee, index) => (
                              <tr key={employee.id}>
                                <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{employee.employee_name}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{employee.employee_number}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{employee.roleName}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${employee.attendance === 'present'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {employee.attendance === 'present' ? 'Present' : 'Absent'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            )}

            {/* Add Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">

                {/* Overlay */}
                <div className="absolute inset-0" onClick={closeAddModal}></div>

                <div className=" bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative ">

                  {/* <div className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer" onClick={closeAddModal}>
                    <IoIosArrowForward className="w-3 h-3" />
                  </div> */}

                  <div className="px-5 lg:px-14 py-2 md:py-10">
                    <p className="text-2xl md:text-3xl font-medium">Add Attendance</p>

                    <div className="bg-white flex justify-between items-center w-full rounded-2xl shadow-md p-4 md:p-6">
                      <div className="flex flex-col  gap-1 ">
                        <label className="font-medium text-sm">Company Name
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <Dropdown
                          value={selectedCompany}
                          options={companyOptions}
                          onChange={(e) => setSelectedCompany(e.value)}
                          placeholder="Select Role"
                          className=" border-2  border-gray-300 w-full  rounded-lg "
                        />
                      </div>


                      <div className=" flex flex-col  gap-1 ">
                        <label className="font-medium text-sm">
                          Date <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.value)}

                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />


                      </div>


                      <div className="flex justify-end gap-2 mt-5 ">
                        <button onClick={closeAddModal} className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full">
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="bg-[#1ea600] hover:bg-[#146502] text-white px-4 md:px-5 py-2 font-semibold rounded-full disabled:opacity-50"
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Attendance_Mainbar;