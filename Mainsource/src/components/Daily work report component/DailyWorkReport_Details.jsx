import React, { useState, useEffect, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { TfiPencilAlt } from "react-icons/tfi";
import axiosInstance from "../../axiosConfig.js";
import { API_URL } from "../../Config";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "primereact/multiselect";
import { useRef } from "react";
import customise from "../../assets/customise.svg";
import {
    IoIosArrowDown,
    IoIosArrowForward,
    IoIosArrowUp,
} from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"
import { Editor } from "primereact/editor";
import Loader from "../Loader.jsx";
import Mobile_Sidebar from "../Mobile_Sidebar.jsx";
import Footer from "../Footer.jsx";
import { formatToYYYYMMDD, formatToDDMMYYYY } from "../../Utils/dateformat.js";


const DailyWorkReport_Details = () => {
    let navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [editLeadForm, setEditLeadForm] = useState(null);
    const storedDetatis = localStorage.getItem("pssuser");
    const parsedDetails = JSON.parse(storedDetatis);
    const userid = parsedDetails ? parsedDetails.id : null;
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");;
    const [viewMessage, setViewMessage] = useState(null);
    const [workReports, setWorkReports] = useState([]);
    const [employees, setEmployees] = useState([]);
    console.log("employees", employees);
    const [allWorkReports, setAllWorkReports] = useState([]);
    const today = new Date().toISOString().split("T")[0];
    const [dailyForm, setDailyForm] = useState({
        report_date: "",
        report: ""
    });

    const [editDailyForm, setEditDailyForm] = useState({
        id: null,
        report_date: "",
        report: ""
    });
    const [filters, setFilters] = useState({
        from_date: today,
        to_date: today,
        employee_id: "",
    });


    const applyFilters = () => {
        let filtered = [...allWorkReports];

        // Start Date
        if (filters.from_date) {
            filtered = filtered.filter(item =>
                new Date(item.report_date) >= new Date(filters.from_date)
            );
        }

        // End Date
        if (filters.to_date) {
            filtered = filtered.filter(item =>
                new Date(item.report_date) <= new Date(filters.to_date)
            );
        }

        // Employee
        if (filters.employee_id) {
            filtered = filtered.filter(
                item => item.employee?.id === filters.employee_id
            );
        }


        setWorkReports(filtered);
        setTotalRecords(filtered.length);
    };




    // list
    const fetchWorkReports = async () => {
        try {
            setLoading(true);

            const res = await axiosInstance.get(`${API_URL}api/work-reports`);

            const reports = res.data?.data || [];
            const employeeList = res.data?.employees || [];

            // table data
            setAllWorkReports(reports);
            setWorkReports(reports);
            setTotalRecords(reports.length);

            //  dropdown data (ALL employees)
            setEmployees(employeeList);

        } catch (err) {
            toast.error("Failed to fetch Daily work reports");
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        fetchWorkReports();
    }, []);







    // create
    const handleCreateWorkReport = async () => {

        if (!dailyForm.report_date || !dailyForm.report) {
            toast.error("All fields required");
            return;
        }

        try {
            const payload = {
                report_date: dailyForm.report_date,
                report: dailyForm.report,
                created_by: userid
            };

            console.log("PAYLOAD SENDING TO API:", payload);

            const res = await axiosInstance.post(
                `${API_URL}api/work-reports/create`,
                payload
            );

            console.log("CREATE RESPONSE:", res);

            toast.success("Daily work added");
            closeAddModal();
            fetchWorkReports();

            // reset form
            setDailyForm({
                report_date: "",
                report: ""
            });

        } catch (error) {
            console.error("CREATE ERROR:", error.response || error);
            toast.error("Failed to create Daily Work Report");
        }
    };


    // update
    const handleUpdateWorkReport = async () => {

        if (!editDailyForm.report_date || !editDailyForm.report) {
            toast.error("All fields required");
            return;
        }

        try {
            const payload = {
                report_date: editDailyForm.report_date,
                report: editDailyForm.report,
                updated_by: userid
            };

            await axiosInstance.put(
                `${API_URL}api/work-reports/update/${editDailyForm.id}`,
                payload
            );

            toast.success("Daily work Report updated");
            closeEditModal();
            fetchWorkReports();

        } catch (error) {
            console.error(error);
            toast.error("Failed to Update Daily Work Report");
        }
    };


    // open add
    const openAddModal = () => {
        setIsAddModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };
    // close add
    const closeAddModal = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsAddModalOpen(false);

            setErrors({});
        }, 300);
    };
    // edit
    const openEditModal = async (row) => {
        try {
            const res = await axiosInstance.get(
                `${API_URL}api/work-reports/edit/${row.id}`
            );

            const data = res.data.data ?? res.data;

            setEditDailyForm({
                id: data.id,
                report_date: formatToYYYYMMDD(data.report_date),
                report: data.report || ""
            });

            setIsEditModalOpen(true);
            setTimeout(() => setIsAnimating(true), 50);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load report");
        }
    };


    // close edit 
    const closeEditModal = () => {
        setIsAnimating(false);
        setErrors({});
        setTimeout(() => {
            setIsEditModalOpen(false);
            setEditLeadForm(null);
        }, 250);
    };


    const openMessageView = (row) => {
        setViewMessage(row);
    };


    const columns = [
        {
            field: "sno",
            header: "S.No",
            body: (_, options) => options.rowIndex + 1,
        },
        {
            field: "employee.gen_employee_id",
            header: "Employee ID",
        },
        {
            field: "employee.full_name",
            header: "Employee Name",
        },
        {
            field: "report_date",
            header: "Date",
            body: (row) => formatToDDMMYYYY(row.report_date),
        },
        {
            field: "message",
            header: "Message",
            body: (row) => (
                <div className="flex justify-center gap-3">
                    <FaEye
                        className="text-[#1ea600] cursor-pointer hover:scale-110"
                        onClick={() => setViewMessage(row)}
                    />
                </div>
            ),
            style: { textAlign: "center" }
        },
        {
            field: "action",
            header: "Action",
            body: (row) => (
                <div className="flex justify-center gap-3">
                    <TfiPencilAlt
                        className="text-[#1ea600] cursor-pointer hover:scale-110 transition"
                        onClick={() => openEditModal(row)}
                    />
                </div>
            ),
            style: { textAlign: "center" }
        }
    ];







    return (
        <div className="flex  flex-col justify-between bg-gray-50  px-3 md:px-5 pt-2 md:pt-10 w-full min-h-screen overflow-x-auto ">
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

                            <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                                Dashboard
                            </p>
                            <p>{">"}</p>
                            <p className="text-sm  md:text-md  text-[#1ea600]">Daily Work Report</p>
                        </div>

                        {/* Filter Section */}
                        <div className="w-full mt-5 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-4 py-4">

                            <div className="flex flex-wrap items-end gap-4">

                                {/* Start Date */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-[#6B7280]">Start Date</label>
                                    <input
                                        type="date"
                                        className="border h-10 px-3 rounded-md"
                                        value={filters.from_date}
                                        onChange={(e) =>
                                            setFilters(prev => ({ ...prev, from_date: e.target.value }))
                                        }
                                    />
                                </div>

                                {/* End Date */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-[#6B7280]">End Date</label>
                                    <input
                                        type="date"
                                        className="border h-10 px-3 rounded-md"
                                        value={filters.to_date}
                                        onChange={(e) =>
                                            setFilters(prev => ({ ...prev, to_date: e.target.value }))
                                        }
                                    />

                                </div>
                                {/* employee (pss-emp) */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-[#6B7280]">Employee</label>
                                    <Dropdown
                                        value={filters.employee_id}
                                        options={employees}
                                        optionLabel="full_name"
                                        optionValue="id"   
                                        placeholder="Select Employee"
                                        className="h-10 w-48 border"
                                        filter
                                        onChange={(e) =>
                                            setFilters(prev => ({
                                                ...prev,
                                                employee_id: e.value
                                            }))
                                        }
                                    />




                                </div>


                                {/* Buttons */}
                                <div className="flex gap-3 mt-6 md:mt-0">
                                    <button
                                        onClick={applyFilters}
                                        className="h-10 w-20 rounded-lg bg-[#1ea600] hover:bg-[#23880c] text-white"
                                    >
                                        Apply
                                    </button>


                                    <button
                                        onClick={() => {
                                            setFilters({
                                                from_date: "",
                                                to_date: "",
                                                employee_id: ""
                                            });
                                            setWorkReports(allWorkReports);
                                            setTotalRecords(allWorkReports.length);
                                            setGlobalFilter("");
                                        }}
                                        className="h-10 w-20 border rounded-lg  hover:bg-[#c7c7c7] text-black"
                                    >
                                        Reset
                                    </button>

                                </div>

                            </div>
                        </div>

                        <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6">
                            <div className="datatable-container mt-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                    {/* Entries per page */}
                                    <div className="flex items-center gap-5">
                                        <div>
                                            <Dropdown
                                                value={rows}
                                                options={[10, 25, 50, 100].map(v => ({ label: v, value: v }))}
                                                onChange={(e) => setRows(e.value)}
                                                className="w-20 border"
                                            />
                                            <span className=" text-sm text-[#6B7280]">Entries Per Page</span>

                                        </div>

                                    </div>

                                    <div className="flex justify-between items-center gap-5">
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


                                    </div>
                                </div>
                                <div className="table-scroll-container" id="datatable">
                                    <DataTable
                                        className="mt-8"
                                        value={workReports}
                                        paginator
                                        rows={rows}
                                        totalRecords={totalRecords}
                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                        globalFilter={globalFilter}
                                        globalFilterFields={[
                                            "employee.gen_employee_id",
                                            "employee.full_name",
                                            "report_date",
                                            "report"
                                        ]}
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



                        {/* Edit Modal */}
                        {isEditModalOpen && (
                            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
                                <div className="absolute inset-0" onClick={closeEditModal}></div>

                                <div
                                    className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw]
        bg-white shadow-lg transform transition-transform duration-500 ease-in-out
        ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
                                >
                                    {/* Close Arrow */}
                                    <div
                                        className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                                        onClick={closeEditModal}
                                    >
                                        <IoIosArrowForward className="w-3 h-3" />
                                    </div>

                                    <div className="px-5 lg:px-14 py-4 md:py-10 text-[#4A4A4A] font-medium">
                                        <p className="text-xl md:text-2xl">Edit Daily Work </p>



                                        {/* Date */}
                                        <div className="mt-6 flex flex-col md:flex-row md:items-center gap-2">
                                            <label className="md:w-32 text-md font-medium">
                                                Date <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-full md:flex-1">
                                                <input
                                                    type="date"
                                                    value={editDailyForm.report_date}
                                                    onChange={(e) =>
                                                        setEditDailyForm({ ...editDailyForm, report_date: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        {/* Report */}
                                        <div className="mt-6 flex flex-col md:flex-row md:items-start gap-2">
                                            <label className="md:w-32 text-md font-medium pt-2">
                                                Report<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-full md:flex-1">
                                                <Editor
                                                    value={editDailyForm.report}
                                                    onTextChange={(e) =>
                                                        setEditDailyForm({ ...editDailyForm, report: e.htmlValue })
                                                    }
                                                    style={{ height: "180px" }}
                                                />
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end gap-2 mt-10">
                                            <button
                                                onClick={closeEditModal}
                                                className="border border-[#7C7C7C] text-[#7C7C7C]
            hover:bg-[#FEE2E2] hover:text-[#DC2626]
            px-5 py-2 rounded-[10px]"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={handleUpdateWorkReport}
                                                className="bg-[#1ea600] hover:bg-[#4BB452]
            text-white px-5 py-2 rounded-[10px]"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* view message */}
                        {viewMessage && (
                            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                <div className="bg-white w-[90%] md:w-[40%] p-6 rounded-xl shadow-lg relative">

                                    <IoIosCloseCircle
                                        className="absolute top-3 right-3 text-2xl cursor-pointer text-gray-500 hover:text-red-500"
                                        onClick={() => setViewMessage(null)}
                                    />

                                    <p className="text-lg font-semibold mb-3">Daily Work Message</p>

                                    <div
                                        className="border p-4 rounded-lg text-sm text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: viewMessage.report }}
                                    />
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
export default DailyWorkReport_Details;
