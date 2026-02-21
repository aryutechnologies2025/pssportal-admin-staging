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
import { IoIosCloseCircle } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { Capitalise } from "../../hooks/useCapitalise";
import { formatToDDMMYYYY, formatToYYYYMMDD } from "../../Utils/dateformat";
import { IoClose } from "react-icons/io5";
import { ca, fi } from "zod/v4/locales";
import { record } from "zod";

const LeadAssignedTo = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    employee: null,
  });

  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  console.log("SelectedEmployeeDetaails : ", selectedEmployeeDetails);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  console.log("SelectedEmployeeName : ", selectedEmployeeName);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  // close add
  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsAddModalOpen(false);

      setErrors({});
    }, 300);
  };

  const dummyEmployees = [
    { label: "Ravi Kumar", value: 101 },
    { label: "Anita Sharma", value: 102 },
    { label: "Suresh Patel", value: 103 },
    { label: "Neha Singh", value: 104 },
    { label: "Mohammed Ali", value: 105 },
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

  const selectableLeads = leads.filter((l) => !l.isAssigned);

  const handleToggle = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId],
    );
  };

  const selectAll = () => {
    setSelectedLeads(selectableLeads.map((l) => l.id));
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
    epoDate: "",
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // apply filter
  const handleApplyFilter = () => {
    fetchAssignedLeadsForEmp();
  };

  const handleResetFilter = async () => {
    setLoading(true);

    try {
      setFilters({
        from_date: "",
        to_date: "",
      });

      setSelectedEmployeeDetails(null);

      const res = await axiosInstance.get(
        `${API_URL}api/lead-management/assign-list`,
        { params: {} },
      );

      console.log("Lead Response:", res);

      if (res.status === 200) {
        const leads = res.data.data || [];

        /* Employees for dropdown */
        const empOptions = (res.data.employees || []).map((emp) => ({
          label: emp.full_name,
          value: emp.id,
        }));
        setEmployeeOptions(empOptions);

        /* Normalize backend → UI */
        const normalizedLeads = leads.map((lead) => {
          const assignedSameEmp = lead.already_added_same_employee === true;
          const assignedOtherEmp =
            lead.already_assigned_another_employee === true;

          return {
            ...lead,

            // backend flags
            isAssignedToSelected: assignedSameEmp,
            isAssignedToOther: assignedOtherEmp,

            // UI behavior
            showOrange: assignedOtherEmp,
            disableCheckbox: assignedSameEmp || assignedOtherEmp,

            assignedEmployeeName: lead.assigned_employee_name || null,
          };
        });

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
    if (isFilterComplete()) {
      setFilterError("");
      setShowLeadTable(true);

      fetchAssignedLeadsForEmp({
        category_id: filters.category, // objects
        lead_status: filters.lead_status, // objects
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
    filters.to_date,
  ]);

  const applyFilters = () => {
    fetchAssignedLeadsForEmp({
      category_id,
      lead_status,
      start_date,
      end_date,
    });
  };

  const clearFilters = () => {
    fetchAssignedLeadsForEmp({});
  };

  const [filterError, setFilterError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const applyFrontendFilters = (data, filters) => {
    let result = [...data];

    // CITY
    if (filters.city) {
      result = result.filter(
        (item) => item.city?.toLowerCase() === filters.city.toLowerCase(),
      );
    }

    // PLATFORM
    if (filters.platform) {
      result = result.filter(
        (item) =>
          item.platform?.toLowerCase() === filters.platform.toLowerCase(),
      );
    }

    // AGE
    if (filters.age) {
      const [min, max] = filters.age.split("-");

      result = result.filter((item) => {
        const age = Number(item.age);
        if (filters.age === "46+") return age >= 46;
        return age >= Number(min) && age <= Number(max);
      });
    }

    // category
    // if (filters.category) {
    //   result = result.filter(item =>
    //     item.category?.toLowerCase() === filters.category.toLowerCase()
    //   );
    // }
    if (filters.category) {
      result = result.filter(
        (item) => item.lead_category_id === filters.category,
      );
    }

    // console.log("result",result)
    // lead status
    if (filters.lead_status) {
      console.log("filtering by status : ", filters.lead_status);
      let a = result.map((item) => console.log(item.lead_status));
      result = result.filter(
        (item) => item.lead_status === filters.lead_status,
      );
    }

    // console.log("Filtered results count:", result.length);
    return result;
  };

  const applyFilter = () => {
    const params = {};

    if (filters.from_date) {
      params.start_date = filters.from_date;
    }

    if (filters.to_date) {
      params.end_date = filters.to_date;
    }

    if (selectedEmployeeDetails) {
      params.employee_id = selectedEmployeeDetails; // NUMBER
    }

    return params;
  };

  useEffect(() => {
    fetchAssignedLeadsForEmp();
  }, []);
  const fetchAssignedLeadsForEmp = async () => {
    console.log("fetchAssignedLeadsForEmp CALLED");
    setLoading(true);

    try {
      const params = applyFilter();

      const res = await axiosInstance.get(
        `${API_URL}api/lead-management/assign-list`,
        { params },
      );

      console.log("Lead Response:", res);

      if (res.status === 200) {
        const leads = res.data.data || [];

        /* Employees for dropdown */
        const empOptions = (res.data.employees || []).map((emp) => ({
          label: emp.full_name,
          value: emp.id,
        }));
        setEmployeeOptions(empOptions);

        /* Normalize backend → UI */
        const normalizedLeads = leads.map((lead) => {
          const assignedSameEmp = lead.already_added_same_employee === true;
          const assignedOtherEmp =
            lead.already_assigned_another_employee === true;

          return {
            ...lead,

            // backend flags
            isAssignedToSelected: assignedSameEmp,
            isAssignedToOther: assignedOtherEmp,

            // UI behavior
            showOrange: assignedOtherEmp,
            disableCheckbox: assignedSameEmp || assignedOtherEmp,

            assignedEmployeeName: lead.assigned_employee_name || null,
          };
        });

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

    fetchAssignedLeadsForEmp({
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
      .filter((l) => l.isAssignedToSelected)
      .map((l) => l.id);

    setSelectedLeads(preSelected);
  }, [leads, selectedEmployeeDetails]);

  // status api get showing fetching
  const [statusList, setStatusList] = useState([]);

  console.log("statusList", statusList);

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

    // filter out leads that are already assigned to the selected employee
    const newLeads = selectedLeads.filter(
      (id) => !leads.find((l) => l.id === id)?.isAssignedToSelected,
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
        `${API_URL}api/lead-management/assign`,
        payload,
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Leads Assigned Successfully");

        // reset ONLY selection (not employee)
        setSelectedLeads([]);

        // refresh list
        fetchAssignedLeadsForEmp({
          category_id: filters.category,
          lead_status: filters.lead_status,
          start_date: filters.from_date,
          end_date: filters.to_date,
          employee_id: selectedEmployeeDetails,
        });
      } else {
        toast.error(res.data?.message || "Assignment Failed");
      }
    } catch (error) {
      console.error("Assign error:", error);
      toast.error(error?.response?.data?.message || "Failed To Assign Leads");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}api/lead-category`);

      if (res.data.success) {
        const options = res.data.data
          .filter((item) => item.status === "1") // only active
          .map((item) => ({
            label: Capitalise(item.name), // shown in dropdown
            value: item.id, // sent to filter
          }));

        setCategoryOptions(options);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const STATUS_MAP = {
    open: "Open",
    joined: "Joined",
    interested: "Interested / scheduled",
    not_interested: "Not Interested",
    follow_up: "Follow Up",
    not_picked: "Not Picked",
  };

  const REVERSE_STATUS_MAP = Object.fromEntries(
    Object.entries(STATUS_MAP).map(([k, v]) => [v, k]),
  );

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

  // delete
  const deleteLead = async (recordId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this lead assignment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.delete(
        `${API_URL}api/lead-management/assign-delete`,
        {
          data: { record_id: recordId },
        },
      );
      setTimeout(() => {
        toast.success("Deleted successfully");
      }, 600);

      fetchAssignedLeadsForEmp();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const columns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
      fixed: true,
    },
    //  {
    //    field: "full_name",
    //    header: "Full Name",
    //    body: (row) => Capitalise(row.full_name),
    //  },
    {
      field: "employee_name",
      header: "Employee Name",
      body: (row) => Capitalise(row?.employee?.full_name || "-"),
    },
    {
      field: "employee_id",
      header: "Employee ID",
      body: (row) => row?.employee?.gen_employee_id || "-",
    },
    {
      field: "count",
      header: "Counts",
      body: (row) => row.entries_count || 0,
    },

    //  {
    //    field: "created_time",
    //    header: "Date",
    //    body: (row) => formatToDDMMYYYY(row.created_time),
    //  },
    //  {
    //     field: "lead_status",
    //     header: "Status",
    //     body: (row) => Capitalise(row.lead_status)
    //  },
    {
      field: "Action",
      header: "Action",
      body: (row) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate(`/lead-assignedto-view/${row.id}`)}
            className="p-1 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>

          <TfiPencilAlt
            onClick={() => navigate(`/lead-assignedto-edit/${row.id}`)}
            className="text-[#1ea600] cursor-pointer hover:scale-110 transition"
            title="Edit"
          />

          <RiDeleteBin6Line
            onClick={() => deleteLead(row.id)}
            className="text-red-500 cursor-pointer hover:scale-110 transition"
            title="Delete"
          />
        </div>
      ),
      style: { textAlign: "center", fontWeight: "medium" },
      fixed: true,
    },
  ];

  const statusDropdownOptions = [
    { label: "Open", value: "open" },
    { label: "Joined", value: "joined" },
    { label: "Interested / Scheduled", value: "interested" },
    { label: "Not Interested", value: "not_interested" },
    { label: "Follow Up", value: "follow_up" },
    { label: "Not Picked", value: "not_picked" },
  ];

  {
    /* Select Leads Table */
  }
  <div className="mt-6 rounded-xl bg-white shadow p-4 transition-all w-full max-w-2xl">
    {/* <div className="flex justify-between items-center mb-4">
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
  </div> */}

    {/* <div className="table-scroll-container" id="datatable">
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
  
                  </div> */}
  </div>;

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

              <p
                className="text-sm md:text-md text-gray-500  cursor-pointer"
                onClick={() => navigate("/lead-dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-sm  md:text-md  text-[#1ea600]">
                Assigned To{" "}
              </p>
            </div>

            {/* filter section */}

            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end w-full">
                  {/* Start Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="border h-10 px-3 rounded-md"
                      value={filters.from_date}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          from_date: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* End Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="border h-10 px-3 rounded-md"
                      value={filters.to_date}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          to_date: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* employee */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Employee{" "}
                    </label>
                    <Dropdown
                      value={selectedEmployeeDetails}
                      options={employeeOptions}
                      onChange={(e) => setSelectedEmployeeDetails(e.value)}
                      placeholder="Select Employee"
                      filter
                      className="w-full border border-gray-300 text-sm text-[#7C7C7C] rounded-md"
                    />
                  </div>

                  {/* Buttons */}
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
                </div>
              </div>
            </div>

            {/* table section */}
            <div
              className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
            shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
            px-2 py-2 md:px-6 md:py-6"
            >
              <div className="datatable-container mt-4">
                <div className="flex flex-col lg:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-5">
                    <div>
                      <Dropdown
                        value={rows}
                        options={[10, 25, 50, 100].map((v) => ({
                          label: v,
                          value: v,
                        }))}
                        onChange={(e) => onRowsChange(e.value)}
                        className="w-20 border"
                      />

                      <span className=" text-sm text-[#6B7280]">
                        Entries Per Page
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-5">
                    {/* Search box */}
                    {/* <div className="relative w-64">
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
                                </div> */}
                    <div className="relative w-72">
                      <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />

                      <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-gray-200 
    focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />

                      {/* Cancel / Clear button */}
                      {globalFilter && (
                        <button
                          type="button"
                          onClick={() => setGlobalFilter("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                          title="Clear"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="flex justify-between items-center gap-5">
                      <button
                        // onClick={openAddModal}
                        onClick={() => navigate("/lead-assignedto-add")}
                        className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                      >
                        Assign Lead
                      </button>

                      {/* <button
                                    onClick={() => navigate("/lead-assignedto")}
                                    className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                                  >
                                    Assigned To
                                  </button> */}
                    </div>
                  </div>
                </div>
                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    className="mt-8"
                    value={leads}
                    // value={dummyLeads}
                    onPage={onPageChange}
                    first={(page - 1) * rows}
                    onRowClick={(e) => e.originalEvent.stopPropagation()}
                    paginator
                    rows={rows}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    globalFilter={globalFilter}
                    globalFilterFields={[
                      "employee.full_name",
                      "employee.gen_employee_id",
                      "entries_count",
                    ]}
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
            </div>

            {/* Filter Section */}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
                <div className="absolute inset-0" onClick={closeAddModal}></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[80vw]
                  bg-white shadow-lg transform transition-transform duration-500 ease-in-out
                  ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
                >
                  {/* Close Arrow */}
                  <div
                    className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300
                    flex items-center justify-center cursor-pointer"
                    onClick={closeAddModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>
                  <div className="px-5 lg:px-14 py-4 md:py-10 text-[#4A4A4A] font-medium">
                    <p className="text-xl md:text-2xl">Add Lead </p>

                    <div className="w-full mt-5 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-4 py-4 space-x-5">
                      <div className="grid grid-cols-1 gap-5">
                        {/* employee */}
                        <div className="flex items-center justify-between gap-1 w-[50%]">
                          <label className="text-sm font-medium text-[#6B7280]">
                            Employee
                          </label>
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
                          <label className="text-sm font-medium text-[#6B7280]">
                            Platform
                          </label>
                          <MultiSelect
                            className="uniform-field h-10 px-3 w-full md:w-48 rounded-md border text-sm"
                            // value={selectedCategory}
                            value={filters.category}
                            options={categoryOptions}
                            onChange={(e) => {
                              // setSelectedCategory(e.value);
                              setFilters((prev) => ({
                                ...prev,
                                category: e.value,
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
                          <label className="text-sm font-medium text-[#6B7280]">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="border w-full md:w-48 h-10 px-3 rounded-md"
                            value={filters.from_date}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                from_date: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* End Date */}
                        <div className="flex items-center justify-between gap-1 w-[50%]">
                          <label className="text-sm font-medium text-[#6B7280]">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="border w-full md:w-48 h-10 px-3 rounded-md"
                            value={filters.to_date}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                to_date: e.target.value,
                              }))
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
                              setFilters((prev) => ({
                                ...prev,
                                lead_status: e.value,
                              }));
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
                    <div
                      className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-700">
                          Assign Leads
                        </h3>
                        <div className="flex gap-3 text-sm">
                          <button
                            onClick={selectAll}
                            className="text-green-600 hover:underline"
                          >
                            Select All
                          </button>
                          <button
                            onClick={clearAll}
                            className="text-red-500 hover:underline"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>

                      {/* Lead Grid */}
                      {showLeadTable && (
                        <div className="flex flex-col w-full mt-5 rounded-2xl bg-white shadow px-6 py-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-fit">
                            {leads.map((lead) => {
                              const checked =
                                selectedLeads.includes(lead.id) ||
                                lead.isAssignedToSelected;

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
                                      checked={checked}
                                      disabled={lead.disableCheckbox}
                                      onChange={() => handleToggle(lead.id)}
                                      className="mt-1"
                                    />

                                    <div className="flex flex-col gap-1 text-sm w-full">
                                      <p className="font-medium">
                                        {lead.full_name}
                                      </p>
                                      <p className="text-gray-500">
                                        {lead.phone}
                                      </p>

                                      {/* {lead.isAssignedToSelected && (
  <p className="text-xs font-semibold text-orange-700">
    Already assigned to {selectedEmployeeName}
  </p>
)} */}

                                      {lead.isAssignedToOther && (
                                        <p className="text-xs font-semibold text-orange-700">
                                          Assigned to{" "}
                                          {lead.assignedEmployeeName ||
                                            "another employee"}
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

export default LeadAssignedTo;
