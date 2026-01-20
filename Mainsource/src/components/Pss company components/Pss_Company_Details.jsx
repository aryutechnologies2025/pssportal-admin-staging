import React, { useState, useEffect } from "react";

// import DataTable from "datatables.net-react";
// import DT from "datatables.net-dt";
// import "datatables.net-responsive-dt/css/responsive.dataTables.css";
// DataTable.use(DT);
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";


import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";


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
import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";
import Loader from "../Loader";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";

const Pss_Company_Details = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pssCompany, setPssCompany] = useState([]);
  
  const [loading, setLoading] = useState(true);
  
  const [address, setAddress] = useState("");

  // Fetch roles from the API

  useEffect(() => {
    fetchPssCompanies();
  }, []);


  const validateCompanyName = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.name = ["Company name is required"];
    } else {
      delete newErrors.name;
    }
    setErrors(newErrors);
  };

  const [company_Name, setCompany_Name] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  


  //local storage 
  // localStorage.setItem("pssuser", JSON.stringify(data.user));
  const storedDetatis = localStorage.getItem("pssuser");
  //  console.log("storedDetatis.... : ",storedDetatis)
  const parsedDetails = JSON.parse(storedDetatis);
  // console.log("....parsedDetails.... : ",parsedDetails)
  const userid = parsedDetails ? parsedDetails.id : null;
  // console.log("userid.... : ",userid)

  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewContact, setViewContact] = useState(null);
const [first, setFirst] = useState(0);
  const onPageChange = (e) => {
    setPage(e.first ); // PrimeReact is 0-based
    setRows(e.rows);

  };

  const onRowsChange = (newRows) => {
  const totalPages = Math.ceil(totalRecords / newRows);

  const currentPage = Math.floor(first / rows) + 1;

  // If current page exceeds new total pages → move to last page
  const safePage = Math.min(currentPage, totalPages);

  const newFirst = (safePage - 1) * newRows;

  setRows(newRows);
  setFirst(newFirst);
};

useEffect(() => {
  if (first >= totalRecords && totalRecords > 0) {
    const lastPageFirst = Math.max(totalRecords - rows, 0);
    setFirst(lastPageFirst);
  }
}, [totalRecords]);


const openViewModal = async (row) => {
  const response = await axiosInstance.get(
    `${API_URL}api/pss-company/edit/${row.id}`
  );

  if (response.data?.status) {
    setViewContact(response.data.data);
    setViewModalOpen(true);
  }
};

  const fetchPssCompanies = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}api/pss-company`
    );

    //   console.log("...CompanyFetching All.... : ", response.data);

      if (response.data.success === true) {
        // company
        setPssCompany(response.data.data || []);
        setTotalRecords(response.data.data.length || 0);

     
      } else {
        setPssCompany([]);
        
        setTotalRecords(0);
      }
    } catch (err) {
      console.error("Failed to fetch roles", err);
      setPssCompany([]);
     
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
      setCompany_Name("");
      setStatus("");
      setErrors({});
    }, 300);
  };


  const [companyDetails, setCompanyDetails] = useState({
    company_name: "",
    address: "",
    status: "",
  });


 
   const openEditModal = async (row) => {

    try{
          setEditingCompanyId(row.id);
    setIsEditModalOpen(true);
    setIsAnimating(true);

    const response = await axiosInstance.get(
      `${API_URL}api/pss-company/edit/${row.id}`
    );

    if (response.data?.status === true) {
      const data = response.data.data;

       setCompanyDetails({
      company_name: row.name || "",
      address: row.address || "",
      status: row.status || "1",
    });
    }
    else{
      toast.error("Failed To Load Company Details"); 
    }
  }catch(err){
      console.error("Edit fetch error:", err);
      toast.error("Unable To Fetch Company Details");
    }
  };


  const closeEditModal = () => {
    setIsAnimating(false);
    setEditingCompanyId(null);
    setCompanyDetails({ company_name: "",address: "", status: "" });
    setErrors({});
    setTimeout(() => setIsEditModalOpen(false), 250);
  };


  const isDuplicateCompany = (name) => {
  return pssCompany.some(
    (company) =>
      company.name?.trim().toLowerCase() === name.trim().toLowerCase()
  );
};


  const validateCreateForm = () => {
    let newErrors = {};

    const trimmedName = company_Name?.trim();

     if (!trimmedName) {
    newErrors.company_Name = ["Company name is required"];
  } else if (isDuplicateCompany(trimmedName)) {
    newErrors.company_Name = ["Company name already exists"];
  }


    if (!address || address.trim() === "") {
      newErrors.address = ["Address is required"];
    }

    if (status === "" || status === null) {
      newErrors.status = ["Status is required"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isDuplicateCompanyEdit = (name) => {
  return pssCompany.some(
    (company) =>
      company.id !== editingCompanyId &&
      company.name?.trim().toLowerCase() === name.trim().toLowerCase()
  );
};

const validateEditForm = () => {
  let newErrors = {};

  const trimmedName = companyDetails.company_name?.trim();
 if (!trimmedName) {
    newErrors.company_name = ["Company name is required"];
  } else if (isDuplicateCompanyEdit(trimmedName)) {
    newErrors.company_name = ["Company name already exists"];
  }

  if (!companyDetails.address?.trim()) {
    newErrors.address = ["Address is required"];
  }

  if (companyDetails.status === "" || companyDetails.status === null) {
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
        name:company_Name.trim(),
        address,
        status,
        created_by: userid,
      };

      const response = await axiosInstance.post(
        `${API_URL}api/pss-company/create`,
        formdata
      );

        console.log("Create Company Response:", response);

      if (response.data.status === true || response.data.success === true) {
        toast.success("company created successfully");
        fetchPssCompanies();
        setCompany_Name("");
        setAddress("");
        setStatus("");
        closeAddModal();
      } else {
        toast.error("Failed to create company");
      }
    } catch (err) {
      toast.error("Error creating company");
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
        `${API_URL}api/pss-company/update/${editingCompanyId}`,
         {
        name: companyDetails.company_name,
        address: companyDetails.address,
        status: companyDetails.status,
        updated_by: userid,
      }
      );

      if ( response.data.success === true || response.data.status === true) {
        toast.success("Company updated successfully");
        closeEditModal();
        fetchPssCompanies();
      } else {
        toast.error(response.data.message ||"Failed to update company");
        
      }
    } catch (err) {
        
      toast.error("Error updating company");
      
    }
  };



  // Validate Company Name dynamically
  const ValidateCompanyName = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.company_name = ["Company name is required"];
    } else {
      delete newErrors.company_name;
    }
    setErrors(newErrors);
  };

    // Validate Address dynamically
   const validateAddress = (value) => {
  const newErrors = { ...errors };

  if (!value?.trim()) {
    newErrors.address = ["Address is required"];
  } else {
    delete newErrors.address;
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


  const deleteCompany = async (companyId) => {
 

    if (!companyId) {
    toast.error("Company ID missing");
    return;
  }

   const result =  await Swal.fire({
      title: "Are You Sure?",
      text: "Do You Want To Delete This Company?",
      icon: "warning",
      showCancelButton: true,

      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Delete It!",

    
   }).then(async (result) => {
    if (result.isConfirmed) {
        
      try {
        const response = await axiosInstance.delete(
          `${API_URL}api/pss-company/delete`,{
          data: {
            record_id: companyId
          }
        })
        // console.log("Delete Response 👉", response);
        if (response.data.success === true || response.data.status === true) {
          toast.success("Company has been deleted");
          fetchPssCompanies();
        } else {
          toast.error(response.data.message || "Delete failed");
        }
      } catch (err) {
        toast.error("Failed to delete company");
        // console.log("error....:...",err)
      }
    }
  });
};

const dummyCompanies = [
  {
    id: 1,
    company_name: "Foxconn Honhai Technology India Pvt Ltd",
    address: "Sriperumbudur, Chennai, Tamil Nadu",
    status: 1,
  },
  {
    id: 2,
    company_name: "ABC Technology Solutions",
    address: "Whitefield, Bengaluru, Karnataka",
    status: 0,
  },
  {
    id: 3,
    company_name: "NextGen Automation Pvt Ltd",
    address: "Hinjewadi Phase 2, Pune, Maharashtra",
    status: 1,
  },
  
];


  const columns = [
    {
      header: "S.No",
      body: (rowData, options) => options.rowIndex + 1,
      style: { textAlign: "center", width: "80px", fontWeight: "medium" },
      fixed: true,
    },
    {
      header: "Company Name",
      field: "name",
  
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
        header: "Address",
        field: "address",
       
        style: { textAlign: "center", fontWeight: "medium" },
    },
    // {
    //   header: "Department",
    //   body: (row) => row.department?.department_name || "-",
    //   style: { textAlign: "center", fontWeight: "medium" },
    // },
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
              openViewModal(row);
              setViewModalOpen(true);
            }}
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>

<button
onClick={() => {

              openEditModal(row);

            }}
            className="text-[#1d6bf2] p-2 rounded-[10px] bg-[#f0f6ff] border cursor-pointer hover:scale-110 transition"
            title="Edit">
<TfiPencilAlt/>
</button>
          
<button onClick={() => {
    
    deleteCompany(row?.id);
  }}
           className="text-[#db2525] bg-[#fff0f0] p-2 rounded-[10px] border cursor-pointer hover:scale-110 transition"
            title="Delete">
<RiDeleteBin6Line/>
</button>
          
        </div>
      ),
      style: { textAlign: "center", fontWeight: "medium" },
    },


  ];

//   console.log("columns", columns)


  let navigate = useNavigate();

  return (
    <div className="flex  flex-col justify-between bg-gray-50  px-3 md:px-5 pt-2 md:pt-10 w-screen min-h-screen ">
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

              {/* <p className="text-sm text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                Dashboard
              </p>
              <p>{">"}</p> */}
              <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-sm  md:text-md  text-[#1ea600]">Pss Company</p>
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
              <div className="datatable-container mt-4">
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
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      Add Company
                    </button>
                  </div>
                </div>
                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    className="mt-8"
                    value={pssCompany}
                    paginator
                    rows={rows}
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

                  <div className="px-5 lg:px-14  py-2 md:py-10 text-[#4A4A4A] font-medium">
                    <p className="text-xl md:text-2xl ">Add Company</p>

                    {/* <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <select
                          name="company_Name"
                          id="company_Name"
                          value={company_Name}
                          className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          onChange={(e) => {
                            setCompany_Name(e.target.value);
                            validateCompanyName(e.target.value);
                          }}
                        >
                          <option value="">Select Department</option>

                          {departments.map((dept) => (
                            <option key={dept.id || dept._id} value={dept.id || dept._id}>
                              {dept.name || dept.department_name}
                            </option>
                          ))}
                        </select>

                        {errors.department && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.department[0]}
                          </p>
                        )}

                      </div>
                    </div> */}



                    {/* <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label htmlFor="roleName" className="block text-md font-medium mb-2 mt-3">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <input
                          type="text"
                          id="company_Name"
                          name="company_Name"
                          value={company_Name}
                          placeholder="Enter Company Name"
                          onChange={(e) => {
                            setCompany_Name(e.target.value);
                            validateCompanyName(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.company_Name && (
                          <p className="text-red-500 text-sm mb-4 mt-1">{errors.company_Name[0]}</p>
                        )}
                      </div>
                    </div> */}

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label htmlFor="roleName" className="block text-md font-medium mb-2 mt-3">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <input
                          type="text"
                          id="company_Name"
                          name="company_Name"
                          value={company_Name}
                          placeholder="Enter Company Name"
                          onChange={(e) => {
                            setCompany_Name(e.target.value);
                            validateCompanyName(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.company_Name && (
                          <p className="text-red-500 text-sm mb-4 mt-1">{errors.company_Name[0]}</p>
                        )}
                      </div>
                    </div>

{/* Address */}
                                        <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label htmlFor="roleName" className="block text-md font-medium mb-2 mt-3">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={address}
                          placeholder="Enter Address"
                          onChange={(e) => {
                            setAddress(e.target.value);
                            validateAddress(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mb-4 mt-1">{errors.address[0]}</p>
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
                          <option value="">Select a status</option>
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

                  <div className="px-5 lg:px-14 py-10 text-[#4A4A4A] font-semibold">
                    <p className="text-xl md:text-2xl ">Edit Company</p>

                    <div className="mt-10">
                      <div className="bg-white rounded-xl w-full">
                        {/* <div className="mt-8 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            Department <span className="text-red-500">*</span>
                          </label>

                          <div className="w-[50%]">
                            <select
                              value={roleDetails.department_id}
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  department_id: e.target.value,
                                });
                                validateDepartment(e.target.value);
                              }}
                              className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            >
                              <option value="">Select Department</option>

                              {departments.map((dept) => (
                                <option key={dept.id} value={dept.id.toString()}>
                                  {dept.department_name}
                                </option>
                              ))}
                            </select>


                            {errors.department && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.department[0]}
                              </p>
                            )}
                          </div>
                        </div> */}

                        <div className="mt-8 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2 mt-3">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={companyDetails.company_name}
                              onChange={(e) => {
                                setCompanyDetails({
                                  ...companyDetails,
                                  company_name: e.target.value,
                                });
                                validateCompanyName(e.target.value);
                              }}
                              className="w-full px-3 py-2 border border-[#D9D9D9] text-[#4A4A4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            />

                            {errors?.company_name && (
                              <p className="text-red-500 text-sm mb-4">{errors?.company_name}</p>
                            )}
                          </div>
                        </div>

{/* address */}
 <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label htmlFor="roleName" className="block text-md font-medium mb-2 mt-3">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={companyDetails.address}
                          placeholder="Enter Address"
                          onChange={(e) => {
    setCompanyDetails({
      ...companyDetails,
      address: e.target.value,
    });
    validateAddress(e.target.value);
  }}
                          className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mb-4 mt-1">{errors.address[0]}</p>
                        )}
                      </div>
                    </div>

{/* status */}
                        <div className="mt-8 flex justify-between items-center">
                          <label className="block text-md font-medium mb-2 mt-3">
                            Status <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[50%]">
                            <select
                              name="status"
                              id="status"
                              value={companyDetails.status}
                              onChange={(e) => {
                                setCompanyDetails({
                                  ...companyDetails,
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
                            className="text-white bg-[#1ea600] hover:bg-[#4BB452] hover:text-white border border-[#7C7C7C] text-base md:text-xl  px-4 md:px-5 py-2 font-medium rounded-[10px]">
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
                    Company Details
                  </h2>

                 <div className="space-y-4 text-sm">

  <div className="flex gap-4">
    <span className="w-32 font-medium text-gray-700">
      Company Name
    </span>
    <span className="flex-1 text-gray-600 break-words">
      {viewContact.name || "-"}
    </span>
  </div>

  <div className="flex gap-4">
    <span className="w-32 font-medium text-gray-700">
      Address
    </span>
    <span className="flex-1 text-gray-600 break-words leading-relaxed">
      {viewContact.address || "-"}
    </span>
  </div>

  <div className="flex gap-4 items-center">
    <span className="w-32 font-medium text-gray-700">
      Status
    </span>
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
export default Pss_Company_Details;
