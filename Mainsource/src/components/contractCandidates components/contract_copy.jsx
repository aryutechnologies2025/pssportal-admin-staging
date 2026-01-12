import React, { useState, useEffect, useRef } from "react";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { DataTable } from "primereact/datatable";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FiSearch } from "react-icons/fi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../axiosConfig";
import { FaEye } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContractCandidates_Mainbar = () => {
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ModalOpen, setIsModalOpen] = useState(false);
  const [isImportAddModalOpen, setIsImportAddModalOpen] = useState(false);
  const [backendValidationError, setBackendValidationError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState(["Saravanan", "Ramesh", "Priya"]);

  // Filter states
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [filterInterviewStatus, setFilterInterviewStatus] = useState("");
  const [filterCandidateStatus, setFilterCandidateStatus] = useState("");
  const [selectedReference, setSelectedReference] = useState("");

  // Table states
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);

  // Import modal states
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [importErrors, setImportErrors] = useState({});
  const [importLoading, setImportLoading] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("pssuser") || "{}");

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Zod Schema
  const candidateContractSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Phone is required").max(10, "Phone must be 10 digits"),
    aadhar: z.string().min(12, "Aadhar is required").max(12, "Aadhar must be 12 digits"),
    company_id: z.string().min(1, "Company is required"),
    interview_date: z.string().min(1, "Interview date is required"),
    interview_status: z.string().min(1, "Interview status is required"),
    reject_reason: z.string().optional(),
    hold_reason: z.string().optional(),
    selected_joining_date: z.string().optional(),
    candidate_status: z.string().min(1, "Candidate status is required"),
    not_joined_reason: z.string().optional(),
    joined_date: z.string().optional(),
    reference: z.string().min(1, "Reference is required"),
    other_reference: z.string().optional(),
    address: z.string().optional(),
    notes_details: z.array(z.object({
      notes: z.string(),
      note_status: z.number().default(1)
    })).default([])
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(candidateContractSchema),
    defaultValues: {
      name: "",
      phone: "",
      aadhar: "",
      company_id: "",
      interview_date: getTodayDate(),
      interview_status: "",
      reject_reason: "",
      hold_reason: "",
      selected_joining_date: "",
      candidate_status: "",
      not_joined_reason: "",
      joined_date: getTodayDate(),
      reference: "",
      other_reference: "",
      address: "",
      notes_details: []
    },
  });

  // Watch form values
  const interviewStatus = watch("interview_status");
  const candidateStatus = watch("candidate_status");
  const reference = watch("reference");

  // Filter options
  const interviewStatusOptions = [
    { label: "All Status", value: "" },
    { label: "Selected", value: "Selected" },
    { label: "Rejected", value: "Rejected" },
    { label: "Hold", value: "Hold" },
    { label: "Waiting", value: "Waiting" },
  ];

  const candidateStatusOptions = [
    { label: "All Status", value: "" },
    { label: "Joined", value: "Joined" },
    { label: "Not Joined", value: "Not Joined" },
  ];

  // Effect for clearing conditional fields
  useEffect(() => {
    if (interviewStatus !== "Rejected") {
      setValue("reject_reason", "");
    }
    if (interviewStatus !== "Hold") {
      setValue("hold_reason", "");
    }
  }, [interviewStatus, setValue]);

  useEffect(() => {
    if (candidateStatus !== "Not Joined") {
      setValue("not_joined_reason", "");
    }
  }, [candidateStatus, setValue]);

  useEffect(() => {
    if (reference !== "Other") {
      setValue("other_reference", "");
    }
  }, [reference, setValue]);

  // Fetch initial data
  useEffect(() => {
    fetchContractCandidates();
    fetchCompanies();
  }, []);

  // API Functions
  const fetchContractCandidates = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/contract-emp");
      if (response.data.success) {
        setCandidates(response.data.data || []);
        setTotalRecords(response.data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching contract candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      // Replace with your actual companies API endpoint
      const response = await axiosInstance.get("/api/companies");
      if (response.data.success) {
        setCompanies(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchCandidateDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/contract-emp/edit/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      toast.error("Failed to load candidate details");
    }
    return null;
  };

  // Form Submission
  const onSubmit = async (data) => {
    try {
      setBackendValidationError(null);
      const formattedData = {
        ...data,
        created_by: user.email || "admin",
        status: 1,
        company_id: parseInt(data.company_id),
        // Ensure proper date format
        interview_date: data.interview_date,
        joining_date: data.joined_date || null,
        joining_status: data.candidate_status,
        phone_number: data.phone,
        aadhar_number: data.aadhar,
        notes_details: data.notes_details.map(note => ({
          notes: note.notes,
          note_status: 1
        }))
      };

      if (editData) {
        // Update existing candidate
        const updateData = {
          ...formattedData,
          updated_by: user.id || 1
        };
        const response = await axiosInstance.put(
          `/api/contract-emp/update/${editData._id || editData.id}`,
          updateData
        );
        
        if (response.data.success) {
          toast.success("Candidate updated successfully!");
          fetchContractCandidates();
          closeModal();
        }
      } else {
        // Create new candidate
        const response = await axiosInstance.post(
          "/api/contract-emp/create",
          formattedData
        );
        
        if (response.data.success) {
          toast.success("Candidate added successfully!");
          fetchContractCandidates();
          closeModal();
        }
      }
    } catch (error) {
      console.error("Error saving candidate:", error.response?.data || error);
      const errorMessage = error.response?.data?.message || "Failed to save candidate";
      setBackendValidationError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle Import
  const handleImportSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to import");
      return;
    }

    if (!selectedCompany) {
      toast.error("Please select a company");
      return;
    }

    try {
      setImportLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("date", selectedDate);
      formData.append("company_id", selectedCompany.value || selectedCompany);
      formData.append("created_by", user.email || "admin");

      const response = await axiosInstance.post(
        "/api/contract-emp/import",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success("Import successful!");
        fetchContractCandidates();
        closeImportModal();
      } else {
        setImportErrors(response.data.errors || {});
        toast.error("Import completed with some errors");
      }
    } catch (error) {
      console.error("Import error:", error);
      const errorMsg = error.response?.data?.message || "Import failed";
      setImportErrors({ import: errorMsg });
      toast.error(errorMsg);
    } finally {
      setImportLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        const response = await axiosInstance.delete(`/api/contract-emp/delete/${id}`);
        if (response.data.success) {
          toast.success("Candidate deleted successfully!");
          fetchContractCandidates();
        }
      } catch (error) {
        console.error("Error deleting candidate:", error);
        toast.error("Failed to delete candidate");
      }
    }
  };

  // Handle View
  const handleView = (id) => {
    navigate(`/contract-candidates/view/${id}`);
  };

  // Modal Functions
  const openAddModal = () => {
    setEditData(null);
    reset({
      name: "",
      phone: "",
      aadhar: "",
      company_id: "",
      interview_date: getTodayDate(),
      interview_status: "",
      reject_reason: "",
      hold_reason: "",
      selected_joining_date: "",
      candidate_status: "",
      not_joined_reason: "",
      joined_date: getTodayDate(),
      reference: "",
      other_reference: "",
      address: "",
      notes_details: []
    });
    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = async (row) => {
    try {
      const candidateData = await fetchCandidateDetails(row._id || row.id);
      if (candidateData) {
        setEditData(candidateData);
        reset({
          name: candidateData.name || "",
          phone: candidateData.phone_number || "",
          aadhar: candidateData.aadhar_number || "",
          company_id: candidateData.company_id?.toString() || "",
          interview_date: candidateData.interview_date || getTodayDate(),
          interview_status: candidateData.interview_status || "",
          reject_reason: candidateData.reject_reason || "",
          hold_reason: candidateData.hold_reason || "",
          selected_joining_date: candidateData.selected_joining_date || "",
          candidate_status: candidateData.joining_status || candidateData.candidate_status || "",
          not_joined_reason: candidateData.not_joined_reason || "",
          joined_date: candidateData.joined_date || getTodayDate(),
          reference: candidateData.reference || "",
          other_reference: candidateData.other_reference || "",
          address: candidateData.address || "",
          notes_details: candidateData.notes_details || []
        });
        setIsModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
      }
    } catch (error) {
      console.error("Error opening edit modal:", error);
    }
  };

  const openImportAddModal = () => {
    setIsImportAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setBackendValidationError(null);
      setEditData(null);
    }, 250);
  };

  const closeImportModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsImportAddModalOpen(false);
      resetImportForm();
    }, 250);
  };

  const resetImportForm = () => {
    setSelectedCompany(null);
    setSelectedFile(null);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setImportErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !['xlsx', 'xls'].includes(fileExtension)) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      e.target.value = '';
      return;
    }
    
    setSelectedFile(file);
  };

  // Filter functions
  const handleApplyFilter = () => {
    fetchContractCandidates(); // Re-fetch with filters
  };

  const handleResetFilter = () => {
    setFilterStartDate(null);
    setFilterEndDate(null);
    setSelectedReference("");
    setFilterInterviewStatus("");
    setFilterCandidateStatus("");
    fetchContractCandidates(); // Re-fetch without filters
  };

  const onPageChange = (e) => {
    setPage(e.page + 1);
    setRows(e.rows);
    // Implement pagination in API call
  };

  // Table columns
  const columns = [
    {
      header: "S.No",
      body: (_, options) => options.rowIndex + 1 + (page - 1) * rows,
      style: { textAlign: "center", width: "80px" },
    },
    {
      header: "Name",
      field: "name",
      body: (row) => row.name || "-",
    },
    {
      header: "Phone",
      field: "phone_number",
      body: (row) => row.phone_number || "-",
    },
    {
      header: "Interview Status",
      body: (row) => {
        const data = row.interview_status;
        let color = "";
        
        switch (data) {
          case "Selected":
            color = "text-[#16A34A] bg-green-100";
            break;
          case "Rejected":
            color = "text-[#DC2626] bg-[#FFF0F0]";
            break;
          case "Hold":
            color = "text-[#FD8700] bg-[#FFCB90]";
            break;
          default:
            color = "text-blue-600 bg-blue-100";
        }

        return (
          <div
            className={`border rounded-[50px] ${color} px-3 py-1`}
            style={{
              display: "inline-block",
              minWidth: "100px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 400,
            }}
          >
            {data || "-"}
          </div>
        );
      },
      style: { textAlign: "center" },
    },
    {
      header: "Candidate Status",
      body: (row) => {
        const data = row.joining_status;
        if (!data) return "-";

        const color = data === "Joined" 
          ? "text-[#16A34A] bg-green-100" 
          : "text-[#DC2626] bg-[#FFF0F0]";

        return (
          <div
            className={`border rounded-[50px] ${color} px-3 py-1`}
            style={{
              display: "inline-block",
              minWidth: "100px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 400,
            }}
          >
            {data}
          </div>
        );
      },
      style: { textAlign: "center" },
    },
    {
      header: "Reference",
      field: "reference",
      body: (row) => row.reference || "-",
    },
    {
      header: "Action",
      body: (row) => (
        <div className="flex gap-4 justify-center items-center">
          <button
            onClick={() => handleView(row._id || row.id)}
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>
          
          <button
            onClick={() => openEditModal(row)}
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]"
          >
            <TfiPencilAlt />
          </button>
          
          <button
            onClick={() => handleDelete(row._id || row.id)}
            className="p-2 bg-[#FFD1D1] text-[#DC2626] hover:bg-[#FFE2E2] rounded-[10px]"
          >
            <MdOutlineDeleteOutline />
          </button>
        </div>
      ),
      style: { textAlign: "center", width: "120px" },
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-5">
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
        <Mobile_Sidebar />
        
        {/* Breadcrumbs */}
        <div className="flex gap-2 items-center cursor-pointer">
          <p
            className="text-sm md:text-md text-gray-500 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p className="text-sm md:text-md text-[#1ea600]">
            Contract Candidates
          </p>
        </div>

        {/* Filter Section - Same as before */}
        <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
          {/* ... Your filter section code ... */}
        </div>

        {/* Table Section */}
        <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
          <div className="datatable-container mt-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Dropdown
                  value={rows}
                  options={[10, 25, 50, 100].map((v) => ({
                    label: v,
                    value: v,
                  }))}
                  onChange={(e) => setRows(e.value)}
                  className="w-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                />
                <span className="text-sm text-[#6B7280]">
                  Entries per page
                </span>
              </div>

              <div className="flex items-center gap-11">
                <div className="relative w-64">
                  <FiSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search......"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={openImportAddModal}
                    className="px-2 md:px-3 py-2 text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium w-20 rounded-lg"
                  >
                    Import
                  </button>
                </div>
                
                <button
                  onClick={openAddModal}
                  className="px-2 md:px-3 py-2 text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium w-fit rounded-lg transition-all duration-200"
                >
                  + Add Candidate
                </button>
              </div>
            </div>

            <div className="table-scroll-container" id="datatable">
              <DataTable
                className="mt-8"
                value={candidates}
                paginator
                rows={rows}
                rowsPerPageOptions={[10, 25, 50, 100]}
                globalFilter={globalFilter}
                showGridlines
                resizableColumns
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                paginatorClassName="custom-paginator"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                loading={loading}
                totalRecords={totalRecords}
                lazy
                onPage={onPageChange}
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
            </div>
          </div>
        </div>

        {/* Import Modal */}
        {isImportAddModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            <div className="absolute inset-0" onClick={closeImportModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeImportModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="p-5">
                <p className="text-xl md:text-2xl font-medium">Import Contract Candidates</p>
                
                {/* Date */}
                <div className="mt-3 flex justify-between items-center">
                  <label className="block text-md font-medium">
                    Date<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="mt-3 flex justify-between items-center">
                  <label className="block text-md font-medium">
                    Company<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* File Upload */}
                <div className="mt-3 flex justify-between items-center">
                  <label className="block text-md font-medium">
                    File Upload<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".xlsx,.xls"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    {selectedFile && (
                      <div className="flex justify-between mt-2 items-center bg-gray-50 px-3 py-2 rounded-lg border">
                        <span className="text-sm text-gray-700 truncate w-[80%]">
                          {selectedFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiFillDelete size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Import Errors */}
                {importErrors.import && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{importErrors.import}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-6 md:mt-14">
                  <button
                    onClick={closeImportModal}
                    className="hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C] text-[#7C7C7C] hover:text-[#DC2626] px-5 py-2 font-semibold rounded-[10px] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportSubmit}
                    disabled={importLoading}
                    className="bg-[#005AEF] hover:bg-[#2879FF] text-white px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                  >
                    {importLoading ? "Importing..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {ModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            <div className="absolute inset-0" onClick={closeModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="p-5">
                <p className="text-xl md:text-2xl font-medium">
                  {editData ? "Edit Candidate" : "Add Candidate"}
                </p>
                
                {backendValidationError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-600 text-sm">{backendValidationError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Name */}
                  <div className="mt-5">
                    <label className="block text-md font-medium mb-2">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="mt-5">
                    <label className="block text-md font-medium mb-2">
                      Phone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Aadhaar */}
                  <div className="mt-5">
                    <label className="block text-md font-medium mb-2">
                      Aadhaar Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("aadhar")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.aadhar && (
                      <p className="text-red-500 text-sm mt-1">{errors.aadhar.message}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="mt-5">
                    <label className="block text-md font-medium mb-2">
                      Company <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("company_id")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {errors.company_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.company_id.message}</p>
                    )}
                  </div>

                  {/* Interview Date */}
                  <div className="mt-5">
                    <label className="block text-md font-medium mb-2">
                      Interview Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      {...register("interview_date")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.interview_date && (
                      <p className="text-red-500 text-sm mt-1">{errors.interview_date.message}</p>
                    )}
                  </div>

                  {/* Interview Status */}
                  <div className="mt-5">
                    <label className="block text-md font-medium mb-2">
                      Interview Status <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("interview_status")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select Status</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hold">Hold</option>
                      <option value="Waiting">Waiting</option>
                    </select>
                    {errors.interview_status && (
                      <p className="text-red-500 text-sm mt-1">{errors.interview_status.message}</p>
                    )}
                  </div>

                  {/* Conditional fields for interview status */}
                  {interviewStatus === "Rejected" && (
                    <div className="mt-5">
                      <label className="block text-md font-medium mb-2">
                        Reason for Rejection
                      </label>
                      <textarea
                        {...register("reject_reason")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        rows={3}
                      />
                    </div>
                  )}

                  {interviewStatus === "Hold" && (
                    <div className="mt-5">
                      <label className="block text-md font-medium mb-2">
                        Reason for Hold
                      </label>
                      <textarea
                        {...register("hold_reason")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        rows={3}
                      />
                    </div>
                  )}

                  {interviewStatus === "Selected" && (
                    <div className="mt-5">
                      <label className="block text-md font-medium mb-2">
                        Expected Joining Date
                      </label>
                      <input
                        type="date"
                        {...register("selected_joining_date")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />
                    </div>
                  )}

                  {/* Candidate Status */}
                  <div className="mt-5">
                    <label className="block text-md font-medium mb-2">
                      Candidate Status <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("candidate_status")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select Status</option>
                      <option value="Joined">Joined</option>
                      <option value="Not Joined">Not Joined</option>
                    </select>
                    {errors.candidate_status && (
                      <p className="text-red-500 text-sm mt-1">{errors.candidate_status.message}</p>
                    )}
                  </div>

                  {/* Conditional fields for candidate status */}
                  {candidateStatus === "Joined" && (
                    <div className="mt-5">
                      <label className="block text-md font-medium mb-2">
                        Joined Date
                      </label>
                      <input
                        type="date"
                        {...register("joined_date")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />
                    </div>
                  )}

                  {candidateStatus === "Not Joined" && (
                    <div className="mt-5">
                      <label className="block text-md font-medium mb-2">
                        Reason for Not Joining
                      </label>
                      <textarea
                        {...register("not_joined_reason")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Reference */}
                  <div className="mt-5">
                    <label className="block text-md font-medium mb-2">
                      Reference <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("reference")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select Reference</option>
                      {employees.map((emp) => (
                        <option key={emp} value={emp}>
                          {emp}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    {errors.reference && (
                      <p className="text-red-500 text-sm mt-1">{errors.reference.message}</p>
                    )}
                  </div>

                  {reference === "Other" && (
                    <div className="mt-5">
                      <label className="block text-md font-medium mb-2">
                        Specify Other Reference
                      </label>
                      <input
                        type="text"
                        {...register("other_reference")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />
                    </div>
                  )}

                  {/* Address */}
                  <div className="mt-5">
                    <label className="block text-md font-medium mb-2">
                      Address
                    </label>
                    <textarea
                      {...register("address")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-10">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#005AEF] text-white rounded-lg hover:bg-[#2879FF]"
                    >
                      {editData ? "Update" : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ContractCandidates_Mainbar;