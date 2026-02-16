import { useState, useEffect, useRef } from "react";
import { TfiPencilAlt, TfiPrinter } from "react-icons/tfi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { DataTable } from "primereact/datatable";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FiDownload, FiSearch } from "react-icons/fi";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FaEye } from "react-icons/fa6";

import Swal from "sweetalert2";
import { IoIosCloseCircle } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";

import { id } from "zod/v4/locales";
import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig";
import { formatToDDMMYYYY } from "../../Utils/dateformat";
import Loader from "../Loader";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { Capitalise } from "../../hooks/useCapitalise";
import CameraPhoto from "../../Utils/cameraPhoto";
import { FiX } from "react-icons/fi";

const ContractCandidates_Mainbar = () => {
  const [searchParams] = useSearchParams();

  const companyId = searchParams.get("company_id");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const joiningStatus = searchParams.get("joining_status");
  const interviewStatusParam = searchParams.get("interview_status");
  useEffect(() => {
    const resolvedCompanyId = companyId ?? selectedCompanyfilter;
    const resolvedStartDate = startDate ?? filterStartDate;
    const resolvedEndDate = endDate ?? filterEndDate;
    const resolvedJoiningStatus = joiningStatus ?? filterCandidateStatus;
    // let resolvedInterviewStatus = joiningStatus ?? filterInterviewStatus;
    const resolvedInterviewStatus =
      interviewStatusParam ?? filterInterviewStatus;

    // sync UI
    if (companyId) setSelectedCompanyfilter(companyId);
    if (startDate) setFilterStartDate(startDate);
    if (endDate) setFilterEndDate(endDate);
    if (joiningStatus) setFilterCandidateStatus(joiningStatus);
    if (interviewStatusParam) setFilterInterviewStatus(interviewStatusParam);

    fetchContractCandidates({
      companyId: resolvedCompanyId,
      startDate: resolvedStartDate,
      endDate: resolvedEndDate,
      joiningStatus: resolvedJoiningStatus,
      interviewStatus: resolvedInterviewStatus,
    });
  }, [companyId, startDate, endDate, joiningStatus]);

  // console.log("Psspermission", Psspermission);

  // console.log("canCreate", canFilter);
  //navigation
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [columnData, setColumnData] = useState([]);
  // console.log("columnData", columnData);
  const [error, setError] = useState(null);
  const [employeesList, setEmployeesList] = useState([]);
  const [backendValidationError, setBackendValidationError] = useState(null);
  const [employeeIds, setEmployeeIds] = useState([]);

  const user = localStorage.getItem("pssuser");
  // console.log("user", user);

  const [joinedType, setJoinedType] = useState(0);

  console.log("joinedType", joinedType);

  const userId = JSON.parse(user).id;
  // console.log("userId", userId);
  const userRole = JSON.parse(user).role_id;
  // console.log("userRole", userRole);

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const candidateContractSchema = z
    .object({
      //  profile_picture: id ? z
      // .union([z.instanceof(File), z.string()])
      // .refine((val) => val instanceof File || (typeof val === "string" && val.length > 0), {
      //     message: "Profile image is required",
      // }).optional() : z
      // .union([z.instanceof(File), z.string()])
      // .refine((val) => val instanceof File || (typeof val === "string" && val.length > 0), {
      //     message: "Profile image is required",
      // }),
      name: z.string().min(1, "Name is required"),
      // dob: z.string().min(1, "Date of birth is required"),
      // fatherName: z.string().min(1, "Father's name is required"),
      // address: z.string().min(1, "Address is required"),
      gender: z.string().optional(),
      marital: z.string().optional(),
      phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
      aadhar: z.string().regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
      pan_number: z.string().optional(),
      company: z.string().min(1, "Company is required"),

      interviewDate: z.string().min(1, "Interview date is required"),
      interviewStatus: z.string().min(1, "Interview status is required"),
      candidateStatus: z.string().min(1, "Candidate status is required"),
      reference: z.string().min(1, "Reference is required"),
      education: z
        .number({
          required_error: "Education is required",
          invalid_type_error: "Education is required",
        })
        .int()
        .positive("Education is required"),
      // Make these optional in base schema, they'll be conditionally required
      rejectReason: z.string().optional(),
      candidateStatus: z.string().optional(),
      holdReason: z.string().optional(),
      waitReason: z.string().optional(),
      selectedJoiningDate: z.string().optional(),
      notJoinedReason: z.string().optional(),
      joinedDate: z.string().optional(),
      reference: z.string().optional(),
      otherReference: z.string().optional(),
      notes_details: z.object({
        notes: z.string().optional(),
        note_status: z.string().optional(),
      }),
      profile_picture: z.any().optional(),
      documents: z.array(z.any()).optional(),
    })

    .superRefine((data, ctx) => {
      // Interview status specific validations
      if (
        data.interviewStatus === "selected" &&
        !data.selectedJoiningDate?.trim()
      ) {
        ctx.addIssue({
          path: ["selectedJoiningDate"],
          message: "Joining date is required when interview is selected",
          code: z.ZodIssueCode.custom,
        });
      }
      if (
        ["rejected", "hold", "waiting"].includes(data.interviewStatus) &&
        !data.notes_details?.notes?.trim()
      ) {
        ctx.addIssue({
          path: ["notes_details", "notes"],
          message: "Reason is required",
          code: z.ZodIssueCode.custom,
        });
      }
      // Candidate status specific validations
      if (data.candidateStatus === "joined" && !data.joinedDate?.trim()) {
        ctx.addIssue({
          path: ["joinedDate"],
          message: "Joined date is required when candidate joins",
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        data.candidateStatus === "not_joined" &&
        !data.notJoinedReason?.trim()
      ) {
        ctx.addIssue({
          path: ["notJoinedReason"],
          message: "Reason is required when candidate does not join",
          code: z.ZodIssueCode.custom,
        });
      }

      // Reference validation
      if (data.reference === "other" && !data.otherReference?.trim()) {
        ctx.addIssue({
          path: ["otherReference"],
          message: "Other reference is required when reference is 'other'",
          code: z.ZodIssueCode.custom,
        });
      }
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
      name: editData ? editData.name : "",
      phone: editData ? editData.phone_number : "",
      aadhar: editData ? editData.aadhar_number : "",
      pan_number: editData ? editData.pan_number : "",
      company: editData ? editData.company_name : "",

      interviewDate: editData ? editData.interview_date : getTodayDate(),
      interviewStatus: editData ? editData.interview_status : "",
      // rejectReason: editData ? editData.rejectReason : "",
      // holdReason: editData ? editData.holdReason : "",
      notes_details: {
        notes: editData ? editData.notes : "",
        note_status: editData ? editData.interview_status : "",
      },
      selectedJoiningDate: editData
        ? editData.selectedJoiningDate
        : getTodayDate(),
      candidateStatus: editData ? editData.candidateStatus : "",
      notJoinedReason: editData ? editData.notJoinedReason : "",
      joinedDate: editData ? editData.joinedDate : "",
      reference: editData ? editData.reference : "",
      otherReference: editData ? editData.otherReference : "",
      education: editData ? Number(editData.education_id) : null,
      profile_picture: editData ? editData.profile_picture : "",
      documents: editData ? editData.documents : [],
      // dob: editData ? editData.dob : "",
      // fatherName: editData ? editData.fatherName : "",
      // address: editData ? editData.address : "",
      gender: editData ? editData.gender : "",
      marital: editData ? editData.marital_status : "",
    },
  });
  // const joining_date = watch("joinedDate");
  const notes_details = watch("notes_details");
  const company_name = watch("company");
  const joining_date = watch("selectedJoiningDate");
  const profile_picture = watch("profile_picture");
  const document = watch("documents");
  const education = watch("education");
  // console.log("profile_picture", profile_picture);
  // console.log("documents", document);
  // console.log("education", education);

  // console.log("notes_details", notes_details)
  // console.log("joining_date", joining_date);
  // console.log("company_name", company_name);

  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const employees = ["Saravanan", "Ramesh", "Priya"];

  // Filter states - FIXED: Corrected variable names
  const [filterStartDate, setFilterStartDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [filterEndDate, setFilterEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [filterInterviewStatus, setFilterInterviewStatus] = useState("");
  const [filterCandidateStatus, setFilterCandidateStatus] = useState("");
  // console.log("filterCandidateStatus", filterCandidateStatus)
  const [selectedReference, setSelectedReference] = useState("");
  const [selectedReferenceForm, setSelectedReferenceForm] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");
  // console.log("selectedEducation.......:....",selectedEducation)
  const [educationOptions, setEducationOptions] = useState([]);
  const [filterEducation, setFilterEducation] = useState("");
  const [selectedCompanyfilter, setSelectedCompanyfilter] = useState("");
  const [page, setPage] = useState(1);
  const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);
  };

  const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };

  // Table states
  // const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  // const [totalRecords, setTotalRecords] = useState(0);

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

  const interviewStatus = watch("interviewStatus");
  const candidateStatus = watch("candidateStatus");
  const reference = watch("reference");

  useEffect(() => {
    if (interviewStatus) {
      setValue("notes_details.note_status", interviewStatus);
    }
  }, [interviewStatus, setValue]);

  useEffect(() => {
    if (interviewStatus !== "Rejected") {
      setValue("rejectReason", "");
    }

    if (interviewStatus !== "Waiting") {
      setValue("waitingReason", "");
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

  useEffect(() => {
    if (candidateStatus !== "joined") {
      setJoinedType(0); // Reset to 0 when not joined
    }
  }, [candidateStatus]);
  const [ModalOpen, setIsModalOpen] = useState(false);

  const handleApplyFilter = () => {
    //  filter logic here
    console.log({
      filterStartDate,
      filterEndDate,
      selectedReference,
      selectedEducation,
      filterInterviewStatus,
      filterCandidateStatus,
    });
    //  applyFilters()
  };

  // Reset filters
  // Reset filters
  const handleResetFilter = () => {
    const today = new Date().toISOString().split("T")[0];

    setFilterStartDate(today);
    setFilterEndDate(today);
    // setFilterStartDate(null);
    //   setFilterEndDate(null);
    setSelectedReference("");
    setFilterEducation("");
    setFilterInterviewStatus("");
    setFilterCandidateStatus("");
    setSelectedCompanyfilter("");

    //rest use for both navigation and auto fetch on filter change from dashboard
    fetchContractCandidates({
      companyId: "",
      startDate: today,
      endDate: today,
    });
  };

  const fetchId = async (payload) => {
    // console.log("payload", payload);
    try {
      const response = await axiosInstance.post(
        `api/contract-emp/move-candidate-emp`,
        payload,
      );

      // console.log("Success:", response);
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
  const [companyOptions, setCompanyOptions] = useState([]);

  const fileInputRef = useRef(null);
  const fileInputRefEdit = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Open and close modals
  const openAddModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setSelectedReferenceForm(null);
    setValue("reference", "");
    setValue("otherReference", "");
    const mappedData = {
      id: "",
      name: "",
      phone: "",
      aadhar: "",
      pan_number: "",
      // company: null,
      company: "",
      gender: "",
      marital: "",
      education: "",
      interviewDate: "",
      interviewStatus: "",
      candidateStatus: "",
      joinedDate: "",
      reference: "",
      otherReference: "",
      notJoinedReason: "",
      importFileName: "",
      importFileUrl: "",
      profile_picture: "",
      documents: [],
    };
    setSelectedCompany(null);
    setSelectedEducation(null);
    setSelectedReference(null);
    setPhoto(null);
    setDocuments([]);
    setEditData(null);
    setJoinedType(0);
    reset(mappedData);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsAnimating(false);
      setBackendValidationError(null);
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
  const [existingCandidate, setExistingCandidate] = useState(null);
  console.log("existingCandidate", existingCandidate);
  const [viewExistingCandidate, setViewExistingCandidate] = useState(null);
  const [
    isExistingCandidateViewModalOpen,
    setIsExistingCandidateViewModalOpen,
  ] = useState(false);
  const handleViewExisting = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/contract-emp/edit/${id}`);

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

    reset();

    setIsExistingCandidateViewModalOpen(false);
    setViewExistingCandidate(null);
  };

  const handleView = async (row) => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}api/contract-emp/edit/${row.id}`,
      );

      // console.log("view res....:....", res);
      // console.log("view res....:....", res.data);

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

  // useEffect(() => {
  //   if (ModalOpen) {
  //     fetchCompanyList();
  //   }
  // }, [ModalOpen]);

  // const fetchCompanyList = async () => {
  //   try {
  //     const response = await axiosInstance.get("/api/company");
  //     console.log("response check", response);

  //     if (response.data.success) {
  //       const companies = response.data.data.map((company) => ({
  //         label: company.company_name,
  //         value: company.id,
  //       }));
  //       // console.log("companies",companies)

  //       setCompanyOptions(companies);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching companies:", error);
  //   }
  // };

  //image and document state and handling
  const [photo, setPhoto] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    register("profile_picture", { required: !editData });
  }, [register, editData]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(file);
      setValue("profile_picture", file);
    }
  };

  // const handleCameraCapture = (file) => {
  //   setPhoto(file);
  //   setValue("profile_picture", file);
  // };

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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // console.log(key, value);
      }

      const response = await axiosInstance.post(
        `${API_URL}api/contract-emp/import`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          // Add timeout for debugging
        },
      );

      console.log("response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message || "Excel imported successfully!");

        if (response.data.total !== undefined) {
          toast.success(`Imported: ${response.data.total} records`);
        }
      }

      // Reset fields
      handleDeleteFile();
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setSelectedCompany(null);

      const skipped = response.data?.skipped_details || [];

      setImportskip(skipped);

      //  only if skipped data exists
      if (skipped.length > 0) {
        setShowSkipModal(true);
      }

      closeImportAddModal();
      resetImportForm();
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
  const [editLoading, setEditLoading] = useState(false);

  const normalizeEditData = (row) => {
    console.log("row", row);
    return {
      id: row.id || null,
      name: row.name || "",
      // address: row.address || "",
      gender: row.gender || "",
      marital: row.marital_status || "",
      // fatherName: row.father_name || "",
      // dob: row.date_of_birth || "",
      phone: row.phone_number || "",
      aadhar: row.aadhar_number || "",
      pan_number: row.pan_number || "",

      // education: row.education || "",
      education: row.education_id ? Number(row.education_id) : null,
      company: String(row.company_id),
      interviewDate: row.interview_date || "",
      interviewStatus: row.interview_status
        ? row.interview_status.toLowerCase()
        : "",
      candidateStatus:
        row.joining_status === "joined"
          ? "joined"
          : row.joining_status === "not_joined"
            ? "not_joined"
            : "",
      selectedJoiningDate: row.joining_date || "",
      joinedDate: row.joined_date || "",
      reference: row.reference || "",
      otherReference: row.other_reference || "",
      rejectReason:
        row.notes?.find((n) => n.note_status === "reject")?.notes || "",
      holdReason: row.notes?.find((n) => n.note_status === "hold")?.notes || "",
      waitReason:
        row.notes?.find((n) => n.note_status === "waiting")?.notes || "",
      notJoinedReason:
        row.notes?.find((n) => n.note_status === "not_joined")?.notes || "",
      profile_picture: row.profile_picture || "",
      documents: row.documents || [],
    };
  };

  const openEditModal = async (row) => {
    console.log("rowopen", row);
    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);

    setEditLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/contract-emp/edit/${row.id}`,
      );
      // console.log("openeditmodal:", response.data);

      if (response.data.success) {
        const rowData = response.data.data; // Get fresh data from API
        const normalizedData = normalizeEditData(rowData);

        setEditData(normalizedData);
        // setSelectedEducation(normalizedData.education || null);

        if (normalizedData.profile_picture) {
          // If it's already a full URL, use it; otherwise, append base URL
          const imageUrl = normalizedData.profile_picture.startsWith("http")
            ? normalizedData.profile_picture
            : `${API_URL}/${normalizedData.profile_picture}`;
          setPhoto(imageUrl);
          setValue("profile_picture", normalizedData.profile_picture);
        } else {
          setPhoto(null);
        }

        let normalizedDocs = [];
        if (rowData.document_groups) {
          normalizedDocs = rowData.document_groups.flatMap((group) =>
            group.documents.map((doc) => ({
              ...doc,
              id: doc.id,
              title: group.title,
              existing: true, // marker for your UI
            })),
          );
        } else if (rowData.documents) {
          normalizedDocs = rowData.documents.map((doc) => ({
            ...doc,
            existing: true,
          }));
        }

        setDocuments(normalizedDocs); // Update local state for the file list UI

        setSelectedCompany(normalizedData.company);
        const educationValue = normalizedData.education
          ? String(normalizedData.education)
          : null;

        setSelectedEducation(educationValue);
        // setValue("education", normalizedData.education);
        // setValue("company", normalizedData.company);
        setSelectedEducation(normalizedData.education);
        setSelectedReferenceForm(normalizedData.reference || "");

        reset({
          ...normalizedData,
          company: String(normalizedData.company),
          education: normalizedData.education,
          reference: normalizedData.reference || "",
          otherReference: normalizedData.otherReference || "",
          candidateStatus: normalizedData.candidateStatus || "",
        });

        // reset({
        //   ...normalizedData,
        //   company: String(normalizedData.company),
        //   education: String(normalizedData.education),
        // });
      }
    } catch (err) {
      console.log("Edit API Error:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const fetchContractCandidates = async (params = {}) => {
    const finalCompanyId = params.companyId ?? selectedCompanyfilter ?? "";

    const finalStartDate = params.startDate ?? filterStartDate;

    const finalEndDate = params.endDate ?? filterEndDate;

    const finalJoiningStatus =
      params.joiningStatus ?? filterCandidateStatus ?? "";

    console.log("FINAL FETCH:", {
      finalCompanyId,
      finalStartDate,
      finalEndDate,
      finalJoiningStatus,
    });
    setLoading(true);
    try {
      const payload = {
        from_date: finalStartDate,
        to_date: finalEndDate,
        reference: selectedReference,
        education: filterEducation,
        interview_status: filterInterviewStatus,
        joining_status: finalJoiningStatus || "",
        company_id: finalCompanyId,
      };

      // REMOVE undefined keys
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key],
      );

      const queryParams = new URLSearchParams(payload).toString();

      const response = await axiosInstance.get(
        `api/contract-emp?${queryParams}`,
      );
      console.log("contract candidates response .... : ....", response);
      const employees = response?.data?.data?.employees || [];

      if (response?.data?.success) {
        const data = response?.data?.data;

        setColumnData(data?.employees || []);
        setEmployeesList(data?.pssemployees || []);

        if (data.companies) {
          const companies = data.companies.map((c) => ({
            label: c.company_name,
            value: String(c.id),
          }));
          setCompanyOptions(companies);
          console.log("Companies...:", companies);
        }

        if (data.educations) {
          const educations = data.educations.map((edu) => ({
            label: edu.eduction_name,
            value: edu.id,
            // value: String(edu.id)
          }));
          setEducationOptions(educations);
          console.log("Educations...:", educations);
        }
      }
    } catch (error) {
      console.error("Error fetching contract candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchContractCandidates();
  //   // fetchCompanyList();
  // }, []);

  //   const companyDropdown = companyOptions;
  // const educationDropdown = educationOptions;

  // delete
  const handleDelete = async (id) => {
    // console.log("Deleting Contract Candidates ID:", id);
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
      await axiosInstance.delete(`${API_URL}api/contract-emp/delete/${id}`);
      setTimeout(() => {
        toast.success("Contract Candidates deleted successfully");
      }, 500);
      fetchContractCandidates();
    } catch (error) {
      toast.error("Failed to delete Contract Candidates");
    }
  };

  const handlCsvDownload = () => {
    const link = window.document.createElement("a");
    link.href = "/assets/csv/contarctformat.csv";
    link.download = "contractformat.csv";

    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const getCompanyName = (companyId) => {
    const company = companyOptions.find(
      (com) => com.value === String(companyId),
    );
    return company ? company.label : "-";
  };

  const getEducationName = (educationId) => {
    const edu = educationOptions.find((e) => e.value === educationId);
    return edu ? edu.label : "-";
  };

  // export csvv

  const exportTableCSV = () => {
    if (typeof window === "undefined") return;

    if (!columnData || columnData.length === 0) {
      alert("No data to export");
      return;
    }

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const exportData = columnData.map((row, index) => ({
      "S.No": index + 1,
      Name: Capitalise(row?.name) || row?.name || "-",
      Phone: row?.phone_number || "-",
      Education: getEducationName(row?.education_id) || "-",
      Company: getCompanyName(row?.company_id) || "-",
      "Interview Status": row?.interview_status || "-",
      "Candidate Status": row?.joining_status
        ? String(row.joining_status).replaceAll("_", " ")
        : "-",
      Reference:
        String(row?.reference || "-").toLowerCase() === "other"
          ? `Other - ${
              row?.other_reference ? Capitalise(row.other_reference) : "-"
            }`
          : Capitalise(row?.reference || "-") || row?.reference || "-",
    }));

    const headers = Object.keys(exportData[0]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...exportData.map((row) =>
        headers.map((h) => escapeCSV(row[h])).join(","),
      ),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const today = new Date().toISOString().split("T")[0];
    const fileName = `candidate_list_${today}.csv`;

    const link = window.document.createElement("a");
    link.href = url;
    link.download = fileName;

    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
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
      body: (row) => Capitalise(row.name) || row.name || "-",
    },
    {
      header: "Phone",
      field: "phone_number",
      body: (row) => row.phone_number || "-",
    },
    // {
    //   header: "Education",
    //   field: "education",
    //   body: (row) => Capitalise(row.education) || row.education || "-"
    // },
    {
      header: "Education",
      body: (row) => getEducationName(row.education_id),
    },

    {
      header: "Company",
      body: (row) => getCompanyName(row.company_id),
    },

    // {
    //   header: "Interview Status",
    //   field: "interview_Status",
    //   body: (row) => {
    //     const data = row.interview_status;

    //     console.log("row.interview_status", data);

    //     let color =
    //       data === "Selected"
    //         ? "text-[#16A34A]  bg-green-100"
    //         : data === "Rejected"
    //           ? "text-[#DC2626] bg-[#FFF0F0]"
    //           : data === "Hold"
    //             ? "text-[#FD8700] bg-[#FFCB90]"
    //             : "text-blue-600 bg-blue-100";

    //     return (
    //       <div
    //         className={`border rounded-[50px] ${color}`}
    //         style={{
    //           display: "inline-block",
    //           width: "100px",
    //           textAlign: "center",
    //           fontSize: "12px",
    //           fontWeight: 400,

    //           alignItems: "center",
    //           justifyContent: "center",
    //         }}
    //       >
    //         {data || "-"}
    //       </div>
    //     );
    //   },
    //   style: { textAlign: "center" },
    // },
    {
      header: "Interview Status",
      field: "interview_Status",
      body: (row) => {
        const data = row.interview_status;

        if (!data) {
          return <span>-</span>;
        }

        let color =
          data === "Selected"
            ? "text-[#16A34A] bg-green-100"
            : data === "Rejected"
              ? "text-[#DC2626] bg-[#FFF0F0]"
              : data === "Hold"
                ? "text-[#FD8700] bg-[#FFCB90]"
                : "text-blue-600 bg-blue-100";

        return (
          <div
            className={`border rounded-[50px] px-2 py-1 ${color}`}
            style={{
              display: "inline-block",
              width: "100px",
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
      header: "Candidate Status",
      field: "joining_status",
      style: { textAlign: "center" },
      body: (row) => {
        const rawStatus = row.joining_status;

        if (!rawStatus) return "-";

        // normalize backend value
        const status = rawStatus.toLowerCase();

        const isJoined = status === "joined";

        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium
          ${
            isJoined ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }
        `}
            style={{ minWidth: "100px", textAlign: "center" }}
          >
            {rawStatus.replace("_", " ")}
          </span>
        );
      },
    },

    // {
    //   header: "Reference",
    //   field: "reference",
    //   body: (row) => Capitalise(row.reference) || row.reference || "-",
    // },
    {
      header: "Reference",
      body: (row) => {
        const ref = row.reference || "-";

        if (ref.toLowerCase() === "other") {
          return (
            <div className="leading-tight">
              <div className="font-medium">Other</div>
              <div className="text-xs text-gray-500">
                {row.other_reference ? Capitalise(row.other_reference) : "-"}
              </div>
            </div>
          );
        }

        return <span>{Capitalise(ref)}</span>;
      },
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

  // create
  //   const onSubmit = async (data) => {
  //     try {
  //     //   console.log('Form data before submit:', {
  //     //   profile_picture: data.profile_picture,
  //     //   profile_picture_type: typeof data.profile_picture,
  //     //   isFile: data.profile_picture instanceof File,
  //     //   documents: data.documents,
  //     //   documents_length: data.documents?.length
  //     // });
  //       const createCandidate = {
  //         name: data.name,
  //         address: data.address || "test",

  //         // date_of_birth: formatDateToYMD(data.dob),
  //         // father_name: data.fatherName,
  //         gender: data.gender,
  //         phone_number: data.phone,
  //         aadhar_number: data.aadhar,
  //         pan_number: data.pan_number,
  //         company_id: Number(data.company),
  //      education: data.education,

  //         interview_date: formatDateToYMD(data.interviewDate),
  //         interview_status: data.interviewStatus,
  //         reference: data.reference,
  //         joining_status: data.candidateStatus,
  //         joined_date:
  //           data.candidateStatus === "joined"
  //             ? formatDateToYMD(data.joinedDate)
  //             : null,
  //         joining_date:
  //           data.interviewStatus === "selected"
  //             ? formatDateToYMD(data.selectedJoiningDate)
  //             : null,
  //         other_reference:
  //           data.reference === "other" ? data.otherReference : null,
  //         notes_details: (() => {
  //           const notes = [];

  //           if (data.candidateStatus === "not_joined") {
  //             notes.push({
  //               notes: data.notJoinedReason,
  //               note_status: "not_joined",
  //             });
  //           }

  //           switch (data.interviewStatus) {
  //             case "waiting":
  //               notes.push({
  //                 notes: data.waitReason || "-",
  //                 note_status: "wait",
  //               });
  //               break;
  //             case "hold":
  //               notes.push({
  //                 notes: data.holdReason,
  //                 note_status: "hold",
  //               });
  //               break;
  //             case "rejected":
  //               notes.push({
  //                 notes: data.rejectReason,
  //                 note_status: "reject",
  //               });
  //               break;
  //             default:
  //               break;
  //           }

  //           return notes;
  //         })(),
  //         status: 1,
  //         created_by: userId,
  //         role_id: userRole,
  //       };

  //       const formData = new FormData();

  // Object.entries(createCandidate).forEach(([key, value]) => {
  //       if (value !== null && value !== undefined) {
  //         formData.append(
  //           key,
  //           typeof value === "object" ? JSON.stringify(value) : value
  //         );
  //       }
  //     });

  //  //  Profile image
  //     if (data.profile_picture instanceof File) {
  //       formData.append("profile_picture", data.profile_picture);
  //     }else if (typeof data.profile_picture === "string") {

  //       formData.append("existing_profile_picture", data.profile_picture);
  //     }

  //     //  Documents

  // //  if (documents && documents.length > 0) {
  // //       documents.forEach((doc, index) => {
  // //         // a new file upload
  // //         if (doc instanceof File) {
  // //           // formData.append(`documents[${index}][title]`, doc.name.split('.')[0]); // Use filename as title
  // //           formData.append(`documents[${index}][file]`, doc);
  // //           // formData.append(`documents[${index}][files][0]`, doc);
  // //         } else {
  // //           // existing document
  // //           formData.append(`documents[${index}][id]`, doc.id);
  // //           // formData.append(`documents[${index}][existing_path]`, doc.file_path);
  // //         }

  // //       });
  // //     }

  //  // Documents (NEW FILES ONLY)
  //  console.log("on submit doc",documents);

  //       if (documents && documents.length > 0) {
  //         documents.forEach((doc,index) => {
  //           if (doc instanceof File) {
  //             formData.append("documents[]", doc);
  //           }else if (doc.id) {

  //       // formData.append(`existing_document_ids[${index}]`, doc.id);
  //       formData.append("documents[]", doc.id);
  //     }
  //         });
  //       }

  //       console.log("Create candidate ,.... : .....",createCandidate)
  //       setLoading(true);

  //        const url = editData
  //       ? `/api/contract-emp/update/${editData.id}`
  //       : `/api/contract-emp/create`;

  //     await axiosInstance.post(url, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //      toast.success(editData ? "Updated Successfully" : "Created Successfully");
  //     closeAddModal();
  //     fetchContractCandidates();

  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // //       if (editData) {
  // //         const response = await axiosInstance.post(
  // //           `/api/contract-emp/update/${editData.id}`,
  // //           createCandidate
  // //         );

  // //         console.log("interview CAndidate response:",response)
  // //         closeAddModal();
  // // fetchContractCandidates();
  // //          toast.success("Candidate Updated successfully");
  // //         // , {
  // //         //   onClose: () => {
  // //         //     fetchContractCandidates();
  // //         //   },
  // //         // });

  // //       } else {
  // //         const response = await axiosInstance.post(
  // //           "/api/contract-emp/create",
  // //           createCandidate,

  // //   {
  // //     headers: {
  // //       "Content-Type": "multipart/form-data",
  // //     },
  // //   }
  // //         );
  // // console.log("interview CAndidate response:",response)

  // //         closeAddModal();
  // //         fetchContractCandidates();
  // //         toast.success("Candidate added successfully")
  // //         // toast.success("Candidate added successfully",
  // //         //   {
  // //         //   onClose: () => {
  // //         //     fetchContractCandidates();
  // //         //   },
  // //         // });

  // //       }
  // //     } catch (error) {
  // //       if (error.response) {
  // //         console.log("Backend error:", error.response.data);
  // //         setBackendValidationError(error.response.data.message);
  // //       } else if (error.request) {
  // //         console.log("No response received:", error.request);
  // //       } else {
  // //         console.log("Axios config error:", error.message);
  // //       }
  // //     } finally {
  // //       setLoading(false);
  // //     }
  //   };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      /* ---------------- NOTES ARRAY ---------------- */
      const notesArray = [];

      if (data.candidateStatus === "not_joined" && data.notJoinedReason) {
        notesArray.push({
          notes: data.notJoinedReason,
          note_status: "not_joined",
        });
      }

      if (["rejected", "hold", "waiting"].includes(data.interviewStatus)) {
        const note =
          data.interviewStatus === "rejected"
            ? data.rejectReason
            : data.interviewStatus === "hold"
              ? data.holdReason
              : data.waitReason;

        notesArray.push({
          notes: note || data.notes_details.notes || "-",
          note_status: data.interviewStatus,
        });
      }

      /* ---------------- PAYLOAD ---------------- */
      const createCandidate = {
        name: data.name,
        phone_number: data.phone,
        aadhar_number: data.aadhar,
        pan_number: data.pan_number,
        address: data.address || "test",
        gender: data.gender,
        marital_status: data.marital,
        company_id: Number(data.company),
        education_id: data.education,
        interview_date: formatDateToYMD(data.interviewDate),
        interview_status: data.interviewStatus,
        notes_details: notesArray,
        reference: data.reference,
        joining_status: data.candidateStatus,
        joined_date:
          data.candidateStatus === "joined"
            ? formatDateToYMD(data.joinedDate)
            : null,

        joined_type: data.candidateStatus === "joined" ? joinedType : 0,

        joining_date:
          data.interviewStatus === "selected"
            ? formatDateToYMD(data.selectedJoiningDate)
            : null,
        other_reference:
          data.reference === "other" ? data.otherReference : null,
        status: 1,
        created_by: userId,
        role_id: userRole,
      };

      const formData = new FormData();
      Object.entries(createCandidate).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value,
          );
        }
      });

      /* ---------------- PROFILE PIC ---------------- */
      if (data.profile_picture instanceof File) {
        formData.append("profile_picture", data.profile_picture);
      } else if (typeof data.profile_picture === "string") {
        formData.append("existing_profile_picture", data.profile_picture);
      }

      /* ---------------- DOCUMENTS ---------------- */
      if (documents?.length) {
        documents.forEach((doc) => {
          if (doc instanceof File) {
            formData.append("documents[]", doc);
          } else if (doc.id) {
            formData.append("documents[]", doc.id);
          }
        });
      }

      console.log("createCandidate", createCandidate);

      /* ---------------- API CALL ---------------- */
      const url = editData
        ? `/api/contract-emp/update/${editData.id}`
        : `/api/contract-emp/create`;

      const response = await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      /*  handle backend errors (success:false) */
      //  if (response.data?.success === false) {
      //   Object.values(response.data.errors || {})
      //     .flat()
      //     .forEach((msg) => toast.error(msg));
      //   return;
      // }

      /*  SUCCESS */
      setTimeout(() => {
        toast.success(
          editData ? "Updated Successfully" : "Created Successfully",
        );
      }, 300);
      closeAddModal();
      fetchContractCandidates();
    } catch (error) {
      console.log("errors:", error);
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
      }
      setTimeout(
        () =>
          toast.error(
            error?.response.data.message || "Server Error. Please Try Again.",
          ),
        300,
      );
    } finally {
      setLoading(false);
    }
  };

  const companyDropdown = companyOptions.map((c) => ({
    label: c.label,
    value: String(c.value),
  }));

  // console.log("companyDropdown", companyDropdown)

  const educationDropdown = educationOptions.map((c) => ({
    label: c.label,
    value: String(c.value),
  }));

  // const educationOptions = [
  //   { label: "10th Standard/SSLC", value: "10th_standard/sslc" },
  //   { label: "12th (HSC)-Science", value: "12th(hsc_science)" },
  //   { label: "12th (HSC)-Arts/Commerce/Vocational", value: "12th(hsc_commerce_vocational)" },
  //   { label: "Diploma/Polytechnic/Vocational/ITI", value: "diploma/polytechnic/vocational/iti" },
  //   { label: "B.A.(Bachelor of Arts)", value: "bachelor_of_arts" },
  //   { label: "B.Sc.(Bachelor of Science)", value: "science" },
  //   { label: "B.Com.(Bachelor of Commerce)", value: "bachelor_of_commerce" },
  //   { label: "B.C.A.(Bachelor of Computer Application)", value: "bachelor_of_computer_application" },
  //   { label: "B.B.A.(Bachelor of Business Administration)", value: "bachelor_of_business_administration" },
  //   { label: "B.E.(Bachelor of Engineering)", value: "bachelor_of_engineering" },
  //   { label: "B.Tech(Bachelor of Technology)", value: "bachelor_of_technology" },
  //   { label: "B.Arch(Bachelor of Architecture)", value: "bachelor_of_architecture" },
  //   { label: "B.Pharm(Bachelor of Pharmacy)", value: "bachelor_of_pharmacy" },
  //   { label: "B.P.T(Bachelor of Physiotherapy)", value: "pysiotherapy" },
  //   { label: "B.N.Y.S / B.Nat (Naturopathy & Yogic Sciences)", value: "naturopathy" },
  //   { label: "B.A.M.S (Ayurvedic Medicine & Surgery)", value: "ayurveda" },
  //   { label: "B.H.M.S (Homeopathy Medicine)", value: "homeopathy" },
  //   { label: "M.B.B.S (Medicine & Surgery))", value: "mbbs" },
  //   { label: "B.D.S (Dental Surgery)", value: "bds" },
  //   { label: "B.V.Sc & A.H (Veterinary Science)", value: "veterinary" },
  //   { label: "B.S.W (Bachelor of Social Work)", value: "social_work" },
  //   { label: "B.P.Th. / BPT (Physiotherapy / Allied Health)", value: "physiotherapy" },
  //   { label: "B.O.T / B.O.Th / B.Opt (Occupational Therapy / Optometry)", value: "optometry" },
  //   { label: "B.Sc Nursing", value: "nursing" },
  //   { label: "B.H.M / B.H.M.C.T (Hotel Management / Hospitality)", value: "hospitality" },
  //   { label: "B.A + B.Ed (Integrated)", value: "integrated" },
  //   { label: "B.Sc + B.Ed (Integrated)", value: "integrated" },
  //   { label: "B.Com + B.Ed (Integrated)", value: "integrated" },
  //   { label: "B.A + LL.B (Integrated Law)", value: "integrated" },
  //   { label: "B.Com + LL.B (Integrated Law)", value: "integrated" },
  //   { label: "B.B.A + LL.B (Integrated Law / Business Law)", value: "integrated/business" },
  //   { label: "B.B.A + LL.B (Integrated Law / Business Law)", value: "integrated/business" },
  //   { label: "M.A. (Master of Arts)", value: "master_of_arts" },
  //   { label: "M.Sc. (Master of Science)", value: "master_of_science" },
  //   { label: "M.Com. (Master of Commerce)", value: "master_of_commerce" },
  //   { label: "M.C.A. (Master of Computer Applications)", value: "master_of_computer_application" },
  //   { label: "M.B.A. (Master of Business Administration)", value: "master_of_business_administration" },
  //   { label: "M.Ed. (Master of Education)", value: "master_of_education" },
  //   { label: "LL.M (Master of Laws)", value: "master_of_laws" },
  //   { label: "M.P.T (Master of Physiotherapy / Allied Health)", value: "master_of_physiotherapy" },
  //   { label: "M.Pharm (Master of Pharmacy)", value: "master_of_pharmacy" },
  //   { label: "M.D / M.S (Postgraduate Medical / Surgical)", value: "postgraduate" },
  //   { label: "M.Tech (Master of Technology)", value: "master_of_technology" },
  //   { label: "M.Arch (Master of Architecture)", value: "master_of_architecture" },
  //   { label: "M.S.W (Master of Social Work)", value: "master_of_social_work" },
  //   { label: "M.P.H (Master of Public Health)", value: "master_of_public_health" },
  //   { label: "M.Phil (Master of Philosophy)", value: "master_of_philosophy" },
  //   { label: "Ph.D (Doctor of Philosophy / Doctoral)", value: "doctor_of_philosophy" },
  //   { label: "Certificate Course", value: "certificate" },
  //   { label: "Postgraduate Diploma", value: "postgraduate_diploma" },
  //   { label: "Vocational / Skill Certificate / ITI / Trade", value: "vocational_certificate" }
  // ];

  const referenceOptions = [
    ...employeesList.map((emp) => ({
      label: emp.full_name,
      value: emp.full_name,
    })),
    { label: "Other", value: "other" },
  ];

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
              <p className="text-xs  md:text-sm  text-[#1ea600]">
                Contract Candidates
              </p>
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

                  {/* Reference */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Reference
                    </label>

                    <Dropdown
                      value={selectedReference}
                      onChange={(e) => setSelectedReference(e.value)}
                      className="w-full border border-gray-300 text-sm  text-[#7C7C7C] rounded-md"
                      options={referenceOptions}
                      placeholder="Select Reference"
                      filter
                    />
                  </div>

                  {/* Interview Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Interview Status
                    </label>
                    <Dropdown
                      value={filterInterviewStatus}
                      options={interviewStatusOptions}
                      onChange={(e) => setFilterInterviewStatus(e.value)}
                      placeholder="Select Status "
                      filter
                      className="w-full border border-gray-300 text-sm  text-[#7C7C7C] rounded-md"
                    />
                  </div>

                  {/* Candidate Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Candidate Status
                    </label>
                    <Dropdown
                      value={filterCandidateStatus}
                      options={candidateStatusOptions}
                      filter
                      onChange={(e) => setFilterCandidateStatus(e.value)}
                      placeholder="Select Status "
                      className="w-full border border-gray-300 text-sm text-[#7C7C7C] rounded-md placeholder:text-gray-400"
                    />
                  </div>

                  {/* education */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Education
                    </label>
                    <Dropdown
                      value={filterEducation}
                      options={educationOptions}
                      onChange={(e) => setFilterEducation(e.value)}
                      placeholder="Select Education"
                      filter
                      className="w-full border border-gray-300 text-sm text-[#7C7C7C] rounded-md"
                    />
                  </div>

                  {/* company */}

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
            <div className="flex flex-col  w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
              <div className="datatable-container  mt-4">
                <div className="flex flex-wrap md:flex-row md:items-center md:justify-between gap-3 mb-4">
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

                  <div className="flex flex-wrap items-center gap-11">
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
                        className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium w-20 rounded-lg"
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
      transition-all duration-200
                        "
                      >
                        <FiDownload className="text-lg" /> Demo CSV
                      </button>
                    </div>
                    <button
                      onClick={exportTableCSV}
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      Export
                    </button>
                    <button
                      onClick={openAddModal}
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      + Add Candidate
                    </button>
                  </div>
                </div>

                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    className="mt-8"
                    value={columnData}
                    paginator
                    rows={10}
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
                      Contract Candidates
                    </p>
                    {/* Date */}
                    {/* <div className="mt-3 flex justify-between items-center">
                      <label className="block text-md font-medium">
                        Date<span className="text-red-500">*</span>
                      </label>

                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            handleImportChange(index, "date", e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                      </div>
                    </div> */}

                    {/* company */}
                    <div className="mt-3 flex justify-between items-center">
                      <label className="block text-md font-medium">
                        Company<span className="text-red-500">*</span>
                      </label>

                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={selectedCompany}
                          onChange={(e) => setSelectedCompany(e.value)}
                          options={companyOptions}
                          optionLabel="label"
                          placeholder="Select Company"
                          filter
                          className="w-full border border-gray-300 rounded-lg"
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
                 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      {/* <button
                        className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                        onClick={handleFileSubmit}
                      >
                        Submit
                      </button> */}
                      <button
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

                  {editLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="p-2 md:p-5">
                      <p className="text-xl md:text-2xl font-medium">
                        {" "}
                        {!editData ? "ADD" : "Edit"} Candidates
                      </p>
                      {backendValidationError && (
                        <span className=" text-red-600 text-sm">
                          {backendValidationError}
                        </span>
                      )}

                      {/* Upload Photo */}
                      <div className="flex justify-end">
                        <div className="flex flex-col items-center gap-2">
                          <p className="font-medium">
                            {photo ? "Change Photo" : "Upload Photo"}{" "}
                            <span className="text-red-500">*</span>
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
                            onChange={(e) => {
                              setSelectedCompany(e.value);
                              setValue("company", String(e.value), {
                                shouldValidate: true,
                              });
                            }}
                            placeholder="Select Company"
                            filter
                            className="w-full border border-gray-300 rounded-lg"
                          />
                          {errors.company && (
                            <p className="text-red-500 text-sm">
                              {errors.company.message}
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

                      {/* dob
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        DOB <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <input
                          type="date"
                          name="dob"
                          {...register("dob")}
                          inputMode="numeric"
                          maxLength={10}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          }}
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                        />
                        <span className="text-red-500 text-sm">
                          {errors.dob?.message}
                        </span>
                      </div>
                    </div>

                    {/* fathername */}

                      {/* <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Father Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <input
                          type="text"
                          name="fatherName"
                          {...register("fatherName")}
                          inputMode="numeric"
                          maxLength={10}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          }}
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          placeholder="Enter the Father Name"
                        />
                        <span className="text-red-500 text-sm">
                          {errors.fatherName?.message}
                        </span>
                      </div>
                    </div> */}

                      {/* address */}
                      {/* <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <textarea
                          type="text"
                          name="address"
                          {...register("address")}
                          inputMode="numeric"
                          maxLength={10}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          }}
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          placeholder="Enter the Address"
                        />
                        <span className="text-red-500 text-sm">
                          {errors.address?.message}
                        </span>
                      </div>
                    </div> */}

                      {/* gender */}

                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Gender
                          {/* <span className="text-red-500">*</span> */}
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

                          {/* <span className="text-red-500 text-sm">
                          {errors.gender?.message}
                        </span> */}
                        </div>
                      </div>

                      {/* marital */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Marital Status
                          {/* <span className="text-red-500">*</span> */}
                        </label>

                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="Married"
                                {...register("marital", {
                                  required: "Marital Status is required",
                                })}
                                className="accent-[#1ea600]"
                              />
                              Married
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="Unmarried"
                                {...register("marital", {
                                  required: "Marital Status is required",
                                })}
                                className="accent-[#1ea600]"
                              />
                              Unmarried
                            </label>
                          </div>

                          {/* <span className="text-red-500 text-sm">
                          {errors.marital?.message}
                        </span> */}
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
                            type="text"
                            inputMode="numeric"
                            name="aadhar"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("aadhar")}
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
                            Learn more
                          </span>
                        </p>
                      )}

                      {/* pan no */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Pan Number
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            name="pan"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("pan_number")}
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

                      {/* Education */}
                      {/* <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Education <span className="text-red-600">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <input
                          type="text"
                          name="education"
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          placeholder="Enter Education"
                          {...register("education")}
                        />
                        <span className="text-red-500 text-sm">
                          {errors.education?.message}
                        </span>
                      </div>
                    </div> */}

                      {/* Education */}
                      <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                        <label className="block text-md font-medium">
                          Education <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full md:w-[60%]">
                          <Dropdown
                            value={selectedEducation}
                            // value={watch("education")}
                            onChange={(e) => {
                              setSelectedEducation(e.value);
                              setValue("education", e.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            options={educationOptions}
                            optionLabel="label"
                            optionValue="value"
                            filter
                            placeholder="Select Education"
                            className={`uniform-field w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1ea600] border ${errors.education ? "border-red-500" : "border-gray-300"}`}
                          />
                          {errors.education && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.education.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* interview date */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Interview Date <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="date"
                            name="interviewDate"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            {...register("interviewDate")}
                            placeholder="Enter interview Date"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.interviewDate?.message}
                          </span>
                          {/* {errors?.interviewDate && <p className="text-red-500 text-sm mt-1">{errors?.interviewDate}</p>} */}
                        </div>
                      </div>

                      {/* Interview Status */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Interview Status{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <select
                            {...register("interviewStatus")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            name="interviewStatus"
                          >
                            <option value="">Select Status</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                            <option value="hold">Hold</option>
                            <option value="waiting">Waiting</option>
                          </select>
                          <span className="text-red-500 text-sm">
                            {errors.interviewStatus?.message}
                          </span>
                          {/* {errors.interviewStatus && <p className="text-red-500 text-sm mt-1">{errors.interviewStatus}</p>} */}
                        </div>
                      </div>

                      {/* Conditional fields */}

                      {["rejected", "hold", "waiting"].includes(
                        interviewStatus,
                      ) && (
                        <div className="mt-5 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            Reason{" "}
                            {interviewStatus === "rejected"
                              ? "for Rejection"
                              : interviewStatus === "hold"
                                ? "for Hold"
                                : "for Waiting"}
                            <span className="text-red-500">*</span>
                          </label>

                          <div className="w-[50%] md:w-[60%] rounded-lg">
                            <textarea
                              {...register("notes_details.notes")}
                              className="w-full px-2 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                              placeholder="Enter Reason"
                            />

                            <span className="text-red-500 text-sm">
                              {errors.notes_details?.notes?.message}
                            </span>
                          </div>
                        </div>
                      )}

                      {interviewStatus === "selected" && (
                        <div className="mt-5 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            Joining Date
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[50%] md:w-[60%] rounded-lg">
                            <input
                              type="date"
                              {...register("selectedJoiningDate")}
                              className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            />
                            <span className="text-red-500 text-sm">
                              {errors.selectedJoiningDate?.message}
                            </span>
                            {/* {errors.selectedJoiningDate && <p className="text-red-500 text-sm mt-1">{errors.selectedJoiningDate}</p>} */}
                          </div>
                        </div>
                      )}

                      {/* candidate Status */}
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Candidate Status
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <select
                            {...register("candidateStatus")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          >
                            <option value="">Select Status</option>
                            <option value="joined">Joined</option>
                            <option value="not_joined">Not Joined</option>
                          </select>

                          {errors.candidateStatus && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.candidateStatus.message}
                            </p>
                          )}

                          {/* {errors.candidateStatus && <p className="text-red-500 text-sm mt-1">{errors.candidateStatus}</p>} */}
                        </div>
                      </div>

                      {/* Conditional fields based on Candidate Status */}
                      {candidateStatus === "joined" && (
                        <div className="mt-5 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2 mt-3">
                            Joined Date
                          </label>
                          <div className="w-[50%] md:w-[60%] rounded-lg">
                            {/* <input type="date"
                                  name="joinedDate"
                                  className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
          
                                /> */}
                            <input
                              type="date"
                              {...register("joinedDate", {
                                onChange: (e) => {
                                  setValue("joinedDate", e.target.value, {
                                    shouldDirty: true,
                                  });
                                  // Check if joined date is being set (not null/empty)
                                  if (e.target.value) {
                                    setJoinedType(1); // Set to 1 when date is selected
                                  } else {
                                    setJoinedType(0); // Set to 0 when date is cleared
                                  }
                                },
                              })}
                              name="joinedDate"
                              className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            />
                            <span className="text-red-500 text-sm">
                              {errors.joinedDate?.message}
                            </span>
                            {/* {errors.joinedDate && <p className="text-red-500 text-sm mt-1">{errors.joinedDate}</p>} */}
                          </div>
                        </div>
                      )}

                      {candidateStatus === "not_joined" && (
                        <div className="mt-5 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2 mt-3">
                            Reason for Not Joining
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[50%] md:w-[60%] rounded-lg">
                            {/* <textarea
          
                                  className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
          
                                  name="notJoinedReason"
                                ></textarea> */}
                            <textarea
                              {...register("notJoinedReason")}
                              className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            />
                            <span className="text-red-500 text-sm">
                              {errors.notJoinedReason?.message}
                            </span>
                            {/* {errors.notJoinedReason && <p className="text-red-500 text-sm mt-1">{errors.notJoinedReason}</p>} */}
                          </div>
                        </div>
                      )}

                      {/* Reference */}
                      {/* <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Reference 
                       
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <select
                          {...register("reference")}
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        >
                          <option value="">Select Reference</option>
                          {employeesList.map((emp) => (
                            <option key={emp.id} value={emp.full_name}>
                              {emp.full_name}
                            </option>
                          ))}
                          <option value="other">Other</option>
                        </select>
                        <span className="text-red-500 text-sm">
                          {errors.reference?.message}
                        </span>
                       
                      </div>
                    </div>

                    {reference === "other" && (
                      <div className="mt-5 flex justify-end items-center">
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            {...register("otherReference")}
                            placeholder="Specify reference"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.otherReference && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.otherReference.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )} */}

                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Reference
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <Dropdown
                            value={selectedReferenceForm}
                            onChange={(e) => {
                              setSelectedReferenceForm(e.value);
                              setValue("reference", e.value, {
                                shouldValidate: true,
                              });
                            }}
                            className="uniform-field w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            options={referenceOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Reference"
                            filter
                          />

                          <span className="text-red-500 text-sm">
                            {errors.reference?.message}
                          </span>
                        </div>
                      </div>

                      {selectedReferenceForm === "other" && (
                        <div className="mt-5 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            Other Reference{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[50%] md:w-[60%] rounded-lg">
                            <input
                              type="text"
                              {...register("otherReference")}
                              placeholder="Specify Reference"
                              className="w-full px-3 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            />
                            <span className="text-red-500 text-sm">
                              {errors.otherReference?.message}
                            </span>
                          </div>
                        </div>
                      )}

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
                          type="button"
                          className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                          onClick={handleSubmit(onSubmit, (errors) =>
                            console.log(errors),
                          )}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isViewModalOpen && viewRow && (
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
                      Interview Candidate Details
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <b>Company:</b>{" "}
                        {companyOptions.find(
                          (c) => c.value === String(viewRow.company_id),
                        )?.label || "-"}
                      </p>

                      <p>
                        <b>Name:</b> {viewRow.name}
                      </p>
                      <p>
                        <b>Phone:</b> {viewRow.phone_number}
                      </p>

                      <p>
                        <b>Aadhar Number:</b> {viewRow.aadhar_number}
                      </p>

                      <p>
                        <b>Pan Number:</b> {viewRow.pan_number || "-"}
                      </p>

                      <p>
                        <b>Gender:</b> {viewRow.gender || "-"}
                      </p>
                      <p>
                        <b>Marital Status:</b> {viewRow.marital_status || "-"}
                      </p>
                      {/* <p><b>Education:</b> {educationOptions.find(e => e.value === String(viewRow.education_id || viewRow.education))?.label || viewRow.education || "-"}</p> */}
                      <p>
                        <b>Education:</b>{" "}
                        {viewRow.education?.eduction_name || "-"}
                      </p>
                      <p>
                        <b>Interview Date:</b>{" "}
                        {formatToDDMMYYYY(viewRow.interview_date) || "-"}
                      </p>
                      <p>
                        <b>Interview Status:</b>{" "}
                        <span className="font-medium">
                          {viewRow.interview_status || "-"}
                        </span>
                      </p>

                      <p>
                        <b>Candidate Status:</b> {viewRow.joining_status || "-"}
                      </p>
                      <p>
                        <b>Joining Date:</b>{" "}
                        {formatToDDMMYYYY(viewRow.joining_date) || "-"}
                      </p>
                      <p>
                        <b>Joined Date:</b>{" "}
                        {viewRow.joined_date
                          ? formatToDDMMYYYY(viewRow.joined_date)
                          : "-"}
                      </p>
                      <p>
                        <b>Reference:</b> {viewRow.reference || "-"}
                      </p>
                      {viewRow?.other_reference !== null && (
                        <p>
                          <b>Other Reference:</b>{" "}
                          {viewRow.other_reference || "-"}
                        </p>
                      )}

                      <p className="col-span-2">
                        <b>Reason For Notes:</b>{" "}
                        {viewRow.notes_details?.[0]?.notes ||
                          "No notes available"}
                      </p>

                      <p className="col-span-2">
                        <b>Reason For Notes:</b>{" "}
                        {viewRow.notes && viewRow.notes.length > 0 ? (
                          <ul className="list-disc pl-4 mt-1">
                            {viewRow.notes.map((note, index) => (
                              <li key={index}>
                                <span className="font-medium capitalize">
                                  {note.note_status}:
                                </span>{" "}
                                {note.notes}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "No notes available"
                        )}
                      </p>
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
                      View Existing Candidate Details
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
                          {importskip.map((item, index) => (
                            <tr
                              key={index}
                              className="border-t hover:bg-green-50/40 transition"
                            >
                              <td className="px-4 py-3 font-bold">
                                {index + 1}
                              </td>

                              <td className="px-4 py-3 font-semibold uppercase text-gray-800">
                                {item?.employee_name || "-"}
                              </td>

                              <td className="px-4 py-3 font-semibold text-green-700">
                                {item?.aadhar_number || "-"}
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

export default ContractCandidates_Mainbar;
