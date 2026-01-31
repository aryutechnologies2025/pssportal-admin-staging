import React, { useState, useEffect } from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { TfiPencilAlt } from "react-icons/tfi";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import Footer from "../Footer";

import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";

import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../Loader";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { FiSearch } from "react-icons/fi";


const Lead_Category_Details = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});
  // console.log("errors:", errors);
  const [isAnimating, setIsAnimating] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState([])
  // console.log("categoryDetails", categoryDetails)

    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading
  let navigate = useNavigate();

 const [filters, setFilters] = useState({
   status: "",
  });

  //  view
  useEffect(() => {
    fetchCategoryType();
  }, []);
  const fetchCategoryType = async () => {
    try {
      const response = await axiosInstance.get(
        // `${API_URL}/api/cate-mannagement-category/assetCategory`,
        // {withCredentials: true}
      );
      // console.log("response get check", response);

      setCategoryDetails(response?.data?.data)
      setLoading(false);


    } catch (err) {
      setErrors("Failed To Fetch Category.");
      setLoading(false);

    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
  };



  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
  };

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
    const statusOptions = [
      { label: "Active", value: 1 },
      { label: "Inactive", value: 0 },
    ];

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


  // create
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = {
        name: name,
        status: status,

      };

      const response = await axiosInstance.post(
        // `${API_URL}/api/asset-mannagement-category/create-assetCategory`,
        // formdata, {withCredentials: true}
      );


      setIsAddModalOpen(false);
      setName("");
      setStatus("");
      setErrors("");
      fetchCategoryType();

      toast.success("  Category Created Successfully.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };


  //  edit  
  const [nameEdit, setNameEdit] = useState("");
  const [statusEdit, setStatusEdit] = useState("");
  const [editId, setEditid] = useState("");

  const openEditModal = (row) => {
    // console.log("rowData", row);

    setEditid(row._id);
    setNameEdit(row.name);

    setStatusEdit(row.status);

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };


  const handlesubmitedit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors = {};
    if (!nameEdit.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!statusEdit) {
      newErrors.status = "Status is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const formData = {
        name: nameEdit,
        status: statusEdit,
      };

      const response = await axiosInstance.put(
        // `${API_URL}/api/asset-mannagement-category/edit-assetCategorydetails/${editId}`,
        // formData, {withCredentials: true}
      );
      // console.log("response:", response);


      setIsEditModalOpen(false);
      fetchCategoryType();
      setErrors({});
      toast.success(" Category Updated Successfully.");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
        toast.error("Failed To Update Category.");
      }
    }
  };





  // delete

  const deleteCategory = (editId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(
            // `${API_URL}/api/asset-mannagement-category/delete-assetCategoryDelete/${editId}`,{withCredentials: true}
        )
          .then((response) => {
            if (response.data) {
              toast.success("Category has been deleted.");
              fetchCategoryType(); // Refresh 
            } else {
              Swal.fire("Error!", "Failed to delete Category.", "error");
            }
          })
          .catch((error) => {

            Swal.fire("Error!", "Failed to delete Category.", "error");
          });
      }
    });
  };

  const dummyRoles = [
  {
    id: 1,
    name: "Admin",
    status: "1",
  },
  {
    id: 2,
    name: "HR",
    status: "0",
  },
  {
    id: 3,
    name: "Manager",
    status: "1",
  },
];


const columns = [
  {
    header: "S.No",
    body: (_, options) => options.rowIndex + 1,
    style: { width: "80px", textAlign: "center" },
  },
  {
    header: "Name",
    field: "name",
  },
  {
    header: "Status",
    body: (row) => (
      <div
        className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full border w-[100px]
          ${
            row.status === "1"
              ? "text-green-600 border-green-600 bg-green-50"
              : "text-red-600 border-red-600 bg-red-50"
          }`}
      >
        {row.status === "1" ? "Active" : "Inactive"}
      </div>
    ),
    style: { textAlign: "center" },
  },
  {
    header: "Action",
    body: (row) => (
      <div className="flex justify-center gap-3">
        <button
                     onClick={(e) => {
                       
                       openEditModal(row);
                     }}
                     className="text-[#1d6bf2] p-2 rounded-[10px] bg-[#f0f6ff] border cursor-pointer hover:scale-110 transition"
                     title="Edit"
                   >
                     <TfiPencilAlt />
                   </button>
         
                   <button
                     onClick={() => deleteCategory(row.id)}
                     className="text-[#db2525] bg-[#fff0f0] p-2 rounded-[10px] border cursor-pointer hover:scale-110 transition"
                     title="Delete"
                   >
                     <RiDeleteBin6Line />
                   </button>
      </div>
    ),
    style: { textAlign: "center", width: "150px" },
  },
];




  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>


            <div className="">
              <Mobile_Sidebar />

            </div>
            <div className="flex justify-start mt-2 md:mt-0 gap-1 items-center">
              <p
                className="text-xs md:text-sm text-gray-500 cursor-pointer"
                onClick={() => navigate("/lead-dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              
              <p className="text-xs md:text-sm text-[#1ea600] cursor-pointer">Category</p>
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
        
            {/* Add Button */}
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
                             Add Category
                           </button>
                         </div>
                       </div>
                       {/* Responsive wrapper for the table */}
                       <div className="table-scroll-container">
                <DataTable
  value={dummyRoles}
   onRowClick={(e) => e.originalEvent.stopPropagation()}
   
  dataKey="id"
  paginator
  rows={rows}
                rowsPerPageOptions={[10, 25, 50, 100]}
                globalFilter={globalFilter}
                globalFilterFields={
                    ["name", "status"]
                }
  showGridlines
  emptyMessage="No data found"
  className="mt-8"
  resizableColumns
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
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


            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div className="absolute inset-0 " onClick={closeAddModal}></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Toggle Sidebar"
                    onClick={closeAddModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="p-5">
                    <p className="text-2xl md:text-3xl font-medium">Category</p>
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[70%] md:w-[50%]">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter Your Name "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mb-4">{errors.name}</p>
                        )}
                      </div>
                    </div>


                    {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                    <div className="mt-5 flex justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="status"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>

                      </div>
                      <div className="w-[70%] md:w-[50%]">
                        <select
                          name="status"
                          id="status"
                          onChange={(e) => {
                            setStatus(e.target.value);
                            validateStatus(e.target.value); // Validate status dynamically
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    {/* {error.status && <p className="error">{error.status}</p>} */}

                    <div className="flex  justify-end gap-2 mt-6 md:mt-14">
                      <button
                        onClick={closeAddModal}
                         className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-[#1ea600] text-white  hover:bg-[#33cd10] px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                        onClick={handlesubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isEditModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div className="absolute inset-0 " onClick={closeEditModal}></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Toggle Sidebar"
                    onClick={closeEditModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="p-5">
                    <p className="text-2xl md:text-3xl font-medium">Category Edit</p>
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[70%] md:w-[50%]">
                        <input
                          type="text"
                          value={nameEdit}
                          onChange={(e) => setNameEdit(e.target.value)}
                          placeholder="Enter Your Name "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mb-4">{errors.name}</p>
                        )}
                      </div>
                    </div>


                    {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                    <div className="mt-5 flex justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="status"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>

                      </div>
                      <div className="w-[70%] md:w-[50%]">
                        <select
                          name="status"
                          id="status"
                          value={statusEdit}
                          onChange={(e) => {
                            setStatusEdit(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    {/* {error.status && <p className="error">{error.status}</p>} */}

                    <div className="flex  justify-end gap-2 mt-7 md:mt-14">
                      <button
                        onClick={closeEditModal}
                         className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-[#1ea600] text-white  hover:bg-[#33cd10] px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                        onClick={handlesubmitedit}
                      >
                        Submit
                      </button>
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
export default Lead_Category_Details;


