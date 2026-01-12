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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowForward } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Swal from "sweetalert2";

// let response = {
//   data: {
//     success: true,
//     message: "Shifts fetched successfully",
//     data: [
//       {
//         id: 1,
//         shift_name: "Day Shift 1",
//         start_time: "07:00",
//         end_time: "03:00",
//       },
//       {
//         id: 2,
//         shift_name: "Day Shift 2",
//         start_time: "03:00",
//         end_time: "11:00",
//       },
//       {
//         id: 3,
//         shift_name: "Night Shift 1",
//         start_time: "11:00",
//         end_time: "07:00",
//       },
//     ],
//   },
// };

const Shift_Mainbar = () => {
  const [modalOpen, setIsModalOpen] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [shiftEditData, setShiftEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  // const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  //   const [totalRecords, setTotalRecords] = useState(0);
  console.log("shifts :", shifts);
  // Local storage
  const storedDetails = localStorage.getItem("pssuser");
  const parsedDetails = storedDetails ? JSON.parse(storedDetails) : null;
  const userId = parsedDetails ? parsedDetails.id : null;

  // Zod schema for branch validation
  const branchSchema = z.object({
    shift_name: z
      .string()
      .min(1, "Shift name is required")
      .max(100, "Shift name is too long"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: submitting },
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      shift_name: "",
      start_time: "",
      end_time: "",
    },
  });

  const navigate = useNavigate();

  // const onPageChange = (e) => {
  //   setPage(e.page + 1); // PrimeReact is 0-based
  //   setRows(e.rows); // page size
  // };

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/shifts`);
      if (response.data.success === true) {
        setShifts(response.data.data);
        // setTotalRecords(response.data.data.length);
      } else {
        setShifts([]);
        // setTotalRecords(0);
      }
    } catch (err) {
      console.error(err);
      setShifts([]);
      //   setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // Open and close modals
  const openModal = async (row) => {
    if (row) {
      setShiftEditData(row);
      reset(row);
      setIsModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setShiftEditData(null);
      reset({
        keepDefaultValues: true,
      });
      setIsModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    }
  };

  const closeModal = () => {
    setIsAnimating(false);

    setTimeout(() => {
      setIsModalOpen(false);
      setShiftEditData(null);
      reset();
    }, 300);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const payload = {
        shift_name: data.shift_name.trim(),
        start_time: data.start_time.trim(),
        end_time: data.end_time.trim(),
        created_by: userId,
      };

      let response;

      if (shiftEditData) {
        response = await axiosInstance.post(
          `api/shifts/update/${shiftEditData.id}`,
          payload
        );
      } else {
        response = await axiosInstance.post(`api/shifts/create`, payload);
      }

      if (response.data.success === true || response.data.status === true) {
        const message = response.data.message;
        toast.success(message);
        closeModal();
        setShifts((prevBranches) => {
          if (shiftEditData) {
            return prevBranches.map((branch) =>
              branch.id === shiftEditData.id ? response.data.data : branch
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
          `Failed to ${shiftEditData ? "update" : "create"} branch`
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this shift?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axiosInstance.delete(
            `api/shifts/delete/${id}`
          );
          if (response.data.success === true) {
            toast.success(response.data.message);
            setShifts((prevShifts) => prevShifts.filter((s) => s.id !== id));
          } else {
            toast.error(response.data.message || "Failed to delete shift");
          }
        }
      });
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const columns = [
    {
      field: "S.No.",
      header: "S. No.",
      body: (row, options) => options.rowIndex + 1,
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      field: "shift_name",
      header: "Shift Name",
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      field: "start_time",
      header: "Start Time",
      body: (row) => formatTime(row.start_time),
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      field: "end_time",
      header: "End Time",
      body: (row) => formatTime(row.end_time),
      style: { textAlign: "center", fontWeight: "medium" },
    },
    {
      field: "Action",
      header: "Action",
      body: (row) => (
        <div className="flex justify-center gap-3">
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
              <ToastContainer position="top-right" autoClose={3000} />
              <p
                className="text-sm md:text-md text-gray-500  cursor-pointer"
                onClick={() => navigate("/employees")}
              >
                Employee
              </p>
              <p>{">"}</p>
              <p className="text-sm  md:text-md  text-[#1ea600]">Shifts</p>
            </div>

            <div
              className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
                        shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
                        px-2 py-2 md:px-6 md:py-6"
            >
              <div className="datatable-container mt-4">
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
                      onChange={(e) => setRows(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">
                      Entries per page
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
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      Add Shift
                    </button>
                  </div>
                </div>
                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    className="mt-8"
                    value={shifts}
                    paginator
                    rows={rows}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    globalFilter={globalFilter} // This makes the search work
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
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                    isAnimating ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    onClick={closeModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="px-5 lg:px-14  py-2 md:py-10 text-[#4A4A4A] font-medium">
                    <p className="text-xl md:text-2xl ">
                      {" "}
                      {shiftEditData ? "Edit Shift" : "Add Shift"}
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* Address Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="shift_name"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Shift Name <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="text"
                            id="shift_name"
                            {...register("shift_name")}
                            placeholder="Enter Shift Name"
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.shift_name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.shift_name.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* start time Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="start_time"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="time"
                            id="start_time"
                            {...register("start_time")}
                            placeholder="Enter Start Time"
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.start_time && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.start_time.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* end time Field */}
                      <div className="mt-2 md:mt-8 flex justify-between items-center">
                        <label
                          htmlFor="end_time"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          End Time <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%]">
                          <input
                            type="time"
                            id="end_time"
                            {...register("end_time")}
                            placeholder="Enter End Time"
                            className="w-full px-3 py-2 border border-[#D9D9D9] placeholder:text-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.end_time && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.end_time.message}
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
                          className="bg-[#005AEF] hover:bg-[#2879FF] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                        >
                          {submitting
                            ? "Submitting..."
                            : shiftEditData
                            ? "Update"
                            : "Submit"}
                        </button>
                      </div>
                    </form>
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
export default Shift_Mainbar;
