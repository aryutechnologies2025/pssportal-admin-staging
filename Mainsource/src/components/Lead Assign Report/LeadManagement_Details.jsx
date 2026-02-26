import React, { useState, useEffect, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Loader from "../Loader";
import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig.js";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "primereact/multiselect";
import { useRef } from "react";
import { IoCloseCircle } from "react-icons/io5";
import customise from "../../assets/customise.svg";

import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"
import { AiFillDelete } from "react-icons/ai";
import { Capitalise } from "../../hooks/useCapitalise";
import { formatToDDMMYYYY, formatToYYYYMMDD } from "../../Utils/dateformat";
import { IoClose } from "react-icons/io5";
import { ca, fi } from "zod/v4/locales";
import { HiOutlineQueueList } from "react-icons/hi2";



const LeadManagement_Details = () => {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const multiSelectRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [leads, setLeads] = useState([]);

  const [totalRecords, setTotalRecords] = useState(0);


  const storedDetatis = localStorage.getItem("pssuser");
  const parsedDetails = JSON.parse(storedDetatis);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewAnimating, setIsViewAnimating] = useState(false);
  const [viewContact, setViewContact] = useState(null);
  const [genderOptions, setGenderOptions] = useState([]);
  const [platformOptions, setPlatformOptions] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isViewStatusOpen, setIsViewStatusOpen] = useState(false);
  const [viewStatus, setViewStatus] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [isStatusViewOpen, setIsStatusViewOpen] = useState(false);
  const [statusViewLead, setStatusViewLead] = useState(null);
  const [statusList, setStatusList] = useState([]);



  const [employeeOptions, setEmployeeOptions] = useState([]);

  const employeeDropdownOptions = employeeOptions.map(employee => ({
    label: employee.full_name,
    value: employee.id
  }));

  const today = new Date().toISOString().split("T")[0];


  const [selectedCompany, setSelectedCompany] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

 
  const fetchCompanies = async () => {
  try {
    const res = await axiosInstance.get(`${API_URL}api/company`);
    console.log("API FULL RESPONSE", res.data);

    if (res.data.success) {
      setCompanyOptions(res.data.data);
    }
  } catch (err) {
    console.error("Failed to fetch companies");
  }
};

useEffect(() => {
  fetchCompanies();
}, []);

const companyMap = useMemo(() => {
  const map = {};
  companyOptions.forEach(company => {
    map[String(company.id)] = company.company_name;
  });
  return map;
}, [companyOptions]);

  const [statusForm, setStatusForm] = useState({
    status: "",
    notes: "",
    followUp: "no",
    followUpDate: "",
    epoDate: "",
    company_id: []
  });

  const [page, setPage] = useState(1);
  const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);

  };

  const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };




  const [filters, setFilters] = useState({
     from_date: today,
    to_date: today,
    employee_id: "",
    lead_status: null
  });


  //redirect from dashboard 
useEffect(() => {
   const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
  const status = searchParams.get("lead_status"); 
  const employeeId = searchParams.get("employee_id");



  const urlFilters = {
    from_date: fromDate || today,
      to_date: toDate || today,
    employee_id: employeeId ? Number(employeeId) : "",
    lead_status: status || null
  };


  setFilters(urlFilters);
  fetchLead(urlFilters);

}, [searchParams]);
  const handleApplyFilter = () => {

    const updatedFilters = { ...filters };
    if (!updatedFilters.from_date || !updatedFilters.to_date) {
      toast.error("Please select From & To date");
      return;
    }

    if (new Date(updatedFilters.from_date) > new Date(updatedFilters.to_date)) {
      toast.error("From date cannot be greater than To date");
      return;
    }

    fetchLead(updatedFilters);
  };


  const handleResetFilter = () => {
    const reset = {
      from_date: today,
      to_date: today,
      employee_id: "",
      lead_status: null
    };

    setFilters(reset);
    fetchLead(reset);
    navigate("/lead-assign-report", { replace: true });
  };
  // open view
  const openViewModal = (row) => {
    setViewContact(row);
    setIsViewModalOpen(true);
    setTimeout(() => setIsViewAnimating(true), 50);
  };
  //  close view
  const closeViewModal = () => {
    setIsViewAnimating(false);
    setTimeout(() => {
      setIsViewModalOpen(false);
      setViewContact(null);
    }, 500);
  };

  const fetchStatusList = async (id) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `${API_URL}api/lead-management/status-list/${id}`
      );

      setStatusList(res.data.leadstatus.notes);

    } catch (error) {
      toast.error("Failed to fetch status list");
    } finally {
      setLoading(false);

    }
  };

  // status list open
  const openStatusView = async (row) => {
    setStatusViewLead(row);
    setIsStatusViewOpen(true);
    await fetchStatusList(row.id);
  };
  // status list close 
  const closeStatusView = () => {
    setIsStatusViewOpen(false);
    setStatusViewLead(null);
  };



  // Fetch lead from the API
  // useEffect(() => {
  //   fetchLead();
  // }, []);


  // CHANGE THIS FUNCTION - Remove applyFrontendFilters
  const fetchLead = async (appliedFilters) => {
    const filtersToUse = appliedFilters || filters;

    try {
      setLoading(true);

      const params = {};

        if (filtersToUse.from_date)
      params.from_date = filtersToUse.from_date;

    if (filtersToUse.to_date)
      params.to_date = filtersToUse.to_date;

      if (filtersToUse.employee_id)
        params.employee_id = filtersToUse.employee_id;

      if (filtersToUse.lead_status)
        params.lead_status = filtersToUse.lead_status;

      const res = await axiosInstance.get(
        `${API_URL}api/lead-assign-report`,
        { params }
      );

      if (res.data.success) {
        let data = res.data.data || [];
        // Only normalize data - NO FRONTEND FILTERING
        data = data.map(lead => ({
          ...lead,
          status: lead.status?.toString() || "",
          lead_status: normalizeLeadStatus(lead.lead_status),
          category_name: res.data.categories?.find(cat => cat.id == lead.lead_category_id)?.name || "-",
        }));

        setLeads(data);
        setTotalRecords(data.length);
        setEmployeeOptions(res.data.employees || []);

      }
    } catch (err) {
      console.error(err);
      toast.error("Failed To Fetch Leads");
    } finally {
      setLoading(false);
    }
  };

  const STATUS_MAP = {
    open: "Open",
    joined: "Joined",
    interested: "Interested / scheduled",
    not_interested: "Not Interested",
    follow_up: "Follow Up",
    not_picked: "Not Picked",

  };


  const normalizeLeadStatus = (statusFromBackend) => {
    if (!statusFromBackend) return "open"; // default

    // Check if it's already a key 
    if (STATUS_MAP[statusFromBackend]) return statusFromBackend;

    // 2. If it's a label then find the key
    const foundKey = Object.keys(STATUS_MAP).find(
      (key) => STATUS_MAP[key].toLowerCase() === statusFromBackend.toLowerCase()
    );

    return foundKey || "open";
  };



  //export
  const handleExport = async () => {
    try {

       const filtersToUse = filters;

      const params = {};

        if (filtersToUse.from_date)
      params.from_date = filtersToUse.from_date;

    if (filtersToUse.to_date)
      params.to_date = filtersToUse.to_date;

        if (filtersToUse.employee_id)  
      params.employee_id = filtersToUse.employee_id;

      if (filtersToUse.lead_status)
        params.lead_status = filtersToUse.lead_status;

      const response = await axiosInstance.get(
        `api/lead-assign-report/export`,
        {
          params: params,          // ✅ FIXED
          responseType: "blob",    // ✅ required for file
        }
      );

      const attendanceDate = filtersToUse?.from_date || "date";

      const fileName = `lead_assign_report_${attendanceDate}.csv`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Lead Assign Report exported successfully");

    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed");
    }
  };

  // column
  const columns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
      fixed: true,
    },
    {
      field: "full_name",
      header: "Full Name",
      body: (row) => Capitalise(row.full_name),
    },
    // {
    //   header: "Date Of Birth",
    //   body: (row) => formatToDDMMYYYY(row.date_of_birth),
    // },
    {
      field: "post_code",
      header: "Post Code",
      body: (rowData) => (
        <div className="">
          {rowData.post_code
            ? rowData.post_code.replace(/^[a-zA-Z]:/, "") // removes prefix like z: or x:
            : "-"}
        </div>
      ),
    },
    {
      field: "gender",
      header: "Gender",
      body: (row) => Capitalise(row.gender),
      //  body: (row) => Capitalise(row.gender),
    },
    {
      field: "phone",
      header: "Phone"
    },
    {
      field: "age",
      header: "Age",
    },
    {
      field: "city",
      header: "City",
      body: (row) => Capitalise(row.city),
    },
    {
      field: "category_name",
      header: "Platform ",
      body: (row) => Capitalise(row?.category?.name) || row.category_name || "-"
    },
    {
      field: "state",
      header: "State",
      body: (row) => Capitalise(row.state),
    },
    {
      field: "created_time",
      header: "Date",
      body: (row) => formatToDDMMYYYY(row.created_time),
    },
    {
      field: "status",
      header: "Status",
      body: (row) => (
        <div className="flex items-center gap-2">

          {/* Show only selected label */}
          <span className="border p-1 w-56">
            {STATUS_MAP[row.lead_status] || "Open"}
          </span>


        </div>
      ),
    },

    {
      field: "Action",
      header: "Action",
      body: (row) => (
        <div className="flex justify-center gap-3">

          {/* Eye button for history */}
          <button
            onClick={() => openStatusView(row)}
            className="text-blue-600"
          >
            <HiOutlineQueueList />
          </button>

          <button
            onClick={() => openViewModal(row)}
            className="p-1 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>
        </div>
      ),
      style: { textAlign: "center", fontWeight: "medium" },
      fixed: true
    },
  ];

  const [visibleColumnFields, setVisibleColumnFields] = useState(
    columns.filter(col => col.fixed ||
      ["full_name", "gender", "phone", "age", "qualification", "city", "category_name", "created_time", "status", "Action"]
        .includes(col.field)).map(col => col.field)
  );
  // console.log("visibleColumnFields", visibleColumnFields);

  const onColumnToggle = (event) => {
    let selectedFields = event.value;
    const fixedFields = columns.filter(col => col.fixed).map(col => col.field);
    // console.log("fixedFields", fixedFields);
    const validatedSelection = Array.from(new Set([...fixedFields, ...selectedFields]));

    setVisibleColumnFields(validatedSelection);
  };
  const dynamicColumns = useMemo(() => {
    return columns.filter(col => visibleColumnFields.includes(col.field));
  }, [visibleColumnFields]);

  const statusDropdownOptions = [
    { label: "Open", value: "open" },
    { label: "Joined", value: "joined" },
    { label: "Interested / Scheduled", value: "interested" },
    { label: "Not Interested", value: "not_interested" },
    { label: "Follow Up", value: "follow_up" },
    { label: "Not Picked", value: "not_picked" },
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

              <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/lead-dashboard")}>
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-sm  md:text-md  text-[#1ea600]">Lead Engine</p>
            </div>

            {/* Filter Section */}
            <div className="w-full mt-5 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-4 py-4">

              <div className="flex flex-wrap gap-4">
                          {/* Start Date */}
                <div className="flex flex-col gap-1">
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
                <div className="flex flex-col gap-1">
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



                {/* Assigned Employee */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#6B7280]">
                    Assigned Employee
                  </label>

                  <Dropdown
                    value={filters.employee_id}
                    options={employeeDropdownOptions}
                    onChange={(e) =>
                      setFilters(prev => ({
                        ...prev,
                        employee_id: e.value
                      }))
                    }
                    placeholder="Select Employee"
                    filter
                    filterPlaceholder="Search employee"
                    className="h-10 rounded-md border border-[#D9D9D9] text-sm"
                    panelClassName="text-sm"
                  />
                </div>

                {/* status */}
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#6B7280]">
                    Status
                  </label>
                
                  <Dropdown
                    value={filters.lead_status}
                    options={statusDropdownOptions}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, lead_status: e.value }))
                    }
                    placeholder="Select Status"
                    className="h-10 rounded-md border border-[#D9D9D9] text-sm"
                    panelClassName="text-sm"
                    filter
                  />
                </div>
                

                {/* Buttons */}
                <div className="flex gap-3 mt-6 md:mt-0 justify-end items-end">
                  <button
                    onClick={handleApplyFilter}
                    className="h-10 w-20 rounded-lg bg-[#1ea600] text-white font-medium hover:bg-[#33cd10]"
                  >
                    Apply
                  </button>

                  <button
                    onClick={handleResetFilter}
                    className="h-10 w-20 rounded-lg bg-gray-100 text-[#7C7C7C] font-medium hover:bg-gray-200"
                  >
                    Reset
                  </button>
                </div>

              </div>
            </div>

            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
                shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
                px-2 py-2 md:px-6 md:py-6">
              <div className="datatable-container mt-4">
                <div className="flex flex-col lg:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-5">
                    <div>
                      <Dropdown
                        value={rows}
                        options={[10, 25, 50, 100].map(v => ({ label: v, value: v }))}
                        onChange={(e) => onRowsChange(e.value)}
                        className="w-20 border"
                      />

                      <span className=" text-sm text-[#6B7280]">Entries Per Page</span>

                    </div>
                    <div className="relative inline-block">
                      <MultiSelect
                        ref={multiSelectRef}
                        value={visibleColumnFields}
                        options={columns}
                        optionLabel="header"
                        optionValue="field"
                        onChange={onColumnToggle}
                        display="checkbox"
                        className="absolute opacity-0 pointer-events-none"
                        style={{ bottom: 0, left: 0, width: '100%' }}
                        panelClassName="custom-column-panel"
                        // Disable checkbox for fixed columns
                        optionDisabled={(option) => option.fixed}
                      />

                      <p
                        onClick={() => multiSelectRef.current.show()}
                        className="flex items-center justify-between gap-2 
                                 min-w-56 px-3 py-2 
                                 border border-gray-300 rounded-md 
                                 cursor-pointer text-[#7c7c7c]
                                 hover:bg-gray-100 transition-all text-sm"
                      >
                        Customize
                        <img src={customise} alt="columns" className="w-5 h-5" />
                      </p>


                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-5">

                    <button
                      onClick={handleExport}
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium w-20 rounded-lg"
                    >
                      Export
                    </button>

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
                    className="mt-8"
                    value={leads}
                    onPage={onPageChange}
                    first={(page - 1) * rows}
                    onRowClick={(e) => e.originalEvent.stopPropagation()}
                    paginator
                    rows={rows}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    globalFilter={globalFilter}
                    showGridlines
                    resizableColumns
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    paginatorClassName="custom-paginator"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    loading={loading}
                  >
                    {/* <Column selectionMode="multiple" headerStyle={{ width: '50px' }} /> */}
                    {dynamicColumns.map((col, index) => (
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



            {/*status list view  */}
            {isStatusViewOpen && statusViewLead && (
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={closeStatusView}
              >
                <div
                  className="bg-white rounded-xl w-[900px] p-6 shadow-lg relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeStatusView}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                  >
                    <IoCloseCircle size={22} />
                  </button>

                  <h2 className="text-lg font-semibold mb-4">
                    Status History – {statusViewLead.full_name}
                  </h2>

                  {/* STATUS TABLE */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-3 py-2">S.No</th>
                          <th className="border px-3 py-2">Status</th>
                          <th className="border px-3 py-2">Follow Up</th>
                          <th className="border px-3 py-2">Notes</th>
                          <th className="border px-3 py-2">Company</th>
                          <th className="border px-3 py-2">Created Date</th>
                          <th className="border px-3 py-2">Follow Date</th>
                          <th className="border px-3 py-2">Scheduled Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {statusList?.length ? (
                          statusList.map((item, index) => (
                            <tr key={index}>
                              <td className="border px-3 py-2 text-center">
                                {index + 1}
                              </td>
                              <td className="border px-3 py-2 capitalize">
                                {item.status}
                              </td>
                              <td className="border px-3 py-2 text-center">
                                {item.followUp ? "Yes" : "No"}
                              </td>
                              <td className="border px-3 py-2">
                                {Capitalise(item.notes || "-")}
                              </td>
                             <td className="border px-3 py-2">
  {item.company_id
    ?.split(",")
    ?.map(id => companyMap[id] ? Capitalise(companyMap[id]) : null)
    ?.filter(Boolean)
    ?.join(", ") || "-"}
</td>
                              <td className="border px-3 py-2">
                                {formatToDDMMYYYY(item.created_at)}
                              </td>
                              <td className="border px-3 py-2">
                                {formatToDDMMYYYY(item.followup_date)}
                              </td>
                              <td className="border px-3 py-2">
                                {formatToDDMMYYYY(item.scheduled_date)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4 text-gray-500">
                              No status history found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* view modal */}
            {isViewModalOpen && viewContact && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
                {/* Overlay click */}
                <div className="absolute inset-0" onClick={closeViewModal}></div>

                {/* Slide Panel */}
                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw]
      bg-white shadow-lg transform transition-transform duration-500 ease-in-out
      ${isViewAnimating ? "translate-x-0" : "translate-x-full"}`}
                >
                  {/* Close Arrow */}
                  <div
                    className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300
        flex items-center justify-center cursor-pointer"
                    onClick={closeViewModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  {/* Content */}
                  <div className="px-5 lg:px-14 py-4 md:py-10 text-[#4A4A4A] font-medium">
                    <p className="text-xl md:text-2xl mb-6">View Lead Details</p>

                    {/* Reusable Field */}
                    {[
                      ["Lead ID", viewContact.lead_id],
                      ["Category Name", viewContact?.category?.name],
                      ["Created Time", viewContact.created_time],
                      ["Ad ID", viewContact.ad_id],
                      ["Ad Name", viewContact.ad_name],
                      ["Adset ID", viewContact.adset_id],
                      ["Adset Name", viewContact.adset_name],
                      ["Campaign ID", viewContact.campaign_id],
                      ["Campaign Name", viewContact.campaign_name],
                      ["Form ID", viewContact.form_id],
                      ["Form Name", viewContact.form_name],
                      ["Is Organic", viewContact.is_organic ? "Yes" : "No"],
                      ["Full Name", viewContact.full_name],
                      ["Gender", viewContact.gender],
                      ["Phone", viewContact.phone],
                      ["Date of Birth", formatToDDMMYYYY(viewContact.date_of_birth)],
                      ["Post Code", viewContact.post_code],
                      ["City", viewContact.city],
                      ["State", viewContact.state],
                    ].map(([label, value], i) => (
                      <div key={i} className="mt-6 flex justify-between items-center">
                        <label className="text-md font-medium">{label}</label>
                        <div className="w-[50%] border px-3 py-2 text-gray-700">
                          {value || "-"}
                        </div>
                      </div>
                    ))}

                    {/* Status */}
                    <div className="mt-6 flex justify-between items-center">
                      <label className="text-md font-medium">Status</label>
                      <div className="w-[50%]">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
              ${viewContact.status === "0" || viewContact.status === 0
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"}`}
                        >
                          {viewContact.status === "0" || viewContact.status === 0
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end mt-10">
                      <button
                        onClick={closeViewModal}
                        className="border border-[#7C7C7C] text-[#7C7C7C]
            hover:bg-[#FEE2E2] hover:text-[#DC2626]
            px-5 py-2 rounded-[10px]"
                      >
                        Close
                      </button>
                    </div>
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
export default LeadManagement_Details;
