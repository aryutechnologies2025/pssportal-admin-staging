import { useState, useEffect } from "react";
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
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../../Config";
import Swal from "sweetalert2";
import Loader from "../Loader";
import { formatToDDMMYYYY } from "../../Utils/dateformat";
import { Capitalise } from "../../hooks/useCapitalise";


const Holiday_Mainbar = () => {

    const navigate = useNavigate();
    const [editData, setEditData] = useState(null);
    const [columnData, setColumnData] = useState([]);
    const [backendValidationError, setBackendValidationError] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");
    const [ModalOpen, setIsModalOpen] = useState(false);


    const user = localStorage.getItem("pssuser");
    const userId = JSON.parse(user).id;
    const userRole = JSON.parse(user).role_id;

    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    const holidaySchema = z
        .object({
            title: z.string().min(1, "Title is required"),
            date: z.string().min(1, "Date is required"),
            status: z.string().min(1, "Status is required"),
        });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(holidaySchema),
        defaultValues: {
            title: editData ? editData?.title : "",
            date: editData ? editData?.date : getTodayDate(),
            status: editData ? String(editData?.status) : "",
        },
    });


    useEffect(() => {
        if (editData) {
            reset({
                title: editData.title || "",
                date: editData.date || getTodayDate(),
                status: String(editData?.status) || "",
            });
        } else {
            reset({
                title: "",
                date: getTodayDate(),
                status: "",
            });
        }
    }, [editData, reset]);

    // Open and close modals
    const openAddModal = () => {
        setIsModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
        setEditData(null);
    };

    const closeAddModal = () => {
        setEditData(null);
        setIsAnimating(false);
        setTimeout(() => {
            setIsModalOpen(false);

        }, 250);
    };


    const openEditModal = async (row) => {
        setEditData(row);
        setIsModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);

    };

    const fetchHolidayList = async () => {
        try {
            const response = await axiosInstance.get(`/api/holiday`);
            setColumnData(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching holiday list:", error);
        } finally {
        }
    };

    useEffect(() => {
        fetchHolidayList();
    }, []);

    // delete
    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This Holiday will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosInstance.delete(`${API_URL}api/holiday/delete/${id}`);
            toast.success("Holiday deleted successfully!");
            fetchHolidayList();
        } catch (error) {
            toast.error("Failed to delete Holiday");
        }
    };

    const columns = [
        {
            header: "S.No",
            body: (_, options) => options.rowIndex + 1,
            style: { textAlign: "center", width: "80px" },
        },
        {
            header: "Title",
            field: "title",
            body: (row) => Capitalise(row.title) || row.title || "-",
        },

        {
            header: "Date",
            field: "date",
            body: (row) => formatToDDMMYYYY(row.date) || "-",
        },

        {
            header: "Status",
            field: "status",
            body: (row) => {
                const data = row.status;


                let color =
                    data == "1"
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100";


                return (
                    <div
                        className={`border rounded-[50px] px-2 py-1 ${color}`}
                        style={{
                            display: "inline-block",
                            width: "100px",
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: 400,
                        }}
                    >
                        {data == "1" ? "Active" : "In Active"}
                    </div>
                );
            },
            style: { textAlign: "center" },
        },

        {
            header: "Action",
            body: (row) => (
                <div className="flex gap-4 justify-center items-center">


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
            if (editData) {
                await axiosInstance.put(`/api/holiday/update/${editData.id}`, data);

            } else {
                await axiosInstance.post(`/api/holiday/create`, data);
            }

            toast.success(editData ? "Updated Successfully" : "Created Successfully");
            closeAddModal();
            fetchHolidayList();

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }

    };


    return (
        <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-10">

            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        {/* <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            style={{ zIndex: 999999 }}
                        /> */}
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
                                Holiday
                            </p>
                        </div>

                        <div className="mt-2 md:mt-4">
                            <h1 className="text-2xl md:text-3xl font-semibold">Holidays</h1>
                        </div>


                        {/* Table Section */}
                        <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">

                            <div className="datatable-container mt-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                    {/* Entries per page */}
                                    <div className="flex items-center gap-2">

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

                                        <button
                                            onClick={openAddModal}
                                            className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                                        >
                                            + Add Holiday
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
                                            {!editData ? "Add" : "Edit"} Holidays
                                        </p>
                                        {backendValidationError && (
                                            <span className=" text-red-600 text-sm">
                                                {backendValidationError}
                                            </span>
                                        )}


                                        {/* NAME */}
                                        <div className="mt-5 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Title <span className="text-red-600">*</span>
                                            </label>
                                            <div className="w-[50%] md:w-[60%] rounded-lg">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                                                    placeholder="Enter Title"
                                                    {...register("title")}
                                                />
                                                <span className="text-red-500 text-sm">
                                                    {errors.title?.message}
                                                </span>
                                            </div>
                                        </div>




                                        <div className="mt-5 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Date <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[50%] md:w-[60%] rounded-lg">
                                                <input
                                                    type="date"
                                                    name="date"
                                                    className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                                                    {...register("date")}
                                                    placeholder="Enter Date"
                                                />
                                                <span className="text-red-500 text-sm">
                                                    {errors.date?.message}
                                                </span>

                                            </div>
                                        </div>


                                        <div className="mt-5 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Status <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[50%] md:w-[60%] rounded-lg">
                                                <select
                                                    {...register("status")}
                                                    className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                                                    name="status"
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="1">Active</option>
                                                    <option value="0">In Active</option>
                                                </select>
                                                <span className="text-red-500 text-sm">
                                                    {errors.status?.message}
                                                </span>

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


                    </div>
                </>
            )}
            <Footer />
        </div>
    );
};

export default Holiday_Mainbar;
