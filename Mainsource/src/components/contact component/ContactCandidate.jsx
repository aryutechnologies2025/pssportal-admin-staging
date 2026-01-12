import React, { useState, useEffect } from "react";

import { DataTable } from "primereact/datatable";
import { TfiPencilAlt } from "react-icons/tfi";
import { createRoot } from "react-dom/client";
import { Column } from "primereact/column";
import Swal from "sweetalert2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
    IoIosArrowDown,
    IoIosArrowForward,
    IoIosArrowUp,
} from "react-icons/io";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Loader from "../Loader";
import Footer from "../Footer";
import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig";
import { Dropdown } from "primereact/dropdown";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { InputText } from "primereact/inputtext";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"


const ContactCandidate = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const storedDetatis = localStorage.getItem("hrmsuser");
    const parsedDetails = JSON.parse(null);
    const userid = parsedDetails ? parsedDetails.id : null;
    const [errors, setErrors] = useState({});
    // console.log("errors:", errors);
    const [isAnimating, setIsAnimating] = useState(false);
    const [contact, setcontact] = useState([])
    console.log("contact", contact)
    const [loading, setLoading] = useState(true); // State to manage loading
    let navigate = useNavigate();
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewContact, setViewContact] = useState(null);
    const [first, setFirst] = useState(0);


    // filter
    const [allContacts, setAllContacts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);

    const [filterStartDate, setFilterStartDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [filterEndDate, setFilterEndDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const handleApplyFilter = () => {
        if (!filterStartDate || !filterEndDate) {
            toast.error("Please select both dates");
            return;
        }

        fetchContact(filterStartDate, filterEndDate);
    };

    const handleResetFilter = () => {
        setFilterStartDate("");
        setFilterEndDate("");
        fetchContact();
    };


    //  view
    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async (fromDate = "", toDate = "") => {
        try {
            setLoading(true);

            const response = await axiosInstance.get(`${API_URL}api/contact/list`, {
                params: {
                    from_date: fromDate,
                    to_date: toDate,
                },
            });

            setcontact(response.data.data);
        } catch (err) {
            toast.error("Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    };


    // delete

    const deleteRoles = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this Contact?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosInstance.delete(
                        `${API_URL}api/contact/delete/${id}`
                    );

                    if (response.status >= 200 && response.status < 300) {
                        toast.success("Contact has been deleted.");

                        fetchContact();
                    }
                    setAllContacts(prev =>
                        prev.filter(item => item.id !== contact.id)
                    );

                    setContacts(prev =>
                        prev.filter(item => item.id !== contact.id)
                    );

                } catch (error) {
                    console.error("Delete Error", error.response || error);

                    Swal.fire(
                        "Error!",
                        error.response?.data?.message || "Failed to delete Contact.",
                        "error"
                    );
                }
            }
        });
    };






    const columns = [
        {
            header: "S.No",
            body: (rowData, options) => options.rowIndex + 1,
            style: { textAlign: "center", width: "80px" },
        },
        {
            field: "name",
            header: "Name",
            style: { textAlign: "center" },
        },
        {
            field: "email",
            header: "Email",
            style: { textAlign: "center" },
        },
        {
            field: "phone_number",
            header: "Phone",
            style: { textAlign: "center" },
        },
        {
            field: "subject",
            header: "Requirement",
            style: { textAlign: "center" },
        },
        {
            header: "Created",
            body: (row) => new Date(row.created_at).toLocaleDateString(),
        },
        {
            header: "Action",
            body: (row) => (
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => {
                            setViewContact(row);
                            setViewModalOpen(true);
                        }}
                        className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]"
                    >
                        <FaEye />
                    </button>
                    <button
                        onClick={() => deleteRoles(row.id)}
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
        <div className="flex  flex-col justify-between bg-gray-50  px-3 md:px-5 pt-2 md:pt-10 w-screen min-h-screen overflow-x-auto">
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

                            <p className="text-xs md:text-sm text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                                Dashboard
                            </p>
                            <p>{">"}</p>
                            <p className="text-xs  md:text-sm  text-[#1ea600]">Contact</p>
                        </div>

                        {/* filter */}
                        <div className="flex flex-wrap justify-between items-center w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                {/* Start Date */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-[#6B7280]">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filterStartDate || ""}
                                        onChange={(e) => setFilterStartDate(e.target.value)}
                                        className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-[#6B7280]">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filterEndDate || ""}
                                        onChange={(e) => setFilterEndDate(e.target.value)}
                                        className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                                    />
                                </div>
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

                        <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
                        shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
                        px-2 py-2 md:px-6 md:py-6">
                            <div className="datatable-container mt-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                    {/* Entries per page */}
                                    <div className="flex items-center gap-2">
                                        {/* <span className="font-semibold text-base text-[#6B7280]">Show</span> */}
                                        <Dropdown
                                            value={rows}
                                            options={[10, 25, 50, 100].map(v => ({ label: v, value: v }))}
                                            onChange={(e) => {
                                                setRows(e.value);
                                                setFirst(0); // reset to first page
                                            }}
                                            className="w-20"
                                        />

                                        <span className=" text-sm text-[#6B7280]">Entries per page</span>
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
                                                onChange={(e) => {
                                                    setGlobalFilter(e.target.value);
                                                    setFirst(0);
                                                }}

                                                placeholder="Search......"
                                                className="w-full pl-10 pr-3 py-2 rounded-lg text-sm border border-[#D9D9D9] 
                                                             focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="table-scroll-container" id="datatable">
                                    <DataTable
                                        value={contact}
                                        paginator
                                        first={first}
                                        rows={rows}
                                        onPage={(e) => {
                                            setFirst(e.first);
                                            setRows(e.rows);
                                        }}
                                        totalRecords={contact.length}
                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                        globalFilter={globalFilter}
                                        showGridlines
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

                                    <h2 className="text-xl font-semibold mb-4 text-[#1ea600]">
                                        Contact Details
                                    </h2>

                                    <div className="space-y-2 text-sm">
                                        <p><b>Name:</b> {viewContact.name}</p>
                                        <p><b>Email:</b> {viewContact.email}</p>
                                        <p><b>Phone:</b> {viewContact.phone_number}</p>
                                        <p><b>Subject:</b> {viewContact.subject}</p>
                                        <p>
                                            <b>Created Date:</b>{" "}
                                            {new Date(viewContact.created_at).toLocaleDateString()}
                                        </p>

                                        <div>
                                            <p className="font-semibold">Message:</p>
                                            <div className="max-h-40 overflow-y-auto break-words whitespace-pre-wrap rounded-md border p-2 text-gray-700 bg-gray-50">
                                                {viewContact.message}
                                            </div>
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
export default ContactCandidate;

