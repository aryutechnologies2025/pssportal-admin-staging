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
import { z } from "zod";
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
import { Capitalise } from "../../hooks/useCapitalise";
import { IoMdDownload } from "react-icons/io";
import CameraPhoto from "../../Utils/cameraPhoto";

const Employee_contract_details = () => {
  //navigation
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [columnData, setColumnData] = useState([]);

  console.log("columnData", columnData);
  const [error, setError] = useState(null);
  const [employeesList, setEmployeesList] = useState([]);
  const [backendValidationError, setBackendValidationError] = useState(null);
  const user = JSON.parse(localStorage.getItem("pssuser") || "null");

  const userId = user?.id;
  const userRole = user?.role_id;

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const candidateContractSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      dob: z.string().min(1, "Date of birth is required"),
      fatherName: z.string().min(1, "Father's name is required"),
      address: z.string().min(1, "Address is required"),
      gender: z.string().min(1, "Gender is required"),
      phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
      aadhar: z.string().regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
      company: z.string().min(1, "Company is required"),
      joinedDate: z.string().min(1, "Joined date is required"),
      accountName: z.string().min(1, "Account name is required"),
      ifsccode: z.string().min(1, "IFSC code is required"),
      uannumber: z.string().min(1, "UAN number is required"),
      esciNumber: z.string().min(1, "ESCI number is required"),
      status: z.string().min(1, "Status is required"),
      manual_value: z.string().optional(),
      profile_picture: z.any().optional(),
      documents: z.array(z.any()).optional(),
    })


  const [employeeIds, setEmployeeIds] = useState([]);

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
      company: editData ? editData.company_name : "",
      manual_value: editData ? editData.manual_value : "",
      dob: editData ? editData.dob : "",
      fatherName: editData ? editData.fatherName : "",
      address: editData ? editData.address : "",
      gender: editData ? editData.gender : "",
      joinedDate: editData ? editData.joinedDate : "",
      accountName: editData ? editData.accountName : "",
      ifsccode: editData ? editData.ifsccode : "",
      uannumber: editData ? editData.uannumber : "",
      esciNumber: editData ? editData.esciNumber : "",
      status: editData ? editData.status : "",
      profile_picture: editData ? editData.profile_picture : "",
      documents: editData ? editData.documents : [],

    },
  });

  useEffect(() => {
    setValue("manual_value", employeeIds);
  }, [employeeIds, setValue]);
  const joined_date = watch("joinedDate");
  const company_name = watch("company");

  const manual_value = watch("manual_value");

  console.log("joined_date", joined_date);

  console.log("manual_value", manual_value);


  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const employees = ["Saravanan", "Ramesh", "Priya"];

  // Filter states - FIXED: Corrected variable names


  const [filterInterviewStatus, setFilterInterviewStatus] = useState("");
  const [filterCandidateStatus, setFilterCandidateStatus] = useState("");
  const [selectedReference, setSelectedReference] = useState("");

  const [companyEmpType, setCompanyEmpType] = useState([]);

  console.log("companyEmpType", companyEmpType);

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

  // const handleApplyFilter = () => {
  //   //  filter logic here
  //   console.log({
  //     filterStartDate,
  //     filterEndDate,
  //     selectedReference,
  //     filterInterviewStatus,
  //     filterCandidateStatus,
  //   });
  //   //  applyFilters()
  // };

  // Reset filters
  const handleResetFilter = () => {
    // Reset all filters
    const today = new Date().toISOString().split("T")[0];
    setFilterStartDate(today);
    setFilterEndDate(today);
    setFilterStatus("");
    setFilterGender("");
    setSelectedCompanyfilter("");

    fetchContractCandidates();
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

  console.log("selectedCompany", selectedCompany);




  const [companyOptions, setCompanyOptions] = useState([]);
  console.log("companyOptions", companyOptions);

  const fileInputRef = useRef(null);
  const fileInputRefEdit = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

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
      company: null,
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
    setDocuments([]);

    setTimeout(() => {
      setIsModalOpen(false);
      setBackendValidationError(null);
      setEditData(null);
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
      file = new File(
        [fileOrBlob],
        `camera-${Date.now()}.png`,
        { type: fileOrBlob.type || "image/png" }
      );
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
        `${API_URL}api/contract-employee/edit/${row.id}`
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
      const response = await axiosInstance.get("/api/company");
      console.log("response check", response);

      if (response.data.success) {
        const companies = response.data.data.map((company) => ({
          // console.log("company", company),
          label: company.company_name,
          value: company.id,
          company_emp_id: company.company_emp_id,
        }));

        setCompanyOptions(companies);

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
        `${API_URL}api/contract-employee/import`,
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
    }
  };

  const normalizeDocuments = (rowData) => {
    if (rowData.document_groups?.length) {
      return rowData.document_groups.flatMap(group =>
        group.documents.map(doc => ({
          id: doc.id,
          original_name: doc.original_name,
          document_path: doc.document_path,
          existing: true,
        }))
      );
    }

    if (rowData.documents?.length) {
      return rowData.documents.map(doc => ({
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
      // company: row.company.id ? Number(row.company.id) : "",
      // companyLabel: row.company?.company_name || "",
      joinedDate: row.joining_date || "",
      accountName: row.acc_no || "",
      ifsccode: row.ifsc_code || "",
      uannumber: row.uan_number || "",
      esciNumber: row.esic || "",
      manual_value: row.employee_id || "",
      interviewDate: row.interview_date || "",
      status: String(row.status),
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
    };
  };


  const openEditModal = async (row) => {
    console.log("open edit row", row)

    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);

    const response = await axiosInstance.get(
      `/api/contract-employee/edit/${row.id}`
    );
    console.log("openeditmodal:", response.data);

    if (response.data.success) {
      const rowData = response.data.data; // Get fresh data from API
      const normalizedData = normalizeEditData(rowData);

      setEditData(normalizedData);


      if (normalizedData.profile_picture) {
        // If it's already a full URL, use it; otherwise, append base URL
        const imageUrl = normalizedData.profile_picture.startsWith('http')
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
        c => c.value === String(normalizedData.company)
      );

      setSelectedCompany(selectedCompanyObj?.value || "");

      reset({
        ...normalizedData,
        company: String(normalizedData.company),
      });
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

  const [selectedCompanyfilter, setSelectedCompanyfilter] = useState('');

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
      };
      // console.log("Sending payload as params:", payload);

      const queryParams = new URLSearchParams(payload).toString();
      const response = await axiosInstance.get(`api/contract-employee?${queryParams}`);
      const employees = response?.data?.data?.employees || [];

      console.log("response emp check", response);

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


  const fetchId = async (payload) => {
    console.log("payload", payload);
    try {
      const response = await axiosInstance.post(
        `api/contract-employee/assign-emp-generate`,
        payload
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
      await axiosInstance.delete(`${API_URL}api/contract-employee/delete/${id}`);

      setTimeout(() => toast.success("Contract Candidates deleted successfully"), 300)
      await fetchContractCandidates();

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
      body: (row) => Capitalise(row.name || "-"),
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
            ${row.status === 0 || row.status === "0"
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

        date_of_birth: formatDateToYMD(data.dob),
        father_name: data.fatherName,
        gender: data.gender,
        phone_number: data.phone,
        aadhar_number: data.aadhar,
        company_id: Number(data.company),
        joining_date: formatDateToYMD(data.joinedDate),
        acc_no: data.accountName,
        ifsc_code: data.ifsccode,
        uan_number: data.uannumber,
        esic: data.esciNumber,
        employee_id: data.manual_value,

        // status: data.status,
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

      console.log("Create candidate ,.... : .....", createCandidate)
      setLoading(true);

      const url = editData
        ? `/api/contract-employee/update/${editData.id}`
        : `/api/contract-employee/create`;

      await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTimeout(() => toast.success(editData ? "Updated Successfully" : "Created Successfully"), 300)
      fetchContractCandidates();
      closeAddModal();


    } catch (error) {
      console.error(" Error creating candidate:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }

  };

  const companyDropdown = companyOptions.map((c) => ({
    label: c.label,
    value: String(c.value),
    company_emp_id: c.company_emp_id,
  }));

  console.log("companyDropdown", companyDropdown)

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
                Employee
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
                  {/* Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">Status</label>
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
                    <label className="text-sm font-medium text-[#6B7280]">Gender</label>
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

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">Company</label>

                    <div className="w-[60%] md:w-[100%]">
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
                    <div className="flex items-center">
                      <button
                        onClick={openImportAddModal}
                        className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium w-20 rounded-lg"
                      >
                        Import
                      </button>
                    </div>
                    <button
                      onClick={openAddModal}
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      + Add Employee
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
                      Employee Candidates
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
                        {/* <Dropdown
                          value={selectedCompany}
                          onChange={(e) => setSelectedCompany(e.value)}
                          options={companyOptions}
                          optionLabel="label"
                          placeholder="Select Company"
                          filter
                          className="w-full border border-gray-300 rounded-lg"
                        /> */}
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
                              (item) => item.value === e.value
                            );
                            setCompanyEmpType(obj.company_emp_id?.toLowerCase());
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
                      {!editData ? "ADD" : "Edit"} Employee
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
                          placeholder="Select Company"
                          filter
                          className="w-full border border-gray-300 rounded-lg"
                          onChange={(e) => {
                            setSelectedCompany(e.value);
                            const obj = companyDropdown.find(
                              (item) => item.value === e.value
                            );
                            setCompanyEmpType(obj.company_emp_id?.toLowerCase());
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
                          placeholder="Enter the Father Name"
                        />
                        <span className="text-red-500 text-sm">
                          {errors.fatherName?.message}
                        </span>
                      </div>
                    </div>




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
                          placeholder="Enter the Address"
                        />
                        <span className="text-red-500 text-sm">
                          {errors.address?.message}
                        </span>
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
                                ? " Employee ID"
                                : "Employee ID"
                            }
                            className={`w-full px-2 py-2 border rounded-[10px]
          ${companyEmpType === "automatic"
                                ? "bg-gray-100 cursor-not-allowed"
                                : "bg-white"
                              }`}
                          />
                        </div>
                      </div>
                    )}



                    {/* account */}


                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Account Name <span className="text-red-500">*</span>
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
                          {...register("status")}
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        >
                          <option value="">Select a status</option>
                          <option value="1">Active</option>
                          <option value="0">InActive</option>
                        </select>
                        {errors.status && (
                          <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                        )}


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
                  <button className="absolute top-4 right-12 text-gray-500 hover:text-green-500">
                    <IoMdDownload size={28} />
                  </button>
                  <button
                    onClick={closeViewModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                  >
                    <IoIosCloseCircle size={28} />
                  </button>


                  {/* Title and profile image */}
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-semibold text-[#1ea600]">
                      Employee Details
                    </h2>

                    {/* Profile Picture Display */}
                    <div className="flex flex-col items-center mr-16">
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
                      <b>Name:</b> {viewRow.name || "-"}
                    </p>
                    <p>
                      <b>Phone:</b> {viewRow.phone_number || "-"}
                    </p>
                    <p>
                      <b>Aadhar:</b> {viewRow.aadhar_number || "-"}
                    </p>
                    <p>
                      <b>Account No:</b> {viewRow.acc_no || "-"}
                    </p>
                    <p>
                      <b>Address:</b> {viewRow.address || "-"}
                    </p>
                    <p>
                      <b>Date of Birth:</b> {formatToDDMMYYYY(viewRow.date_of_birth) || "-"}
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
                      <b>Status:</b> {viewRow.status === 1 ? "Active" : "Inactive"}
                    </p>
                    <p>
                      <b>Joining Date:</b> {formatToDDMMYYYY(viewRow.joining_date) || "-"}
                    </p>
                    <p>
                      <b>Employee ID:</b> {viewRow.employee_id || "-"}
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

export default Employee_contract_details;
