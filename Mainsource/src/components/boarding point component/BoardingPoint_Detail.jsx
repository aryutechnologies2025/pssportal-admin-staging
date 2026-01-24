import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Loader from "../Loader";
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

const BoardingPoint_Detail = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [boardPoint, setBoardPoint] = useState([]);
    console.log("boardPoint", boardPoint)
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewContact, setViewContact] = useState(null);
    console.log("view", viewContact)
    const [errors, setErrors] = useState({});
    console.log("....erors.... : ", errors);
    //local storage 
    const storedDetatis = localStorage.getItem("pssuser");
    //  console.log("storedDetatis.... : ",storedDetatis)
    const parsedDetails = JSON.parse(storedDetatis);
    // console.log("....parsedDetails.... : ",parsedDetails)
    const userid = parsedDetails ? parsedDetails.id : null;
    // console.log("userid.... : ",userid)
    const [companyId, setCompanyId] = useState(null);
    const [pointName, setPointName] = useState("");
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [allBoardPoints, setAllBoardPoints] = useState([]); // master data
const [filteredBoardPoints, setFilteredBoardPoints] = useState([]);



useEffect(() => {
    let data = [...allBoardPoints];

    if (companyId) {
        data = data.filter(item => item.company_id === companyId);
    }

    if (globalFilter) {
        const search = globalFilter.toLowerCase();
        data = data.filter(item =>
            item.point_name?.toLowerCase().includes(search) ||
            item.company?.company_name?.toLowerCase().includes(search) ||
            (item.status == 1 ? "active" : "inactive").includes(search)
        );
    }

    setFilteredBoardPoints(data);
    setTotalRecords(data.length);
}, [globalFilter]);



    const openViewModal = async (row) => {
        try {
            const response = await axiosInstance.get(
                `${API_URL}api/boarding-points/edit/${row.id}`
            );

            if (response.data?.status) {
                setViewContact(response.data.data); // contains company object
                setViewModalOpen(true); // ✅ OPEN AFTER DATA SET
            }
        } catch (err) {
            toast.error("Failed to load details");
        }
    };


    // Fetch board point from the API
    useEffect(() => {
        fetchBoardPoint();
    }, []);
    // list
const fetchBoardPoint = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}api/boarding-points`);

        if (response.data.status === true) {
            const boardPoints = response.data.data || [];

            setAllBoardPoints(boardPoints);        // master
            setFilteredBoardPoints(boardPoints);   // display
            setBoardPoint(boardPoints);
            setTotalRecords(boardPoints.length);

            const companies = response.data.companies || [];
            setCompanyOptions(
                companies.map(c => ({
                    label: c.company_name,
                    value: c.id
                }))
            );
        } else {
            setAllBoardPoints([]);
            setFilteredBoardPoints([]);
            setBoardPoint([]);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};


const handleApplyFilter = () => {
    let data = [...allBoardPoints];

    if (companyId) {
        data = data.filter(item => item.company_id === companyId);
    }

    // apply search also
    if (globalFilter) {
        const search = globalFilter.toLowerCase();
        data = data.filter(item =>
            item.point_name?.toLowerCase().includes(search) ||
            item.company?.company_name?.toLowerCase().includes(search) ||
            (item.status == 1 ? "active" : "inactive").includes(search)
        );
    }

    setFilteredBoardPoints(data);
    setTotalRecords(data.length);
};

const handleResetFilter = () => {
    setCompanyId(null);
    setGlobalFilter("");
    setFilteredBoardPoints(allBoardPoints);
    setTotalRecords(allBoardPoints.length);
};




    // Open and close modals
    const openAddModal = () => {
        setCompanyId(null);   // ⭐ IMPORTANT
        setPointName("");
        setStatus("");
        setErrors({});
        setIsAddModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };


    const closeAddModal = () => {
        setIsAnimating(false);

        setTimeout(() => {
            setIsAddModalOpen(false);;
            setStatus("");
            setErrors({});
        }, 300);
    };


    const [roleDetails, setRoleDetails] = useState({
        status: "",
    });

    // edit
    const openEditModal = async (row) => {
        try {
            setEditingRoleId(row.id);
            setIsEditModalOpen(true);
            setIsAnimating(true);

            const res = await axiosInstance.get(
                `${API_URL}api/boarding-points/edit/${row.id}`
            );

            if (res.data?.status) {
                const data = res.data.data;

                setRoleDetails({
                    company_id: data.company_id,
                    point_name: data.point_name,
                    status: data.status?.toString(),
                });
            }
        } catch (err) {
            toast.error("Failed to load details");
        }
    };





    const closeEditModal = () => {
        setIsAnimating(false);
        setEditingRoleId(null);
        setRoleDetails({ status: "", });
        setErrors({});
        setTimeout(() => setIsEditModalOpen(false), 250);
    };



    const validateCreateForm = () => {
        let newErrors = {};



        if (status === "" || status === null) {
            newErrors.status = ["Status is required"];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateEditForm = () => {
        let newErrors = {};



        if (roleDetails.status === "" || roleDetails.status === null) {
            newErrors.status = ["Status is required"];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };





    // create
    const handlesubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!companyId) newErrors.company_id = "Company is required";
        if (!pointName) newErrors.point_name = "Boarding Point is required";
        if (!status) newErrors.status = "Status is required";

        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        try {
            const payload = {
                company_id: companyId,
                point_name: pointName,
                status,
                created_by: userid,
            };

            const response = await axiosInstance.post(
                `${API_URL}api/boarding-points/create`,
                payload
            );
            console.log("response", response)

            if (response.data?.status) {
                toast.success("Boarding Point created successfully");
                fetchBoardPoint();
                closeAddModal();
                setCompanyId(null);
                setPointName("");
                setStatus("");
            } else {
                toast.error("Failed to create Boarding Point");
            }
        } catch (err) {
            toast.error("Error creating Boarding Point");
        }
    };


    // update
    const handleSave = async () => {
        let newErrors = {};
        if (!roleDetails.company_id) newErrors.company_id = "Company required";
        if (!roleDetails.point_name) newErrors.point_name = "Boarding Point required";
        if (!roleDetails.status) newErrors.status = "Status required";

        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        try {
            const res = await axiosInstance.post(
                `${API_URL}api/boarding-points/update/${editingRoleId}`,
                {
                    company_id: roleDetails.company_id,
                    point_name: roleDetails.point_name,
                    status: roleDetails.status,
                    updated_by: userid,
                }
            );

            if (res.data?.status) {
                toast.success("Boarding Point updated successfully");
                closeEditModal();
                fetchBoardPoint();
            }
        } catch {
            toast.error("Update failed");
        }
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




    // delete
    const deleteBoardPoint = (roleId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this Boarding Point?",
            icon: "warning",
            showCancelButton: true,

            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, delete it!",


        }).then((result) => {
            if (result.isConfirmed) {

                axiosInstance.delete(`${API_URL}api/boarding-points/delete`, {
                    data: {
                        record_id: roleId
                    }
                })
                    .then((response) => {
                        console.log("Delete response:", response.data);
                        if (response.data.status === true || response.data.success === true) {
                            toast.success("Boarding Point has been deleted.");
                            fetchBoardPoint(); // Refresh the board point list

                        } else {
                            Swal.fire("Error!", response.data.message || "Failed to delete Boarding Point.", "error");
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting Boarding Point:", error);
                        Swal.fire("Error!", "Failed to delete Boarding Point.", "error");
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
            field: "company.company_name",
            header: "Company"
        },
        {
            field: "point_name",
            header: "Boarding Point"
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
                            ;
                            // setViewModalOpen(true);
                            openViewModal(row)
                        }}
                        className="p-1 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]"
                        title="View"
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
                        onClick={() => deleteBoardPoint(row.id)}
                        className="text-red-500 cursor-pointer hover:scale-110 transition"
                        title="Delete"
                    />
                </div>
            ),
            style: { textAlign: "center", fontWeight: "medium" },
        },


    ];

    console.log("columns", columns)


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

                            <p className="text-sm text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                                Dashboard
                            </p>
                            <p>{">"}</p>
                            <p className="text-sm  md:text-md  text-[#1ea600]">Boarding Point</p>
                        </div>
                        {/* filter */}
                        <div className="flex flex-wrap justify-between w-full mt-1 md:mt-5 h-auto gap-2 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]  px-2 py-2 md:px-6 md:py-6 ">
                            <div className="flex gap-1 items-center">
                                <label className="text-sm font-medium text-[#6B7280]">Company</label>

                                <Dropdown
                                    value={companyId}
                                    options={companyOptions}
                                    onChange={(e) => setCompanyId(e.value)}
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Select Company"
                                    filter
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

                        <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6">
                            <div className="datatable-container mt-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                    {/* Entries per page */}
                                    <div className="flex items-center gap-2">

                                        <Dropdown
                                            value={rows}
                                            options={[10, 25, 50, 100].map(v => ({ label: v, value: v }))}
                                            onChange={(e) => setRows(e.value)}
                                            className="w-20 border"
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
                                                className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-[#D9D9D9] 
               focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                                            />
                                        </div>

                                        <button
                                            onClick={openAddModal}
                                            className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                                        >
                                            Add Boarding Point
                                        </button>
                                    </div>
                                </div>
                                <div className="table-scroll-container" id="datatable">
                                    <DataTable
                                        className="mt-8"
                                        value={filteredBoardPoints}
                                        paginator
                                        rows={rows}
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
                                        <p className="text-xl md:text-2xl ">Add Boarding Point</p>

                                        {/* Company */}

                                        <div className="mt-2 md:mt-8 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Company <span className="text-red-500">*</span>
                                            </label>

                                            <div className="w-[50%]">

                                                <Dropdown
                                                    value={companyId}
                                                    options={companyOptions}
                                                    onChange={(e) => setCompanyId(e.value)}
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    placeholder="Select Company"
                                                    filter
                                                    showClear
                                                    className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                                                />

                                                {errors.company_id && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.company_id}</p>
                                                )}
                                            </div>
                                        </div>


                                        <div className="mt-2 md:mt-8 flex justify-between items-center">
                                            <label htmlFor="roleName" className="block text-md font-medium mb-2 mt-3">
                                                Boarding Point <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[50%]">
                                                <textarea
                                                    rows={3}
                                                    value={pointName}
                                                    placeholder="Enter Boarding Point"
                                                    onChange={(e) => setPointName(e.target.value)}
                                                    className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg resize-none"
                                                />

                                                {errors.point_name && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.point_name}</p>
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

                                    <div className="px-5 lg:px-14 py-10 text-[#4A4A4A] font-semibold">
                                        <p className="text-xl md:text-2xl ">Edit Role</p>

                                        {/* Pss company */}

                                        <div className="mt-2 md:mt-8 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Company <span className="text-red-500">*</span>
                                            </label>

                                            <div className="w-[50%]">
                                                <Dropdown
                                                    value={roleDetails.company_id}
                                                    options={companyOptions}
                                                    onChange={(e) =>
                                                        setRoleDetails({
                                                            ...roleDetails,
                                                            company_id: e.value,
                                                        })
                                                    }
                                                    placeholder="Select Company"
                                                    filter
                                                    className="uniform-field w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                                                />

                                                {errors.company_id && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.company_id}</p>
                                                )}

                                            </div>
                                        </div>

                                        <div className="mt-10">
                                            <div className="bg-white rounded-xl w-full">

                                                <div className="mt-8 flex justify-between items-center">
                                                    <label className="block text-md font-medium mb-2 mt-3">
                                                        Boarding Point <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="w-[50%]">
                                                        <textarea
                                                            rows={3}
                                                            value={roleDetails.point_name}
                                                            onChange={(e) =>
                                                                setRoleDetails({
                                                                    ...roleDetails,
                                                                    point_name: e.target.value,
                                                                })
                                                            }
                                                            className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg resize-none"
                                                        />


                                                        {/* {errors?.role_name && (
                                                            <p className="text-red-500 text-sm mb-4">{errors?.role_name}</p>
                                                        )} */}
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

                                    {/* Close */}
                                    <button
                                        onClick={() => setViewModalOpen(false)}
                                        className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                                    >
                                        <IoIosCloseCircle size={28} />
                                    </button>

                                    <h2 className="text-xl font-semibold mb-6 text-[#1ea600]">
                                        Boarding Point Details
                                    </h2>

                                    <div className="space-y-5 text-sm text-gray-700">

                                        {/* Company */}
                                        <div className="flex justify-between">
                                            <span className="font-medium">Company</span>
                                            <span>{viewContact.company?.company_name || "-"}</span>
                                        </div>


                                        {/* Boarding Point */}
                                        <div className="flex justify-between gap-4">
                                            <span className="font-medium shrink-0">Boarding Point</span>
                                            <div className="w-[65%] max-h-[120px] overflow-y-auto border border-[#D9D9D9] rounded-lg px-3 py-2 bg-gray-50">
                                                {viewContact.point_name || "-"}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Status</span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold
              ${viewContact.status == 0
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {viewContact.status == 0 ? "Inactive" : "Active"}
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
export default BoardingPoint_Detail;
