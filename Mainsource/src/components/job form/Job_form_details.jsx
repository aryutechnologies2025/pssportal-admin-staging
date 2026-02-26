import React, { useState, useEffect, useMemo } from "react";
// import DataTable from "datatables.net-react";
// import DT from "datatables.net-dt";
// import "datatables.net-responsive-dt/css/responsive.dataTables.css";
// DataTable.use(DT);
import Loader from "../Loader";
import {
  FaEye,
  FaStickyNote,
  FaSearch,
  FaFilter,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import ReactDOM from "react-dom";
import Footer from "../Footer";
import { TfiPencilAlt } from "react-icons/tfi";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import 'primereact/resources/themes/lara-light-blue/theme.css';   // Theme
import 'primereact/resources/primereact.min.css';                 // Core CSS
import 'primeicons/primeicons.css';                               // Icons
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { use } from "react";
import { FaFileExport } from "react-icons/fa6";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";
import customise from "../../assets/customise.svg";
import { FiSearch } from "react-icons/fi";
import { useRef } from "react";
import { IoIosArrowForward } from 'react-icons/io';


const Job_form_details = () => {
    const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  console.log("filteredRoles", filteredRoles);
  const [loading, setLoading] = useState(true);
  // const [errors, setErrors] = useState("");
  // States for remarks modal
  const [remarks, setRemarks] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  console.log("Selected Student:", selectedStudent);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkTitle, setRemarkTitle] = useState("");
  const [remarksList, setRemarksList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // console.log("remarksList", remarksList);
  const [loadingRemarks, setLoadingRemarks] = useState(false);
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [editingRemarkTitle, setEditingRemarkTitle] = useState("");
  const [searchRemark, setSearchRemark] = useState("");
  const [remarkSaving, setRemarkSaving] = useState(false);

  // States for view modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  // States for filters

  const [appliedFilters, setAppliedFilters] = useState({
    from_date: "",
    to_date: "",
    reference: "",
    district: "",
    gender: "",
  });

  const [filterType, setFilterType] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [filterStartDate, setFilterStartDate] = useState(today);
  const [filterEndDate, setFilterEndDate] = useState(today);

  //   const [filterStartDate, setFilterStartDate] = useState("");
  // const [filterEndDate, setFilterEndDate] = useState("");


  // console.log("fgilter", filterStartDate, filterEndDate)
  const [showFilters, setShowFilters] = useState(false);

  // Stats state
  const [remarksStats, setRemarksStats] = useState(null);

  //page
  const [page, setPage] = useState(1);
  // console.log("page...... : ", page)
  const limit = 10;
  const [rows, setRows] = useState(10);
  // console.log("rows........ : ", rows)
  const [totalRecords, setTotalRecords] = useState(0);
  // console.log("totalRecords...... : ", totalRecords)
  const [globalFilter, setGlobalFilter] = useState("");
  const [load, setLoad] = useState(true)

  const multiSelectRef = useRef(null);

  useEffect(() => {
    setLoad(globalFilter ? false : true)
  }, [globalFilter])


  const [isRemarksSubmitting, setIsRemarksSubmitting] = useState(false);

  const [reference, setReference] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [genders, setGenders] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");


  const [selectedReference, setSelectedReference] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  console.log("Selected Gender....... : ", selectedGender);

  // const referenceOptions = [
  //   ...new Set(reference?.map(item => item.reference))
  // ].map(ref => ({ label: ref, value: ref }));

//   const referenceOptions = reference?.map(item => ({
//   label: item.full_name,
//   value: item.id,   
// }),{label: "other", value:"other"});

const referenceOptions = [
  ...(reference?.map(item => ({
    label: item.full_name,
    value: item.id,
  })) || []),
  { label: "Other", value: "other" },
];
  console.log("referenceOptions",referenceOptions)
  
  const districtOptions = [
    ...new Set(districts?.map(item => item.district))
  ].map(dist => ({ label: dist, value: dist }));

  // console.log("reference", reference)
  const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);

  };

    const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };

  const fetchRemarksById = async (id) => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}api/job-form/show/${id}`
      );
      return res.data?.data?.remarks || [];
    } catch {
      return [];
    }
  };


  const exportToCSV = async () => {
    try {
      //  fetch ALL data (no pagination)
      const response = await axiosInstance.get(`${API_URL}api/job-form/list`, {
        params: {
          from_date: filterStartDate || "",
          to_date: filterEndDate || "",
          reference: selectedReference || "",
          district: selectedDistrict || "",
          gender: selectedGender || "",
          limit: 10000, //  large number OR backend ignore pagination
          page: 1,
          export: true // optional (backend can use)
        }
      });

      if (!response.data.success) {
        toast.error("Failed to export data");
        return;
      }

      const listData = response.data.data;

      //  Fetch remarks for each student
      const allData = await Promise.all(
        listData.map(async (item) => {
          const remarks = await fetchRemarksById(item.id);
          return {
            ...item,
            remarks,
          };
        })
      );
      generateCSV(allData);
    } catch (error) {
      console.error(error);
      toast.error("Error exporting CSV");
    }
  };

  // const generateCSV = (data) => {
  //   const csvHeader = [
  //     "S.No",
  //     "Full Name",
  //     "Aadhar Number",
  //     "Email",
  //     "Contact",
  //     "Gender",
  //     "City",
  //     "District",
  //     "Education",
  //     "Major",
  //     "Marital Status",
  //     "Date of Birth",
  //     "Reference",
  //     "Registered On",
  //     "Remarks",
  //   ];

  //   const csvRows = [
  //     csvHeader.join(","),
  //     ...data.map((item, index) => {
  //       const remarks =
  //         item.remarks && item.remarks.length > 0
  //           ? `${item.remarks.length} remarks: ` +
  //           item.remarks.map(r => r.notes).join(" | ")
  //           : "-";

  //       return [
  //         index + 1, //  S.No
  //         item.name || "-",
  //         item.aadhar_number || "-",
  //         item.email_id || "-",
  //         item.contact_number || "-",
  //         item.gender || "-",
  //         item.city || "-",
  //         item.district || "-",
  //         item.education || "-",
  //         item.major || "-",
  //         item.marital_status || "-",
  //         formatToDDMMYYYY(item.date_of_birth) || "-",
  //         item.reference || "-",
  //         item.created_at ? formatToDDMMYYYY(item.created_at) : "-",
  //         remarks,
  //       ]
  //         .map(val => `"${val}"`)
  //         .join(",");
  //     }),
  //   ];

  //   const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  //   const encodedUri = encodeURI(csvContent);

  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "job_form_all.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };


const generateCSV = (data) => {
  // Remove non-export columns
  const selectedFields = visibleColumnFields.filter(
    (f) => !["actions", "remarks"].includes(f)
  );

  // S.No always first
  const exportFields = ["sno", ...selectedFields.filter(f => f !== "sno")];

  // Headers
  const headers = exportFields.map(
    (field) => allColumns.find((c) => c.field === field)?.header
  );

  // Rows
  const rows = data.map((item, index) =>
    exportFields
      .map((field) =>
        `"${columnMap[field]?.(item, index) ?? "-"}"`
      )
      .join(",")
  );

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows].join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "job_form_all.csv";
  link.click();
};



  const handleReset = () => {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    setFilterStartDate(today);
    setFilterEndDate(today);
    setSelectedReference("");
    setSelectedDistrict("");
    setSelectedGender("");
    setPage(1); // optional but recommended

    //  force fetch AFTER state update
    setTimeout(() => {
      fetchRoles();
    }, 0);
  };

  // const resetFilters = () => {
  //   setFilterStartDate("");
  //   setFilterEndDate("");
  //   setSelectedReference("");
  //   setSelectedDistrict("");
  //   setSelectedGender("");
  //   setPage(1);

  //   // API reset
  //   setAppliedFilters({
  //     from_date: "",
  //     to_date: "",
  //     reference: "",
  //     district: "",
  //     gender: "",
  //   });

  //   setPage(1);
  // };

  const resetFilters = () => {
  const today = new Date().toISOString().split("T")[0]; // Get current date
  
  setFilterStartDate(today);
  setFilterEndDate(today);
  setSelectedReference("");
  setSelectedDistrict("");
  setSelectedGender("");
  setPage(1);

  // API reset
  // setAppliedFilters({
  //   from_date: today, 
  //   to_date: today,    
  //   reference: "",
  //   district: "",
  //   gender: "",
  // });

  setPage(1);
};
  useEffect(() => {
    fetchRoles();
  }, [appliedFilters, rows, page]);


  useEffect(() => {
    if (!showRemarkModal && selectedStudent) {
      // Refresh 
      fetchRemarks(selectedStudent.id);
    }
  }, [showRemarkModal]);

  // useEffect(() => {

  //   setFilteredRoles(roles);
  // }, [roles]);

  const fetchRoles = async () => {
    try {

      setLoading(true);

      // const response = await axiosInstance.get(`${API_URL}api/job-form/list`, {
      //   params: {
      //     from_date:emptyParams ? "" : filterStartDate,
      //     to_date:  emptyParams ? "" : filterEndDate,
      //     reference: emptyParams ? "" : selectedReference,
      //     district: emptyParams ? "" : selectedDistrict,
      //     gender: emptyParams ? "" : selectedGender,
      //     page,
      //     limit: rows, // rows = limit
      //   },
      // });

      const response = await axiosInstance.get(`${API_URL}api/job-form/list`, {
        params: {
          // ...appliedFilters,
          // page,
          // limit: rows,
           
        from_date: filterStartDate || today,
        to_date: filterEndDate || today,
        reference: selectedReference || "",
        district: selectedDistrict || "",
        gender: selectedGender || "",
        page,
        limit: rows,
   
        },
      });
      console.log("fetchRole Response : ", response)
      if (response.data.success) {

        const studentsWithStats = response.data.data.map((student) => ({

          ...student,
          remarkCount: Number(student.remarks_count) || 0,
          remarks: student.remarks || null,
          lastRemarkDate:
            student.remarks && student.remarks.length > 0
              ? new Date(student.remarks[student.remarks.length - 1].created_date ||
                student.remarks[student.remarks.length - 1].date)
              : null,
        }));
        setRoles(studentsWithStats);

        setFilteredRoles(studentsWithStats);
        setTotalRecords(Number(response.data.totalCount) || 0);
        setReference(response.data?.reference)
        setDistricts(response.data?.district)
        setGenders(response.data?.gender)
        const meta = response.data.meta;
        setPage(meta.current_page);
        setRows(meta.per_page);
        setTotalRecords(meta.total);
      } else {
        setErrors("Failed To Fetch Students.");
        toast.error("Failed To Fetch Students");
      }
    } catch (err) {
      setErrors("Failed To Fetch Students.");

    } finally {
      setLoading(false);
    }
  };



  // const applyFilters = () => {
  //   setAppliedFilters({
  //     from_date: filterStartDate || "",
  //     to_date: filterEndDate || "",
  //     reference: selectedReference || "",
  //     district: selectedDistrict || "",
  //     gender: selectedGender || "",
  //   });

  //   setPage(1);
  // };

  

  const applyFilters = () => {
  const today = new Date().toISOString().split("T")[0];
  
  setAppliedFilters({
    from_date: filterStartDate || today,  // If empty, use today
    to_date: filterEndDate || today,      // If empty, use today
    reference: selectedReference || "",
    district: selectedDistrict || "",
    gender: selectedGender || "",
  });


  setPage(1);
};


  const capitalizeWords = (text) => {
    if (!text) return "";
    return text
      .toString()
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleView = async (id) => {
    try {
      setShowModal(true);
      setViewLoading(true);

      const response = await axiosInstance.get(
        `${API_URL}api/job-form/show/${id}`
      );

      console.log(".....view Response.....", response);

      if (response.data?.success) {
        setSelectedUser(response.data.data);
      } else {
        toast.error("Failed to fetch details");
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setShowModal(false);
    } finally {
      setViewLoading(false);
    }
  };


  const sortRemarks = (list = []) =>
    [...list].sort(
      (a, b) => new Date(b.created_date) - new Date(a.created_date)
    );


  // Handle opening remarks modal

  const handleRemarkClick = async (row) => {
    setSelectedStudent(row);
    setRemarkTitle("");
    setEditingRemarkId(null);
    setShowRemarkModal(true);
    await fetchRemarks(row.id);
  };

  // fetch remarks - get
  const fetchRemarks = async (parentId) => {
    setLoadingRemarks(true);
    try {
      const res = await axiosInstance.get(
        `${API_URL}api/remarks/list/${parentId}`
      );
      console.log("List API Response for fetchremrks......", res);

      if (res.data.success) {
        const remarks = res.data.data || [];
        const sortedRemarks = sortRemarks(remarks);

        setRemarksList(sortedRemarks);


        setRoles((prev) =>
          prev.map((row) => {
            if (row.id === parentId) {
              const hasRemarks = remarks.length > 0;
              return {
                ...row,
                remarkCount: remarks.length,
                remarks: hasRemarks ? remarks : null,
                lastRemarkDate: hasRemarks
                  ? (remarks[0].created_date || remarks[0].created_at || remarks[0].date || null)
                  : null
              };
            }
            return row;
          })

        );

      } else {
        setRemarksList([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching remarks");
    } finally {
      setLoadingRemarks(false);
    }
  };


  // Handle saving new remark
  const handleAddRemark = async () => {
    if (!remarkTitle.trim()) {
      toast.error("Please enter a remark");
      return;
    }

    try {
      setRemarkSaving(true);

      const res = await axiosInstance.post(
        `${API_URL}api/remarks/store`,
        {
          parent_id: selectedStudent.id,
          notes: remarkTitle,
        }
      );

      console.log("POST API Response.....: ", res);

      if (res.data.success) {
        const newRemark = res.data.data;

        //  update modal list instantly
        setRemarksList(prev => sortRemarks([newRemark, ...prev]));

        //  update table instantly for remark color change
        setRoles(prev =>
          prev.map(row =>
            row.id === selectedStudent.id
              ? {
                ...row,
                remarkCount: (row.remarkCount || 0) + 1,
                remarks: row.remarks
                  ? [newRemark, ...row.remarks]
                  : [newRemark],
                lastRemarkDate:
                  newRemark.created_date ||
                  newRemark.created_at ||
                  newRemark.date ||
                  new Date(),
              }
              : row
          )
        );

        setRemarkTitle("");
        toast.success("Remark added successfully");

      }
    } catch (err) {
      toast.error("Error while adding remark");
    } finally {
      setRemarkSaving(false);
    }
  };


  const handleEditClick = (remark) => {
    setEditingRemarkId(remark.id);
    setEditingRemarkTitle(remark.notes); // show old text
  };


  // Handle editing remark
  const handleUpdateRemark = async () => {
    if (!editingRemarkTitle.trim()) {
      toast.error("Please enter a remark");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post(
        `${API_URL}api/remarks/update/${editingRemarkId}`,
        { notes: editingRemarkTitle }
      );

      if (res.data.success) {
        toast.success("Remark updated");

        setRemarksList((prev) =>
          sortRemarks(
            prev.map((remark) =>
              remark.id === editingRemarkId
                ? { ...remark, notes: editingRemarkTitle }
                : remark
            )
          )
        );
        setEditingRemarkId(null);
        setEditingRemarkTitle("");
        fetchRemarks(selectedStudent.id);

      } else {
        toast.error("Failed to update remark");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while updating remark");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Handle deleting remark
  const handleDeleteRemark = async (id) => {
    try {
      const res = await axiosInstance.delete(
        `${API_URL}api/remarks/delete/${id}`
      );

      if (res.data.success) {
        toast.success("Remark deleted");


        const updatedRemarksList = remarksList.filter((r) => r.id !== id);
        setRemarksList(updatedRemarksList);

        // Update table data
        setRoles((prev) =>
          prev.map((row) => {
            if (row.id === selectedStudent.id) {
              const updatedRemarks = (row.remarks || []).filter((r) => r.id !== id);
              return {
                ...row,
                remarkCount: updatedRemarks.length,
                remarks: updatedRemarks.length > 0 ? updatedRemarks : null,
                lastRemarkDate: updatedRemarks.length > 0
                  ? (updatedRemarks[0].created_date || updatedRemarks[0].created_at || updatedRemarks[0].date || null)
                  : null
              };
            }
            return row;
          })
        );

      } else {
        toast.error("Failed to delete remark");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while deleting remark");
    }
  };


  // Handle search in remarks
  const handleSearchRemarks = async () => {
    if (!searchRemark.trim()) {
      // If search is empty, reload all remarks
      const response = await axiosInstance.get(
        `${API_URL}api/student/${selectedStudent._id}/remarks`
      );
      if (response.data.success) {
        setRemarksList(response.data.remarks || []);
      }
      return;
    }

    try {
      const response = await axiosInstance.get(
        `${API_URL}api/student/${selectedStudent._id}/remarks/search`,
        { params: { keyword: searchRemark } }
      );

      if (response.data.success) {
        setRemarksList(sortRemarks(response.data.remarks));
      }
    } catch (error) {
      console.error("Error Searching Remarks:", error);
      toast.error("Error Searching Remarks");
    }
  };



  // Get unique cities for filter
  const uniqueCities = [
    ...new Set(roles.map((student) => student.city).filter(Boolean)),
  ];

  // Delete
  const deleteInterviewStatus = (selectedStudent) => {
    // console.log("selectedStudent", selectedStudent)  
    Swal.fire({
      title: "Are  You Sure?",
      text: "Do You Want To Delete This Profile?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Delete It!",


    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`${API_URL}api/job-form/delete/${selectedStudent.id}`)
          .then((response) => {
            // if (response.data) {
            setTimeout(() => toast.success("Profile Has Been Deleted."), 300)
            fetchRoles();


            // } else {
            //   Swal.fire("Error!", "Failed To Delete Profile.", "error");
            // }
          })
          .catch((error) => {
            console.error("Error deleting Profile:", error);
            Swal.fire("Error!", "Failed To Delete Profile.", "error");
          });
      }
    });
  };

  //date format
  const formatToDDMMYYYY = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months start from 0
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}.${minutes}`;
  };

  const formatIndianDateTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 → 12

    const hourFormatted = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} ${hourFormatted}:${minutes} ${ampm}`;
  };




  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});


  // Open edit modal with row data
  const openEditModal = (rowData) => {
    setEditFormData({
      ...rowData,
      _id: rowData._id || '',
      name: rowData.name || '',
      aadhar_number: rowData.aadhar_number || '',
      email_id: rowData.email_id || '',
      contact_number: rowData.contact_number || '',
      gender: rowData.gender || '',
      city: rowData.city || '',
      district: rowData.district || '',
      education: rowData.education || '',
      major: rowData.major || '',
      marital_status: rowData.marital_status || '',
      date_of_birth: rowData.date_of_birth || '',
      reference: rowData.reference || '',
      createdAt: rowData.createdAt || ''
    });
    setErrors({});
    setIsEditModalOpen(true);
    setIsAnimating(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setEditFormData({});
      setErrors({});
    }, 500);
  };

  // Handle form field changes
  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!editFormData.name?.trim()) {
      newErrors.name = "Full Names Is Required";
    }

    if (!editFormData.aadhar_number?.trim()) {
      newErrors.aadhar_number = "Aadhar Number Is Required";
    } else if (!/^\d{10}$/.test(editFormData.aadhar_number.replace(/\D/g, ''))) {
      newErrors.aadhar_number = "Aadhar Number Must Be 12 Digits";
    }

    if (!editFormData.email_id?.trim()) {
      newErrors.email_id = "Email Is Required";
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email_id)) {
      newErrors.email_id = "Email Is Invalid";
    }

    if (!editFormData.contact_number?.trim()) {
      newErrors.contact_number = "Contact Number Is Required";
    } else if (!/^\d{10}$/.test(editFormData.contact_number.replace(/\D/g, ''))) {
      newErrors.contact_number = "Contact Number Must Be 10 Digits";
    }

    if (!editFormData.gender) {
      newErrors.gender = "Gender Is Required";
    }

    if (!editFormData.city?.trim()) {
      newErrors.city = "City Is Required";
    }

    if (!editFormData.district?.trim()) {
      newErrors.district = "District Is Required";
    }

    if (!editFormData.education) {
      newErrors.education = "Education Is Required";
    }

    if (!editFormData.marital_status) {
      newErrors.marital_status = "Marital Status Is Required";
    }

    if (!editFormData.date_of_birth) {
      newErrors.date_of_birth = "Date Of Birth Is Required";
    } else {
      const dob = new Date(editFormData.date_of_birth);
      const today = new Date();
      if (dob >= today) {
        newErrors.date_of_birth = "Date Of Birth Must Be In The Past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleEditSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      //  API call
      const updatedData = {
        ...editFormData,
        _id: editFormData._id,
        name: capitalizeWords(editFormData.name.trim()),
        aadhar_number: editFormData.aadhar_number.trim(),
        email_id: editFormData.email_id.trim().toLowerCase(),
        contact_number: editFormData.contact_number.trim(),
        city: capitalizeWords(editFormData.city.trim()),
        district: capitalizeWords(editFormData.district.trim()),
        major: capitalizeWords(editFormData.major?.trim() || '')
      };

      // Call  API 

      // const response = await updateRegistration(editFormData.id, updatedData);

      // Show success message
      toast.success("Registration Updated Successfully!");

      // Refresh data or update state
      // fetchRoles(); 

      closeEditModal();
    } catch (error) {
      console.error("Error Updating Registration:", error);
      toast.error("Failed To Update Registration");
    }
  };

const columnMap = {
  sno: (_, index) => index + 1,
  name: (item) => capitalizeWords(item.name),
  aadhar_number: (item) => item.aadhar_number,
  email_id: (item) => item.email_id,
  contact_number: (item) => item.contact_number,
  gender: (item) => item.gender,
  city: (item) => item.city,
  district: (item) => item.district,
  education: (item) => item.education,
  major: (item) => item.major,
  marital_status: (item) => item.marital_status,
  date_of_birth: (item) => formatToDDMMYYYY(item.date_of_birth),
  reference: (item) => item.reference,
  created_at: (item) => formatToDDMMYYYY(item.created_at),
};



  {/* ................. for prime react table  .......... */ }
  const allColumns = [
  {
  header: "S.No",
  field: "sno",   //  MUST
  body: (rowData, options) => options.rowIndex + 1,
  style: { textAlign: "center", width: "80px", fontWeight: "medium" },
  fixed: true    
},


    {
      header: "Name",
      field: "name",
      body: (row) => capitalizeWords(row.name),
      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" }
    },
    {
      header: "Aadhar Number",
      field: "aadhar_number",

      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" }
    },

    {
      header: "Email",
      field: "email_id",
      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" }
    },

    {
      header: "Contact",
      field: "contact_number",
      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" }
    },

    {
      header: "Gender",
      field: "gender",
      body: (row) => capitalizeWords(row.gender),
      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" }
    },

    {
      header: "City",
      field: "city",
      body: (row) => capitalizeWords(row.city),
      style: { textAlign: "center" }
    },
    {
      header: "District",
      field: "district",
      body: (row) => capitalizeWords(row.district),
      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" }
    },
    {
      header: "Education",
      field: "education",
      body: (row) => capitalizeWords(row.education),
      style: { textAlign: "center" }
    },
    {
      header: "Major",
      field: "major",
      body: (row) => capitalizeWords(row.major),
      style: { textAlign: "center" }
    },
    {
      header: "Marital Status",
      field: "marital_status",
      body: (row) => capitalizeWords(row.marital_Status),
      style: { textAlign: "center" }
    },
    {
      header: "DOB",
      field: "date_of_birth",
      body: (row) => capitalizeWords(row.date_of_birth),
      style: { textAlign: "center" }
    },
    {
      header: "Refrerred By",
      field: "reference",
      body: (row) => capitalizeWords(row.reference || "-"),
      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" }
    },

    {
      header: "Register On",
      field: "created_at",
      body: (row) => formatToDDMMYYYY(row.created_at),
      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" },
      fixed: true
    },

    {
      field: "remarks",
      header: "Remarks",

      body: (row) => {

        const actualRemarksCount = row.remarkCount || 0;
        const hasRemarks = actualRemarksCount > 0;

        return (
          <div className="flex justify-center">
            <FaStickyNote
              className={`cursor-pointer text-lg transition-colors ${hasRemarks
                ? "text-red-600 hover:text-[#1ea600]"
                : "text-gray-400 hover:text-gray-600"
                }`}
              title={
                hasRemarks
                  ? `${actualRemarksCount} Remark${actualRemarksCount !== 1 ? "s" : ""}`
                  : "Add remark"
              }
              onClick={() => handleRemarkClick(row)}
            />
          </div>
        );
      },

      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" },
      fixed: true

    },

    {
      header: "Actions",
      body: (row) => (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handleView(row.id)}
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>
          {/* 
          <TfiPencilAlt
            className="cursor-pointer text-green-600 text-center"
            onClick={() => openEditModal(row)}
          /> */}

          <button
            onClick={() => deleteInterviewStatus(row)}
            className="p-2 bg-[#FFD1D1] text-[#DC2626] hover:bg-[#FFE2E2] rounded-[10px] "
          >
            <MdOutlineDeleteOutline />
          </button>
        </div>
      ),
      style: { textAlign: "center", fontWeight: "medium", fontStyle: "popins" },
      fixed: "true",
    }
  ];

  const [visibleColumnFields, setVisibleColumnFields] = useState(
    allColumns.filter(col => col.fixed || ["name", "contact_number", "email_id", "reference", "district", "gender"].includes(col.field)).map(col => col.field)
  );

  const onColumnToggle = (event) => {
    let selectedFields = event.value;
    const fixedFields = allColumns.filter(col => col.fixed).map(col => col.field);
    const validatedSelection = Array.from(new Set([...fixedFields, ...selectedFields]));

    setVisibleColumnFields(validatedSelection);
  };
  const dynamicColumns = useMemo(() => {
    return allColumns.filter(col => visibleColumnFields.includes(col.field));
  }, [visibleColumnFields]);



  return (
    <div className="flex  flex-col justify-between bg-gray-50  px-3 md:px-5 pt-2 md:pt-10 w-full  min-h-screen overflow-x-auto">
      {/* <ToastContainer position="top-right" autoClose={3000}  /> */}

      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className=" cursor-pointer ">
              <Mobile_Sidebar />
            </div>

            {/* Breadcrumb */}
            <div className="flex gap-1 items-center mt-2 md:mt-0  cursor-pointer ">
              {/* <p
                className="text-xs md:text-sm text-gray-500 hover:text-green-500 transition-colors font-semibold"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p className="text-gray-400">{">"}</p> */}
              <p className="text-xs md:text-sm  text-[#1ea600] cursor-pointer">Job Form</p>
              <p className="text-[#1ea600]">{">"}</p>
            </div>

            {/* Header */}
            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto  rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]  px-2 py-2 md:px-6 md:py-6 ">
              {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                                
                               
                                <div className="w-full md:w-auto space-y-3">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by name, email, contact, or city..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <FaFilter className="text-gray-600" />
                                            <span className="hidden md:inline">Filters</span>
                                        </button>
                                    </div>
                                    
                                    {showFilters && (
                                        <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border">
                                            <select
                                                value={genderFilter}
                                                onChange={(e) => setGenderFilter(e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">All Genders</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            
                                            <select
                                                value={cityFilter}
                                                onChange={(e) => setCityFilter(e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">All Cities</option>
                                                {uniqueCities.map(city => (
                                                    <option key={city} value={city.toLowerCase()}>
                                                        {capitalizeWords(city)}
                                                    </option>
                                                ))}
                                            </select>
                                            
                                            <button
                                                onClick={() => {
                                                    setGenderFilter("all");
                                                    setCityFilter("all");
                                                    setSearchTerm("");
                                                }}
                                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div> */}

              {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 "> */}
              {/* date filter */}
              {/* <div className="flex flex-col md:flex-row md:items-center  gap-3 ">
                  <div className="flex items-center gap-2">
                    <lable>Start Date:</lable>
                    <input
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      className="px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <lable>End Date:</lable>
                    <input
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      className="px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-[20%]">
                    <label className="font-medium">Reference:</label>

                    <select
                      value={selectedReference}
                      onChange={(e) => setSelectedReference(e.target.value)}
                      className="px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select Reference</option>

                      {reference?.map((item, index) => (
                        <option key={index} value={item.reference}>
                          {item.reference}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      applyFilters(); // Apply filters
                    }}
                    className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#33cd10] font-medium w-20 rounded-2xl"
                  >
                    Submit
                  </button>

                  <button
                    onClick={() => {

                      setFilterStartDate("");
                      setFilterEndDate("");

                      applyFilters(); // Load all data again
                    }}
                    className="bg-gray-300 text-gray-800 px-2 md:px-3 py-2 font-medium w-20 rounded-2xl"
                  >
                    Reset
                  </button>
                </div> */}

              {/* <div className="bg-white  w-full rounded-2xl shadow-md p-4 md:p-6"> */}
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5  gap-4 items-end">

                  {/* Start Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-[#7C7C7C] text-sm focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div>

                  {/* End Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-[#7C7C7C] text-sm focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div>

                  {/* Reference */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Reference
                    </label>

                    <Dropdown
                      value={selectedReference}
                      options={referenceOptions}
                      onChange={(e) => setSelectedReference(e.value)}
                      placeholder="All References"
                      filter
                      className=" rounded-md border border-[#D9D9D9] text-[#7C7C7C] text-sm focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div>


                  {/* district */}

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      District
                    </label>
                    <Dropdown
                      value={selectedDistrict}
                      options={districtOptions}
                      onChange={(e) => setSelectedDistrict(e.value)}
                      placeholder="All Districts"
                      filter
                      className=" rounded-md border border-[#D9D9D9] text-[#7C7C7C] text-sm focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />

                  </div>

                  {/* gender */}

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Gender
                    </label>

                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-[#7C7C7C] text-sm focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>


                    </select>
                  </div>
                </div>



                {/* Submit Button */}
                <div className="w-full flex gap-4 items-end justify-end">
                  <button
                    onClick={applyFilters}
                    className="px-2 md:px-3 py-2 h-10 rounded-lg bg-[#1ea600] text-white font-medium w-20  hover:bg-[#33cd10] transition "

                  >
                    Apply
                  </button>
                  <button
                    onClick={resetFilters
                      // () => {
                      //  setFilterType("");
                      // setFilterStartDate("");
                      // setFilterEndDate("");
                      // setSelectedReference("");
                      // setSelectedDistrict("");
                      // setSelectedGender("");
                      // fetchRoles("emptyParams");
                      // }
                    }
                    className="px-2 md:px-3 py-2 h-10 rounded-lg bg-gray-100 text-[#7C7C7C] font-medium w-20 hover:bg-gray-200 transition"


                  >
                    Reset
                  </button>

                </div>


              </div>


            </div>
            <div className="flex flex-col w-full mt-1 md:mt-6 h-auto  rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] d px-3 py-3 md:px-6 md:py-6 ">

              <div className="flex flex-col lg:flex-row lg:items-center  md:justify-between gap-3 mb-4">
                <div className="flex flex-col lg:flex-row lg:items-center md:justify-between gap-7 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-semibold text-base text-[#6B7280] border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]">Show</span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({ label: v, value: v }))}
                      onChange={(e) => onRowsChange(e.value)}

                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className="text-sm text-[#6B7280]">Entries Per Page</span>
                  </div>

                  <div className="relative inline-block">
                    <MultiSelect
                      ref={multiSelectRef}
                      value={visibleColumnFields}
                      options={allColumns}
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
             w-full md:w-40 px-3 py-2 
             border border-gray-300 rounded-md 
             cursor-pointer text-[#7c7c7c]
             hover:bg-gray-100 transition-all text-sm"
                    >
                      Customize
                      <img src={customise} alt="columns" className="w-5 h-5" />
                    </p>


                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between  gap-5 md:mb-4">
                  {/* Search box */}
                  <div className="relative md:w-64">
                    <FiSearch
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <InputText
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}

                      placeholder="Search......"
                      className="w-40 md:w-full pl-10 pr-3 py-2 text-sm rounded-md border border-[#D9D9D9] 
               focus:outline-none focus:ring-2 focus:ring-[#1ea600] placeholder:text-[#7C7C7C]  "

                    />
                  </div>

                  <div className="">
                    <button
                      onClick={exportToCSV}
                      className="hidden md:flex items-center gap-2 bg-[#7C7C7C] hover:bg-[#9C9C9C] text-white font-medium px-4 py-2 rounded-md "
                    >
                      + Export CSV
                      <FaFileExport />
                    </button>
                  </div>

                </div>
              </div>
              <div className="flex md:hidden justify-end ">
                    <button
                      onClick={exportToCSV}
                      className="flex md:hidden items-center gap-2 bg-[#7C7C7C] hover:bg-[#9C9C9C] text-white font-medium px-4 py-2 rounded-md "
                    >
                      + Export CSV
                      <FaFileExport />
                    </button>
                  </div>

              {/* <div className="flex flex-col w-full mt-1 md:mt-5 h-auto  rounded-2xl bg-white shadow-lg px-3 py-3 md:px-6 md:py-6 "> */}


              <div className="table-scroll-container my-3" id="datatable">
                <DataTable
                  value={filteredRoles}
                  paginator
                  lazy={load}
                  // rows={10}
                  first={(page - 1) * rows}
                  rows={rows}
                  totalRecords={totalRecords}
                  onPage={onPageChange}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  // loading={loading}
                  globalFilter={globalFilter}
                  responsiveLayout="scroll"
                  emptyMessage="No data found"
                  className="display nowrap bg-white shadow-lg"
                  showGridlines
                  resizableColumns
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                  paginatorClassName="custom-paginator"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                >
                  {/* Render only selected columns */}
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


            {/* View User Details Modal */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                {/* Overlay */}
                <div
                  className="absolute inset-0 z-40"
                  onClick={() => setShowModal(false)}
                ></div>

                {/* Modal Content */}
                <div className="relative z-50 bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden overflow-y-auto p-2">

                  {viewLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <p className="text-gray-500">Loading details...</p>
                    </div>
                  ) : selectedUser ? (
                    <>

                      {/* Modal Header */}
                      <div className="flex justify-between items-center p-6 border-b">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            {capitalizeWords(selectedUser.name)}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {selectedUser.email_id}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowModal(false)}
                          className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          ×
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className="p-6  max-h-[calc(90vh-120px)] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              Full Name
                            </label>
                            <p className="text-gray-800">{selectedUser.name}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              Aadhar Number
                            </label>
                            <p className="text-gray-800">{selectedUser.aadhar_number}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium  text-gray-500">
                              Email
                            </label>
                            <p className="text-gray-800 break-all">{selectedUser.email_id}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              Contact
                            </label>
                            <p className="text-gray-800">
                              {selectedUser.contact_number}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              Gender
                            </label>
                            <p className="text-gray-800">
                              {capitalizeWords(selectedUser.gender)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              City
                            </label>
                            <p className="text-gray-800">
                              {capitalizeWords(selectedUser.city)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              District
                            </label>
                            <p className="text-gray-800">
                              {capitalizeWords(selectedUser.district)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              Education
                            </label>
                            <p className="text-gray-800">
                              {selectedUser?.education}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              Major
                            </label>
                            <p className="text-gray-800">{selectedUser.major}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              Marital Status
                            </label>
                            <p className="text-gray-800">
                              {selectedUser.marital_status}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              Date of Birth
                            </label>
                            <p className="text-gray-800">
                              {/* {selectedUser.date_of_birth} */}
                              {formatToDDMMYYYY(selectedUser.date_of_birth)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">
                              Reference
                            </label>
                            <p className="text-gray-800">
                              {selectedUser.reference || "N/A"}
                            </p>
                          </div>

                          <div className="space-y-1 ">
                            <label className="text-sm font-medium text-gray-500">
                              Registered On
                            </label>
                            <p className="text-gray-800">
                              {/* {new Date(selectedUser.createdAt).toLocaleString("en-IN")} */}
                              {formatIndianDateTime(selectedUser.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1 mt-6">
                          <label className="text-sm font-medium text-gray-500">Remarks</label>

                          {Array.isArray(selectedUser.remarks) && selectedUser.remarks.length > 0 ? (
                            <ul className="space-y-4">
                              {[...selectedUser.remarks]
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((item, index) => (
                                  <li
                                    key={item.id}
                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                  >
                                    {/* Title */}
                                    <p className="font-semibold text-gray-800">
                                      {index + 1}. Title: {item.notes}
                                    </p>

                                    {/* Created By */}
                                    <p className="text-sm text-gray-700 ml-5 mt-1">
                                      <span className="font-medium">Created By:</span>{" "}
                                      {item.addedBy || "Admin"}
                                    </p>

                                    {/* Date */}
                                    <p className="text-sm text-gray-600 ml-5">
                                      <span className="font-medium">Date:</span>{" "}
                                      {formatIndianDateTime(item.created_date || item.created_at)}
                                    </p>
                                  </li>
                                ))}
                            </ul>

                          ) : (
                            <p className="text-gray-800">No Remarks</p>
                          )}
                        </div>



                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center items-center py-20">
                      <p className="text-red-500">No data found</p>
                    </div>
                  )}
                </div>
              </div>

            )}



            {/* Remarks Modal */}
            {showRemarkModal && selectedStudent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setShowRemarkModal(false)}
                ></div>

                <div className=" bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative ">

                  {/* Header */}
                  <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800">
                        <FaStickyNote className="inline mr-2 text-[#1ea600]" />
                        Remarks For {capitalizeWords(selectedStudent.name)}
                      </h2>
                      {/* <div className="flex flex-wrap gap-4 mt-2">
                                                <span className="text-sm text-gray-600">
                                                    Email: {selectedStudent.email_id}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    Contact: {selectedStudent.contact_number}
                                                </span>
                                                {remarksStats && (
                                                    <span className="text-sm text-blue-600 font-medium">
                                                        Total: {remarksStats.totalRemarks} remarks
                                                    </span>
                                                )}
                                            </div> */}
                    </div>
                    <button
                      onClick={() => {
                        setShowRemarkModal(false);
                        setRemarkTitle("");
                        // setRemarksList([]);
                        setEditingRemarkId(null);
                        // setSearchRemark("");

                        setRoles(prev =>
                          prev.map(row =>
                            row.id === selectedStudent.id
                              ? {
                                ...row,
                                remarkCount: remarksList.length, // Update remark count
                              }
                              : row
                          )
                        );
                      }}

                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-white rounded-full transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  {/* Input Section */}
                  {/* ADD REMARK */}
                  {!editingRemarkId && (
                    <div className="p-6 border-b">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Add Remark
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={remarkTitle}
                          onChange={(e) => setRemarkTitle(e.target.value)}
                          placeholder="Enter remark..."
                          className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1ea600]"
                          onKeyDown={(e) => e.key === "Enter" && handleAddRemark()}
                        />

                        <button
                          onClick={handleAddRemark}
                          disabled={isSubmitting}
                          className="px-6 py-3 rounded-lg text-white bg-[#1ea600]"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}


                  {/* edit remark */}
                  {/* Input Section */}


                  {editingRemarkId && (
                    <div className="p-6 border-b bg-yellow-50">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Edit Remark
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingRemarkTitle}
                          onChange={(e) => setEditingRemarkTitle(e.target.value)}
                          placeholder="Edit remark..."
                          className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                          onKeyDown={(e) => e.key === "Enter" && handleUpdateRemark()}
                        />

                        <button
                          onClick={handleUpdateRemark}
                          disabled={isSubmitting}
                          className="px-6 py-3 rounded-lg text-white bg-yellow-500"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => {
                            setEditingRemarkId(null);
                            setEditingRemarkTitle("");
                          }}
                          className="px-4 py-3 border rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}



                  {/* Remarks List */}
                  {/* <div className="p-6 overflow-y-auto max-h-[calc(90vh-350px)]"> */}
                  <div className="flex flex-col max-h-[70vh] overflow-y-auto scrollbar-stable">

                    <div className="flex justify-between items-center mb-4 p-6 pb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        View Remarks ({remarksList.length})
                      </h3>
                    </div>

                    {loadingRemarks ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1ea600] border-t-[#1ea600] mx-auto"></div>
                        <p className="mt-3 text-gray-600">Loading Remarks...</p>
                      </div>
                    ) : remarksList.length === 0 ? (
                      <div className="text-center py-8">
                        <FaStickyNote className="text-gray-300 text-5xl mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No Remarks Yet</p>
                      </div>
                    ) : (
                      <div className="px-6 pb-6 space-y-4">
                        {remarksList.map((remark, index) => (
                          <div
                            key={remark.id || index}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="text-gray-800 text-lg font-medium">
                                  {remark.notes}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <FaCalendarAlt />
                                    {formatToDDMMYYYY(remark.created_date || remark.created_at || remark.date)}
                                  </span>

                                  {/* {remark.addedBy && (
                                    <span className="text-xs text-[#1ea600] bg-blue-50 px-2 py-1 rounded">
                                      By: {remark.addedBy}
                                    </span>
                                  )} */}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleEditClick(remark)}
                                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteRemark(remark.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* edit form */}
            {isEditModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div className="absolute inset-0" onClick={closeEditModal}></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Close Modal"
                    onClick={closeEditModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="p-2 md:p-5 ">
                    <p className="text-2xl md:text-3xl font-medium">Edit Registration Details</p>

                    {/* Full Name */}
                    <div className="mt-5 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="text"
                          value={editFormData.name || ""}
                          onChange={(e) => handleEditChange("name", e.target.value)}
                          placeholder="Enter full name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                      </div>
                    </div>

                    {/* Aadhar Number */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Aadhar Number <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="number"
                          value={editFormData.aadhar_number || ""}
                          onChange={(e) => handleEditChange("aadhar_number", e.target.value)}
                          placeholder="Enter Aadhar Number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.aadhar_number && (
                          <p className="text-red-500 text-sm mt-1">{errors.aadhar_number}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="email"
                          value={editFormData.email_id || ""}
                          onChange={(e) => handleEditChange("email_id", e.target.value)}
                          placeholder="Enter email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.email_id && (
                          <p className="text-red-500 text-sm mt-1">{errors.email_id}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Contact <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="tel"
                          value={editFormData.contact_number || ""}
                          onChange={(e) => handleEditChange("contact_number", e.target.value)}
                          placeholder="Enter contact number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.contact_number && (
                          <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
                        )}
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <Dropdown
                          value={editFormData.gender || ""}
                          onChange={(e) => handleEditChange("gender", e.value)}
                          options={[
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                            { label: "Other", value: "Other" }
                          ]}
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select Gender"
                          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1ea600] border ${errors.gender ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.gender && (
                          <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                        )}
                      </div>
                    </div>

                    {/* City */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="text"
                          value={editFormData.city || ""}
                          onChange={(e) => handleEditChange("city", e.target.value)}
                          placeholder="Enter city"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                    </div>

                    {/* District */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="text"
                          value={editFormData.district || ""}
                          onChange={(e) => handleEditChange("district", e.target.value)}
                          placeholder="Enter district"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.district && (
                          <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                        )}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Education <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <Dropdown
                          value={editFormData.education || ""}
                          onChange={(e) => handleEditChange("education", e.value)}
                          options={[
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
                          ]}
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select Education"
                          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1ea600] border ${errors.education ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.education && (
                          <p className="text-red-500 text-sm mt-1">{errors.education}</p>
                        )}
                      </div>
                    </div>

                    {/* Major */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Major
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="text"
                          value={editFormData.major || ""}
                          onChange={(e) => handleEditChange("major", e.target.value)}
                          placeholder="Enter major/course"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                      </div>
                    </div>

                    {/* Marital Status */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Marital Status <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <Dropdown
                          value={editFormData.marital_status || ""}
                          onChange={(e) => handleEditChange("marital_status", e.value)}
                          options={[
                            { label: "Single", value: "Single" },
                            { label: "Married", value: "Married" },

                          ]}
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select Marital Status"
                          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1ea600] border ${errors.marital_status ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.marital_status && (
                          <p className="text-red-500 text-sm mt-1">{errors.marital_status}</p>
                        )}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="date"
                          value={editFormData.date_of_birth || ""}
                          onChange={(e) => handleEditChange("date_of_birth", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.date_of_birth && (
                          <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
                        )}
                      </div>
                    </div>

                    {/* Reference */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Reference
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="text"
                          value={editFormData.reference || ""}
                          onChange={(e) => handleEditChange("reference", e.target.value)}
                          placeholder="Enter reference"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                      </div>
                    </div>

                    {/* Registered On (Readonly) */}
                    <div className="mt-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <label className="block text-md font-medium mb-2">
                        Registered On
                      </label>
                      <div className="w-full md:w-[60%]">
                        <input
                          type="text"
                          value={editFormData.createdAt ? formatIndianDateTime(editFormData.createdAt) : ""}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-8 md:mt-12">
                      <button
                        onClick={closeEditModal}
                        className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-[#1ea600] hover:bg-[#1b7507] text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                        onClick={handleEditSubmit}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Job_form_details;