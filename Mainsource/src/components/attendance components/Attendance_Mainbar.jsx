import { MdArrowForwardIos, MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import Footer from "../Footer";
import { FaEye } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
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
import { FiDownload } from "react-icons/fi";

// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);
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
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterDate, setFilterDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [companyName, setCompanyName] = useState("ABC Company");
  const [selectedCompany, setSelectedCompany] = useState("Company A");


   const [page, setPage] = useState(1);
   const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);
  };

  const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };

  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [createdbyData, setCreatedbyData] = useState([]);
  const [isImportAddModalOpen, setIsImportAddModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputRefEdit = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const user = JSON.parse(localStorage.getItem("pssuser") || "null");
  const userId = user?.id;

  // const userRole = user?.role_id;

  const fetchCompaniesAttendance = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}api/attendance`, {
        params: {
          from_date: filterStartDate,
          to_date: filterEndDate,
          created_by: filterCreatedBy,
          company_id: filterCompanyname,
        },
      });
      console.log("res", res);

      const companyData = res?.data?.data.map((company) => ({
        id: company.id,
        company_id: company.company_id,
        name: company.company?.company_name || "-",
        attendanceDate: company.attendance_date,

        shifts: company.company?.shifts?.map((shift) => shift.shift_name) || [],
        employee: company.employee,
      }));

      const companyOptions = res?.data?.companies.map((company) => ({
        id: company?.id,
        name: company?.company_name,
      }));
      console.log("companyData", companyData);

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
      filterCompanyname,
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
    const record = attendanceData.find((item) => item.id === id);
    if (record) {
      navigate(`/attendance-view/${id}`, {
        state: {
          company: record.companyName,
          date: record.date,
          attendanceId: id,
        },
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
        },
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
    const record = attendanceData.find((item) => item.id === id);

    Swal.fire({
      title: "Delete Attendance Record?",
      text: `Are you sure you want to delete attendance record ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
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
    const record = attendanceData.find((item) => item.id === id);
    if (record) {
      navigate(`/attendance-edit/${id}`, {
        state: {
          company: record.companyName,
          date: record.date,
          attendanceId: id,
        },
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
  };

  const handleFileChange = (e) => {
    // if (e.target.files[0]) {
    //     setSelectedFile(e.target.files[0]);
    // }
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      ".xlsx",
      ".xls",
      ".csv",
    ];

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !["xlsx", "xls", "csv"].includes(fileExtension)
    ) {
      toast.error("Please upload an Excel file (.xlsx or .xls or .csv)");
      e.target.value = ""; // Clear the input
      return;
    }

    setSelectedFile(file);
    setAttachment(file);

    // clear previous errors
    setError((prev) => ({ ...prev, file: "" }));
  };

  const handleDeleteFile = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetImportForm = () => {
    setSelectedCompany(null);
    setSelectedFile(null);
    setAttachment(null);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setError({ file: "", date: "", company: "", import: [] });

    // Clear input fields manually
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (fileInputRefEdit.current) {
      fileInputRefEdit.current.value = "";
    }
  };
  const [errors, setErrors] = useState({});
  const [error, setError] = useState({});

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
      created_by:
        JSON.parse(localStorage.getItem("pssuser"))?.username || "admin",
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

  // const handleFileSubmit = async (e) => {
  //   // console.log("selectedAccount:1");
  //   e.preventDefault();

  //   // Reset errors
  //   setError({ file: "", date: "", company: "", import: [] });

  //   // Frontend validation
  //   const newErrors = {};
  //   let hasError = false;

  //   if (!selectedDate) {
  //     newErrors.date = "Please select a date";
  //     hasError = true;
  //   }
  //   // console.log("selectedAccount:2");

  //   if (!selectedFile) {
  //     newErrors.file = "Please select a file";
  //     hasError = true;
  //   } else {
  //     // Validate file type
  //     const allowedExtensions = [".xlsx", ".xls", ".csv"];
  //     const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
  //     if (!allowedExtensions.includes(`.${fileExtension}`)) {
  //       newErrors.file = "Please upload only Excel files (.xlsx, .xls, .csv)";
  //       hasError = true;
  //     }
  //   }

  //   if (!selectedCompany) {
  //     newErrors.company = "Please select a company";
  //     hasError = true;
  //   }

  //   if (hasError) {
  //     setError((prev) => ({ ...prev, ...newErrors }));
  //     // Scroll to first error
  //     setTimeout(() => {
  //       const errorField = Object.keys(newErrors)[0];
  //       const element = document.querySelector(`[data-field="${errorField}"]`);
  //       if (element)
  //         element.scrollIntoView({ behavior: "smooth", block: "center" });
  //     }, 100);

  //     return;
  //   }

  //   try {
  //     const formData = new FormData();

  //     formData.append("file", selectedFile); // Excel file
  //     formData.append("created_by", userId);
  //     formData.append("company_id", Number(selectedCompany)); // Company ID

  //     // Debug: Check FormData contents
  //     for (let [key, value] of formData.entries()) {
  //       console.log(key, value);
  //     }

  //     const response = await axiosInstance.post(
  //       `${API_URL}api/attendance/import`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //         // Add timeout for debugging
  //       }

  //     );

  //     console.log("response:", response.data);
  //     if (response.data.success) {
  //       toast.success(response.data.message || "Excel imported successfully!");

  //       if (response.data.total !== undefined) {
  //         toast.success(`Imported: ${response.data.total} records`);
  //       }
  //     }

  //     // Reset fields
  //     handleDeleteFile();
  //     setSelectedDate(new Date().toISOString().split("T")[0]);
  //     setSelectedCompany(null);
  //     setIsImportAddModalOpen(false);
  //     fetchContractCandidates();
  //   } catch (err) {
  //     console.error("Import error:", err);

  //     const message =
  //       err.response?.data?.error ||
  //       err.response?.data?.message ||
  //       "Upload failed";
  //     const rowErrors = err.response?.data?.rowErrors || [];

  //     setError((prev) => ({
  //       ...prev,
  //       import: rowErrors.length ? rowErrors : message,
  //     }));
  //     if (rowErrors.length) {
  //       toast.error(`Validation failed in ${rowErrors.length} rows`);
  //     } else {
  //       toast.error(message);
  //     }
  //   }
  // };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    setError({ file: "", date: "", company: "", import: [] });

    if (!selectedFile || !selectedCompany) {
      toast.error("Company and file are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("company_id", Number(selectedCompany));
      formData.append("created_by", userId);

      const response = await axiosInstance.post(
        `${API_URL}api/attendance/import`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      //  SUCCESS HANDLING
      if (response.data.success || response.data.status) {
        toast.success(
          response.data.message || "Attendance imported successfully!",
        );

        // Reset UI
        handleDeleteFile();
        setSelectedCompany(null);
        setSelectedDate(new Date().toISOString().split("T")[0]);
        closeImportAddModal();
        fetchCompaniesAttendance();

        return;
      }
      toast.error(response.data.message || "Import failed");
    } catch (err) {
      console.error("Import error:", err);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Upload failed";

      toast.error(msg);
    }
  };

  const resetAttendanceForm = () => {
    setSelectedCompany(null);
    setSelectedDate("");
    setErrors({});
  };

  const openImportAddModal = () => {
    setIsImportAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeImportAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsImportAddModalOpen(false), 250);
  };

  const handleSelectAll = () => {
    setSelectedUsers(attendanceData.map((item) => item.id));
  };

  const handleClearAll = () => {
    setSelectedUsers([]);
  };

  const handleAttendanceChange = (id, value) => {
    setAttendanceData((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, attendance: value } : emp)),
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
      },
    },
    {
      field: "createdBy",
      header: "Created By",
      body: (rowData) => <p>{rowData?.employee?.full_name || "-"}</p>,
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
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
          >
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
    },
  ];

  // Chart data for pie chart
  const getChartData = () => {
    if (!attendanceStats) return null;

    return {
      labels: ["Present", "Absent"],
      datasets: [
        {
          data: [attendanceStats.presentCount, attendanceStats.absentCount],
          backgroundColor: ["#4BB452", "#DC2626"],
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
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
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

  const handlCsvDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/csv/attendance-demo.csv";
    link.download = "attendance-demo.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const companyOptions = companies.map((company) => ({
    label: company.name,
    value: company.id,
    name: company.name, // Keep original name for reference
  }));

  const createdByOptions = createdbyData.map((creator) => ({
    label: creator.full_name || creator.username || "Unknown",
    value: creator.id,
  }));

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
                    className="uniform-field px-2 py-2 rounded-md text-sm border border-[#D9D9D9] text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
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
                    className="uniform-field px-2 py-2 rounded-md text-sm border border-[#D9D9D9] text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>

                {/* company */}
                {/* <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#6B7280]">
                    Company
                  </label>
                  <select
                    value={filterCompanyname}
                    onChange={(e) => setFilterCompanyname(e.target.value)}
                    className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  >
                    <option value="">Select Company</option>
                 
                    {companies
                      .map((com, index) => (
                        <option key={index} value={com.id}>
                          {com.name}
                        </option>
                      ))}
                  </select>
                </div> */}

                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#6B7280]">
                    Company
                  </label>
                  <Dropdown
                    value={filterCompanyname}
                    options={companyOptions}
                    filter
                    placeholder="Select Company"
                    onChange={(e) => setFilterCompanyname(e.target.value)}
                    className="uniform-field px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>

                {/* Created By */}
                {/* <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#6B7280]">
                    Created By
                  </label>
                  <select
                    value={filterCreatedBy}
                    onChange={(e) => setFilterCreatedBy(e.target.value)}
                    className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  >
                    <option value="">Select Employee</option>
                   
                    {createdbyData 
                      .map((data, index) => (
                        <option key={index} value={data.id}>
                          {data.full_name}
                        </option>
                      ))}
                  </select>
                  
                </div> */}

                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#6B7280]">
                    Created By
                  </label>
                  <Dropdown
                    value={filterCreatedBy}
                    options={createdByOptions}
                    filter
                    placeholder="Select Employee"
                    onChange={(e) => setFilterCreatedBy(e.target.value)}
                    className="uniform-field px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />

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
                    className="px-2 md:px-3 py-1 md:py-2 h-8 md:h-10 rounded-lg bg-[#1ea600] hover:bg-[#4BB452] text-white text-xs md:text-sm font-medium w-20  transition "
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleResetFilter}
                    className="px-2 md:px-3 py-1 md:py-2 h-8 md:h-10 rounded-lg bg-gray-100 text-[#7C7C7C] text-xs md:text-sm font-medium w-20 hover:bg-gray-200 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
              {/* </div> */}
            </div>
            {/* data table */}
            <div
              className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6"
            >
              <div className="datatable-container">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-semibold text-base text-[#6B7280]">Show</span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({
                        label: v,
                        value: v,
                      }))}
                      onChange={(e) => onRowsChange(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">
                      Entries Per Page
                    </span>
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
                    <div className="flex items-center">
                      <button
                        onClick={openImportAddModal}
                        className="hidden md:block px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium w-20 rounded-lg"
                      >
                        Import
                      </button>
                    </div>

                    {/* sample csv format download */}
                    <div className="flex items-center">
                      <button
                        onClick={handlCsvDownload}
                        className="hidden
      md:flex items-center gap-2
      px-5 py-2
      text-sm font-semibold
      text-green-700
      bg-green-100
      rounded-full
      hover:bg-green-200
      transition
    "
                      >
                        <FiDownload className="text-lg" /> Demo CSV
                      </button>
                    </div>
                    <button
                      onClick={() => navigate("/attendance-add")}
                      className="hidden md:block px-2 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium   w-fit rounded-lg transition-all duration-200"
                    >
                      Add Attendance
                    </button>
                  </div>
                </div>
                {/* mobile view */}
                <div className="flex md:hidden justify-between items-center gap-1">
                  <button
                    onClick={handlCsvDownload}
                    className="
      flex items-center gap-2
      px-1 md:px-2 py-2
      text-xs md:text-sm font-semibold
      text-green-700
      bg-green-100
      rounded-full
      hover:bg-green-200
      transition
    "
                  >
                    <FiDownload className="text-lg" /> Demo CSV
                  </button>
                  <button
                    onClick={openImportAddModal}
                    className="px-1 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] text-xs md:text-base font-medium w-20 rounded-lg"
                  >
                    Import
                  </button>
                  <button
                    onClick={() => navigate("/attendance-add")}
                    className="px-1 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  text-xs md:text-base w-fit rounded-lg transition-all duration-200"
                  >
                    +Attendance
                  </button>
                </div>

                <DataTable
                  className="mt-8 overflow-x-hidden"
                  value={attendanceData}
                  paginator
                  
                  rows={rows}
                   first={(page - 1) * rows}
                    onPage={onPageChange}
                  rowsPerPageOptions={[10, 20, 50, 100]}
              
                  globalFilter={globalFilter}
                  globalFilterFields={[
                    "name",
                    "attendanceDate",
                    "shifts",
                    "employee.full_name",
                  ]}
                  showGridlines
                  resizableColumns
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    paginatorClassName="custom-paginator"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    loading={loading}
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
                      <h2 className="text-2xl font-bold text-gray-800">
                        Attendance Details
                      </h2>
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
                          <p className="text-lg font-semibold">
                            {attendanceStats.companyName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="text-lg font-semibold">
                            {attendanceStats.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Created By</p>
                          <p className="text-lg font-semibold">
                            {attendanceStats.createdBy}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      {/* Pie Chart */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">
                          Attendance Distribution
                        </h3>
                        <div className="h-64">
                          {getChartData() && (
                            <Doughnut
                              data={getChartData()}
                              options={chartOptions}
                            />
                          )}
                        </div>
                      </div>

                      {/* Statistics Cards */}
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-green-600">
                                Total Employees
                              </p>
                              <p className="text-3xl font-bold text-green-700">
                                {attendanceStats.totalEmployees}
                              </p>
                            </div>
                            <div className="text-green-600">
                              <svg
                                className="w-12 h-12"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-blue-600">Present</p>
                              <p className="text-3xl font-bold text-blue-700">
                                {attendanceStats.presentCount}
                              </p>
                            </div>
                            <div className="text-blue-600">
                              <svg
                                className="w-12 h-12"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-red-600">Absent</p>
                              <p className="text-3xl font-bold text-red-700">
                                {attendanceStats.absentCount}
                              </p>
                            </div>
                            <div className="text-red-600">
                              <svg
                                className="w-12 h-12"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Employee List */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">
                        Employee List
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                S.No
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employee Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employee ID
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {attendanceStats.employees.map(
                              (employee, index) => (
                                <tr key={employee.id}>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    {index + 1}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    {employee.employee_name}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    {employee.employee_number}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    {employee.roleName}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        employee.attendance === "present"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {employee.attendance === "present"
                                        ? "Present"
                                        : "Absent"}
                                    </span>
                                  </td>
                                </tr>
                              ),
                            )}
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
                    <p className="text-2xl md:text-3xl font-medium">
                      Add Attendance
                    </p>

                    <div className="bg-white flex justify-between items-center w-full rounded-2xl shadow-md p-4 md:p-6">
                      <div className="flex flex-col  gap-1 ">
                        <label className="font-medium text-sm">
                          Company Name
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
                        <button
                          onClick={closeAddModal}
                          className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                        >
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

            {/* import add modal */}
            {isImportAddModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div
                  className="absolute inset-0 "
                  onClick={() => {
                    closeImportAddModal();
                    resetImportForm();
                  }}
                >
                  <IoIosArrowForward className="w-3 h-3" />
                </div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                    isAnimating ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Toggle Sidebar"
                    onClick={() => {
                      closeImportAddModal();
                      resetImportForm();
                    }}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="p-5">
                    <p className="text-xl md:text-2xl font-medium">
                      Attendance
                    </p>

                    {/* company */}
                    <div className="mt-3 flex justify-between items-center">
                      <label className="block text-md font-medium">
                        Company<span className="text-red-500">*</span>
                      </label>

                      <div className="w-[60%] md:w-[50%]">
                        <select
                          value={selectedCompany}
                          onChange={(e) => setSelectedCompany(e.target.value)}
                          className="w-full border px-3 py-2 border-gray-300 rounded-lg"
                        >
                          <option value="">Select Company</option>
                          {companies.map((com) => (
                            <option key={com.id} value={com.id}>
                              {com.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="mt-3 flex justify-between items-center">
                      <label className="block text-md font-medium">
                        File Upload
                      </label>

                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {attachment && (
                          <div className="flex justify-between mt-2 items-center bg-gray-50 px-3 py-2 rounded-lg border">
                            <span className="text-sm text-gray-700 truncate w-[80%]">
                              {attachment.name}
                            </span>
                            <button
                              type="button"
                              onClick={handleDeleteFile}
                              title="Delete"
                              className="text-red-600 hover:text-red-800 text-[18px]"
                            >
                              <AiFillDelete />
                            </button>
                          </div>
                        )}
                        {errors.file && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.file}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* IMPORT ERRORS */}
                    {errors.import?.length > 0 && (
                      // <div className="mt-4 bg-red-50 border border-red-300 p-3 rounded-lg max-h-48 overflow-auto">
                      <div className="mt-4">
                        <p className="text-red-700 font-semibold mb-2"></p>

                        {Array.isArray(errors.import) ? (
                          errors.import.map((item, idx) => (
                            <p key={idx} className="text-sm text-red-600">
                              Row {item.row}: {item.errors.join(", ")}
                            </p>
                          ))
                        ) : (
                          <p className="text-red-600">{errors.import}</p>
                        )}
                      </div>
                    )}

                    <div className="flex  justify-end gap-2 mt-6 md:mt-14">
                      <button
                        onClick={() => {
                          closeImportAddModal();
                          resetImportForm();
                        }}
                        className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                        onClick={handleFileSubmit}
                      >
                        Submit
                      </button>
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
