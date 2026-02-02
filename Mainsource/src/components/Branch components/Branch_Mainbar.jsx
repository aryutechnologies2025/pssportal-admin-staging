import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Loader from "../Loader";
import axiosInstance from "../../axiosConfig.js";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowForward } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z, { set, string } from "zod";
import Swal from "sweetalert2";
import { Capitalise } from "../../hooks/useCapitalise.jsx";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"

const Branch_Mainbar = () => {
  const [modalOpen, setIsModalOpen] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchEditData, setBranchEditData] = useState(null);
  const [pssCompany, setPssCompany] = useState(null); // selected value
  const [pssCompanyOptions, setPssCompanyOptions] = useState([]); // dropdown list
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  // const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewContact, setViewContact] = useState(null);
  //   const [totalRecords, setTotalRecords] = useState(0);

  // Local storage
  const storedDetails = localStorage.getItem("pssuser");
  const parsedDetails = storedDetails ? JSON.parse(storedDetails) : null;
  const userId = parsedDetails ? parsedDetails.id : null;
  const [page, setPage] = useState(1);
  const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);

  };

  const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };
  // Zod schema for branch validation
  const branchSchema = z.object({
    branch_name: z
      .string().trim()
      .min(1, "Branch name is required")
      .max(100, "Branch name is too long"),
    pssCompany: z
      .string().trim()
      .min(1, "Pss Company is required")
      .max(100, "Pss Company is too long"),
    address: z
      .string().trim()
      .min(1, "Address is required")
      .max(100, "Address name is too long"),
    city: z
      .string().trim()
      .min(1, "City is required")
      .max(100, "City name is too long"),
    state: z
      .string().trim()
      .min(1, "State is required")
      .max(100, "State name is too long"),
    pincode: z
      .string().trim()
      .min(1, "Pincode is required")
      .regex(/^\d+$/, "Pincode must contain only numbers")
      .length(6, "Pincode must be exactly 6 digits"),
    country: z
      .string().trim()
      .min(1, "Country is required")
      .max(100, "Country name is too long"),
    status: z.enum(["0", "1"], {
      required_error: "Status is required",
      invalid_type_error: "Status must be either Active or Inactive",
    }),
  });

  // React Hook Form setup
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: submitting },
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      pssCompany: "",
      branch_name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      status: "1",
    },
  });

  const navigate = useNavigate();

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/branches`);
      if (response.data.success === true) {
        setBranches(response.data.data);
        // setTotalRecords(response.data.data.length);

        //  set pss company options
        const pssCompanyOptions = response.data.psscompany.map((company) => ({
          label: company.name,
          value: company.id,
        }));

        setPssCompanyOptions(pssCompanyOptions);

      } else {
        setBranches([]);
        setPssCompanyOptions([]);
        // setTotalRecords(0);
      }



    } catch (err) {
      console.error(err);
      setBranches([]);
      setPssCompanyOptions([]);
      //   setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Open and close modals
  const openModal = async (row) => {
    if (row) {
      setBranchEditData(row);
      setPssCompany(row.company_id);
      reset({
        ...row,
        pssCompany: String(row.company_id)
      });
      setIsModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setBranchEditData(null);
      // reset({
      //   keepDefaultValues: true,
      // });
      reset({});
      await new Promise((resolve) => setTimeout(resolve, 0)); // Next tick
      reset();
      setIsModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    }
  };

  const closeModal = () => {
    setIsAnimating(false);

    setTimeout(() => {
      setIsModalOpen(false);
      setBranchEditData(null);
      reset();
    }, 300);
  };

  // Handle form submission
  const onSubmit = async (data) => {

    const isDuplicate = branches.some((branch) => {
      // If editing, exclude the current branch being edited from the check
      if (branchEditData && branch.id === branchEditData.id) {
        return false;
      }
      return branch.branch_name.toLowerCase() === data.branch_name.trim().toLowerCase();
    });

    if (isDuplicate) {
      toast.error("A branch with this name already exists!");
      return; // Stop the submission
    }

    try {
      const payload = {
        company_id: Number(data.pssCompany),
        branch_name: data.branch_name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        pincode: data.pincode,
        country: data.country.trim(),
        status: data.status,
        created_by: userId,
      };

      let response;

      if (branchEditData) {
        response = await axiosInstance.post(
          `api/branches/update/${branchEditData.id}`,
          payload
        );
      } else {
        response = await axiosInstance.post(`api/branches/create`, payload);
      }

      if (response.data.success === true || response.data.status === true) {
        const message = response.data.message;
        toast.success(message);
        closeModal();
        setBranches((prevBranches) => {
          if (branchEditData) {
            return prevBranches.map((branch) =>
              branch.id === branchEditData.id ? response.data.data : branch
            );
          } else {
            return [...prevBranches, payload];
          }
        });
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving branch:", error);
      toast.error(
        error.response?.data?.message ||
        `Failed to ${branchEditData ? "update" : "create"} branch`
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this role?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axiosInstance.delete(`api/branches/delete`, {
            data: {
              record_id: id,
            },
          });
          if (response.data.status === true) {
            toast.success(response.data.message);
            setBranches((prevBranches) =>
              prevBranches.filter((branch) => branch.id !== id)
            );
          } else {
            toast.error(response.data.message || "Failed to delete branch");
          }
        }
      });
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };



  const columns = [
    {
      header: "S.No",
      body: (rowData, options) => options.rowIndex + 1,
      style: { textAlign: "center", width: "80px", fontWeight: "medium" },
    },

    {
      field: "city",
      field: "branch_name",
      header: "Branch Name",
      body: (row) => Capitalise(row.branch_name ? row.branch_name : "-"),
      style: { textAlign: "center", fontWeight: "medium" },
    },
    // {
    //   header: "Address",
    //   body: (row) => Capitalise(row.address ? row.address : "-"),
    //   style: { textAlign: "center", fontWeight: "medium" },
    // },
    {
      field: "city",
      header: "City",
      body: (row) => Capitalise(row.city ? row.city : "-"),
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      header: "State",
      field: "state",
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      header: "Pincode",
      field: "pincode",
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      header: "Country",
      field: "country",
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      field: "status",
      header: "Status",
      body: (row) => (
        <div
          className={`inline-block text-sm font-normal rounded-full w-[100px] justify-center items-center border 
            ${row.status === 0 || row.status === "0"
              ? "text-[#DC2626] bg-[#FFF0F0]"
              : "text-[#16A34A] bg-green-100"
            }`}
        >
          {row.status === 0 || row.status === "0" ? "Inactive" : "Active"}
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
              setViewContact(row);
              setViewModalOpen(true);
            }}
            className="p-1 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>
          <TfiPencilAlt
            onClick={() => openModal(row)}
            className="text-[#1ea600] cursor-pointer hover:scale-110 transition"
            title="Edit"
            size={18}
          />
          <RiDeleteBin6Line
            onClick={() => handleDelete(row.id)}
            className="text-red-500 cursor-pointer hover:scale-110 transition"
            title="Delete"
            size={18}
          />
        </div>
      ),
      style: { textAlign: "center", fontWeight: "medium" },
    },
  ];

  const globalFields = columns
    .filter(col => col.field && !col.body) // exclude action/status
    .map(col => col.field);

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
              <p
                className="text-sm md:text-md text-gray-500  cursor-pointer"
                onClick={() => navigate("/employees")}
              >
                Employee
              </p>
              <p>{">"}</p>
              <p className="text-sm  md:text-md  text-[#1ea600]">Branches</p>
            </div>

            <div
              className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
                        shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
                        px-2 py-2 md:px-6 md:py-6"
            >
              <div className="datatable-container md:mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-medium text-sm text-[#6B7280]">Show</span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({
                        label: v,
                        value: v,
                      }))}
                      onChange={(e) =>  onRowsChange(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">
                      Entries Per Page
                    </span>
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
                      onClick={() => openModal()}
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] text-sm md:text-base font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      Add Branch
                    </button>
                  </div>
                </div>
                <div className="table-scroll-container" id="datatable">

                  <DataTable
                    className="mt-2 md:mt-8"
                    value={branches}
                    paginator
                    rows={rows}
                    first={(page - 1) * rows}
                    onPage={onPageChange}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    globalFilter={globalFilter}
                    globalFilterFields={["branch_name",
                      "city",
                      "state",
                      "pincode",
                      "country",
                      "status"]}
                    // globalFilterFields={globalFields}
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
            {modalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                <div className="absolute inset-0" onClick={closeModal}></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    onClick={closeModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="px-5 lg:px-14  py-5 md:py-10 text-[#4A4A4A] font-medium">
                    <p className="text-xl md:text-2xl ">
                      {" "}
                      {branchEditData ? "Edit Branch" : "Add Branch"}
                    </p>
                    <form onSubmit={handleSubmit(onSubmit, (error) => {
                      console.log("Form Errors:", error)
                    })}>

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
                              console.log(e.value);
                              setValue("pssCompany", String(e.value)); // Update RHF value
                            }}
                            placeholder="Select Pss Company"
                            className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                            filter
                          />

                          {errors.pssCompany && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.pssCompany.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Address Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="branch_name"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Branch Name <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            id="branch_name"
                            {...register("branch_name")}
                            placeholder="Enter Branch Name"
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.branch_name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.branch_name.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Address Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="address"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Address <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            id="address"
                            {...register("address")}
                            placeholder="Enter Address"
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.address && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.address.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* City Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="city"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            id="city"
                            {...register("city")}
                            placeholder="Enter City"
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* State Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="state"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          State <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            id="state"
                            {...register("state")}
                            placeholder="Enter State"
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Pincode Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="pincode"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            id="pincode"
                            {...register("pincode")}
                            placeholder="Enter Pincode"
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.pincode && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.pincode.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Country Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="country"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Country <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            id="country"
                            {...register("country")}
                            placeholder="Enter Country"
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.country && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.country.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Status Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="status"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <select
                            id="status"
                            {...register("status")}
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {errors.status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.status.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Submit Button */}
                      <div className="flex justify-end gap-2 mt-5 md:mt-14">
                        <button
                          type="button"
                          onClick={closeModal}
                          className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                        >
                          {submitting
                            ? "Submitting..."
                            : branchEditData
                              ? "Update"
                              : "Submit"}
                        </button>
                      </div>
                    </form>
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
                    Branch Details
                  </h2>

                  <div className="space-y-4 text-sm text-gray-700">

                    <div className="flex justify-start">
                      <span className="font-medium">Branch Name:</span>
                      <span>{Capitalise(viewContact.branch_name || "-")}</span>
                    </div>

                    <div className="flex justify-Start">
                      <span className="font-medium">Address:</span>
                      <span>{Capitalise(viewContact.address || "-")}</span>
                    </div>

                    <div className="flex justify-Start">
                      <span className="font-medium">City:</span>
                      <span>{Capitalise(viewContact.city || "-")}</span>
                    </div>

                    <div className="flex justify-Start">
                      <span className="font-medium">State:</span>
                      <span>{Capitalise(viewContact.state || "-")}</span>
                    </div>

                    <div className="flex justify-Start">
                      <span className="font-medium">Pincode:</span>
                      <span>{viewContact.pincode || "-"}</span>
                    </div>

                    <div className="flex justify-Start">
                      <span className="font-medium">Country:</span>
                      <span>{Capitalise(viewContact.country || "-")}</span>
                    </div>

                    <div className="flex justify-Start items-center">
                      <span className="font-medium">Status:</span>
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
      )}
      <Footer />
    </div>
  );
};
export default Branch_Mainbar;
