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
import { useNavigate } from "react-router-dom";
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


const Lead_Add_Assigned_Details = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
 
  const [isAnimating, setIsAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  // console.log("....erors.... : ", errors);
  const [leads, setLeads] = useState([]);
  // console.log("leads :", leads)
  const [totalRecords, setTotalRecords] = useState(0);
 
  // console.log("edit value", editLeadForm);
  const storedDetatis = localStorage.getItem("pssuser");
  const parsedDetails = JSON.parse(storedDetatis);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [rows, setRows] = useState(10);

  const [viewStatus, setViewStatus] = useState(null);
  


  const today = new Date().toISOString().split("T")[0];
    const [filters, setFilters] = useState({
  from_date: today,
  to_date: today,
  category: [],
  lead_status: []
});

  
      const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
      console.log("SelectedEmployeeDetaails : ",selectedEmployeeDetails);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  console.log("SelectedEmployeeName : ",selectedEmployeeName);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  
const dummyEmployees = [
  { label: "Ravi Kumar", value: 101 },
  { label: "Anita Sharma", value: 102 },
  { label: "Suresh Patel", value: 103 },
  { label: "Neha Singh", value: 104 },
  { label: "Mohammed Ali", value: 105 }
];

const isFilterComplete = () => {
  return (
    filters.category?.length > 0 &&
    filters.lead_status?.length > 0 &&
    filters.from_date &&
    filters.to_date
  );
};




  // lead for allocation
  const [selectedLeads, setSelectedLeads] = useState([]);
const [showLeadTable, setShowLeadTable] = useState(false);
 const [selectedRows, setSelectedRows] = useState([]);

  const selectableLeads = leads.filter(l => !l.isAssigned);

const handleToggle = (leadId) => {
  setSelectedLeads(prev =>
    prev.includes(leadId)
      ? prev.filter(id => id !== leadId)
      : [...prev, leadId]
  );
};


  const selectAll = () => {
    setSelectedLeads(selectableLeads.map(l => l.id));
  };

  const clearAll = () => {
    setSelectedLeads([]);
  };
  


  console.log("viewStatus", viewStatus);
const [statusTouched, setStatusTouched] = useState(false);

  const [statusForm, setStatusForm] = useState({
    status: "",
    notes: "",
    followUp: "no",
    followUpDate: "",
    epoDate: ""
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // apply filter
  const handleApplyFilter = () => {
    fetchAssignedLeads(filters);
  };
  // console.log("filter check", handleApplyFilter)

  const handleResetFilter = () => {
    const reset = {
      gender: "",
      platform: "",
      age: "",
      city: "",
      from_date: "",
      to_date: "",
      category: null,
      lead_status: ""
    };

    setFilters(reset);
    fetchAssignedLeads(reset);
  };

  useEffect(() => {
  if (isFilterComplete()) {
    setFilterError("");
    setShowLeadTable(true);

    fetchAssignedLeads({
      category_id: filters.category,      // objects
      lead_status: filters.lead_status,    // objects
      start_date: filters.from_date,
      end_date: filters.to_date,
    });
  } else {
    setShowLeadTable(false);
    setLeads([]);
    setLoading(false);
  }
}, [
  filters.category,
  filters.lead_status,
  filters.from_date,
  filters.to_date
]);


const applyFilters = () => {
  fetchAssignedLeads({
    category_id,
    lead_status,
    start_date,
    end_date,
  });
};

const clearFilters = () => {
  fetchAssignedLeads({});
};

 const [filterError, setFilterError] = useState("");
const [submitError, setSubmitError] = useState("");

const fetchAssignedLeads = async (appliedFilters = {}) => {
  // console.log("🚀 fetchAssignedLeads CALLED");
  setLoading(true);

  try {
    const params = {};

if (Array.isArray(appliedFilters.category_id) && appliedFilters.category_id.length > 0) {
  params.category_id = appliedFilters.category_id.join(",");
}

if (Array.isArray(appliedFilters.lead_status) && appliedFilters.lead_status.length > 0) {
  params.lead_status = appliedFilters.lead_status.join(",");
}


    if (appliedFilters.start_date) {
      params.start_date = appliedFilters.start_date;
    }

    if (appliedFilters.end_date) {
      params.end_date = appliedFilters.end_date;
    }

    if (appliedFilters.employee_id) {
  params.employee_id = appliedFilters.employee_id;
}

    console.log("Sending params:", params);
    console.log("Raw filters:", appliedFilters);
console.log("Category:", appliedFilters.category_id);
console.log("Status:", appliedFilters.lead_status);

    const res = await axiosInstance.get(
      "/api/lead-management/lead-list",
      { params }
    );
console.log("Lead Response : ",res);

    if (res.status === 200) {
      const leads = res.data.data || [];

      //  Employees for dropdown
      const empOptions = (res.data.employees || []).map(emp => ({
        label: emp.full_name,
        value: emp.id
      }));

      setEmployeeOptions(empOptions);
      // setSelectedEmployeeDetails(null); // reset selection

      const normalizedLeads = leads.map(lead => ({
  ...lead,

  // 🔹 flags from backend
  isAssignedToSelected: lead.already_added_same_employee === true,
  isAssignedToOther: lead.already_assigned_another_employee === true,

  // 🔹 ONLY other employee should be orange
  showOrange: lead.already_assigned_another_employee === true,

  // 🔹 disable checkbox if assigned anywhere
  disableCheckbox:
    lead.already_added_same_employee ||
    lead.already_assigned_another_employee,

  assignedEmployeeName: lead.assigned_employee_name || null
}));




setLeads(normalizedLeads);
      setTotalRecords(res.data.count || normalizedLeads.length);
    }

  } catch (err) {
    console.error("Failed to fetch leads:", err);
    setEmployeeOptions([]);
    setLeads([]);
  } finally {
    setLoading(false);
  }
};

const handleEmployeeChange = (e) => {
  const empId = e.value;

  setSelectedEmployeeDetails(empId);

  fetchAssignedLeads({
    category_id: filters.category,
    lead_status: filters.lead_status,
    start_date: filters.from_date,
    end_date: filters.to_date,
    employee_id: empId,
  });
};



useEffect(() => {
  if (!selectedEmployeeDetails) return;

  const preSelected = leads
    .filter(l => l.isAssignedToSelected)
    .map(l => l.id);

  setSelectedLeads(preSelected);
}, [leads, selectedEmployeeDetails]);



  // status api get showing fetching
  const [statusList, setStatusList] = useState([]);

  console.log("statusList", statusList);


  const fetchStatusList = async (id) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `${API_URL}api/lead-management/status-list/${id}`
      );

      console.log("fetch Status List", res.data);


      setStatusList(res.data.leadstatus.notes);

    } catch (error) {
      toast.error("Failed to fetch status list");
    } finally {
      setLoading(false);

    }
  };

  
const handleSubmit = async () => {
  console.log("Selected employee:", selectedEmployeeDetails);

  if (!selectedEmployeeDetails) {
    toast.error("Please select an employee");
    return;
  }

  if (selectedLeads.length === 0) {
    toast.error("Please select at least one lead");
    return;
  }

  //  FILTER OUT ALREADY-ASSIGNED-TO-SELECTED EMPLOYEE
  const newLeads = selectedLeads.filter(
    id => !leads.find(l => l.id === id)?.isAssignedToSelected
  );

  if (newLeads.length === 0) {
    toast.error("Please select at least one NEW lead");
    return;
  }

  // filters already contain primitives
  const categoryIds = Array.isArray(filters.category)
    ? filters.category.filter(Boolean)
    : [];

  const leadStatuses = Array.isArray(filters.lead_status)
    ? filters.lead_status.filter(Boolean)
    : [];

  //  USE newLeads HERE
  const payload = {
    employee_id: selectedEmployeeDetails,
    start_date: filters.from_date,
    end_date: filters.to_date,
    created_by: userid,
    lead_ids: newLeads, //  IMPORTANT
  };

  if (categoryIds.length > 0) {
    payload.category_ids = categoryIds;
  }

  if (leadStatuses.length > 0) {
    payload.lead_statuses = leadStatuses;
  }

  console.log(" ASSIGN PAYLOAD:", payload);

  try {
    setSubmitting(true);

    const res = await axiosInstance.post(
      "/api/lead-management/assign",
      payload
    );

    console.log("Lead create ",res)
    if (res.data?.success) {
      toast.success(res.data.message || "Leads Assigned Successfully");

      // reset ONLY selection (not employee)
      setSelectedLeads([]);
navigate("/lead-assignedto");
      // refresh list
      fetchAssignedLeads({
        category_id: filters.category,
        lead_status: filters.lead_status,
        start_date: filters.from_date,
        end_date: filters.to_date
      });
    } else {
      toast.error(res.data?.message || "Assignment Failed");
    }

  } catch (error) {
    console.error("Assign error:", error);
    toast.error(
      error?.response?.data?.message || "Failed To Assign Leads"
    );
  } finally {
    setSubmitting(false);
  }
};



  // delete
  const deleteLead = async (leadId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this lead?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.delete(
        `${API_URL}api/lead-management/delete/${leadId}`,
        {
          data: {
            lead_id: leadId
          }
        }
      );

      console.log("Delete response:", res.data);

      if (res.data?.success === true) {
        setTimeout(() => {
          toast.success(res.data?.message || "Lead deleted successfully");
        }, 600);
        fetchAssignedLeads(); // refresh table
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error?.response || error);
      toast.error(
        error?.response?.data?.message || "Delete failed"
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}api/lead-category`
      );

      if (res.data.success) {
        const options = res.data.data
          .filter(item => item.status === "1") // only active
          .map(item => ({
            label: Capitalise(item.name),  // shown in dropdown
            value: item.id      // sent to filter
          }));

        setCategoryOptions(options);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [])
  const STATUS_MAP = {
    open: "Open",
    joined: "Joined",
    interested: "Interested / scheduled",
    not_interested: "Not Interested",
    follow_up: "Follow Up",
    not_picked: "Not Picked",

  };

  const REVERSE_STATUS_MAP = Object.fromEntries(
    Object.entries(STATUS_MAP).map(([k, v]) => [v, k])
  );

  const getStatusValue = (label) => {
    return Object.keys(STATUS_MAP).find(
      key => STATUS_MAP[key] === label
    ) || "";
  };

  const normalizeLeadStatus = (status) => {
    if (!status) return "";


    if (STATUS_MAP[status]) return status;


    if (REVERSE_STATUS_MAP[status]) return REVERSE_STATUS_MAP[status];

    return "";
  };


  const handleStatusChange = (row, newStatusKey) => {

    //  Update UI immediately
    setLeads(prev =>
      prev.map(lead =>
        lead.id === row.id
          ? { ...lead, lead_status: newStatusKey }
          : lead
      )
    );

    //  Open modal
    setViewStatus({ ...row, lead_status: newStatusKey });
    setIsViewStatusOpen(true);

    //  Prepare form
    setStatusForm({
      status: newStatusKey,
      notes: "",
      followUp: "no",
      followUpDate: "",
      epoDate: ""
    });
  };
const [globalFilter, setGlobalFilter] = useState("");

const [page, setPage] = useState(1);
    const onPageChange = (e) => {
      setPage(e.page + 1); // PrimeReact is 0-based
      setRows(e.rows);
  
    };
  
    const onRowsChange = (value) => {
      setRows(value);
      setPage(1); // Reset to first page when changing rows per page
    };
 


  // const allSelected =
  //   leads.length > 0 && selectedRows.length === leads.length;

  // const toggleSelectAll = () => {
  //   if (selectedRows.length === leads.length) {
  //     setSelectedRows([]);
  //   } else {
  //     setSelectedRows(leads.map(row => row.id));
  //   }
  // };


  // const toggleRowSelection = (id) => {
  //   setSelectedRows(prev =>
  //     prev.includes(id)
  //       ? prev.filter(rowId => rowId !== id)
  //       : [...prev, id]
  //   );
  // };



  // column
 // 1. Updated Columns Definition
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
     {
        field: "employee_name",
        header: "Employee Name",
        body: (row) => Capitalise(row.employee_name),
     },
      {
           field :"category_name",
           header: "Platform ",
           body: (row) => Capitalise(row?.category?.name) || row.category_name || "-"
         },
        
         {
           field: "created_time",
           header: "Date",
           body: (row) => formatToDDMMYYYY(row.created_time),
         },
         {
            field: "lead_status",
            header: "Status",
            body: (row) => Capitalise(row.lead_status)
         }
];


{/* Select Leads Table */}
<div className="mt-6 rounded-xl bg-white shadow p-4 transition-all w-full max-w-2xl">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-md font-bold text-gray-700">Assign Leads</h3>
    <div className="flex gap-2">
       <button 
         onClick={() => setSelectedLeads(leads.filter(l => !l.isAssigned))}
         className="text-xs text-blue-600 hover:underline"
       >
         Select All
       </button>
       <span className="text-gray-300">|</span>
       <button 
         onClick={() => setSelectedLeads([])}
         className="text-xs text-red-500 hover:underline"
       >
         Clear All
       </button>
    </div>
  </div>

  <div className="table-scroll-container" id="datatable">
                    <DataTable
                      className="mt-8"
                      // value={dummyLeads}
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


  const statusDropdownOptions = [
    { label: "Open", value: "open" },
    { label: "Joined", value: "joined" },
    { label: "Interested / Scheduled", value: "interested" },
    { label: "Not Interested", value: "not_interested" },
    { label: "Follow Up", value: "follow_up" },
    { label: "Not Picked", value: "not_picked" },
  ];

//   const dummyLeads = [
//   {
//     id: 1,
//     full_name: "John Doe",
//     phone: "9876543210",
//     lead_status: "open",
//     isAssigned: false, // Normal Row
//     city: "Chennai",
//     age: 24,
//     lead_category_id: 5
//   },
//   {
//     id: 2,
//     full_name: "Anitha Raman",
//     phone: "9123456789",
//     lead_status: "Interested / scheduled",
//     isAssigned: true, // Should show Orange
//     city: "Bangalore",
//     age: 30,
//     lead_category_id: 5,
//     employee_name: "Anitha"

//   },
//   {
//     id: 3,
//     full_name: "Suresh Raina",
//     phone: "9988776655",
//     lead_status: "follow_up",
//     isAssigned: false, // Normal Row
//     city: "Chennai",
//     age: 28,
//     lead_category_id: 5
//   },
//   {
//     id: 4,
//     full_name: "Priya Lakshmi",
//     phone: "8877665544",
//     lead_status: "not_picked",
//     isAssigned: true, // Should show Orange
//     city: "Coimbatore",
//     age: 22,
//     lead_category_id: 5,
//     employee_name: "Priya"
//   },
//   {
//     id: 5,
//     full_name: "Vikram Seth",
//     phone: "7766554433",
//     lead_status: "joined",
//     isAssigned: false, // Normal Row
//     city: "Chennai",
//     age: 35,
//     lead_category_id: 5
//   }
// ];


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
                 <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/lead-assignedto")}>
                Assigned To
              </p>
              <p>{">"}</p>
              <p className="text-sm  md:text-md  text-[#1ea600]">Add Lead</p>
            </div>

            {/* Filter Section */}
            <div className="w-full mt-5 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-4 py-4 space-x-5">

              <div className="grid grid-cols-1 gap-5">

                  {/* employee */}
                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">Employee</label>
                  <Dropdown
                    value={selectedEmployeeDetails}
  onChange={handleEmployeeChange}
  options={employeeOptions}
  optionLabel="label"
  optionValue="value"
  placeholder="Select Employee"
  filter
                    className="uniform-field w-full md:w-48 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>

                               {/* platform */}
                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">Platform</label>
                  <MultiSelect
                    className="uniform-field h-10 px-3 w-full md:w-48 rounded-md border text-sm"
                    // value={selectedCategory}
                    value={filters.category}
                    options={categoryOptions}
                    onChange={(e) => {
                      // setSelectedCategory(e.value);
                      setFilters(prev => ({
                        ...prev,
                        category: e.value
                      }));
                    }}
                    placeholder="Select Platform"
                    filter
                    filterPlaceholder="Search Platform"

                    panelClassName="text-sm"
                  />
                </div>

                 {/* Start Date */}
                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">Start Date</label>
                  <input
                    type="date"
                    className="border w-full md:w-48 h-10 px-3 rounded-md"
                    value={filters.from_date}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, from_date: e.target.value }))
                    }
                  />
                </div>

                {/* End Date */}
                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">End Date</label>
                  <input
                    type="date"
                    className="border w-full md:w-48 h-10 px-3 rounded-md"
                    value={filters.to_date}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, to_date: e.target.value }))
                    }
                  />
                </div>

                                              {/* status */}

                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">
                    Status
                  </label>

                  {/* <MultiSelect
                    value={filters.lead_status}
                    options={statusDropdownOptions}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, lead_status: e.value }))
                    }
                    placeholder="Select Status"
                    className="uniform-field h-10 w-full md:w-48 rounded-md border border-[#D9D9D9] text-sm"
                    panelClassName="text-sm"
                    filter
                  /> */}

                 <MultiSelect
  value={filters.lead_status}
  options={statusDropdownOptions}
  onChange={(e) => {
    setStatusTouched(true);
    setFilters(prev => ({ ...prev, lead_status: e.value }));
  }}
  placeholder="Select Status"
                      className="uniform-field w-full md:w-48 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

/>

                </div>
              </div>

              </div>
{statusTouched && !isFilterComplete() && (
  <p className="text-red-500 text-sm mt-2">
    Please Select Platform, Start Date, End Date and Status
  </p>
)}




   {/* Header */}
               <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">
          Assign Leads
        </h3>
        <div className="flex gap-3 text-sm">
          <button onClick={selectAll} className="text-green-600 hover:underline">
            Select All
          </button>
          <button onClick={clearAll} className="text-red-500 hover:underline">
            Clear All
          </button>
        </div>
      </div>

      {/* Lead Grid */}
      {showLeadTable && (
  <div className="flex flex-col w-full mt-5 rounded-2xl bg-white shadow px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-fit">
        {leads.map(lead => {
  const checked =
    selectedLeads.includes(lead.id) || lead.isAssignedToSelected;

  return (
    <div
  key={lead.id}
  className={`p-3 rounded-lg border
    ${
      lead.showOrange
        ? "bg-orange-100 border-orange-400"
        : "bg-gray-50 hover:bg-gray-100"
    }`}
>


      <div className="flex items-start gap-3">
        <input
  type="checkbox"
  checked={
  lead.isAssignedToSelected ||
  selectedLeads.includes(lead.id)
}
  disabled={lead.isAssignedToSelected || lead.isAssignedToOther}
  onChange={() => handleToggle(lead.id)}
  className="mt-1"
/>


        <div className="flex flex-col gap-1 text-sm w-full">
          <p className="font-medium">{lead.full_name}</p>
          <p className="text-gray-500">{lead.phone}</p>

          {/* {lead.isAssignedToSelected && (
  <p className="text-xs font-semibold text-orange-700">
    Already assigned to {selectedEmployeeName}
  </p>
)} */}

{lead.isAssignedToOther && (
  <p className="text-xs font-semibold text-orange-700">
    Assigned to {lead.assignedEmployeeName || "another employee"}
  </p>
)}

        </div>
      </div>
    </div>
  );
})}


      </div>
      </div>
)}

      {/* Submit */}
      <div className="flex justify-end mt-6">
        <button
           onClick={handleSubmit}
  disabled={selectedLeads.length === 0 || submitting}
          className="px-6 py-2 rounded-lg bg-green-600 text-white disabled:bg-gray-300"
        >
          {submitting ? "Assigning..." : "Submit"}
        </button>
      </div>
    </div>
    </div>
    </>
    )
      }
      <Footer />
      </div>
  );
};

export default Lead_Add_Assigned_Details;