import { useState, useEffect, useRef } from "react";
import { TfiPencilAlt, TfiPrinter } from "react-icons/tfi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
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
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../axiosConfig";
import { FaEye } from "react-icons/fa6";
import { toast } from "react-toastify";
import { API_URL } from "../../Config";
import Swal from "sweetalert2";
import { IoIosCloseCircle } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import Loader from "../Loader";
import { formatToDDMMYYYY, formatToYYYYMMDD } from "../../Utils/dateformat";
import { Capitalise } from "../../hooks/useCapitalise";
import { IoMdDownload } from "react-icons/io";
import CameraPhoto from "../../Utils/cameraPhoto";
import { IoAddCircleSharp } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { TbLogs } from "react-icons/tb";
import { FiX } from "react-icons/fi";

const Employee_contract_details = () => {
  //navigation
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  // console.log("editData", editData);
  const [columnData, setColumnData] = useState([]);

  // console.log("columnData", columnData);
  const [error, setError] = useState(null);
  const [employeesList, setEmployeesList] = useState([]);
  const [backendValidationError, setBackendValidationError] = useState(null);
  const user = JSON.parse(localStorage.getItem("pssuser") || "null");

  const userId = user?.id;
  const userRole = user?.role_id;

  const [page, setPage] = useState(1);
  const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);
  };

  const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  /* Emergency Contact */
  const emergencyContactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    relationship: z.string().min(1, "Relation is required"),
    phone_number: z
      .string()
      .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  });

  const candidateContractSchema = z.object({
    name: z.string().min(1, "Name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    fatherName: z.string().min(1, "Father's name is required"),
    address: z.string().min(1, "Address is required"),
    currentAddress: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    bankName: z.string().optional(),
    branch: z.string().optional(),
    emergency_contact: z.string().optional(),
    gender: z.string().min(1, "Gender is required"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
    aadhar: z.string().regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
    company: z.string().min(1, "Company is required"),
    joinedDate: z.string().min(1, "Joined date is required"),
    education: z.string().optional(),
    boardingPoint: z.string().optional(),
    maritalStatus: z.string().nullable().optional(),
    panNumber: z.string().optional(),
    accountName: z.string().optional(),
    accountNumber: z.string().min(1, "Account number is required"),
    ifsccode: z.string().min(1, "IFSC code is required"),
    uannumber: z.string().min(1, "UAN number is required"),
    esciNumber: z.string().min(1, "ESCI number is required"),
    status: z.string().min(1, "Status is required"),
    // isRejoining: z.string().optional(),
    manual_value: z.string().optional(),
    profile_picture: z.any().optional(),
    documents: z.array(z.any()).optional(),
    /*  Emergency Contacts */
    emergencyContacts: z
      .array(emergencyContactSchema)
      .min(1, "At least one emergency contact is required"),
  });

  // const [emergencyContacts, setEmergencyContacts] = useState([
  //   { name: "", phone: "", relation: "" },
  // ]);
  const [employeeIds, setEmployeeIds] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(candidateContractSchema),

    defaultValues: {
      name: editData ? editData.name : "",
      phone: editData ? editData.phone_number : "",
      aadhar: editData ? editData.aadhar_number : "",
      company: editData ? editData.company_name : "",
      manual_value: editData ? editData.manual_value : "",
      dob: editData ? editData.dob : "",
      fatherName: editData ? editData.fatherName : "",
      address: editData ? editData.address : "",
      currentAddress: editData ? editData.currentAddress : "",
      state: editData ? editData.state : "",
      city: editData ? editData.city : "",
      bankName: editData ? editData.bankName : "",
      boardingPoint: editData ? editData.boardingPoint : "",
      education: editData ? editData.education : "",
      emergency_contact: editData ? editData.emergency_contact : "",
      panNumber: editData ? editData.pan : "",
      branch: editData ? editData.branch : "",
      gender: editData ? editData.gender : "",
      joinedDate: editData ? editData.joinedDate : "",
      accountName: editData ? editData.accountName : "",
      accountNumber: editData ? editData.accountNumber : "",
      ifsccode: editData ? editData.ifsccode : "",
      uannumber: editData ? editData.uannumber : "",
      esciNumber: editData ? editData.esciNumber : "",
      status: editData ? editData.status : "",
      // isRejoining: editData ? editData.isRejoining : "",
      profile_picture: editData ? editData.profile_picture : "",
      documents: editData ? editData.documents : [],
      emergencyContacts: [{ name: "", relationship: "", phone_number: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  useEffect(() => {
    setValue("manual_value", employeeIds);
  }, [employeeIds, setValue]);

  const joined_date = watch("joinedDate");
  const company_name = watch("company");

  const manual_value = watch("manual_value");

  console.log("joined_date", joined_date);

  console.log("manual_value", manual_value);

  // const isRejoining = watch("isRejoining");

  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const employees = ["Saravanan", "Ramesh", "Priya"];

  // Filter states - FIXED: Corrected variable names

  const [filterInterviewStatus, setFilterInterviewStatus] = useState("");
  const [filterCandidateStatus, setFilterCandidateStatus] = useState("");
  const [filterEducation, setFilterEducation] = useState("");
  
  const [selectedReference, setSelectedReference] = useState("");
  const [statusType, setStatusType] = useState(0);
  const [companyEmpType, setCompanyEmpType] = useState([]);

  // console.log("companyEmpType", companyEmpType);

  // Table states
  // const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  // const [totalRecords, setTotalRecords] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const interviewStatus = watch("interviewStatus");
  const candidateStatus = watch("candidateStatus");
  const reference = watch("reference");

  useEffect(() => {
    if (interviewStatus !== "Rejected") {
      setValue("rejectReason", "");
    }

    if (interviewStatus !== "Hold") {
      setValue("holdReason", "");
    }
  }, [interviewStatus, setValue]);

  useEffect(() => {
    if (candidateStatus !== "Not Joined") {
      setValue("notJoinedReason", "");
    }
  }, [candidateStatus, setValue]);

  const [ModalOpen, setIsModalOpen] = useState(false);

  // Reset filters
  const handleResetFilter = async () => {
    setLoading(true);

    try {
      
      setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterStatus("");
    setFilterGender("");
    setSelectedCompanyfilter(null);
    setSelectedEducation(null);

      // const queryParams = new URLSearchParams(payload).toString();
       const response = await axiosInstance.get(
      "api/contract-employee"
    );

      if (response.data.success) {
              setColumnData(response.data.data.employees || []);

        setBoardingPoints(response.data.data.boardingpoints || []);
        setEducations(response.data.data.educations || []);
      }
      const employees = response?.data?.data?.employees || [];

      console.log("response emp check", response);

      setColumnData(response?.data?.data?.employees || []);
      setEmployeesList(response?.data?.data?.pssemployees || []);

      const companies = response.data.data?.companies.map((company) => ({
        // console.log("company", company),
        label: company.company_name,
        value: company.id,
        company_emp_id: company.company_emp_id,
      }));

      setCompanyOptions(companies);

             const educations = response.data.data.educations || [];

setEducationOptions(
  educations.map((edu) => ({
    label: edu.eduction_name,
    value: edu.id, // number is fine
  }))
);

    } catch (error) {
      console.error("Error fetching contract candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // const onPageChange = (e) => {
  //   setPage(e.page + 1); // PrimeReact is 0-based
  //   setRows(e.rows); // page size
  // };

  //  const formatToDDMMYYYY = (dateString) => {
  //   if (!dateString) return "N/A";

  //   const date = new Date(dateString);
  //   if (isNaN(date)) return "Invalid Date";

  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = date.getFullYear();

  //   return `${day}-${month}-${year}`;
  // };

  const formatDateToYMD = (date) => {
    if (!date) return null;

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [isImportAddModalOpen, setIsImportAddModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  console.log("selectedEducation", selectedEducation);

  // console.log("selectedCompany", selectedCompany);
  // console.log("selectedBoarding", selectedBoarding);

  const [companyOptions, setCompanyOptions] = useState([]);
  // console.log("companyOptions", companyOptions);
  const [boardingOptions, setBoardingOptions] = useState([]);
  // console.log("boarding option", boardingOptions);
  const [educationOptions, setEducationOptions] = useState([]);
  console.log("education option", educationOptions);

  const fileInputRef = useRef(null);
  const fileInputRefEdit = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  // console.log("viewRow", viewRow);

  const [existingCandidate, setExistingCandidate] = useState(null);
  const [viewExistingCandidate, setViewExistingCandidate] = useState(null);
  const [
    isExistingCandidateViewModalOpen,
    setIsExistingCandidateViewModalOpen,
  ] = useState(false);

  const handleViewExisting = async (id) => {
    try {
      const response = await axiosInstance.get(
        `api/contract-employee/edit/${id}`,
      );

      if (response.data?.success) {
        setViewExistingCandidate(response.data.data);
        setIsExistingCandidateViewModalOpen(true);
      }
    } catch (err) {
      toast.error("Unable To Load Candidate Details");
    }
  };

  const handleCloseViewExistingCandidate = () => {
    setIsExistingCandidateViewModalOpen(false);
    setViewExistingCandidate(null);
  };
  // Open and close modals
  const openAddModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handleStatusChange = async (status) => {
    if (!editData?.id) return; //  Skip in Add modal

    try {
      const payload = {
        status: status,
        joining_date:
          status === 1 ? formatDateToYMD(watch("joinedDate")) : null,
        relieving_date: status === 0 ? formatDateToYMD(new Date()) : null,
      };

      console.log("Status change payload:", payload);

      await axiosInstance.post(
        `/api/relieved/status-change/${editData.id}`,
        payload,
      );

      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Status change error:", err);
      toast.error("Failed to update status");
    }
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    const mappedData = {
      id: "",
      name: "",
      phone: "",
      aadhar: "",
      company: null,
      branch: null,
      boardingPoint: null,
      education: null,
      pan_number: "",
      currentAddress: "",
      state: "",
      city: "",
      bankName: "",
      emergency_contact: "",
      interviewDate: "",
      interviewStatus: "",
      candidateStatus: "",
      joinedDate: "",
      reference: "",
      otherReference: "",
      notJoinedReason: "",
      importFileName: "",
      importFileUrl: "",
      joinedDate: "",
      fatherName: "",
      dob: "",
      address: "",
      accountName: "",
      accountNumber: "",
      ifsccode: "",
      uannumber: "",
      esciNumber: "",
      gender: "",
      status: "",
      profile_picture: "",
      documents: [],
      employee_id: "",
    };
    reset(mappedData);
    setPhoto(null);
    setSelectedCompany(null);
    setSelectedBoarding(null);
    setStatusType(0);
    setSelectedEducation(null);
    setSelectedBranch(null);
    setDocuments([]);

    setTimeout(() => {
      setIsModalOpen(false);
      setBackendValidationError(null);
      setEditData(null);
      setExistingCandidate(null);
      reset();
    }, 250);
  };

  const openImportAddModal = () => {
    setIsImportAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeImportAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsImportAddModalOpen(false), 250);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(file);
      setValue("profile_picture", file, { shouldValidate: true });
    }
  };

  // image and document state handling
  const [photo, setPhoto] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    register("profile_picture", { required: !editData });
  }, [register, editData]);

  const handleCameraCapture = (fileOrBlob) => {
    let file = fileOrBlob;

    // If camera gives Blob → convert to File
    if (!(fileOrBlob instanceof File)) {
      file = new File([fileOrBlob], `camera-${Date.now()}.png`, {
        type: fileOrBlob.type || "image/png",
      });
    }

    setPhoto(file);
    setValue("profile_picture", file, { shouldValidate: true });
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);

    const updatedDocs = [...documents, ...files];

    setDocuments(updatedDocs);
    setValue("documents", updatedDocs);
  };

  const removeDocument = (index) => {
    const updatedDocs = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocs);
    setValue("documents", updatedDocs);
  };
  const handleView = async (row) => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}api/contract-employee/edit/${row.id}`,
      );

      const normalizedDocs = normalizeDocuments(res.data.data);
      setViewRow({
        ...res.data.data,
        documents: normalizedDocs,
      });

      console.log("view res....:....", res);
      console.log("view res....:....", res.data);

      if (res.data.success) {
        setViewRow(res.data.data);
        setIsViewModalOpen(true);
      }
    } catch (err) {
      console.error("View fetch failed", err);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewRow(null);
  };

  const resetImportForm = () => {
    setSelectedCompany(null);
    setSelectedFile(null);
    setAttachment(null);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setError({ file: "", date: "", company: "", import: [] });

    // Clear input fields manually
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (fileInputRefEdit.current) {
      fileInputRefEdit.current.value = "";
    }
  };

  useEffect(() => {
    if (ModalOpen) {
      fetchCompanyList();
    }
  }, [ModalOpen]);
  // company list
  const fetchCompanyList = async () => {
    try {
      // const response = await axiosInstance.get("/api/company");
      console.log("response check", response);

      if (response.data.success) {
        const companies = response.data.data.map((company) => ({
          // console.log("company", company),
          label: company.company_name,
          value: company.id,
          company_emp_id: company.company_emp_id,
        }));

        // setCompanyOptions(companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  // file checking
  const handleFileChange = (e) => {
    // if (e.target.files[0]) {
    //     setSelectedFile(e.target.files[0]);
    // }
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      ".xlsx",
      ".xls",
      ".csv",
    ];

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !["xlsx", "xls", "csv"].includes(fileExtension)
    ) {
      toast.error("Please upload an Excel file (.xlsx or .xls or .csv)");
      e.target.value = ""; // Clear the input
      return;
    }

    setSelectedFile(file);
    setAttachment(file);

    // clear previous errors
    setError((prev) => ({ ...prev, file: "" }));
  };

  const handleDeleteFile = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // select file

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejoining, setIsRejoining] = useState(true);
  const [rejoingnote, setRejoingnote] = useState("");
  const [rejoinTouched, setRejoinTouched] = useState(false);

  // console.log("rejoingnote", rejoingnote);

  const [editempid, setEditempid] = useState("");
  // console.log("editempid", editempid);
  const [importskip, setImportskip] = useState([]);
  const [showSkipModal, setShowSkipModal] = useState(false);
  // console.log("importskip", importskip);

  const handleFileSubmit = async (e) => {
    // console.log("selectedAccount:1");
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Reset errors
    setError({ file: "", date: "", company: "", import: [] });

    // Frontend validation
    const newErrors = {};
    let hasError = false;

    if (!selectedDate) {
      newErrors.date = "Please select a date";
      hasError = true;
    }
    // console.log("selectedAccount:2");

    if (!selectedFile) {
      newErrors.file = "Please select a file";
      hasError = true;
    } else {
      // Validate file type
      const allowedExtensions = [".xlsx", ".xls", ".csv"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        newErrors.file = "Please upload only Excel files (.xlsx, .xls, .csv)";
        hasError = true;
      }
    }

    if (!selectedCompany) {
      newErrors.company = "Please select a company";
      hasError = true;
    }

    if (hasError) {
      setError((prev) => ({ ...prev, ...newErrors }));
      // Scroll to first error
      setTimeout(() => {
        const errorField = Object.keys(newErrors)[0];
        const element = document.querySelector(`[data-field="${errorField}"]`);
        if (element)
          element.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", selectedFile); // Excel file
      formData.append("created_by", userId);
      formData.append("role_id", userRole);
      formData.append("company_id", selectedCompany); // Company ID

      // Debug: Check FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axiosInstance.post(
        `${API_URL}api/contract-employee/import`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          // Add timeout for debugging
        },
      );

      // console.log("response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message || "Excel imported successfully!");

        if (response.data.total !== undefined) {
          toast.success(`Imported: ${response.data.total} records`);
        }
      }

      const skipped = response.data?.skipped_details || [];

      setImportskip(skipped);

      //  only if skipped data exists
      if (skipped.length > 0) {
        setShowSkipModal(true);
      }

      // Reset fields
      handleDeleteFile();
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setSelectedCompany(null);
      setIsImportAddModalOpen(false);
      fetchContractCandidates();
    } catch (err) {
      console.error("Import error:", err);

      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Upload failed";
      const rowErrors = err.response?.data?.rowErrors || [];

      setError((prev) => ({
        ...prev,
        import: rowErrors.length ? rowErrors : message,
      }));
      if (rowErrors.length) {
        toast.error(`Validation failed in ${rowErrors.length} rows`);
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const normalizeDocuments = (rowData) => {
    if (rowData.document_groups?.length) {
      return rowData.document_groups.flatMap((group) =>
        group.documents.map((doc) => ({
          id: doc.id,
          original_name: doc.original_name,
          document_path: doc.document_path,
          existing: true,
        })),
      );
    }

    if (rowData.documents?.length) {
      return rowData.documents.map((doc) => ({
        id: doc.id,
        original_name: doc.original_name,
        document_path: doc.document_path,
        existing: true,
      }));
    }

    return [];
  };

  const normalizeEditData = (row) => {
    console.log("rowedit", row);

    setEditempid(row.id);

    // Normalize contact_details from backend
    let normalizedContacts = [];

    if (Array.isArray(row.contacts) && row.contacts.length > 0) {
      normalizedContacts = row.contacts.map((c) => ({
        name: c.name || "",
        relationship: c.relationship || "",
        phone_number: c.phone_number || "",
      }));
    }

    if (row.rejoingstatus) {
      // rejoining status
      setIsRejoining(row.rejoingstatus.rejoin_status);

      //  only rejoining note
      setRejoingnote(row.rejoingstatus.rejoining_note || "");
    } else {
      setIsRejoining(false);
      setRejoingnote("");
    }

    return {
      id: row.id || null,
      name: row.name || "",
      address: row.address || "",
      gender: row.gender || "",
      fatherName: row.father_name || "",
      dob: row.date_of_birth || "",
      phone: row.phone_number || "",
      aadhar: row.aadhar_number || "",
      company: String(row.company_id),
      maritalStatus: row.marital_status || "",
      city: row.city || "",
      state: row.state || "",
      bankName: row.bank_name || "",
      currentAddress: row.current_address || "",
      panNumber: row.pan_number || "",
      branch: row.branch_name || "",
      boardingPoint: row.boarding_point_id ? String(row.boarding_point_id) : "",
      education: row.education_id ? String(row.education_id) : "",
      // company: row.company.id ? Number(row.company.id) : "",
      // companyLabel: row.company?.company_name || "",
      joinedDate: row.joining_date || "",
      accountName: row.acc_no || "",
      accountNumber: row.account_number || "",
      ifsccode: row.ifsc_code || "",
      uannumber: row.uan_number || "",
      esciNumber: row.esic || "",
      manual_value: row.employee_id || "",
      interviewDate: row.interview_date || "",
      status: String(row.status),
      statusType: row.status_type ? 1 : 0,
      interviewStatus: row.interview_status
        ? row.interview_status.toLowerCase()
        : "",
      candidateStatus:
        row.joining_status === "Joined"
          ? "joined"
          : row.joining_status === "Not Joined"
            ? "not_joined"
            : "",
      // selectedJoiningDate: row.joining_date || "",
      // joinedDate: row.joined_date || "",
      profile_picture: row.profile_picture || "",
      documents: row.documents || [],
      emergencyContacts:
        normalizedContacts.length > 0
          ? normalizedContacts
          : [{ name: "", relationship: "", phone_number: "" }],
    };
  };
  const [showLogs, setShowLogs] = useState(false);
  const [logData, setLogs] = useState([]);
  const openEditModal = async (row) => {
    // console.log("open edit row", row);

    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);

    const response = await axiosInstance.get(
      `/api/contract-employee/edit/${row.id}`,
    );
    console.log("openeditmodal:", response.data);

    if (response.data.success) {
      const rowData = response.data.data; // Get fresh data from API
      const normalizedData = normalizeEditData(rowData);

      setEditData(normalizedData);
      setLogs(rowData?.rejoingdetails);

      if (normalizedData.profile_picture) {
        // If it's already a full URL, use it; otherwise, append base URL
        const imageUrl = normalizedData.profile_picture.startsWith("http")
          ? normalizedData.profile_picture
          : `${API_URL}/${normalizedData.profile_picture}`;
        setPhoto(imageUrl);
        setValue("profile_picture", normalizedData.profile_picture);
        // setValue("profile_picture", null);
      } else {
        setPhoto(null);
      }

      //     let normalizedDocs = [];
      //   if (rowData.document_groups) {
      //     normalizedDocs = rowData.document_groups.flatMap(group =>
      //       group.documents.map(doc => ({
      //         ...doc,
      //         id: doc.id,
      //         title: group.title,
      //         existing: true // marker for your UI
      //       }))
      //     );
      //   } else if (rowData.documents) {
      //     normalizedDocs = rowData.documents.map(doc => ({
      //   ...doc,
      //   existing: true
      // }));
      //   }

      //   setDocuments(normalizedDocs); // Update local state for the file list UI
      //   setValue("documents", normalizedDocs);

      const normalizedDocs = normalizeDocuments(rowData);
      setDocuments(normalizedDocs);
      setValue("documents", normalizedDocs);

      const selectedCompanyObj = companyDropdown.find(
        (c) => c.value === String(normalizedData.company),
      );

      setSelectedCompany(selectedCompanyObj?.value || "");

      reset({
        ...normalizedData,
        company: String(normalizedData.company),
        emergencyContacts: normalizedData.emergencyContacts,
      });
      setSelectedBoarding(normalizedData.boardingPoint);
      setSelectedEducation(normalizedData.education);
    }
  };

  // useEffect(() => {
  //   if (editData) {
  //     reset(editData);
  //   }
  // }, [editData, reset]);
  const [filterStartDate, setFilterStartDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [filterEndDate, setFilterEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [filterStatus, setFilterStatus] = useState("");
  const [filterGender, setFilterGender] = useState("");

  const [selectedCompanyfilter, setSelectedCompanyfilter] = useState("");

  // contract api
  const fetchContractCandidates = async () => {
    try {
      setLoading(true);
      const payload = {
        startDate: filterStartDate,
        endDate: filterEndDate,
        status: filterStatus,
        gender: filterGender,
        company_id: selectedCompanyfilter,
        education_id: selectedEducation,
      };
      // console.log("Sending payload as params:", payload);

      const queryParams = new URLSearchParams(payload).toString();
      const response = await axiosInstance.get(
        `api/contract-employee?${queryParams}`,
      );

      if (response.data.success) {
        setBoardingPoints(response.data.data.boardingpoints || []);
        setEducations(response.data.data.educations || []);
      }
      const employees = response?.data?.data?.employees || [];

      console.log("response emp check", response);

      setColumnData(response?.data?.data?.employees || []);
      setEmployeesList(response?.data?.data?.pssemployees || []);

      const companies = response.data.data?.companies.map((company) => ({
        // console.log("company", company),
        label: company.company_name,
        value: company.id,
        company_emp_id: company.company_emp_id,
      }));

      setCompanyOptions(companies);

             const educations = response.data.data.educations || [];

setEducationOptions(
  educations.map((edu) => ({
    label: edu.eduction_name,
    value: edu.id, // number is fine
  }))
);

    } catch (error) {
      console.error("Error fetching contract candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractCandidates();
    fetchCompanyList();
  }, []);

  const fetchId = async (payload) => {
    console.log("payload", payload);
    try {
      const response = await axiosInstance.post(
        `api/contract-employee/assign-emp-generate`,
        payload,
      );

      console.log("Success:", response.data.employee_id);
      const generatedId = response.data.employee_id;

      setEmployeeIds(generatedId);

      setValue("manual_value", generatedId, {
        shouldValidate: true,
      });
    } catch (error) {
      if (error.response) {
        console.log("Backend error:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Axios config error:", error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting Contract Candidates ID:", id);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Contract Candidates will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(
        `${API_URL}api/contract-employee/delete/${id}`,
      );

      setTimeout(
        () => toast.success("Contract Candidates deleted successfully"),
        300,
      );
      await fetchContractCandidates();
    } catch (error) {
      toast.error("Failed to delete Contract Candidates");
    }
  };

  const relationOptions = [
    { label: "Father", value: "Father" },
    { label: "Mother", value: "Mother" },
    { label: "Spouse", value: "Spouse" },
    { label: "Sibling", value: "Sibling" },
    { label: "Friend", value: "Friend" },
  ];

  const branchDropdown = [
    { label: "Branch 1", value: "Branch 1" },
    { label: "Branch 2", value: "Branch 2" },
    { label: "Branch 3", value: "Branch 3" },
  ];

  // const addEmergencyContact = () => {
  //   const last = emergencyContacts[emergencyContacts.length - 1];
  //   // Only add if last contact is filled
  //   if (last.name && last.phone && last.relation) {
  //     setEmergencyContacts([
  //       ...emergencyContacts,
  //       { name: "", phone: "", relation: "" },
  //     ]);
  //   } else {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Incomplete Contact",
  //       text: "Please complete the current contact before adding a new one",
  //     });
  //   }
  // };

  // const removeEmergencyContact = (index) => {
  //   if (emergencyContacts.length <= 1) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Cannot remove",
  //       text: "At least one contact is required",
  //     });
  //     return;
  //   }
  //   setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  // };
  // // Update Emergency Contact
  // const updateEmergencyContact = (index, field, value) => {
  //   const updatedContacts = [...emergencyContacts];
  //   updatedContacts[index][field] = value;
  //   setEmergencyContacts(updatedContacts);
  // };

  // const handleDownload = () => {
  //   window.print(); // user selects "Save as PDF"
  // };
const getEducationName = (educationId) => {
  if (!educationId || !educationOptions.length) return "-";

  const edu = educationOptions.find(
    e => Number(e.value) === Number(educationId)
  );

  return edu?.label || "-";
};



  const columns = [
    {
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
      style: { textAlign: "center", width: "80px" },
    },
    {
      header: "Name",
      field: "name",
      body: (row) => (
        <div>
          <div className="font-semibold">{Capitalise(row.name || "-")}</div>

          <div className="text-xs text-gray-500">{row.employee_id || "-"}</div>
        </div>
      ),
    },

    {
      header: "Phone",
      field: "phone_number",
      body: (row) => row.phone_number || "-",
    },

    {
      header: "DOB",
      field: "date_of_birth",
      body: (row) => formatToDDMMYYYY(row.date_of_birth),
    },

    {
      header: "Aadhar Number",
      field: "aadhar_number",
      body: (row) => row.aadhar_number || "-",
    },

    {
      header: "Education",
      body: (row) => getEducationName(row.education_id),
    },

    // {
    //   header: "Company",
    //   field: "company_name",
    //   body: (row) => row.company?.company_name || "-",
    // },

    {
      header: "Gender",
      field: "gender",
      body: (row) => row.gender || "-",
    },
    {
      field: "status",
      header: "Status",
      body: (row) => (
        <div
          className={`inline-block text-sm font-normal rounded-full w-[100px] justify-center items-center border 
            ${
              row.status === 0 || row.status === "0"
                ? "text-[#DC2626] bg-[#fff0f0] "
                : "text-[#16A34A] bg-[#e8fff0] "
            }`}
        >
          {row.status === 0 || row.status === "0" ? "Inactive" : "Active"}
        </div>
      ),
      style: { textAlign: "center" },
    },
    {
      header: "Action",
      body: (row) => (
        <div className="flex gap-4 justify-center items-center">
          <button
            onClick={() => handleView(row)}
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>

          <button
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
            onClick={() => openEditModal(row)}
          >
            <TfiPencilAlt />
          </button>
          <button
            className="p-2 bg-[#FFD1D1] text-[#DC2626] hover:bg-[#FFE2E2] rounded-[10px] "
            onClick={() => handleDelete(row.id)}
          >
            <MdOutlineDeleteOutline />
          </button>
        </div>
      ),
      style: { textAlign: "center", width: "120px" },
    },
  ];
  const [rejoinType, setRejoinType] = useState(null);

  console.log("rejoinType", rejoinType);
  // create
  const onSubmit = async (data) => {
    try {
      console.log("Form data before submit:", {
        profile_picture: data.profile_picture,
        profile_image_type: typeof data.profile_picture,
        isFile: data.profile_picture instanceof File,
        documents: data.documents,
        documents_length: data.documents?.length,
      });

      // if (isRejoining === true) {
      //   if (!rejoingnote) {
      //     toast.error("Rejoining notes required");
      //     return;
      //   }

      //   const rejoiningPayload = {
      //     parent_id: editData?.id,
      //     company_id: editData?.company,
      //     boarding_point_id: editData?.boardingPoint,
      //     address: editData?.address,
      //     joining_date: editData?.joinedDate,
      //     rejoin_status: 1,
      //     employee_id: editData?.manual_value,
      //     rejoining_note: rejoingnote,

      //     created_by: userId,
      //   };

      //   console.log("Rejoining payload:", rejoiningPayload);

      //   await axiosInstance.post(
      //     `${API_URL}api/contract-employee/emp-rejoing-create`,
      //     rejoiningPayload,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     },
      //   );

      //   toast.success("Rejoining created successfully");
      //   closeAddModal();
      //   fetchContractCandidates();
      //   return; //  VERY IMPORTANT (stop next API)
      // }
      const createCandidate = {
        name: data.name,
        address: data.address || "test",

        date_of_birth: formatDateToYMD(data.dob),
        father_name: data.fatherName,
        gender: data.gender,
        phone_number: data.phone,
        aadhar_number: data.aadhar,
        company_id: Number(data.company),
        joining_date: formatDateToYMD(data.joinedDate),
        acc_no: data.accountName,
        marital_status: data.maritalStatus,
        // boarding_point_id: Number(data.boardingPoint),
        boarding_point_id: data.boardingPoint
          ? Number(data.boardingPoint)
          : null,
        education_id:
          data.education && !isNaN(Number(data.education))
            ? Number(data.education)
            : null,
        pan_number: data.panNumber,
        city: data.city,
        state: data.state,
        branch_name: data.branch,
        current_address: data.currentAddress,
        account_number: data.accountNumber,
        ifsc_code: data.ifsccode,
        uan_number: data.uannumber,
        esic: data.esciNumber,
        employee_id: data.manual_value,
        bank_name: data.bankName,
        status_type: statusType,
        status: data.status,
        // status: 1,
        created_by: userId,
        role_id: userRole,
        rejoining_note: rejoingnote,
        rejoin_status: isRejoining,
        // rejoin_type: 1,
        // ...(rejoinType === 1 && { rejoin_type: 1 }),
        ...(rejoinTouched ? { rejoin_type: 1 } : {}),
        // rejoin_type: isRejoining ? 1 : null,
      };

      const formData = new FormData();

      Object.entries(createCandidate).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        formData.append(key, value);
      });

      //  emergency contacts (indexed)
      const validContacts = data.emergencyContacts.filter(
        (c) => c.name && c.relationship && c.phone_number,
      );

      validContacts.forEach((contact, index) => {
        formData.append(`contact_details[${index}][name]`, contact.name);
        formData.append(
          `contact_details[${index}][relationship]`,
          contact.relationship,
        );
        formData.append(
          `contact_details[${index}][phone_number]`,
          contact.phone_number,
        );
      });

      //  Profile image
      if (data.profile_picture instanceof File) {
        formData.append("profile_picture", data.profile_picture);
      } else if (typeof data.profile_picture === "string") {
        formData.append("existing_profile_picture", data.profile_picture);
      }

      // Documents (NEW FILES ONLY)
      console.log("on submit doc", documents);

      if (documents && documents.length > 0) {
        documents.forEach((doc, index) => {
          if (doc instanceof File) {
            formData.append("documents[]", doc);
          } else if (doc.id) {
            // formData.append(`existing_document_ids[${index}]`, doc.id);
            formData.append("existing_document_ids[]", doc.id);
            // formData.append("documents[]", doc.id);
          }
        });
      }

      console.log("Create candidate ,.... : .....", createCandidate);
      setLoading(true);

      const url = editData
        ? `/api/contract-employee/update/${editData.id}`
        : `/api/contract-employee/create`;

      const response = await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTimeout(
        () =>
          toast.success(
            editData ? "Updated Successfully" : "Created Successfully",
          ),
        300,
      );
      fetchContractCandidates();
      closeAddModal();
    } catch (error) {
      console.log("form submiting...:...", error);
      const res = error?.response?.data;

      if (res?.existing_id) {
        // for Aadhaar already exists case
        setExistingCandidate({
          id: res.existing_id,
          message: res.message,
        });
      } else {
        setExistingCandidate(null);
        setTimeout(
          () => toast.error(res?.message || "Server Error. Please Try Again."),
          300,
        );
        // setTimeout(() => toast.error(error?.response.data.message || "Server Error. Please Try Again."),300);
      }
    } finally {
      setLoading(false);
    }
  };

  const companyDropdown = companyOptions.map((c) => ({
    label: c.label,
    value: String(c.value),
    company_emp_id: c.company_emp_id,
  }));

  const handlCsvDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/csv/contract-employee-demo.csv";
    link.download = "contract-employee-demo.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [boardingPoints, setBoardingPoints] = useState([]);
  const [educations, setEducations] = useState([]);

  // Boarding Point dropdown options
  const boardingDropdown = boardingPoints.map((b) => ({
    label: b.point_name,
    value: String(b.id),
  }));

  // Education dropdown options
  const educationDropdown = educations.map((e) => ({
    label: e.eduction_name,
    value: String(e.id),
  }));

  // console.log("logData", logData);

  // const fetchLogs = async () => {
  //   try {
  //     const response = await axiosInstance.post(
  //       `${API_URL}api/contract-employee/emp-rejoing-list/`,
  //       {
  //         employee_id: editempid,
  //       },
  //     );

  //     console.log("responselogs", response);

  //     if (response.status === 200) {
  //       setLogs(response.data.data);
  //       // setShowLogs(true);
  //     }
  //   } catch (err) {
  //     toast.error("Unable To Load Candidate Details");
  //   }
  // };

  // useEffect(() => {
  //   if (editempid) {
  //     fetchLogs();
  //   }
  // }, [editempid]);

  // const logData = [
  //   {
  //     companyName: "PSS Agencies",
  //     boardingPoint: "Chennai",
  //     joiningDate: "2023-08-12",
  //     employeeId: "EMP001",
  //   },
  //   {
  //     companyName: "PSS Agencies",
  //     boardingPoint: "Bangalore",
  //     joiningDate: "2024-01-05",
  //     employeeId: "EMP045",
  //   },

  //   {
  //     companyName: "PSS Agencies",
  //     boardingPoint: "Mumbai",
  //     joiningDate: "2024-01-05",
  //     employeeId: "EMP045",
  //   },
  // ];

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-full overflow-x-auto min-h-screen px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            {/* <ToastContainer position="top-right" autoClose={3000} /> */}
            <Mobile_Sidebar />
            {/* Breadcrumbs */}
            <div className="flex gap-2 items-center cursor-pointer">
              <p
                className="text-xs md:text-sm text-gray-500  cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-xs  md:text-sm  text-[#1ea600]">Employee</p>
            </div>

            {/* Filter Section */}
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
                      value={filterStartDate || ""}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div>

                  {/* End Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filterEndDate || ""}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div>
                  {/* Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Status
                    </label>
                    <select
                      value={filterStatus || ""}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                      {/* <option value="terminated">Terminated</option> */}
                    </select>
                  </div>

                  {/* Gender Dropdown */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Gender
                    </label>
                    <select
                      value={filterGender || ""}
                      onChange={(e) => setFilterGender(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      {/* <option value="other">Other</option> */}
                    </select>
                  </div>

                     {/* education */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Education
                    </label>
                    <Dropdown
  value={selectedEducation}          // number (e.g. 8)
  options={educationOptions}
  optionLabel="label"
  optionValue="value"                
  onChange={(e) => setSelectedEducation(e.value)}
  placeholder="Select Education"
  filter
                      className="w-full border border-gray-300 text-sm text-[#7C7C7C] rounded-md"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Company
                    </label>

                    <div className="w-full">
                      <Dropdown
                        value={selectedCompanyfilter}
                        onChange={(e) => setSelectedCompanyfilter(e.value)}
                        options={companyOptions}
                        optionLabel="label"
                        placeholder="Select Company"
                        filter
                        className="w-full border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end gap-4">
                    <button
                      onClick={fetchContractCandidates}
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

            {/* Table Section */}
            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
              <div className="datatable-container mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-semibold text-base text-[#6B7280]">
                  Show
                </span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({
                        label: v,
                        value: v,
                      }))}
                      onChange={(e) => onRowsChange(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">
                      Entries Per Page
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 md:gap-11">
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
                        className="w-full pl-10 pr-3 py-2 rounded-md text-sm border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />
                      {globalFilter && (
                        <button
                          type="button"
                          onClick={() => setGlobalFilter("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </div>
                    <div className="hidden md:flex items-center">
                      <button
                        onClick={openImportAddModal}
                        className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] text-sm md:text-base font-medium w-20 rounded-lg"
                      >
                        Import
                      </button>
                    </div>
                    {/* sample csv format download */}
                    <div className="hidden md:flex items-center">
                      <button
                        onClick={handlCsvDownload}
                        className="
      flex items-center gap-2
      px-5 md:px-2 py-2
      text-xs md:text-sm font-semibold
      text-green-700
      bg-green-100
      rounded-full
      hover:bg-green-200
      transition
    "
                      >
                        <FiDownload className="text-lg" /> Demo CSV
                      </button>
                    </div>
                    <button
                      onClick={openAddModal}
                      className="hidden md:block px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] text-sm md:text-base font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      Add Employee
                    </button>
                  </div>
                </div>
                {/* mobile view */}
                <div className="flex md:hidden justify-between items-center gap-2">
                  <button
                    onClick={handlCsvDownload}
                    className="
      flex items-center gap-2
      px-3 py-2
      text-xs md:text-sm font-semibold
      text-green-700
      bg-green-100
      rounded-full
      hover:bg-green-200
      transition
    "
                  >
                    <FiDownload className="text-lg" /> Demo CSV
                  </button>
                  <button
                    onClick={openImportAddModal}
                    className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] text-sm md:text-base font-medium w-fit rounded-lg"
                  >
                    Import
                  </button>
                  <button
                    onClick={openAddModal}
                    className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] text-sm md:text-base font-medium  w-fit rounded-lg transition-all duration-200"
                  >
                    Add Employee
                  </button>
                </div>

                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    className="mt-8"
                    value={columnData}
                    paginator
                    rows={rows}
                    first={(page - 1) * rows}
                    onPage={onPageChange}
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
                </div>
              </div>
            </div>

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
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                    isAnimating ? "translate-x-0" : "translate-x-full"
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
                      Employee Candidates
                    </p>

                    {/* company */}
                    <div className="mt-3 flex justify-between items-center">
                      <label className="block text-md font-medium">
                        Company<span className="text-red-500">*</span>
                      </label>

                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={selectedCompany}
                          options={companyDropdown}
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select Company"
                          filter
                          className="w-full border border-gray-300 rounded-lg"
                          onChange={(e) => {
                            setSelectedCompany(e.value);
                            const obj = companyDropdown.find(
                              (item) => item.value === e.value,
                            );
                            setCompanyEmpType(
                              obj.company_emp_id?.toLowerCase(),
                            );
                            setValue("company", Number(e.value), {
                              shouldValidate: true,
                            });
                          }}
                        />
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
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {attachment && (
                          <div className="flex justify-between mt-2 items-center bg-gray-50 px-3 py-2 rounded-lg border">
                            <span className="text-sm text-gray-700 truncate w-[80%]">
                              {attachment.name}
                            </span>
                            <button
                              type="button"
                              onClick={handleDeleteFile}
                              title="Delete"
                              className="text-red-600 hover:text-red-800 text-[18px]"
                            >
                              <AiFillDelete />
                            </button>
                          </div>
                        )}
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
                        // className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                        onClick={handleFileSubmit}
                        disabled={isSubmitting}
                        className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] 
             disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmitting && (
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {isSubmitting ? "Uploading..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Modal */}
            {ModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div
                  className="absolute inset-0 "
                  onClick={closeAddModal}
                ></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out
                               ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
                >
                  <div
                    className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Toggle Sidebar"
                    onClick={closeAddModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="p-2 md:p-5">
                    <div className="flex justify-between items-center">
                      <p className="text-xl md:text-2xl font-medium">
                        {" "}
                        {!editData ? "ADD" : "Edit"} Employee
                      </p>
                      {backendValidationError && (
                        <span className=" text-red-600 text-sm">
                          {backendValidationError}
                        </span>
                      )}
                      {editData && (
                        <div
                          className="text-gray-800 hover:text-[#1ea600] cursor-pointer"
                          title="View Logs"
                          onClick={() => setShowLogs(true)}
                        >
                          <TbLogs size={20} />
                        </div>
                      )}
                    </div>

                    <form
                      onSubmit={handleSubmit(onSubmit, (errors) => {
                        console.log("FORM ERRORS ", errors);
                      })}
                    >
                      {/* Upload Photo */}
                      <div className="flex justify-end">
                        <div className="flex flex-col items-center gap-2">
                          <p className="font-medium">
                            {photo ? "Change Photo" : "Upload Photo"}{" "}
                            {/* <span className="text-red-500">*</span> */}
                          </p>

                          {/* Preview */}
                          <div className="relative">
                            {photo ? (
                              <img
                                src={
                                  photo instanceof File
                                    ? URL.createObjectURL(photo)
                                    : photo
                                }
                                className="w-32 h-40 rounded-md object-cover border"
                              />
                            ) : (
                              <div className="w-32 h-40 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400">
                                Upload
                              </div>
                            )}
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-2">
                            <label className="cursor-pointer bg-gray-200 px-3 py-1 rounded">
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handlePhotoChange}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => setOpenCamera(true)}
                              className="bg-gray-200 px-3 py-1 rounded"
                            >
                              Camera
                            </button>
                          </div>

                          {errors.profile_picture && (
                            <p className="text-red-500 text-sm">
                              {errors.profile_picture.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {openCamera && (
                        <CameraPhoto
                          onCapture={handleCameraCapture}
                          onClose={() => setOpenCamera(false)}
                        />
                      )}
                      {/* Company */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium">
                          Company Name <span className="text-red-500">*</span>
                        </label>

                        <div className="w-[50%] md:w-[60%]">
                          <Dropdown
                            value={selectedCompany}
                            options={companyDropdown}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Company"
                            filter
                            className="w-full border border-gray-300 rounded-lg"
                            onChange={(e) => {
                              setSelectedCompany(e.value);
                              const obj = companyDropdown.find(
                                (item) => item.value === e.value,
                              );
                              setCompanyEmpType(
                                obj.company_emp_id?.toLowerCase(),
                              );
                              setValue("company", String(e.value), {
                                shouldValidate: true,
                              });
                            }}
                          />

                          {errors.company && (
                            <p className="text-red-500 text-sm">
                              {errors.company.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* boarding Point */}{" "}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium">
                          Boarding Point
                          {/* <span className="text-red-500">*</span> */}
                        </label>

                        <div className="w-[50%] md:w-[60%]">
                          <Dropdown
                            value={selectedBoarding}
                            options={boardingDropdown}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Boarding Point"
                            filter
                            className="w-full border border-gray-300 rounded-lg"
                            onChange={(e) => {
                              setSelectedBoarding(e.value);
                              setValue("boardingPoint", e.value, {
                                shouldValidate: true,
                              });
                            }}
                          />

                          {errors.boardingPoint && (
                            <p className="text-red-500 text-sm">
                              {errors.boardingPoint.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Education */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium">
                          Education
                          {/* <span className="text-red-500">*</span> */}
                        </label>

                        <div className="w-[50%] md:w-[60%]">
                          <Dropdown
                            value={selectedEducation}
                            options={educationDropdown}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Education"
                            filter
                            className="w-full border border-gray-300 rounded-lg"
                            onChange={(e) => {
                              setSelectedEducation(e.value);
                              setValue("education", e.value, {
                                shouldValidate: true,
                              });
                            }}
                          />

                          {errors.education && (
                            <p className="text-red-500 text-sm">
                              {errors.education.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* NAME */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Name <span className="text-red-600">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="name"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            placeholder="Enter Name"
                            {...register("name")}
                          />
                          <span className="text-red-500 text-sm">
                            {errors.name?.message}
                          </span>
                        </div>
                      </div>
                      {/* dob */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          DOB <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="date"
                            name="dob"
                            {...register("dob")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.dob?.message}
                          </span>
                        </div>
                      </div>
                      {/* fathername */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Father Name <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="fatherName"
                            {...register("fatherName")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            placeholder="Enter The Father Name"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.fatherName?.message}
                          </span>
                        </div>
                      </div>
                      {/* marital status */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Marital Status
                          {/* <span className="text-red-500">*</span> */}
                        </label>

                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <div className="flex flex-wrap md:flex-nowrap gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="Married"
                                {...register("maritalStatus")}
                                className="accent-[#1ea600]"
                              />
                              Married
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="Unmarried"
                                {...register("maritalStatus")}
                                className="accent-[#1ea600]"
                              />
                              Unmarried
                            </label>
                          </div>
                        </div>
                      </div>
                      {/* 
                    {errors.maritalStatus && (
                      <p className="text-red-500 text-sm">
                        {errors.maritalStatus.message}
                      </p>
                    )} */}
                      {/* address */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <textarea
                            type="text"
                            name="address"
                            {...register("address")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            placeholder="Enter The Address"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.address?.message}
                          </span>
                        </div>
                      </div>
                      {/* city */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          City
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="city"
                            {...register("city")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            placeholder="Enter The City"
                          />
                          {/* <span className="text-red-500 text-sm">
                          {errors.city?.message}
                        </span> */}
                        </div>
                      </div>
                      {/* state */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          State
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="state"
                            {...register("state")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            placeholder="Enter The State"
                          />
                          {/* <span className="text-red-500 text-sm">
                          {errors.state?.message}
                        </span> */}
                        </div>
                      </div>
                      {/* current address */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Current Address
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <textarea
                            type="text"
                            name="currentAddress"
                            {...register("currentAddress")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            placeholder="Enter The Address"
                          />
                          {/* <span className="text-red-500 text-sm">
                          {errors.current_address?.message}
                        </span> */}
                        </div>
                      </div>
                      {/* gender */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>

                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="Male"
                                {...register("gender", {
                                  required: "Gender is required",
                                })}
                                className="accent-[#1ea600]"
                              />
                              Male
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="Female"
                                {...register("gender", {
                                  required: "Gender is required",
                                })}
                                className="accent-[#1ea600]"
                              />
                              Female
                            </label>
                          </div>

                          <span className="text-red-500 text-sm">
                            {errors.gender?.message}
                          </span>
                        </div>
                      </div>
                      {/* PHONE */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="tel"
                            name="phone"
                            {...register("phone")}
                            inputMode="numeric"
                            maxLength={10}
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                            }}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            placeholder="Enter Phone Number"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.phone?.message}
                          </span>
                        </div>
                      </div>
                      {/* Aadhaar */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Aadhaar Number <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="number"
                            name="aadhar"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("aadhar")}
                            inputMode="numeric"
                            maxLength={12}
                            onInput={(e) => {
                              e.target.value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 12);
                            }}
                            placeholder="Enter AadharNumber"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.aadhar?.message}
                          </span>
                        </div>
                      </div>
                      {existingCandidate && (
                        <p className="text-sm text-red-600 mt-1">
                          {existingCandidate.message}{" "}
                          <span
                            className="underline text-green-600 cursor-pointer"
                            onClick={() =>
                              handleViewExisting(existingCandidate.id)
                            }
                          >
                            Click More
                          </span>
                        </p>
                      )}
                      {/* pan number */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Pan Number
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="pannumber"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("panNumber")}
                            maxLength={10}
                            onInput={(e) => {
                              e.target.value = e.target.value
                                .toUpperCase() // convert to uppercase
                                .replace(/[^A-Z0-9]/g, "") // allow only letters & numbers
                                .slice(0, 10); // max 10 chars
                            }}
                            placeholder="Enter Pan Number"
                          />
                          {/* <span className="text-red-500 text-sm">
                          {errors.pan?.message}
                        </span> */}
                        </div>
                      </div>
                      {/* joinedDate date */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Joining Date <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="date"
                            name="joinedDate"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            // {...register("joinedDate")}
                            {...register("joinedDate", {
                              onChange: (e) => {
                                if (companyEmpType === "automatic") {
                                  fetchId({
                                    date_of_joining: e.target.value,
                                    company_id: selectedCompany,
                                  });
                                }
                              },
                            })}
                            placeholder="Enter interview Date"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.joinedDate?.message}
                          </span>
                          {/* {errors?.interviewDate && <p className="text-red-500 text-sm mt-1">{errors?.interviewDate}</p>} */}
                        </div>
                      </div>
                      {/* {companyEmpType && (
                        <div className="mt-5 flex justify-between items-center">
                          <label className="block text-md font-medium">
                            Employee Id <span className="text-red-500">*</span>
                          </label>

                          <div className="w-[50%] md:w-[60%] rounded-lg">
                            <input
                              type="text"
                              {...register("manual_value")}
                              readOnly={companyEmpType === "automatic"}
                              placeholder={
                                companyEmpType === "manual"
                                  ? " Employee ID"
                                  : "Employee ID"
                              }
                              className={`w-full px-2 py-2 border rounded-[10px]
          ${
            companyEmpType === "automatic"
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white"
          }`}
                            />
                          </div>
                        </div>
                      )} */}
                      {companyEmpType && (
                        <div className="mt-5 flex justify-between items-center">
                          <label className="block text-md font-medium">
                            Employee Id <span className="text-red-500">*</span>
                          </label>

                          <div className="w-[50%] md:w-[60%] rounded-lg">
                            <input
                              type="text"
                              {...register("manual_value")}
                              readOnly={companyEmpType === "automatic"}
                              placeholder={
                                companyEmpType === "manual"
                                  ? "Employee ID"
                                  : "Employee ID"
                              }
                              className={`w-full px-2 py-2 border rounded-[10px]
          ${
            companyEmpType === "automatic"
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white"
          }`}
                            />
                            {errors.manual_value && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.manual_value.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {/* bank name */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Bank Name
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="bankName"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("bankName")}
                            placeholder="Enter Bank Name"
                          />
                          {/* <span className="text-red-500 text-sm">
                          {errors.bankName?.message}
                        </span> */}
                          {/* {errors?.interviewDate && <p className="text-red-500 text-sm mt-1">{errors?.interviewDate}</p>} */}
                        </div>
                      </div>
                      {/* branch */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium">
                          Branch Name
                          {/* <span className="text-red-500">*</span> */}
                        </label>

                        <div className="w-[50%] md:w-[60%]">
                          <input
                            type="text"
                            name="branch"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("branch")}
                            placeholder="Enter Branch Name"
                          />

                          {/* {errors.branch && (
                          <p className="text-red-500 text-sm">
                            {errors.branch.message}
                          </p>
                        )} */}
                        </div>
                      </div>
                      {/* account name */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Account Name
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="accountName"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("accountName")}
                            placeholder="Enter Account Name"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.accountName?.message}
                          </span>
                          {/* {errors?.interviewDate && <p className="text-red-500 text-sm mt-1">{errors?.interviewDate}</p>} */}
                        </div>
                      </div>
                      {/* account number */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="accountNumber"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("accountNumber")}
                            placeholder="Enter Account Number"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.accountNumber?.message}
                          </span>
                          {/* {errors?.interviewDate && <p className="text-red-500 text-sm mt-1">{errors?.interviewDate}</p>} */}
                        </div>
                      </div>
                      {/* ifsc code */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="ifsccode"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("ifsccode")}
                            placeholder="Enter IFSC Code"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.ifsccode?.message}
                          </span>
                          {/* {errors?.interviewDate && <p className="text-red-500 text-sm mt-1">{errors?.interviewDate}</p>} */}
                        </div>
                      </div>
                      {/* uan number */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          UAN Number <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="uannumber"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("uannumber")}
                            placeholder="Enter UAN Number"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.uannumber?.message}
                          </span>
                          {/* {errors?.interviewDate && <p className="text-red-500 text-sm mt-1">{errors?.interviewDate}</p>} */}
                        </div>
                      </div>
                      {/* esic  */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          ESIC <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="esciNumber"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("esciNumber")}
                            placeholder="Enter ESIC Number"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.esciNumber?.message}
                          </span>
                          {/* {errors?.interviewDate && <p className="text-red-500 text-sm mt-1">{errors?.interviewDate}</p>} */}
                        </div>
                      </div>
                      {/* status */}
                      <div className="mt-5 flex justify-between items-center">
                        <label
                          htmlFor="status"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>

                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <select
                            // {...register("status", {
                            //   onChange: async (e) => {
                            //     const status = Number(e.target.value); // 1 or 0
                            //     setValue("status", status);

                            //     if (editData?.id) {
                            //       await handleStatusChange(status);
                            //     }
                            //   },
                            // })}
                            // {...register("status", {
                            //   onChange: (e) => {
                            //     const value = e.target.value;

                            //     setValue("status", value, { shouldDirty: true });

                            //     if (value === "1" || value === "0") {
                            //       setStatusType(1);
                            //     } else {
                            //       setStatusType(0);
                            //     }
                            //   },
                            // })}
                            {...register("status", {
                              onChange: (e) => {
                                const value = e.target.value;

                                setValue("status", value, {
                                  shouldDirty: true,
                                });

                                // If user selected Joined or Relieved → mark status_type = 1
                                if (value === "1" || value === "0") {
                                  setStatusType(1);
                                } else {
                                  setStatusType(0);
                                }
                              },
                            })}
                            className="w-full px-2 py-2 border border-gray-300 rounded-[10px]"
                          >
                            <option disabled selected>
                              Select a status
                            </option>
                            <option value="1">Joined</option>
                            <option value="0">Relieved</option>
                            {/* <option value="2">Relieved</option> */}
                          </select>
                          {errors.status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.status.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {editData && (
                        <>
                          {/* rejoing */}
                          <div className="mt-4 flex items-center justify-between">
                            <label className="block text-md font-medium mb-2">
                              Rejoining
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer">
                              {/* <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isRejoining === 1}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setIsRejoining(checked ? 1 : 0); 
                                  setRejoinType(1); 
                                }}
                              /> */}

                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isRejoining === 1}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setIsRejoining(checked ? 1 : 0);
                                  setRejoinTouched(true);
                                }}
                              />

                              <div
                                className="w-11 h-6 bg-gray-300 rounded-full peer 
      peer-checked:bg-[#1ea600]
      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
      after:bg-white after:rounded-full after:h-5 after:w-5
      after:transition-all peer-checked:after:translate-x-5"
                              ></div>
                            </label>
                          </div>
                          {/*  */}
                          {isRejoining === 1 && (
                            <div className="mt-3 flex justify-between items-start">
                              <label className="block text-md font-medium mt-2">
                                Rejoining Notes
                              </label>

                              <div className="w-[50%] md:w-[60%]">
                                <textarea
                                  name="rejoingnote"
                                  value={rejoingnote}
                                  onChange={(e) =>
                                    setRejoingnote(e.target.value)
                                  }
                                  rows={3}
                                  placeholder="Enter rejoining notes..."
                                  className="w-full px-2 py-2 border border-gray-300 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                                />

                                {errors.rejoingnote && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.rejoingnote.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {/* Emergency Contacts */}
                      <div className="rounded-[10px] border-2 border-[#E0E0E0] bg-white py-2 px-2 lg:px-4 my-5">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                          <p className="text-lg md:text-xl font-semibold">
                            Emergency Contacts
                          </p>
                          <IoAddCircleSharp
                            className="text-[#1ea600] text-3xl cursor-pointer"
                            // onClick={addEmergencyContact}
                            onClick={() =>
                              append({
                                name: "",
                                relationship: "",
                                phone_number: "",
                              })
                            }
                          />
                        </div>

                        {/* Table Head */}
                        <div className="mt-4">
                          <div className="grid grid-cols-3 font-semibold text-sm md:text-base text-[#4A4A4A] bg-gray-50 p-2 rounded-[10px] text-center">
                            <span>Name</span>
                            <span>Relation</span>
                            <span>Phone No</span>
                          </div>

                          {/* Rows */}
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="relative grid grid-cols-3 gap-4 border p-3 rounded-[10px] mt-3 bg-gray-50"
                            >
                              {/* Remove */}
                              {index > 0 && (
                                <IoIosCloseCircle
                                  className="absolute top-2 right-2 text-red-500 text-xl cursor-pointer"
                                  // onClick={() => removeEmergencyContact(index)}
                                  onClick={() => remove(index)}
                                />
                              )}

                              {/* Name */}
                              {/* <div className="flex flex-col mt-1">
          <input
            type="text"
            placeholder="Full Name"
            value={item.name}
            onChange={(e) =>
              updateEmergencyContact(index, "name", e.target.value)
            }
            className="border-2 ps-3 h-10 border-gray-300 w-full text-sm rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
          />
        </div> */}
                              <div>
                                <input
                                  {...register(
                                    `emergencyContacts.${index}.name`,
                                  )}
                                  placeholder="Full Name"
                                  className="border h-10 w-full rounded px-2"
                                />
                                <p className="text-red-500 text-xs">
                                  {
                                    errors?.emergencyContacts?.[index]?.name
                                      ?.message
                                  }
                                </p>
                              </div>

                              {/* Relation */}
                              {/* <div className="flex flex-col mt-1">
          <select
            value={item.relationship}
            onChange={(e) =>
              updateEmergencyContact(index, "relationship", e.target.value)
            }
            className="border-2 ps-3 h-10 border-gray-300 w-full text-sm rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
          >
            <option value="">Select Relation</option>
            {relationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div> */}
                              <div>
                                <select
                                  {...register(
                                    `emergencyContacts.${index}.relationship`,
                                  )}
                                  className="border h-10 w-full rounded px-2"
                                >
                                  <option value="">Select</option>
                                  {relationOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <p className="text-red-500 text-xs">
                                  {
                                    errors?.emergencyContacts?.[index]
                                      ?.relationship?.message
                                  }
                                </p>
                              </div>

                              {/* Phone */}
                              {/* <div className="flex flex-col mt-1">
          <input
            type="text"
            placeholder="Phone Number"
            value={item.phone_number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                updateEmergencyContact(index, "phone_number", value);
              }
            }}
            className="border-2 ps-3 h-10 border-gray-300 w-full text-sm rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
          />
        </div> */}
                              <div>
                                <input
                                  {...register(
                                    `emergencyContacts.${index}.phone_number`,
                                  )}
                                  placeholder="Phone Number"
                                  maxLength={10}
                                  className="border h-10 w-full rounded px-2"
                                />
                                <p className="text-red-500 text-xs">
                                  {
                                    errors?.emergencyContacts?.[index]
                                      ?.phone_number?.message
                                  }
                                </p>
                              </div>
                            </div>
                          ))}
                          <p className="text-red-600 text-sm mt-2">
                            {errors?.emergencyContacts?.message}
                          </p>
                        </div>
                      </div>
                      {/* Documents */}
                      <div className="mt-5 flex justify-between items-start">
                        <label className="block text-md font-medium">
                          Documents
                          {/* <span className="text-red-500">*</span> */}
                        </label>

                        <div className="w-[50%] md:w-[60%]">
                          {/* Upload button */}
                          <label className="cursor-pointer bg-gray-200 px-3 py-2 rounded inline-block mb-2">
                            Select Documents
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.png"
                              hidden
                              onChange={handleDocumentChange}
                            />
                          </label>

                          {/* Selected documents list */}

                          <div className="mt-4 space-y-2">
                            {documents.map((doc, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-2 border rounded"
                              >
                                <span className="text-sm truncate">
                                  {doc instanceof File
                                    ? doc.name
                                    : doc.original_name || "Existing Document"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(index)}
                                  className="text-red-500 font-bold px-2"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>

                          {errors.documents && (
                            <p className="text-red-500 text-sm mt-1">
                              Documents are required
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Button */}
                      <div className="flex  justify-end gap-2 mt-6 md:mt-14">
                        <button
                          onClick={closeAddModal}
                          className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                          // onClick={handleSubmit(onSubmit, (errors) =>
                          //   console.log(errors),
                          // )}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* logs details */}

            {/* {showLogs && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white w-[90%] md:w-[500px] rounded-2xl shadow-xl p-5">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Employee Joining Logs
                    </h2>
                    <button
                      onClick={() => setShowLogs(false)}
                      className="text-gray-500 hover:text-red-500 text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto">
                    {logData.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-xl p-3 hover:border-[#1ea600] transition"
                      >
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="text-gray-500">Company</p>
                          <p className="font-medium">{item.companyName}</p>

                          <p className="text-gray-500">Boarding Point</p>
                          <p className="font-medium">{item.boardingPoint}</p>

                          <p className="text-gray-500">Joining Date</p>
                          <p className="font-medium">{item.joiningDate}</p>

                          <p className="text-gray-500">Employee ID</p>
                          <p className="font-medium">{item.employeeId}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setShowLogs(false)}
                      className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )} */}

            {showLogs && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
                {/* Modal box */}
                <div className="bg-white w-full md:w-[900px] rounded-2xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="px-5 py-4 bg-green-600 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold">
                          Employee Joining Logs
                        </h2>

                        {/* Employee Name */}
                        <p className="mt-1 text-sm bg-white/20 inline-block px-3 py-1 rounded-full">
                          👤 {logData[0]?.employee?.name || "Employee"}
                        </p>
                      </div>

                      <button
                        onClick={() => setShowLogs(false)}
                        className="text-white hover:text-red-200 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 max-h-[500px] overflow-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] border border-green-600 rounded-lg">
                        <thead className="bg-green-100 text-green-800 text-sm sticky top-0 z-10">
                          <tr>
                            <th className="px-3 py-2 text-left w-[60px]">
                              S.No
                            </th>
                            <th className="px-4 py-2 text-left">Company</th>
                            <th className="px-4 py-2 text-left">Employee ID</th>
                            <th className="px-4 py-2 text-left">
                              Joining Date
                            </th>
                            <th className="px-4 py-2 text-left">
                              Rejoining Note
                            </th>
                          </tr>
                        </thead>

                        <tbody className="text-sm">
                          {logData.length > 0 ? (
                            logData.map((item, index) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-green-50 transition"
                              >
                                <td className="px-3 py-2 text-left font-medium">
                                  {index + 1}
                                </td>

                                <td className="px-4 py-2 text-left font-medium text-gray-800">
                                  {item.company?.company_name || "-"}
                                </td>

                                <td className="px-4 py-2 text-left text-gray-700">
                                  {item.employee_id || "-"}
                                </td>

                                <td className="px-4 py-2 text-left text-gray-700">
                                  {item.joining_date || "-"}
                                </td>

                                <td className="px-4 py-2 text-left text-gray-700 whitespace-pre-wrap">
                                  {item.rejoining_note || "—"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-4 py-8 text-center text-gray-500"
                              >
                                No joining logs found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end px-5 py-3 bg-gray-50 border-t">
                    <button
                      onClick={() => setShowLogs(false)}
                      className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isViewModalOpen && viewRow && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative max-h-[90vh] flex flex-col animate-fadeIn">
                  {/* Close Button */}
                  {/* <button className="absolute top-4 right-20 text-gray-500 hover:text-green-500">
                    <IoMdDownload size={28} />
                  </button>
                  <button className="absolute top-4 right-12 text-gray-500 hover:text-green-500">
                    <TfiPrinter size={28} />
                  </button>
                  <button
                    onClick={closeViewModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                  >
                    <IoIosCloseCircle size={28} />
                  </button> */}

                  {/* Title and profile image */}
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 border-b pb-4">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-[#1ea600]">
                      Employee Details
                    </h2>

                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      {viewRow.profile_picture ? (
                        <img
                          src={
                            viewRow.profile_picture.startsWith("http")
                              ? viewRow.profile_picture
                              : `${API_URL}${viewRow.profile_picture}`
                          }
                          alt="Profile"
                          className="w-20 h-24 rounded-md object-cover border-2 border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 border border-dashed text-xs">
                          No Photo
                        </div>
                      )}

                      {/* Action Icons */}
                      <div className="flex items-center gap-4">
                        {/* Download */}
                        {/* <button
        title="Download"
        onClick={() => handleDownload(viewRow)}
        className="text-gray-500 hover:text-green-600"
      >
        <IoMdDownload size={26} />
      </button> */}

                        {/* Print */}
                        <button
                          title="Print"
                          onClick={() => window.print()}
                          className="text-gray-500 hover:text-green-600"
                        >
                          <TfiPrinter size={24} />
                        </button>

                        {/* Close */}
                        <button
                          title="Close"
                          onClick={closeViewModal}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <IoIosCloseCircle size={26} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* body */}
                  <div className="pr-2 overflow-y-auto ">
                    {/* Candidate Info */}
                    <div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p>
                          <b>Company:</b>{" "}
                          {companyOptions.find(
                            (c) => c.value === viewRow.company_id,
                          )?.label || "-"}
                        </p>
                        <p>
                          <b>Branch:</b> {viewRow.branch_name || "-"}
                        </p>
                        <p>
                          <b>Name:</b> {viewRow.name || "-"}
                        </p>
                        <p>
                          <b>Phone:</b> {viewRow.phone_number || "-"}
                        </p>
                        <p>
                          <b>Aadhar Number:</b> {viewRow.aadhar_number || "-"}
                        </p>
                        <p>
                          <b>Pan Number:</b> {viewRow.pan_number || "-"}
                        </p>
                        <p>
                          <b>Bank Name:</b> {viewRow.bank_name || "-"}
                        </p>
                        <p>
                          <b>Account Name:</b> {viewRow.acc_no || "-"}
                        </p>
                        <p>
                          <b>Account Number:</b> {viewRow.account_number || "-"}
                        </p>
                        <p>
                          <b>Address:</b> {viewRow.address || "-"}
                        </p>
                        <p>
                          <b>City:</b> {viewRow.city || "-"}
                        </p>
                        <p>
                          <b>State:</b> {viewRow.state || "-"}
                        </p>
                        <p>
                          <b>Current Address:</b>{" "}
                          {viewRow.current_address || "-"}
                        </p>

                        <p>
                          <b>Date of Birth:</b>{" "}
                          {formatToDDMMYYYY(viewRow.date_of_birth) || "-"}
                        </p>
                        <p>
                          <b>Father Name:</b> {viewRow.father_name || "-"}
                        </p>
                        <p>
                          <b>Gender:</b> {viewRow.gender || "-"}
                        </p>
                        <p>
                          <b>ESIC:</b> {viewRow.esic || "-"}
                        </p>
                        <p>
                          <b>IFSC Code:</b> {viewRow.ifsc_code || "-"}
                        </p>
                        <p>
                          <b>UAN Number:</b> {viewRow.uan_number || "-"}
                        </p>
                        <p>
                          <b>Status:</b>{" "}
                          {viewRow.status === 1 ? "Active" : "Inactive"}
                        </p>
                        <p>
                          <b>Joining Date:</b>{" "}
                          {formatToDDMMYYYY(viewRow.joining_date) || "-"}
                        </p>
                        <p>
                          <b>Employee ID:</b> {viewRow.employee_id || "-"}
                        </p>

                        <p>
                          <b>Marital Status:</b> {viewRow.marital_status || "-"}
                        </p>
                      </div>

                      {/* emergency contact */}

                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">
                          Emergency Contacts
                        </h3>

                        {viewRow?.contacts &&
                        Array.isArray(viewRow.contacts) &&
                        viewRow.contacts.length > 0 ? (
                          <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Relation</th>
                                <th className="border p-2">Phone Number</th>
                              </tr>
                            </thead>
                            <tbody>
                              {viewRow.contacts.map((c, i) => (
                                <tr key={i}>
                                  <td className="border p-2">{c.name}</td>
                                  <td className="border p-2">
                                    {c.relationship}
                                  </td>
                                  <td className="border p-2">
                                    {c.phone_number}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500">No contacts available</p>
                        )}
                      </div>

                      <div className="col-span-2 pt-4">
                        <b className="block mb-2 text-gray-700">Documents:</b>
                        {/* Check if documents is an array and has items */}
                        {viewRow.documents && viewRow.documents.length > 0 ? (
                          <div className="space-y-2">
                            {viewRow.documents.map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border"
                              >
                                <span className="text-gray-600 truncate flex-1">
                                  {doc.original_name || `Document ${index + 1}`}
                                </span>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `${API_URL}/${doc.document_path}`,
                                        "_blank",
                                      )
                                    }
                                    className="bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-blue-100"
                                  >
                                    View/Print
                                  </button>
                                  {/* <button
    onClick={() =>
      window.open(`${API_URL}/${doc.document_path}?download=true`, "_blank")
    }
    className="bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
  >
    Download
  </button> */}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            No documents uploaded.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isExistingCandidateViewModalOpen && viewExistingCandidate && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative max-h-[90vh] flex flex-col animate-fadeIn">
                  {/* Close Button */}
                  {/* <button
                                onClick={closeViewModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                              >
                                <IoIosCloseCircle size={28} />
                              </button> */}

                  {/* Title and profile picture */}
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 border-b pb-4">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-[#1ea600]">
                      View Existing Contract Employee Details
                    </h2>

                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      {viewExistingCandidate.profile_picture ? (
                        <img
                          src={
                            viewExistingCandidate.profile_picture.startsWith(
                              "http",
                            )
                              ? viewExistingCandidate.profile_picture
                              : `${API_URL}${viewExistingCandidate.profile_picture}`
                          }
                          alt="Profile"
                          className="w-20 h-24 rounded-md object-cover border-2 border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 border border-dashed text-xs">
                          No Photo
                        </div>
                      )}

                      {/* Action Icons */}
                      <div className="flex items-center gap-4">
                        {/* Download */}
                        {/* <button
                    title="Download"
                    onClick={() => handleDownload(viewRow)}
                    className="text-gray-500 hover:text-green-600"
                  >
                    <IoMdDownload size={26} />
                  </button> */}

                        {/* Print */}
                        <button
                          title="Print"
                          onClick={() => window.print()}
                          className="text-gray-500 hover:text-green-600"
                        >
                          <TfiPrinter size={24} />
                        </button>

                        {/* Close */}
                        <button
                          title="Close"
                          onClick={handleCloseViewExistingCandidate}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <IoIosCloseCircle size={26} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* body */}
                  <div className="pr-2 overflow-y-auto ">
                    {/* Candidate Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <b>Company:</b>{" "}
                        {companyOptions.find(
                          (c) => c.value === viewExistingCandidate.company_id,
                        )?.label || "-"}
                      </p>

                      <p>
                        <b>Name:</b> {viewExistingCandidate.name}
                      </p>
                      <p>
                        <b>Phone:</b> {viewExistingCandidate.phone_number}
                      </p>

                      <p>
                        <b>Aadhar Number:</b>{" "}
                        {viewExistingCandidate.aadhar_number}
                      </p>

                      <p>
                        <b>Pan Number:</b>{" "}
                        {viewExistingCandidate.pan_number || "-"}
                      </p>
                      <p>
                        <b>Gender:</b> {viewExistingCandidate.gender || "-"}
                      </p>
                      <p>
                        <b>Marital Status:</b>{" "}
                        {viewExistingCandidate.marital_status || "-"}
                      </p>
                      <p>
                        <b>Education:</b>{" "}
                        {viewExistingCandidate.education?.eduction_name || "-"}
                      </p>
                      <p>
                        <b>Interview Date:</b>{" "}
                        {formatToDDMMYYYY(
                          viewExistingCandidate.interview_date,
                        ) || "-"}
                      </p>
                      <p>
                        <b>Interview Status:</b>{" "}
                        <span className="font-medium">
                          {viewExistingCandidate.interview_status || "-"}
                        </span>
                      </p>

                      <p>
                        <b>Candidate Status:</b>{" "}
                        {viewExistingCandidate.joining_status || "-"}
                      </p>
                      <p>
                        <b>Joining Date:</b>{" "}
                        {formatToDDMMYYYY(viewExistingCandidate.joining_date) ||
                          "-"}
                      </p>
                      <p>
                        <b>Joined Date:</b>{" "}
                        {viewExistingCandidate.joined_date
                          ? formatToDDMMYYYY(viewExistingCandidate.joined_date)
                          : "-"}
                      </p>
                      <p>
                        <b>Reference:</b>{" "}
                        {viewExistingCandidate.reference || "-"}
                      </p>
                      {viewExistingCandidate?.other_reference !== null && (
                        <p>
                          <b>Other Reference:</b>{" "}
                          {viewExistingCandidate.other_reference || "-"}
                        </p>
                      )}

                      <p className="col-span-2">
                        <b>Notes:</b>{" "}
                        {viewExistingCandidate.notes_details?.[0]?.notes ||
                          "No notes available"}
                      </p>

                      <div className="col-span-2 pt-4">
                        <b className="block mb-2 text-gray-700">Documents:</b>
                        {/* Check if documents is an array and has items */}
                        {viewExistingCandidate.documents &&
                        viewExistingCandidate.documents.length > 0 ? (
                          <div className="space-y-2">
                            {viewExistingCandidate.documents.map(
                              (doc, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border"
                                >
                                  <span className="text-gray-600 truncate flex-1">
                                    {doc.original_name ||
                                      `Document ${index + 1}`}
                                  </span>

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        window.open(
                                          `${API_URL}/${doc.document_path}`,
                                          "_blank",
                                        )
                                      }
                                      className="bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-blue-100"
                                    >
                                      View/Print
                                    </button>
                                    {/* <button
                onClick={() =>
                  window.open(`${API_URL}/${doc.document_path}?download=true`, "_blank")
                }
                className="bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
              >
                Download
              </button> */}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            No documents uploaded.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*  Skipped Employees Popup (Tailwind) */}
            {showSkipModal && importskip.length > 0 && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowSkipModal(false)}
                />

                {/* Modal Box */}
                <div className="relative w-[95%] max-w-4xl rounded-2xl bg-white shadow-2xl border border-green-200 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-green-600">
                    <h2 className="text-white font-bold text-lg">
                      ⚠️ Skipped Employees ({importskip.length})
                    </h2>

                    <button
                      onClick={() => setShowSkipModal(false)}
                      className="text-white text-2xl font-bold hover:opacity-80"
                    >
                      ×
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      These employees were skipped because they already exist /
                      duplicate.
                    </p>

                    <div className="overflow-auto rounded-xl border border-green-100">
                      <table className="w-full text-sm">
                        <thead className="bg-green-50">
                          <tr className="text-left text-gray-700">
                            <th className="px-4 py-3 w-[80px] font-semibold">
                              S.No
                            </th>
                            <th className="px-4 py-3 font-semibold">
                              Employee Name
                            </th>
                            <th className="px-4 py-3 w-[240px] font-semibold">
                              Aadhar Number
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {importskip?.map((item, index) => (
                            <tr
                              key={index}
                              className="border-t hover:bg-green-50/40 transition"
                            >
                              <td className="px-4 py-3 font-bold">
                                {index + 1}
                              </td>

                              <td className="px-4 py-3 font-semibold uppercase text-gray-800">
                                {item?.existing_employee?.employee_name || "-"}
                              </td>

                              <td className="px-4 py-3 font-semibold text-green-700">
                                {item?.existing_employee?.aadhar_number || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
                    <button
                      onClick={() => setShowSkipModal(false)}
                      className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                      OK
                    </button>
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

export default Employee_contract_details;
