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
import "../dashboard components/calendar_style.css";
import { Line, Circle } from "rc-progress";
import Footer from "../Footer";
import { MdLogout } from "react-icons/md";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { format } from "date-fns";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Loader from "../Loader";
import Clock from "../dashboard components/Clock";
import { formatToDDMMYYYY, formatToYYYYMMDD } from "../../Utils/dateformat";
import DateFilterDropdown from "../dashboard components/DateFilterDropdown";
import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig";
import { set } from "zod";


const Contract_Report_Detail = () => {
    let navigate = useNavigate();

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
    const [announcements, setAnnouncements] = useState([]);

    // console.log("announcements", announcements)
    // console.log("interns", interns);


    const [continuousAbsentees, setContinuousAbsentees] = useState([]);
    const [employeesJoinedToday, setEmployeesJoinedToday] = useState([]);
    const [jobFormSubmissions, setJobFormSubmissions] = useState([]);
    const [contractEmployees, setContractEmployees] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [todayContractAttendanceMissing, setTodayContractAttendanceMissing] = useState([]);

    const [dateFilter, setDateFilter] = useState("Today");

    const staticInterviewCandidates = [
        { company_name: "ARYU", total_employees: 10 },
        { company_name: "Infosys", total_employees: 8 },
        { company_name: "Wipro", total_employees: 3 },
    ];

    const staticCandidateJoining = [
        { company: "ARYU", reference: "Ramesh", count: 5 },
        { company: "Infosys", reference: "Suresh", count: 4 },
        { company: "Wipro", reference: "Arjun", count: 1 },
    ];

    const staticCandidateRelieved = [
        { company: "ARYU", count: 1 },
        { company: "Infosys", count: 2 },
        { company: "Wipro", count: 1 },
    ];


    const handleDateChange = (value) => {
        setDateFilter(value);

        const { from_date, to_date } = getDateRange(value);

        // API call
        fetchDashboardData(from_date, to_date);
    };
    const loadData = () => {

        //  API call

        // Continuous Absentees
        const mockAbsentees = [
            { company: "Company1", name: "Raj Patel", consecutiveDays: 1, lastPresentDate: "25-12-2025" },
            { company: "Company2", name: "Emma Lee", consecutiveDays: 3, lastPresentDate: "27-12-2025" }
        ];

        // Employees Joined Today
        const mockJoinedToday = [
            { company: "Company1", name: "David Kumar", joiningDate: "31-12-2025", designation: "Developer" },
            { company: "Company2", name: "Sara Khan", joiningDate: "31-12-2025", designation: "Recruiter" }
        ];

        // Job Form Submissions
        const mockJobForms = [
            { date: "31-12-2025", count: 10 },
            { date: "31-12-2025", count: 15 },
            { date: "31-12-2025", count: 30 }
        ];

        // Contract Employees
        const mockContractEmployees = [
            { company: "Company1", count: 10 },
            { company: "Company2", count: 15 },
            { company: "Company3", count: 30 }
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
            { company: "Company2", name: "Emma Lee", status: "No Added" }
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
        handleSubmit();
    }, []);


    // 4. Job Form Submissions Columns
    const candidateColumns = [
        {
            field: "sno",
            header: "S.No",
            body: (_, { rowIndex }) => rowIndex + 1,
        },
        {
            field: "company_name",
            header: "Company",
            body: (rowData) => (
                <div >
                    <p >{rowData.company_name || "-"}</p>

                </div>
            ),
        },
        {
            field: "reference_name",
            header: "Reference Name",
            body: (rowData) => (
                <div >
                    <p >{rowData.reference_name || "-"}</p>

                </div>
            ),
        },
        {
            field: "count",
            header: "Count",
        },
    ];


    const relievedColumns = [
        {
            field: "sno",
            header: "S.No",
            body: (_, { rowIndex }) => rowIndex + 1,

        },
        {
            field: "company_name",
            header: "Company",
            body: (rowData) => (
                <div >
                    <p >{rowData.company_name || "-"}</p>

                </div>
            ),

        },
        {
            field: "count",
            header: "Count",
            body: (rowData) => (
                <div >
                    <p >{rowData.count}</p>

                </div>
            ),

        }
    ];

    // 5. Contract Employees Columns (for card view, keep as is or convert to table)
    const interviewColumns = [
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
            field: "count",
            header: "Count",
            body: (rowData) => (
                <div className="">
                    <p className="">{rowData.count}</p>

                </div>
            ),

        }
    ];

    // 6. Notifications Columns
    const notificationColumns = [
        {
            field: "sno",
            header: "S.No",
            body: (_, { rowIndex }) => rowIndex + 1,
            style: { width: "80px", textAlign: "center" },
            bodyStyle: { textAlign: "center" }
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
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            )
        }
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
    //     handleSubmit();
    // }, []);

    const today = new Date().toISOString().split("T")[0];

    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    const [fromResetDate, setFromResetDate] = useState("");
    const [toResetDate, setToResetDate] = useState("");

    const [dashboardData, setDashboardData] = useState([]);

    console.log("dashboardData", dashboardData);
    // Handle submit
    const handleSubmit = async () => {
        // Ensure both dates are selected
        if (!fromDate || !toDate) {
            alert("Please select both From and To dates");
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
    alert("From Date cannot be greater than To Date");
    return;
  }

        try {
            setLoading(true); // start loader

            const res = await axiosInstance.get(
                `${API_URL}api/contract-dashboard`,
                {
                    params: {
                        start_date: fromDate,
                        end_date: toDate
                    }
                },

            );

            console.log("API Response:", res.data);

            if (res.data.success) {
                setDashboardData(res.data.data || []);
            } else {
                console.error(res.data.message);
                // toast.error(res.data.message || "Failed to fetch status list");
            }
        } catch (error) {
            console.error(error);
            // toast.error("Failed to fetch status list");
        } finally {
            setLoading(false); // stop loader
        }
    };


    // Handle reset
    // const handleReset = async () => {
    //     const today = new Date();
    //     const formattedDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    //     setFromDate("");
    //     setToDate("");

    //     try {
    //         setLoading(true);

    //         const res = await axiosInstance.get(`${API_URL}api/contract-dashboard`, {
    //             params: {
    //                 start_date: formattedDate,
    //                 end_date: formattedDate,
    //             },
    //         });

    //         console.log("API Response:", res.data);

    //         if (res.data.success) {
    //             setDashboardData(res.data.data || []);
    //         } else {
    //             console.error(res.data.message);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleReset = () => {
setFromDate(fromResetDate);
setToDate(toResetDate);
    }


    return (
        <div className="w-screen min-h-screen flex flex-col justify-between bg-gray-100 md:px-5 px-3 py-2 md:pt-5 ">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        <div className=" ">
                            <Mobile_Sidebar />

                            <div className="flex gap-2 items-center cursor-pointer">
                                <p
                                    className="text-sm md:text-md text-gray-500  cursor-pointer"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Dashboard
                                </p>
                                <p>{">"}</p>

                                <p className="text-sm  md:text-md  text-[#1ea600]">Contract</p>
                            </div>
                        </div>


                        {/* <div className="bg-white rounded-2xl px-2 py-2 md:px-5 md:py-5 flex justify-between mt-1 "> */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <p className="hidden md:block font-semibold">Dashboard</p>

                            {/* <div className="font-medium text-sm lg:text-base text-center lg:text-left mt-2 rounded-lg  focus:outline-none focus:ring-2 focus:ring-[#1ea600]"> */}
                            {/* <span>{day}, </span>
                <span>{date} </span>
                <span>{month} </span>
                <span className="inline-block  text-center">
                  {hours}:{minutes}:{seconds} {amPm}
                </span> */}
                            {/* <Clock/> */}
                            {/* <DateFilterDropdown
        value={dateFilter}
        onChange={handleDateChange}
      
      /> */}
                            {/* </div> */}
                            <div className="flex flex-col sm:flex-row md:flex-row gap-4  items-end p-3 rounded-lg w-full md:w-auto">
                                <div className="w-full sm:w-auto">
                                    <label className="block text-sm font-medium mb-1">From Date</label>
                                    <input
                                        type="date"
                                        className="border p-2 rounded-lg w-full sm:w-[180px]"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>

                                <div className="w-full md:w-auto">
                                    <label className="block text-sm font-medium mb-1">To Date</label>
                                    <input
                                        type="date"
                                        className="border p-2 rounded-lg w-full md:w-[180px]"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 py-2 rounded-lg  transition w-full sm:w-auto"
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
                            </div>
                        </div>
                        {/* dashboard  */}
                        <div className="grid grid-cols-1 lg:grid-cols-2  gap-4 md:gap-6 mt-4  dashboard-tables">

                            {/* interview candidate */}
                            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Interview Candidate
                                    </h2>

                                </div>
                                <div className="h-[300px] overflow-auto">
                                    <DataTable
                                        value={dashboardData?.interviews}

                                        showGridlines
                                        responsiveLayout="scroll"
                                        className="dashboard-table"
                                        emptyMessage="No contract employees."
                                    >
                                        {interviewColumns.map((col, index) => (
                                            <Column
                                                key={index}
                                                field={col.field}
                                                header={col.header}
                                                body={col.body}


                                            />
                                        ))}
                                    </DataTable>
                                </div>
                            </div>


                            {/* No of Candidate Joining */}
                            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        No of Candidate Joining
                                    </h2>
                                    {/* <span className="text-sm text-green-600 font-medium">
                      Recent activity
                    </span> */}
                                </div>
                                <div className="h-[300px] overflow-auto">
                                    <DataTable
                                        value={dashboardData?.joining}

                                        showGridlines
                                        responsiveLayout="scroll"
                                        className="dashboard-table"
                                        emptyMessage="No submissions found."
                                    >
                                        {candidateColumns.map((col, index) => (
                                            <Column
                                                key={index}
                                                field={col.field}
                                                header={col.header}
                                                body={col.body}


                                            />
                                        ))}
                                    </DataTable>
                                </div>
                            </div>
                            {/* No of Candidate Relieved */}
                            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        No of Candidate Relieved
                                    </h2>
                                    {/* <span className="text-sm text-green-600 font-medium">
                      Recent activity
                    </span> */}
                                </div>
                                <div className="h-[300px] overflow-auto">
                                    <DataTable
                                        value={dashboardData?.relieved}

                                        showGridlines
                                        responsiveLayout="scroll"
                                        className="dashboard-table"
                                        emptyMessage="No submissions found."
                                    >
                                        {relievedColumns.map((col, index) => (
                                            <Column
                                                key={index}
                                                field={col.field}
                                                header={col.header}
                                                body={col.body}


                                            />
                                        ))}
                                    </DataTable>
                                </div>
                            </div>
                        </div>


                    </div>
                    <Footer />
                </>
            )}
        </div>
    );
};

export default Contract_Report_Detail;