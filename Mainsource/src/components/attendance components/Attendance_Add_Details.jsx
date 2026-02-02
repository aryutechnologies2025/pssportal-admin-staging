import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import { API_URL } from "../../Config";
import axiosInstance from "../../axiosConfig.js";
import Swal from "sweetalert2";
import Footer from "../../components/Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { FiSearch } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

const Attendance_add_details = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  // console.log("attendanceData", attendanceData);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  console.log("shiftOptions", shiftOptions);

  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}api/company`);

      const companyOptions = res?.data?.data.map((company) => ({
        id: company.id,
        name: company.company_name,
      }));

      setCompanies(companyOptions);
    } catch (err) {
      console.error("Error fetching companies", err);
      setCompanies([]);
    }
  };

  const fetchCompaniesEmployee = async (company) => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}api/attendance/company/${company}/employees`,
      );


      console.log("res", res);
      const employees = res.data.data.map((emp) => ({
        ...emp,
        attendance: null,
        shifts: [],
      }));

      const shifts = res.data.shifts.map((shift) => ({
        id: shift.id,
        label: shift.shift_name,
        start_time: shift.start_time,
        end_time: shift.end_time,
      }));

      setAttendanceData(employees);
      setShiftOptions(shifts);
    } catch (err) {
      console.error("Error fetching employees & shifts", err);
    }
  };

  // const handleShiftChange = (empId, shiftId) => {
  //   console.log("handleShiftChange", handleShiftChange);
  //   setAttendanceData(prev =>
  //     prev.map(emp =>
  //       emp.id === empId
  //         ? {
  //           ...emp,
  //           shifts: emp.shifts.includes(shiftId)
  //             ? emp.shifts.filter(id => id !== shiftId)
  //             : [...emp.shifts, shiftId]
  //         }
  //         : emp
  //     )
  //   );
  // };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    fetchProject();
  }, []);

  const [clientdetails, setClientdetails] = useState([]);

  const handleSelectAll = (status) => {
    const updatedData = attendanceData.map((item) => ({
      ...item,
      attendance: status,
    }));
    setAttendanceData(updatedData);
  };

  const handleClear = (status) => {
    // console.log("status", status);

    const updatedData = attendanceData.map((item) => ({
      ...item,
      attendance:
        status === "present" && item.attendance === "present"
          ? null
          : status === "absent" && item.attendance === "absent"
            ? null
            : item.attendance,
    }));

    setAttendanceData(updatedData);
  };

  const handleAttendanceChange = (id, status) => {
    setAttendanceData((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              attendance: status,
            }
          : emp,
      ),
    );
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const fetchProject = async () => {
    try {
      // const response = await axios.get(
      //   `${API_URL}/api/attendance/view-mark-by-admin`
      // );

      setClientdetails(response.data);
      setLoading(false);
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {

    
    if (!selectedCompany) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select a company",
      });
      return;
    }

    if (!selectedDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select a date",
      });
      return;
    }

    try {
      setLoading(true);

      const pssUser = JSON.parse(localStorage.getItem("pssuser"));

      const attendanceData1 = attendanceData.map((emp) => ({
        employee_id: emp.id,
        // attendance: emp.attendance === "present" ? 1 : 0,
        // attendance: (() => {
        //   if (emp.attendance === "present") return 1;
        //   if (emp.attendance === "absent") return 0;
        //   return null;
        // })(),

        shift_id: emp.shifts,
      }));

      const payload = {
        company_id: selectedCompany,
        attendance_date: selectedDate,
        employees: attendanceData.map((emp) => ({
          employee_id: emp.id,
          // attendance: emp.attendance === "present" ? 1 : 0,
          attendance: (() => {
            if (emp.attendance === "present") return 1;
            if (emp.attendance === "absent") return 0;
            return null;
          })(),
          shift_details: emp.shifts,
        })),
        created_by: pssUser?.id,
        role_id: pssUser?.role_id,
      };

      console.log("Attendance Payload ", payload);

    

      const response = await axiosInstance.post(
        `${API_URL}api/attendance/create`,
        payload,
      );
      console.log("response check", response);
      Swal.fire({
        icon: "success",
        title: "Attendance Submitted!",
        text: `Attendance on ${selectedDate} has been saved successfully.`,
        allowOutsideClick: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Attendance Already Submitted!",
        text: `Attendance on ${selectedDate} has been saved already.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (rowData) => {
    setEditData({ ...rowData });
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setEditData(null);
      setErrors({});
    }, 250);
  };

  const handleEditSubmit = () => {
    if (!editData.loginTime || !editData.logoutTime) {
      setErrors({ time: "Login and Logout time are required" });
      return;
    }

    setAttendanceData((prev) =>
      prev.map((emp) => (emp.id === editData.id ? editData : emp)),
    );
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Attendance record has been updated.",
      timer: 1500,
    });

    closeEditModal();
  };

  // Validate Status dynamically

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this attendance record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setAttendanceData((prev) => prev.filter((emp) => emp.id !== id));
        setSelectedUsers((prev) => prev.filter((userId) => userId !== id));

        Swal.fire(
          "Deleted!",
          "The attendance record has been deleted.",
          "success",
        );
      }
    });
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    // Update date for all employees
    setAttendanceData((prev) =>
      prev.map((emp) => ({
        ...emp,
        date: new Date(newDate).toLocaleDateString("en-GB"),
      })),
    );
  };

  const attendanceOptions = [
    { label: "Present", value: "present" },
    { label: "Absent", value: "absent" },
    { label: "Half Day", value: "half-day" },
    { label: "Late", value: "late" },
  ];

  const [contentVisible, setContentVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

  // const handleHeaderShiftToggle = (shiftId) => {
  //   const allSelected = attendanceData.every((emp) =>
  //     emp.shifts.includes(shiftId),
  //   );

  //   setAttendanceData((prev) =>
  //     prev.map((emp) => ({
  //       ...emp,
  //       shifts: allSelected
  //         ? emp.shifts.filter((id) => id !== shiftId) // uncheck all
  //         : emp.shifts.includes(shiftId)
  //           ? emp.shifts
  //           : [...emp.shifts, shiftId], // check all
  //     })),
  //   );
  // };

  // const isHeaderShiftChecked = (shiftId) => {
  //   return (
  //     attendanceData.length > 0 &&
  //     attendanceData.every((emp) => emp.shifts.includes(shiftId))
  //   );
  // };
  const [showShiftPopup, setShowShiftPopup] = useState(false);
  const [starttime, setStarttime] = useState("");
  const [endtime, setEndtime] = useState("");

  // const handleShiftChange = (empId, shiftId) => {
  //   setAttendanceData((prev) =>
  //     prev.map((emp) =>
  //       emp.id === empId
  //         ? {
  //             ...emp,
  //             shifts: emp.shifts.includes(shiftId)
  //               ? emp.shifts.filter((id) => id !== shiftId)
  //               : [...emp.shifts, shiftId],
  //           }
  //         : emp,
  //     ),
  //   );
  // };

// --- Handle shift checkbox for each employee ---
const handleShiftChange = (empId, shift) => {
  setAttendanceData((prev) =>
    prev.map((emp) => {
      if (emp.id !== empId) return emp;

      const exists = emp.shifts.find((s) => s.shift_id === shift.id);

      return {
        ...emp,
        shifts: exists
          ? emp.shifts.filter((s) => s.shift_id !== shift.id) // remove shift if unchecked
          : [
              ...emp.shifts,
              {
                shift_id: shift.id,
                start_time: shift.start_time, // default start
                end_time: shift.end_time,     // default end
              },
            ],
      };
    })
  );
};

// --- Handle manual time change for a shift ---
const handleTimeChange = (empId, shiftId, field, value) => {
  setAttendanceData((prev) =>
    prev.map((emp) =>
      emp.id === empId
        ? {
            ...emp,
            shifts: emp.shifts.map((s) =>
              s.shift_id === shiftId ? { ...s, [field]: value } : s
            ),
          }
        : emp
    )
  );
};

// --- Check if shift is selected for the header "Select All" ---
const isHeaderShiftChecked = (shiftId) => {
  return (
    attendanceData.length > 0 &&
    attendanceData.every((emp) =>
      emp.shifts.find((s) => s.shift_id === shiftId)
    )
  );
};

// --- Toggle all shifts for all employees from header popup ---
const handleHeaderShiftToggle = (shiftId) => {
  setAttendanceData((prev) =>
    prev.map((emp) => {
      const exists = emp.shifts.find((s) => s.shift_id === shiftId);
      const shiftDefault = shiftOptions.find((s) => s.id === shiftId);

      return {
        ...emp,
        shifts: exists
          ? emp.shifts.filter((s) => s.shift_id !== shiftId) // uncheck all
          : [
              ...emp.shifts,
              { shift_id: shiftId, start_time: shiftDefault.start_time, end_time: shiftDefault.end_time },
            ],
      };
    })
  );
};


  

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
          <p className="">{rowData.name}</p>
          {/* <p className="text-sm text-gray-600">{rowData.employee_number}</p> */}
        </div>
      ),
    },

{
  field: "shift_attendance",
  header: (
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={() => setShowShiftPopup(true)}
    >
      <span>Shift Allocation</span>
      <i
        className={`pi pi-chevron-down text-xs transition-transform ${
          showShiftPopup ? "rotate-180" : ""
        }`}
      />
    </div>
  ),
  body: (rowData) => (
    <div className="flex flex-col gap-2">
      {shiftOptions.map((shift) => {
        const selectedShift = rowData.shifts.find(
          (s) => s.shift_id === shift.id
        );

        return (
          <div key={shift.id} className="flex gap-3 items-center">
            {/* Shift Checkbox */}
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                className="accent-green-600"
                checked={!!selectedShift}
                onChange={() => handleShiftChange(rowData.id, shift)}
              />
              {shift.label}
            </label>

            {/* Show time inputs only if shift is selected */}
            {selectedShift && (
              <div className="flex gap-3">
                <input
                  type="time"
                  value={selectedShift.start_time}
                  onChange={(e) =>
                    handleTimeChange(
                      rowData.id,
                      shift.id,
                      "start_time",
                      e.target.value
                    )
                  }
                  className="border rounded px-1 py-0.5 text-sm"
                />
                <input
                  type="time"
                  value={selectedShift.end_time}
                  onChange={(e) =>
                    handleTimeChange(
                      rowData.id,
                      shift.id,
                      "end_time",
                      e.target.value
                    )
                  }
                  className="border rounded px-1 py-0.5 text-sm"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  ),
},


    

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
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="">Present</span>
              <div className="bg-gray-200 rounded px-1 flex items-center h-5">
                <i className="pi pi-chevron-down text-[10px]" />
              </div>
            </div>

            {openDropdown === "present" && (
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
                  className="px-2 py-2 bg-[#7C7C7C]  text-white hover:bg-[#9C9C9C] rounded-[10px] text-sm border-b cursor-pointer font-medium"
                >
                  Select All
                </div>

                <div
                  onClick={() => {
                    handleClear("present");
                    setOpenDropdown(null);
                  }}
                  className="px-4 py-2 bg-[#7C7C7C]  text-white hover:bg-[#9C9C9C] rounded-[10px] text-sm cursor-pointer font-medium"
                >
                  Clear
                </div>
              </div>
            )}
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

            {openDropdown === "absent" && (
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
                  className="px-4 py-2 bg-[#7C7C7C]  text-white hover:bg-[#9C9C9C] rounded-[10px] text-sm border-b cursor-pointer font-medium"
                >
                  Select All
                </div>

                <div
                  onClick={() => {
                    handleClear("absent");
                    setOpenDropdown(null);
                  }}
                  className="px-4 py-2 bg-[#7C7C7C]  text-white hover:bg-[#9C9C9C] rounded-[10px] text-sm cursor-pointer font-medium"
                >
                  Clear
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      body: (rowData) => (
        <div className="flex justify-around items-center w-full">
          {/* RADIO PRESENT */}
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="present"
              name={`attend-${rowData.id}`}
              className="w-4 h-4 accent-green-600 cursor-pointer"
              checked={rowData.attendance === "present"}
              onChange={() => handleAttendanceChange(rowData.id, "present")}
            />
            <label
              className="text-sm text-gray-600"
              htmlFor={`present-${rowData.id}`}
            >
              Present
            </label>
          </div>

          {/* RADIO ABSENT */}
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="absent"
              name={`attend-${rowData.id}`}
              className="w-4 h-4 accent-green-600 cursor-pointer"
              checked={rowData.attendance === "absent"}
              onChange={() => handleAttendanceChange(rowData.id, "absent")}
            />
            <label
              className="text-sm text-gray-600"
              htmlFor={`absent-${rowData.id}`}
            >
              Absent
            </label>
          </div>
        </div>
      ),
    },
  ];

  const companyOptions = companies.map((company) => ({
    label: company.name,
    value: company.id,
    name: company.name, // Keep original name for reference
  }));

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className="cursor-pointer">
              <Mobile_Sidebar />
            </div>
            <div className="flex justify-start mt-2 md:mt-0 gap-1 items-center ">
              <p
                className="text:xs md:text-sm text-gray-500  cursor-pointer"
                onClick={() => navigate("/")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p
                className="text:xs md:text-sm text-gray-500  cursor-pointer"
                onClick={() => navigate("/attendance")}
              >
                Attendance
              </p>
              <p>{">"}</p>
              <p className="text:xs md:text-sm    text-[#1ea600]">
                Attendance Add
              </p>
            </div>

            {/* Add Button */}
            {/* <div className="flex justify-between mt-2 md:mt-4 mb-1 md:mb-3">
              <div>
                <h1 className="text-xl md:text-3xl font-semibold">Attendance Add</h1>
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() =>
                    navigate(-1)
                  }
                  className="bg-gray-500 hover:bg-gray-600 px-2 md:px-3 py-2  text-white font-medium w-20 rounded-2xl"
                >
                  Back
                </button>
                <button
                  onClick={openAddModal}
                  className=" px-2 md:px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
                >
                  Add
                </button>
              </div>
            </div> */}

            <div className="bg-white flex justify-between items-center w-full rounded-2xl shadow-md p-4 md:p-6 mt-5">
              <div className="flex flex-col md:flex-row gap-5 md:gap-10">
                {/* <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[#6B7280]">
                    Company
                  </label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => { fetchCompaniesEmployee(e.target.value); setSelectedCompany(e.target.value); }}
                    className="px-3 py-2 rounded-md border border-[#D9D9D9] text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                  >
                    <option className="text-sm">Select Company</option>
                    
                    {companies
                      .map((com, index) => (
                        <option key={index} value={com.id}>
                          {com.name}
                        </option>
                      ))}
                  </select>
                </div> */}

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[#6B7280]">
                    Company
                  </label>
                  <Dropdown
                    value={selectedCompany}
                    options={companyOptions}
                    onChange={(e) => {
                      fetchCompaniesEmployee(e.target.value);
                      setSelectedCompany(e.target.value);
                    }}
                    className=" uniform-field px-3 py-2 rounded-md border border-[#D9D9D9] text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    filter
                    placeholder="Select Comoany"
                  />
                </div>

                <div className=" flex flex-col  gap-1 ">
                  <label className="text-sm font-semibold text-[#6B7280]">
                    Date
                  </label>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e)=> setSelectedDate(e.target.value)}
                    // disabled
                    className="px-2 py-2 rounded-md bg-white border text-[#7C7C7C]"
                  />
                </div>
              </div>

              {/* <div className="flex justify-end gap-2 md:gap-5 mt-5 ">
                <button onClick={closeAddModal} className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200">
                  Cancel
                </button>
                <button
                  onClick={fetchCompaniesEmployee}
                  disabled={loading}
                  className="bg-[#005AEF] hover:bg-[#2879FF] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>

              </div> */}
            </div>

            <div
              className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6"
            >
              {/* data table */}
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

                  {/* <input
                            type="date"
                            value={selectedDate}
                            className="px-1 py-1 md:px-3 md:py-2 hidden md:block rounded-lg border border-[#D9D9D9] 
                         focus:outline-none focus:ring-2 focus:ring-[#1ea600] text-[#7C7C7C] cursor-pointer "
                            onChange={(e) => {
                              getAttendanceData(e.target.value);
                              setSelectedDate(e.target.value);
          
                            }}
                          /> */}

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
                        className="w-full pl-10 pr-3 py-2 rounded-md text-sm border border-[#D9D9D9] 
                         focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-[#4BB452] hover:bg-[#5FD367] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>

                <DataTable
                  className="mt-8 overflow-x-hidden"
                  value={attendanceData}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[10, 20]}
                  globalFilter={globalFilter} // Global search filter
                  showGridlines
                  resizableColumns
                >
                  {columns.map((col, index) => (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      body={col.body}
                      style={{
                        minWidth: "150px",
                        wordWrap: "break-word", // Allow text to wrap
                        overflow: "hidden", // Prevent text overflow
                        whiteSpace: "normal", // Ensure that text wraps within the available space
                      }}
                    />
                  ))}
                </DataTable>
              </div>
            </div>

        {showShiftPopup && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => setShowShiftPopup(false)}
  >
    <div
      className="bg-white rounded-lg w-[400px] shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">Shift Allocation</h3>
        <button
          className="text-gray-500 hover:text-black text-xl"
          onClick={() => setShowShiftPopup(false)}
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-3">
        {shiftOptions.map((shift) => (
          <label
            key={shift.id}
            className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50"
          >
            <div>
              <div className="font-medium">{shift.label}</div>
              <div className="text-xs text-gray-500">
                {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
              </div>
            </div>
            <input
              type="checkbox"
              className="accent-green-600 w-4 h-4"
              checked={isHeaderShiftChecked(shift.id)}
              onChange={() => handleHeaderShiftToggle(shift.id)}
            />
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-2 px-4 py-3 border-t">
        <button
          className="px-4 py-1 border rounded hover:bg-gray-100"
          onClick={() => setShowShiftPopup(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setShowShiftPopup(false)}
        >
          Done
        </button>
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
export default Attendance_add_details;
