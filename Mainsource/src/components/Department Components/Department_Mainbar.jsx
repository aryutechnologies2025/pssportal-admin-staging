import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Loader from "../Loader";
import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig.js";
import { useRef } from "react";
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
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"
import { ps } from "zod/v4/locales";

const Department_Mainbar = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [pssCompany, setPssCompany] = useState(null); // selected value
const [pssCompanyOptions, setPssCompanyOptions] = useState([]); // dropdown list
  const [loading, setLoading] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [status, setStatus] = useState("");
  const [first, setFirst] = useState(0);
  const [errors, setErrors] = useState({
    departmentName: "",
    status: ""
  });
  console.log("....erors.... : ", errors);
  const DEPARTMENT_MIN_LENGTH = 2;
  const DEPARTMENT_MAX_LENGTH = 50;
  const tableRef = useRef(null);

  //local storage 
  // localStorage.setItem("pssuser", JSON.stringify(data.user));
  const storedDetatis = localStorage.getItem("pssuser");
  //  console.log("storedDetatis.... : ",storedDetatis)
  const parsedDetails = JSON.parse(storedDetatis);
  // console.log("....parsedDetails.... : ",parsedDetails)
  const userid = parsedDetails ? parsedDetails.id : null;
  // console.log("userid.... : ",userid)

  const [editingDeptId, setEditingDeptId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewContact, setViewContact] = useState(null);



  useEffect(() => {
    setFirst(0);
  }, [rows]);

  useEffect(() => {
    fetchDepartments();
  }, []);


  // view
  const openViewModal = async (row) => {
  const response = await axiosInstance.get(
    `${API_URL}api/department/edit/${row.id}`
  );

  if (response.data?.status) {
    setViewContact(response.data.data);
    setViewModalOpen(true);
  }
};

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_URL}api/department`);

      if (response.data.status === true) {
        setDepartments(response.data.data);
        setTotalRecords(response.data.data.length);
                      //  set pss company options
      const pssCompanyOptions = response.data.psscompany.map((company) => ({
        label: company.name,
        value: company.id,
      }));

      setPssCompanyOptions(pssCompanyOptions);
      } else {
        setDepartments([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error(err);
      setDepartments([]);

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
      setDepartmentName("");
      setPssCompany("");
      setStatus("");
      setErrors({
        departmentName: "",
        pssCompany: "",
        status: ""
      });
    }, 300);
  };

  const [departmentDetails, setDepartmentDetails] = useState({
    departmentName: "",
    company_id: "",
    status: "",
  });

 const openEditModal = async (row) => {
  console.log("EDit Row...:...",row)
  try {
    setEditingDeptId(row.id);
    setIsEditModalOpen(true);
    setIsAnimating(true);

    const response = await axiosInstance.get(
      `${API_URL}api/department/edit/${row.id}`
    );

    if (response.data?.status === true) {
      const data = response.data.data;

      setDepartmentDetails({
        departmentName: data.department_name,
        company_id: Number(data.company_id), 
        status: data.status?.toString(),
      });
    } else {
      toast.error("Failed to load department details");
    }
  } catch (error) {
    console.error("Edit fetch error:", error);
    toast.error("Unable to fetch department details");
  }
};



  const closeEditModal = () => {
    setIsAnimating(false);
    setEditingDeptId(null);
    setErrors({});
    setTimeout(() => setIsEditModalOpen(false), 250);
  };

  const handleCreateDepartment = async () => {
    let valid = true;

    setErrors({ departmentName: "", status: "", pssCompany: "" });

    if (!validateDepartmentName(departmentName)) valid = false;
    if (!validatePssCompany(pssCompany)) valid = false;

    if (status === "") {
      setErrors((prev) => ({
        ...prev,
        status: "Status is required",
      }));
      valid = false;
    }

    if (!valid) return;

    setSubmitting(true);

    try {
      const response = await axiosInstance.post(
        `${API_URL}api/department/create`,
        {
          department_name: departmentName.trim(),
          company_id: pssCompany,
          status,
          created_by: userid,
        }
      );

      console.log("Create Department Response:", response);

      if (response.data.status === true) {
        toast.success("Department created successfully");

        setTimeout(() => {
          closeAddModal();
          fetchDepartments();
        }, 1000);

      } else {
        const apiErrors = response.data?.errors;

        if (apiErrors?.department_name) {
          setErrors((prev) => ({
            ...prev,
            departmentName: apiErrors.department_name[0],
          }));
        } else {
          toast.error(response.data.message || "Failed to create department");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };




  const [submitting, setSubmitting] = useState(false);

  // edit
  const handleSave = async () => {
    let valid = true;

    setErrors({ departmentName: "", status: "" });

    if (!validateDepartmentName(departmentDetails.departmentName)) {
      valid = false;
    }

    if (!validatePssCompany(departmentDetails.company_id)) {
      valid = false;
    }

    if (departmentDetails.status === "") {
      setErrors((prev) => ({
        ...prev,
        status: "Status is required",
      }));
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await axiosInstance.post(
        `${API_URL}api/department/update/${editingDeptId}`,
        {
          department_name: departmentDetails.departmentName.trim(),
          company_id: departmentDetails.company_id,
          status: (departmentDetails.status),
          updated_by: userid,
        }
      );

      if (response.data.status === true || response.data.success === true) {
        toast.success("Department updated successfully");
        setTimeout(() => {
          closeEditModal();
          fetchDepartments();
        }, 800);;
      } else {
        toast.error(response.data.message || "Failed to update department");
      }
    } catch (error) {
      console.error("Update error:", error);

      const apiErrors = error.response?.data?.errors;

      if (apiErrors?.department_name) {
        setErrors((prev) => ({
          ...prev,
          departmentName: apiErrors.department_name[0],
        }));
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }

  };




  const validateDepartmentName = (value) => {
    let error = "";

    if (!value.trim()) {
      error = "Department name is required";
    } else if (value.trim().length < DEPARTMENT_MIN_LENGTH) {
      error = `Department name must be at least ${DEPARTMENT_MIN_LENGTH} characters`;
    } else if (value.trim().length > DEPARTMENT_MAX_LENGTH) {
      error = `Department name cannot exceed ${DEPARTMENT_MAX_LENGTH} characters`;
    }

    setErrors((prev) => ({
      ...prev,
      departmentName: error,
    }));

    return error === "";
  };

const validatePssCompany = (value) => {
  const error = !value ? "PSS Company is required" : "";
  setErrors(prev => ({ ...prev, pssCompany: error }));
  return error === "";
};

  const validateStatus = (value) => {
    setErrors(prev => ({
      ...prev,
      status: value === "" ? "Status is required" : ""
    }));
  };



  // delete

  const deleteDepartment = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#DF3A3A",
    }).then(async (result) => {
      if (result.isConfirmed) {

        axiosInstance.delete(`${API_URL}api/department/delete`, {
          data: {
            record_id: id
          }
        })
          .then((response) => {
            console.log("Delete response:", response.data);
            if (response.data.status === true || response.data.success === true) {
              toast.success("Department has been deleted.");
              setTimeout(() => {
                fetchDepartments();
              }, 800);
            } else {
              Swal.fire("Error!", response.data.message || "Failed to delete Department.", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting Department:", error);
            Swal.fire("Error!", "Failed to delete Department.", "error");
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
      header: "Department Name",
      field: "department_name",
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      field: "status",
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
            onClick={() => deleteDepartment(row.id)}
            className="text-red-500 cursor-pointer hover:scale-110 transition"
            title="Delete"
          />
        </div>
      ),
      style: { textAlign: "center", fontWeight: "medium" },
    },


  ];



  let navigate = useNavigate();

  return (
    <div className="flex  flex-col justify-between bg-gray-50  px-3 md:px-5 pt-2 md:pt-10 w-screen min-h-screen ">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className="">
              <Mobile_Sidebar />
            </div>

            <div className="flex justify-start gap-2 mt-2 md:mt-0 items-center">


              {/* <p className="text-sm text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                Dashboard
              </p>
              <p>{">"}</p> */}
              <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/employees")}>
                Employee
              </p>
              <p>{">"}</p>
              <p className="text-sm  md:text-md  text-[#1ea600]">Departments</p>
            </div>

            {/* Add Button */}
            {/* <div className="flex justify-between mt-1 md:mt-4">
              <div className="">
                <h1 className="text-3xl font-semibold">Departments</h1>
              </div>

              
            </div> */}

            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6">
              <div className="datatable-container mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-medium text-sm text-[#6B7280]">Show</span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({ label: v, value: v }))}
                      onChange={(e) => setRows(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">Entries per page</span>
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
                        className="w-full pl-10 pr-3 py-2 rounded-md text-sm border  border-[#D9D9D9] 
               focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                      />
                    </div>

                    <button
                      onClick={openAddModal}
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      Add Departments
                    </button>
                  </div>
                </div>
                <div className="table-scroll-container" id="datatable" ref={tableRef}>
                  <DataTable
                    value={departments}
                    paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords}
                    globalFilter={globalFilter}
                    globalFilterFields={["department_name", "status"]}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    onPage={(e) => {
                      setFirst(e.first);
                      setRows(e.rows);
                      tableRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    showGridlines
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

                  <div className="px-5 lg:px-14  py-2 md:py-10 text-[#4A4A4A] font-medium">
                    <p className="text-xl md:text-2xl ">Add Department</p>

                          {/* Pss company */}

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
  <label className="block text-md font-medium mb-2">
    Pss Company <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%]">
    <Dropdown
      value={pssCompany}
      options={pssCompanyOptions}
      // optionLabel="name"
      onChange={(e) => {
        setPssCompany(e.value);
        // validatePssCompany(e.value);
      }}
      placeholder="Select Pss Company"
      className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
      // showClear
      filter
    />

    {errors.pssCompany && (
      <p className="text-red-500 text-sm mt-1">
        {errors.pssCompany}
      </p>
    )}
  </div>
</div>

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label htmlFor="roleName"
                        className="block text-md font-medium mb-2 mt-3">
                        Department Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <input
                          type="text"
                          id="departmentName"
                          name="departmentName"
                          value={departmentName}
                          maxLength={DEPARTMENT_MAX_LENGTH + 5}
                          placeholder="Enter Department Name"
                          onChange={(e) => {
                            setDepartmentName(e.target.value);
                            validateDepartmentName(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.departmentName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.departmentName}
                          </p>
                        )}

                      </div>
                    </div>

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label htmlFor="status" className="block text-md font-medium mb-2 mt-3">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <select
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                            validateStatus(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        >
                          <option value="">Select a status</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {errors.status && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.status}
                          </p>
                        )}

                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-5 md:mt-14">
                      <button onClick={closeAddModal}
                        className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200">
                        Cancel
                      </button>
                      <button disabled={submitting}
                        onClick={handleCreateDepartment}
                        className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200">
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

                  <div className="px-5 lg:px-14 py-10 text-[#4A4A4A] font-semibold">
                    <p className="text-xl md:text-2xl ">Edit Department</p>

                          {/* Pss company */}

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
  <label className="block text-md font-medium mb-2">
    Pss Company <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%]">
    <Dropdown
       value={departmentDetails.company_id}
      options={pssCompanyOptions}
       optionLabel="label"
  optionValue="value"  
      onChange={(e) => {
        setDepartmentDetails({
          ...departmentDetails,
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
        {errors.pssCompany}
      </p>
    )}
  </div>
</div>

                    <div className="mt-10">
                      <div className="bg-white rounded-xl w-full">
                        <div className="mt-8 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2 mt-3">
                            Department Name <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={departmentDetails.departmentName}
                              maxLength={DEPARTMENT_MAX_LENGTH + 5}
                              onChange={(e) => {
                                setDepartmentDetails({
                                  ...departmentDetails,
                                  departmentName: e.target.value,
                                });
                                validateDepartmentName(e.target.value);
                              }}
                              className="w-full px-3 py-2 border border-[#D9D9D9] text-[#4A4A4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            />
                            {errors?.departmentName && (
                              <p className="text-red-500 text-sm mb-4">{errors?.departmentName}</p>
                            )}
                          </div>
                        </div>


                        <div className="mt-8 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2 mt-3">
                            Status <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[50%]">
                            <select
                              name="status"
                              id="status"
                              value={departmentDetails.status}
                              onChange={(e) => {
                                setDepartmentDetails({
                                  ...departmentDetails,
                                  status: e.target.value,
                                });
                                validateStatus(e.target.value);
                              }}
                              className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            >
                              <option value="1">Active</option>
                              <option value="0">InActive</option>
                            </select>
                            {errors.status && (
                              <p className="text-red-500 text-sm mb-4">{errors.status}</p>
                            )}
                          </div>
                        </div>


                        <div className="flex justify-end gap-2 mt-14">
                          <button onClick={closeEditModal}
                            className="border border-[#7C7C7C] text-base md:text-xl text-[#7C7C7C] hover:bg-[#7C7C7C] hover:text-black px-3 md:px-5 py-1 md:py-2 font-medium rounded-lg">
                            Cancel
                          </button>
                          <button onClick={handleSave}
                            className="bg-[#1ea600] hover:bg-[#4BB452] hover:text-white border border-[#7C7C7C] text-base md:text-xl text-white px-4 md:px-5 py-2 font-medium rounded-lg">
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
                    Department Details
                  </h2>

                  <div className="space-y-4 text-sm text-gray-700">

                    {/* Department Name */}
                    <div className="flex justify-between ">
                      <span className="font-medium">Department Name</span>
                      <span>{viewContact.department_name}</span>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between ">
                      <span className="font-medium">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
              ${viewContact.status === 1 || viewContact.status === "1"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                          }`}
                      >
                        {viewContact.status === 1 || viewContact.status === "1"
                          ? "Active"
                          : "Inactive"}
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
export default Department_Mainbar;