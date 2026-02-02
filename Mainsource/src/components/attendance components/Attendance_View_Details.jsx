import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../../components/Footer";
import Loader from "../Loader";
import { FiSearch } from "react-icons/fi";
import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig";
import { formatToDDMMYYYY } from "../../Utils/dateformat";
import TimeDropdown from "../../hooks/TimeInput ";

const Attendance_View_Details = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { company, date, attendanceId } = location.state || {};

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rows, setRows] = useState(10);
  const [attendanceData, setAttendanceData] = useState([]);
  const [data, setData] = useState([]);

  // Initial data for editing
  const initialData = [
    {
      id: 1,
      employee_number: "5573",
      employee_name: "Sophia L.",
      roleName: "Web Development",
      attendance: "present",
      loginTime: "09:00",
      logoutTime: "18:00",
      notes: "",
    },
    {
      id: 2,
      employee_number: "5574",
      employee_name: "John D.",
      roleName: "Design",
      attendance: "present",
      loginTime: "09:15",
      logoutTime: "18:30",
      notes: "",
    },
    {
      id: 3,
      employee_number: "5575",
      employee_name: "Mike R.",
      roleName: "Marketing",
      attendance: "absent",
      loginTime: "",
      logoutTime: "",
      notes: "Sick leave",
    },
  ];

  const [shiftOptions, setShiftOptions] = useState([]);
  const [counts, setcounts] = useState({});
  // console.log("shiftOptions", shiftOptions);

  // const shiftOptions = [
  //   { label: "Morning", value: "morning" },
  //   { label: "Evening", value: "evening" },
  //   { label: "Night", value: "night" },
  // ];

  const shiftTimings = {
    morning: "06:00 AM - 02:00 PM",
    evening: "02:00 PM - 10:00 PM",
    night: "10:00 PM - 06:00 AM",
  };

  // Fetch attendance data for editing
  useEffect(() => {
    const fetchAttendanceForEdit = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `${API_URL}api/attendance/edit/${id}`,
        );

        console.log("response check.....: ", response);

        // const attendanceDetails = response?.data?.data?.details.map((emp) => ({
        //   ...emp,
        //   shifts:
        //     emp.shifts?.map((shift) => ({
        //       id: shift.id,
        //       shift_name: shift.shift_name,
        //     })) || [],
        // }));

        // setAttendanceData(attendanceDetails);

         const attendanceDetails =
          response?.data?.data?.details.map((emp) => ({
            ...emp,
            shifts:
              emp.shift_details?.map((sd) => ({
                shift_id: sd.shift_id,
                shift_name: sd.shift?.shift_name,
                start_time: sd.start_time,
                end_time: sd.end_time,
              })) || [],
          })) || [];

        setAttendanceData(attendanceDetails);

        const allShifts = response?.data?.shifts || [];

        setShiftOptions(
          allShifts.map((shift) => ({
            id: shift.id,
            shift_name: shift.shift_name,
          })),
        );

        setData(response?.data?.data || []);
        setcounts(response?.data?.counts || {});

        //  SET companyId HERE
        setCompanyId(response?.data?.data?.company?.id || null);

        setLoading(false);
      } catch (error) {
        // toast.error("Failed to load attendance data");
        setLoading(false);
      }
    };

    if (id) fetchAttendanceForEdit();
  }, [id]);

  useEffect(() => {
    if (attendanceData?.length) {
      setAttendanceData((prev) =>
        prev.map((emp) => ({
          ...emp,
          shifts: emp.shifts || [],
        })),
      );
    }
  }, [attendanceData.length]);

  // Handle attendance status change
  // const handleAttendanceChange = (id, status) => {
  //   setAttendanceData(prev =>
  //     prev.map(emp =>
  //       emp.id === id
  //         ? {
  //             ...emp,
  //             attendance: status,
  //             loginTime: status === "present" ? "09:00" : "",
  //             logoutTime: status === "present" ? "18:00" : "",
  //             notes: status === "absent" ? emp.notes || "Absent" : emp.notes
  //           }
  //         : emp
  //     )
  //   );
  // };

  // Handle time change
  const handleTimeChange = (id, field, value) => {
    setAttendanceData((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp)),
    );
  };

  // Handle notes change
  const handleNotesChange = (id, value) => {
    setAttendanceData((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, notes: value } : emp)),
    );
  };

  // Handle select all for a specific status
  // const handleSelectAll = (status) => {
  //   setAttendanceData(prev =>
  //     prev.map(emp => ({
  //       ...emp,
  //       attendance: status,
  //       loginTime: status === "present" ? "09:00" : "",
  //       logoutTime: status === "present" ? "18:00" : "",
  //       notes: status === "absent" ? "Absent" : ""
  //     }))
  //   );
  // };

  // Handle clear all
  const handleClearAll = () => {
    setAttendanceData((prev) =>
      prev.map((emp) => ({
        ...emp,
        attendance: "",
        loginTime: "",
        logoutTime: "",
        notes: "",
      })),
    );
  };

  // Save attendance
  const handleSave = async () => {
    try {
      setSaving(true);
      const attendanceData1 = attendanceData?.map((emp) => ({
        employee_id: emp.employee_id,
        attendance: emp.attendance == "present" || emp.attendance == 1 ? 1 : 0,
      }));

      // Prepare payload
      const payload = {
        company_id: id,
        attendance_date: date || new Date().toISOString().split("T")[0],
        employees: attendanceData1,
        role_id: JSON.parse(localStorage.getItem("pssuser"))?.role_id || "",
        updatedBy: JSON.parse(localStorage.getItem("pssuser"))?.id || "admin",
      };

      // API call to update attendance
      const response = await axiosInstance.post(
        `api/attendance/update/${id}`,
        payload,
      );
      toast.success("Attendance updated successfully!", {
        onClose: () => navigate("/attendance"),
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance", {
        onClose: () => navigate("/attendance"),
      });
    } finally {
      setSaving(false);
    }
  };

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSelectAll = (status) => {
    const updatedData = attendanceData.map((item) => ({
      ...item,
      attendance: status,
    }));
    setAttendanceData(updatedData);
  };

  const handleClear = (status) => {
    const updatedData = attendanceData.map((item) => ({
      ...item,
      attendance: null,
    }));
    setAttendanceData(updatedData);
  };

  const handleEdit = () => {
    navigate(`/attendance-edit/${id}`, {
      state: {
        company: data?.company,
        date: data?.attendance_date,
        attendanceId: id,
      },
    });
  };

  const handleAttendanceChange = (id, status) => {
    setAttendanceData((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              attendance: status,
              loginTime: status === "present" ? "09:00" : "",
              logoutTime: status === "present" ? "18:00" : "",
              notes: status === "absent" ? "Absent" : "",
            }
          : emp,
      ),
    );
  };
  // Columns configuration
  const columns = [
    {
      field: "sno",
      header: "S.No",
      body: (rowData, options) => options.rowIndex + 1,
    },
    {
      field: "employee_name",
      header: "Employee Name",
      body: (rowData) => (
        <div>
          <p className="font-medium">{rowData?.contract_employee?.name}</p>
        </div>
      ),
    },

    // {
    //   field: "shifts",
    //   header: "Shift Allocation",
    //   body: (rowData) => (
    //     <div className="flex justify-center gap-3">
    //       {shiftOptions.map((shift) => {
    //         const checked = rowData.shifts?.some((s) => s.id === shift.id);

    //         return (
    //           <label
    //             key={shift.id}
    //             className="flex items-center gap-2 text-sm text-gray-700"
    //           >
    //             <input
    //               type="checkbox"
    //               checked={checked}
    //               disabled
    //               className="accent-green-600 cursor-not-allowed"
    //             />
    //             {shift.shift_name}
    //           </label>
    //         );
    //       })}
    //     </div>
    //   ),
    // },

        {
      field: "shifts",
      header: (
        <div
          className="flex items-center gap-1 cursor-pointer"
          //  onClick={() => setShowShiftPopup(true)}
        >
          <span>Shift Allocation</span>
          {/* <FiChevronDown /> */}
        </div>
      ),
      body: (rowData) => (
        <div className="flex flex-col gap-2">
          {shiftOptions.map((shift) => {
            const selectedShift = rowData.shifts.find(
              (s) => s.shift_id === shift.id,
            );
            return (
              <div key={shift.id} className="flex items-center gap-2">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    className="accent-green-600"
                    checked={!!selectedShift}
                    // onChange={() =>
                    //   handleShiftChange(rowData.employee_id, shift)
                    // }
                  />
                  {shift.shift_name}
                </label>

                {selectedShift && (
                  // <div className="flex gap-2">
                  //   <input
                  //     type="time"
                  //     value={selectedShift.start_time}
                    
                  //     className="border rounded px-1 text-sm"
                  //   />
                  //   <input
                  //     type="time"
                  //     value={selectedShift.end_time}
                  
                  //     className="border rounded px-1 text-sm"
                  //   />
                  // </div>
                                  <div className="flex gap-2">
                  <TimeDropdown
  value={selectedShift.start_time}
      disabled={true}


/>

<TimeDropdown
  value={selectedShift.end_time}
      disabled={true}


/>
 </div>
                )}
              </div>
            );
          })}
        </div>
      ),
    },

    // {
    //   field: "attendance",
    //   header: "Attendance",
    //   body: (rowData) => (
    //     <div className="flex flex-col gap-2">
    //       <div className="flex gap-4">
    //         <label className="flex items-center gap-2">
    //           <input
    //             type="radio"
    //             name={`attend-${rowData.id}`}
    //             checked={rowData.attendance === "present"}
    //             onChange={() => handleAttendanceChange(rowData.id, "present")}
    //             className="w-4 h-4 accent-blue-600"
    //           />
    //           <span className="text-sm">Present</span>
    //         </label>
    //         <label className="flex items-center gap-2">
    //           <input
    //             type="radio"
    //             name={`attend-${rowData.id}`}
    //             checked={rowData.attendance === "absent"}
    //             onChange={() => handleAttendanceChange(rowData.id, "absent")}
    //             className="w-4 h-4 accent-red-600"
    //           />
    //           <span className="text-sm">Absent</span>
    //         </label>
    //       </div>
    //     </div>
    //   ),
    // },

    {
      field: "attendance",
      header: (
        <div className="flex justify-around w-full gap-5 items-center">
          {/* PRESENT DROPDOWN */}
          <div className="relative flex items-center gap-2">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setDropdownPosition({
                  top: rect.bottom + 6, // below header
                  left: rect.left,
                });
                setOpenDropdown(openDropdown === "present" ? null : "present");
              }}
              className="flex items-center gap-2 cursor-pointer "
            >
              <span className="">Present</span>
              <div className="bg-gray-200 rounded px-1 flex items-center h-5">
                <i className="pi pi-chevron-down text-[10px]" />
              </div>
            </div>

            {/* {openDropdown === "present" && (
              <div
                className="fixed z-[9999] bg-white shadow-xl rounded-[10px] mt-1 min-w-[120px]"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                }}
              >
                <div
                  onClick={() => {
                    handleSelectAll("present");
                    setOpenDropdown(null);
                  }}
                  className="px-2 py-2 bg-[#7C7C7C] font-medium  text-white hover:bg-[#9C9C9C] rounded-[10px] text-sm border-b  cursor-pointer "
                >
                  Select All
                </div>

                <div
                  onClick={() => {
                    handleClear("present");
                    setOpenDropdown(null);
                  }}
                  className="px-2 py-2 bg-[#7C7C7C] font-medium  text-white hover:bg-[#9C9C9C] rounded-[10px] text-sm  cursor-pointer"
                >
                  Clear
                </div>
              </div>
            )} */}
          </div>

          {/* ABSENT DROPDOWN */}
          <div className="relative flex items-center gap-2">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setDropdownPosition({
                  top: rect.bottom + 6, // below header
                  left: rect.left,
                });
                setOpenDropdown(openDropdown === "absent" ? null : "absent");
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="font-semibold text-gray-700">Absent</span>
              <div className="bg-gray-200 rounded px-1 flex items-center h-5">
                <i className="pi pi-chevron-down text-[10px]" />
              </div>
            </div>

            {/* {openDropdown === "absent" && (
              <div
                className="fixed z-[9999] bg-white shadow-xl border rounded-md mt-1 min-w-[120px]"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                }}
              >
                <div
                  onClick={() => {
                    handleSelectAll("absent");
                    setOpenDropdown(null);
                  }}
                  className="px-2 py-2 bg-[#7C7C7C]  text-white hover:bg-[#9C9C9C] rounded-[10px] text-sm border-b cursor-pointer font-medium"
                >
                  Select All
                </div>

                <div
                  onClick={() => {
                    handleClear("absent");
                    setOpenDropdown(null);
                  }}
                  className="px-2 py-2 bg-[#7C7C7C]  text-white hover:bg-[#9C9C9C] rounded-[10px] text-sm cursor-pointer font-medium"
                >
                  Clear
                </div>
              </div>
            )} */}
          </div>
        </div>
      ),
      body: (rowData) => (
        <div className="flex justify-around items-center w-full pointer-events-none">
          {/* RADIO PRESENT */}
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id={`present-${rowData.id}`}
              name={`attendance-${rowData.id}`}
              className="w-4 h-4 accent-green-600"
              checked={
                rowData.attendance === "present" || rowData.attendance === "1"
              }
              readOnly
            />
            <span className="text-sm text-gray-600">Present</span>
          </div>

          {/* RADIO ABSENT */}
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id={`absent-${rowData.id}`}
              name={`attendance-${rowData.id}`}
              className="w-4 h-4 accent-red-600"
              checked={
                rowData.attendance === "absent" || rowData.attendance === "0"
              }
              readOnly
            />
            <span className="text-sm text-gray-600">Absent</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-5">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className="cursor-pointer">
              <Mobile_Sidebar />
            </div>

            {/* Breadcrumbs */}
            <div className="flex gap-1 items-center cursor-pointer">
              <ToastContainer position="top-right" autoClose={3000} />
              <p
                className="text-xs md:text-sm text-gray-500  cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p
                className="text-xs md:text-sm text-gray-500  cursor-pointer"
                onClick={() => navigate("/attendance")}
              >
                Attendance
              </p>
              <p>{">"}</p>
              <p className="text-xs md:text-sm  text-[#1ea600]">
                View Attendance
              </p>
            </div>

            {/* Header */}
            <div className="mt-5 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    View Attendance
                  </h1>
                 <div className="mt-3 flex flex-wrap items-center gap-6">
  {/* Company */}
  <div className="flex items-center text-sm">
    <span className="text-gray-600">Company:</span>
    <span className="ml-2 font-semibold text-gray-800">
      {data?.company?.company_name || "-"}
    </span>
  </div>

  {/* Date */}
  <div className="flex items-center text-sm">
    <span className="text-gray-600">Date:</span>
    <span className="ml-2 font-semibold text-gray-800">
      {data?.attendance_date
        ? formatToDDMMYYYY(data.attendance_date)
        : "-"}
    </span>
  </div>

  {/* Present */}
  <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-1">
    <span className="text-xs font-medium text-green-700 uppercase">
      Present
    </span>
    <span className="text-lg font-bold text-green-800">
      {counts?.present ?? 0}
    </span>
  </div>

  {/* Absent */}
  <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-1">
    <span className="text-xs font-medium text-red-600 uppercase">
      Absent
    </span>
    <span className="text-lg font-bold text-red-700">
      {counts?.absent ?? 0}
    </span>
  </div>

  {/* Not Marked */}
  <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1">
    <span className="text-xs font-medium text-gray-600 uppercase">
      Not Marked
    </span>
    <span className="text-lg font-bold text-gray-800">
      {counts?.not_marked ?? 0}
    </span>
  </div>
</div>

                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/attendance")}
                    className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5  py-1 md:py-2  rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={saving}
                    className="bg-[#4BB452] hover:bg-[#5FD367] text-white px-4 md:px-5 py-2 rounded-lg disabled:opacity-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
              {/* /attendance-edit/1 */}
              {/* Quick Actions */}
              {/* <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleSelectAll("present")}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleSelectAll("absent")}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                >
                  Mark All Absent
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  Clear All
                </button>
              </div> */}
            </div>

            {/* Data Table */}
            <div className="mt-5 bg-white rounded-2xl shadow-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {/* <span className="font-semibold text-[#6B7280]">Show</span> */}
                  <Dropdown
                    value={rows}
                    options={[10, 25, 50, 100].map((v) => ({
                      label: v,
                      value: v,
                    }))}
                    onChange={(e) => setRows(e.value)}
                    className="w-20 border rounded-md"
                  />
                  <span className=" text-[#6B7280]">Entries Per Page</span>
                </div>

                <div className="relative">
                  <FiSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search employees..."
                    className="pl-10 pr-3 py-2 rounded-md text-sm border w-full md:w-64"
                  />
                </div>
              </div>

              <DataTable
                value={attendanceData}
                paginator
                rows={rows}
                rowsPerPageOptions={[10, 20, 50]}
                globalFilter={globalFilter}
                globalFilterFields={["contract_employee.name", "attendance"]}
                showGridlines
                resizableColumns
                className="mt-4"
              >
                {columns.map((col, index) => (
                  <Column
                    key={index}
                    field={col.field}
                    header={col.header}
                    body={col.body}
                    style={{ minWidth: "150px" }}
                  />
                ))}
              </DataTable>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Attendance_View_Details;
