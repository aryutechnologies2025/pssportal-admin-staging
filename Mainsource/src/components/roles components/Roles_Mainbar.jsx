import React, { useState, useEffect } from "react";

// import DataTable from "datatables.net-react";
// import DT from "datatables.net-dt";
// import "datatables.net-responsive-dt/css/responsive.dataTables.css";
// DataTable.use(DT);
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Loader from "../Loader";
// import axios from "../../api/axiosConfig";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"
import { set } from "zod";

const Roles_Mainbar = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [pssCompany, setPssCompany] = useState(null); // selected value
  const [pssCompanyOptions, setPssCompanyOptions] = useState([]); // dropdown list
  const [page, setPage] = useState(1);
  const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);

  };

  const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };

  // Fetch roles from the API

  useEffect(() => {
    fetchRoles();
  }, []);


  const validateDepartment = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.department = ["Department is required"];
    } else {
      delete newErrors.department;
    }
    setErrors(newErrors);
  };

  const validatePssCompany = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.pssCompany = ["PSS Company is required"];
    } else {
      delete newErrors.pssCompany;
    }
    setErrors(newErrors);
  };

  const [role_name, setRole_Name] = useState("");

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  console.log("....erors.... : ", errors);


  //local storage 
  // localStorage.setItem("pssuser", JSON.stringify(data.user));
  const storedDetatis = localStorage.getItem("pssuser");
  //  console.log("storedDetatis.... : ",storedDetatis)
  const parsedDetails = JSON.parse(storedDetatis);
  // console.log("....parsedDetails.... : ",parsedDetails)
  const userid = parsedDetails ? parsedDetails.id : null;
  // console.log("userid.... : ",userid)

  const [editingRoleId, setEditingRoleId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewContact, setViewContact] = useState(null);
  console.log("viewMessage", viewContact)


  const openViewModal = async (row) => {
    const response = await axiosInstance.get(
      `${API_URL}api/role/edit/${row.id}`
    );

    if (response.data?.status) {
      setViewContact(response.data.data);
      setViewModalOpen(true);
    }
  };


  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}api/role`);

      console.log("...RoleFetching All.... : ", response.data);

      if (response.data.status === true) {
        // roles
        setRoles(response.data.data || []);
        setTotalRecords(response.data.data.length || 0);

        // departments (from SAME API)
        const activeDepartments = (response.data.departments || []).filter(
          (dept) => dept.status === "1" || dept.status === 1
        );

        setDepartments(activeDepartments);
        //  set pss company options
        const pssCompanyOptions = response.data.psscompany.map((company) => ({
          label: company.name,
          value: company.id,
        }));

        setPssCompanyOptions(pssCompanyOptions);
      } else {
        setRoles([]);
        setPssCompanyOptions([]);
        setDepartments([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error("Failed to fetch roles", err);
      setRoles([]);
      setDepartments([]);
      setPssCompanyOptions([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };



  // Open and close modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);

    setTimeout(() => {
      setIsAddModalOpen(false);
      setRole_Name("");
      setDepartment("");
      setPssCompany("");
      setStatus("");
      setErrors({});
    }, 300);
  };


  const [roleDetails, setRoleDetails] = useState({
    role_name: "",
    department_id: "",
    company_id: "",
    status: "",
  });


  const openEditModal = async (row) => {


    try {
      setEditingRoleId(row.id);
      setIsEditModalOpen(true);
      setIsAnimating(true);

      const response = await axiosInstance.get(
        `${API_URL}api/role/edit/${row.id}`
      );

      console.log("openEditModal response", response.data);

      if (response.data?.status === true) {
        const data = response.data.data;

        console.log(
          "Edit dept value:",
          roleDetails.department_id,
          typeof roleDetails.department_id
        );

        //    setRoleDetails({
        //   role_name: row.role_name,
        // department_id: row.department_id?.toString(),
        // company_id: row.company_id, 
        // status: row.status?.toString(),
        // });
        setRoleDetails({
          role_name: data.role_name,
          department_id: Number(data.department_id), // ✅ force number
          company_id: data.company_id,
          status: Number(data.status),
        });
      }
      else {
        toast.error("Failed to load role details");
      }
    } catch (err) {
      console.error("Edit fetch error:", err);
      toast.error("Unable to fetch role details");
    }
  };
  //   setIsEditModalOpen(true);
  //   setTimeout(() => setIsAnimating(true), 10);
  // };



  const closeEditModal = () => {
    setIsAnimating(false);
    setEditingRoleId(null);
    setRoleDetails({ role_name: "", status: "", department_id: "", pssCompany: "" });
    setErrors({});
    setTimeout(() => setIsEditModalOpen(false), 250);
  };



  const validateCreateForm = () => {
    let newErrors = {};

    if (!department) {
      newErrors.department = ["Department is required"];
    }

    if (!pssCompany) {
      newErrors.pssCompany = ["PSS Company is required"];
    }

    if (!role_name || role_name.trim() === "") {
      newErrors.role_name = ["Role name is required"];
    }

    if (status === "" || status === null) {
      newErrors.status = ["Status is required"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    let newErrors = {};

    if (!roleDetails.department_id) {
      newErrors.department = ["Department is required"];
    }

    if (!roleDetails.company_id) {
      newErrors.pssCompany = ["PSS Company is required"];
    }

    if (!roleDetails.role_name || roleDetails.role_name.trim() === "") {
      newErrors.role_name = ["Role name is required"];
    }

    if (roleDetails.status === "" || roleDetails.status === null) {
      newErrors.status = ["Status is required"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const [submitting, setSubmitting] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!validateCreateForm()) {
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const formdata = {
        company_id: pssCompany,
        role_name,
        status,
        department_id: department,
        created_by: userid,
      };

      const response = await axiosInstance.post(
        `${API_URL}api/role/create`,
        formdata
      );

      if (response.data.status === true || response.data.success === true) {
        toast.success("Role created successfully");
        fetchRoles();
        setDepartment("");
        closeAddModal();
      } else {
        toast.error("Failed to create role");
      }
    } catch (err) {
      toast.error("Error creating role");
    } finally {
      setSubmitting(false);
    }
  };



  const handleSave = async () => {
    if (!validateEditForm()) {
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${API_URL}api/role/update/${editingRoleId}`,
        {
          role_name: roleDetails.role_name,
          department_id: roleDetails.department_id,
          company_id: roleDetails.company_id,
          status: roleDetails.status,
          updated_by: userid,
        }
      );

      if (response.data.status || response.data.success) {
        toast.success("Role updated successfully");
        closeEditModal();
        fetchRoles();
      } else {
        toast.error("Failed to update role");
      }
    } catch (err) {
      toast.error("Error updating role");
    }
  };



  // Validate Role Name dynamically
  const MAX_ROLE_NAME_LENGTH = 255;
  const validateRoleName = (value) => {
    const newErrors = { ...errors };
    if (!value || value.trim() === "") {
      newErrors.role_name = ["Role name is required"];
    } else if (value.length > MAX_ROLE_NAME_LENGTH) {
      newErrors.role_name = [
        `Role name cannot exceed ${MAX_ROLE_NAME_LENGTH} characters`
      ];
    } else {
      delete newErrors.role_name;
    }

    setErrors(newErrors);
  };

  // Validate Status dynamically
  const validateStatus = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.status = ["Status is required"];
    } else {
      delete newErrors.status;
    }
    setErrors(newErrors);
  };





  const deleteRoles = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this role?",
      icon: "warning",
      showCancelButton: true,

      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",

      //    confirmButtonColor: "#DF3A3A", 
      // cancelButtonColor: "#ffffff", 

      // customClass: {
      //   popup: "custom-swal-popup",
      //   title: "custom-swal-title",
      //   htmlContainer: "custom-swal-text",
      //   confirmButton: "custom-swal-confirm",
      //   cancelButton: "custom-swal-cancel",
      //   icon: "custom-swal-icon"
      // }
    }).then((result) => {
      if (result.isConfirmed) {

        axiosInstance.delete(`${API_URL}api/role/delete`, {
          data: {
            record_id: roleId
          }
        })
          .then((response) => {
            console.log("Delete response:", response.data);
            if (response.data.status === true || response.data.success === true) {
              toast.success("Role has been deleted.");
              fetchRoles(); // Refresh the roles list

            } else {
              Swal.fire("Error!", response.data.message || "Failed to delete role.", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting role:", error);
            Swal.fire("Error!", "Failed to delete role.", "error");
          });
      }
    });
  };




  const columns = [
    {
      header: "S.No",
      body: (rowData, options) => options.rowIndex + 1,
      style: { textAlign: "center", width: "80px", fontWeight: "medium" },
      fixed: true,
    },
    {
      header: "Role Name",
      field: "role_name",
      // body: (row) => row.role_name,
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      header: "Department",
      body: (row) => row.department?.department_name || "-",
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      field: "Status",
      header: "Status",
      body: (row) => (
        <div
          className={`inline-block  text-sm font-normal rounded-full w-[100px]  justify-center items-center border 
            ${row.status === 0 || row.status === '0'
              ? "text-[#DC2626] bg-[#FFF0F0]"
              : "text-[#16A34A]  bg-green-100"
            }`}
        >
          {row.status === 0 || row.status === '0' ? "Inactive" : "Active"}
        </div>
      ),
      style: { textAlign: "center", fontWeight: "medium" },
    },

    {
      field: "Action",
      header: "Action",
      body: (row) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              // setViewContact(row);
              setViewModalOpen(true);
              openViewModal(row)
            }}
            className="p-1 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>

          <TfiPencilAlt
            onClick={() => {

              openEditModal(row);

            }}
            className="text-[#1ea600] cursor-pointer hover:scale-110 transition"
            title="Edit"
          />

          <RiDeleteBin6Line
            onClick={() => deleteRoles(row.id)}
            className="text-red-500 cursor-pointer hover:scale-110 transition"
            title="Delete"
          />
        </div>
      ),
      style: { textAlign: "center", fontWeight: "medium" },
    },


  ];

  // console.log("columns", columns)

  const departmentOptions = departments.map((dept) => ({
    label: dept.name || dept.department_name,
    value: dept.id || dept._id.toString(),
  }));


  let navigate = useNavigate();

  return (
    <div className="flex  flex-col justify-between bg-gray-50  px-3 md:px-5 pt-2 md:pt-10 w-screen min-h-screen overflow-auto">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className="">
              <Mobile_Sidebar />
            </div>

            <div className="flex justify-start gap-2 mt-2 md:mt-0 items-center">
              {/* <ToastContainer position="top-right" autoClose={3000} /> */}

              <p className="text-sm text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                Dashboard
              </p>
              <p>{">"}</p>
              {/* <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/employees")}>
                Employee
              </p>
              <p>{">"}</p> */}
              <p className="text-sm  md:text-md  text-[#1ea600]">Roles</p>
            </div>

            {/* Add Button */}
            {/* <div className="flex justify-between mt-1 md:mt-4">
              <div className="">
                <h1 className="text-3xl font-semibold">Roles</h1>
              </div>

              
            </div> */}

            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6">
              <div className="datatable-container md:mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-medium text-sm text-[#6B7280]">Show</span> */}
                    {/* <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({ label: v, value: v }))}
                      onChange={(e) => setRows(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    /> */}

                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map(v => ({ label: v, value: v }))}
                      onChange={(e) => onRowsChange(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">Entries Per Page</span>
                  </div>

                  <div className="flex items-center gap-5">
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

                    <button
                      onClick={openAddModal}
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] text-sm md:text-base font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      Add Role
                    </button>
                  </div>
                </div>
                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    className="mt-2 md:mt-8"
                    value={roles}
                    paginator
                    rows={rows}
                    first={(page - 1) * rows}
                    onPage={onPageChange}
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
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                <div className="absolute inset-0" onClick={closeAddModal}></div>

                <div className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"}`}>
                  <div className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer" onClick={closeAddModal}>
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="px-5 lg:px-14  py-5 md:py-10 text-[#4A4A4A] font-medium">
                    <p className="text-xl md:text-2xl ">Add Role</p>

                    {/* Pss company */}

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Pss Company <span className="text-red-500">*</span>
                      </label>

                      <div className="w-[50%]">
                        <Dropdown
                          value={pssCompany}
                          options={pssCompanyOptions}
                          onChange={(e) => {
                            setPssCompany(e.value);
                            validatePssCompany(e.value);
                          }}
                          placeholder="Select Pss Company"
                          className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          // showClear
                          filter
                        />

                        {errors.pssCompany && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.pssCompany[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <Dropdown
                          name="department"
                          id="department"
                          value={department}
                          className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          onChange={(e) => {
                            setDepartment(e.value);
                            validateDepartment(e.value);
                          }}
                          options={departmentOptions}
                          placeholder="Select Department"
                          filter
                        />



                        {errors.department && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.department[0]}
                          </p>
                        )}

                      </div>
                    </div>



                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label htmlFor="roleName" className="block text-md font-medium mb-2 mt-3">
                        Role Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <input
                          type="text"
                          id="role_name"
                          name="role_name"
                          maxLength={255}
                          value={role_name}
                          placeholder="Enter Role Name"
                          onChange={(e) => {
                            setRole_Name(e.target.value);
                            validateRoleName(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.role_name && (
                          <p className="text-red-500 text-sm mb-4 mt-1">{errors.role_name[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label htmlFor="status" className="block text-md font-medium mb-2 mt-3">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <select
                          name="status"
                          id="status"
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                            validateStatus(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        >
                          <option value="">Select A Status</option>
                          <option value="1">Active</option>
                          <option value="0">InActive</option>
                        </select>
                        {errors.status && (
                          <p className="text-red-500 text-sm mb-4 mt-1">{errors.status}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-5 md:mt-14">
                      <button onClick={closeAddModal}
                        className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-lg transition-all duration-200">
                        Cancel
                      </button>
                      <button disabled={submitting} onClick={handlesubmit}
                        className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-lg disabled:opacity-50 transition-all duration-200">
                        {submitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                <div className="absolute inset-0" onClick={closeEditModal}></div>

                <div className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"}`}>
                  <div className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer" onClick={closeEditModal}>
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="px-5 lg:px-14 py-5 md:py-10 text-[#4A4A4A] font-semibold">
                    <p className="text-xl md:text-2xl ">Edit Role</p>

                    {/* Pss company */}

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Pss Company <span className="text-red-500">*</span>
                      </label>

                      <div className="w-[50%]">
                        <Dropdown
                          value={roleDetails.company_id}
                          options={pssCompanyOptions}
                          onChange={(e) => {
                            setRoleDetails({
                              ...roleDetails,
                              company_id: e.value,
                            });
                            validatePssCompany(e.value);
                          }}

                          placeholder="Select Pss Company"
                          className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          // showClear
                          filter
                        />

                        {errors.pssCompany && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.pssCompany[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="md:mt-10">
                      <div className="bg-white rounded-xl w-full">
                        <div className="mt-2 md:mt-8 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            Department <span className="text-red-500">*</span>
                          </label>

                          <div className="w-[50%]">
                            <Dropdown
                              value={roleDetails.department_id}
                              options={departmentOptions}
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  department_id: e.value,
                                });
                                validateDepartment(e.value);
                              }}

                              placeholder="Select Department"
                              className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                              // showClear
                              filter
                            />

                            {errors.department && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.department[0]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 md:mt-8 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2 mt-3">
                            Role Name <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={roleDetails.role_name}
                              maxLength={255}
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  role_name: e.target.value,
                                });
                                validateRoleName(e.target.value);
                              }}
                              className="w-full px-3 py-2 border border-[#D9D9D9] text-[#4A4A4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            />

                            {errors?.role_name && (
                              <p className="text-red-500 text-sm mb-4">{errors?.role_name}</p>
                            )}
                          </div>
                        </div>


                        <div className="mt-2 md:mt-8 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2 mt-3">
                            Status <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[50%]">
                            <select
                              name="status"
                              id="status"
                              value={roleDetails.status}
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  status: e.target.value,
                                });
                                validateStatus(e.target.value);
                              }}
                              className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            >
                              <option value="1">Active</option>
                              <option value="0">InActive</option>
                            </select>
                          </div>
                        </div>
                        {errors.status && (
                          <p className="text-red-500 text-sm mb-4">{errors.status}</p>
                        )}

                        <div className="flex justify-end gap-2 mt-14">
                          <button onClick={closeEditModal}
                            className="border border-[#7C7C7C] text-base md:text-xl text-[#7C7C7C] hover:bg-[#7C7C7C] hover:text-black px-3 md:px-5 py-1 md:py-2 font-medium rounded-[10px]">
                            Cancel
                          </button>
                          <button onClick={handleSave}
                            className="bg-[#1ea600] hover:bg-[#4BB452] hover:text-white border border-[#7C7C7C] text-base md:text-xl text-white px-4 md:px-5 py-2 font-medium rounded-[10px]">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* view modal */}
            {viewModalOpen && viewContact && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                <div className="relative bg-white w-[95%] md:w-[500px] rounded-xl shadow-lg p-6">

                  {/* Close Icon */}
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
                  >
                    <IoIosCloseCircle size={28} />
                  </button>

                  <h2 className="text-xl font-semibold mb-6 text-[#1ea600]">
                    Role Details
                  </h2>

                  <div className="space-y-4 text-sm text-gray-700">

                    <div className="flex justify-between">
                      <span className="font-medium">Role Name</span>
                      <span>{viewContact.role_name || "-"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">Department</span>
                      <span>
                        {viewContact.department?.department_name || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
              ${viewContact.status === "0" || viewContact.status === 0
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                          }`}
                      >
                        {viewContact.status === "0" || viewContact.status === 0
                          ? "Inactive"
                          : "Active"}
                      </span>
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
export default Roles_Mainbar;
