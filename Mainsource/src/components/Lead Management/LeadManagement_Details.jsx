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



const LeadManagement_Details = () => {
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

  console.log("viewStatus", viewStatus);

  const today = new Date().toISOString().split("T")[0];

  const [statusForm, setStatusForm] = useState({
    status: "",
    notes: "",
    followUp: "no",
    followUpDate: "",
    epoDate: ""
  });

  const STATUS_MAP = {
    open: "Open",
    contacted: "Contacted",
    interested: "Interested",
    not_interested: "Not Interested",
    customer: "Customer",
    bad_timing: "Bad Timing",
    not_picked: "Not Picked",
    future_lead: "Future Lead",
  };

  const validateImport = () => {
    let newErrors = {};

    if (!selectedFiles || selectedFiles.length === 0) {
      newErrors.file = "Please select at least one file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [filters, setFilters] = useState({
    from_date: today,
    to_date: today,
    gender: "",
    platform: "",
    age: "",
    city: ""
  });

  // apply filter
  const handleApplyFilter = () => {
    fetchLead(filters);
  };
  console.log("filter check", handleApplyFilter)


  const handleResetFilter = () => {
    const reset = {
      gender: "",
      platform: "",
      age: "",
      city: "",
      from_date: "",
      to_date: ""
    };

    setFilters(reset);
    fetchLead(reset);
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
    status: ""
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
        status: ""
      });
      setErrors({});
    }, 300);
  };
  // open edit
  const openEditModal = (lead) => {
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
        status: editLeadForm.status,
        updated_by: userid
      };

      const res = await axiosInstance.post(
        `${API_URL}api/lead-management/update/${editLeadForm.id}`,
        payload
      );

      if (res.data.success || res.data.status) {
        toast.success("Lead updated successfully");
        closeEditModal();
        fetchLead();
      }
    } catch {
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
      };

      if (statusForm.followUp === "yes") {
        payload.followup_date = statusForm.followUpDate;
      }

      const response = await axiosInstance.post(
        `${API_URL}api/lead-management/status-update/${viewStatus.id}`,
        payload
      );

      toast.success("Lead status updated successfully");

      await fetchStatusList(viewStatus.id);

      // reset form
      setStatusForm({
        status: "",
        notes: "",
        followUp: "no",
        followUpDate: "",
      });

      fetchLead(); // optional (datatable refresh)

    } catch (error) {
      console.error("Status update failed", error);
      toast.error("Failed to update lead status");
    }
  };

  // create
  const handleAddLeadSubmit = async () => {
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
        status: leadForm.status,
        created_by: userid
      };

      const res = await axiosInstance.post(
        `${API_URL}api/lead-management/create`,
        payload
      );
      console.log("res", res);

      if (res.data.success || res.data.status) {
        toast.success("Lead created successfully");
        closeAddModal();
        fetchLead();
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

    return result;
  };

  //  list
  const fetchLead = async (customFilters) => {
    const appliedFilters = customFilters ?? filters;

    try {
      setLoading(true);

      const params = {};

      if (appliedFilters.gender)
        params.gender = appliedFilters.gender.toLowerCase();

      if (appliedFilters.platform)
        params.platform = appliedFilters.platform.toLowerCase();

      if (appliedFilters.city)
        params.city = appliedFilters.city.toLowerCase();

      if (appliedFilters.from_date)
        params.from_date = appliedFilters.from_date;

      if (appliedFilters.to_date)
        params.to_date = appliedFilters.to_date;

      const res = await axiosInstance.get(
        `${API_URL}api/lead-management`,
        { params }
      );

      console.log("API LIST", res.data.data);

      if (res.data.success) {
        let data = res.data.data || [];

        //  FRONTEND FILTERING
        data = applyFrontendFilters(data, appliedFilters);

        setLeads(data);
        setTotalRecords(data.length);
        setGenderOptions(res.data.gender || []);
        setPlatformOptions(res.data.platforms || {});
        setCityOptions(res.data.cities || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  // status api get showing fetching
  const [statusList, setStatusList] = useState([]);

  console.log("statusList", statusList);

  

  useEffect(() => {
    if (viewStatus?.id) {
      fetchStatusList(viewStatus.id);
    }
  }, [viewStatus?.id]);

  // status view (view Api)
  const fetchStatusList = async (id) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `${API_URL}api/lead-management/status-list/${id}`
      );

      // console.log("Status List", res.data);


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
        toast.success("Lead deleted successfully");
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

  // column
  const columns = [
    {
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
      header: "Date Of Birth",
      body: (row) => formatToDDMMYYYY(row.date_of_birth),
    },
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
      header: "Status",
      body: (row) => (
        <div className="flex items-center gap-2">
          <select
            className="border p-1"
            value={row.status || ""}
            onChange={(e) => {
              setViewStatus(row);
              setIsViewStatusOpen(true);
              setStatusForm({
                status: e.target.value,
                notes: "",
                followUp: "no",
                followUpDate: ""
              });
            }}
          >
            <option value="">Select Status</option>
            <option value="open">Open</option>
            <option value="joined">Joined</option>
            <option value="interested">Interested / scheduled</option>
            <option value="not_interested">Not Interested</option>
            <option value="follow_up">Follow Up</option>
            <option value="not_picked">Not Picked</option>
          </select>

          {/* VIEW STATUS HISTORY */}
          <button
            onClick={() => openStatusView(row)}
            className="text-blue-600 hover:scale-110 transition"
            title="View Status History"
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

          <TfiPencilAlt
            onClick={() => openEditModal(row)}
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
      fixed: true
    },
  ];

  const [visibleColumnFields, setVisibleColumnFields] = useState(
    columns.filter(col => col.fixed || ["full_name", "date_of_birth", "gender", "phone", "age", "qualification", "city", "created_time", "status", "Action"].includes(col.field)).map(col => col.field)
  );

  const onColumnToggle = (event) => {
    let selectedFields = event.value;
    const fixedFields = columns.filter(col => col.fixed).map(col => col.field);
    const validatedSelection = Array.from(new Set([...fixedFields, ...selectedFields]));

    setVisibleColumnFields(validatedSelection);
  };
  const dynamicColumns = useMemo(() => {
    return columns.filter(col => visibleColumnFields.includes(col.field));
  }, [visibleColumnFields]);



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

              <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-sm  md:text-md  text-[#1ea600]">Lead Engine</p>
            </div>

            {/* Filter Section */}
            <div className="w-full mt-5 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-4 py-4">

              <div className="flex flex-wrap items-end gap-4">

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

                {/* Gender */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#6B7280]">Gender</label>
                  <select
                    className="h-10 px-3 rounded-md border"
                    value={filters.gender}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, gender: e.target.value }))
                    }
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>


                {/* Platform */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#6B7280]">Platform</label>
                  <select
                    className="h-10 px-3 rounded-md border"
                    value={filters.platform}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, platform: e.target.value }))
                    }
                  >
                    <option value="">Select</option>
                    {Object.entries(platformOptions).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>


                </div>

                {/* age */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#6B7280]">Age</label>
                  <select
                    className="h-10 px-3 rounded-md border"
                    value={filters.age}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, age: e.target.value }))
                    }
                  >
                    <option value="">Select Age</option>
                    <option value="18-25">18 - 25</option>
                    <option value="26-35">26 - 35</option>
                    <option value="36-45">36 - 45</option>
                    <option value="46+">46+</option>
                  </select>


                </div>

                {/* city */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#6B7280]">City</label>

                  <Dropdown
                    value={filters.city}
                    options={cityDropdownOptions}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, city: e.value }))
                    }
                    placeholder="Select City"
                    filter
                    filterPlaceholder="Search city"
                    className="h-10 rounded-md border border-[#D9D9D9] text-sm"
                    panelClassName="text-sm"
                  />
                </div>


                {/* Buttons */}
                <div className="flex gap-3 mt-6 md:mt-0">
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-5">
                    <div>
                      <Dropdown
                        value={rows}
                        options={[10, 25, 50, 100].map(v => ({ label: v, value: v }))}
                        onChange={(e) => setRows(e.value)}
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
                    <div className="flex justify-between items-center gap-5">
                      <button
                        onClick={openImportAddModal}
                        className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium w-20 rounded-lg"
                      >
                        Import
                      </button>

                      <button
                        onClick={openAddModal}
                        className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                      >
                        Add Lead
                      </button>

                    </div>

                  </div>
                </div>
                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    className="mt-8"
                    value={leads}
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
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw]
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

                    {/* Is Organic */}
                    <div className="mt-6 flex justify-between items-center">
                      <label className="text-md font-medium">
                        Is Organic <span className="text-red-500">*</span>
                      </label>

                      <div className="w-[50%] flex gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="is_organic"
                            value="true"
                            checked={leadForm.is_organic === "true"}
                            onChange={(e) =>
                              handleChange("is_organic", e.target.value)
                            }
                          />
                          Yes
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="is_organic"
                            value="false"
                            checked={leadForm.is_organic === "false"}
                            onChange={(e) =>
                              handleChange("is_organic", e.target.value)
                            }
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="mt-6 flex justify-between items-center">
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
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>

                    {/* Post Code */}
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>

                    {/* City */}
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>

                    {/* State */}
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>


                    {/* Phone */}
                    <div className="mt-6 flex justify-between items-center">
                      <label className="text-md font-medium">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <input
                          type="number"
                          value={leadForm.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          placeholder="Enter phone number"
                          className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-6 flex justify-between items-center">
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
                        onClick={handleAddLeadSubmit}
                        className="bg-[#005AEF] hover:bg-[#2879FF]
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
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw]
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

                    {/* Is Organic */}
                    <div className="mt-6 flex justify-between items-center">
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
                              setEditLeadForm({ ...editLeadForm, is_organic: e.target.value })
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
                              setEditLeadForm({ ...editLeadForm, is_organic: e.target.value })
                            }
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>

                    {/* Post Code */}
                    <div className="mt-6 flex justify-between items-center">
                      <label className="text-md font-medium">
                        Post Code <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <input
                          type="number"
                          value={editLeadForm?.post_code || ""}
                          onChange={(e) =>
                            setEditLeadForm({ ...editLeadForm, post_code: e.target.value })
                          }
                          placeholder="Enter post code"
                          className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>

                    {/* State */}
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="mt-6 flex justify-between items-center">
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
                      </div>
                    </div>


                    {/* Phone */}
                    <div className="mt-6 flex justify-between items-center">
                      <label className="text-md font-medium">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <input
                          type="number"
                          value={editLeadForm?.phone || ""}
                          onChange={(e) =>
                            setEditLeadForm({ ...editLeadForm, phone: e.target.value })
                          }
                          placeholder="Enter phone number"
                          className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-6 flex justify-between items-center">
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
                        className="bg-[#005AEF] hover:bg-[#2879FF]
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
          <div>
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
          </div>

          {statusForm.followUp === "yes" && (
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
          )}
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
                <th className="border px-3 py-2">Created Date</th>
                <th className="border px-3 py-2">Follow Date</th>
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
                      {formatToDDMMYYYY(item.created_at)}
                    </td>
                    <td className="border px-3 py-2">
                      {formatToDDMMYYYY(item.followup_date)}
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
                          <th className="border px-3 py-2">Date</th>
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
                                {formatToDDMMYYYY(item.followup_date)}
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
                        className="bg-[#005AEF] hover:bg-[#2879FF] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
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
