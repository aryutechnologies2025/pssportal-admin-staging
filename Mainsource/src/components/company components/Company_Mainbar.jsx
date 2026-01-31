import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TfiPencilAlt } from "react-icons/tfi";
import ReactDOMServer from "react-dom/server";
import { RiDeleteBin6Line } from "react-icons/ri";
import aryu_logo from "../../assets/aryu_logo.svg";
// import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
  IoIosCloseCircle,
} from "react-icons/io";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { API_URL } from "../../Config";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { FiSearch } from "react-icons/fi";
import axiosInstance from "../../axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
import { FaEye } from "react-icons/fa6";
import { IoAddCircleSharp } from "react-icons/io5";
import { Capitalise } from "../../hooks/useCapitalise.jsx";

const Company_Mainbar = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [companies, setCompanies] = useState([]);
  // console.log("companies", companies);
  const [allCompanies, setAllCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [target, setTarget] = useState("");
  const [website, setWebsite] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [isEditAnimating, setIsEditAnimating] = useState(false);
  const [contacts, setContacts] = useState([
    { name: "", role: "", phone_number: "" },
  ]);
  const [shifts, setShifts] = useState([
    { company_shift_id: "", shift_name: "", start_time: "", end_time: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const statusOptions = [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [companyNameEdit, setCompanyNameEdit] = useState("");
  const [addressEdit, setAddressEdit] = useState("");
  const [gstNumberEdit, setGstNumberEdit] = useState("");
  const [websiteEdit, setWebsiteEdit] = useState("");
  const [phoneEdit, setPhoneEdit] = useState("");
  const [supportEmailEdit, setSupportEmailEdit] = useState("");
  const [billingEmailEdit, setBillingEmailEdit] = useState("");
  const [contactsEdit, setContactsEdit] = useState([
    { name: "", role: "", phone_number: "" },
  ]);
  const [notesEdit, setNotesEdit] = useState("");
  const [statusEdit, setStatusEdit] = useState("");

  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  console.log("viewRow", viewRow);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  const [mode, setMode] = useState("");
  const [automaticName, setAutomaticName] = useState("");

  const [editFormData, setEditFormData] = useState({
    companyName: "",
    address: "",
    gstNumber: "",
    website: "",
    target: "",
    phone: "",
    supportEmail: "",
    billingEmail: "",
    contacts: [],
    shifts: [],
    notes: "",
    status: "",
    automaticName: "",
    mode: "",
  });

  console.log("editFormData", editFormData);

  const user = JSON.parse(localStorage.getItem("pssuser") || "null");

  const userId = user?.id;
  const userRole = user?.role_id;

  // console.log("user", user);

  // Open and close modals
  const openAddModal = () => {
    setContacts([{ name: "", role: "", phone_number: "" }]);
    setShifts([{ shift_name: "", start_time: "", end_time: "" }]);
    setErrors({});
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
    resetForm();
  };

  const handleView = async (row) => {

    try {
    

    const res = await axiosInstance.get(
      `${API_URL}api/company/edit/${row.id}`
    );

    const data = res.data?.data || res.data;

    // console.log("Edit API response dataview:", data);

    setViewRow(data);
    setIsViewModalOpen(true);
  } catch (error) {
    console.error("Edit API error:", error);
  }
    
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewRow(null);
  };

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const validateCompanyName = (name) => {
    return name && name.trim().length >= 3;
  };

  const validateAddress = (address) => {
    return address && address.trim().length >= 5;
  };

  const validateGST = (gst) => {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const validateWebsite = (website) => {
    if (!website || typeof website !== "string") return false;

    const trimmedWebsite = website.trim();
    if (!trimmedWebsite) return false;

    // Enhanced regex that handles more cases
    const websiteRegex =
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+(:\d{1,5})?(\/\S*)?$/i;

    return websiteRegex.test(trimmedWebsite);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateTarget = (target) => {
    const targetRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return targetRegex.test(target);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateMode = (mode) => {
    return mode && mode.trim().length >= 5;
  };

  const validateStatus = (status) => {
    return status !== null && status !== "" && status !== undefined;
  };

  // const openEditModal = (row) => {
  //   console.log("rowgn", row);
  //   setEditRow(row);

  //   setEditFormData({
  //     companyName: row.companyName || "",
  //     address: row.address || "",
  //     gstNumber: row.gstNumber || "",
  //     website: row.website || "",
  //     phone: row.phone || "",
  //     supportEmail: row.supportEmail || "",
  //     billingEmail: row.billingEmail || "",
  //     notes: row.notes || "",
  //     status: row.status ?? "",
  //     contacts: Array.isArray(row.contacts) ? row.contacts : [],
  //     shifts: Array.isArray(row.shifts) ? row.shifts : [],
  //     automaticName: row.automaticName || "",
  //     mode: row.mode || "",

  //     latestnotes: row.latest?.notes || [],
  //   });

  //   setIsEditModalOpen(true);

  //   // allow DOM paint, then animate
  //   setTimeout(() => setIsEditAnimating(true), 30);
  // };


  const openEditModal = async (row) => {
    console.log("rowgn", row);
  try {
    

    const res = await axiosInstance.get(
      `${API_URL}api/company/edit/${row.id}`
    );

    const data = res.data?.data || res.data;

    // console.log("Edit API response data:", data);

    setEditRow(data);

    setEditFormData({
      companyName: data.company_name || "",
      address: data.address || "",
      gstNumber: data.gst_number || "",
      website: data.website_url || "",
      target: data.target || "",
      phone: data.phone_number || "",
      supportEmail: data.support_email || "",
      billingEmail: data.billing_email || "",
      notes: data.notes || "",
      status: data.status ?? "",
      contacts: Array.isArray(data.contacts) ? data.contacts : [],
      shifts: Array.isArray(data.shifts) ? data.shifts : [],
      automaticName: data.prefix || "",
      mode: data.company_emp_id   || "",
      latestnotes: data.latest?.notes || [],
    });
    

    setIsEditModalOpen(true);
    setTimeout(() => setIsEditAnimating(true), 30);
  } catch (error) {
    console.error("Edit API error:", error);
  }
};

  const closeEditModal = () => {
    setIsEditAnimating(false);
    setTimeout(() => {
      setIsEditModalOpen(false);
    }, 500);
    resetForm();
  };

  const validateLastContact = () => {
    const lastIndex = contacts.length - 1;
    const lastContact = contacts[lastIndex];

    const errObj = {};

    if (!lastContact.name.trim()) errObj.name = "Name is required";
    if (!lastContact.role.trim()) errObj.role = "Role is required";

    if (!lastContact.phone_number) {
      errObj.phone = "Phone is required";
    } else if (!validatePhone(lastContact.phone_number)) {
      errObj.phone = "Enter valid 10-digit phone";
    }

    if (Object.keys(errObj).length > 0) {
      setErrors((prev) => ({
        ...prev,
        companyContacts: {
          ...(prev.companyContacts || {}),
          [lastIndex]: errObj,
        },
      }));
      return false;
    }

    return true;
  };

  const validateLastShift = () => {
    const lastIndex = shifts.length - 1;
    const lastShifts = shifts[lastIndex];

    const errObj = {};

    if (!lastShifts.shift_name.trim()) errObj.name = "Name is required";
    if (!lastShifts.start_time) errObj.start_time = "Start time is required";
    if (!lastShifts.end_time) errObj.end_time = "End time is required";

    // if (Object.keys(errObj).length > 0) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     companyContacts: {
    //       ...(prev.companyContacts || {}),
    //       [lastIndex]: errObj,
    //     },
    //   }));
    //   return false;
    // }

    return true;
  };

  const addCompanyContact = () => {
    if (!validateLastContact()) {
      return;
    }
    setContacts([...contacts, { name: "", role: "", phone_number: "" }]);
  };

  const addShifts = () => {
    if (!validateLastShift()) {
      return;
    }
    setShifts([...shifts, { shift_name: "", start_time: "", end_time: "" }]);
  };

  const updateCompanyContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);

    const errorKey = field === "phone_number" ? "phone" : field;

    setErrors((prev) => {
      let newErrors = { ...prev };

      // remove field-level error
      if (newErrors.companyContacts?.[index]?.[errorKey]) {
        delete newErrors.companyContacts[index][errorKey];

        if (Object.keys(newErrors.companyContacts[index]).length === 0) {
          delete newErrors.companyContacts[index];
        }

        if (Object.keys(newErrors.companyContacts).length === 0) {
          delete newErrors.companyContacts;
        }
      }

      // ✅ REMOVE GLOBAL CONTACT ERROR
      if (hasAtLeastOneValidContact()) {
        delete newErrors.companyContacts;
      }

      return newErrors;
    });
  };

  const updateShifts = (index, field, value) => {
    const updated = [...shifts];
    updated[index][field] = value;
    setShifts(updated);

    setErrors((prev) => {
      let newErrors = { ...prev };

      return newErrors;
    });
  };

  const removeCompanyContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
  };

  const removeshifts = (index) => {
    const updated = shifts.filter((_, i) => i !== index);
    setShifts(updated);
  };

  //reset form
  const resetForm = () => {
    setCompanyName("");
    setAddress("");
    setGstNumber("");
    setWebsite("");
    setTarget("");
    setPhone("");
    setSupportEmail("");
    setBillingEmail("");
    setContacts([{ name: "", role: "", phone_number: "" }]);
    setShifts([{ shift_name: "", start_time: "", end_time: "" }]);
    setNotes("");
    setStatus("");
  };

  const hasAtLeastOneValidContact = () => {
    return contacts.some(
      (c) => c.name?.trim() && c.role?.trim() && validatePhone(c.phone_number)
    );
  };

  const hasAtLeastOneValidShift = () => {
    return shifts.some(
      (c) => c.shift_name?.trim() && c.start_time?.trim() && c.end_time?.trim()
    );
  };

  const handleApplyFilter = () => {
    if (filterStatus === null) {
      setCompanies(allCompanies);
      return;
    }

    const filtered = allCompanies.filter(
      (company) => company.status === filterStatus
    );

    setCompanies(filtered);
  };

  const handleResetFilter = () => {
    setFilterStatus(null);
    setCompanies(allCompanies);
  };

  // list companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  // view
  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}api/company`);
      console.log("Company List API Response:", res.data);

      const list =
        res.data?.data || res.data?.companies || res.data?.result || [];

      if (!Array.isArray(list)) {
        setCompanies([]);
        setAllCompanies([]);
        return;
      }
      console.log("Fetched Companies List:", list);

      const mappedCompanies = list.map((item) => ({
        
        id: item?._id || item?.id,
        companyName: item.company_name || "",
        address: item.address || "",
        gstNumber: item.gst_number || "",
        website: item.website_url || "",
        target: item.target || "",
        phone: item.phone_number || "",
        supportEmail: item.support_email || "",
        billingEmail: item.billing_email || "",
        // notes: Array.isArray(item.notes)
        //   ? item.notes[0]?.notes || ""
        //   : item.notes || "",
        notes: item.notes || "",
        status: Number(item.status),
        contacts: item.contacts || item.contact_details || [],
        shifts: item.shifts || [],
        automaticName: item.prefix || "",
        mode: item.company_emp_id || "",
        // latest:item.latest_note || "",
      }));

      setAllCompanies(mappedCompanies);
      setCompanies([...mappedCompanies]);
    } catch (err) {
      console.error("Error fetching companies", err);
      setCompanies([]);
    }
  };

  // create
  const handlesubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    //  Company Name
    if (!companyName.trim())
      newErrors.companyName = "Company Name is required";
    else if (!validateCompanyName(companyName))
      newErrors.companyName = "Enter a valid Company Name";

    //  Address
    if (!address.trim())
      newErrors.address = "Address is required";
    else if (!validateAddress(address))
      newErrors.address = "Enter a valid address";

    //  GST Number
    if (!gstNumber.trim()) {
      newErrors.gstNumber = "GST Number is required";
    } else if (!validateGST(gstNumber)) {
      newErrors.gstNumber = "Enter a valid GST number";
    }

    //  Support Email
    if (!supportEmail.trim())
      newErrors.supportEmail = "Support Email is required";
    else if (!validateEmail(supportEmail))
      newErrors.supportEmail = "Enter a valid email";

    //  Billing Email
    if (!billingEmail.trim())
      newErrors.billingEmail = "Billing Email is required";
    else if (!validateEmail(billingEmail))
      newErrors.billingEmail = "Enter a valid billing email";

    //  Stop if errors exist
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    //  CREATE COMPANY (unchanged)
    try {
      const response = await axiosInstance.post(
        `${API_URL}api/company/create`,
        {
          company_name: companyName.trim(),
          address: address.trim(),
          gst_number: gstNumber.trim(),
          website_url: website?.trim() || null,
          target: target?.trim() || null,
          phone_number: phone.trim(),
          support_email: supportEmail.trim(),
          billing_email: billingEmail.trim(),

          contact_details: contacts || [],
          shiftdetails: shifts || [],

          notes: notes?.trim() || "",
          status: status ? Number(status) : 1,
          created_by: userId,
          role_id: userRole,
          company_emp_id: mode || null,
          prefix: automaticName || null,
        }
      );

      if (
        response.status === 200 ||
        response.data?.status === true ||
        response.data?.success === true
      ) {
        toast.success("Company created successfully");
        fetchCompanies();
        resetForm();
        closeAddModal();
      } else {
        toast.error(response.data?.message || "Failed to create company");
      }
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error(
        error.response?.data?.message || "Server error. Company not created."
      );
    }
  };


  //edit contacts
  const updateEditContact = (index, key, value) => {
    const updated = [...editFormData.contacts];
    updated[index][key] = value;

    setEditFormData({
      ...editFormData,
      contacts: updated,
    });
  };

  //edit shifts
  const updateEditShifts = (index, key, value) => {
    const updated = [...editFormData.shifts];
    updated[index][key] = value;

    setEditFormData({
      ...editFormData,
      shifts: updated,
    });
  };

  const addEditContact = () => {
    setEditFormData({
      ...editFormData,
      contacts: [
        ...editFormData.contacts,
        { name: "", role: "", phone_number: "" },
      ],
    });
  };

  const addEditShifts = () => {
    setEditFormData({
      ...editFormData,
      shifts: [
        ...editFormData.shifts,
        { company_shift_id: "", shift_name: "", start_time: "", end_time: "" },
      ],
    });
  };

  const removeEditContact = (i) => {
    const updated = editFormData.contacts.filter((_, index) => index !== i);
    setEditFormData({ ...editFormData, contacts: updated });
  };

  const removeEditShifts = (i) => {
    const updated = editFormData.shifts.filter((_, index) => index !== i);
    setEditFormData({ ...editFormData, shifts: updated });
  };

  // edit
  const handleSubmitEdit = async () => {
    console.log("SUBMIT CLICKED", editFormData);

    let errors = {};

    if (!editFormData.companyName?.trim()) {
      errors.companyName = "Required";
    }

    if (editFormData.status === "" || editFormData.status === null) {
      errors.status = "Required";
    }

    setEditErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      const payload = {
        company_name: editFormData.companyName.trim(),
        address: editFormData.address,
        gst_number: editFormData.gstNumber,
        website_url: editFormData.website,
        target: editFormData.target,
        phone_number: editFormData.phone,
        support_email: editFormData.supportEmail,
        billing_email: editFormData.billingEmail,
        notes: editFormData.notes,
        status: Number(editFormData.status),

        contact_details: editFormData.contacts
          .filter(
            (c) => c.name?.trim() && c.role?.trim() && c.phone_number?.trim()
          )
          .map((c) => ({
            name: c.name.trim(),
            role: c.role.trim(),
            phone_number: c.phone_number.trim(),
          })),
        shiftdetails: editFormData.shifts
          .filter(
            (s) =>
              s.shift_name?.trim() && s.start_time?.trim() && s.end_time?.trim()
          )
          .map((s) => ({
            shift_name: s.shift_name.trim(),
            start_time: s.start_time.trim(),
            end_time: s.end_time.trim(),
            created_by: userId,
          })),
        updated_by: userId,
        role_id: userRole,
        company_emp_id: editFormData.mode,
        prefix: editFormData.automaticName,
      };

      await axiosInstance.post(
        `${API_URL}api/company/update/${editRow.id}`,
        payload
      );

      toast.success("Company updated successfully");
      closeEditModal();
      fetchCompanies();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Update failed");
    }
  };

  // delete
  const deleteCompany = async (id) => {
    console.log("Deleting company ID:", id);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This company will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`${API_URL}api/company/delete/${id}`);
      toast.success("Company deleted successfully");
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to delete company");
    }
  };

  const columns = [
    {
      header: "S.No",
      body: (rowData, options) => options.rowIndex + 1,
      style: { textAlign: "center", width: "80px" },
      fixed: true,
    },
    {
      header: "Company Name",
      field: "companyName",
    },
    // {
    //   header: "Website",
    //   field: "website",
    //   body:(row) => row.website || "-"
    // },
    // {
    //   header: "Phone",
    //   field: "phone",
    //   body:(row) => row.phone || "-"
    // },
    {
      header: "Target",
      field: "target",
      body:(row) => row.target || "-"
    },
    {
      header: "Support Email",
      field: "supportEmail",
      body:(row) => row.supportEmail || "-"
    },
    {
      header: "GST Number",
      field: "gstNumber",
      body:(row) => row.gstNumber || "-"
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
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleView(row)}
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(row);
            }}
            className="text-[#1d6bf2] p-2 rounded-[10px] bg-[#f0f6ff] border cursor-pointer hover:scale-110 transition"
            title="Edit"
          >
            <TfiPencilAlt />
          </button>

          <button
            // onClick={() => deleteCompany(row.id)}
            onClick={() => row?.id && deleteCompany(row.id)}

            className="text-[#db2525] bg-[#fff0f0] p-2 rounded-[10px] border cursor-pointer hover:scale-110 transition"
            title="Delete"
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-full min-h-screen px-5 pt-2 md:pt-5 overflow-x-auto">
      <div>
        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
        <Mobile_Sidebar />
        {/* Breadcrumbs */}

        <div className="flex gap-2 items-center cursor-pointer">
          <p
            className="text-sm md:text-md text-gray-500  cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm  md:text-md  text-[#1ea600]">Company</p>
        </div>

        {/* filter */}
        <div className="flex flex-wrap justify-between w-full mt-1 md:mt-5 h-auto gap-2 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]  px-2 py-2 md:px-6 md:py-6 ">
          <div className="flex gap-1 items-center">
            <label className="text-sm font-medium text-[#6B7280]">Status</label>
            <Dropdown
              value={filterStatus}
              options={statusOptions}
              onChange={(e) => setFilterStatus(e.value)}
              placeholder="Select Status "
              className="w-fit border border-gray-300  text-[#7C7C7C] text-sm rounded-md placeholder:text-gray-400"
            />
          </div>
          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end gap-4">
            <button
              onClick={handleApplyFilter}
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

        <div
          className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
  shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
  px-2 py-2 md:px-6 md:py-6"
        >
          <div className="datatable-container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              {/* Entries per page */}
              <div className="flex items-center gap-2">
                {/* <span className="font-semibold text-base text-[#6B7280]">Show</span> */}
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

              <div className="flex flex-col md:flex-row flex-wrap items-center gap-5">
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
                    className="w-full pl-10 pr-3 py-2 rounded-md border border-[#D9D9D9] 
                          focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  />
                </div>

                <button
                  onClick={openAddModal}
                  className="px-2 md:px-3 py-2   text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg"
                >
                  Add Company
                </button>
              </div>
            </div>
            {/* Responsive wrapper for the table */}
            <div className="table-scroll-container">
              <DataTable
                className="mt-8"
                value={companies}
                dataKey="id"
                paginator
                rows={rows}
                rowsPerPageOptions={[10, 25, 50, 100]}
                globalFilter={globalFilter}
                globalFilterFields={[
                  "companyName",
                  "website",
                  "supportEmail",
                  "billingEmail",
                ]}
                showGridlines
                resizableColumns
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              >
                {/* Render only selected columns */}
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

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm  bg-opacity-50 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 " onClick={closeAddModal}></div>

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
                <p className="text-xl md:text-2xl">Company</p>

                {/* company name */}
                <div className="mt-5 flex  justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px] border-[#D9D9D9]">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        clearError("companyName");
                      }}
                      placeholder="Enter Company Name"
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors?.companyName && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors?.companyName}
                      </p>
                    )}
                  </div>
                </div>

                {/* id generted */}

                <div className="mt-5 flex  justify-between items-center">
                  {/* Radio buttons to select mode */}

                  <label className="block text-md font-medium mb-2">
                    Employee ID Generation{" "}
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px] border-[#D9D9D9]">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mode"
                          value="manual"
                          checked={mode === "manual"}
                          onChange={() => {
                            setMode("manual");
                            clearError("mode");
                          }}
                          className="w-4 h-4 accent-green-600 cursor-pointer"
                        />
                        Manual
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mode"
                          value="automatic"
                          checked={mode === "automatic"}
                          onChange={() => {
                            setMode("automatic");
                            clearError("mode");
                          }}
                          className="w-4 h-4 cursor-pointer"
                        />
                        Automatic
                      </label>
                    </div>
                    {errors.mode && (
                      <p className="text-red-500 text-sm mb-4">{errors.mode}</p>
                    )}
                  </div>
                </div>

                {/* prefix */}
                {mode === "automatic" && (
                  <div className="mt-5 flex justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Prefix <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                      <input
                        type="text"
                        value={automaticName}
                        onChange={(e) => {
                          setAutomaticName(e.target.value);
                          clearError("automaticName");
                        }}
                        placeholder="Enter Prefix"
                        className="w-[100%] px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />

                      {errors.automaticName && (
                        <p className="text-red-500 text-sm mb-4">
                          {errors.automaticName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* address */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Address 
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <textarea
                      type="address"
                      value={address}
                      id="address"
                      rows="4"
                      onChange={(e) => {
                        setAddress(e.target.value);
                        clearError("address");
                      }}
                      placeholder="Enter Your Address "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* gst number */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    GST Number 
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => {
                        setGstNumber(e.target.value);
                        // clearError("gstNumber");
                      }}
                      placeholder="Enter Your GST Number "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.gstNumber && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.gstNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* website */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Website
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => {
                        setWebsite(e.target.value);
                        clearError("website");
                      }}
                      placeholder="Enter Your Website "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {/* {errors.website && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.website}
                      </p>
                    )} */}
                  </div>
                </div>

                {/* target */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Target
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="number"
                      value={target}
                      onChange={(e) => {
                        setTarget(e.target.value);
                        clearError("target");
                      }}
                      placeholder="Enter Your Target "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {/* {errors.website && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.website}
                      </p>
                    )} */}
                  </div>
                </div>

                {/* phone */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Phone
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="text"
                      value={phone}
                      // onChange={(e) => setPhone(e.target.value)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // digits only
                        if (value.length <= 10) {
                          setPhone(value);
                          clearError("phone");
                        }
                      }}
                      maxLength={10}
                      placeholder="Enter Your Phone "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {/* {errors.phone && (
                        <p className="text-red-500 text-sm mb-4">
                          {errors.phone}
                        </p>
                      )} */}
                  </div>
                </div>

                {/* support email */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Support Email 
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => {
                        setSupportEmail(e.target.value);
                        if (errors.supportEmail) {
                          setErrors((prev) => ({ ...prev, supportEmail: "" }));
                        }
                      }}
                      placeholder="Enter Your Support Email "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.supportEmail && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.supportEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* billing email */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Billing Email 
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="email"
                      value={billingEmail}
                      onChange={(e) => {
                        setBillingEmail(e.target.value);
                        if (errors.billingEmail) {
                          setErrors((prev) => ({ ...prev, billingEmail: "" }));
                        }
                      }}
                      placeholder="Enter Your Billing Email "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.billingEmail && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.billingEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* notes */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Notes
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <textarea
                      type="text"
                      value={notes}
                      name="notes"
                      id=" notes"
                      rows="4"
                      onChange={(e) => {
                        setNotes(e.target.value);
                        // clearError("notes");
                      }}
                      placeholder="Enter Your Notes "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {/* {errors.notes && (
                        <p className="text-red-500 text-sm mb-4">
                          {errors.notes}
                        </p>
                      )} */}
                  </div>
                </div>

                {/* status */}
                <div className="mt-5 flex justify-between items-center">
                  <div className="">
                    <label
                      htmlFor="status"
                      className="block text-md font-medium mb-2 mt-3"
                    >
                      Status
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <select
                      name="status"
                      id="status"
                      onChange={(e) => {
                        setStatus(e.target.value);
                        clearError("status");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 text-[#4A4A4A] text-base font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select a status</option>
                      <option value="1">Active</option>
                      <option value="0">InActive</option>
                    </select>
                    {errors.status && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.status}
                        </p>
                      )}
                  </div>
                </div>

                {/* contacts */}
                <div className="rounded-[10px] border-2 border-[#E0E0E0]  bg-white py-2 px-2 lg:px-4 my-5">
                  <div className="flex justify-between items-center">
                    <p className="text-lg md:text-xl font-semibold">
                      Company Contacts
                    </p>
                    <IoAddCircleSharp
                      className="text-[#1ea600] text-3xl cursor-pointer"
                      onClick={addCompanyContact}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="grid grid-cols-3 font-semibold text-sm md:text-base text-[#4A4A4A] bg-gray-50  p-2 rounded-[10px] text-center">
                      <span className="">Name</span>
                      <span>Role</span>
                      <span>Phone No</span>
                    </div>

                    {contacts.map((item, index) => (
                      <div
                        key={index}
                        className="relative grid grid-cols-3 gap-4 border p-3 rounded-[10px] mt-3 bg-gray-50"
                      >
                        {/* Remove */}
                        {index > 0 && (
                          <IoIosCloseCircle
                            className="absolute top-2 right-2 text-red-500 text-xl cursor-pointer"
                            onClick={() => removeCompanyContact(index)}
                          />
                        )}
                        {/* <div key={index} className="mt-4 p-4 border rounded-xl bg-gray-50"> */}

                        {/* Full Name */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">FULL NAME</label> */}

                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="text"
                              placeholder="Contact Name"
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                              value={item.name}
                              onChange={(e) =>
                                updateCompanyContact(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                            {errors.companyContacts?.[index]?.name && (
                              <p className="text-red-500 text-sm">
                                {errors.companyContacts[index].name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Role */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">Role</label> */}
                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="text"
                              placeholder="Role Name"
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                              value={item.role}
                              onChange={(e) =>
                                updateCompanyContact(
                                  index,
                                  "role",
                                  e.target.value
                                )
                              }
                            />
                            {errors.companyContacts?.[index]?.role && (
                              <p className="text-red-500 text-sm">
                                {errors.companyContacts[index].role}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">CONTACT</label> */}
                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="number"
                              placeholder="Phone Number"
                              value={item.phone_number}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); //
                                if (value.length <= 10) {
                                  updateCompanyContact(
                                    index,
                                    "phone_number",
                                    value
                                  );
                                }
                              }}
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                            />
                            {errors.companyContacts?.[index]?.phone && (
                              <p className="text-red-500 text-sm">
                                {errors.companyContacts[index].phone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Remove */}
                        {/* {index > 0 && (
                            <button
                              className="text-red-500 text-sm underline col-span-3"
                              onClick={() => removeCompanyContact(index)}
                            >
                              Remove Contact
                            </button>
                          )} */}
                      </div>
                    ))}
                  </div>

                  {/* Add More */}
                  {/* <button
                      onClick={addCompanyContact}
                      className="mt-4 bg-[#1ea600] hover:bg-green-700 font-medium text-white px-4 py-2 rounded-lg"
                    >
                      + Add Contact
                    </button> */}
                </div>

                {/* shift allocation */}
                <div className="rounded-[10px] border-2 border-[#E0E0E0]  bg-white py-2 px-2 lg:px-4 my-5">
                  <div className="flex justify-between items-center">
                    <p className="text-lg md:text-xl font-semibold">
                      shift Allocation
                    </p>
                    <IoAddCircleSharp
                      className="text-[#1ea600] text-3xl cursor-pointer"
                      onClick={addShifts}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="grid grid-cols-3 font-semibold text-sm md:text-base text-[#4A4A4A] bg-gray-50 p-2 rounded-[10px] text-center">
                      <span>Shift Name</span>
                      <span>Start Time</span>
                      <span>End Time</span>
                    </div>


                    {shifts.map((item, index) => (
                      <div
                        key={index}
                        className="relative grid grid-cols-3 gap-4 border p-3 rounded-[10px] mt-3 bg-gray-50"
                      >
                        {/* Remove */}
                        {index > 0 && (
                          <IoIosCloseCircle
                            className="absolute top-2 right-2 text-red-500 text-xl cursor-pointer"
                            onClick={() => removeshifts(index)}
                          />
                        )}
                        {/* <div key={index} className="mt-4 p-4 border rounded-xl bg-gray-50"> */}

                        {/* Shift Name */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">FULL NAME</label> */}

                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="text"
                              placeholder="Shift Name"
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                              value={item.name}
                              onChange={(e) =>
                                updateShifts(
                                  index,
                                  "shift_name",
                                  e.target.value
                                )
                              }
                            />
                            {errors.companyShifts?.[index]?.shift_name && (
                              <p className="text-red-500 text-sm">
                                {errors.companyShifts[index].shift_name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Start Time */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">Role</label> */}
                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="Time"
                              placeholder="Start Time"
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                              value={item.start_time}
                              onChange={(e) =>
                                updateShifts(
                                  index,
                                  "start_time",
                                  e.target.value
                                )
                              }
                            />
                            {errors.companyShifts?.[index]?.start_time && (
                              <p className="text-red-500 text-sm">
                                {errors.companyShifts[index].start_time}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* End Time */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">CONTACT</label> */}
                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="Time"
                              placeholder="End Time"
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                              value={item.end_time}
                              onChange={(e) =>
                                updateShifts(index, "end_time", e.target.value)
                              }
                            />
                            {errors.companyShifts?.[index]?.end_time && (
                              <p className="text-red-500 text-sm">
                                {errors.companyShifts[index].end_time}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Remove */}
                        {/* {index > 0 && (
                            <button
                              className="text-red-500 text-sm underline col-span-3"
                              onClick={() => removeCompanyContact(index)}
                            >
                              Remove Contact
                            </button>
                          )} */}
                      </div>
                    ))}
                  </div>

                  {/* Add More */}
                  {/* <button
                      onClick={addCompanyContact}
                      className="mt-4 bg-[#1ea600] hover:bg-green-700 font-medium text-white px-4 py-2 rounded-lg"
                    >
                      + Add Contact
                    </button> */}
                </div>

                <div className="flex  justify-end gap-2 mt-6 md:mt-14">
                  <button
                    onClick={closeAddModal}
                    className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                    onClick={handlesubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 " onClick={closeEditModal}></div>

            <div
              onClick={(e) => e.stopPropagation()}
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out
                      ${isEditAnimating ? "translate-x-0" : "translate-x-full"}`}
            >
              <div
                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeEditModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="p-2 md:p-5">
                <p className="text-xl md:text-2xl font-medium">Company Edit</p>

                {/* company name */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="text"
                      // value={companyNameEdit}
                      value={editFormData.companyName}
                      id="companyNameEdit"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          companyName: e.target.value,
                        })
                      }
                      // onChange={(e) => setCompanyNameEdit(e.target.value)}
                      placeholder="Enter Company Name"
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors?.companyNameEdit && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors?.companyNameEdit}
                      </p>
                    )}
                  </div>
                </div>

                {/* id generted */}

                <div className="mt-5 flex  justify-between items-center">
                  {/* Radio buttons to select mode */}

                  <label className="block text-md font-medium mb-2">
                    Employee ID Generation{" "}
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px] border-[#D9D9D9]">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mode"
                          value="manual"
                          checked={editFormData.mode === "manual"}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              mode: e.target.value,
                            })
                          }
                          className="w-4 h-4 accent-green-600 cursor-pointer"
                        />
                        Manual
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mode"
                          value="automatic"
                          checked={editFormData.mode === "automatic"}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              mode: e.target.value,
                            })
                          }
                          className="w-4 h-4 cursor-pointer"
                        />
                        Automatic
                      </label>
                    </div>

                    {errors.mode && (
                      <p className="text-red-500 text-sm mb-4">{errors.mode}</p>
                    )}
                  </div>
                </div>

                {/* prefix */}
                {editFormData?.mode === "automatic" && (
                  <div className="mt-5 flex justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                      <input
                        type="text"
                        value={editFormData?.automaticName}
                        id="automaticName"
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            automaticName: e.target.value,
                          })
                        }
                        placeholder="Enter Prefix"
                        className="w-[100%] px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />

                      {errors.automaticName && (
                        <p className="text-red-500 text-sm mb-4">
                          {errors.automaticName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* address */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    address <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <textarea
                      type="address"
                      value={editFormData?.address}
                      id="addressEdit"
                      rows="4"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter Your Address "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.addressEdit && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.addressEdit}
                      </p>
                    )}
                  </div>
                </div>

                {/* gst number */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    GST Number <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="text"
                      value={editFormData?.gstNumber}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          gstNumber: e.target.value,
                        })
                      }
                      placeholder="Enter Your GST Number "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.gstNumberEdit && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.gstNumberEdit}
                      </p>
                    )}
                  </div>
                </div>

                {/* website */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Website 
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="text"
                      value={editFormData.website}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          website: e.target.value,
                        })
                      }
                      placeholder="Enter Your Website "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {/* {errors.websiteEdit && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.websiteEdit}
                      </p>
                    )} */}
                  </div>
                </div>

                {/* Target */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Target 
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="number"
                      value={editFormData.target}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          target: e.target.value,
                        })
                      }
                      placeholder="Enter Your Target "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {/* {errors.websiteEdit && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.websiteEdit}
                      </p>
                    )} */}
                  </div>
                </div>

                {/* phone */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Phone 
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter Your Phone "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {/* {errors.phoneEdit && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.phoneEdit}
                      </p>
                    )} */}
                  </div>
                </div>

                {/* support email */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Support Email <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="email"
                      value={editFormData.supportEmail}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          supportEmail: e.target.value,
                        })
                      }
                      placeholder="Enter Your Support Email "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.supportEmailEdit && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.supportEmailEdit}
                      </p>
                    )}
                  </div>
                </div>

                {/* billing email */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Billing Email <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <input
                      type="email"
                      value={editFormData.billingEmail}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          billingEmail: e.target.value,
                        })
                      }
                      placeholder="Enter Your Billing Email "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {errors.billingEmailEdit && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.billingEmailEdit}
                      </p>
                    )}
                  </div>
                </div>

                {/* notes */}
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Notes 
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <textarea
                      type="text"
                      value={editFormData.notes}
                      name="notes"
                      id=" notes"
                      rows="4"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Enter Your Notes "
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    {/* {errors.notesEdit && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.notesEdit}
                      </p>
                    )} */}
                  </div>
                </div>

                {/* status */}
                <div className="mt-5 flex justify-between items-center">
                  <div className="">
                    <label
                      htmlFor="status"
                      className="block text-md font-medium mb-2 mt-3"
                    >
                      Status <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[50%] lg:w-[60%] rounded-[10px]">
                    <select
                      name="status"
                      id="status"
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">Select a status</option>
                      <option value="1">Active</option>
                      <option value="0">InActive</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {errors.status}
                      </p>
                    )}
                  </div>
                </div>

                {/* contacts */}
                <div className="rounded-[10px] border-2 border-[#E0E0E0]  bg-white py-2 px-2 lg:px-4 my-5">
                  <div className="flex justify-between items-center">
                    <p className="text-lg md:text-xl font-semibold">
                      Company Contacts
                    </p>
                    <IoAddCircleSharp
                      className="text-[#1ea600] text-3xl cursor-pointer"
                      onClick={addEditContact}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="grid grid-cols-3 font-semibold text-sm md:text-base text-[#4A4A4A] bg-gray-50  p-2 rounded-[10px] text-center">
                      <span className="">Name</span>
                      <span>Role</span>
                      <span>Phone No</span>
                    </div>

                    {editFormData.contacts.map((item, index) => (
                      <div
                        key={index}
                        className="relative grid grid-cols-3 gap-4 border p-3 rounded-[10px] mt-3 bg-gray-50"
                      >
                        {/* Remove */}
                        {index > 0 && (
                          <IoIosCloseCircle
                            className="absolute top-2 right-2 text-red-500 text-xl cursor-pointer"
                            onClick={() => removeEditContact(index)}
                          />
                        )}
                        {/* <div key={index} className="mt-4 p-4 border rounded-xl bg-gray-50"> */}

                        {/* Full Name */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">FULL NAME</label> */}

                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="text"
                              placeholder="Contact Name"
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                              value={item.name}
                              onChange={(e) =>
                                updateEditContact(index, "name", e.target.value)
                              }
                            />
                            {errors.companyContacts?.[index]?.name && (
                              <p className="text-red-500 text-sm">
                                {errors.companyContacts[index].name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Role */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">Role</label> */}
                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="text"
                              placeholder="Role Name"
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                              value={item.role}
                              onChange={(e) =>
                                updateEditContact(index, "role", e.target.value)
                              }
                            />
                            {errors.companyContacts?.[index]?.role && (
                              <p className="text-red-500 text-sm">
                                {errors.companyContacts[index].role}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">CONTACT</label> */}
                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="number"
                              placeholder="Phone Number"
                              value={item.phone_number}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); //
                                if (value.length <= 10) {
                                  updateEditContact(
                                    index,
                                    "phone_number",
                                    value
                                  );
                                }
                              }}
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                            />
                            {errors.companyContacts?.[index]?.phone && (
                              <p className="text-red-500 text-sm">
                                {errors.companyContacts[index].phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* shift allocation */}
                <div className="rounded-[10px] border-2 border-[#E0E0E0]  bg-white py-2 px-2 lg:px-4 my-5">
                  <div className="flex justify-between items-center">
                    <p className="text-lg md:text-xl font-semibold">
                      Shift Allocation
                    </p>
                    <IoAddCircleSharp
                      className="text-[#1ea600] text-3xl cursor-pointer"
                      onClick={addEditShifts}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="grid grid-cols-4 font-semibold text-sm md:text-base bg-gray-50 p-2 rounded-[10px] text-center">
                      <span>Shift Unique ID</span>
                      <span>Shift Name</span>
                      <span>Start Time</span>
                      <span>End Time</span>
                    </div>

                    {editFormData.shifts.map((item, index) => (
                      <div
                        key={index}
                        className="relative grid grid-cols-4 gap-4 border p-3 rounded-[10px] mt-3 bg-gray-50"
                      >
                        {/* Remove */}
                        {index > 0 && (
                          <IoIosCloseCircle
                            className="absolute top-2 right-2 text-red-500 text-xl cursor-pointer"
                            onClick={() => removeEditShifts(index)}
                          />
                        )}
                        {/* <div key={index} className="mt-4 p-4 border rounded-xl bg-gray-50"> */}

                        {/* shift unique ID */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">FULL NAME</label> */}

                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="text"
                              value={item.company_shift_id}
                              disabled
                              title={item.company_shift_id}
                              className="border-2 ps-3 h-10 border-gray-300 w-full text-sm rounded-[10px]
             bg-gray-100 cursor-not-allowed overflow-x-auto whitespace-nowrap"/>
                            {errors.companyShifts?.[index]?.company_shift_id && (
                              <p className="text-red-500 text-sm">
                                {errors.companyShifts[index].company_shift_id}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Full Name */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">FULL NAME</label> */}

                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="text"
                              placeholder="shift Name"
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                              value={item.shift_name}
                              onChange={(e) =>
                                updateEditShifts(
                                  index,
                                  "shift_name",
                                  e.target.value
                                )
                              }
                            />
                            {errors.companyShifts?.[index]?.shift_name && (
                              <p className="text-red-500 text-sm">
                                {errors.companyShifts[index].shift_name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Role */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">Role</label> */}
                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="time"
                              placeholder="Start Time"
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                              value={item.start_time}
                              onChange={(e) =>
                                updateEditShifts(
                                  index,
                                  "start_time",
                                  e.target.value
                                )
                              }
                            />
                            {errors.companyShifts?.[index]?.start_time && (
                              <p className="text-red-500 text-sm">
                                {errors.companyShifts[index].start_time}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col xl:flex-row gap-1 justify-between mt-2">
                          {/* <label className="font-medium text-sm">CONTACT</label> */}
                          <div className="w-[60%] md:w-[90%] rounded-[10px]">
                            <input
                              type="time"
                              placeholder="End Time"
                              value={item.end_time}
                              onChange={(e) =>
                                updateEditShifts(
                                  index,
                                  "end_time",
                                  e.target.value
                                )
                              }
                              className="border-2  ps-3 h-10 border-gray-300 w-full  text-sm font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600] "
                            />
                            {errors.companyShifts?.[index]?.end_time && (
                              <p className="text-red-500 text-sm">
                                {errors.companyShifts[index].end_time}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex  justify-end gap-2 mt-6 md:mt-14">
                  <button
                    onClick={closeEditModal}
                    className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                    onClick={handleSubmitEdit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isViewModalOpen && viewRow && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">

  <div className="relative bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
 
 {/* Header */}
 <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold mb-4 text-[#1ea600] hover:text-[#4BB452]">
              Company Details
            </h2>
             {/* Close Button */}
            <button
              onClick={closeViewModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <IoIosCloseCircle size={28} />
            </button>
            </div>

{/* body */}
<div className="p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
            {/* Company Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <b>Company Name:</b> {viewRow.
company_name}
              </p>
              <p>
                <b>Status:</b> {viewRow.status === 1 ? "Active" : "Inactive"}
              </p>
              <p>
                <b>Phone:</b> {viewRow.phone_number}
              </p>
              <p>
                <b>Support Email:</b> {viewRow.support_email}
              </p>
              <p>
                <b>Billing Email:</b> {viewRow.billing_email}
              </p>
              <p>
                <b>Website:</b> {viewRow.website_url}
              </p>
              <p>
                <b>Target:</b> {viewRow.target}
              </p>

              <p>
                <b>GST Number:</b> {viewRow.gst_number}
              </p>
              <p>
                <b>Employee ID Generation:</b> {Capitalise(viewRow?.company_emp_id
)}
              </p>

              <p className="">
                <b>Address:</b> {viewRow.address}
              </p>
              {viewRow?.prefix && (
                <p>
                  <b>Employee ID:</b> {viewRow.prefix}
                </p>
              )}


              {/* <p className="col-span-2">
                <b>Shifts:</b> {viewRow.shifts.map(shift => `${shift.shift_name}`).join(", ")}
              </p> */}
              <p className="col-span-2">
                <b>Notes:</b> {viewRow.notes}
              </p>
            </div>

            {/* Contacts */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Contacts</h3>

              {viewRow.contacts?.length > 0 ? (
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Role</th>
                      <th className="border p-2">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewRow.contacts
                      ?.filter((c) => c.name && c.role && c.phone_number)
                      .map((c, i) => (
                        <tr key={i}>
                          <td className="border p-2">{c.name}</td>
                          <td className="border p-2">{c.role}</td>
                          <td className="border p-2">{c.phone_number}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No contacts available</p>
              )}
            </div>

            {/* shifts */}

             <div className="mt-4">
              <h3 className="font-semibold mb-2">Shifts</h3>

              {viewRow.shifts?.length > 0 ? (
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Shift Unique ID
</th>
                      <th className="border p-2">Shift Name
</th>
                      <th className="border p-2">Start Time
</th>
                      <th className="border p-2">End Time
</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewRow.shifts
                      ?.filter((shift) => shift.company_shift_id && shift.shift_name || shift.start_time ||shift.end_time )
                      .map((shift, i) => (
                        <tr key={i}>
                          <td className="border p-2">{shift.company_shift_id || "-"}</td>
                          <td className="border p-2">{shift.shift_name || "-"}</td>
                          <td className="border p-2">{shift.start_time || "-"}</td>
                          <td className="border p-2">{shift.end_time || "-"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No Shifts available</p>
              )}
            </div>
          </div>
        </div>
        </div>
      )}

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Company_Mainbar;
