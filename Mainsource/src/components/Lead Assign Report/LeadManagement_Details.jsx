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



const LeadManagement_Details = () => {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const multiSelectRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isImportAddModalOpen, setIsImportAddModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  // console.log("....erors.... : ", errors);
  const [leads, setLeads] = useState([]);
  // console.log("leads :", leads)
  const [totalRecords, setTotalRecords] = useState(0);
  const [editLeadForm, setEditLeadForm] = useState(null);
  // console.log("edit value", editLeadForm);
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
  const cityDropdownOptions = cityOptions.map(city => ({
    label: city,
    value: city
  }));


  const [employeeOptions, setEmployeeOptions] = useState([]);
  const employeeDropdownOptions = employeeOptions.map(employee => ({
    label: employee.name,
    value: employee.id
  }));

  const today = new Date().toISOString().split("T")[0];

  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  const companyDropdown = companyOptions.map((company) => ({
    label: company.company_name,
    value: company.id,
    company_emp_id: company.company_emp_id
  }));


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


  const validateImport = () => {
    let newErrors = {};

    if (!selectedFiles || selectedFiles.length === 0) {
      newErrors.file = "Please select at least one file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [filters, setFilters] = useState({
    from_date: today,
    assigned_employee: ""
    });


  const handleApplyFilter = () => {
    fetchLead(filters);
  };

  const handleResetFilter = () => {
    const reset = {
      from_date: today,
      assigned_employee: "",
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

  const closeStatusModal = () => {
    setIsViewStatusOpen(false);
    setViewStatus(null);
    setSelectedCompany([]);
    setStatusForm({
      status: "",
      notes: "",
      followUp: "no",
      followUpDate: "",
      epoDate: "",
      company_ids: []
    });
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

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
    setErrors((prev) => ({ ...prev, file: null }));
  };

  const [leadForm, setLeadForm] = useState({
    is_organic: "",
    full_name: "",
    gender: "",
    phone: "",
    dob: "",
    post_code: "",
    city: "",
    state: "",
    status: "",
    category: null,
    // category:[]
  });
  // open add
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  // close add
  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsAddModalOpen(false);
      setLeadForm({
        is_organic: "",
        full_name: "",
        gender: "",
        phone: "",
        dob: "",
        post_code: "",
        city: "",
        state: "",
        status: "",
        category: ""
      });
      setErrors({});
    }, 300);
  };
  // open edit
  const openEditModal = (lead) => {
    console.log("Open Edit modal : ", lead)
    setEditLeadForm({
      id: lead.id,
      is_organic: lead.is_organic ? "true" : "false",
      full_name: lead.full_name,
      gender: lead.gender,
      phone: lead.phone,
      dob: lead.date_of_birth,
      post_code: lead.post_code,
      city: lead.city,
      state: lead.state,
      // category: lead.category_id,
      //  lead_category_id: lead.lead_category_id
      //   ? [lead.lead_category_id]
      //   : [],
      lead_category_id: lead.lead_category_id ?? null,
      status: lead.status?.toString()
    });

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  // close edit 
  const closeEditModal = () => {
    setIsAnimating(false);
    setErrors({});
    setTimeout(() => {
      setIsEditModalOpen(false);
      setEditLeadForm(null);
    }, 250);
  };

  // update
  const handleUpdateLead = async () => {

    if (!validateEditForm(editLeadForm)) {
      toast.error("Please fill all required fields");
      return; // Stop if invalid
    }

    try {
      const payload = {
        is_organic: editLeadForm.is_organic === "true" ? "true" : "false",
        full_name: editLeadForm.full_name,
        gender: editLeadForm.gender,
        phone: editLeadForm.phone,
        date_of_birth: editLeadForm.dob,
        post_code: editLeadForm.post_code,
        city: editLeadForm.city,
        state: editLeadForm.state,
        // category_id: editLeadForm.category,
        lead_category_id: editLeadForm.lead_category_id,
        // lead_category_id: editLeadForm.lead_category_id[0] || null,
        status: editLeadForm.status,
        updated_by: userid
      };

      const res = await axiosInstance.post(
        `${API_URL}api/lead-management/update/${editLeadForm.id}`,
        payload
      );

      if (res.data.success || res.data.status) {
        setTimeout(() => {
          toast.success(res.data?.message || "Lead updated successfully");
        }, 600);
        closeEditModal();
        fetchLead();
      }
    } catch (error) {
      toast.error("Failed to update lead");
    }
  };

  const handleChange = (field, value) => {
    setLeadForm(prev => ({ ...prev, [field]: value }));
  };
  //  validation lead form
  const validateLeadForm = () => {
    let newErrors = {};

    if (!leadForm.is_organic) newErrors.is_organic = "Required";
    // if(!leadForm.lead_category_id) newErrors.lead_category_id = "Select Category";
    if (!leadForm.full_name) newErrors.full_name = "Enter A Name";
    if (!leadForm.gender) newErrors.gender = "Select Gender";
    if (!leadForm.phone) newErrors.phone = "Enter A Phone Number";
    if (!leadForm.dob) newErrors.dob = "Enter Birth Date";
    if (!leadForm.post_code) newErrors.post_code = "Enter A Postcode";
    if (!leadForm.city) newErrors.city = "Enter A City";
    if (!leadForm.state) newErrors.state = "Enter A State";
    if (leadForm.status === "") newErrors.status = "Select Status";
    if (!leadForm.category || leadForm.category.length === 0) newErrors.category = "Select Platform";
    //  if (!leadForm.lead_category_id) newErrors.category = "Select Category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = (formData) => {
    let newErrors = {};

    if (!editLeadForm.is_organic) newErrors.is_organic = "Required";
    if (!editLeadForm.full_name) newErrors.full_name = "Enter A Name";
    if (!editLeadForm.gender) newErrors.gender = "Select Gender";
    if (!editLeadForm.phone) newErrors.phone = "Enter A Phone Number";
    if (!editLeadForm.dob) newErrors.dob = "Enter Birth Date";
    if (!editLeadForm.post_code) newErrors.post_code = "Enter A Postcode";
    if (!editLeadForm.city) newErrors.city = "Enter A City";
    if (!editLeadForm.state) newErrors.state = "Enter A State";
    if (!editLeadForm.status || editLeadForm.status === "") newErrors.status = "Select Status";
    if (!editLeadForm.lead_category_id) newErrors.category = "Select Category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // update lead status
  const handleStatusSubmit = async () => {
    try {
      if (!statusForm.status) {
        toast.warning("Please Select Status");
        return;
      }

      if (statusForm.followUp === "yes" && !statusForm.followUpDate) {
        toast.warning("Please Select Follow Up Date");
        return;
      }

      const payload = {

        lead_status: statusForm.status,
        notes: statusForm.notes,
        followup_status: statusForm.followUp === "yes" ? 1 : 0,
        created_by: userid,
        scheduled_date: statusForm.epoDate || null,
        followup_date: statusForm.followUp === "yes" ? statusForm.followUpDate : null,
        company_id: statusForm.company_id.length
          ? statusForm.company_id.join(",")
          : null
      };

      if (statusForm.followUp === "yes") {
        payload.followup_date = statusForm.followUpDate;
      }

      const response = await axiosInstance.post(
        `${API_URL}api/lead-management/status-update/${viewStatus.id}`,
        payload
      );
      setTimeout(() => {
        toast.success("Lead Status Updated Successfully");
      }, 600);

      await fetchStatusList(viewStatus.id);
      fetchLead();

      // reset form
      setStatusForm({
        status: "",
        notes: "",
        followUp: "no",
        followUpDate: "",
        epoDate: "",
        company_id: []
      });
      setSelectedCompany([]);

    } catch (error) {
      console.error("Status update failed", error);
      toast.error("Failed to update lead status");
    }
  };

  // create
  const handleAddLeadSubmit = async (e) => {
    e.preventDefault();

    if (!validateLeadForm()) return;
    if (submitting) return;

    setSubmitting(true);

    try {
      const payload = {
        is_organic: leadForm.is_organic === "true" ? "true" : "false",
        full_name: leadForm.full_name,
        gender: leadForm.gender,
        phone: leadForm.phone,
        date_of_birth: leadForm.dob,
        post_code: leadForm.post_code,
        city: leadForm.city,
        state: leadForm.state,
        // category_id: leadForm.category,
        lead_category_id: leadForm.category,
        status: leadForm.status,
        created_by: userid
      };

      const res = await axiosInstance.post(
        `${API_URL}api/lead-management/create`,
        payload
      );

      if (res.data.success || res.data.status) {
        setTimeout(() => {
          toast.success(res.data?.message || "Lead created successfully");
        }, 600);
        closeAddModal();
        fetchLead({});
      } else {
        toast.error("Failed to create lead");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch lead from the API
  useEffect(() => {
    fetchLead();
  }, []);

  const applyFrontendFilters = (data, filters) => {
    let result = [...data];
    
    if (filters.lead_status) {
      let a = result.map(item => console.log(item.lead_status))
      result = result.filter(item => item.lead_status === filters.lead_status);
    }
    return result;
  };
  // CHANGE THIS FUNCTION - Remove applyFrontendFilters
  const fetchLead = async (appliedFilters) => {
    const filtersToUse = appliedFilters || filters;

    try {
      setLoading(true);

      const params = {};

      if (filtersToUse.gender)
        params.gender = filtersToUse.gender.toLowerCase();

      if (filtersToUse.city)
        params.city = filtersToUse.city.toLowerCase();

      if (filtersToUse.from_date)
        params.from_date = filtersToUse.from_date;

      if (filtersToUse.to_date)
        params.to_date = filtersToUse.to_date;

      if (filtersToUse.category)
        params.lead_category_id = filtersToUse.category;

      if (filtersToUse.employee_id)
        params.employee_id = filtersToUse.employee_id;

      if (filtersToUse.lead_status)
        params.lead_status = filtersToUse.lead_status;

      const res = await axiosInstance.get(
        `${API_URL}api/lead-management`,
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
        setCityOptions(res.data.cities || []);
        setEmployeeOptions(res.data.employees || []);

        if (res.data.companies) {
          setCompanyOptions(res.data.companies);
        }

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

  const REVERSE_STATUS_MAP = Object.fromEntries(
    Object.entries(STATUS_MAP).map(([k, v]) => [v, k])
  );

  const getStatusValue = (label) => {
    return Object.keys(STATUS_MAP).find(
      key => STATUS_MAP[key] === label
    ) || "";
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


  const [selectedRows, setSelectedRows] = useState([]);

  const allSelected =
    leads.length > 0 && selectedRows.length === leads.length;

  const toggleSelectAll = () => {
    if (selectedRows.length === leads.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(leads.map(row => row.id));
    }
  };


  const toggleRowSelection = (id) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
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
          <select
            className="border p-1"
            value={row.lead_status}
          >
            {Object.entries(STATUS_MAP).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <button
            onClick={() => openStatusView(row)}
            className="text-blue-600"
          >
            <FaEye />
          </button>
        </div>
      ),
    },

    {
      field: "Action",
      header: "Action",
      body: (row) => (
        <div className="flex justify-center gap-3">
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
                {/* Assigned Date */}
                 <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#6B7280]">Assign Date</label>
                  <input
                    type="date"
                    className="border h-10 px-3 rounded-md"
                    value={filters.from_date}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, from_date: e.target.value }))
                    }
                  />
                </div>



                {/* Assigned Employee */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#6B7280]">
                    Assigned Employee
                  </label>

                  <Dropdown
                    value={filters.assigned_employee}
                    options={employeeDropdownOptions}
                    onChange={(e) =>
                      setFilters(prev => ({
                        ...prev,
                        assigned_employee: e.value
                      }))
                    }
                    placeholder="Select Employee"
                    filter
                    filterPlaceholder="Search employee"
                    className="h-10 rounded-md border border-[#D9D9D9] text-sm"
                    panelClassName="text-sm"
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

            {/* Add Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
                <div className="absolute inset-0" onClick={closeAddModal}></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[60vw]
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

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                      {/* Is Organic */}
                      <div className="w-full flex justify-between items-start">
                        <label className="text-md font-medium ">
                          Is Organic <span className="text-red-500">*</span>
                        </label>

                        {/* Container for Radio Group + Error message */}
                        <div className="w-[50%] flex flex-col">
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="is_organic"
                                value="true"
                                checked={leadForm.is_organic === "true"}
                                onChange={(e) => handleChange("is_organic", e.target.value)}
                                className="accent-green-600"
                              />
                              Yes
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="is_organic"
                                value="false"
                                checked={leadForm.is_organic === "false"}
                                onChange={(e) => handleChange("is_organic", e.target.value)}
                                className="accent-green-600"
                              />
                              No
                            </label>
                          </div>

                          {/* Error message now sits directly under the Yes/No options */}
                          {errors.is_organic && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                              {errors.is_organic}
                            </p>
                          )}
                        </div>
                      </div>


                      {/* category */}
                      {/* <div className="mt-6 flex justify-between items-center">
                  <label className="text-sm font-medium">Category</label>
                  <div className="w-[50%]">
                  <MultiSelect
                    className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                    value={selectedCategory}
                    // value={leadForm.lead_category_id}
                    
    options={categoryOptions}
                    onChange={(e) => {
      setSelectedCategory(e.value);
      handleChange("category", e.value);
    }}
                    placeholder="Select Category"
                    filter
                    filterPlaceholder="Search category"
                    
                    panelClassName="text-sm"
                  />
                  {errors.lead_category_id && (
      <p className="text-red-500 text-sm mt-1">{errors.lead_category_id}</p>
    )}
                    </div>
                </div> */}

                      <div className="w-full flex justify-between items-center">
                        <label className="text-sm font-medium">Platform
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <Dropdown
                            className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                            // value={selectedCategory}
                            value={leadForm.category}

                            options={categoryOptions}
                            onChange={(e) =>
                              setLeadForm(prev => ({
                                ...prev,
                                category: e.value
                              }))
                            }
                            placeholder="Select Platform"
                            filter
                            filterPlaceholder="Search Platform"

                            panelClassName="text-sm"
                          />
                          {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                          )}
                        </div>
                      </div>



                      {/* Full Name */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            value={leadForm.full_name}
                            onChange={(e) =>
                              handleChange("full_name", e.target.value)
                            }
                            placeholder="Enter full name"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.full_name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.full_name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="date"
                            value={leadForm.dob}
                            onChange={(e) => handleChange("dob", e.target.value)}
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.dob && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.dob}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Post Code */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Post Code <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="number"
                            value={leadForm.post_code}
                            onChange={(e) => handleChange("post_code", e.target.value)}
                            placeholder="Enter post code"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.post_code && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.post_code}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* City */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            value={leadForm.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            placeholder="Enter city"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                          )}
                        </div>
                      </div>

                      {/* State */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          State <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            value={leadForm.state}
                            onChange={(e) => handleChange("state", e.target.value)}
                            placeholder="Enter state"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.state}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Gender <span className="text-red-500">*</span>
                        </label>

                        <div className="w-[50%]">
                          <select
                            value={leadForm.gender}
                            onChange={(e) => handleChange("gender", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.gender && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.gender}
                            </p>
                          )}
                        </div>
                      </div>


                      {/* Phone */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={10}
                            value={leadForm.phone}
                            onChange={(e) =>
                              handleChange("phone", e.target.value)
                            }
                            placeholder="Enter phone number"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>



                      {/* Status */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <select
                            value={leadForm.status}
                            onChange={(e) =>
                              handleChange("status", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          >
                            <option value="">Select Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {errors.status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.status}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-10">
                      <button
                        onClick={closeAddModal}
                        className="border border-[#7C7C7C] text-[#7C7C7C]
            hover:bg-[#FEE2E2] hover:text-[#DC2626]
            px-5 py-2 rounded-[10px]"
                      >
                        Cancel
                      </button>

                      <button
                        disabled={submitting}
                        type="button"
                        onClick={handleAddLeadSubmit}
                        className="bg-[#1ea600] hover:bg-[#4BB452]
            text-white px-5 py-2 rounded-[10px]
            disabled:opacity-50"
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
                <div className="absolute inset-0" onClick={closeEditModal}></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[60vw]
        bg-white shadow-lg transform transition-transform duration-500 ease-in-out
        ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
                >
                  {/* Close Arrow */}
                  <div
                    className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    onClick={closeEditModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="px-5 lg:px-14 py-4 md:py-10 text-[#4A4A4A] font-medium">
                    <p className="text-xl md:text-2xl">Edit Lead </p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                      {/* Is Organic */}
                      <div className="w-full flex flex-col">
                        <div className="flex justify-between items-center">
                          <label className="text-md font-medium">
                            Is Organic <span className="text-red-500">*</span>
                          </label>

                          <div className="w-[50%] flex gap-6">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="edit_is_organic"
                                value="true"
                                checked={editLeadForm?.is_organic === "true"}
                                onChange={(e) =>
                                  setEditLeadForm({
                                    ...editLeadForm,
                                    is_organic: e.target.value,
                                  })
                                }
                              />
                              Yes
                            </label>

                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="edit_is_organic"
                                value="false"
                                checked={editLeadForm?.is_organic === "false"}
                                onChange={(e) =>
                                  setEditLeadForm({
                                    ...editLeadForm,
                                    is_organic: e.target.value,
                                  })
                                }
                              />
                              No
                            </label>
                          </div>
                        </div>

                        {/* Error  */}
                        {errors.is_organic && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.is_organic}
                          </p>
                        )}
                      </div>




                      {/* category */}
                      {/* <div className="w-full flex justify-between items-center">
                  <label className="text-sm font-medium text-[#6B7280]">Category</label>
                  <div className="w-[50%]">
                  <MultiSelect
                    className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                    value={editLeadForm?.leadcategory_id || ""}
                    
    options={categoryOptions}
                    onChange={(e) => {
      // setSelectedCategory(e.value);
      setEditLeadForm({ ...editLeadForm, category_id: e.value });
    }}
                    placeholder="Select Category"
                    filter
                    filterPlaceholder="Search category"
                    
                    panelClassName="text-sm"
                  />
                    </div>
                  


                </div> */}

                      <div className="w-full flex justify-between items-center">
                        <label className="text-sm font-medium text-[#6B7280]">Platform</label>
                        <div className="w-[50%]">
                          <Dropdown
                            className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                            value={editLeadForm?.lead_category_id || ""}

                            options={categoryOptions}
                            onChange={(e) =>
                              setEditLeadForm(prev => ({
                                ...prev,
                                lead_category_id: e.value
                              }))
                            }
                            placeholder="Select Platform"
                            filter
                            filterPlaceholder="Search Platform"

                            panelClassName="text-sm"
                          />
                          {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                          )}
                        </div>
                      </div>

                      {/* Full Name */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            value={editLeadForm?.full_name || ""}
                            onChange={(e) =>
                              setEditLeadForm({ ...editLeadForm, full_name: e.target.value })
                            }
                            placeholder="Enter full name"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.full_name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.full_name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="date"
                            value={editLeadForm?.dob || ""}
                            onChange={(e) =>
                              setEditLeadForm({ ...editLeadForm, dob: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.dob && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.dob}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Post Code */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Post Code <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            value={editLeadForm?.post_code || ""}
                            onChange={(e) =>
                              setEditLeadForm({ ...editLeadForm, post_code: e.target.value })
                            }
                            placeholder="Enter post code"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.post_code && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.post_code}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* City */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            value={editLeadForm?.city || ""}
                            onChange={(e) =>
                              setEditLeadForm({ ...editLeadForm, city: e.target.value })
                            }
                            placeholder="Enter city"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                          )}
                        </div>
                      </div>

                      {/* State */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          State <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            value={editLeadForm?.state || ""}
                            onChange={(e) =>
                              setEditLeadForm({ ...editLeadForm, state: e.target.value })
                            }
                            placeholder="Enter state"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.state}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Gender <span className="text-red-500">*</span>
                        </label>

                        <div className="w-[50%]">
                          <select
                            value={editLeadForm?.gender || ""}
                            onChange={(e) =>
                              setEditLeadForm({ ...editLeadForm, gender: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.gender && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.gender}
                            </p>
                          )}
                        </div>
                      </div>


                      {/* Phone */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={editLeadForm?.phone || ""}
                            maxLength={10}
                            onChange={(e) =>
                              setEditLeadForm({ ...editLeadForm, phone: e.target.value })
                            }
                            placeholder="Enter Phone Number"
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>



                      {/* Status */}
                      <div className="w-full flex justify-between items-center">
                        <label className="text-md font-medium">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <select
                            value={editLeadForm?.status || ""}
                            onChange={(e) =>
                              setEditLeadForm({ ...editLeadForm, status: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                          >
                            <option value="">Select Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>
                        {errors.status && (
                          <p className="text-red-500 text-sm mt-1"> {errors.status}</p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-10">
                      <button
                        onClick={closeEditModal}
                        className="border border-[#7C7C7C] text-[#7C7C7C]
            hover:bg-[#FEE2E2] hover:text-[#DC2626]
            px-5 py-2 rounded-[10px]"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleUpdateLead}
                        className="bg-[#1ea600] hover:bg-[#4BB452]
            text-white px-5 py-2 rounded-[10px]"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* status */}
            {isViewStatusOpen && viewStatus && (
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={() => setIsViewStatusOpen(false)}
              >
                {/* STOP CLICK INSIDE */}
                <div
                  className="bg-white rounded-xl w-full max-w-4xl mx-4 shadow-xl h-[80vh] flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >

                  {/* HEADER */}
                  <div className="px-6 py-4 border-b bg-green-50 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-green-700">
                      Update Lead Status
                    </h2>
                    <button
                      onClick={() => setIsViewStatusOpen(false)}
                      className="p-1 rounded-full
                   text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
                    >
                      <IoClose size={22} />
                    </button>
                  </div>

                  {/* SCROLLABLE BODY */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 green-scroll">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        className="border p-2 w-full rounded-md focus:ring-2 focus:ring-green-400"
                        value={statusForm.status}
                        onChange={(e) =>
                          setStatusForm({ ...statusForm, status: e.target.value })
                        }
                      >
                        <option value="open">Open</option>
                        <option value="joined">Joined</option>
                        <option value="interested">Interested / schedule</option>
                        <option value="not_interested">Not Interested</option>
                        <option value="follow_up">Follow Up</option>
                        <option value="not_picked">Not Picked</option>
                      </select>
                    </div>

                    {/* company */}

                    <div>
                      <label className="block text-sm font-medium mb-1">Company</label>

                      <div className="w-[60%] md:w-[50%]">
                        <MultiSelect
                          value={selectedCompany}
                          options={companyDropdown}
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select Company"
                          filterPlaceholder="Search companies..."
                          filter
                          className="w-full border border-gray-300 rounded-lg"
                          onChange={(e) => {
                            setSelectedCompany(e.value);
                            setStatusForm({
                              ...statusForm,
                              company_id: e.value
                            });
                          }}
                        />
                      </div>
                    </div>

                    {/* Interested */}
                    {statusForm.status === "interested" && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Schedule Date
                        </label>
                        <input
                          type="date"
                          className="border p-2 w-full rounded-md focus:ring-2 focus:ring-green-400"
                          value={statusForm.epoDate}
                          onChange={(e) =>
                            setStatusForm({ ...statusForm, epoDate: e.target.value })
                          }
                        />
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <textarea
                        className="border p-2 w-full rounded-md focus:ring-2 focus:ring-green-400"
                        rows="3"
                        value={statusForm.notes}
                        onChange={(e) =>
                          setStatusForm({ ...statusForm, notes: e.target.value })
                        }
                      />
                    </div>

                    {/* Follow up */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* <div>
            <label className="block text-sm font-medium mb-1">
              Next Follow Up?
            </label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="yes"
                  checked={statusForm.followUp === "yes"}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, followUp: e.target.value })
                  }
                />
                Yes
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="no"
                  checked={statusForm.followUp === "no"}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, followUp: e.target.value })
                  }
                />
                No
              </label>
            </div>
          </div> */}

                      {/* {statusForm.followUp === "yes" && ( */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Follow Up Date
                        </label>
                        <input
                          type="date"
                          className="border p-2 w-full rounded-md focus:ring-2 focus:ring-green-400"
                          value={statusForm.followUpDate}
                          onChange={(e) =>
                            setStatusForm({
                              ...statusForm,
                              followUpDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      {/* )} */}
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                      <button
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        onClick={() => setIsViewStatusOpen(false)}
                      >
                        Cancel
                      </button>

                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        onClick={handleStatusSubmit}
                      >
                        Submit
                      </button>
                    </div>

                    {/* Status History */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="border px-3 py-2">S.No</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">Follow Up</th>
                            <th className="border px-3 py-2">Notes</th>
                            <th className="border px-3 py-2">Company</th>
                            <th className="border px-3 py-2">Created Date</th>
                            {/* <th className="border px-3 py-2">Follow Date</th> */}
                            <th className="border px-3 py-2">Scheduled Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statusList?.length ? (
                            statusList.map((item, index) => (
                              <tr key={index} className="hover:bg-green-50">
                                <td className="border px-3 py-2 text-center">
                                  {index + 1}
                                </td>
                                <td className="border px-3 py-2 capitalize">
                                  {item.status}
                                </td>
                                <td className="border px-3 py-2 text-center">
                                  {/* {item.followUp ? "Yes" : "No"} */}
                                  {item.followup_status === "1" ? "Yes" : "No"}

                                </td>
                                <td className="border px-3 py-2">
                                  {Capitalise(item.notes || "-")}
                                </td>
                                <td className="border px-3 py-2">
                                  {item.company_id?.split(",")
                                    ?.map(id =>
                                      companyDropdown.find(c => c.value == id)?.label
                                    )
                                    ?.filter(Boolean)
                                    ?.join(", ") || "-"}
                                </td>
                                <td className="border px-3 py-2">
                                  {formatToDDMMYYYY(item.created_at)}
                                </td>
                                {/* <td className="border px-3 py-2">
                      {formatToDDMMYYYY(item.followup_date)}
                    </td> */}
                                <td className="border px-3 py-2">
                                  {formatToDDMMYYYY(item.scheduled_date)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="border px-3 py-4 text-center text-gray-500"
                              >
                                No status history found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* FOOTER (NORMAL POSITION) */}

                  </div>
                </div>
              </div>
            )}


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
                          {/* <th className="border px-3 py-2">Follow Date</th> */}
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
                                {item.notes || "-"}
                              </td>
                              <td className="border px-3 py-2">
                                {item.company_id?.split(",")
                                  ?.map(id =>
                                    companyDropdown.find(c => c.value == id)?.label
                                  )
                                  ?.filter(Boolean)
                                  ?.join(", ") || "-"}
                              </td>
                              <td className="border px-3 py-2">
                                {formatToDDMMYYYY(item.created_at)}
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
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
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
                      Lead
                    </p>

                    {/* category */}
                    <div className="mt-3 flex justify-between items-center">
                      <label className="block text-md font-medium">Platform</label>
                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          className="uniform-field w-full px-3 py-2 border border-gray-300 rounded-lg"
                          // value={selectedCategory}
                          value={filters.category_id || ""}
                          options={categoryOptions}
                          onChange={(e) => {
                            setSelectedCategory(e.value);
                            setFilters(prev => ({
                              ...prev,
                              category_id: e.value
                            }));
                          }}
                          placeholder="Select Platform"
                          filter
                          filterPlaceholder="Search Platform"

                          panelClassName="text-sm"
                        />
                        {errors.category && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.category}
                          </p>
                        )}


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
                          accept=".csv,.xls,.xlsx"
                          onChange={(e) => setSelectedFiles(e.target.files)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
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
                        type="button"
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
      )
      }
      <Footer />
    </div >
  );
};
export default LeadManagement_Details;
