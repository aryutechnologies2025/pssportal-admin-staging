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
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { use } from "react";


const Lead_Edit_Assigned_Details = () => {
  let navigate = useNavigate();


const { id } = useParams(); // assignment ID


  // // const editEmployeeId = location.state?.employee_id;
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState("");
  console.log("Selected Employee Details:", selectedEmployeeDetails);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leads, setLeads] = useState([]);
const [count, setCount] = useState(0);
  
const [totalRecords, setTotalRecords] = useState(0);
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(1);
  
  const storedDetails = localStorage.getItem("pssuser");
  const parsedDetails = JSON.parse(storedDetails);
  const userid = parsedDetails ? parsedDetails.id : null;

  const today = new Date().toISOString().split("T")[0];
  const [filters, setFilters] = useState({
    from_date: today,
    to_date: today,
    category: [],
    lead_status: []
  });

  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  console.log("selectedLeads:", selectedLeads);
  
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [statusTouched, setStatusTouched] = useState(false);

  const isFilterComplete = () => {
    return (
      filters.category?.length > 0 &&
      filters.lead_status?.length > 0 &&
      filters.from_date &&
      filters.to_date
    );
  };

  
  // Fetch assigned leads
const fetchEditAssignedDetails = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(
      `${API_URL}api/lead-management/assign-edit/${id}`
    );

    console.log("fetchedit assigned details response : ",res)

    if (res.data?.success) {
      const data = res.data.data;

       const empOption = {
    label: data.employee.full_name,
    value: data.employee.id
  };
      

      // set employee
      setEmployeeOptions([empOption]);
      setSelectedEmployeeDetails(empOption.value);
      // console.log("setSelectedEmployeeDetails:",empOption.value);
      setSelectedEmployeeName(empOption.label);
      // console.log("setSelectedEmployeeName:",empOption.label);

      const newFilters = {
        category: data.category_ids || [],
        lead_status: data.lead_statuses || [],
        from_date: data.start_date ? data.start_date.split("T")[0] : today,
        to_date: data.end_date ? data.end_date.split("T")[0] : today
      };

      setFilters(newFilters);

      const assignedIds = (data.entries || []).map(entry => entry.lead.id);



      fetchAssignedLeads({
        employee_id: empOption.value,
        category_id: newFilters.category, // Pass as array, let the function handle joining
        lead_status: newFilters.lead_status, // Pass as array
        start_date: newFilters.from_date,
        end_date: newFilters.to_date,
        assignedLeadIds: assignedIds // Pass this so they stay checked!
      });
     
    }
  } catch (err) {
    toast.error("Failed to load assigned leads");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // Prevent API call on first render
  if (!statusTouched) return;

  fetchAssignedLeads({
    employee_id: selectedEmployeeDetails,
    category_id: filters.category_id,
    lead_status: filters.lead_status,
    start_date: filters.start_date,
    end_date: filters.end_date
  });

}, [filters.lead_status]);


const fetchAssignedLeads = async (appliedFilters = {}) => {
//   console.log(" fetchAssignedLeads CALLED");
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

    const res = await axiosInstance.get(
      `${API_URL}api/lead-management/lead-list`,
      { params }
    );
console.log("Lead Response : ",res);

    if (res.status === 200) {
      const leads = res.data.data || [];
      const assignedLeadIds = appliedFilters.assignedLeadIds || [];

      //  Employees for dropdown
      const empOptions = (res.data.employees || []).map(emp => ({
        label: emp.full_name,
        value: emp.id
      }));

      setEmployeeOptions(empOptions);
      // setSelectedEmployeeDetails(null); // reset selection

      const normalizedLeads = leads.map(lead => ({
  ...lead,

  //  flags from backend
  isAssignedToSelected: lead.already_added_same_employee === true,
  isAssignedToOther: lead.already_assigned_another_employee === true,

  //  ONLY other employee should be orange
  showOrange: lead.already_assigned_another_employee === true,

  //  disable checkbox if assigned anywhere
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

useEffect(() => {
  if (employeeOptions.length && selectedEmployeeDetails) {
    setSelectedEmployeeDetails(prev => prev);
  }
}, [employeeOptions]);

const handleUpdate = async () => {
  if (selectedLeads.length === 0) {
    toast.error("Please select at least one lead");
    return;
  }

  try {
    setSubmitting(true);
    
    // Construct the payload based on your typical backend requirements
    const payload = {
      employee_id: selectedEmployeeDetails,
      lead_ids: selectedLeads, // Array of IDs [301, 303, 304...]
      category_ids: filters.category,
      lead_statuses: filters.lead_status,
      start_date: filters.from_date,
      end_date: filters.to_date
    };

    const res = await axiosInstance.put(
      `${API_URL}api/lead-management/assign-update/${id}`, 
      payload
    );

    if (res.data?.success) {
      setTimeout(() => {
      toast.success("Assignment updated successfully!");
      
    }, 1000);
      fetchAssignedLeads({ employee_id: selectedEmployeeDetails });
    } else {
      toast.error(res.data?.message || "Failed to update assignment");
    }
  } catch (err) {
    console.error("Update error:", err);
    toast.error(err.response?.data?.message || "Failed to update assignment");
  } finally {
    setSubmitting(false);
  }
};

  // Handle employee change
  const handleEmployeeChange = (e) => {
    const empId = e.value;
    const emp = employeeOptions.find(o => o.value === empId);
    
    // setSelectedEmployeeDetails(empId);
    setSelectedEmployeeName(emp?.label || "");
    
    // Apply all filters when employee changes
    fetchAssignedLeads({
      employee_id: empId,
      category: filters.category,
      lead_status: filters.lead_status,
      from_date: filters.from_date,
      to_date: filters.to_date
    });
  };

  // Handle lead selection
//  const handleToggle = (leadId) => {

//   console.log("leadId:", leadId);
//   setSelectedLeads(prev =>
//     prev.includes(leadId)
//       ? prev.filter(id => id !== leadId)
//       : [...prev, leadId]
//   );
// };
 useEffect(() => {
    const preSelected = leads
      .filter(l => l.already_added_same_employee)
      .map(l => l.id);

    setSelectedLeads(preSelected);
  }, [leads]);

const handleToggle = (leadId) => {
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  // only block OTHER employee
  if (lead.already_assigned_another_employee) return;

  setSelectedLeads(prev =>
    prev.includes(leadId)
      ? prev.filter(id => id !== leadId) 
      : [...prev, leadId]
  );
};

useEffect(() => {
  const initiallyAssigned = leads
    .filter(l => l.already_added_same_employee)
    .map(l => l.id);

  setSelectedLeads(initiallyAssigned);
}, [leads]);


  const selectAll = () => {
    const selectable = leads.filter(l => !l.disableCheckbox);
    setSelectedLeads(selectable.map(l => l.id));
  };

  const clearAll = () => {
    setSelectedLeads([]);
  };

  // Handle submit


  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}api/lead-category`
      );

      if (res.data.success) {
        const options = res.data.data
          .filter(item => item.status === "1")
          .map(item => ({
            label: Capitalise(item.name),
            value: item.id
          }));
        setCategoryOptions(options);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Handle pagination
  const onPageChange = (e) => {
    setPage(e.page + 1);
    setRows(e.rows);
  };

  // Status dropdown options
  const statusDropdownOptions = [
    { label: "Open", value: "open" },
    { label: "Joined", value: "joined" },
    { label: "Interested / Scheduled", value: "interested" },
    { label: "Not Interested", value: "not_interested" },
    { label: "Follow Up", value: "follow_up" },
    { label: "Not Picked", value: "not_picked" },
  ];

  // Columns for DataTable
  const columns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
    },
    {
      field: "full_name",
      header: "Full Name",
      body: (row) => Capitalise(row.full_name),
    },
    {
      field: "employee_name",
      header: "Employee Name",
      body: (row) => Capitalise(row.employee_name) || "-",
    },
    {
      field: "category_name",
      header: "Platform",
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

  // Effects
  useEffect(() => {
    fetchCategories();
  }, []);

useEffect(() => {
  if (id) {
    fetchEditAssignedDetails();
  }
}, [id]);

  return (
    <div className="flex flex-col justify-between bg-gray-50 px-3 md:px-5 pt-2  w-full min-h-screen overflow-x-auto">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className="">
              <Mobile_Sidebar />
            </div>

            <div className="flex justify-start gap-2 mt-2 md:mt-0 items-center">
              <p className="text-sm md:text-md text-gray-500 cursor-pointer" onClick={() => navigate("/lead-dashboard")}>
                Dashboard
              </p>
              <p>{">"}</p>
                 <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/lead-assignedto")}>
                Assigned To
              </p>
              <p>{">"}</p>
              
              <p className="text-sm md:text-md text-[#1ea600]">View Assigned Lead</p>
            </div>

            {/* Filter Section - ORIGINAL DESIGN */}
            <div className="w-full mt-5 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-4 py-4">
              <div className="grid grid-cols-1 gap-5">
                {/* Employee */}
                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">Employee</label>
                  <Dropdown
                    value={selectedEmployeeDetails}
                    onChange={handleEmployeeChange}
                    options={employeeOptions}
                    optionLabel="label"
                    optionValue="value"
                    disabled={true}
                    placeholder="Select Employee"
                    filter
                    className="uniform-field w-full md:w-48 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>

                {/* Platform */}
                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">Platform</label>
                  <MultiSelect
                    className="uniform-field h-10 px-3 w-full md:w-48 rounded-md border text-sm"
                    value={filters.category}
                    options={categoryOptions}
                    disabled={true}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, category: e.value }));
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
                    disabled={true}
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

                {/* Status */}
                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">
                    Status
                  </label>
                  <MultiSelect
                    value={filters.lead_status}
                    options={statusDropdownOptions}
                    disabled={true}
                    onChange={(e) => {
                      setStatusTouched(true);
                      setFilters(prev => ({ ...prev, lead_status: e.value  || [] }));
                    }}
                    placeholder="Select Status"
                    className="uniform-field w-full md:w-48 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>
              </div>

              {/* Filter validation message */}
              {statusTouched && !isFilterComplete() && (
                <p className="text-red-500 text-sm mt-2">
                  Please Select Platform, Start Date, End Date and Status
                </p>
              )}

              {/* Filter buttons */}
              {/* <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => fetchAssignedLeads(filters)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    const resetFilters = {
                      from_date: today,
                      to_date: today,
                      category: [],
                      lead_status: []
                    };
                    setFilters(resetFilters);
                    setStatusTouched(false);
                    if (selectedEmployeeDetails) {
                      fetchAssignedLeads({
                        employee_id: selectedEmployeeDetails,
                        ...resetFilters
                      });
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                >
                  Reset
                </button>
              </div> */}
            </div>

            {/* Header with Select/Clear All */}
            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">
                  Assign Leads
                </h3>
                {/* <div className="flex gap-3 text-sm">
                  <button onClick={selectAll} className="text-green-600 hover:underline">
                    Select All
                  </button>
                  <button onClick={clearAll} className="text-red-500 hover:underline">
                    Clear All
                  </button>
                </div> */}
              </div>

              {/* DataTable View */}
              <div className="mb-6">
                <div className="table-scroll-container" id="datatable">
                  {/* <DataTable
                    className="mt-8"
                    value={leads}
                    onPage={onPageChange}
                    first={(page - 1) * rows}
                    onRowClick={(e) => e.originalEvent.stopPropagation()}
                    paginator
                    rows={rows}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[10, 25, 50, 100]}
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
                        style={col.style}
                      />
                    ))}
                  </DataTable> */}
                </div>
              </div>

              {/* Lead Grid Cards - ORIGINAL DESIGN */}
              <div className="flex flex-col w-full mt-5 rounded-2xl bg-white shadow px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* {leads.map(lead => {
                    const checked = lead.already_added_same_employee;
                    
                    return (
                      <div
                        key={lead.id}
                        className={`p-3 rounded-lg border ${
                          lead.showOrange
                            ? "bg-orange-100 border-orange-400"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            // disabled={lead.disableCheckbox}
                            onChange={() => handleToggle(lead.id)}
                            className="mt-1"
                          />
                          <div className="flex flex-col gap-1 text-sm w-full">
                            <p className="font-medium">{lead.full_name}</p>
                            <p className="text-gray-500">{lead.phone}</p>
                            
                            {lead.isAssignedToOther && (
                              <p className="text-xs font-semibold text-orange-700">
                               Already Assigned to {lead.employee_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })} */}

                  
  {leads.map((lead) => {
        const isSameEmployee = lead.already_added_same_employee === true;
        const isOtherEmployee = lead.already_assigned_another_employee === true;

        return (
          <div
            key={lead.id}
            className={`p-3 rounded-lg border ${
              isOtherEmployee
                ? "bg-orange-100 border-orange-400"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1"
                checked={selectedLeads.includes(lead.id)}
                disabled={true}
                onChange={() => handleToggle(lead.id)}
              />

              <div className="flex flex-col gap-1 text-sm w-full">
                <p className="font-medium">{lead.full_name}</p>
                <p className="text-gray-500">{lead.phone}</p>

                {isOtherEmployee && (
                  <p className="text-xs font-semibold text-orange-700">
                    Already Assigned to {lead.employee_name}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}


                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center mt-6">
               <div className="text-sm font-medium text-gray-600">
    {/* Use totalCount (the state) here */}
    Selected: <span className="text-green-600 font-bold">{selectedLeads.length}</span> / {totalRecords}
  </div>
                {/* <button
                 onClick={handleUpdate} // Attach the function here
  disabled={selectedLeads.length === 0 || submitting}
                  className={`px-6 py-2 rounded-lg ${
                    selectedLeads.length === 0 || submitting 
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white font-medium`}
                >
                  {submitting ? "Updating..." : "Update"}
                </button> */}
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Lead_Edit_Assigned_Details;