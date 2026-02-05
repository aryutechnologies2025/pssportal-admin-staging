import { Dropdown } from "primereact/dropdown";

import { Children, useEffect, useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import { IoIosArrowForward } from "react-icons/io";

import { InputText } from "primereact/inputtext";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { TfiPencilAlt } from "react-icons/tfi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Loader from "../Loader";
import Footer from "../Footer";
import { FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { Capitalise } from "../../hooks/useCapitalise";
import { record } from "zod";

const Privileges_Mainbar = () => {
  // const [employeeOption, setEmployeeOption] = useState(null);
  // const [privilegesOption, setPrivilegesOption] = useState(null);

  const [privilegeFor, setPrivilegeFor] = useState("role"); // role | employee

  // console.log("privilegeFor", privilegeFor);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // console.log("selectedEmployee", selectedEmployee, "selectedRole", selectedRole);
  const [userPrivileges, setUserPrivileges] = useState("role"); // roles | employees
  const [tableData, setTableData] = useState([]);
  // console.log("tableData", tableData);
  const normalizedTableData = tableData.map((row) => ({
    ...row,

    roleName:
      userPrivileges === "employee"
        ? row?.employee?.role?.role_name ?? ""
        : row?.role?.role_name ?? "",

    employeeName: row?.employee?.full_name ?? "",
  }));



  const [loading, setLoading] = useState(true);
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  // console.log("selectedPrivileges", selectedPrivileges);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterRole, setFilterRole] = useState(null);
  const [filterEmployee, setFilterEmployee] = useState(null);
  const [addPrivilegesModalOpen, setAddPrivilegesModalOpen] = useState(false);
  const [editPrivilegesModalOpen, setEditPrivilegesModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  const [page, setPage] = useState(1);
  const onPageChange = (e) => {
    setPage(e.page + 1); // PrimeReact is 0-based
    setRows(e.rows);

  };

  const onRowsChange = (value) => {
    setRows(value);
    setPage(1); // Reset to first page when changing rows per page
  };

  // const [getEmpPriviligiesList, setEmpPriviligiesList] = useState([]);


  // console.log("getEmpPriviligiesList", getEmpPriviligiesList);





  // const fetchRolesPrivileges = async () => {
  //   const res = await axiosInstance.get(
  //     // "/api/privileges/roles"
  //   );
  //   setTableData(res.data);
  // };

  // const fetchEmployeePrivileges = async () => {
  //   const res = await axiosInstance.get(
  //     // "/api/privileges/employees"
  //   );
  //   setTableData(res.data);
  // };


  const privilegesOption = [
    {
      name: "Interview",
      children: [
        {
          module: "candidate",
          actions: ["add", "view", "edit", "delete", "filter"]
        }
      ]
    },
    {
      name: "Contract",
      children: [
        {
          module: "Employee",
          actions: ["add", "view", "edit", "delete", "filter", "import"]
        },
        {
          module: "Attendance",
          actions: ["add", "view", "edit", "delete", "filter", "import"]
        }
      ]

    },

  ];



  useEffect(() => {
    if (userPrivileges) {
      fetchPrivileges();
    }
  }, [userPrivileges]);

  // const fetchEmployeeList = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       // `${API_URL}/api/employees/all-employees`,
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     const employeeemail = response.data.data.map((emp) => ({
  //       label: emp.employeeName,
  //       value: emp._id,
  //     }));

  //     setEmployeeOption(employeeemail);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  const [employeeOption, setEmployeeOption] = useState([]);
  const [roleOptions, setRoleOption] = useState([]);

  console.log("roleOptions", roleOptions);



  const fetchPrivileges = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `${API_URL}api/permission`, {
        params: {
          privilege_for: userPrivileges
        }
      },

      );
      setTableData(response?.data.data);

      setEmployeeOption(response?.data?.pssemployees.map((emp) => ({ label: emp.full_name, value: emp.id })));
      setRoleOption(response?.data?.roles.map((role) => ({ label: role.role_name, value: role.id })));
      setLoading(false);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const actionMap = {
    add: "create",
    view: "view",
    edit: "edit",
    delete: "delete",
    import: "import",
    filter: "filter",
  };


  const [permissions, setPermissions] = useState({});
  const [permissionsedit, setPermissionsedit] = useState({});

  // console.log("permissionsedit", permissionsedit);



  const buildPermissionPayload = () => {
    return Object.entries(permissions).map(([module, permission]) => ({
      module,
      permission,
    }));
  };

  const buildFinalPayload = () => {
    return {
      privilege_for: privilegeFor,
      role_name: privilegeFor === "role" ? selectedRole : selectedEmployee,

      created_by: 1,
      moduleList: buildPermissionPayload(),
    };
  };


  const handleSubmit = async () => {
    const payload = buildFinalPayload();
    console.log("API PAYLOAD ", payload);
    try {
      const response = await axiosInstance.post(
        `${API_URL}api/permission/create`,
        payload


      );
      console.log("response", response);

      if (response.data.status === true) {
        toast.success("Privilege created successfully");
        fetchPrivileges();
        setAddPrivilegesModalOpen(false);


      } else {
        toast.error(response.data.message || "Failed to create department");
      }

    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  //Privileges get




  const handlesubmit = async () => {
    // e.preventDefault();
    // console.log(selectedEmployee, selectedPrivileges);

    try {
      const response = await axiosInstance.post(
        // `${API_URL}/api/employees/hr-permission`,
        {
          employeeId: selectedEmployee,
          module: selectedPrivileges,
        }, { withCredentials: true }
      );
      toast.success("Employee added to the admin section successfully.");
      closePrivilegesModal();
      fetchEmpPriviligiesList();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred.");
      closePrivilegesModal();
    }
  };

  // const handleUpdate = () => {
  //   setTableData((prev) =>
  //     prev.map((item) =>
  //       item._id === editPrivilegesRowdata._id
  //         ? { ...item, selectedPrivileges: editPrivilegesRowdata.selectedPrivileges }
  //         : item
  //     )
  //   );

  //   closeEditPrivilegesModal();
  // };

  const handleDelete = async (id) => {

    console.log("id", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the Privilege!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `${API_URL}api/permission/delete`, {
          params: {
            record_id: id
          }
        }

        );

        toast.success("Privilege deleted successfully.");
        fetchPrivileges();
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    }
  };



  const openPrivilegesModal = () => {
    setAddPrivilegesModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openViewModal = (rowData) => {
    setIsViewMode(true);
    setEditPrivilegesRowdata({
      privilegeFor: rowData.privilegeFor || "employee",
      selectedRole: rowData.role_name || null,
      selectedEmployee: rowData.employeeId?.employeeName || null,
      selectedPrivileges: rowData.selectedPrivileges || [],
    });
    setEditPrivilegesModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };


  const closePrivilegesModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setAddPrivilegesModalOpen(false);
      setSelectedEmployee(null);
      setSelectedRole(null);
      setPrivilegeFor("role");
      setSelectedPrivileges([]);
    }, 250);
  };

  const closeEditPrivilegesModal = () => {
    setIsAnimating(false);
    setTimeout(() => setEditPrivilegesModalOpen(false), 250);
  };
  // Privileges get edit
  const [selectedRoleedit, setSelectedRoleedit] = useState(null);
  const [selectedEmployeeedit, setSelectedEmployeeedit] = useState(null);

  const [privilegeForedit, setPrivilegeForedit] = useState({});

  const [editid, setEditid] = useState(null);
  // console.log("editid", editid);


  const openEditPrivilegesModal = (rowData) => {
    // console.log("Edit clicked row ", rowData);

    setIsViewMode(false);

    //  fetch by id
    fetchPrivilegeById(rowData.id);

    setEditPrivilegesModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };


  const fetchPrivilegeById = async (id) => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `${API_URL}api/permission/edit/${id}`
      );

      const data = response?.data?.data;

      console.log("EDIT RESPONSE 👉", data);

      setEditid(data?.permission?.id);
      setPrivilegeForedit(data?.permission?.privilege_for);
      setSelectedRoleedit(data?.permission?.role_id);
      setSelectedEmployeeedit(data?.permission?.role_id);
      setPermissionsedit(mapModulesToPermissions(data.permission?.modules));


    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const mapModulesToPermissions = (modules = []) => {
    const mapped = {};

    // console.log("modules", modules);

    modules.forEach((item) => {
      const key = item.module.toLowerCase();

      mapped[key] = {
        create: Number(item.is_create),
        edit: Number(item.is_edit),
        delete: Number(item.is_delete),
        view: Number(item.is_view),
        import: Number(item.is_import),
        filter: Number(item.is_filter),
      };
    });

    return mapped;
  };


  const buildPermissionPayloadedit = () => {
    return Object.entries(permissionsedit).map(([module, permission]) => ({
      module,
      permission,
    }));
  };
  const buildFinalPayloadedit = () => {
    return {
      privilege_for: privilegeForedit,
      role_name: privilegeForedit === "role" ? selectedRoleedit : selectedEmployeeedit,

      created_by: 1,
      moduleList: buildPermissionPayloadedit(),
    };
  };

  const handleSubmitedit = async () => {
    // console.log("editidddddd", editid);
    if (!editid) {
      toast.error("Invalid permission ID");
      return;
    }
    const payload = buildFinalPayloadedit();
    console.log("API PAYLOAD ", payload);
    try {
      const response = await axiosInstance.post(
        `${API_URL}api/permission/update/${editid}`,
        payload


      );
      // console.log("response", response);

      if (response.data.status === true) {
        toast.success("Privilege updated successfully");
        fetchPrivileges();
        setEditPrivilegesModalOpen(false);


      } else {
        toast.error(response.data.message || "Failed to create department");
      }

    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleResetFilter = () => {
    setFilterRole(null);
    setFilterEmployee(null);
  };

  // static value for role and employee columns action

  const sampleRolePrivileges = [
    {
      _id: "r1",
      role_name: "Admin",
      privileges: ["Employee-view", "Employee-edit", "Interview-view"],
    },
    {
      _id: "r2",
      role_name: "HR",
      privileges: ["Employee-view", "Interview-view"],
    },
    {
      _id: "r3",
      role_name: "Manager",
      privileges: ["Employee-view"],
    },
  ];



  // Default to employee privileges








  // const columns = [
  //   {
  //     field: "sno",
  //     header: "S.No",
  //     body: (_rowData, { rowIndex }) => rowIndex + 1, // display index starting from 1
  //     style: { width: "10px !important", textAlign: "center" }, // Narrow width
  //     bodyStyle: { textAlign: "center" },
  //   },
  //   {
  //     field: "employeeName",
  //     header: "Employee Name",
  //     body: (rowData) => rowData.employeeId?.employeeName || "-",
  //   },
  //   {
  //     field: "role_name",
  //     header: "Role",
  //     body: (rowData) => rowData.employeeId?.role || "-",
  //   },

  //   // {
  //   //   field: "priviliges",
  //   //   header: "Privileges",
  //   // },
  //   {
  //     field: "",
  //     header: "Action",
  //     body: (rowData) => (
  //       <div className="flex justify-center gap-4 text-xl">

  //         <button
  //           onClick={() => openViewModal(rowData)}
  //           className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
  //         >
  //           <FaEye />
  //         </button>
  //         <button
  //           className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
  //           onClick={() => openEditPrivilegesModal(rowData)}
  //         >
  //           <TfiPencilAlt />
  //         </button>

  //         <button
  //           onClick={() => deleteInterviewStatus(rowData)}
  //           className="p-2 bg-[#FFD1D1] text-[#DC2626] hover:bg-[#FFE2E2] rounded-[10px] "
  //         >
  //           <MdOutlineDeleteOutline />
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  //  const columns = [
  //     {
  //       header: "S.No",
  //       body: (_, options) => options.rowIndex + 1,
  //       style: { textAlign: "center", width: "80px" },
  //     },
  //     {
  //       header: "Role",
  //       field: "role_name",
  //       body: (row) => row.role.role_name || "-",
  //     },
  //     {
  //       header: "employee Name",
  //       field: "employee Name",
  //       body: (row) => row.employee_Name || "-",
  //     },

  //     {
  //       header: "Action",
  //       body: (row) => (
  //         <div className="flex gap-4 justify-center items-center">
  //           <button
  //             // onClick={() => handleView(row)}
  //             className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
  //           >
  //             <FaEye />
  //           </button>

  //           <button
  //             className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
  //             // onClick={() => openEditModal(row)}
  //           >
  //             <TfiPencilAlt />
  //           </button>
  //           <button
  //             className="p-2 bg-[#FFD1D1] text-[#DC2626] hover:bg-[#FFE2E2] rounded-[10px] "
  //             // onClick={() => handleDelete(row.id)}
  //           >
  //             <MdOutlineDeleteOutline />
  //           </button>
  //         </div>
  //       ),
  //       style: { textAlign: "center", width: "120px" },
  //     },
  //   ];
  const actionTemplate = (row) => (
    <div className="flex gap-4 justify-center items-center">
      {/* <button className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]">
      <FaEye />
    </button> */}

      <button className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px] hover:bg-[#DFEBFF]"
        onClick={() => openEditPrivilegesModal(row)}
      >
        <TfiPencilAlt />
      </button>

      <button className="p-2 bg-[#FFD1D1] text-[#DC2626] hover:bg-[#FFE2E2] rounded-[10px]"
        onClick={() => handleDelete(row.id)}>
        <MdOutlineDeleteOutline />
      </button>
    </div>
  );


  // const columns = [
  //   {
  //     header: "S.No",
  //     body: (_, options) => options.rowIndex + 1,
  //     style: { textAlign: "center", width: "80px" },
  //   },
  //   {
  //     header: "Role",
  //     body: (row) => row?.role?.role_name || "-",
  //   },

  //   ...(userPrivileges === "employee"
  //     ? [
  //         {
  //           header: "Employee Name",
  //           body: (row) => row?.employee?.full_name || "-",
  //         },
  //       ]
  //     : []),

  //   {
  //     header: "Action",
  //     body: actionTemplate,
  //     style: { textAlign: "center", width: "120px" },
  //   },
  // ];
  // const columns = [
  //   {
  //     header: "S.No",
  //     body: (_, options) => options.rowIndex + 1,
  //     style: { textAlign: "center", width: "80px" },
  //   },

  //   //  Role column (dynamic source)
  //   {
  //     header: "Role",
  //     body: (row) =>
  //       userPrivileges === "employee"
  //         ? row?.employee?.role?.role_name || "-"
  //         : row?.role?.role_name || "-",
  //   },

  //   //  Employee Name only for employee privilege
  //   ...(userPrivileges === "employee"
  //     ? [
  //       {
  //         header: "Employee Name",
  //         body: (row) => row?.employee?.full_name || "-",
  //       },
  //     ]
  //     : []),

  //   {
  //     header: "Action",
  //     body: actionTemplate,
  //     style: { textAlign: "center", width: "120px" },
  //   },
  // ];

  const columns = [
    {
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
      style: { textAlign: "center", width: "80px" },
    },

    {
      header: "Role",
      field: "roleName",
    },

    ...(userPrivileges === "employee"
      ? [
        {
          header: "Employee Name",
          field: "employeeName",
        },
      ]
      : []),

    {
      header: "Action",
      body: actionTemplate,
      style: { textAlign: "center", width: "120px" },
    },
  ];



  const editHandleCheckboxChange = (title, isChecked) => {
    setEditPrivilegesRowdata((prevState) => {
      let updatedModules;

      if (isChecked) {
        updatedModules = [
          ...prevState.module,
          {
            title: title,
            permission: "yes",
          },
        ];
      } else {
        updatedModules = prevState.module.filter((mod) => mod.title !== title);
      }

      return {
        ...prevState,
        module: updatedModules,
      };
    });
  };
  let navigate = useNavigate();

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
            <div className="flex justify-start mt-2 md:mt-0 gap-1 items-center">
              <p
                className=" text-gray-500 text-sm cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-xs md:text-sm text-green-500">Admin Privileges</p>
              <p>{">"}</p>
            </div>

            <div className="flex flex-wrap justify-between mt-2 md:mt-4 mb-1 md:mb-3">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Privileges
              </h2>

              {/* filter */}
              <div className="flex flex-wrap justify-between items-center w-full mt-2 md:mt-5 h-auto gap-2 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]  px-2 py-2 md:px-6 md:py-6 ">

                <div className="md:mt-5 flex w-full md:w-[20%] justify-between gap-2 items-center">
                  <div className="">
                    <label
                      htmlFor="userpriviledges"
                      className="text-md font-medium md:mb-2 md:mt-3 whitespace-nowrap"
                    >
                      Privileges For
                    </label>
                  </div>
                  <div className="w-full lg:w-[60%] rounded-md">
                    <select
                      name="userpriviledges"
                      id="userpriviledges"
                      value={userPrivileges}
                      onChange={(e) => setUserPrivileges(e.target.value)}

                      className="w-full px-2 py-2 border border-gray-300  placeholder:text-sm placeholder:font-normal rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      {/* <option value="">Select A User</option> */}
                      <option value="role">Roles</option>
                      <option value="employee">Employees</option>
                    </select>

                  </div>

                </div>
                {/* Buttons */}
                {/* <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end gap-4">
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
                  </div> */}
              </div>

            </div>

            <div
              className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6"
            >
              <div className="datatable-container">
                {/*DATA Table */}


                <div className="flex flex-wrap md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-semibold text-base text-[#6B7280]">Show</span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({
                        label: v,
                        value: v,
                      }))}
                      onChange={(e) => onRowsChange(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">
                      Entries per page
                    </span>
                  </div>

                  <div className="flex md:flex-row flex-wrap items-center gap-5">
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
                        className="w-full pl-10 pr-3 py-2 rounded-md border border-[#D9D9D9] 
                                     focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />
                    </div>
                    </div>
                    <div className="hidden md:block ">
                    <button
                      onClick={openPrivilegesModal}
                      className=" px-6 py-2 bg-[#1ea600] text-white hover:bg-green-600 font-medium rounded-lg"
                    >
                      Add Privileges
                    </button>
                    </div>
                </div>
                <div className="md:hidden flex justify-end items-end">
                    <button
                      onClick={openPrivilegesModal}
                      className=" px-6 py-2 bg-[#1ea600] text-white hover:bg-green-600 font-medium rounded-lg"
                    >
                      Add Privileges
                    </button>
                    </div>


                {/* Table Container with Relative Position */}
                <div className="relative mt-4">
                  {/* Loader Overlay */}
                  {/* {loading && <Loader />} */}

                  {/* DataTable */}
                  <DataTable
                    className="mt-8"
                    value={normalizedTableData}
                    paginator
                    rows={rows}
                    first={(page - 1) * rows}
                    onPage={onPageChange}
                    globalFilter={globalFilter}
                    globalFilterFields={["roleName", "employeeName"]}
                    rowsPerPageOptions={[5, 10, 20]}
                    showGridlines
                    emptyMessage="No privilege records found."
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    paginatorClassName="custom-paginator"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                  >
                    {columns.map((col, index) => (
                      <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                        style={{
                          minWidth: "150px",
                          wordWrap: "break-word",
                          overflow: "hidden",
                          whiteSpace: "normal",
                        }}
                      />
                    ))}
                  </DataTable>

                </div>
              </div>
            </div>


            {/* modal for adding privileges  */}
            {addPrivilegesModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div
                  className="absolute inset-0 "
                  onClick={closePrivilegesModal}
                ></div>

                <div
                  className={`fixed top-0 right-0 overflow-y-auto w-full h-full md:w-[53vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Toggle Sidebar"
                    onClick={closePrivilegesModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="px-5 lg:px-14 py-3 md:py-10">
                    <p className="text-xl md:text-2xl font-medium">Add Privileges</p>

                    {/* radio and dropdown */}

                    {/* PRIVILEGE FOR */}
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4 mb-6 mt-5">
                      <label className="text-md font-medium">
                        Privilege For
                      </label>

                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="privilegeFor"
                            checked={privilegeFor === "role"}
                            onChange={() => setPrivilegeFor("role")}
                          />
                          Role
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="privilegeFor"
                            checked={privilegeFor === "employee"}
                            onChange={() => setPrivilegeFor("employee")}
                          />
                          Employee
                        </label>
                      </div>
                    </div>

                    {/* ROLE / EMPLOYEE DROPDOWN */}
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4 mb-2 md:mb-10">
                      <label className="text-md font-medium">
                        {privilegeFor === "role" ? "Role" : "Employee"}
                      </label>

                      {privilegeFor === "role" ? (
                        <Dropdown
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.value)}
                          options={roleOptions}
                          filter
                          placeholder="Select Role"
                          className="w-full md:w-[300px] rounded-md border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                      ) : (
                        <Dropdown
                          value={selectedEmployee}
                          onChange={(e) => setSelectedEmployee(e.value)}
                          options={employeeOption}
                          placeholder="Select Employee"
                          className="w-full md:w-[300px] rounded-md border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          filter
                        />
                      )}
                    </div>



                    <div className="mt-3 md:mt-16  rounded-lg ">
                      <div className="mt-3 md:mt-10 flex flex-col gap-3 md:gap-8">

                        {/* privileges checkbox */}
                        <div className="space-y-8">
                          {privilegesOption.map((section) => (
                            <div
                              key={section.title}
                              className="border rounded-lg p-4 bg-white shadow"
                            >
                              <h3 className="text-lg font-bold mb-4">{section.title}</h3>

                              {section.children.map((child) => (
                                <div key={child.module} className="mb-5">
                                  <p className="font-medium mb-2 capitalize">{child.module}</p>

                                  <div className="flex flex-wrap gap-5">
                                    {child.actions.map((action) => {
                                      const moduleKey = child.module.toLowerCase();
                                      const permissionKey = actionMap[action];

                                      const checked =
                                        permissions?.[moduleKey]?.[permissionKey] === 1;

                                      return (
                                        <label
                                          key={`${child.module}-${action}`}
                                          className="flex items-center gap-2 text-sm"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => {
                                              setPermissions((prev) => ({
                                                ...prev,
                                                [moduleKey]: {
                                                  create: prev?.[moduleKey]?.create ?? 0,
                                                  edit: prev?.[moduleKey]?.edit ?? 0,
                                                  delete: prev?.[moduleKey]?.delete ?? 0,
                                                  view: prev?.[moduleKey]?.view ?? 0,
                                                  import: prev?.[moduleKey]?.import ?? 0,
                                                  filter: prev?.[moduleKey]?.filter ?? 0,
                                                  [permissionKey]: e.target.checked ? 1 : 0,
                                                },
                                              }));
                                            }}
                                          />
                                          {action.charAt(0).toUpperCase() + action.slice(1)}
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}

                        </div>



                        <div className="flex md:justify-end gap-2 mt-4">
                          <button
                            onClick={closePrivilegesModal}
                            className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"

                          >
                            Cancel
                          </button>
                          <button
                            className="bg-[#1ea600] text-white hover:bg-green-600 px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"

                            onClick={handleSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for Edit/View Privileges */}
            {editPrivilegesModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                <div className="absolute inset-0" onClick={closeEditPrivilegesModal}></div>
                <div className={`fixed top-0 right-0 overflow-y-auto w-full h-full md:w-[53vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"}`}>
                  <div className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer" onClick={closeEditPrivilegesModal}>
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="px-5 lg:px-14 py-3 md:py-10">
                    <p className="text-xl md:text-2xl font-medium">Edit User Privileges</p>



                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4 mb-6 mt-5">
                      <label className="text-md font-medium">
                        Privilege For
                      </label>

                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="privilegeForedit"
                            value="role"
                            checked={privilegeForedit === "role"}
                            onChange={() => setPrivilegeForedit("role")}
                          // disabled={true} // Disabled in edit mode
                          />


                          Role
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="privilegeForedit"
                            value="employee"
                            checked={privilegeForedit === "employee"}
                            onChange={() => setPrivilegeForedit("employee")}
                          // disabled={true} // Disabled in edit mode
                          />
                          Employee
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-14 items-center justify-between">
                      <label className="block text-md font-medium">
                        {privilegeForedit === "role" ? "Role" : "Employee"}
                      </label>
                      {privilegeForedit === "role" ? (
                        <Dropdown
                          value={selectedRoleedit}
                          onChange={(e) => setSelectedRoleedit(e.value)}
                          options={roleOptions}
                          optionLabel="label"
                          optionValue="value"
                          filter
                          placeholder="Select Role"
                          className="w-full md:w-[300px] rounded-md border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        />
                      ) : (
                        <Dropdown
                          value={selectedEmployeeedit}
                          onChange={(e) => setSelectedEmployeeedit(e.value)}
                          options={employeeOption}
                          placeholder="Select Employee"
                          className="w-full md:w-[300px] rounded-md border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          filter
                        />
                      )}
                    </div>


                    <div className="mt-3 md:mt-16 rounded-lg">
                      <div className="mt-3 md:mt-10 flex flex-col gap-3 md:gap-8">
                        <div className="space-y-8">
                          {privilegesOption.map((section) => (
                            <div
                              key={section.title}
                              className="border rounded-lg p-4 bg-white shadow"
                            >
                              <h3 className="text-lg font-bold mb-4">{section.title}</h3>

                              {section.children.map((child) => (
                                <div key={child.module} className="mb-5">
                                  <p className="font-medium mb-2 capitalize">{child.module}</p>

                                  <div className="flex flex-wrap gap-5">
                                    {child.actions.map((action) => {
                                      const moduleKey = child.module.toLowerCase();
                                      const permissionKey = actionMap[action];

                                      // safety check
                                      if (!permissionKey) return null;

                                      const checked =
                                        Number(permissionsedit?.[moduleKey]?.[permissionKey]) === 1;

                                      return (
                                        <label
                                          key={`${child.module}-${action}`}
                                          className="flex items-center gap-2 text-sm"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => {
                                              const isChecked = e.target.checked ? 1 : 0;

                                              setPermissionsedit((prev) => ({
                                                ...prev,
                                                [moduleKey]: {
                                                  create: prev?.[moduleKey]?.create ?? 0,
                                                  edit: prev?.[moduleKey]?.edit ?? 0,
                                                  delete: prev?.[moduleKey]?.delete ?? 0,
                                                  view: prev?.[moduleKey]?.view ?? 0,
                                                  import: prev?.[moduleKey]?.import ?? 0,
                                                  filter: prev?.[moduleKey]?.filter ?? 0,
                                                  [permissionKey]: isChecked,
                                                },
                                              }));
                                            }}
                                          />

                                          {action.charAt(0).toUpperCase() + action.slice(1)}
                                        </label>
                                      );
                                    })}

                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>

                        <div className="flex md:justify-end gap-2 mt-4">
                          <button onClick={closeEditPrivilegesModal} className="hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C] text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200">
                            Cancel
                          </button>
                          <button className="bg-[#1ea600] text-white hover:bg-green-600 px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                            onClick={handleSubmitedit}>
                            Update
                          </button>
                        </div>
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

export default Privileges_Mainbar;