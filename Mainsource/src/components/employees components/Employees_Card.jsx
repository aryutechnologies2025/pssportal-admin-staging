import { useEffect, useState } from "react";
import { BiSolidMessageAltAdd } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Loader from "../Loader.jsx";
import { FaEye } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { toast, ToastContainer } from "react-toastify";
import { FiSearch } from "react-icons/fi";

import axiosInstance from "../../axiosConfig.js";
import { PiBuildingOfficeLight } from "react-icons/pi";
import { set } from "zod";
import Swal from "sweetalert2";

const Employees_Card = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // console.log("search term", searchTerm);
  const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  // console.log("roleOptions", roleOptions);

  const [companyOptions, setCompanyOptions] = useState([]);

  const [allEmployees, setAllEmployees] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [roleFilter, setRoleFilter] = useState("");
  // console.log("roleFilter", roleFilter);
  const [dateFilter, setDateFilter] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);

  };

  const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };


  console.log("employeeData :", employeeData);

  const companyList = [
    { id: 1, name: "Company A" },
    { id: 2, name: "Company B" },
    { id: 3, name: "Company C" },
    { id: 3, name: "Company C" },
    { id: 3, name: "Company C" },
    { id: 3, name: "Company C" },
    { id: 3, name: "Company C" },
  ];
  const [company, setCompany] = useState(null);
  //page
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get("/api/role");

      const activeRoles = res.data.data
        .filter((role) => role.status === "1")
        .map((role) => ({
          id: role.id,
          name: role.role_name,
        }));

      setRoleOptions(activeRoles);
    } catch (err) {
      console.error("Failed to fetch roles", err);
      setRoleOptions([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/api/employees");

      setEmployeeData(response.data.data);
      setEmployees(response.data.data);
      setAllEmployees(response.data.data);
      setFilteredEmployees(response.data.data);

      // const roleOptions = response?.data
      // // .filter((role) => role.status === "1") // filter only active
      // // .map((role) => ({
      // //   id: role.id,
      // //   name: role.role_name,
      // // }));
      // console.log("Active Roles:", roleOptions);
      // setRoleOptions(roleOptions);

      setCompanyOptions(
        response?.data?.companies.map((emp) => ({
          label: emp.company_name,
          value: emp.id,
          assign_status: emp.assign_status,
        })),
      );
    } catch (error) {
      console.error("Failed to fetch employees:", error);

      // fallback to empty array
      setEmployeeData([]);
      setEmployees([]);
      setAllEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  function onClickAddNewMember() {
    navigate("/createemployee");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/api/employees/delete/${id}`);
      fetchEmployees();
      toast.success("Employee has been deleted.");
    } catch (error) {
      toast.success("Failed to delete employee.");
      console.error("Failed to delete employee:", error);
    }
  };

  useEffect(() => {
    let filtered = employees;

    // Text Search
    if (filterInput) {
      const lower = filterInput.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.employee_Name?.toLowerCase().includes(lower) ||
          emp.employee_mailId?.toLowerCase().includes(lower) ||
          emp.employeeId?.toString().includes(lower),
      );
    }

    // Role Filter
    if (roleFilter) {
      filtered = filtered.filter(
        (emp) => Number(emp.role_id) === Number(roleFilter),
      );
    }

    // Date of Joining Filter
    if (dateFilter) {
      filtered = filtered.filter(
        (emp) => emp.employee_dateofjoining?.slice(0, 10) === dateFilter,
      );
    }

    setFilteredEmployees(filtered);
  }, [filterInput, employees, roleFilter, dateFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 12; // Adjust number of employees per page

  // Calculate total pages

  // Get employees for the current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees
    ?.slice()
    .reverse()
    .slice(indexOfFirstEmployee, indexOfLastEmployee);

  const filterEmployee = (value) => {
    if (value) {
      const filterData = allEmployees.filter(
        (data) => data.employee_dutyStatus == value,
      );
      setEmployees(filterData);
    } else {
      setEmployees(allEmployees); // reset
    }
  };

  function formatDateTime(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  }

  useEffect(() => {
    setEmployees(employeeData);
    setAllEmployees(employeeData);
    setFilteredEmployees(employeeData);
    setLoading(false); // stop skeleton
  }, []);

  //   const handleReferenceChange = async (id, type, checked) => {

  //     console.log("id, type, checked", id, type, checked)
  //     // type = "internal" or "external"
  //     try {
  //       // Send payload according to type
  //       const payload =

  // {          job_form_referal: checked ? 1 : 0,
  //           reference_type:

  // };

  //       const res = await axiosInstance.post(
  //         `/api/employees/job-referal/${id}`,
  //         payload
  //       );

  //       if (res.status === 200) {
  //         toast.success("Reference updated successfully!");

  //         // Update local state
  //         setEmployeeData((prev) =>
  //           prev.map((emp) =>
  //             emp.id == id
  //               ? { ...emp, ...payload }
  //               : emp
  //           )
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Failed to update reference:", error);
  //     }
  //   };

  const handleReferenceChange = async (id, referenceType, checked) => {
    console.log("id:", id, "type:", referenceType, "checked:", checked);

    try {
      // const payload = {
      //   job_form_referal: checked ? 1 : 0,
      //   // job_form_ext_referal: checked ? 1 : 0,
      //   type: checked ? referenceType : null,
      // };

      const payload =
  referenceType === "internal"
    ? {
        job_form_referal: checked ? 1 : 0,
        job_form_ext_referal: 0,
        type: "internal",
      }
    : {
        job_form_ext_referal: checked ? 1 : 0,
        job_form_referal: 0,
        type: "external",
      };


      const res = await axiosInstance.post(
        `/api/employees/job-referal/${id}`,
        payload,
      );

      if (res.status === 200) {
        toast.success("Reference updated successfully!");

        setEmployeeData((prev) =>
          prev.map((emp) =>
            emp.id === id
              ? {
                  ...emp,
                  job_form_referal: payload.job_form_referal,
                  reference_type: payload.reference_type,
                }
              : emp,
          ),
        );
      }
      fetchEmployees();
    } catch (error) {
      console.error("Failed to update reference:", error);
    }
  };

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  useEffect(() => {
    if (selectedEmployee?.company_id) {
      setSelectedCompanies(selectedEmployee.company_id);
    }
  }, [selectedEmployee]);

  const handleCompanyToggle = async (company, checked) => {
    setSelectedCompanies((prev) =>
      checked
        ? [...prev, company.value]
        : prev.filter((c) => c !== company.value),
    );
  };

  const handleCompanySubmit = async () => {
    // console.log(selectedCompanies);
    try {
      const res = await axiosInstance.post(
        `api/employees/assign-company/${selectedEmployee.id}`,
        {
          company_id:
            selectedCompanies.length > 0
              ? selectedCompanies.map((c) => c)
              : null,
        },
      );

      if (res.status === 200) {
        setEmployeeData((prevEmployees) => {
          return prevEmployees.map((emp) => {
            // Check if the IDs match (using == to handle string vs number IDs)
            if (emp.id == selectedEmployee.id) {
              return { ...emp, company_id: selectedCompanies };
            }
            return emp;
          });
        });

        toast.success("Companies assigned successfully!");
      }
    } catch (error) {
      console.error("Failed to update reference:", error);
      toast.error("Failed to assign companies.");
    }

    setShowCompanyModal(false);
  };

  const columns = [
    {
      header: "S.No",
      body: (rowData, options) => options.rowIndex + 1,
      style: { textAlign: "center", width: "80px" },
      fixed: true,
    },

    {
      header: "Name",
      body: (row) => {
        const name = row.full_name || "-";
        const id = row.role.role_name || "-";
        console.log("check id",id,name)
        return(
        <div>
        <div>{name}</div>
        <div>{id}</div>
        </div>
        );
    },
    },

    // {
    //   header: "Company",
    //   field: "company_name",
    //   body: (row) => (
    //     <div>
    //       <span className="font-medium">{row.company_name || "-"}</span>
    //     </div>
    //   ),
    // },

    // {
    //   header: "Role",
    //   field: "employee_role",
    //   body: (row) => row.role.role_name || "-",
    //   style: { textAlign: "center" }
    // },

    // {
    //   title: "Current Part",
    //   data: "employee_Position",
    //   render: function (data) {
    //     return data || "-";
    //   },
    // },
    // {
    //   field: "employee_Position",
    //   header: "Current Part",
    //   body: (row) => {
    //     if (!row.employee_Position) return "-";

    //     const map = {
    //       Intern: "Internship",
    //       "Full Time": "Employee"
    //     };

    //     return map[row.employee_Position] || row.employee_Position;
    //   },
    //   style: { textAlign: "center" }
    // },

    {
      header: "Email",
      field: "email",
    },
    {
      header: "Phone Number",
      field: "phone_no",
    },

    // {
    //   field: "employee_dateofjoining",
    //   header: "Joining Date",
    //   body: (row) =>
    //     row.employee_dateofjoining
    //       ? formatDateTime(row.employee_dateofjoining)
    //       : "-",
    //   style: { textAlign: "center" }
    // },

    {
      field: "reference",
      header: "Interview Reference",
      body: (row) => {
        // Debug: console.log("Row Reference Value:", row.reference);
        return (
          <div
            className="flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <input
              type="checkbox"
              // This handles numbers, strings, and null values accurately
              checked={row.job_form_referal == 1}
              onChange={(e) => {
                const isChecked = e.target.checked;
                handleReferenceChange(row.id, isChecked);
              }}
              className="w-4 h-4 cursor-pointer accent-[#1ea600] rounded border-gray-300"
            /> */}

            <input
              type="checkbox"
              checked={
                row.job_form_referal == 1 &&
                row.reference_type === "internal"
              }
              onChange={(e) =>
                handleReferenceChange(row.id, e.target.checked, "internal")
              }
              className="w-4 h-4 cursor-pointer accent-green-600"
            />
          </div>
        );
      },
      style: { textAlign: "center", width: "100px" },
    },

    // jof from refenece

    {
      field: "reference",
      header: "Job Form Reference",
      body: (row) => {
        // Debug: console.log("Row Reference Value:", row.reference);
        return (
          <div
            className="flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={
                row.job_form_referal == 1 &&
                row.reference_type === "external"
              }
              onChange={(e) =>
                handleReferenceChange(row.id, e.target.checked, "external")
              }
              className="w-4 h-4 cursor-pointer accent-blue-600"
            />
          </div>
        );
      },
      style: { textAlign: "center", width: "100px" },
    },
    {
      header: "Company Allocation",
      body: (row) => (
        <button
          onClick={() => {
            setSelectedCompanies(
              row.assignedCompanies ? [...row.assignedCompanies] : [],
            );

            // setSelectedCompanies(row.assignedCompanies || []);
            setSelectedEmployee(row);
            setShowCompanyModal(true);
          }}
          className="text-[#1d6bf2] p-2 rounded-[10px] bg-[#f0f6ff] border cursor-pointer hover:scale-110 transition"
        >
          <PiBuildingOfficeLight />
        </button>
      ),
      style: { textAlign: "center", width: "150px" },
    },

    // {
    //   header: "Status",
    //   body: (row) => {
    //     const isActive = row.employee_dutyStatus === "1";

    //     return (
    //       <span
    //         className={`px-3 py-1 text-xs font-medium rounded-full border
    //         ${isActive
    //             ? "text-green-600 border-green-600"
    //             : "text-red-600 border-red-600"}`}
    //       >
    //         {isActive ? "ACTIVE" : "INACTIVE"}
    //       </span>
    //     );
    //   },
    //   style: { textAlign: "center" }
    // },
    {
      header: "Action",
      body: (row) => (
        <div className="flex gap-4 justify-center">
          <button
            className="text-[#1d6bf2] p-2 rounded-[10px] bg-[#f0f6ff] border cursor-pointer hover:scale-110 transition"
            onClick={() => navigate(`/employeedetails/${row.id}`)}
          >
            <FaEye />
          </button>
          <button
            className="text-[#1d6bf2] p-2 rounded-[10px] bg-[#f0f6ff] border cursor-pointer hover:scale-110 transition"
            onClick={() => navigate(`/editemployeedetails/${row.id}`)}
          >
            <TfiPencilAlt />
          </button>
          <button
            className="p-2 bg-[#FFD1D1] text-[#DC2626] hover:bg-[#FFE2E2] rounded-[10px] "
            onClick={() => handleDeleteUser(row.id)}
          >
            <MdOutlineDeleteOutline />
          </button>
        </div>
      ),
      style: { textAlign: "center" },
    },
  ];

  //   const showUserDetails = (employee) => {
  //   navigate(`/employeedetails/${employee.id}`, {
  //     state: { employee }
  //   });

  //   window.scrollTo({
  //     top: 0,
  //     behavior: "instant",
  //   });
  // };

  // const location = useLocation();
  // console.log(location.state.employee);

  const roleDropdownOptions = roleOptions.map((role) => ({
    label: role.name,
    value: role.id,
  }));
  const filteredCompanyOptions = companyOptions.filter((company) =>
    company.label?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-full min-h-screen px-3 md:px-5 pt-1 md:pt-5 overflow-x-auto">
      <>
        <div>
          {/* breadcrumbs */}

          <div className="cursor-pointer">
            <Mobile_Sidebar />
          </div>
          <div className="flex justify-start mt-2 md:mt-0 gap-2 items-center">
            <ToastContainer />
            <p
              className="text-sm md:text-md text-gray-500  cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </p>
            <p>{">"}</p>

            <p className="text-sm  md:text-md  text-[#1ea600]">Employees</p>
          </div>

          <div className="flex flex-wrap md:flex-row justify-between items-center ">
            <div>
              <p className="hidden md:block text-xl md:text-3xl font-semibold mt-1 md:mt-4">
                Employees
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 w-full md:w-auto mt-2 md:mt-0">
              {/* ROLE FILTER */}
              <Dropdown
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.value)}
                options={roleDropdownOptions}
                placeholder="All Roles"
                filter
                className="h-9 md:h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none"
              />

              {/* ADD BUTTON */}
              <button
                onClick={onClickAddNewMember}
                className="h-9 md:h-10 flex items-center gap-2 text-sm text-white bg-[#1ea600] hover:bg-[#1c8005] font-medium px-4 rounded-lg"
              >
                Add New Member
                <BiSolidMessageAltAdd />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
              <Loader count={8} />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-start md:justify-end gap-1 mt-6 md:space-x-3">
                {/* STATUS FILTER */}
                {/* <select
                  className="px-3 py-2 w-full md:w-40 cursor-pointer rounded-md border"
                  onChange={(e) => filterEmployee(e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="1" selected>
                    Active
                  </option>
                  <option value="0">Relieved</option>
                </select> */}
              </div>

              <div className="datatable-container md:mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span>Show</span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({
                        label: v,
                        value: v,
                      }))}
                      onChange={(e) => onRowsChange(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span>Entries Per Page</span>
                  </div>

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
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div>
                </div>
                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    className="mt-2 md:mt-8"
                    value={employeeData}
                    paginator
                    rows={rows}
                    first={(page - 1) * rows}
                    onPage={onPageChange}
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

              {showCompanyModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                  {/* Overlay */}
                  <div
                    className="absolute inset-0 z-40"
                    onClick={() => setShowCompanyModal(false)}
                  ></div>
                  <div className="relative z-50 bg-white rounded-xl shadow-xl w-[80%] md:w-full max-w-4xl max-h-[90vh] overflow-hidden overflow-y-auto p-2">
                    <div className="flex justify-between items-center p-3 md:p-6 border-b">
                      <h2 className="text-sm md:text-lg font-semibold mb-2 md:mb-4">
                        Assign Company – {selectedEmployee.full_name}
                      </h2>
                      {/* Search box */}
                      <div className="relative w-64">
                        <FiSearch
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />

                        <InputText
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search..."
                          className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                      </div>
                      <button
                        onClick={() => setShowCompanyModal(false)}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        ×
                      </button>
                    </div>

                    {/* Company list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 space-y-1 md:space-y-3 max-h-[200px] overflow-y-auto">
                      {filteredCompanyOptions.length > 0 ? (
                        filteredCompanyOptions.map((company) => (
                          <label
                            key={company.value}
                            className="flex items-center gap-3"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCompanies.includes(
                                company.value,
                              )}
                              onChange={(e) =>
                                handleCompanyToggle(company, e.target.checked)
                              }
                            />
                            <span>{company.label}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 col-span-full">
                          No companies found
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-5">
                      <button
                        onClick={() => setShowCompanyModal(false)}
                        className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleCompanySubmit}
                        className="bg-[#005AEF] hover:bg-[#2879FF] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </>

      <Footer />
    </div>
  );
};

export default Employees_Card;
