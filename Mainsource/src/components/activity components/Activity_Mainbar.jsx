import { MdArrowForwardIos, MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { act, useEffect, useState } from "react";

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

import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";
import { set } from "zod";
import Swal from "sweetalert2";
import { formatDateTimeDDMMYYYY, formatIndianDateTime12Hr } from "../../Utils/dateformat";
const Activity_Mainbar = () => {

    const [globalFilter, setGlobalFilter] = useState("");
 const [activity, setActivity] = useState([]);
  // const [activityData, setActivityData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate, setFilterDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);

  const [totalRecords, setTotalRecords] = useState(0);

  const [companies, setCompanies] = useState([]);
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [createdbyData, setCreatedbyData] = useState([]);

    const fetchActivity = async () => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}api/activity`
      );
console.log("ACTIVITY Response.....: ",res)

      setActivity(res?.data?.data || []);


      

    } catch (err) {
      console.error("Error fetching companies", err);
      setActivity([]);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const columns = [
    {
      header: "S.No",
      body: ( _,options) => options.rowIndex + 1,
      style: { textAlign: "center", width: "80px" },
      fixed: true,
    },
    {
      header: "Employee ID",
      field: "employee_id",
      body: (row) => row?.employee_id || "_",
    },
    {
      header: "Employee Name",
      field: "employeeName",
    body: (row) => row?.employee_name || "_",
    },
    {
      header: "Role",
      field: "role",
      body: (row) => row.role_name || "_",
    },
   
    {
      header: "Reason",
      field: "reason",
      body: (row) => row.reason || "_",
    },
    {
        header: "Date & Time",
        field: "dateTime",
        body: (row) =>
    row.created_at ? formatIndianDateTime12Hr(row.created_at) : "-",
    }
  ];
   return (
      <div className="bg-gray-100 flex flex-col justify-between w-full min-h-screen px-5 pt-2 md:pt-5 overflow-x-auto">
        <div>
          
          <Mobile_Sidebar />
          {/* Breadcrumbs */}

          <div className="flex gap-2 items-center cursor-pointer">
            <p
              className="text-sm md:text-md text-gray-500  cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </p>
            <p>{">"}</p>

            <p className="text-sm  md:text-md  text-[#1ea600]">Activity</p>
          </div>

          {/* filter */}
          {/* <div className="flex flex-wrap justify-between w-full mt-1 md:mt-5 h-auto gap-2 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]  px-2 py-2 md:px-6 md:py-6 ">
            <div className="flex gap-1 items-center">
              <label className="text-sm font-medium text-[#6B7280]">Status</label>
              <Dropdown
                value={filterStatus}
                options={statusOptions}
                onChange={(e) => setFilterStatus(e.value)}
                placeholder="Select Status "
                className="w-fit border border-gray-300  text-[#7C7C7C] text-sm rounded-md placeholder:text-gray-400"
              />
            </div>
           
            <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end gap-4">
              <button
                onClick={handleApplyFilter}
                className="h-10 rounded-lg px-2 md:px-2 py-2  bg-[#1ea600] text-white font-medium w-20 hover:bg-[#33cd10] transition "
              >
                Apply
              </button>
              <button
                onClick={handleResetFilter}
                className="h-10 rounded-lg bg-gray-100 px-2 md:px-2 py-2  text-[#7C7C7C] font-medium w-20 hover:bg-gray-200 transition "
              >
                Reset
              </button>
            </div>
          </div> */}

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
                    onChange={(e) => setRows(e.value)}
                    className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                  <span className=" text-sm text-[#6B7280]">
                    Entries per page
                  </span>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap items-center gap-5">
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
                      className="w-full pl-10 pr-3 py-2 rounded-md border border-[#D9D9D9] 
                          focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div>

                  
                </div>
              </div>
              {/* Responsive wrapper for the table */}
              <div className="table-scroll-container">
                <DataTable
                  className="mt-8"
                  value={activity}
                  dataKey="id"
                  paginator
                  rows={rows}
                  totalRecords={activity.length}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  globalFilter={globalFilter}
                  emptyMessage="No data found"
                  showGridlines
                  resizableColumns
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                >
                  {/* Render only selected columns */}
                  {columns.map((col, index) => (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      body={col.body}
                      style={col.style}
                    />
                  ))}
                </DataTable>
              </div>
            </div>
          </div>

         
        </div>

     

        <div>
          <Footer />
        </div>
      </div>
    );
}

export default Activity_Mainbar
