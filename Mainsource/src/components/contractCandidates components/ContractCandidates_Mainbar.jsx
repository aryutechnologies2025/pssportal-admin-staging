import { useState, useEffect, useRef } from "react";
import { TfiPencilAlt } from "react-icons/tfi";
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
import { set, z } from "zod";
import { useForm } from "react-hook-form";
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
import CameraPhoto from "../../Utils/cameraPhoto";
import { Capitalise } from "../../hooks/useCapitalise";
import { id } from "zod/v4/locales";




const ContractCandidates_Mainbar = () => {
  //navigation
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [columnData, setColumnData] = useState([]);
  console.log("columnData", columnData);
  const [error, setError] = useState(null);
  const [employeesList, setEmployeesList] = useState([]);
  const [backendValidationError, setBackendValidationError] = useState(null);
  const [employeeIds, setEmployeeIds] = useState([]);
   console.log("toast object .........:.......... ", toast);

const user = JSON.parse(localStorage.getItem("pssuser") || "null");

const userId = user?.id;
const userRole = user?.role_id;

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
      // gender: z.string().min(1, "Gender is required"),
      phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
      aadhar: z.string().regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
      pan_number: z.string().optional(),
      company: z.string().min(1, "Company is required"),
      
      interviewDate: z.string().min(1, "Interview date is required"),
      interviewStatus: z.string().min(1, "Interview status is required"),
      candidateStatus: z.string().min(1, "Candidate status is required"),
      reference: z.string().min(1, "Reference is required"),
education: z.string().optional(),
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

      if (data.interviewStatus === "rejected" && !data.rejectReason?.trim()) {
        ctx.addIssue({
          path: ["rejectReason"],
          message: "Reject reason is required when interview is rejected",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.interviewStatus === "hold" && !data.holdReason?.trim()) {
        ctx.addIssue({
          path: ["holdReason"],
          message: "Hold reason is required when interview is on hold",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.interviewStatus === "waiting" && !data.waitReason?.trim()) {
        ctx.addIssue({
          path: ["waitReason"],
          message: "Wait reason is required when interview is waiting",
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
      rejectReason: editData ? editData.rejectReason : "",
      holdReason: editData ? editData.holdReason : "",
      selectedJoiningDate: editData ? editData.selectedJoiningDate : getTodayDate(),
      candidateStatus: editData ? editData.candidateStatus : "",
      notJoinedReason: editData ? editData.notJoinedReason : "",
      joinedDate: editData ? editData.joinedDate : "",
      reference: editData ? editData.reference : "",
      otherReference: editData ? editData.otherReference : "",
      education: editData ? editData.education : "",
      profile_picture: editData ? editData.profile_picture : "",
      documents: editData ? editData.documents : [],
      // dob: editData ? editData.dob : "",
      // fatherName: editData ? editData.fatherName : "",
      // address: editData ? editData.address : "",
      // gender: editData ? editData.gender : "",
    },
  });
  // const joining_date = watch("joinedDate");
  const company_name = watch("company");
  const joining_date = watch("selectedJoiningDate");
  const profile_picture = watch("profile_picture");
  const document = watch("documents");
  const education = watch("education");
  // console.log("profile_picture", profile_picture);
  // console.log("documents", document);
  // console.log("education", education);



  console.log("joining_date", joining_date);
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
  console.log("filterCandidateStatus", filterCandidateStatus)
  const [selectedReference, setSelectedReference] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");
  const [filterEducation, setFilterEducation] = useState("");

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
  const handleResetFilter = () => {
    const today = new Date().toISOString().split("T")[0];
    setFilterStartDate(today);
    setFilterEndDate(today);
    setSelectedReference("");
    setFilterEducation("");
    setFilterInterviewStatus("");
    setFilterCandidateStatus("");
    fetchContractCandidates();
  };

 const fetchId = async (payload) => {
    console.log("payload", payload);
    try {
      const response = await axiosInstance.post(
        `api/contract-emp/move-candidate-emp`,
        payload
      );

      console.log("Success:", response);
      
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
    new Date().toISOString().split("T")[0]
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
    const mappedData = {
      id: "",
      name: "",
      phone: "",
      aadhar: "",
      pan_number: "",
      // company: null,
      company: "",
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
  setPhoto(null);
  setDocuments([]);
  setEditData(null);
    reset(mappedData);
    setTimeout(() => {
      setIsModalOpen(false);
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

const handleView = async (row) => {

  try {
    const res = await axiosInstance.get(
      `${API_URL}api/contract-emp/edit/${row.id}`
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

  useEffect(() => {
    if (ModalOpen) {
      fetchCompanyList();
    }
  }, [ModalOpen]);

  const fetchCompanyList = async () => {
    try {
      const response = await axiosInstance.get("/api/company");
      console.log("response check", response);

      if (response.data.success) {
        const companies = response.data.data.map((company) => ({
          label: company.company_name,
          value: company.id,
        }));
        // console.log("companies",companies)

        setCompanyOptions(companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

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
    file = new File(
      [fileOrBlob],
      `camera-${Date.now()}.png`, 
      { type: fileOrBlob.type || "image/png" }
    );
  }

  setPhoto(file);
  setValue("profile_picture", file,{ shouldValidate: true });
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


  const handleFileSubmit = async (e) => {
    // console.log("selectedAccount:1");
    e.preventDefault();

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
        `${API_URL}api/contract-emp/import`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          // Add timeout for debugging
        }

      );

      // console.log("response:", response.data);
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
    }
  };

  const normalizeEditData = (row) => {
    return {
      id: row.id || null,
      name: row.name || "",
      // address: row.address || "",
      // gender: row.gender || "",
      // fatherName: row.father_name || "",
      // dob: row.date_of_birth || "",
      phone: row.phone_number || "",
      aadhar: row.aadhar_number || "",
      pan_number: row.pan_number || "",
      education: row.education || "",
      company: String(row.company_id),
      interviewDate: row.interview_date || "",
      interviewStatus: row.interview_status
        ? row.interview_status.toLowerCase()
        : "",
      candidateStatus:
        row.joining_status == "joined"
          ? "joined"
          : row.joining_status == "not joined"
            ? "not_joined"
            : "",
      selectedJoiningDate: row.joining_date || "",
      joinedDate: row.joined_date || "",
      reference: row.reference || "",
      otherReference: row.other_reference || "",
      rejectReason:
        row.notes?.find((n) => n.note_status === "reject")?.notes || "",
      holdReason:
        row.notes?.find((n) => n.note_status === "hold")?.notes || "",
      waitReason:
        row.notes?.find((n) => n.note_status === "waiting")?.notes || "",
      notJoinedReason:
        row.notes?.find((n) => n.note_status === "not_joined")?.notes || "",
      profile_picture: row.profile_picture || "",
      documents: row.documents || [],
    };
  };


  const openEditModal = async (row) => {
   
    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);

     const response = await axiosInstance.get(
    `/api/contract-emp/edit/${row.id}`
  );
   console.log("openeditmodal:",response.data);

  if (response.data.success) {
      const rowData = response.data.data; // Get fresh data from API
      const normalizedData = normalizeEditData(rowData);
      
      setEditData(normalizedData);
      setSelectedEducation(normalizedData.education || null);

   if (normalizedData.profile_picture) {
        // If it's already a full URL, use it; otherwise, append base URL
        const imageUrl = normalizedData.profile_picture.startsWith('http') 
          ? normalizedData.profile_picture 
          : `${API_URL}/${normalizedData.profile_picture}`;
        setPhoto(imageUrl);
         setValue("profile_picture", normalizedData.profile_picture);
      } else {
        setPhoto(null);
      }

      let normalizedDocs = [];
    if (rowData.document_groups) {
      normalizedDocs = rowData.document_groups.flatMap(group => 
        group.documents.map(doc => ({
          ...doc,
          id: doc.id,
          title: group.title,
          existing: true // marker for your UI
        }))
      );
    } else if (rowData.documents) {
      normalizedDocs = rowData.documents.map(doc => ({
    ...doc,
    existing: true
  }));
    }

    setDocuments(normalizedDocs); // Update local state for the file list UI

    const selectedCompanyObj = companyDropdown.find(
      (c) => String(c.value) === String(normalizedData.company)
    );
    // console.log("123", selectedCompanyObj)

    
    // console.log("test123", row)
    setSelectedCompany(selectedCompanyObj.value);

    reset({
      ...normalizedData,
      company: String(normalizedData.company),
    });
  }

  };

  const fetchContractCandidates = async () => {

setLoading(true);
    try {
      
      const payload = {
        startDate: filterStartDate,
        endDate: filterEndDate,
        reference: selectedReference,
        education: filterEducation,
        interview_status: filterInterviewStatus,
        joining_status: filterCandidateStatus,

      };
      const queryParams = new URLSearchParams(payload).toString();

      const response = await axiosInstance.get(`api/contract-emp?${queryParams}`);
      console.log("contract candidates response .... : ....", response)
      const employees = response?.data?.data?.employees || [];

      setColumnData(response?.data?.data?.employees || []);
      setEmployeesList(response?.data?.data?.pssemployees || []);
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

  // delete
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
      await axiosInstance.delete(`${API_URL}api/contract-emp/delete/${id}`);
      setTimeout(() =>
 toast.success("Contract Candidates deleted successfully"),300)

      fetchContractCandidates();
     
 
     
    } catch (error) {
      toast.error("Failed to delete Contract Candidates");
    }
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
    {
      header:"Education",
      field:"education",
      body:(row) => Capitalise(row.education) || row.education || "-"
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
            isJoined
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }
        `}
        style={{ minWidth: "100px", textAlign: "center" }}
      >
        {rawStatus.replace("_", " ")}
      </span>
    );
  },
}
,

    {
      header: "Reference",
      field: "reference",
      body: (row) => Capitalise(row.reference) || row.reference || "-",
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
        const onSubmit = async (data) => {
          try {
            console.log('Form data before submit:', {
            profile_picture: data.profile_picture,
            profile_image_type: typeof data.profile_picture,
            isFile: data.profile_picture instanceof File,
            documents: data.documents,
            documents_length: data.documents?.length
          });
            const createCandidate = {
              name: data.name,
              address: data.address || "test",

              // date_of_birth: formatDateToYMD(data.dob),
              // father_name: data.fatherName,
              // gender: data.gender,
              phone_number: data.phone,
              aadhar_number: data.aadhar,
              pan_number: data.pan_number,
              company_id: Number(data.company),
          education: data.education, 

              interview_date: formatDateToYMD(data.interviewDate),
              interview_status: data.interviewStatus,
              reference: data.reference,
              joining_status: data.candidateStatus,
              joined_date:
                data.candidateStatus === "joined"
                  ? formatDateToYMD(data.joinedDate)
                  : null,
              joining_date:
                data.interviewStatus === "selected"
                  ? formatDateToYMD(data.selectedJoiningDate)
                  : null,
              other_reference:
                data.reference === "other" ? data.otherReference : null,
              notes_details: (() => {
                const notes = [];

                if (data.candidateStatus === "not_joined") {
                  notes.push({
                    notes: data.notJoinedReason,
                    note_status: "not_joined",
                  });
                }

                switch (data.interviewStatus) {
                  case "waiting":
                    notes.push({
                      notes: data.waitReason || "-",
                      note_status: "wait",
                    });
                    break;
                  case "hold":
                    notes.push({
                      notes: data.holdReason,
                      note_status: "hold",
                    });
                    break;
                  case "rejected":
                    notes.push({
                      notes: data.rejectReason,
                      note_status: "reject",
                    });
                    break;
                  default:
                    break;
                }

                return notes;
              })(),
              status: 1,
              created_by: userId,
              role_id: userRole,
            };

            const formData = new FormData();


      Object.entries(createCandidate).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(
                key,
                typeof value === "object" ? JSON.stringify(value) : value
              );
            }
          });

      //  Profile image
          if (data.profile_picture instanceof File) {
            formData.append("profile_picture", data.profile_picture);
          }else if (typeof data.profile_picture === "string") {
            
            formData.append("existing_profile_picture", data.profile_picture);
          }

          //  Documents
          
      //  if (documents && documents.length > 0) {
      //       documents.forEach((doc, index) => {
      //         // a new file upload
      //         if (doc instanceof File) {
      //           // formData.append(`documents[${index}][title]`, doc.name.split('.')[0]); // Use filename as title
      //           formData.append(`documents[${index}][file]`, doc);
      //           // formData.append(`documents[${index}][files][0]`, doc);
      //         } else {
      //           // existing document
      //           formData.append(`documents[${index}][id]`, doc.id);
      //           // formData.append(`documents[${index}][existing_path]`, doc.file_path);
      //         }
              
      //       });
      //     }

      // Documents (NEW FILES ONLY)
      console.log("on submit doc",documents);
      
            if (documents && documents.length > 0) {
              documents.forEach((doc,index) => {
                if (doc instanceof File) {
                  formData.append("documents[]", doc);
                }else if (doc.id) {
          
            // formData.append(`existing_document_ids[${index}]`, doc.id);
            formData.append("documents[]", doc.id);
          }
              });
            }

            console.log("Create candidate ,.... : .....",createCandidate)
            setLoading(true);

            const url = editData
            ? `/api/contract-emp/update/${editData.id}`
            : `/api/contract-emp/create`;

          await axiosInstance.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });


         setTimeout(() => 
          toast.success(editData ? "Updated Successfully" : "Created Successfully")
         , 300);

             
   await  fetchContractCandidates();
     closeAddModal();
   

        

        } catch (error) {
          console.error(error);
          toast.error("Something went wrong");
        } finally {
          setLoading(false);
        }
      //       if (editData) {
      //         const response = await axiosInstance.post(
      //           `/api/contract-emp/update/${editData.id}`,
      //           createCandidate
      //         );

      //         console.log("interview CAndidate response:",response)
      //         closeAddModal();
      // fetchContractCandidates();
      //          toast.success("Candidate Updated successfully");
      //         // , {
      //         //   onClose: () => {
      //         //     fetchContractCandidates();
      //         //   },
      //         // });

      //       } else {
      //         const response = await axiosInstance.post(
      //           "/api/contract-emp/create",
      //           createCandidate,
                
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      //         );
      // console.log("interview CAndidate response:",response)

      //         closeAddModal();
      //         fetchContractCandidates();
      //         toast.success("Candidate added successfully")
      //         // toast.success("Candidate added successfully", 
      //         //   {
      //         //   onClose: () => {
      //         //     fetchContractCandidates();
      //         //   },
      //         // });

      //       }
      //     } catch (error) {
      //       if (error.response) {
      //         console.log("Backend error:", error.response.data);
      //         setBackendValidationError(error.response.data.message);
      //       } else if (error.request) {
      //         console.log("No response received:", error.request);
      //       } else {
      //         console.log("Axios config error:", error.message);
      //       }
      //     } finally {
      //       setLoading(false);
      //     }
        };

  const companyDropdown = companyOptions.map((c) => ({
    label: c.label,
    value: String(c.value),
  }));

  console.log("companyDropdown", companyDropdown)

  const educationOptions=[
                            { label: "10th Standard/SSLC", value: "10th_standard/sslc" },
                            { label: "12th (HSC)-Science", value: "12th(hsc_science)" },
                            { label: "12th (HSC)-Arts/Commerce/Vocational", value: "12th(hsc_commerce_vocational)" },
                            { label: "Diploma/Polytechnic/Vocational/ITI", value: "diploma/polytechnic/vocational/iti" },
                            { label: "B.A.(Bachelor of Arts)", value: "bachelor_of_arts" },
                            { label: "B.Sc.(Bachelor of Science)", value: "science" },
                            { label: "B.Com.(Bachelor of Commerce)", value: "bachelor_of_commerce" },
                            { label: "B.C.A.(Bachelor of Computer Application)", value: "bachelor_of_computer_application" },
                            { label: "B.B.A.(Bachelor of Business Administration)", value: "bachelor_of_business_administration" },
                            { label: "B.E.(Bachelor of Engineering)", value: "bachelor_of_engineering" },
                            { label: "B.Tech(Bachelor of Technology)", value: "bachelor_of_technology" },
                            { label: "B.Arch(Bachelor of Architecture)", value: "bachelor_of_architecture" },
                            { label: "B.Pharm(Bachelor of Pharmacy)", value: "bachelor_of_pharmacy" },
                            { label: "B.P.T(Bachelor of Physiotherapy)", value: "pysiotherapy" },
                            { label: "B.N.Y.S / B.Nat (Naturopathy & Yogic Sciences)", value: "naturopathy" },
                            { label: "B.A.M.S (Ayurvedic Medicine & Surgery)", value: "ayurveda" },
                            { label: "B.H.M.S (Homeopathy Medicine)", value: "homeopathy" },
                            { label: "M.B.B.S (Medicine & Surgery))", value: "mbbs" },
                            { label: "B.D.S (Dental Surgery)", value: "bds" },
                            { label: "B.V.Sc & A.H (Veterinary Science)", value: "veterinary" },
                            { label: "B.S.W (Bachelor of Social Work)", value: "social_work" },
                            { label: "B.P.Th. / BPT (Physiotherapy / Allied Health)", value: "physiotherapy" },
                            { label: "B.O.T / B.O.Th / B.Opt (Occupational Therapy / Optometry)", value: "optometry" },
                            { label: "B.Sc Nursing", value: "nursing" },
                            { label: "B.H.M / B.H.M.C.T (Hotel Management / Hospitality)", value: "hospitality" },
                            { label: "B.A + B.Ed (Integrated)", value: "integrated" },
                            { label: "B.Sc + B.Ed (Integrated)", value: "integrated" },
                            { label: "B.Com + B.Ed (Integrated)", value: "integrated" },
                            { label: "B.A + LL.B (Integrated Law)", value: "integrated" },
                            { label: "B.Com + LL.B (Integrated Law)", value: "integrated" },
                            { label: "B.B.A + LL.B (Integrated Law / Business Law)", value: "integrated/business" },
                            { label: "B.B.A + LL.B (Integrated Law / Business Law)", value: "integrated/business" },
                            { label: "M.A. (Master of Arts)", value: "master_of_arts" },
                            { label: "M.Sc. (Master of Science)", value: "master_of_science" },
                            { label: "M.Com. (Master of Commerce)", value: "master_of_commerce" },
                            { label: "M.C.A. (Master of Computer Applications)", value: "master_of_computer_application" },
                            { label: "M.B.A. (Master of Business Administration)", value: "master_of_business_administration" },
                            { label: "M.Ed. (Master of Education)", value: "master_of_education" },
                            { label: "LL.M (Master of Laws)", value: "master_of_laws" },
                            { label: "M.P.T (Master of Physiotherapy / Allied Health)", value: "master_of_physiotherapy" },
                            { label: "M.Pharm (Master of Pharmacy)", value: "master_of_pharmacy" },
                            { label: "M.D / M.S (Postgraduate Medical / Surgical)", value: "postgraduate" },
                            { label: "M.Tech (Master of Technology)", value: "master_of_technology" },
                            { label: "M.Arch (Master of Architecture)", value: "master_of_architecture" },
                            { label: "M.S.W (Master of Social Work)", value: "master_of_social_work" },
                            { label: "M.P.H (Master of Public Health)", value: "master_of_public_health" },
                            { label: "M.Phil (Master of Philosophy)", value: "master_of_philosophy" },
                            { label: "Ph.D (Doctor of Philosophy / Doctoral)", value: "doctor_of_philosophy" },
                            { label: "Certificate Course", value: "certificate" },
                            { label: "Postgraduate Diploma", value: "postgraduate_diploma" },
                            { label: "Vocational / Skill Certificate / ITI / Trade", value: "vocational_certificate" }
                          ];

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-10">
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

             {/* <button
      onClick={() => toast.success("🔥 Toast is working")}
      style={{ padding: "20px" }}
    >
      Test Toast
    </button> */}

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

                    <select
                      value={selectedReference}
                      onChange={(e) => setSelectedReference(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C]
               focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >

                      <option value="">Select Reference</option>
                      {employeesList.map((emp) => (
                        <option key={emp.id} value={emp.full_name}>
                          {emp.full_name}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
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
                      placeholder="Select Status "
                      filter
                      className="w-full border border-gray-300 text-sm text-[#7C7C7C] rounded-md placeholder:text-gray-400"
                    />
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
                      onChange={(e) => setRows(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">
                      Entries Per Page
                    </span>
                  </div>

                  <div className="flex items-center gap-11">
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
                    </div>
                    {/* <div className="flex items-center">
                      <button
                        onClick={openImportAddModal}
                        className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium w-20 rounded-lg"
                      >
                        Import
                      </button>
                    </div> */}
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
                      <button
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
      {photo ? "Change Photo" : "Upload Photo"} <span className="text-red-500">*</span>
    </p>

    {/* Preview */}
    <div className="relative">
      {photo ? (
        <img
          src={photo instanceof File ? URL.createObjectURL(photo) : photo}
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
      <p className="text-red-500 text-sm">{errors.profile_picture.message}</p>
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
                            setValue("company", String(e.value), { shouldValidate: true });
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

                    {/* <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>

                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="Male"
                              {...register("gender", { required: "Gender is required" })}
                              className="accent-[#1ea600]"
                            />
                            Male
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="Female"
                              {...register("gender", { required: "Gender is required" })}
                              className="accent-[#1ea600]"
                            />
                            Female
                          </label>
                        </div>

                        <span className="text-red-500 text-sm">
                          {errors.gender?.message}
                        </span>
                      </div>
                    </div>  */}


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
                            e.target.value = e.target.value.replace(/\D/g, "");
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
                            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 12);
                          }}
                          placeholder="Enter AadharNumber"
                        />
                        <span className="text-red-500 text-sm">
                          {errors.aadhar?.message}
                        </span>
                      </div>
                    </div>

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
                          {...register("pan")}
                          
                          maxLength={10}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                          }}
                          placeholder="Enter Pan Number"
                        />
                        <span className="text-red-500 text-sm">
                          {errors.pan?.message}
                        </span>
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
                      <label className="block text-md font-medium mb-2">
                        Education <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <Dropdown
                          value={selectedEducation}
                          onChange={(e) => {
  setSelectedEducation(e.value);
  setValue("education", String(e.value), { shouldValidate: true });
}}
                          options={educationOptions}
                          optionLabel="label"
                          optionValue="value"
                          filter
                          placeholder="Select Education"
                          className={`uniform-field w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1ea600] border ${errors.education ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.education && (
                          <p className="text-red-500 text-sm mt-1">{errors.education}</p>
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
                        Interview Status <span className="text-red-500">*</span>
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

                    {interviewStatus === "rejected" && (
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Reason for Rejection
                          <span className="text-red-500">*</span>
                        </label>

                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <textarea
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            name="rejectReason"
                            {...register("rejectReason")}
                          ></textarea>
                          <span className="text-red-500 text-sm">
                            {errors.rejectReason?.message}
                          </span>
                          {/* {errors.rejectReason && <p className="text-red-500 text-sm mt-1">{errors.rejectReason}</p>} */}
                        </div>
                      </div>
                    )}

                    {interviewStatus === "hold" && (
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Reason for Hold
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <textarea
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            name="holdReason"
                            {...register("holdReason")}
                          ></textarea>
                          <span className="text-red-500 text-sm">
                            {errors.holdReason?.message}
                          </span>
                        </div>
                      </div>
                    )}

                    {interviewStatus === "waiting" && (
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Reason for Waiting
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <textarea
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            name="waitReason"
                            {...register("waitReason")}
                          />
                          <span className="text-red-500 text-sm">
                            {errors.waitReason?.message}
                          </span>
                          {/* {errors.waitReason && <p className="text-red-500 text-sm mt-1">{errors.waitReason}</p>} */}
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
                             
                                fetchId({
                                  // date_of_joining: e.target.value,
                                  company_id: selectedCompany,
                                  name: watch("name"),
                                  // address: watch("address"),
                                  phone_number: watch("phone"),
                                  aadhar_number: watch("aadhar"),
                                  joining_date: e.target.value,
                                  // joined_date: e.target.value
                                });
                              
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
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Reference 
                        {/* <span className="text-red-500">*</span> */}
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
                        {/* {errors.reference && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.reference.message}
                                </p>
                              )} */}
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
    <div key={index} className="flex justify-between items-center p-2 border rounded">
      <span className="text-sm truncate">
        {doc instanceof File ? doc.name : (doc.original_name || "Existing Document")}
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
                          console.log(errors)
                        )}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isViewModalOpen && viewRow && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative animate-fadeIn">
                  {/* Close Button */}
                  <button
                    onClick={closeViewModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                  >
                    <IoIosCloseCircle size={28} />
                  </button>

                  {/* Title and profile picture */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
  <h2 className="text-xl font-semibold text-[#1ea600]">
    Contract Candidate Details
  </h2>
  
  {/* Profile Picture Display */}
  <div className="flex flex-col items-center mr-10">
    {viewRow.profile_picture ? (
      <img
         src={
      viewRow.profile_picture.startsWith("http")
        ? viewRow.profile_picture
        : `${API_URL}${viewRow.profile_picture}`
    }
        alt="Profile"
        className="w-24 h-28 rounded-md object-cover border-2 border-gray-200 shadow-sm"
      />
    ) : (
      <div className="w-24 h-28 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 border border-dashed text-xs">
        No Photo
      </div>
    )}
  </div>
</div>

                  {/* Candidate Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">

                    <p>
                      <b>Company:</b>{" "}
                      {companyOptions.find(c => c.value === viewRow.company_id)?.label || "-"}
                    </p>

                    <p>
                      <b>Name:</b> {viewRow.name}
                    </p>
                    <p>
                      <b>Phone:</b> {viewRow.phone_number}
                    </p>

                    <p>
                      <b>Aadhar:</b> {viewRow.aadhar_number}
                    </p>

<p>
  <b>Education:</b>{" "}
  {educationOptions.find(e => e.value === viewRow.education)?.label || "-"}
</p>


                    <p>
                      <b>Interview Date:</b> {formatToDDMMYYYY(viewRow.interview_date) || "-"}
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
                      <b>Joining Date:</b> {formatToDDMMYYYY(viewRow.joining_date) || "-"}
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
                        <b>Other Reference:</b> {viewRow.other_reference || "-"}
                      </p>
                    )}


                    <p className="col-span-2">
                      <b>Notes:</b>{" "}
                      {viewRow.notes_details?.[0]?.notes ||
                        "No notes available"}
                    </p>

<div className="col-span-2 pt-4">
  <b className="block mb-2 text-gray-700">Documents:</b>
  {/* Check if documents is an array and has items */}
  {viewRow.documents && viewRow.documents.length > 0 ? (
    <div className="space-y-2">
      {viewRow.documents.map((doc, index) => (
        <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border">
          <span className="text-gray-600 truncate flex-1">
            {doc.original_name || `Document ${index + 1}`}
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => window.open(`${API_URL}/${doc.document_path}`, "_blank")}
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
    <p className="text-gray-500 italic">No documents uploaded.</p>
  )}
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

export default ContractCandidates_Mainbar;
