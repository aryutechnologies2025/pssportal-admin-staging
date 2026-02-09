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


const LeadAssignedTo = () => {
  let navigate = useNavigate();
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
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isViewStatusOpen, setIsViewStatusOpen] = useState(false);
  const [viewStatus, setViewStatus] = useState(null);
  


  const today = new Date().toISOString().split("T")[0];
    const [filters, setFilters] = useState({
      from_date: today,
      to_date: today,
      category:null,
      lead_status:""
    });
  
      const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  
const dummyEmployees = [
  { label: "Ravi Kumar", value: 101 },
  { label: "Anita Sharma", value: 102 },
  { label: "Suresh Patel", value: 103 },
  { label: "Neha Singh", value: 104 },
  { label: "Mohammed Ali", value: 105 }
];

  const isFilterComplete =
  filters.category &&
  selectedEmployeeDetails &&
  filters.from_date &&
  filters.to_date &&
  filters.lead_status;

  // lead for allocation
  const [selectedLeads, setSelectedLeads] = useState([]);
const [showLeadTable, setShowLeadTable] = useState(false);
 const [selectedRows, setSelectedRows] = useState([]);

  const selectableLeads = leads.filter(l => !l.isAssigned);

  const handleToggle = (id) => {
    setSelectedLeads(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedLeads(selectableLeads.map(l => l.id));
  };

  const clearAll = () => {
    setSelectedLeads([]);
  };
  
 useEffect(() => {
  if (isFilterComplete) {
    fetchLead(filters);
    setShowLeadTable(true);
  } else {
    setShowLeadTable(false);
    setSelectedLeads([]);
  }
}, [
  filters.category,
  filters.from_date,
  filters.to_date,
  filters.lead_status,
  selectedEmployeeDetails
]);

  console.log("viewStatus", viewStatus);

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
    fetchLead(filters);
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
    fetchLead(reset);
  };

  // open view
  const openViewModal = (row) => {
    console.log("OPen view : ", row)
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
  // console.log("leadForm : ",leadForm);

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
    if (!leadForm.full_name) newErrors.full_name = "Enter a Name";
    if (!leadForm.gender) newErrors.gender = "Select Gender";
    if (!leadForm.phone) newErrors.phone = "Enter a Phone Number";
    if (!leadForm.dob) newErrors.dob = "Enter Birth Date";
    if (!leadForm.post_code) newErrors.post_code = "Enter a Postcode";
    if (!leadForm.city) newErrors.city = "Enter a city";
    if (!leadForm.state) newErrors.state = "Enter a State";
    if (leadForm.status === "") newErrors.status = "select Status";
    if (!leadForm.category || leadForm.category.length === 0) newErrors.category = "Select Category";
    //  if (!leadForm.lead_category_id) newErrors.category = "Select Category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // update lead status
  const handleStatusSubmit = async () => {
    try {
      if (!statusForm.status) {
        toast.warning("Please select status");
        return;
      }

      if (statusForm.followUp === "yes" && !statusForm.followUpDate) {
        toast.warning("Please select follow up date");
        return;
      }

      const payload = {
        lead_status: STATUS_MAP[statusForm.status],
        notes: statusForm.notes,
        followup_status: statusForm.followUp === "yes" ? 1 : 0,
        created_by: userid,
        scheduled_date: statusForm.epoDate || null,
        followup_date:
          statusForm.followUp === "yes"
            ? statusForm.followUpDate
            : null,
      };

      if (statusForm.followUp === "yes") {
        payload.followup_date = statusForm.followUpDate;
      }

      const response = await axiosInstance.post(
        `${API_URL}api/lead-management/status-update/${viewStatus.id}`,
        payload
      );
      setTimeout(() => {
        toast.success("Lead status updated successfully");
      }, 600);

      await fetchStatusList(viewStatus.id);
      fetchLead();

      // reset form
      setStatusForm({
        status: "",
        notes: "",
        followUp: "no",
        followUpDate: "",
      });


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
      console.log("Lead create res : ", res);

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
      console.log("Error", err)
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

    // CITY
    if (filters.city) {
      result = result.filter(item =>
        item.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // PLATFORM
    if (filters.platform) {
      result = result.filter(item =>
        item.platform?.toLowerCase() === filters.platform.toLowerCase()
      );
    }

    // AGE
    if (filters.age) {
      const [min, max] = filters.age.split("-");

      result = result.filter(item => {
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
      result = result.filter(item => item.lead_category_id === filters.category);
    }



    console.log("result", result)
    // lead status
    if (filters.lead_status) {
      console.log("filtering by status : ", filters.lead_status)
      let a = result.map(item => console.log(item.lead_status))
      result = result.filter(item => item.lead_status === filters.lead_status);
    }

    console.log("Filtered results count:", result.length);
    return result;
  };

  //  list
  // const fetchLead = async (customFilters) => {
  //   const appliedFilters = customFilters ?? filters;

  //   try {
  //     setLoading(true);

  //     const params = {};

  //     if (appliedFilters.gender)
  //       params.gender = appliedFilters.gender.toLowerCase();

  //     if (appliedFilters.platform)
  //       params.platform = appliedFilters.platform.toLowerCase();

  //     if (appliedFilters.city)
  //       params.city = appliedFilters.city.toLowerCase();

  //     if (appliedFilters.from_date)
  //       params.from_date = appliedFilters.from_date;

  //     if (appliedFilters.to_date)
  //       params.to_date = appliedFilters.to_date;

  //     if (appliedFilters.category)
  //       params.lead_category_id = appliedFilters.category;

  //     if (appliedFilters.lead_status) params.lead_status = appliedFilters.lead_status;

  //     const res = await axiosInstance.get(
  //       // `${API_URL}api/lead-management`,
  //       // { params }
  //     );

  //     console.log("API LIST : ", res.data.data);

  //     if (res.data.success) {
  //       let data = res.data.data || [];

  //       // Normalize status values for consistent display
  //       data = data.map(lead => ({
  //         ...lead,
  //         status: lead.status?.toString() || "", // Ensure status is string
  //         lead_status: normalizeLeadStatus(lead.lead_status),
  //         category_name: res.data.categories?.find(cat => cat.id == lead.lead_category_id)?.name || "-",
  //         category_id: lead.lead_category_id // Use the correct field
  //       }));

  //       //  FRONTEND FILTERING
  //       data = applyFrontendFilters(data, appliedFilters);

  //       setLeads(data);
  //       setTotalRecords(data.length);
  //       setGenderOptions(res.data.gender || []);
  //       setPlatformOptions(res.data.platforms || {});
  //       setCityOptions(res.data.cities || []);
  //       // setCategoryOptions(res.data.categories || []);
  //       // Set category options from response
  //       // if (res.data.lead_category) {
  //       //   const categoryOptions = res.data.lead_category.map(cat => ({
  //       //     label: cat.name,
  //       //     value: cat.id
  //       //   }));
  //       //   setCategoryOptions(categoryOptions);
  //       // }

  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed To Fetch Leads");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchLead = async (appliedFilters) => {
  setLoading(true);
  try {
    // Simulated API Logic
    let data = dummyLeads; 

    // 1. Test your normalization logic
    data = data.map(lead => ({
      ...lead,
      lead_status: normalizeLeadStatus(lead.lead_status),
    }));

    // 2. Test your Frontend Filtering
    if (appliedFilters?.city) {
        data = data.filter(item => item.city.toLowerCase() === appliedFilters.city.toLowerCase());
    }

    setLeads(data);
    setTotalRecords(data.length);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // status api get showing fetching
  const [statusList, setStatusList] = useState([]);

  console.log("statusList", statusList);



  // useEffect(() => {
  //   if (viewStatus?.id) {
  //     fetchStatusList(viewStatus.id);
  //   }
  // }, [viewStatus?.id]);

  // status view (view Api)
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

  // Open import
  const openImportAddModal = () => {
    setIsImportAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  // close import
  const closeImportAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsImportAddModalOpen(false), 250);
  };


  // import
  const handleFileSubmit = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.warning("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFiles[0]); // MUST be File object
      formData.append("created_by", userid);

      console.log("FILE OBJECT:", selectedFiles[0]); // should show name, size

      if (selectedCategory) {
        formData.append("lead_category_id", selectedCategory);
      }

      const res = await axiosInstance.post(
        `${API_URL}api/lead-management/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.success) {
        toast.success(res.data?.message || "File imported successfully");

        setTimeout(() => {
          closeImportAddModal();
          fetchLead();
        }, 600);

      } else {
        toast.error(res.data?.message || "Import failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Import failed");
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
        fetchLead(); // refresh table
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
            label: item.name,   // shown in dropdown
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
    field: "lead_info",
    header: "Lead Details",
    body: (row) => (
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-800">{Capitalise(row.full_name)}</span>
        <span className="text-gray-500">-</span>
        <span className="text-gray-600">{row.phone}</span>
        {row.isAssigned && (
          <span className="ml-2 px-2 py-0.5 text-[10px] bg-orange-100 text-orange-600 rounded-full border border-orange-200">
            Already Allocated
          </span>
        )}
      </div>
    ),
  },
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

  <DataTable
    value={leads}
    selection={selectedLeads}
    onSelectionChange={(e) => setSelectedLeads(e.value)}
    dataKey="id"
    responsiveLayout="scroll"
    showHeaders={false} // Matches your sketch (minimalist style)
    className="compact-assign-table"
    // Logic to highlight already allocated leads in Orange
    rowClassName={(row) => ({
      'bg-orange-50 border-l-4 border-orange-400': row.isAssigned,
      'hover:bg-gray-50': !row.isAssigned
    })}
  >
    <Column
      selectionMode="multiple"
      headerStyle={{ width: "3rem" }}
      // Disable checkbox if lead is already assigned
      selectionDisabled={(row) => row.isAssigned}
    />
    
    {columns.map((col, i) => (
      <Column key={i} {...col} />
    ))}
  </DataTable>
</div>


  const statusDropdownOptions = [
    { label: "Open", value: "open" },
    { label: "Joined", value: "joined" },
    { label: "Interested / Scheduled", value: "interested" },
    { label: "Not Interested", value: "not_interested" },
    { label: "Follow Up", value: "follow_up" },
    { label: "Not Picked", value: "not_picked" },
  ];

  const dummyLeads = [
  {
    id: 1,
    full_name: "John Doe",
    phone: "9876543210",
    lead_status: "open",
    isAssigned: false, // Normal Row
    city: "Chennai",
    age: 24,
    lead_category_id: 5
  },
  {
    id: 2,
    full_name: "Anitha Raman",
    phone: "9123456789",
    lead_status: "Interested / scheduled",
    isAssigned: true, // Should show Orange
    city: "Bangalore",
    age: 30,
    lead_category_id: 5,
    employee_name: "Anitha"

  },
  {
    id: 3,
    full_name: "Suresh Raina",
    phone: "9988776655",
    lead_status: "follow_up",
    isAssigned: false, // Normal Row
    city: "Chennai",
    age: 28,
    lead_category_id: 5
  },
  {
    id: 4,
    full_name: "Priya Lakshmi",
    phone: "8877665544",
    lead_status: "not_picked",
    isAssigned: true, // Should show Orange
    city: "Coimbatore",
    age: 22,
    lead_category_id: 5,
    employee_name: "Priya"
  },
  {
    id: 5,
    full_name: "Vikram Seth",
    phone: "7766554433",
    lead_status: "joined",
    isAssigned: false, // Normal Row
    city: "Chennai",
    age: 35,
    lead_category_id: 5
  }
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
              <p className="text-sm  md:text-md  text-[#1ea600]">Assigned To </p>
            </div>

            {/* Filter Section */}
            <div className="w-full mt-5 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-4 py-4 space-x-5">

              <div className="grid grid-cols-1 gap-5">

                  {/* employee */}
                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">Employee</label>
                  <Dropdown
                    value={selectedEmployeeDetails}
                    onChange={(e) => setSelectedEmployeeDetails(e.value)}
                    options={selectedEmployee}
                    optionLabel="label"
                    placeholder="Select Employee"
                    filter
                    className="uniform-field w-full md:w-48 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>

                               {/* category */}
                <div className="flex items-center justify-between gap-1 w-[50%]">
                  <label className="text-sm font-medium text-[#6B7280]">Category</label>
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
                    placeholder="Select Category"
                    filter
                    filterPlaceholder="Search category"

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

                  <MultiSelect
                    value={filters.lead_status}
                    options={statusDropdownOptions}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, lead_status: e.value }))
                    }
                    placeholder="Select Status"
                    className="uniform-field h-10 w-full md:w-48 rounded-md border border-[#D9D9D9] text-sm"
                    panelClassName="text-sm"
                    filter
                  />
                </div>
              </div>

              </div>



{/* {showLeadTable && ( */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {leads.map(lead => {
          const checked = selectedLeads.includes(lead.id);

          return (
            <div
              key={lead.id}
              className={`flex items-center gap-3 p-3 rounded-lg border 
                ${lead.isAssigned
                  ? "bg-orange-100 border-orange-400 text-orange-700"
                  : "bg-gray-50 hover:bg-gray-100"}
              `}
            >
              <input
                type="checkbox"
                disabled={lead.isAssigned}
                checked={checked}
                onChange={() => handleToggle(lead.id)}
              />

              <div className="text-sm">
                <p className="font-medium">{lead.full_name}</p>
                <p className="text-gray-500">{lead.phone}</p>
              </div>

              {lead.isAssigned && (
  <span className="ml-auto text-xs font-semibold text-orange-700">
    Already Assigned to&nbsp;
    <span className="font-bold">
      {lead.employee_name || "Employee"}
    </span>
  </span>
)}

            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-6">
        <button
          disabled={selectedLeads.length === 0}
          className="px-6 py-2 rounded-lg bg-green-600 text-white disabled:bg-gray-300"
        >
          Submit
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

export default LeadAssignedTo;