import { useState, useEffect } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward, IoIosCloseCircle } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeEducationSchema, EmployeeSchema, EducationItemSchema, ExperienceItemSchema, EmployeeExperienceSchema } from "./EmployeeSchema";
import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";
import CameraPhoto from "../../Utils/cameraPhoto";
import { Dropdown } from "primereact/dropdown";



const CreateEmployee_Mainbar = () => {
  let navigate = useNavigate();

  const [editEmployeeData, setEditEmployeeData] = useState(null);

  // console.log("editEmployeeData", editEmployeeData);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  // const [error, setError] = useState([]);


  const { id } = useParams();

  const formatDateForInput = (date) => {
    if (!date) return "";
    return date.split("T")[0]; // "YYYY-MM-DD"
  };


  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmployeeSchema(!!id)),
    defaultValues: {
      skills: [],
      bank_name: "",
      salary_amount: undefined,
    },
  });
  console.log("pan_no", watch("pan_no"));


  const [educationList, setEducationList] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const educationForm = useForm({
    resolver: zodResolver(EducationItemSchema),
    defaultValues: {
      school_name: "",
      department_name: "",
      year_of_passing: "",
    },
  });

  const experienceForm = useForm({
    resolver: zodResolver(ExperienceItemSchema),
    defaultValues: {
      job_title: "",
      company_industry: "",
      company_name: "",
      previous_salary: "",
      from_date: "",
      to_date: "",
      responsibilities: [],
      verification_documents: [
        {
          payslip1: 0,
          payslip2: 0,
          payslip3: 0,
          appointment_letter: 0,
          experience_letter: 0,
        },
      ],
    },
  });

  const responsibilities = experienceForm.watch("responsibilities") || [];


  const marital_status = watch("marital_status");
  const date_of_joining = watch("date_of_joining");

  const employeeId = watch("gen_employee_id");
  console.log("employeeId", employeeId);

  // useEffect(() => {
  //   const fetchEmpId = async (data) => {

  //     if (date_of_joining) {
  //       try {

  //         const response = await axiosInstance.post(`api/employees/assign-emp-generate`,
  //           {
  //             date_of_joining
  //           }
  //         );
  //         if (response.data.success === true) {
  //           setValue("gen_employee_id", response?.data?.employee_id, {
  //             shouldValidate: true,
  //           })
  //         } else {
  //           setValue("gen_employee_id", "")
  //         }
  //       } catch (err) {
  //         console.error(err);


  //       }
  //     }
  //   };
  //   fetchEmpId();
  // }, [date_of_joining])

  const fetchEmpId = async (date) => {
    if (!date) return;

    try {
      const response = await axiosInstance.post(
        "api/employees/assign-emp-generate",
        { date_of_joining: date }
      );

      if (response.data.success) {
        setValue("gen_employee_id", response.data.employee_id, {
          shouldValidate: true,
        });
      } else {
        setValue("gen_employee_id", "");
      }
    } catch (err) {
      console.error(err);
    }
  };


  const selectedBankNameOption = watch("bank_name") || "";
  const skills = watch("skills") || [];

  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: "", phone: "", relation: "" },
  ]);
  const [educationInfo, setEducationInfo] = useState([])
  const verificationOptions = [
    "Aadhar",
    "Address Proof",
    "10th",
    "12th",
    "Degree",
    "Photo Proof",
  ];
  const [verifications, setVerifications] = useState(
    verificationOptions.map(opt => ({ type: opt, status: "0" })) // 0 = unchecked
  );


  useEffect(() => {
    setValue("emergencyContacts", emergencyContacts, { shouldValidate: true });
  }, [emergencyContacts, setValue]);


  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}api/role`
      );

      const rolesData = response?.data?.data || [];

      const formattedRoles = rolesData.filter((role) => role.status === "1").map((role) => ({
        // id: role.id,
        id: String(role.id),
        role_name: role.role_name
      }));

      setRoles(formattedRoles);


    } catch (err) {
      console.log(err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {

    try {
      const response = await axiosInstance.get(`api/branches`);
      if (response.data.success === true) {
        console.log(response.data.data);

        // const branchesData = response?.data?.data
        // .filter((branch) => branch.status === "1") || [];

        const branchesData = response?.data?.data
          .filter((branch) => branch.status === "1")
          .map((branch) => ({
            id: String(branch.id), // Convert to string for consistency
            branch_name: branch.branch_name
          })) || [];

        setBranches(branchesData);
        // setTotalRecords(response.data.data.length);

        // If editing, set the selected branch
        if (editEmployeeData?.branch_id) {
          const branch = branchesData.find(b => b.id === String(editEmployeeData.branch_id));
          setSelectedBranch(branch || null);
        }
      } else {
        setBranches([]);
        // setTotalRecords(0);
      }
    } catch (err) {
      console.error(err);
      setBranches([]);

    }
  };



  useEffect(() => {
    const fetchEmployee = async () => {
      try {


        const response = await axiosInstance.get(`/api/employees/edit/${id}`);

        // Assume API returns { data: { ...employee } }
        setEditEmployeeData(response.data.data);

      } catch (err) {
        console.error("Failed to fetch employee data:", err);
      }
    };
    if (id) {
      fetchEmployee();
    }
    fetchRoles();
    fetchBranches();
  }, []);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    if (editEmployeeData) {

      console.log("editEmployeeDatadddddd", editEmployeeData);

      const parsedExperiences = (editEmployeeData.experiences || []).map(exp => {
        let responsibilities = [];
        let verification_documents = [
          { payslip1: 0, payslip2: 0, payslip3: 0, appointment_letter: 0, experience_letter: 0 }
        ];

        // Parse responsibilities safely
        if (exp.responsibilities) {
          try {
            responsibilities = JSON.parse(exp.responsibilities);
            if (!Array.isArray(responsibilities)) responsibilities = [];
          } catch (e) {
            responsibilities = [];
          }
        }

        // Parse verification_documents safely
        if (exp.verification_documents) {
          try {
            verification_documents = JSON.parse(exp.verification_documents);
            if (!Array.isArray(verification_documents)) verification_documents = [
              { payslip1: 0, payslip2: 0, payslip3: 0, appointment_letter: 0, experience_letter: 0 }
            ];
          } catch (e) {
            verification_documents = [
              { payslip1: 0, payslip2: 0, payslip3: 0, appointment_letter: 0, experience_letter: 0 }
            ];
          }
        }

        return {
          ...exp,
          previous_salary: Number(exp.previous_salary) || 0,
          responsibilities,
          verification_documents
        };
      });


      const normalizedDocs = editEmployeeData.document_groups.map(group => ({
        document_group_id: group.id,
        title: group.title,
        files: group.documents.map(doc => ({
          document_id: doc.id,
          file: {
            path: doc.original_name,
            relativePath: doc.file_path,
          },
          preview: `${API_URL}${doc.file_path}`,
          existing: true,
        }))
      }));


      setUploadedDocuments(normalizedDocs);


      reset({
        offical_email: editEmployeeData.offical_email || "",
        password: "",
        full_name: editEmployeeData.full_name || "",
        role_id: editEmployeeData.role_id || "",
        branch_id: editEmployeeData.branch_id || "",
        aadhaar_no: editEmployeeData.aadhaar_no || "",
        pan_no: editEmployeeData.pan_no || "",
        father_name: editEmployeeData.father_name || "",
        mother_name: editEmployeeData.mother_name || "",
        email: editEmployeeData.email || "",
        phone_no: editEmployeeData.phone_no || "",
        qualification: editEmployeeData.qualification || "",

        gen_employee_id: editEmployeeData.gen_employee_id || "",
        date_of_birth: editEmployeeData.date_of_birth ? formatDateForInput(editEmployeeData.date_of_birth) : "",
        date_of_joining: editEmployeeData.date_of_joining ? formatDateForInput(editEmployeeData.date_of_joining) : "",

        effective_date: formatDateForInput(editEmployeeData.effective_date),

        marital_status: editEmployeeData.marital_status || "",
        spouse_name: editEmployeeData.spouse_name || "",
        local_address: editEmployeeData.local_address || "",
        permanent_address: editEmployeeData.permanent_address || "",
        salary_amount: editEmployeeData.salary_amount || 0,
        salary_basis: editEmployeeData.salary_basis || "",
        payment_type: editEmployeeData.payment_type || "",
        skills: editEmployeeData.skills ? JSON.parse(editEmployeeData.skills) : [],
        bank_name: editEmployeeData.bank_name || "",
        bank_branch: editEmployeeData.bank_branch || "",
        bank_account_no: editEmployeeData.bank_account_no || "",
        ifsc_code: editEmployeeData.ifsc_code || "",
        emergencyContacts: editEmployeeData.contacts || [
          { name: "", contact: "", relation: "" }
        ],
        documents: normalizedDocs,
      });


      setEducationList(editEmployeeData.educations || []);

      setWorkExperiences(parsedExperiences);
      setEmergencyContacts(
        editEmployeeData.contacts?.length
          ? editEmployeeData.contacts.map((c) => ({
            name: c.name || "",
            phone: c.phone_number || "",
            relation: c.relationship || "",
          }))
          : [{ name: "", phone: "", relation: "" }]
      );
      setSelectedImage(`${API_URL}${editEmployeeData.photo}` || null);
      if (!editEmployeeData?.verifications) return;

      const updated = verificationOptions.map((opt) => {
        const found = editEmployeeData.verifications.find(
          v => v.document_type === opt
        );

        if (editEmployeeData.role_id) {
          const role = roles.find(r => String(r.id) === String(editEmployeeData.role_id));
          setSelectedRole(role || null);
        }

        if (editEmployeeData.branch_id) {
          const branch = branches.find(b => String(b.id) === String(editEmployeeData.branch_id));
          setSelectedBranch(branch || null);
        }

        return {
          type: opt,
          status: found?.is_verified ? "1" : "0",
        };
      });

      setVerifications(updated);
    }
  }, [editEmployeeData]);


  const handleSave = async (data) => {

    // console.log(data);

    const formData = new FormData();
    formData.append("employee_id", id ? id : null);
    if (data.profile_image instanceof File) {
      formData.append("photo", data.profile_image);
    }
    // Append normal fields
    Object.keys(data).forEach((key) => {
      if (key !== "documents" && key !== "profile_image" && key !== "emergencyContacts" && key !== "emergencyContacts" && key !== "pan_no") {
        // If value is array or object, stringify it
        const value = data[key];
        if (Array.isArray(value) || typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    formData.append("pan_no", data.pan_no.toUpperCase());

    data.emergencyContacts?.forEach((contact, index) => {
      formData.append(`contacts[${index}][name]`, contact.name);
      formData.append(`contacts[${index}][phone_number]`, contact.phone);
      formData.append(`contacts[${index}][relationship]`, contact.relation);
    });

    // Append education and experience arrays
    educationList.forEach((edu, i) => {
      Object.entries(edu).forEach(([key, value]) => {
        formData.append(`educations[${i}][${key}]`, value);
      });
    });

    // inside handleSave
    verifications.forEach((item, index) => {
      if (item.status === "1") {
        formData.append(`verifications[${index}][type]`, item.type);
        formData.append(`verifications[${index}][status]`, item.status);
      }
    });
    // console.log(verifications);


    // workExperiences.forEach((exp, i) => {
    //   Object.entries(exp).forEach(([key, value]) => {
    //     formData.append(`experiences[${i}][${key}]`, value);
    //   });
    // });

    workExperiences.forEach((exp, i) => {
      Object.entries(exp).forEach(([key, value]) => {
        // If value is object/array, convert to JSON string
        if (typeof value === "object" && value !== null) {
          formData.append(`experiences[${i}][${key}]`, JSON.stringify(value));
        } else {
          formData.append(`experiences[${i}][${key}]`, value);
        }
      });
    });

    // Append uploaded documents
    // uploadedDocuments.forEach((doc, i) => {
    //   formData.append(`documents[${i}][title]`, doc.title);

    //   doc.files.forEach((fileObj, j) => {
    //     formData.append(`documents[${i}][files][${j}]`, fileObj.files,
    //       fileObj.file.name);
    //   });
    // });

    // Append uploaded documents
    // uploadedDocuments.forEach((doc, i) => {
    //   if (doc.document_group_id) {
    //     formData.append(`documents[${i}][document_group_id]`, doc.document_group_id);
    //   }
    //   formData.append(`documents[${i}][title]`, doc.title);

    //   doc.files.forEach((fileObj, j) => {
    //     if (fileObj.existing) {
    //       formData.append(
    //         `documents[${i}][files][${j}]`,
    //         JSON.stringify({ document_id: fileObj.document_id, path: fileObj.file.path })
    //       );
    //     } else if (fileObj.fileBlob) {
    //       formData.append(`documents[${i}][files][${j}]`, fileObj.fileBlob);
    //     }
    //   });
    // });
    uploadedDocuments.forEach((doc, i) => {
      if (doc.document_group_id) {
        formData.append(`documents[${i}][document_group_id]`, doc.document_group_id);
      }
      formData.append(`documents[${i}][title]`, doc.title);

      doc.files.forEach((fileObj, j) => {
        if (fileObj.existing) {
          formData.append(
            `documents[${i}][files][${j}]`,
            JSON.stringify({ document_id: fileObj.document_id, path: fileObj.file.path })
          );
        } else if (fileObj.fileBlob) {
          formData.append(`documents[${i}][files][${j}]`, fileObj.fileBlob);
        }
      });
    });



    try {
      if (editEmployeeData) {
        const response = await axiosInstance.post(`/api/employees/update/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // console.log("Employee Updated successfully:", response.data);
        toast.success("Employee Updated successfully!", {
          // onClose: () => navigate("/employees"),
        });
      }
      else {
        const response = await axiosInstance.post("/api/employees/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // console.log("Employee saved successfully:", response.data);
        toast.success("Employee Created successfully!", {
          // onClose: () => navigate("/employees"),
        });
      }
      navigate("/employees");
    } catch (err) {
      const backendErrors = err.response?.data?.errors;

      if (backendErrors) {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          setError(field, {
            type: "server",
            message: messages[0], // take first error message
          });
        });
      } else {
        console.error("Error saving employee:", err);
      }
    }
  };

  const handleError = (errors) => {
    console.log("Validation errors:", errors); // Runs if validation fails
  };

  const onClickCreateEmployeeCancelButton = () => {
    navigate("/employees");
  };

  const handleSaveEducationInfo = (data) => {
    const newList = [...educationList, data];

    const result = EmployeeEducationSchema.safeParse(newList);

    if (!result.success) {
      console.log(result.error.format());
      return;
    }

    setEducationList(newList);
    educationForm.reset();
    closeAddEducationInfoModal();
  };


  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);


  useEffect(() => {
    setValue("emergencyContacts", emergencyContacts);
  }, [emergencyContacts, setValue]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "File too large", text: "Image must be < 2MB" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "error", title: "Invalid file type", text: "Please upload an image file" });
      return;
    }

    setValue("profile_image", file, { shouldValidate: true });
    setSelectedImage(file); // 👈 preview
  };

  const handleCameraCapture = (file) => {
    setSelectedImage(file);
    setValue("profile_image", file);
  };




  const relationOptions = [
    { label: "Father", value: "Father" },
    { label: "Mother", value: "Mother" },
    { label: "Spouse", value: "Spouse" },
    { label: "Sibling", value: "Sibling" },
    { label: "Friend", value: "Friend" },
  ];


  // Add Emergency Contact
  const addEmergencyContact = () => {
    const last = emergencyContacts[emergencyContacts.length - 1];
    // Only add if last contact is filled
    if (last.name && last.phone && last.relation) {
      setEmergencyContacts([...emergencyContacts, { name: "", phone: "", relation: "" }]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Contact",
        text: "Please complete the current contact before adding a new one",
      });
    }
  };

  const removeEmergencyContact = (index) => {
    if (emergencyContacts.length <= 1) {
      Swal.fire({ icon: "warning", title: "Cannot remove", text: "At least one contact is required" });
      return;
    }
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };






  // Update Emergency Contact
  const updateEmergencyContact = (index, field, value) => {
    const updatedContacts = [...emergencyContacts];
    updatedContacts[index][field] = value;
    setEmergencyContacts(updatedContacts);
  };




  const [searchedBankName, setSearchedBankName] = useState("");
  const [bankNameIsOpen, setBankNameIsOpen] = useState(false);
  const bankNameOptions = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IndusInd Bank",
    "Yes Bank",
    "Federal Bank",
    "IDFC FIRST Bank",
    "South Indian Bank",
    "RBL Bank",
    "UCO Bank",
    "Indian Bank",
    "Central Bank of India",
    "Punjab & Sind Bank",
    "AU Small Finance Bank",
  ];

  const filteredBankNametOptions = bankNameOptions.filter((option) =>
    option.toLowerCase().includes(searchedBankName.toLowerCase())
  );


  const [skillsInputValue, setSkillsInputValue] = useState("");




  const handleSkillsKeyPress = (e) => {
    if (e.key === "Enter" && skillsInputValue.trim()) {
      const trimmedSkill = skillsInputValue.trim();

      if (skills.includes(trimmedSkill)) {
        Swal.fire({
          icon: "warning",
          title: "Duplicate Skill",
          text: "This skill already exists",
        });
        return;
      }

      const updatedSkills = [...skills, trimmedSkill];
      setValue("skills", updatedSkills, { shouldValidate: true });
      setSkillsInputValue("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = skills.filter((s) => s !== skillToDelete);
    setValue("skills", updatedSkills, { shouldValidate: true });
  };

  const [addWorkExperienceModalOpen, setAddWorkExperienceModalOpen] =
    useState(false);
  const [addEducationalInfoModalOpen, setAddEducationalInfoModalOpen] =
    useState(false);
  const [addEmployeeDocumentsModalOpen, setAddEmployeeDocumentModalOpen] =
    useState(false);

  const [isAnimating, setIsAnimating] = useState(false);



  const openWorkExperienceModal = () => {

    if (workExperiences.length > 0) {
      const lastExp = workExperiences[workExperiences.length - 1];
      if (!lastExp.job_title || !lastExp.company_name || !lastExp.from_date || !lastExp.to_date) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Experience',
          text: 'Please complete the previous experience entry first'
        });
        return;
      }
    }

    setAddWorkExperienceModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddWorkExperienceModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddWorkExperienceModalOpen(false), 250); // Matches animation duration
  };



  const openAddEducationInfoModal = () => {
    // Validate if previous education is complete
    if (educationInfo.length > 0) {
      const lastEdu = educationInfo[educationInfo.length - 1];
      if (!lastEdu.schoolName || !lastEdu.departmentName || !lastEdu.period) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Education',
          text: 'Please complete the previous education entry first'
        });
        return;
      }
    }
    setSchoolName("");
    setDepartmentName("");
    setYearOfPassing(null);
    setAddEducationalInfoModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };


  const closeAddEducationInfoModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddEducationalInfoModalOpen(false), 250); // Delay to trigger animation
  };

  const openAddEmployeeDocumentsModal = () => {

    setAddEmployeeDocumentModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeAddEmployeeDocumentsModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddEmployeeDocumentModalOpen(false), 250); // Delay to trigger animation
    setUploadedFiles([]);
  };

  // education info
  const [schoolName, setSchoolName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [yearOfPassing, setYearOfPassing] = useState("");






  const [responsibilityInput, setResponsibilityInput] = useState("");

  const handleAddResponsibility = (e) => {
    if (e.key === "Enter" && responsibilityInput.trim()) {
      e.preventDefault();
      experienceForm.setValue("responsibilities", [
        ...(responsibilities || []),
        responsibilityInput.trim(),
      ]);
      setResponsibilityInput("");
    }
  };

  const handleSaveExperience = (data) => {
    // Convert new entry previous_salary to number
    console.log(data);

    const newData = {
      ...data,
      previous_salary: Number(data.previous_salary), // ensures number
    };

    // Normalize existing workExperiences
    const normalizedList = workExperiences.map(exp => ({
      ...exp,
      previous_salary: Number(exp.previous_salary) || 0, // convert string to number
      responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
    }));

    const newList = [...normalizedList, newData];

    // validate array
    const result = EmployeeExperienceSchema.safeParse(newList);
    console.log(result);

    if (!result.success) {
      console.log(result.error.format());
      return;
    }

    setWorkExperiences(newList);
    experienceForm.reset();
    closeAddWorkExperienceModal();
  };

  const onClickWorkExperienceDelete = (deleteIndex) => {
    const newWorkExperience = workExperiences.filter(
      (_, index) => index !== deleteIndex
    );
    setWorkExperiences(newWorkExperience);
  };



  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);


  const saveUploadedFile = () => {
    setUploadedDocuments((prev) => {
      const documentMap = new Map();

      // Map existing documents with group ID
      prev.forEach((doc) => {
        documentMap.set(doc.title, {
          title: doc.title,
          document_group_id: doc.document_group_id || null, // preserve existing ID
          files: [...(doc.files || [])],
        });
      });

      uploadedFiles.forEach((group) => {
        if (documentMap.has(group.title)) {
          const existingDoc = documentMap.get(group.title);
          documentMap.set(group.title, {
            ...existingDoc,
            files: [...existingDoc.files, ...(group.files || [])],
          });
        } else {
          documentMap.set(group.title, {
            title: group.title,
            document_group_id: null, // new group, no ID yet
            files: group.files || [],
          });
        }
      });

      return Array.from(documentMap.values());
    });

    setIsAnimating(false);
    setTimeout(() => setAddEmployeeDocumentModalOpen(false), 250);
    setUploadedFiles([]);
  };



  const onDrop = (acceptedFiles) => {
    setUploadedFiles((prevFiles) => {
      const filesWithDetails = acceptedFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file: { path: file.path || file.name },
        fileBlob: file,
        preview: URL.createObjectURL(file),
      }));

      const existingGroupIndex = prevFiles.findIndex(
        (group) => group.title === title
      );

      if (existingGroupIndex !== -1) {
        const existingFiles = prevFiles[existingGroupIndex].files;
        const uniqueFiles = filesWithDetails.filter(
          (newFile) =>
            !existingFiles.some(
              (existingFile) => existingFile.file.path === newFile.file.path
            )
        );

        prevFiles[existingGroupIndex].files = [
          ...existingFiles,
          ...uniqueFiles,
        ];
        return [...prevFiles];
      } else {
        return [
          ...prevFiles,
          {
            title: title || "Untitled",
            document_group_id: null, // new group
            files: filesWithDetails,
          },
        ];
      }
    });
    setTitle("");
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    disabled: !title.trim(), // Disable dropzone if title is empty
  });

  const handleDelete = (fileId, groupTitle) => {
    setUploadedFiles(
      (prevFiles) =>
        prevFiles
          .map((group) => {
            if (group.title === groupTitle) {
              return {
                ...group,
                files: group.files.filter((file) => file.id !== fileId),
              };
            }
            return group;
          })
          .filter((group) => group.files.length > 0) // Remove empty groups
    );
  };

  const onClickDocumentDeleteButton = (groupTitle) => {
    setUploadedDocuments((prevDocuments) =>
      prevDocuments.filter((doc) => doc.title !== groupTitle)
    );

    // Optionally track deleted groups for backend
    setDeletedDocumentGroups((prev) => [...prev, groupTitle]);
  };


  useEffect(() => {
    if (
      addEducationalInfoModalOpen ||
      addWorkExperienceModalOpen ||
      addEmployeeDocumentsModalOpen
    ) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [
    addEducationalInfoModalOpen,
    addWorkExperienceModalOpen,
    addEmployeeDocumentsModalOpen,
  ]);


  return (
    <div className="w-screen flex flex-col justify-between min-h-screen bg-gray-100 px-3 md:px-5 pt-2 md:pt-5">

      <div>
        <Mobile_Sidebar />

        {/* breadcrumbs */}
        <div className="flex gap-2 mt-5 text-sm items-center">
          <ToastContainer position="top-right" autoClose={3000} />
          <p
            onClick={() => navigate("/employees")}
            className=" text-gray-500 cursor-pointer "
          >
            Employees
          </p>
          <p>{">"}</p>
          <p className=" text-[#1ea600] ">{editEmployeeData ? "Edit" : "Create"} Employees</p>
          <p>{">"}</p>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row justify-between mt-2 md:mt-5">
            <p className="text-xl md:text-3xl font-semibold ">
              {editEmployeeData ? "Edit" : "Create"}  Employee
            </p>

            <div className="flex flex-col  justify-end">

              <div className="flex justify-end gap-5 ">

                <button
                  onClick={onClickCreateEmployeeCancelButton}
                  className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-2 md:px-5 py-2 font-semibold rounded-[10px] transition-all duration-200"
                >
                  Cancel
                </button>
                <button type="button" onClick={handleSubmit(handleSave, handleError)}
                  className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-2 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200">
                  Save
                </button>
              </div>

              {/* {error && (
                <div className=" text-red-500 text-sm ">
                  {error}
                </div>
              )} */}
            </div>
          </div>

          {/*main flex */}
          <div className="flex flex-col  lg:flex-row gap-3 my-5">
            {/* leftside bar */}
            <div className="basis-[50vw] flex-grow flex flex-col gap-3 ">
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-2 md:py-4 px-4 lg:px-6">
                <div className="flex items-center justify-between flex-wrap">
                  <p className="text-xl font-semibold">Basic Information</p>
                  <div className="flex flex-col items-end">
                    <p className="text-xs md:text-sm mt-3 font-medium">
                      {selectedImage ? "Change Photo" : "Upload Photo"} <span className="text-red-500">*</span>
                    </p>
                    <div className="flex gap-2 mt-1">
                      {/* Upload */}
                      <label
                        htmlFor="file"
                        className="cursor-pointer text-green-600 text-sm"
                      >
                        Upload
                      </label>

                      {/* Camera */}
                      <button
                        type="button"
                        onClick={() => setOpenCamera(true)}
                        className="text-green-600 text-sm"
                      >
                        Camera
                      </button>
                    </div>
                    {errors.profile_image && (
                      <span className="text-red-500 text-sm">{errors.profile_image.message}</span>
                    )}
                  </div>
                </div>

                {openCamera && (
                  <CameraPhoto
                    onCapture={handleCameraCapture}
                    onClose={() => setOpenCamera(false)}
                  />
                )}


                {/* Hidden File Input */}
                <input
                  id="file"
                  type="file"
                  accept="image/*" // Allow only image files
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />


                {/* Display Selected Image */}
                {selectedImage && (
                  <div className="mt-8 flex justify-center sm:justify-end">
                    <img
                      src={
                        typeof selectedImage === "string"
                          ? selectedImage
                          : URL.createObjectURL(selectedImage)
                      }
                      onClick={() => setOpenImageModal(true)}
                      alt="Profile"
                      className="w-36 h-32 object-fill rounded-md cursor-pointer"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-4 mt-4">
                  {/* name */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="FULL NAME"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="w-full lg:w-72">
                      <input
                        id="FULL NAME"
                        type="text"
                        placeholder="Full Name"
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.full_name?.message ? "border-red-500" : "border-gray-300"}`}
                        {...register("full_name")} />
                      <span className="text-red-500 text-sm">{errors.full_name?.message}</span>
                    </div>
                  </div>

                  {/* <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="role"
                      >
                        Role <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="w-full lg:w-72">
                      <select
                        {...register("role_id")}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.role_id?.message ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="" selected disabled>Select A Role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.role_name}
                          </option>
                        ))}
                      </select>
                      <span className="text-red-500 text-sm">{errors.role_id?.message}</span>
                    </div>
                  </div> */}

                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="role"
                      >
                        Role <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="w-full lg:w-72">
                      <Dropdown
                        value={watch("role_id")}
                        options={roles}
                        optionLabel="role_name"
                        optionValue="id"
                        // Convert number id to string here
                        onChange={(e) => setValue("role_id", String(e.value), { shouldValidate: true })}
                        placeholder="Select A Role"
                        filter
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.role_id?.message ? "border-red-500" : "border-gray-300"}`}
                      />


                      <span className="text-red-500 text-sm">{errors.role_id?.message}</span>
                    </div>
                  </div>

                  {/* <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="branches"
                      >
                        Branches <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="w-full lg:w-72">
                      <select
                        {...register("branch_id")}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.branch_id?.message ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="" selected disabled>Select A Branch</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.branch_name}
                          </option>
                        ))}
                      </select>
                      <span className="text-red-500 text-sm">{errors.branch_id?.message}</span>
                    </div>
                  </div> */}

                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="branches"
                      >
                        Branches <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="w-full lg:w-72">
                      <Dropdown
                        value={watch("branch_id")}
                        options={branches}
                        optionLabel="branch_name"
                        optionValue="id"
                        onChange={(e) => setValue("branch_id", String(e.value), { shouldValidate: true })}
                        placeholder="Select A Branch"
                        filter

                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.branch_id?.message ? "border-red-500" : "border-gray-300"}`}
                      />

                      <span className="text-red-500 text-sm">{errors.branch_id?.message}</span>
                    </div>
                  </div>

                  {/* Aadhar No */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="AADHAR NO"
                      >
                        Aadhar No <span className="text-red-500">*</span>
                      </label>
                      {/* <p className="text-sm">Add Aadhar No</p> */}
                    </div>
                    <div className="w-full lg:w-72">
                      <input
                        inputMode="numeric"
                        id="AADHAR NO"
                        type="text"
                        placeholder="Aadhar No"
                        maxLength={12}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 12);
                        }}
                        {...register("aadhaar_no")}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.aadhaar_no?.message ? "border-red-500" : "border-gray-300"}`}
                      />
                      <span className="text-red-500 text-sm">{errors.aadhaar_no?.message}</span>
                    </div>
                  </div>

                  {/* Pan no */}
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm" htmlFor="PAN NO">
                        Pan No <span className="text-red-500">*</span>
                      </label>
                      {/* <p className="text-sm">PAN NO</p> */}
                    </div>
                    <div className="w-full lg:w-72">
                      {/* <input
                        type="text"
                        maxLength={10}
                        onChange={(e) => {
                          e.target.value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "")
                            .slice(0, 10);


                        }}
                        placeholder="Enter PAN NO"
                        {...register("pan_no")}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.pan_no?.message ? "border-red-500" : "border-gray-300"}`}
                      />
                      <span className="text-red-500 text-sm">{errors.pan_no?.message}</span> */}

                      <input
                        type="text"
                        maxLength={10}
                        style={{ textTransform: "uppercase" }}
                        onChange={(e) => {
                          e.target.value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "")
                            .slice(0, 10);
                          setValue("pan_no", value);
                        }}
                        placeholder="Enter PAN NO"
                        {...register("pan_no")}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.pan_no ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      <span className="text-red-500 text-sm">
                        {errors.pan_no?.message}
                      </span>

                    </div>
                  </div>

                  {/* father name */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="FULL NAME"
                      >
                        Father Name <span className="text-red-500">*</span>
                      </label>
                      {/* <p className="text-sm">Add employee father name</p> */}
                    </div>
                    <div className="w-full lg:w-72">
                      <input
                        id="FATHER NAME"
                        type="text"
                        placeholder="Employee Father Name"
                        {...register("father_name")}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.father_name?.message ? "border-red-500" : "border-gray-300"}`}
                      />
                      <span className="text-red-500 text-sm">{errors.father_name?.message}</span>
                    </div>
                  </div>

                  {/*mother name */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="FULL NAME"
                      >
                        Mother Name <span className="text-red-500">*</span>
                      </label>
                      {/* <p className="text-sm">Add employee mother name</p> */}
                    </div>
                    <div className="w-full lg:w-72">
                      <input
                        id="MOTHER NAME"
                        type="text"
                        placeholder="Employee Mother Name"
                        {...register("mother_name")}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.mother_name?.message ? "border-red-500" : "border-gray-300"}`}
                      />
                      <span className="text-red-500 text-sm">{errors.mother_name?.message}</span>
                    </div>
                  </div>

                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div>
                      <label className="font-medium text-sm">
                        Marital Status <span className="text-red-500">*</span>
                      </label>

                    </div>

                    <div className="">
                      <div className="flex gap-4 lg:w-72 justify-start ">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            value="single"
                            {...register("marital_status")}
                          />
                          Single
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            value="married"
                            {...register("marital_status")}
                          />
                          Married
                        </label>
                      </div>

                      {errors.marital_status && (
                        <p className="text-red-500 text-sm">
                          {errors.marital_status.message}
                        </p>
                      )}
                    </div>
                  </div>



                  {/* Show only if Married */}
                  {marital_status === "married" && (
                    <div className="flex flex-col xl:flex-row justify-between gap-1 mt-3">
                      <label className="font-medium text-sm">
                        Spouse Name <span className="text-red-500">*</span>
                      </label>

                      <div className="flex flex-col items-end w-full lg:w-72">
                        <input
                          type="text"
                          placeholder="Spouse Name"
                          {...register("spouse_name")}
                          className={`border-2 rounded-xl ps-4 h-10 outline-none w-full  ${errors.spouse_name ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.spouse_name && (
                          <p className="text-red-500 text-sm ">
                            {errors.spouse_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}


                  {/* Phone*/}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="PHONE NO & EMERGENCY"
                      >
                        Phone No <span className="text-red-500">*</span>
                      </label>
                      {/* <p className="text-sm">Contact number</p> */}
                    </div>
                    <div className="w-full lg:w-72">
                      <input
                        id="PHONE NO "
                        type="text"
                        inputMode="numeric"
                        name="phone_no"
                        maxLength={10}
                        placeholder="000-000-000"
                        {...register("phone_no")}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.phone_no ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.phone_no && <p className="text-red-500 text-sm mt-1">{errors?.phone_no?.message}</p>}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="EMAIL ADDRESS"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      {/* <p className="text-sm">Add employee email</p> */}
                    </div>
                    <div className="w-full lg:w-72">
                      <input
                        type="email"
                        placeholder="@example.com"
                        {...register("email")}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.email ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors?.email?.message}</p>}
                    </div>
                  </div>

                  {/* qualification */}

                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="FULL NAME"
                      >
                        Qualification <span className="text-red-500">*</span>
                      </label>
                      {/* <p className="text-sm">Add employee name</p> */}
                    </div>
                    <div className="w-full lg:w-72">
                      <input
                        id="QUALIFICATION"
                        type="text"
                        placeholder="Employee Qualification"
                        {...register("qualification")}
                        className={`border-2 rounded-xl ps-4 h-10 w-full outline-none ${errors.qualification ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors?.qualification?.message}</p>}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="DATE OF BIRTH"
                      >
                        Date Of Birth <span className="text-red-500">*</span>
                      </label>

                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        className={`border-2 rounded-xl ps-4 h-10 w-full lg:w-72 outline-none ${errors.qualification ? "border-red-500" : "border-gray-300"}`}
                        {...register("date_of_birth")} />
                      {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors?.date_of_birth?.message}</p>}
                    </div>
                  </div>



                  {/* Date of Joining */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="DATE OF BIRTH"
                      >
                        Date Of Joining <span className="text-red-500">*</span>
                      </label>

                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        className={`border-2 rounded-xl ps-4 h-10 w-full lg:w-72 outline-none ${errors.date_of_joining ? "border-red-500" : "border-gray-300"}`}
                        {...register("date_of_joining")}
                        onChange={(e) => {
                          const value = e.target.value;

                          setValue("date_of_joining", value, { shouldValidate: true });

                          fetchEmpId(value);
                        }}
                      />
                      {errors.date_of_joining && <p className="text-red-500 text-sm mt-1">{errors?.date_of_joining?.message}</p>}
                    </div>
                  </div>
                  {/* Date of Joining */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="DATE OF BIRTH"
                      >
                        Employee Id <span className="text-red-500">*</span>
                      </label>

                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        className={`uppercase border-2 rounded-xl ps-4 h-10 w-full lg:w-72 outline-none ${errors.gen_employee_id ? "border-red-500" : "border-gray-300"}`}
                        {...register("gen_employee_id")} />
                      {errors.gen_employee_id && <p className="text-red-500 text-sm mt-1">{errors?.gen_employee_id?.message}</p>}
                    </div>
                  </div>



                  {/* Local Address */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1 mt-3">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm" htmlFor="localAddress">
                        Local Address <span className="text-red-500">*</span>
                      </label>

                    </div>
                    <div className="w-full lg:w-72">
                      <textarea
                        id="localAddress"

                        className={`border-2 rounded-xl p-3 w-full lg:w-72 outline-none ${errors.local_address ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter Local Address"
                        rows={3}
                        {...register("local_address")}
                      >
                      </textarea>
                      {errors.local_address && <p className="text-red-500 text-sm mt-1">{errors?.local_address?.message}</p>}
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="flex flex-col xl:flex-row justify-between gap-1 mt-3">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm" htmlFor="permanentAddress">
                        Permanent Address <span className="text-red-500">*</span>
                      </label>

                    </div>
                    <div className="w-full lg:w-72">
                      <textarea
                        id="permanentAddress"

                        className={`border-2 rounded-xl p-3 w-full lg:w-72 outline-none ${errors.permanent_address ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter Permanent Address"
                        rows={3}
                        {...register("permanent_address")}
                      ></textarea>
                      {errors.permanent_address && <p className="text-red-500 text-sm mt-1">{errors?.permanent_address?.message}</p>}
                    </div>
                  </div>

                </div>

                {/* <hr className="my-5" />

                <p className="text-xl font-semibold">Personal Info</p>

                <div className="flex flex-col gap-4 mt-4">
                  
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="PASSPORT NO."
                      >
                        PASSPORT NO.
                      </label>
                      <p className="text-sm">Add passport No.</p>
                    </div>
                    <input
                      value={employeePassportNumber}
                      onChange={(e) =>
                        setEmployeePassportNumber(e.target.value)
                      }
                      id="PASSPORT NO."
                      type="number"
                      placeholder="Passport No."
                      className="border-2 h-10 rounded-xl ps-4 border-gray-300 outline-none w-full  lg:w-72"
                    />
                  </div>

                </div> */}
              </div>

              {/* pf info */}
              {/* <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6 ">
                <p className="text-xl font-semibold ">PF Info</p>

                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm" htmlFor="UAN NO">
                        UAN NO.
                      </label>
                      <p className="text-sm">Add UAN NO.</p>
                    </div>

                    <input
                      id="UAN NO"
                      type="text"
                      placeholder="UAN No"
                      className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full  lg:w-72"
                    />
                  </div>

                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="PF JOIN DATE"
                      >
                        PF JOIN DATE.
                      </label>
                      <p className="text-sm">dd/mm/yyyy</p>
                    </div>

                    <div className="relative">
                      <DatePicker
                        id="PF JOIN DATE"
                        placeholderText="PF Join Date"
                        className="border-2 rounded-xl h-10 ps-4 border-gray-300 outline-none w-full lg:w-72"
                        selected={pfJoinDate}
                        onChange={(date) => setPfJoinDate(date)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="PF EXP DATE"
                      >
                        PF EXP DATE.
                      </label>
                      <p className="text-sm">dd/mm/yyyy</p>
                    </div>

                    <div className="relative">
                      <DatePicker
                        id="PF EXP DATE"
                        placeholderText="PF  Exp Date"
                        className="border-2 rounded-xl h-10 ps-4 border-gray-300 outline-none w-full lg:w-72"
                        selected={pfExpiryDate}
                        onChange={(date) => setPfExpiryDate(date)}
                      />
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Emergency Contact */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">
                    Emergency Contact <span className="text-red-500">*</span>
                  </p>

                  {/* Add Button */}
                  <IoAddCircleSharp
                    className="text-[#1ea600] text-3xl cursor-pointer"
                    onClick={addEmergencyContact}
                  />
                </div>

                {/* Single error for all emergency contacts */}
                {/* {errors.emergencyContacts && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.emergencyContacts.message ||
                      "Please fill all emergency contact details correctly"}
                  </p>
                )} */}

                {emergencyContacts.map((item, index) => (
                  <div key={index} className="mt-4 p-4 border rounded-xl bg-gray-50 relative">

                    {emergencyContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmergencyContact(index)}
                        className="absolute text-md top-0 right-2 text-red-500 font-medium"
                      >
                        <IoIosCloseCircle />
                      </button>
                    )}

                    {/* Name */}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                      <label className="font-medium text-sm">Full Name</label>
                      <div className="">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={item.name}
                          onChange={(e) => updateEmergencyContact(index, "name", e.target.value)}
                          className="border-2 rounded-xl ps-4 border-gray-300 outline-none h-10 w-full lg:w-72"
                        />
                        {errors.emergencyContacts ? errors.emergencyContacts[index]?.name && <p className="text-red-500 text-sm mt-1">{errors.emergencyContacts[index]?.name.message}</p> : ""}
                      </div>
                    </div>

                    {/* Relation */}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                      <label className="font-medium text-sm">Relation</label>
                      <div className="">
                        <Dropdown
                          value={item.relation || null}
                          options={relationOptions}
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select Relation"
                          filter
                          // showClear
                          className="w-full lg:w-72 h-10 border-2 rounded-xl"
                          onChange={(e) =>
                            updateEmergencyContact(index, "relation", e.value)
                          }
                        />

                        {errors.emergencyContacts ? errors.emergencyContacts[index]?.relation && <p className="text-red-500 text-sm mt-1">{errors.emergencyContacts[index]?.relation.message}</p> : ""}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                      <label className="font-medium text-sm">Phone</label>
                      <div className="">
                        <input
                          type="text"
                          placeholder="Phone"
                          value={item.phone}
                          onChange={(e) => updateEmergencyContact(index, "phone", String(e.target.value))}
                          className="border-2 rounded-xl ps-4 border-gray-300 outline-none h-10 w-full lg:w-72"
                        />
                        {errors.emergencyContacts ? errors.emergencyContacts[index]?.phone && <p className="text-red-500 text-sm mt-1">{errors.emergencyContacts[index]?.phone.message}</p> : ""}
                      </div>
                    </div>

                  </div>
                ))}

                {/* <button
                  type="button"
                  onClick={addEmergencyContact}
                  className="mt-4 bg-[#1ea600] text-white px-4 py-2 rounded-xl"
                >
                  + Add Contact
                </button> */}
              </div>




              {/* education info */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white px-5 lg:px-3 py-4">
                <p className="text-md md:text-xl font-semibold">Education Info</p>

                {errors.education && (
                  <div className="mt-2">
                    {errors.education.map((error, idx) => (
                      <p key={idx} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                )}

                {/* List Education Info */}
                <div className="mt-2 md:mt-5">
                  {educationList.map((info, index) => (
                    <div key={index} className="flex justify-between">
                      <div className="px-2 flex flex-col">
                        <p className="font-semibold">{info.school_name}</p>
                        <p className="text-sm text-gray-500">{info.department_name}</p>
                        <p className="text-sm text-gray-500">
                          {info.year_of_passing}
                        </p>
                        <hr className="my-3" />

                      </div>

                      <IoClose
                        onClick={() =>
                          setEducationList((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="text-red-500 text-2xl cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Add Work Education */}
                <div
                  onClick={openAddEducationInfoModal}
                  className="flex items-center gap-4 mt-3 cursor-pointer"
                >
                  <IoAddCircleSharp className="text-[#1ea600] text-3xl" />
                  <p className="font-medium">Add education info</p>
                </div>
              </div>
            </div>

            {/* rightside bar */}
            <div className=" flex flex-grow basis-[30vw]  flex-col gap-3 ">
              {/* Portal Login information */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                <p className="text-xl font-semibold">Portal Login Information</p>

                <div className="flex flex-col gap-3 mt-4">

                  {/* Official Email */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                    <label className="font-medium text-sm">
                      Official Email <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col w-full lg:w-52">
                      <input
                        type="email"
                        placeholder="Enter official email"
                        className={`border-2 h-10 rounded-xl ps-4 outline-none ${errors.offical_email ? "border-red-500" : "border-gray-300"
                          }`}
                        {...register("offical_email")}
                      />

                      {/* reserved space */}
                      <p className="text-red-500 text-sm min-h-[20px] mt-1">
                        {errors.offical_email?.message || ""}
                      </p>
                    </div>
                  </div>

                  {/* Password */}
                  {!id?.length > 0 && (
                    <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                      <label className="font-medium text-sm">
                        Password <span className="text-red-500">*</span>
                      </label>

                      <div className="flex flex-col w-full lg:w-52">
                        <input
                          type="password"
                          placeholder="Enter password"
                          className={`border-2 h-10 rounded-xl ps-4 outline-none ${errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                          {...register("password")}
                        />

                        {/* reserved space */}
                        <p className="text-red-500 text-sm min-h-[20px] mt-1">
                          {errors.password?.message || ""}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Bank information */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                <p className="text-xl font-semibold">Bank Information</p>

                <div className="flex flex-col gap-3 mt-4">

                  {/* BANK NAME */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                    <label className="font-medium text-sm">
                      Bank Name <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col w-full lg:w-52">
                      <input
                        type="text"
                        placeholder="Enter acc name"
                        className={`border-2 h-10 rounded-xl ps-4 outline-none ${errors.bank_name ? "border-red-500" : "border-gray-300"
                          }`}
                        {...register("bank_name")}
                      />


                      <p className="text-red-500 text-sm min-h-[20px] mt-1">
                        {errors.bank_name?.message || ""}
                      </p>
                    </div>


                  </div>

                  {/* BANK ACCOUNT NO */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                    <label className="font-medium text-sm">
                      Bank Account No. <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col w-full lg:w-52">
                      <input
                        type="number"
                        placeholder="Enter acc number"
                        className={`border-2 h-10 rounded-xl ps-4 outline-none ${errors.bank_account_no ? "border-red-500" : "border-gray-300"
                          }`}
                        {...register("bank_account_no")}
                      />

                      <p className="text-red-500 text-sm min-h-[20px] mt-1">
                        {errors.bank_account_no?.message || ""}
                      </p>
                    </div>
                  </div>

                  {/* IFSC CODE */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                    <label className="font-medium text-sm">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col w-full lg:w-52">
                      <input
                        type="text"
                        placeholder="Enter IFSC code"
                        className={`border-2 h-10 rounded-xl ps-4 outline-none ${errors.ifsc_code ? "border-red-500" : "border-gray-300"
                          }`}
                        {...register("ifsc_code")}
                      />

                      <p className="text-red-500 text-sm min-h-[20px] mt-1">
                        {errors.ifsc_code?.message || ""}
                      </p>
                    </div>
                  </div>

                  {/* BANK BRANCH */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                    <label className="font-medium text-sm">
                      Bank Branch <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col w-full lg:w-52">
                      <input
                        type="text"
                        placeholder="Enter Bank branch"
                        className={`border-2 h-10 rounded-xl ps-4 outline-none ${errors.bank_branch ? "border-red-500" : "border-gray-300"
                          }`}
                        {...register("bank_branch")}
                      />

                      <p className="text-red-500 text-sm min-h-[20px] mt-1">
                        {errors.bank_branch?.message || ""}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* salary information */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                <p className="text-xl font-semibold">Salary Information</p>

                <div className="flex flex-col gap-3 mt-4">

                  {/* SALARY BASIS */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                    <label className="font-medium text-sm">
                      Salary Basis <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col w-full lg:w-52">
                      <input
                        type="number"
                        placeholder="Enter salary basis"
                        className={`border-2 h-10 rounded-xl ps-4 outline-none ${errors.salary_basis ? "border-red-500" : "border-gray-300"
                          }`}
                        {...register("salary_basis")}
                      />

                      <p className="text-red-500 text-sm min-h-[20px] mt-1">
                        {errors.salary_basis?.message || ""}
                      </p>
                    </div>
                  </div>

                  {/* SALARY AMOUNT */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                    <label className="font-medium text-sm">
                      Salary Amount <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col w-full lg:w-52">
                      <input
                        type="number"
                        placeholder="Enter Salary Per Month"
                        className={`border-2 h-10 rounded-xl ps-4 outline-none ${errors.salary_amount ? "border-red-500" : "border-gray-300"
                          }`}
                        {...register("salary_amount")}
                      />

                      <p className="text-red-500 text-sm min-h-[20px] mt-1">
                        {errors.salary_amount?.message || ""}
                      </p>
                    </div>
                  </div>

                  {/* EFFECTIVE DATE */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                    <label className="font-medium text-sm">
                      Effective Date <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col w-full lg:w-52">
                      <input
                        type="date"
                        placeholder="Enter Salary Start Date"
                        className={`border-2 h-10 rounded-xl ps-4 outline-none ${errors.effective_date ? "border-red-500" : "border-gray-300"
                          }`}
                        {...register("effective_date")}
                      />

                      <p className="text-red-500 text-sm min-h-[20px] mt-1">
                        {errors.effective_date?.message || ""}
                      </p>
                    </div>
                  </div>

                  {/* PAYMENT TYPE */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-between items-start">
                    <label className="font-medium text-sm">
                      Payment Type <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col w-full lg:w-52">
                      <div
                        className={`border-2 rounded-xl ps-4 h-10 flex items-center ${errors.payment_type ? "border-red-500" : "border-gray-300"
                          }`}
                      >
                        <select
                          {...register("payment_type")}
                          className="w-full outline-none border-none bg-transparent"
                        >
                          <option value="">Select Payment type</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="UPI">UPI</option>
                          <option value="Cash in hand">Cash In Hand</option>
                        </select>
                      </div>

                      <p className="text-red-500 text-sm min-h-[20px] mt-1">
                        {errors.payment_type?.message || ""}
                      </p>
                    </div>
                  </div>

                </div>
              </div>


              {/* experience */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                <p className="text-xl font-semibold">Experience</p>

                {errors.experience && (
                  <div className="mt-2">
                    {errors.experience.map((error, idx) => (
                      <p key={idx} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                )}

                {workExperiences.map((experience, index) => (
                  <div
                    key={index}
                    className="flex items-start  justify-between mt-4 border rounded-lg p-4 bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold">Job Title : {experience.job_title}</p>
                      <p>Company Name : {experience.company_name}</p>
                      <p>Salary : {experience.previous_salary}</p>
                      <p>Industry : {experience.company_industry}</p>


                      <p>
                        {experience.from_date} - {experience.to_date}
                      </p>
                      <ul className="mt-2">
                        Responsibility : {experience.responsibilities.map((res, idx) => (
                          <li key={idx} className="flex items-center">
                            <p className="">
                              {" "}
                              <GoDotFill className="mr-2  inline-flex" />
                              {res}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onClickWorkExperienceDelete(index)}
                      className="text-xl text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <div
                  onClick={openWorkExperienceModal}
                  className="flex gap-3 font-medium cursor-pointer items-center mt-5"
                >
                  <IoAddCircleSharp className="text-[#1ea600] text-3xl" />
                  <p>Add work experience</p>
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                <p className="text-xl font-semibold">Skills</p>

                <div className="bg-gray-100 p-4 rounded-xl mt-3">
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    className="w-full  rounded-md bg-gray-100 h-5 border-none outline-none"
                    value={skillsInputValue}
                    onChange={(e) => setSkillsInputValue(e.target.value)}
                    onKeyPress={handleSkillsKeyPress}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white text-gray-800 px-2 py-1 rounded-full"
                      >
                        <span className="mr-2">{skill}</span>
                        <button
                          className="text-black hover:text-red-600"
                          onClick={() => handleDeleteSkill(skill)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>

                </div>

                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors?.skills?.message}</p>}
              </div>

              {/* Document Section */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                <p className="text-xl font-semibold">Documents</p>

                {/* Display Uploaded Files Outside Modal */}
                <div className="mt-4">
                  <ul className="list-disc space-y-2">
                    {uploadedDocuments.map((docGroup) => (
                      <li
                        key={docGroup.title}
                        className="flex flex-col text-sm border-2 border-green-600 rounded-2xl px-4 py-3"
                      >
                        <div className="w-full flex justify-between items-center">
                          <p className="text-gray-500 font-medium">Title: {docGroup.title}</p>
                          {/* Delete entire group */}
                          <p
                            className="text-red-500 cursor-pointer"
                            onClick={() => onClickDocumentDeleteButton(docGroup.title)}
                          >
                            x
                          </p>
                        </div>

                        {docGroup.files && docGroup.files.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {docGroup.files.map((file) => (
                              <div
                                key={file.id}
                                className="w-full flex justify-between items-center"
                              >
                                <button
                                  className="text-[#1ea600] hover:text-green-700"
                                  onClick={() => {
                                    if (file.preview) {
                                      window.open(file.preview, "_blank");
                                    } else {
                                      alert("Preview not available");
                                    }
                                  }}
                                >
                                  {file.file.path}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>Unknown file</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  onClick={openAddEmployeeDocumentsModal}
                  className="flex gap-3 items-center font-medium mt-5 cursor-pointer"
                >
                  <IoAddCircleSharp className="text-[#1ea600] text-3xl" />
                  <p>Add employee documents</p>
                </div>
              </div>

              {/* verification doc */}
              <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                <p className="text-xl font-semibold">Verification Doc</p>
                <div className="flex gap-5 flex-wrap items-center mt-5">
                  {verifications.map((item, index) => (
                    <div key={item.type} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={item.status === "1"}
                        onChange={(e) => {
                          const updated = [...verifications];
                          updated[index].status = e.target.checked ? "1" : "0";
                          setVerifications(updated);
                        }}
                        id={item.type}
                      />
                      <label className="font-medium" htmlFor={item.type}>{item.type}</label>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Modal for Larger Image */}
        {openImageModal && (
          <div
            className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center"
            onClick={() => setOpenImageModal(false)} // Close modal on overlay click
          >
            <div className="relative">
              <img
                src={selectedImage}
                alt="Full Size"
                className="max-w-full h-[70vh] object-contain"
              />
              <button
                className="absolute top-2 right-2 bg-white rounded-full px-3 py-1"
                onClick={() => setOpenImageModal(false)} // Close modal on button click
              >
                Close
              </button>
            </div>
          </div>
        )}

        {addEducationalInfoModalOpen && (
          <div className="fixed inset-0 top-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0"
              onClick={closeAddEducationInfoModal}
            ></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-scroll w-[90vw] md:w-[70vw] bg-white shadow-lg px-5 md:px-16 py-5 md:py-10 transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <div
                className="w-6 h-6 rounded-full border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddEducationInfoModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="flex flex-wrap flex-col md:flex-row justify-between">
                <p className="text-3xl font-medium mt-2 md:mt-8">Education Info</p>
                <div className="flex justify-end gap-5 mt-4 md:mt-8">
                  <button
                    onClick={closeAddEducationInfoModal}
                    className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button type="button"
                    onClick={educationForm.handleSubmit(handleSaveEducationInfo)}
                    className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 md:mt-8">
                {/* School Name */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="school-name"
                    >
                      School Name
                    </label>

                  </div>
                  <div className="">
                    <input
                      type="text"
                      id="school-name"
                      placeholder="School name"
                      className="border-2 rounded-xl ps-4 py-2 border-gray-300 outline-none h-10 w-full md:w-96"
                      {...educationForm.register("school_name")}
                    />
                    {educationForm.formState.errors.school_name && (
                      <p className="text-red-500 text-sm">
                        {educationForm.formState.errors.school_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Department Name */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="department-name"
                    >
                      Department Name
                    </label>

                  </div>
                  <div className="">
                    <input
                      type="text"
                      id="department-name"
                      placeholder="Department name"
                      className="border-2 rounded-xl px-4 py-2 border-gray-300 outline-none h-10 w-full md:w-96"
                      {...educationForm.register("department_name")}
                    />
                    {educationForm.formState.errors.department_name && (
                      <p className="text-red-500 text-sm">
                        {educationForm.formState.errors.department_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Period of Year */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="yearofpassing"
                    >
                      Year Of Passing
                    </label>

                  </div>

                  <div className="year-picker">

                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      {...educationForm.register("year_of_passing")}
                      className="border-2 rounded-xl px-4 py-2 h-10 w-full md:w-96 border-gray-300 outline-none"
                    />


                    {educationForm.formState.errors.year_of_passing && (
                      <p className="text-red-500 text-sm">
                        {educationForm.formState.errors.year_of_passing.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {addWorkExperienceModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm  z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 "
              onClick={closeAddWorkExperienceModal}
            ></div>
            <div
              className={`fixed top-0 right-0 h-full overflow-y-scroll w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg px-5 md:px-16 py-5 md:py-10 transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <div
                className="w-6 h-6 rounded-full  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddWorkExperienceModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="flex flex-col md:flex-row justify-between ">
                <p className="text-3xl font-medium mt-2 md:mt-8">Experience</p>
                <div className="flex gap-5 justify-end mt-4 md:mt-8">
                  <button
                    onClick={closeAddWorkExperienceModal}
                    className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={experienceForm.handleSubmit(handleSaveExperience)}
                    className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                  >
                    Save
                  </button>

                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2 md:mt-8">
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col ">
                    <label className="font-medium text-sm" htmlFor="jobTitle">
                      Job Title
                    </label>

                  </div>
                  <div className="">
                    <input
                      type="text"
                      id="jobTitle"
                      {...experienceForm.register("job_title")}
                      placeholder="Enter job title"
                      className="border-2 rounded-xl ps-4 py-2 h-10 border-gray-300 outline-none w-full md:w-96"
                    />
                    {experienceForm.formState.errors.job_title && (
                      <p className="text-red-500 text-sm">
                        {experienceForm.formState.errors.job_title.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="companyIndustry"
                    >
                      Company's Industry
                    </label>

                  </div>
                  <div className="">
                    <input
                      type="text"
                      {...experienceForm.register("company_industry")}
                      id="companyIndustry"
                      placeholder="Information Technology"
                      className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full md:w-96"
                    />
                    {experienceForm.formState.errors.company_industry && (
                      <p className="text-red-500 text-sm">
                        {experienceForm.formState.errors.company_industry.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="companyName"
                    >
                      Company Name
                    </label>

                  </div>
                  <div className="">
                    <input
                      {...experienceForm.register("company_name")}
                      type="text"
                      id="companyName"
                      placeholder="Company name"
                      className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full md:w-96"
                    />
                    {experienceForm.formState.errors.company_name && (
                      <p className="text-red-500 text-sm">
                        {experienceForm.formState.errors.company_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="previousSalary"
                    >
                      Previous Salary
                    </label>

                  </div>
                  <div className="">
                    <input
                      {...experienceForm.register("previous_salary")}
                      type="number"
                      id="previousSalary"
                      placeholder="Previous salary"
                      className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full md:w-96"
                    />
                    {experienceForm.formState.errors.previous_salary && (
                      <p className="text-red-500 text-sm">
                        {experienceForm.formState.errors.previous_salary.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="periodOfWork"
                    >
                      Period Of Work
                    </label>

                  </div>
                  <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-96">
                    <div className="w-full md:w-[50%]">
                      <input
                        {...experienceForm.register("from_date")}
                        type="date"
                        id="startWork"
                        placeholder="Start work"
                        className="border-2 w-full rounded-xl px-3 h-10 text-gray-400  border-gray-300 outline-none"
                      />
                      {experienceForm.formState.errors.from_date && (
                        <p className="text-red-500 text-sm">
                          {experienceForm.formState.errors.from_date.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-[50%]">
                      <input
                        {...experienceForm.register("to_date")}
                        type="date"
                        id="endWork"
                        placeholder="End work"
                        className="border-2 w-full rounded-xl px-3 h-10 text-gray-400 border-gray-300 outline-none"
                      />
                      {experienceForm.formState.errors.to_date && (
                        <p className="text-red-500 text-sm">
                          {experienceForm.formState.errors.to_date.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="responsibilities"
                    >
                      Responsiblilities
                    </label>

                  </div>

                  <div className="">
                    <div className=" border-2 border-gray-300 rounded-2xl  w-full md:w-96">
                      <input
                        type="text"
                        placeholder="Add responsibility and press Enter"
                        value={responsibilityInput}
                        onChange={(e) => setResponsibilityInput(e.target.value)}
                        onKeyDown={handleAddResponsibility}
                        className="w-full  h-10 rounded-md px-3 mt-3  border-none outline-none"
                      />
                      <ul className="mt-2">
                        {responsibilities.map((res, index) => (
                          <div key={index} className="flex items-start justify-between pe-5">
                            <li>
                              <p>
                                <GoDotFill className="mr-2 inline-flex" />
                                {res}
                              </p>
                            </li>
                            <button
                              type="button"
                              onClick={() => {
                                const newRes = responsibilities.filter((_, i) => i !== index);
                                experienceForm.setValue("responsibilities", newRes);
                              }}
                              className="ml-2 text-red-500"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </ul>

                    </div>
                    {experienceForm.formState.errors.responsibilities && (
                      <p className="text-red-500 text-sm">
                        {experienceForm.formState.errors.responsibilities.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-3xl font-medium mt-8">
                  Verification Process
                </p>

                <div className="flex mt-5 gap-5">
                  <div className="flex gap-2">
                    <input type="checkbox" name="" id="payslip1" onChange={(e) =>
                      experienceForm.setValue(
                        "verification_documents.0.payslip1",
                        e.target.checked ? 1 : 0
                      )
                    } />
                    <label htmlFor="payslip1">Payslip 1</label>
                  </div>

                  <div className="flex gap-2">
                    <input type="checkbox" name="" id="payslip2" onChange={(e) =>
                      experienceForm.setValue(
                        "verification_documents.0.payslip2",
                        e.target.checked ? 1 : 0
                      )
                    } />
                    <label htmlFor="payslip2">Payslip 2</label>
                  </div>

                  <div className="flex gap-2">
                    <input type="checkbox" name="" id="payslip3" onChange={(e) =>
                      experienceForm.setValue(
                        "verification_documents.0.payslip3",
                        e.target.checked ? 1 : 0
                      )
                    } />
                    <label htmlFor="payslip3">Payslip 3</label>
                  </div>
                </div>

                <div className="flex gap-2 mt-5">
                  <input type="checkbox" name="" id="appointment_letter" onChange={(e) =>
                    experienceForm.setValue(
                      "verification_documents.0.appointment_letter",
                      e.target.checked ? 1 : 0
                    )
                  } />
                  <label htmlFor="appointment_letter">Last Company Appointment Letter</label>
                </div>

                <div className="flex gap-2 mt-5">
                  <input type="checkbox" name="" id="experience_letter" onChange={(e) =>
                    experienceForm.setValue(
                      "verification_documents.0.experience_letter",
                      e.target.checked ? 1 : 0
                    )
                  } />
                  <label htmlFor="experience_letter">Last Company Experience Letter</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {addEmployeeDocumentsModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
            <div
              className="absolute inset-0"
              onClick={closeAddEmployeeDocumentsModal}
            ></div>

            <div
              className={`fixed top-0 right-0 h-full  overflow-y-scroll w-[90vw] md:w-[70vw] bg-white  px-5 md:px-16 py-5 md:py-10 transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <div
                className="w-6 h-6 rounded-full  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddEmployeeDocumentsModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="flex flex-wrap md:flex-nowrap justify-between items-center">
                <p className="text-3xl font-medium mt-2 md:mt-8">Documents</p>
                <div className="flex text-right gap-3 mt-2 md:mt-8">
                  <button
                    onClick={closeAddEmployeeDocumentsModal}
                    className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveUploadedFile}
                    className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
              {/* Title Input */}
              <div className="flex flex-col lg:flex-row gap-1  justify-between mt-8">
                <div className="flex flex-col">
                  <label className="font-medium text-sm" htmlFor="school-name">
                    Enter Title
                  </label>

                </div>
                <input
                  type="text"
                  id="school-name"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-2 rounded-xl px-4 py-2 border-gray-300 outline-none w-full md:w-96"
                />
              </div>
              {/* Drag and Drop Area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed mt-5 rounded-lg py-10 px-5 text-center ${isDragActive ? "border-[#1ea600]" : "border-gray-300"
                  } ${!title.trim() ? "opacity-50 pointer-events-none" : ""}`} // Visual indicator when disabled
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-[#1ea600]">Drop Your Files Here...</p>
                ) : (
                  <div className="text-gray-500">
                    <IoCloudUploadOutline className="text-6xl text-[#1ea600] mx-auto" />
                    <p className="mt-3">
                      Drag & Drop Files Here, Or{" "}
                      <span className="text-[#1ea600] underline cursor-pointer">
                        Browse
                      </span>
                    </p>
                    <p>Supported Formats: JPEG, PNG, PDF</p>
                    {!title.trim() && (
                      <p className="text-red-500 mt-2">
                        Enter a title to enable file upload.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5">
                {uploadedFiles.length > 0 ? (
                  <div>
                    {uploadedFiles.map((group) => (
                      <div key={group.title} className="mb-4">
                        <p className="font-medium text-lg text-gray-700">
                          {group.title}
                        </p>
                        <ul className="list-disc space-y-2 ml-4">
                          {group.files.map((fileWrapper) => (
                            <li
                              key={fileWrapper.id}
                              className="flex items-center justify-between text-sm border-2 border-green-600 rounded-2xl px-4 py-3"
                            >
                              <div>
                                <button
                                  className="text-[#1ea600] hover:text-green-700"
                                  onClick={() =>
                                    window.open(fileWrapper.preview, "_blank")
                                  }
                                >
                                  {fileWrapper.file.path}
                                </button>
                              </div>
                              <MdDeleteForever
                                className="text-2xl text-red-400 hover:text-red-600 cursor-pointer"
                                onClick={() =>
                                  handleDelete(fileWrapper.id, group.title)
                                }
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No documents uploaded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CreateEmployee_Mainbar;