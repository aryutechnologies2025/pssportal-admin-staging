import progress from "../../assets/progress.png";
import chart from "../../assets/chart.png";
import calendar from "../../assets/calendar.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { BsCalendar4 } from "react-icons/bs";
import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar_style.css";
import { Line, Circle } from "rc-progress";
import Footer from "../Footer";

import { MdLogout } from "react-icons/md";
import Mobile_Sidebar from "../Mobile_Sidebar";
// import axiosInstance from "axios";
import { format } from "date-fns";
import { DataTable } from "primereact/datatable";
// import { API_URL } from "./Config";
import { Column } from "primereact/column";
import Loader from "../Loader";

import Clock from "./Clock";
import {
  formatDateTimeDDMMYYYY,
  formatToDDMMYYYY,
  formatToYYYYMMDD,
} from "../../Utils/dateformat";
import DateFilterDropdown from "./DateFilterDropdown";
import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig";
import { useDateUtils } from "../../Utils/useDateUtils";
import { Capitalise } from "../../hooks/useCapitalise";
import exportToCSV from "../../Utils/exportToCSV";
import exportToPDF from "../../Utils/exportToPDF";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";


const Dashboard_Mainbar = () => {
  const formatDateTime = useDateUtils();
  const navigate = useNavigate();

  const [value, onChange] = useState(new Date());
  const [currentTime1, setCurrentTime1] = useState(new Date());
  const [upcomingHolidays, setUpcomingHolidays] = useState("");
  const [employeeRequests, setEmployeeRequests] = useState("");
  const [attendanceCount, setAttendanceCount] = useState("");
  const [absentlistIsOpen, setAbsentlistIsOpen] = useState(false);
  const [wfhlistIsOpen, setWfhlistIsOpen] = useState(false);
  const [presentlistIsOpen, setpresentlistIsOpen] = useState(false);
  const [absentlistData, setAbsentlistData] = useState("");

  const [wfhlistData, setWfhlistData] = useState("");
  const [presentlistData, setpresentlistData] = useState("");

  // console.log("presentlistData", presentlistData);
  const [selectedDate, setSelectedDate] = useState("");
  // console.log("upcomingHolidays:", attendanceCount);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [emplopyeereliving, setEmplopyeereliving] = useState([]);
  const [interns, setinterns] = useState([]);

  // console.log("announcements", announcements)
  // console.log("interns", interns);
  const [showTopBanner, setShowTopBanner] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [topAnnouncement, setTopAnnouncement] = useState(null);

  const [continuousAbsentees, setContinuousAbsentees] = useState([]);
  const [employeesJoinedToday, setEmployeesJoinedToday] = useState([]);
  const [jobFormSubmissions, setJobFormSubmissions] = useState([]);
  const [contractEmployees, setContractEmployees] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [todayContractAttendanceMissing, setTodayContractAttendanceMissing] =
    useState([]);

  const [dateFilter, setDateFilter] = useState("Today");

  const handleDateChange = (value) => {
    setDateFilter(value);

    const { from_date, to_date } = getDateRange(value);

    // API call
    fetchDashboardData(from_date, to_date);
  };

  useEffect(() => {
    loadData();
    fetchAnnouncements(); // 👈 ADD THIS
    const date = new Date().toISOString().split("T")[0];
    setSelectedDate(date);
  }, []);

  // useEffect(() => {
  //   if (topAnnouncement) {
  //     const timer = setTimeout(() => {
  //       setShowTopBanner(false);
  //     }, 1000000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [topAnnouncement]);

  const fetchAnnouncements = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}api/announcements/latest`);

      if (res.data?.success) {
        const list = res.data.data || [];
        setAnnouncements(list);

        if (list.length > 0) {
          setTopAnnouncement(list[0]); // show latest one
          setShowTopBanner(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    }
  };

  const loadData = () => {
    //  API call

    // Continuous Absentees
    const mockAbsentees = [
      {
        company: "Company1",
        name: "Raj Patel",
        consecutiveDays: 1,
        lastPresentDate: "25-12-2025",
      },
      {
        company: "Company2",
        name: "Emma Lee",
        consecutiveDays: 3,
        lastPresentDate: "27-12-2025",
      },
    ];

    // Employees Joined Today
    const mockJoinedToday = [
      {
        company: "Company1",
        name: "David Kumar",
        joiningDate: "31-12-2025",
        designation: "Developer",
      },
      {
        company: "Company2",
        name: "Sara Khan",
        joiningDate: "31-12-2025",
        designation: "Recruiter",
      },
    ];

    // Job Form Submissions
    const mockJobForms = [
      { date: "31-12-2025", count: 10 },
      { date: "31-12-2025", count: 15 },
      { date: "31-12-2025", count: 30 },
    ];

    // Contract Employees
    const mockContractEmployees = [
      { company: "Company1", count: 10 },
      { company: "Company2", count: 15 },
      { company: "Company3", count: 30 },
    ];

    // Notifications
    const mockNotifications = [
      {
        message: "Rejoining Sara Khan to AAAAA on 01-12-2025",
        time: "10:45 AM",
      },
      {
        message: "Employee Transferring from BBBBB to AAAAA",
        time: "10:45 AM",
      },
      {
        message: "Rejoining Sarah Khan to AAAAA on 01-12-2025",
        time: "10:45 AM",
      },
      {
        message: "Rejoining Sarah Khan to AAAAA on 01-12-2025",
        time: "10:45 AM",
      },
      {
        message: "Rejoining Sarah Khan to AAAAA on 01-12-2025",
        time: "10:45 AM",
      },
      {
        message: "Rejoining Sarah Khan to AAAAA on 01-12-2025",
        time: "10:45 AM",
      },
      {
        message: "Rejoining Sarah Khan to AAAAA on 01-12-2025",
        time: "10:45 AM",
      },
    ];

    // Today Contract Attendance Missing
    const mockMissingAttendance = [
      { company: "Company1", name: "Raj Patel", status: "Added" },
      { company: "Company2", name: "Emma Lee", status: "No Added" },
    ];

    setContinuousAbsentees(mockAbsentees);
    setEmployeesJoinedToday(mockJoinedToday);
    setJobFormSubmissions(mockJobForms);
    setContractEmployees(mockContractEmployees);
    setNotifications(mockNotifications);
    setTodayContractAttendanceMissing(mockMissingAttendance);
  };

  useEffect(() => {
    loadData();
    const date = new Date().toISOString().split("T")[0];
    setSelectedDate(date);
  }, []);

  const financeRequestDummyData = [
    {
      id: 1,
      date: "2026-01-10",
      employee_name: "Arun Kumar",
      company_name: "PSS Pvt Ltd",
      amount: 12500,
      status: "Pending",
    },
    {
      id: 2,
      date: "2026-01-09",
      employee_name: "Priya Sharma",
      company_name: "PSS Pvt Ltd",
      amount: 8200,
      status: "Approved",
    },
    {
      id: 3,
      date: "2026-01-08",
      employee_name: "Suresh Raj",
      company_name: "PSS Services",
      amount: 4500,
      status: "Waiting",
    },
  ];

  const financeRequestColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "date",
      header: "Date",
      body: (row) => formatToDDMMYYYY(row.date),
    },
    {
      field: "employee_name",
      header: "Employee Name",
      body: (row) => row.employee_name,
    },
    {
      field: "company_name",
      header: "Company Name",
      body: (row) => row.company_name,
    },
    {
      field: "amount",
      header: "Amount",
      body: (row) => `₹ ${row.amount}`,
    },
    {
      field: "status",
      header: "Status",
      body: (row) => {
        let color =
          row.status === "Approved"
            ? "text-green-700 bg-green-100"
            : row.status === "Pending"
              ? "text-yellow-700 bg-yellow-100"
              : "text-blue-700 bg-blue-100";

        return (
          <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  // 1. Continuous Absentees Columns
  const absenteesColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "name",
      header: "Name",
    },
    {
      field: "company",
      header: "Company",
    },
    {
      field: "consecutiveDays",
      header: "Days",
      body: (rowData) => (
        <span className=" px-3 py-1 rounded-full text-xs">
          {rowData.consecutiveDays}
        </span>
      ),
    },
    {
      field: "lastPresentDate",
      header: "Last Present",
    },
  ];

  // 2. Employees Joined Today Columns
  const joinedTodayColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "name",
      header: "Name",
    },
    {
      field: "company",
      header: "Company",
    },
    {
      field: "designation",
      header: "Designation",
    },
    {
      field: "joiningDate",
      header: "Date",
      body: (rowData) => <span>{rowData.joiningDate}</span>,
    },
  ];

  // 3. Today's Missing Attendance Columns
  const missingAttendanceColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "name",
      header: "Name",
    },
    {
      field: "company",
      header: "Company",
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <span
        // className={`px-3 py-1 rounded-full text-xs font-medium ${
        //   rowData.status === 'Added'
        //     ? 'bg-green-100 text-green-700'
        //     : 'bg-red-100 text-red-700'
        // }`}
        >
          {rowData.status}
        </span>
      ),
    },
  ];

  // 4. Job Form Submissions Columns
  const jobFormColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "date",
      header: "Date",
      // body: (row) => formatToDDMMYYYY(row.date),
    },

    {
      field: "count",
      header: "Count",
      // body: (rowData) => (
      //   <div>
      //     <p>{rowData.count}</p>
      //   </div>
      // ),
      body: (rowData) => (
        <button
          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
          onClick={() =>
            navigate(
              `/job-form?from_date=${rowData.date}&to_date=${rowData.date}`,
            )
          }
        >
          {rowData.count}
        </button>
      ),
    },
  ];

  // 5. Contract Employees Columns (for card view, keep as is or convert to table)
  const contractEmployeeColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "company_name",
      header: "Company",
      body: (rowData) => (
        <div className="flex justify-center items-center">
          <p className=" ">{rowData.company_name}</p>
        </div>
      ),
    },
    {
      field: "total_employees",
      header: "Employees",
      // body: (rowData) => (
      //   <div className="">
      //     <p className="">{rowData.total_employees}</p>
      //   </div>
      // ),

      body: (rowData) => (
        <button className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition">
          {rowData.total_employees}
        </button>
      ),
    },
  ];

  // 6. Notifications Columns
  const notificationColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
      style: { width: "80px", textAlign: "center" },
      bodyStyle: { textAlign: "center" },
    },
    {
      field: "message",
      header: "Notification",
      body: (rowData) => (
        <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 bg-[#E0E0E0] rounded-lg flex items-center justify-center mr-3">
              <span className="text-[#7C7C7C]  text-sm">
                {item.company.charAt(0)}
              </span>
              <p className="text-sm text-gray-700 flex-1">{rowData}</p>
            </div>

            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ),
    },
  ];

  const commonColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_rowData, { rowIndex }) => rowIndex + 1,
      style: { width: "10px", textAlign: "center" },
      bodyStyle: { textAlign: "center" },
    },
    {
      field: "employee_name",
      header: "Employee Name",
      body: (rowData) =>
        rowData ? (
          <div
            className="cursor-pointer"
            onClick={() => onClickCard(rowData._id)}
          >
            {rowData.employeeName}
            <br />
            <span className="text-blue-600 text-sm">
              {rowData.roleId?.name}
            </span>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  const loginTimeColumn = {
    field: "login_time",
    header: "Login Time",
    body: (rowData) => {
      if (!rowData?.login) return "-";

      const time = rowData.login.substring(11, 16);
      let [hours, minutes] = time.split(":").map(Number);

      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const formattedTime = `${displayHours}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;

      let colorClass = "";
      if (hours === 10 && minutes >= 5 && minutes < 30) {
        colorClass = "text-yellow-500 font-bold";
      } else if (hours > 10 || (hours === 10 && minutes >= 30)) {
        colorClass = "text-red-500";
      }

      return <p className={colorClass}>{formattedTime}</p>;
    },
  };

  const absentColumns = [...commonColumns];
  const presentWfhColumns = [...commonColumns, loginTimeColumn];

  const [show, setShow] = useState(true);

  const sortByLateLogin = (data = []) => {
    return [...data].sort((a, b) => {
      if (!a.login) return 1;
      if (!b.login) return -1;
      return new Date(b.login) - new Date(a.login); // late first
    });
  };

  // useEffect(() => {
  //   handleSubmit();
  // }, []);

  const today = new Date().toISOString().split("T")[0];
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [dashboardData, setDashboardData] = useState([]);

  console.log("dashboardData", dashboardData);
  // Handle submit
  // const handleSubmit = async () => {
  //   // Ensure both dates are selected
  //   if (!fromDate || !toDate) {
  //     alert("Please select both From and To dates");
  //     return;
  //   }

  //   try {
  //     setLoading(true); // start loader

  //     const res = await axiosInstance.get(`${API_URL}api/dashboard`, {
  //       params: {
  //         start_date: fromDate,
  //         end_date: toDate,
  //       },
  //     });

  //     console.log("API Response:", res.data);

  //     if (res.data.success) {
  //       setDashboardData(res.data || []);
  //     } else {
  //       console.error(res.data.message);
  //       // toast.error(res.data.message || "Failed to fetch status list");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // toast.error("Failed to fetch status list");
  //   } finally {
  //     setLoading(false); // stop loader
  //   }
  // };

  const handleYesterdayFilter = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const formattedDate = yesterday.toISOString().split("T")[0];

  setFromDate(formattedDate);   // update input field
  fetchDashboard(formattedDate); // call API
};

  const handleDateChangedash = (e) => {
    const date = e.target.value;

    setFromDate(date);
    setToDate(date);

    fetchDashboard(date); // ✅ onchange API call
  };

  useEffect(() => {
    const today = getTodayDate();
    setFromDate(today);
    setToDate(today);
    fetchDashboard(today); // ✅ first time API call
  }, []);

  const fetchDashboard = async (date) => {
    if (!date) return;

    try {
      setLoading(true);

      const res = await axiosInstance.get(`${API_URL}api/dashboard`, {
        params: {
          start_date: date,
          end_date: date,
        },
      });

      if (res.data.success) {
        setDashboardData(res.data || []);
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    setFromDate(formattedDate);
    setToDate(formattedDate);

    try {
      setLoading(true);

      const res = await axiosInstance.get(`${API_URL}api/dashboard`, {
        params: {
          start_date: formattedDate,
          end_date: formattedDate,
        },
      });

      console.log("API Response:", res.data);

      if (res.data.success) {
        setDashboardData(res.data || []);
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // work report columns
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [showPopupattendance, setShowPopupattendance] = useState(false);
  const [attendancelist, setAttendancelist] = useState([]);

  // console.log("employeeList", employeeList);

  const openEmployeePopup = (title, list) => {
    setPopupTitle(title);
    setEmployeeList(list || []);
    setShowPopup(true);
  };

  const openAttendance = (title, list) => {
    // console.log("openAttendance called with:", title, list);
    setPopupTitle(title);
    setAttendancelist(list || []);
    setShowPopupattendance(true);
  };

  const workReportColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "date",
      header: "Date",
      body: (rowData) => formatDateTime(rowData.date),
    },
    {
      field: "marked",
      header: "Marked",
      body: (rowData) => (
        <button
          onClick={() =>
            openEmployeePopup("Marked Employees", rowData.updated_employees)
          }
          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
        >
          {rowData.updated_count}
        </button>
      ),
    },
    {
      field: "notMarked",
      header: "Not Marked",
      body: (rowData) => (
        <button
          onClick={() =>
            openEmployeePopup(
              "Not Marked Employees",
              rowData.not_updated_employees,
            )
          }
          className="px-4 py-1.5 rounded-full border border-green-600 text-green-700 text-sm font-semibold hover:bg-green-50 transition"
        >
          {rowData.not_updated_count}
        </button>
      ),
    },
  ];

  // interview candidate reference count columns

  const [showPopupref, setShowPopupref] = useState(false);
  const [popupTitleRef, setPopupTitleRef] = useState("");
  const [employeeListRef, setEmployeeListRef] = useState([]);

  const openEmployeePopupref = (title, list) => {
    setPopupTitleRef(title);
    setEmployeeListRef(list || []);
    setShowPopupref(true);
  };

  const interviewCandidateReferenceCountColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "name",
      header: "Empolyee Name",
      // body: (row) => formatToDDMMYYYY(row.date),
    },
    {
      field: "total",
      header: "Total",
      body: (rowData) => (
        <button
          onClick={() =>
            navigate(
              `/contractcandidates?refer_id=${rowData.emp_id}&startDate=${fromDate}&endDate=${toDate}`,
            )
          }
          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
        >
          {rowData.count}
        </button>
      ),
    },
  ];

  // selected cnatiatete

  const selectedCandidateCountColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "company_name",
      header: "Company Name",
      // body: (row) => formatToDDMMYYYY(row.date),
    },
    {
      field: "total",
      header: "Total",
      body: (rowData) => (
        <button
          onClick={() =>
            window.open(
              `/contractcandidates?company_id=${rowData.company_id}&startDate=${fromDate}&endDate=${toDate}&interview_status=Selected`,
              "_blank",
            )
          }
          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
        >
          {rowData.total_selected}
        </button>
      ),
    },
  ];

  // relving cnatiatete

  const relivingCandidateCountColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "company_name",
      header: "Company Name",
      // body: (row) => formatToDDMMYYYY(row.date),
    },
    {
      field: "total_count",
      header: "Total",
      body: (rowData) => (
        <button
          onClick={() =>
            window.open(
              `/employeecontract?company_id=${rowData.company_id}&status=0&startDate=${fromDate}&endDate=${toDate}`,
              "_blank",
            )
          }
          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
        >
          {rowData.total_count}
        </button>
      ),
    },
  ];

  // future joining cnatiatete

  const [openFutureEmpPopup, setOpenFutureEmpPopup] = useState(false);
  const [futureEmpPopupData, setFutureEmpPopupData] = useState([]);
  console.log("futureEmpPopupData", futureEmpPopupData);
  const [futureEmpPopupTitle, setFutureEmpPopupTitle] = useState("");
  const openFutureEmployeePopup = (title, list) => {
    setFutureEmpPopupTitle(title);
    setFutureEmpPopupData(list || []);
    setOpenFutureEmpPopup(true);
  };
  const closeFutureEmployeePopup = () => {
    setOpenFutureEmpPopup(false);
    setFutureEmpPopupTitle("");
    setFutureEmpPopupData([]);
  };

  const futureJoiningCandidateCountColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "company_name",
      header: "Company Name",
      // body: (row) => formatToDDMMYYYY(row.date),
    },
    {
      field: "total_count",
      header: "Total",
      body: (rowData) => (
        <button
          onClick={() =>
            openFutureEmployeePopup(
              `${rowData.company_name || "Company"} - Future Employees`,
              rowData.candidates,
            )
          }
          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
        >
          {rowData.total_count}
        </button>
      ),
    },
  ];

  // 3 days abent list
  const [openAbsentPopup, setOpenAbsentPopup] = useState(false);
  const [absentPopupTitle, setAbsentPopupTitle] = useState("");
  const [absentPopupData, setAbsentPopupData] = useState([]);

  const openAbsentEmployeePopup = (title, list) => {
    setAbsentPopupTitle(title);
    setAbsentPopupData(list || []);
    setOpenAbsentPopup(true);
  };

  const closeAbsentEmployeePopup = () => {
    setOpenAbsentPopup(false);
    setAbsentPopupTitle("");
    setAbsentPopupData([]);
  };
  const absentlistemployee = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "date",
      header: "Date",
      body: (rowData) => formatDateTime(rowData.date),
    },
    {
      field: "company_name",
      header: "Company Name",
      body: (rowData) => Capitalise(rowData.company_name),
    },
    {
      field: "employee_name",
      header: "Employee Name",
      body: (rowData) => Capitalise(rowData.employee_name),
    },
    // {
    //   field: "absent_count",
    //   header: "Absent Total",
    //   body: (rowData) => (
    //     <button
    //       onClick={() =>
    //         openAbsentEmployeePopup(
    //           `${formatDateTime(rowData.date)} - Absent Employees`,
    //           rowData.absent_list,
    //         )
    //       }
    //       className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
    //     >
    //       {rowData.absent_count}
    //     </button>
    //   ),
    // },
  ];

  // comapny attendace
  const [showCompanyAttendancePopup, setShowCompanyAttendancePopup] =
    useState(false);
  const [companyAttendancePopupTitle, setCompanyAttendancePopupTitle] =
    useState("");
  const [companyAttendancePopupList, setCompanyAttendancePopupList] = useState(
    [],
  );

  const openCompanyAttendancePopup = (title, list) => {
    setCompanyAttendancePopupTitle(title);
    setCompanyAttendancePopupList(list || []);
    setShowCompanyAttendancePopup(true);
  };

  const closeCompanyAttendancePopup = () => {
    setShowCompanyAttendancePopup(false);
    setCompanyAttendancePopupTitle("");
    setCompanyAttendancePopupList([]);
  };

  const companyattendancelist = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "date",
      header: "Date",
      body: (rowData) => formatDateTime(rowData.date),
    },
    {
      field: "marked",
      header: "Marked",
      body: (rowData) => (
        <button
          onClick={() =>
            openCompanyAttendancePopup(
              `${formatDateTime(rowData.date)} - Marked Companies`,
              rowData.marked_list,
            )
          }
          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
        >
          {rowData.marked}
        </button>
      ),
    },
    {
      field: "not_marked",
      header: "Not Marked",
      body: (rowData) => (
        <button
          onClick={() =>
            openCompanyAttendancePopup(
              `${formatDateTime(rowData.date)} - Not Marked Companies`,
              rowData.not_marked_list,
            )
          }
          className="px-4 py-1.5 rounded-full border border-green-600 text-green-700 text-sm font-semibold hover:bg-green-50 transition"
        >
          {rowData.not_marked}
        </button>
      ),
    },
  ];

  // dasboard all counbt

  const workReport = dashboardData?.workreports?.[0] || {};

  const getRowColor = (type) => {
  switch (type) {
    case "red":
      return "bg-red-100 hover:bg-red-200";
    case "orange":
      return "bg-orange-100 hover:bg-orange-200";
    case "yellow":
      return "bg-yellow-100 hover:bg-yellow-200";
    default:
      return "hover:bg-gray-50";
  }
};

  return (
    <div className="w-screen min-h-screen flex flex-col justify-between bg-gray-100 md:px-5 px-3 py-2 md:pt-5 ">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className=" ">
              <Mobile_Sidebar />
            </div>
            <p className="text-xs md:text-sm mt-3  text-end text-[#1ea600]">
              PSS Dashboard
            </p>

            {/* <div className="bg-white rounded-2xl px-2 py-2 md:px-5 md:py-5 flex justify-between mt-1 "> */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <p className="hidden md:block font-semibold">PSS Dashboard</p>

              {topAnnouncement && showTopBanner && (
                <div className="w-full mb-4">
                  <div
                    className="
                      relative flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center
                      bg-gradient-to-r from-green-600 to-emerald-500
                      text-white px-4 md:px-6 py-3 md:py-4
                      rounded-xl shadow-lg
                    "
                  >
                    {/* Left Icon */}
                    <div className="hidden md:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <FaEye className="text-white text-lg" />
                    </div>

                    {/* Message */}
                    <div className="flex-1">
                      <p className="text-sm md:text-base font-semibold">
                        📢 Latest Announcement
                      </p>

                      <div
                        className="text-xs md:text-sm mt-1 text-white/90 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: topAnnouncement?.announcement_details,
                        }}
                      />
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => openViewModal(topAnnouncement)}
                      className="
                        text-xs md:text-sm font-medium
                        bg-white/20 hover:bg-white/30
                        px-3 py-1.5 rounded-md transition
                      "
                    >
                      View
                    </button>

                    {/* Close */}
                    <button
                      onClick={() => setShowTopBanner(false)}
                      className="absolute top-2 right-2 text-white/80 hover:text-white"
                    >
                      <IoIosCloseCircle size={22} />
                    </button>
                  </div>
                </div>
              )}

              {/* <div className="flex flex-col sm:flex-row md:flex-row gap-4 p-3 rounded-lg items-end w-full md:w-auto">
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium mb-1">
                   Select Date
                  </label>
                  <input
                    type="date"
                    className="border p-2 rounded-lg w-full sm:w-[180px]"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

               

                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="border p-2 rounded-lg w-full sm:w-[180px]"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleSubmit}
                    className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto"
                  >
                    Reset
                  </button>
                </div>
              </div> */}

              <div className="flex flex-col sm:flex-row md:flex-row gap-4 p-3 rounded-lg items-end w-full md:w-auto">
             
              
  {/* Yesterday Button */}
  <button
    onClick={handleYesterdayFilter}
    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
  >
    Yesterday
  </button>
             
                {/* Single Date */}
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium mb-1">
                    Select Date
                  </label>

                  <input
                    type="date"
                    className="border p-2 rounded-lg w-full sm:w-[180px]"
                    value={fromDate}
                    onChange={handleDateChangedash}
                  />
                </div>

                {/* Reset Button only */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleReset}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* new dasboard desgin */}

            <div className="bg-white rounded-2xl shadow-sm border p-4 mt-4">
              <h2 className="text-lg font-semibold mb-4">
                Work Report Summary
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Present */}
                <div className="p-4 rounded-2xl border bg-green-50 hover:shadow-md transition">
                  <p className="text-sm text-gray-600">Present</p>
                  <h3
                    className="text-2xl font-bold text-green-700 mt-3 cursor-pointer"
                    onClick={() =>
                      openAttendance(
                        "Present Employees",
                        dashboardData?.summary?.present_employee_list || [],
                      )
                    }
                  >
                    {dashboardData?.summary?.present || 0}
                  </h3>
                </div>

                {/* Absent */}
                <div className="p-4 rounded-2xl border bg-red-50 hover:shadow-md transition">
                  <p className="text-sm text-gray-600">Absent</p>
                  <h3
                    className="text-2xl font-bold text-red-700 mt-3 cursor-pointer"
                    onClick={() =>
                      openAttendance(
                        "Absent Employees",
                        dashboardData?.summary?.absent_employee_list || [],
                      )
                    }
                  >
                    {dashboardData?.summary?.absent || 0}
                  </h3>
                </div>

                {/* Marked */}
                <div className="p-4 rounded-2xl border bg-blue-50 hover:shadow-md transition">
                  <p className="text-sm text-gray-600">Work Report Submitted</p>

                  <div className="mt-3">
                    <button
                      onClick={() =>
                        openEmployeePopup(
                          "Marked Employees",
                          workReport.updated_employees || [],
                        )
                      }
                      className="text-2xl font-bold text-blue-700 mt-1"
                    >
                      {workReport.updated_count || 0}
                    </button>
                  </div>
                </div>

                {/* Not Marked */}
                <div className="p-4 rounded-2xl border bg-yellow-50 hover:shadow-md transition">
                  <p className="text-sm text-gray-600">Work Report Not Submitted</p>

                  <div className="mt-3">
                    <button
                      onClick={() =>
                        openEmployeePopup(
                          "Not Marked Employees",
                          workReport.not_updated_employees || [],
                        )
                      }
                      className="text-2xl font-bold text-yellow-700 mt-1"
                    >
                      {workReport.not_updated_count || 0}
                    </button>
                  </div>
                </div>


              </div>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                Company Attendance Summary
              </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            
                {dashboardData?.attendance_summary?.map((item, index) => (
                  <>
                    {/* Marked */}
                    <div key={index}
                      className="p-4 rounded-2xl border bg-blue-50 cursor-pointer hover:shadow-md transition"
                      onClick={() =>
                        openCompanyAttendancePopup(
                          `${formatDateTime(item.date)} - Marked Companies`,
                          item.marked_list,
                        )
                      }
                    >
                      <p className="text-sm text-gray-600">Marked</p>
                      <h3 className="text-2xl font-bold text-blue-700 mt-3">
                        {item.marked}
                      </h3>
                    </div>

                    {/* Not Marked */}
                    <div
                      className="p-4 rounded-2xl border bg-yellow-200 cursor-pointer hover:shadow-md transition"
                      onClick={() =>
                        openCompanyAttendancePopup(
                          `${formatDateTime(item.date)} - Not Marked Companies`,
                          item.not_marked_list,
                        )
                      }
                    >
                      <p className="text-sm text-gray-700">Not Marked</p>
                      <h3 className="text-2xl font-bold text-yellow-800 mt-3">
                        {item.not_marked}
                      </h3>
                    </div>

                                     {/* Total attendance */}
                <div className="p-4 rounded-2xl border bg-red-50 hover:shadow-md transition">
                  <p className="text-sm text-gray-600">Total Attendance</p>
                  <h3
                    className="text-2xl font-bold text-red-700 mt-3 cursor-pointer"
                    onClick={() =>
                      openAttendance(
                        "All Employees",
                        [
          ...(dashboardData?.summary?.present_employee_list || []),
          ...(dashboardData?.summary?.absent_employee_list || [])
        ]
                      )
                    }
                  >
                    
                    {dashboardData?.total_attendance ||" 0/0"}
                  </h3>
                </div>

                  </>
                ))}
              </div>
            </div>

            {/* dashboard  */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4">

{/* company attendance summary */}


<div className="bg-white rounded-xl shadow-md border p-4 md:p-5 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold text-gray-800">
      Company Attendance Summary
    </h2>

    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
      {dashboardData?.company_wise_summary?.length || 0}
    </span>
  </div>

  <div className="space-y-4 h-[320px] overflow-auto pr-1">
    {(dashboardData?.company_wise_summary || []).map((rowData, index) => (
      <div
        key={index}
        className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200"
      >


        {/* LEFT - Company Name */}
        <div className="min-w-0 ">
          <p 
          className="text-sm font-semibold text-green-700 cursor-pointer hover:underline truncate"
          title={rowData.company_name}
          >
            {rowData.company_name}
          </p>
        </div>

        {/* CENTER - Present / Total */}
        <div className="flex-shrink-0">
          <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
            {rowData.present_employees}/{rowData.total_employees}
          </span>
        </div>

        {/* RIGHT - Absent */}
        <div className="flex-shrink-0">
          <span
            onClick={() =>
              openAbsentEmployeePopup(
                `${rowData.company_name} - Absent Employees`,
                rowData.absentees
              )
            }
            className="px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold cursor-pointer hover:bg-red-700 hover:text-white transition"
          >
             {rowData.absent_employees}
          </span>
        </div>
      </div>
    ))}

    {(dashboardData?.company_attendance || []).length === 0 && (
      <p className="text-sm text-gray-500 text-center py-10">
        No attendance data found.
      </p>
    )}
  </div>
</div>

              {/* Job Form Submissions */}

              <div className="bg-white rounded-xl shadow-md border p-4 md:p-5 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    Job Form Submissions
                  </h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                    {dashboardData?.jobformsubmission?.length || 0}
                  </span>
                </div>

                <div className="space-y-3 h-[320px] overflow-auto pr-1">
                  {(dashboardData?.jobformsubmission || []).map(
                    (rowData, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        {/* LEFT */}
                        <div className="min-w-0 ">
                          {/* <p className="text-xs text-gray-500">#{index + 1}</p> */}

                          <p
                            className="text-sm font-semibold text-green-700 cursor-pointer hover:underline truncate "
                            onClick={() =>
                              navigate(
                                `/job-form?from_date=${rowData.date}&to_date=${rowData.date}`,
                              )
                            }
                            title={rowData.date}
                          >
                            {rowData.date}
                          </p>

                          {/* <p className="text-xs text-gray-500 truncate">
              Company ID: {rowData.company_id}
            </p> */}
                        </div>

                        {/* RIGHT COUNT */}
                        <div className="flex-shrink-0">
                          <span
                            className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/job-form?from_date=${rowData.date}&to_date=${rowData.date}`,
                              )
                            }
                          >
                            {rowData.count || 0}
                          </span>
                        </div>
                      </div>
                    ),
                  )}

                  {(dashboardData?.jobformsubmission || []).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-10">
                      No interview candidates found.
                    </p>
                  )}
                </div>
              </div>

              {/* interview refernce candiate status */}
              <div className="bg-white rounded-xl shadow-md border p-4 md:p-5 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    Candidate Referrals
                  </h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                    {dashboardData?.interview_candidate_reference?.length || 0}
                  </span>
                </div>

                <div className="space-y-3 h-[320px] overflow-auto pr-1">
                  {(dashboardData?.interview_candidate_reference || []).map(
                    (rowData, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        {/* LEFT */}
                        <div className="min-w-0 ">
                          {/* <p className="text-xs text-gray-500">#{index + 1}</p> */}

                          <p
                            className="text-sm font-semibold text-green-700 cursor-pointer hover:underline truncate "
                            onClick={() =>
                              navigate(
                                `/contractcandidates?refer_id=${rowData.emp_id}&startDate=${fromDate}&endDate=${toDate}`,
                              )
                            }
                            title={rowData.name}
                          >
                            {rowData.name}
                          </p>

                          {/* <p className="text-xs text-gray-500 truncate">
              Company ID: {rowData.company_id}
            </p> */}
                        </div>

                        {/* RIGHT COUNT */}
                        <div className="flex-shrink-0">
                          <span
                            className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/contractcandidates?refer_id=${rowData.emp_id}&startDate=${fromDate}&endDate=${toDate}`,
                              )
                            }
                          >
                            {rowData.count || 0}
                          </span>
                        </div>
                      </div>
                    ),
                  )}

                  {(dashboardData?.interview_candidate_reference || [])
                    .length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-10">
                      No interview candidates found.
                    </p>
                  )}
                </div>
              </div>

              {/* interview cantidacte */}

              <div className="bg-white rounded-xl shadow-md border p-4 md:p-5 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    Interview Candidates
                  </h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                    {dashboardData?.interview_candidate?.length || 0}
                  </span>
                </div>

                <div className="space-y-3 h-[320px] overflow-auto pr-1">
                  {(dashboardData?.interview_candidate || []).map(
                    (rowData, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        {/* LEFT */}
                        <div className="min-w-0">
                          {/* <p className="text-xs text-gray-500">#{index + 1}</p> */}

                          <p
                            className="text-sm font-semibold text-green-700 cursor-pointer hover:underline truncate"
                            onClick={() =>
                              navigate(
                                `/contractcandidates?company_id=${rowData.company_id}&startDate=${fromDate}&endDate=${toDate}`,
                              )
                            }
                            title={rowData.company_name}
                          >
                            {rowData.company_name}
                          </p>

                          {/* <p className="text-xs text-gray-500 truncate">
              Company ID: {rowData.company_id}
            </p> */}
                        </div>

                        {/* RIGHT COUNT */}
                        <div className="flex-shrink-0">
                          <span
                            className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold"
                            onClick={() =>
                              navigate(
                                `/contractcandidates?company_id=${rowData.company_id}&startDate=${fromDate}&endDate=${toDate}`,
                              )
                            }
                          >
                            {rowData.count || 0}
                          </span>
                        </div>
                      </div>
                    ),
                  )}

                  {(dashboardData?.interview_candidate || []).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-10">
                      No interview candidates found.
                    </p>
                  )}
                </div>
              </div>

              {/* selected candidates */}

              <div className="bg-white rounded-xl shadow-md border p-4 md:p-5 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    Selected Candidates
                  </h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                    {dashboardData?.selected_company_wise?.length || 0}
                  </span>
                </div>

                <div className="space-y-3 h-[320px] overflow-auto pr-1">
                  {(dashboardData?.selected_company_wise || []).map(
                    (rowData, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        {/* LEFT */}
                        <div className="min-w-0 ">
                          {/* <p className="text-xs text-gray-500">#{index + 1}</p> */}

                          <p
                            className="text-sm font-semibold text-green-700 cursor-pointer hover:underline truncate "
                            onClick={() =>
                              window.open(
                                `/contractcandidates?company_id=${rowData.company_id}&startDate=${fromDate}&endDate=${toDate}&interview_status=Selected`,
                                "_blank",
                              )
                            }
                            title={rowData.company_name}
                          >
                            {rowData.company_name}
                          </p>

                          {/* <p className="text-xs text-gray-500 truncate">
              Company ID: {rowData.company_id}
            </p> */}
                        </div>

                        {/* RIGHT COUNT */}
                        <div className="flex-shrink-0">
                          <span
                            className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold cursor-pointer"
                            onClick={() =>
                              window.open(
                                `/contractcandidates?company_id=${rowData.company_id}&startDate=${fromDate}&endDate=${toDate}&interview_status=Selected`,
                                "_blank",
                              )
                            }
                          >
                            {rowData.total_selected || 0}
                          </span>
                        </div>
                      </div>
                    ),
                  )}

                  {(dashboardData?.selected_company_wise || []).length ===
                    0 && (
                    <p className="text-sm text-gray-500 text-center py-10">
                      No interview candidates found.
                    </p>
                  )}
                </div>
              </div>

           

              {/* releving wise date */}
              {/* <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Releving wise Details
                  </h2>
                
                </div>
                <div className="h-[300px] overflow-auto">
                  <DataTable
                    value={dashboardData?.company_wise_reliving}
                    showGridlines
                    responsiveLayout="scroll"
                    className="dashboard-table"
                    emptyMessage="No submissions found."
                  >
                    {relivingCandidateCountColumns.map((col, index) => (
                      <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                      />
                    ))}
                  </DataTable>
                </div>
              </div> */}

              {/* future employee */}


                 <div className="bg-white rounded-xl shadow-md border p-4 md:p-5 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    Upcoming Employees
                  </h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                    {dashboardData?.selected_joining_future?.length || 0}
                  </span>
                </div>

                <div className="space-y-3 h-[320px] overflow-auto pr-1">
                  {(dashboardData?.selected_joining_future || []).map(
                    (rowData, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        {/* LEFT */}
                        <div className="min-w-0 ">
                          {/* <p className="text-xs text-gray-500">#{index + 1}</p> */}

                          <p
                            className="text-sm font-semibold text-green-700 cursor-pointer hover:underline truncate "
                          onClick={() =>
            openFutureEmployeePopup(
              `${rowData.company_name || "Company"} - Future Employees`,
              rowData.candidates,
            )
          }
                            title={rowData.company_name}
                          >
                            {rowData.company_name}
                          </p>

                          {/* <p className="text-xs text-gray-500 truncate">
              Company ID: {rowData.company_id}
            </p> */}
                        </div>

                        {/* RIGHT COUNT */}
                        <div className="flex-shrink-0">
                          <span
                            className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold cursor-pointer"
                          onClick={() =>
            openFutureEmployeePopup(
              `${rowData.company_name || "Company"} - Future Employees`,
              rowData.candidates,
            )
          }
                          >
                            {rowData?.total_count || 0}
                          </span>
                        </div>
                      </div>
                    ),
                  )}

                  {(dashboardData?.selected_joining_future || []).length ===
                    0 && (
                    <p className="text-sm text-gray-500 text-center py-10">
                      No interview candidates found.
                    </p>
                  )}
                </div>
              </div>

         

              {/* absent list */}


                   {/* <div className="bg-white rounded-xl shadow-md border p-4 md:p-5 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    Absent Employees
                  </h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                    {dashboardData?.absent_list?.length || 0}
                  </span>
                </div>

 <div className="space-y-3 h-[320px] overflow-auto pr-1">
  {(dashboardData?.absent_list || []).map((rowData, index) => (
    <div
      key={index}
      className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 "
    >
     
      <div className="w-1 h-full bg-red-400 rounded-l-xl"></div>


      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
        <p className="text-sm font-medium text-red-600">
          {formatDateTime(rowData.date)}
        </p>

        <p className="text-sm font-semibold text-gray-700">
          {Capitalise(rowData.company_name)}
        </p>

        <p className="text-sm font-semibold text-gray-900">
          {Capitalise(rowData.employee_name)}
        </p>
      </div>
    </div>
  ))}

  {(dashboardData?.absent_list || []).length === 0 && (
    <p className="text-sm text-gray-500 text-center py-10">
      No interview candidates found.
    </p>
  )}
</div>


              </div> */}


         
            </div>

            {/* work repoet popup */}

            {showPopup && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4"
                onClick={() => setShowPopup(false)}
              >
                <div
                  className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between bg-green-700 px-4 sm:px-5 py-3 sm:py-4">
                    <h2 className="text-white text-base sm:text-lg font-bold">
                      {popupTitle}
                    </h2>

 <div className="flex items-center gap-3">

    {/* Excel Button */}
    <button
      onClick={() => exportToCSV(employeeList, "Work_Report", popupTitle)}
      className="px-3 py-1 rounded bg-white text-green-700 text-sm font-semibold hover:bg-gray-100 transition"
    >
      Excel
    </button>

    {/* PDF Button */}
    <button
      onClick={() => exportToPDF(employeeList, "Work_Report", popupTitle)}
      className="px-3 py-1 rounded bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition"
    >
      PDF
    </button>

                    <button
                      onClick={() => setShowPopup(false)}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                      ✕
                    </button>
                  </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 sm:p-5 max-h-[70vh] overflow-y-auto">
                    {employeeList.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-green-50 text-green-900">
                              <th className="px-4 py-3 text-center w-[70px]">
                                S.No
                              </th>
                              <th className="px-4 py-3 text-center">
                                Employee Name
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {employeeList.map((emp, index) => (
                              <tr
                                key={index}
                                className="border-t hover:bg-gray-50 transition"
                              >
                                <td className="px-4 py-3 text-center">
                                  {index + 1}
                                </td>

                                <td className="px-4 py-3 font-semibold text-gray-800 text-center ">
                                  {emp.employee_name}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500 font-medium">
                          No Employees Found
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 border-t bg-white px-4 sm:px-5 py-3 sm:py-4">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* attendance popuop */}

            {showPopupattendance && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4"
                onClick={() => setShowPopupattendance(false)}
              >
                <div
                  className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between bg-green-700 px-4 sm:px-5 py-3 sm:py-4">
                    <h2 className="text-white text-base sm:text-lg font-bold">
                      {popupTitle}
                    </h2>

 <div className="flex items-center gap-3">

    {/* Excel Button */}
    <button
      onClick={() => exportToCSV(attendancelist, "Present_Employees")}
      className="px-3 py-1 rounded bg-white text-green-700 text-sm font-semibold hover:bg-gray-100 transition"
    >
      Excel
    </button>

    {/* PDF Button */}
    <button
      onClick={() => exportToPDF(attendancelist, "Present_Employees", popupTitle)}
      className="px-3 py-1 rounded bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition"
    >
      PDF
    </button>
                    <button
                      onClick={() => setShowPopupattendance(false)}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                      ✕
                    </button>
                  </div>
</div>

                  {/* Body */}
                  <div className="p-3 sm:p-5 max-h-[70vh] overflow-y-auto">
                    {attendancelist.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-green-50 text-green-900">
                              <th className="px-4 py-3 text-center w-[70px]">
                                S.No
                              </th>
                              <th className="px-4 py-3 text-center">
                                Employee Name
                              </th>
                              <th className="px-4 py-3 text-center">
                                Employee ID
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {attendancelist.map((emp, index) => (
                              <tr
                                key={index}
                                className="border-t hover:bg-gray-50 transition"
                              >
                                <td className="px-4 py-3 text-center">
                                  {index + 1}
                                </td>

                                <td className="px-4 py-3 font-semibold text-gray-800 text-center ">
                                  {emp.full_name}
                                </td>
                                <td className="px-4 py-3 font-semibold text-gray-800 text-center">
                                  {emp.gen_employee_id}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500 font-medium">
                          No Employees Found
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 border-t bg-white px-4 sm:px-5 py-3 sm:py-4">
                    <button
                      onClick={() => setShowPopupattendance(false)}
                      className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* interview refernec */}
            {showPopupref && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4"
                onClick={() => setShowPopupref(false)}
              >
                <div
                  className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between bg-green-700 px-4 sm:px-5 py-3 sm:py-4">
                    <h2 className="text-white text-base sm:text-lg font-bold">
                      {popupTitleRef}
                    </h2>

                    <button
                      onClick={() => setShowPopupref(false)}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-3 sm:p-5 max-h-[70vh] overflow-y-auto">
                    {employeeListRef.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-green-50 text-green-900">
                              <th className="px-4 py-3 text-center w-[70px]">
                                S.No
                              </th>
                              <th className="px-4 py-3 text-center">Name</th>
                              <th className="px-4 py-3 text-center w-[170px]">
                                Gen Employee ID
                              </th>
                              <th className="px-4 py-3 text-center w-[120px]">
                                Type
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {employeeListRef.map((emp, index) => (
                              <tr
                                key={index}
                                className="border-t hover:bg-gray-50 transition"
                              >
                                <td className="px-4 py-3 text-center">
                                  {index + 1}
                                </td>

                                <td className="px-4 py-3 font-semibold text-gray-800 text-center ">
                                  {emp.fullname || emp.reference || "-"}
                                </td>

                                <td className="px-4 py-3 text-center text-gray-700">
                                  {emp.gen_employee_id || "-"}
                                </td>

                                <td className="px-4 py-3 text-center">
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                    {emp.type}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500 font-medium">
                          No References Found
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 border-t bg-white px-4 sm:px-5 py-3 sm:py-4">
                    <button
                      onClick={() => setShowPopupref(false)}
                      className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* future employees */}

            {openFutureEmpPopup && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4"
                onClick={closeFutureEmployeePopup} // ✅ outside click close
              >
                <div
                  className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()} // ✅ inside click stop
                >
                  {/* Header */}
                  <div className="flex items-center justify-between bg-green-700 px-4 sm:px-6 py-3 sm:py-4">
                    <h2 className="text-white text-base sm:text-lg font-bold">
                      {futureEmpPopupTitle}
                    </h2>

  <div className="flex items-center gap-3">

    {/* Excel Button */}
    <button
      onClick={() => exportToCSV(futureEmpPopupData, "Future_Employees")}
      className="px-3 py-1 rounded bg-white text-green-700 text-sm font-semibold hover:bg-gray-100 transition"
    >
      Excel
    </button>

    {/* PDF Button */}
    <button
      onClick={() => exportToPDF(futureEmpPopupData, "Future_Employees", futureEmpPopupTitle)}
      className="px-3 py-1 rounded bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition"
    >
      PDF
    </button>
                    <button
                      onClick={closeFutureEmployeePopup}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                      ✕
                    </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 sm:p-5 max-h-[70vh] overflow-y-auto">
                    {futureEmpPopupData?.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-green-50 text-green-900">
                              <th className="px-4 py-3 text-center w-[70px]">
                                S.No
                              </th>
                              <th className="px-4 py-3 text-center">
                                Employee Name
                              </th>
                              <th className="px-4 py-3 text-center">
                                Joining Date
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {futureEmpPopupData.map((emp, index) => (
                              <tr
                                key={index}
                                className="border-t hover:bg-gray-50 transition"
                              >
                                <td className="px-4 py-3 text-center">
                                  {index + 1}
                                </td>

                                <td className="px-4 py-3 font-semibold text-gray-800 text-center">
                                  {emp?.name || "-"}
                                </td>

                                <td className="px-4 py-3 text-gray-700 text-center">
                                  {formatDateTime(emp?.joining_date || "-")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500 font-medium">
                          No Employees Found
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 border-t bg-white px-4 sm:px-6 py-3 sm:py-4">
                    <button
                      onClick={closeFutureEmployeePopup}
                      className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* absent popup */}

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
              // Format data for Excel - only required fields
              const formattedData = absentPopupData.map((emp, index) => ({
                "S.No": index + 1,
                "Employee Name": emp?.employee_name || "-",
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
                emp?.employee_name || "-",
                emp?.employee_id || "-",
                emp?.absent_dates?.join(", ") || "-",
                emp?.continuous_days || "N/A"
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
                              <th className="px-4 py-3 text-center w-[70px]">
                                S.No
                              </th>
                              <th className="px-4 py-3 text-center">
                                Employee Id
                              </th>
                              <th className="px-4 py-3 text-center">
                                Employee Name
                              </th>
                              {/* <th className="px-4 py-3 text-center">
                                Company Name
                              </th> */}
                              <th className="px-4 py-3 text-center">
                                Continous Absent Days
                              </th>
                              
                            </tr>
                          </thead>

                          <tbody>
                            {absentPopupData.map((emp, index) => (
                              <tr
                                key={index}
                                className={`border-t hover:bg-gray-50 transition ${getRowColor(emp?.type)}`}
                              >
                                <td className="px-4 py-3 text-center">
                                  {index + 1}
                                </td>

                                <td className="px-4 py-3 text-center font-semibold text-gray-800">
                                  {emp?.employee_id || "-"}
                                </td>

                                <td className="px-4 py-3 text-center text-gray-800">
                                  {emp?.employee_name || "-"}
                                </td>

                                {/* <td className="px-4 py-3 text-center text-gray-700">
                                  {emp?.company_name || "N/A"}
                                </td> */}
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
                        <p className="text-gray-500 font-medium">
                          No Absent Employees
                        </p>
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

            {/* comapny attendoace */}

            {showCompanyAttendancePopup && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4"
                onClick={closeCompanyAttendancePopup}
              >
                <div
                  className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between bg-green-700 px-4 sm:px-6 py-3 sm:py-4">
                    <h2 className="text-white text-base sm:text-lg font-bold">
                      {companyAttendancePopupTitle}
                    </h2>

  <div className="flex items-center gap-3">

    {/* Excel Button */}
    <button
      onClick={() => exportToCSV(companyAttendancePopupList, "Company_Attendance")}
      className="px-3 py-1 rounded bg-white text-green-700 text-sm font-semibold hover:bg-gray-100 transition"
    >
      CSV
    </button>

   
    {/* PDF Button */}
    <button
      onClick={() => exportToPDF(companyAttendancePopupList, "Company_Attendance", companyAttendancePopupTitle)}
      className="px-3 py-1 rounded bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition"
    >
      PDF
    </button>

                    <button
                      onClick={closeCompanyAttendancePopup}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                      ✕
                    </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 sm:p-5 max-h-[70vh] overflow-y-auto">
                    {companyAttendancePopupList?.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-green-50 text-green-900">
                              <th className="px-4 py-3 text-center w-[70px]">
                                S.No
                              </th>
                              <th className="px-4 py-3 text-center">
                                Company Name
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {companyAttendancePopupList.map((item, index) => (
                              <tr
                                key={index}
                                className="border-t hover:bg-gray-50 transition"
                              >
                                <td className="px-4 py-3 text-center">
                                  {index + 1}
                                </td>

                                <td className="px-4 py-3 font-semibold text-gray-800 text-center">
                                  {item?.company_name || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500 font-medium">
                          No Data Found
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 border-t bg-white px-4 sm:px-6 py-3 sm:py-4">
                    <button
                      onClick={closeCompanyAttendancePopup}
                      className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Dashboard_Mainbar;
