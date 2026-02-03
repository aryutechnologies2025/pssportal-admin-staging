import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";

import { IoIosArrowForward, IoIosCloseCircle } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";

import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";
import Loader from "../Loader";
import { FaCalendarAlt } from "react-icons/fa";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  formatDateTimeDDMMYYYY,
  formatToDDMMYYYY,
  formatToYYYYMMDD,
} from "../../Utils/dateformat";
import { AiOutlineEye } from "react-icons/ai";
import { data } from "react-router-dom";
import Swal from "sweetalert2";

export default function Announcements_Mainbar() {
  const [announcements, setAnnouncements] = useState([]);
  const [roles, setRoles] = useState([]);

  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);

  };

  const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };
  const calendarRef = useRef(null);
  //   view
  const [viewData, setViewData] = useState(null);
  const openViewModal = async (row) => {
    const res = await axiosInstance.get(
      `${API_URL}api/announcement/edit/${row.id}`
    );

    console.log("view DATA 👉", res.data.data);
    const data = res.data.data;
    setViewData(res.data.data);
  };

  const closeViewModal = () => {
    setViewData(null);
  };

  /* ================= ZOD SCHEMA ================= */
  const announcementSchema = z
    .object({
      date: z.date(),
      expiry_date: z.date(),

      message: z
        .string()
        .refine(
          (val) => val.replace(/<[^>]*>/g, "").trim().length > 0,
          "Message is required"
        ),
      visible_roles: z.array(z.string()).min(1, "Select at least one role"),

      status: z.enum(["1", "0"]),
    })
    .refine((d) => d.expiry_date >= d.date, {
      path: ["expiry_date"],
      message: "Expiry date must be after Date",
    });

  /* ================= DEFAULT VALUES ================= */
  const defaultValues = {
    date: new Date(),
    expiry_date: new Date(),
    message: "",
    visible_roles: [],
    status: "1",
  };

  /* ================= FORM ================= */
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues,
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchRoles();
    fetchAnnouncements();
  }, []);
  const getAllRoleIds = () =>
    roles.filter((r) => r.value !== "all").map((r) => r.value);

  const fetchRoles = async () => {
    const res = await axiosInstance.get(`${API_URL}api/role`);

    const roleOptions = res.data.data.map((r) => ({
      label: r.role_name,
      value: String(r.id),
    }));
    // 👇 Add "All" at the top
    setRoles([{ label: "All", value: "all" }, ...roleOptions]);
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    const res = await axiosInstance.get(`${API_URL}api/announcement`);
    setAnnouncements(res.data.data);
    setLoading(false);
  };


  /* ================= MODAL ================= */
  const openAddModal = () => {
    reset(defaultValues);
    setEditingId(null);
    setModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  //   const openEditModal = (row) => {
  //     const allRoleIds = roles
  //       .filter((r) => r.value !== "all")
  //       .map((r) => String(r.value));

  //     const isAllSelected = row.visible_roles?.length === allRoleIds.length;

  //     reset({
  //       date: new Date(row.start_date),
  //       expiry_date: new Date(row.expiry_date),
  //       message: row.message,
  //       visible_roles:row.visible_roles,
  //       status: row.status,
  //     });

  //     setEditingId(row.id);
  //     setModalOpen(true);
  //     setTimeout(() => setIsAnimating(true), 10);
  //   };

  // const openEditModal = (row) => {
  //   const roleIds = row.visible_roles?.map((r) => String(r.id)) || [];

  //   reset({
  //     date: new Date(row.start_date),
  //     expiry_date: new Date(row.expiry_date),
  //     message: row.announcement_details,
  //     visible_roles: roleIds,
  //     status: String(row.status),
  //   });

  //   setEditingId(row.id);
  //   setModalOpen(true);
  //   setTimeout(() => setIsAnimating(true), 10);
  // };

  const openEditModal = async (row) => {
    const res = await axiosInstance.get(
      `${API_URL}api/announcement/edit/${row.id}`
    );
    console.log("EDIT DATA 👉", res.data.data);
    const data = res.data.data;
    reset({
      date: new Date(data?.announcement?.start_date),
      expiry_date: new Date(data?.announcement?.expiry_date),
      message: data?.announcement?.announcement_details,
      visible_roles: data.visible_roles.map((r) => String(r.id)),
      status: String(data?.announcement?.status),
    });

    setEditingId(row.id);
    setModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const deleteAnnouncement = async (row) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This company will be deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;
      await axiosInstance.delete(`${API_URL}api/announcement/delete`, {
        params: { record_id: row.id },
      });

      closeModal();
      setTimeout(() => {
        toast.success("Announcement delete successfully ");
      }, 300);
      fetchAnnouncements();
    } catch (error) {
      toast.error("Failed to delete announcement ");
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => setModalOpen(false), 300);
  };
  const formatToYYYYMMDD = (date) => {
    if (!date) return null;
    return date.toISOString().split("T")[0];
  };

  /* ================= SUBMIT ================= */
  //   const onSubmit = async (data) => {

  //     try {
  //       let payload = {
  //         start_date: formatToYYYYMMDD(data.date),
  //         expiry_date: formatToYYYYMMDD(data.expiry_date),
  //         announcement_details: data.message,
  //         status: data.status,
  //         visible_to: data.visible_roles,
  //       };

  //       if (data.visible_roles.includes("all")) {
  //         payload.visible_to = roles
  //           .filter((r) => r.value !== "all")
  //           .map((r) => String(r.value));
  //       }

  //       if (editingId) {
  //   await axiosInstance.post(
  //     `${API_URL}api/announcement/update/${editingId}`,
  //     payload
  //   );

  //   closeModal();

  //   setTimeout(() => {
  //     toast.success("Announcement updated successfully ✅");
  //   }, 200);

  // } else {
  //   await axiosInstance.post(
  //     `${API_URL}api/announcement/create`,
  //     payload
  //   );

  //   closeModal();

  //   setTimeout(() => {
  //     toast.success("Announcement created successfully 🎉");
  //   }, 200);
  // }

  // fetchAnnouncements();

  //       closeModal();
  //       fetchAnnouncements();
  //     } catch (err) {
  //       console.error(err);

  //       toast.error(
  //         err?.response?.data?.message || "Failed to create announcement "
  //       );
  //     }
  //   };

  const onSubmit = async (data) => {
    try {
      let payload = {
        start_date: formatToYYYYMMDD(data.date),
        expiry_date: formatToYYYYMMDD(data.expiry_date),
        announcement_details: data.message,
        status: data.status,
        visible_to: data.visible_roles,
      };

      if (data.visible_roles.includes("all")) {
        payload.visible_to = roles
          .filter((r) => r.value !== "all")
          .map((r) => String(r.value));
      }

      if (editingId) {
        await axiosInstance.post(
          `${API_URL}api/announcement/update/${editingId}`,
          payload
        );
        //  toast.success("Announcement updated successfully ");
        closeModal();

        setTimeout(() => {
          toast.success("Announcement updated successfully ");
        }, 300);
      } else {
        await axiosInstance.post(`${API_URL}api/announcement/create`, payload);

        closeModal();

        setTimeout(() => {
          toast.success("Announcement created successfully");
        }, 300);
      }

      fetchAnnouncements();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message || "Failed to save announcement ❌"
      );
    }
  };

  useEffect(() => {
    console.log("FORM ERRORS 👉", errors);
  }, [errors]);

  /* ================= TABLE ================= */
  const columns = [
    { header: "S.No", body: (_, o) => o.rowIndex + 1, style: { width: 80 } },
    { field: "start_date", header: "Date" },
    { field: "expiry_date", header: "Expiry Date" },
    {
      header: "Message",
      body: (r) => (
        <div
          className="text-sm text-gray-700 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: r?.announcement_details }}
        />
      ),
    },
    {
      header: "Visible Roles",
      body: (r) => r.visible_roles?.length || 0,
    },
    {
      header: "Status",
      body: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status == 1
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
            }`}
        >
          {r.status == 1 ? "Active" : "Inactive"}
        </span>
      ),
    },
    // {
    //   header: "Action",
    //   body: (row) => (
    //     <div className="flex gap-3 justify-center">
    //       <TfiPencilAlt
    //         className="cursor-pointer text-green-600"
    //         onClick={() => openEditModal(row)}
    //       />
    //       <RiDeleteBin6Line className="cursor-pointer text-red-600" />
    //     </div>
    //   ),
    // },
    {
      header: "Action",
      body: (row) => (
        <div className="flex gap-4 justify-center items-center">
          {/* VIEW */}
          <AiOutlineEye
            className="cursor-pointer text-blue-600 hover:text-blue-800"
            title="View"
            onClick={() => openViewModal(row)}
            size={18}
          />

          {/* EDIT */}
          <TfiPencilAlt
            className="cursor-pointer text-green-600 hover:text-green-800"
            title="Edit"
            onClick={() => openEditModal(row)}
            size={16}
          />

          {/* DELETE */}
          <RiDeleteBin6Line
            className="cursor-pointer text-red-600 hover:text-red-800"
            title="Delete"
            onClick={() => deleteAnnouncement(row)}
            size={18}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex  flex-col justify-between bg-gray-50  px-3 md:px-5 pt-2 md:pt-10 w-screen md:mt-5">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Mobile_Sidebar />
          </div>

          {/* HEADER */}
          <div className="flex justify-start gap-2 mt-2 md:mt-0 items-center">
            <p className="text-md md:text-xl font-semibold">Announcements</p>
          </div>

          <div
            className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
          shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
          px-2 py-2 md:px-6 md:py-6"
          >
            <div className="datatable-container mt-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-3 mb-4">
                {/* Entries per page */}
                <div className="flex items-center gap-2">
                  <Dropdown
                    value={rows}
                    options={[10, 25, 50].map((v) => ({ label: v, value: v }))}
                    className="border"
                    onChange={(e) => onRowsChange(e.value)}
                  />

                  <span className="text-sm w-full text-[#6B7280]">
                    Entries Per Page
                  </span>
                </div>

                <div className="flex justify-end w-full md:mb-4 gap-2 md:gap-4">
                  <input
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="w-full md:w-[20%] max-w-sm px-3 py-1 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />

                  <button
                    onClick={openAddModal}
                    className="hidden md:flex bg-[#1ea600] text-white text-xs md:text-base px-4 py-2 rounded-lg"
                  >
                    Add Announcement
                  </button>
                </div>
              </div>
              <div className="flex justify-end mb-2" >
                <button
                    onClick={openAddModal}
                    className="flex md:hidden bg-[#1ea600] text-white text-sm md:text-base px-4 py-2 rounded-lg"
                  >
                    Add Announcement
                  </button>
              </div>
              <div className="table-scroll-container" id="datatable">
                {/* <DataTable
                              className="mt-8"
                              value={roles}
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
          
                            
                              {columns.map((col, index) => (
                                <Column
                                  key={index}
                                  field={col.field}
                                  header={col.header}
                                  body={col.body}
                                  style={col.style}
                                />
                              ))}
                            </DataTable> */}

                <DataTable
                  value={announcements}
                  paginator
                  rows={rows}
                  first={(page - 1) * rows}
                  onPage={onPageChange}
                  //   loading={loading}
                  globalFilter={globalFilter}
                >
                  {columns.map((c, i) => (
                    <Column key={i} {...c} />
                  ))}
                </DataTable>
              </div>
            </div>
          </div>

          {/* ================= ADD / EDIT MODAL ================= */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50">
              <div className="absolute inset-0" onClick={closeModal} />

              <div
                className={`fixed top-0 right-0 h-screen w-screen sm:w-[90vw] md:w-[45vw]
            bg-white shadow-lg transition-transform duration-500
            ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
              >
                <div
                  className="w-6 h-6 mt-3 ms-3 border rounded-full flex items-center justify-center cursor-pointer"
                  onClick={closeModal}
                >
                  <IoIosArrowForward size={14} />
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="px-3 md:px-6 py-4 md:py-8 space-y-6 h-[calc(100vh-60px)] overflow-y-auto"
                >
                  <h2 className="text-xl md:text-2xl font-semibold">
                    {editingId ? "Edit" : "Add"} Announcement
                  </h2>

                  {/* DATE */}

                  <div className="flex flex-col md:flex-row justify-between ">
                    <label className="text-sm font-medium text-gray-700">
                      Date <span className="text-red-500">*</span>
                    </label>

                    <div className="w-full md:w-[50%] relative">
                      {/* 1️⃣ Create a ref for the Calendar */}
                      <Controller
                        name="date"
                        control={control}
                        render={({ field }) => {
                          const calendarRef = useRef(null); // ✅ attach ref

                          return (
                            <>
                              <Calendar
                                ref={calendarRef} // attach ref
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                readOnlyInput={false}
                                dateFormat="dd-mm-yy"
                                placeholder="DD-MM-YYYY"
                                showIcon={false} // disable default icon
                                inputClassName={`
                w-full px-3 py-2 pr-10 text-sm rounded-md
                border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-[#1ea600] focus:border-[#1ea600]
                ${errors.date ? "border-red-500 focus:ring-red-500" : ""}
              `}
                                className="w-full"
                              />

                              {/* 2️⃣ Absolute icon to open calendar */}
                              <FaCalendarAlt
                                className="absolute right-3 top-1/2 -translate-y-1/2
                 text-gray-400 cursor-pointer hover:text-[#1ea600]"
                                onClick={() => calendarRef.current?.show()} // ✅ open calendar
                              />
                            </>
                          );
                        }}
                      />

                      {errors.date && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* EXPIRY */}

                  <div className="flex flex-col md:flex-row justify-between ">
                    <label className="text-sm font-medium text-gray-700">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>

                    <div className="w-full md:w-[50%]">
                      <Controller
                        name="expiry_date"
                        control={control}
                        render={({ field }) => {
                          const calendarRef = useRef(null);

                          return (
                            <div className="relative w-full">
                              <Calendar
                                ref={calendarRef}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                dateFormat="dd-mm-yy"
                                placeholder="DD-MM-YYYY"
                                inputClassName={`
                w-full px-3 py-2 pr-10 text-sm rounded-md
                border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-[#1ea600]
                ${errors.expiry_date ? "border-red-500 focus:ring-red-500" : ""}
              `}
                                className="w-full"
                              />

                              {/* Icon that opens calendar */}

                              <FaCalendarAlt
                                className="absolute right-3 top-1/2 -translate-y-1/2
                 text-gray-400 cursor-pointer hover:text-[#1ea600]"
                                onClick={() => calendarRef.current?.show()} // ✅ open calendar
                              />
                            </div>
                          );
                        }}
                      />

                      {errors.expiry_date && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.expiry_date.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* MESSAGE */}
                  <div className="flex flex-col md:flex-row justify-between  text-gray-700">
                    <label>Message <span className="text-red-500">*</span></label>
                    <div className="w-full md:w-[50%] mt-2">
                      <Controller
                        name="message"
                        control={control}
                        render={({ field }) => (
                          <Editor
                            value={field.value}
                            onTextChange={(e) => field.onChange(e.htmlValue)}
                            style={{ height: "150px" }}
                          />
                        )}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* VISIBLE ROLES */}
                  <div className="flex flex-col md:flex-row justify-between text-gray-700">
                    <label>Visible Roles <span className="text-red-500">*</span></label>
                    <div className="w-full md:w-[50%] ">
                      <Controller
                        name="visible_roles"
                        control={control}
                        render={({ field }) => {
                          const allIds = getAllRoleIds();
                          const isAllSelected =
                            field.value.length === allIds.length &&
                            allIds.every((id) => field.value.includes(id));

                          return (
                            <MultiSelect
                              value={
                                isAllSelected ? ["all", ...allIds] : field.value
                              }
                              options={roles}
                              display="chip"
                              placeholder="Select Roles"
                              //   className="w-full"
                              className={`
            w-full text-sm rounded-md
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-[#1ea600] focus:border-[#1ea600]
            
          `}
                              onChange={(e) => {
                                const selected = e.value;

                                // 🔵 ALL clicked
                                if (selected.includes("all")) {
                                  field.onChange(allIds);
                                  return;
                                }

                                // 🔵 ALL unclicked
                                if (
                                  isAllSelected &&
                                  !selected.includes("all")
                                ) {
                                  field.onChange([]);
                                  return;
                                }

                                // 🔵 Normal selection (no duplicates)
                                field.onChange([
                                  ...new Set(
                                    selected.filter((v) => v !== "all")
                                  ),
                                ]);
                              }}
                            />
                          );
                        }}
                      />

                      {errors.visible_roles && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.visible_roles.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="flex flex-col md:flex-row justify-between ">
                    <label className="text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>

                    <div className="w-full md:w-[50%]">
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            options={[
                              { label: "Active", value: "1" },
                              { label: "Inactive", value: "0" },
                            ]}
                            placeholder="Select Status"
                            className={`
            w-full text-sm rounded-md
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-[#1ea600] focus:border-[#1ea600]
            
          `}
                            panelClassName="rounded-md border border-gray-300"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="border px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#1ea600] text-white px-5 py-2 rounded-lg
             hover:bg-[#179100] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {editingId ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {viewData && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
              <div className="relative bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-3 md:p-6 border-b sticky top-0 bg-white z-10">
                  <h2 className="text-md md:text-xl font-semibold text-[#1ea600] hover:text-[#4BB452]">
                    Announcement Details
                  </h2>

                  <button
                    onClick={closeViewModal}
                    className="absolute top-2 md:top-4 right-2 md:right-4 text-gray-500 hover:text-red-500"
                  >
                    <IoIosCloseCircle size={28} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-3 md:p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <b>Start Date:</b>{" "}
                      {viewData?.announcement?.start_date || "-"}
                    </p>

                    <p>
                      <b>Expiry Date:</b>{" "}
                      {viewData?.announcement?.expiry_date || "-"}
                    </p>

                    <p>
                      <b>Status:</b>{" "}
                      {viewData?.announcement?.status == 1
                        ? "Active"
                        : "Inactive"}
                    </p>

                    <div className="col-span-2">
                      <b>Message:</b>
                      <div
                        className="mt-2 p-3 border rounded-md text-sm bg-gray-50"
                        dangerouslySetInnerHTML={{
                          __html: viewData?.announcement?.announcement_details,
                        }}
                      />
                    </div>

                    <div className="col-span-2">
                      <b>Visible Roles:</b>
                      {viewData?.visible_roles?.length > 0 ? (
                        <ul className="list-disc ml-5 mt-2 text-sm">
                          {viewData.visible_roles.map((r) => (
                            <li key={r.id}>{r.role_name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 mt-1">No roles assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Footer />
        </>
      )}
    </div>
  );
}
