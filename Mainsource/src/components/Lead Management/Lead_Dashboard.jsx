import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Loader from "../Loader";
import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";

const Lead_Dashboard = () => {
  let navigate = useNavigate();

  // State management
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  // Dashboard data
  const [categoryData, setCategoryData] = useState([]);
  const [leadDetails, setLeadDetails] = useState([]);

  // Modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(null);

  // Dummy data for demonstration

  const dummyLeadDetails = [
    {
      id: 1,
      name: "John Doe",
      category: "facebook",
      status: "open",
      date: new Date().toISOString(),
      email: "john@example.com",
      phone: "1234567890",
    },
    {
      id: 2,
      name: "Jane Smith",
      category: "facebook",
      status: "joined",
      date: new Date().toISOString(),
      email: "jane@example.com",
      phone: "0987654321",
    },
    {
      id: 3,
      name: "Bob Johnson",
      category: "instagram",
      status: "interested",
      date: new Date().toISOString(),
      email: "bob@example.com",
      phone: "1122334455",
    },
    {
      id: 4,
      name: "Alice Brown",
      category: "portal",
      status: "not_interested",
      date: new Date().toISOString(),
      email: "alice@example.com",
      phone: "5566778899",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      category: "facebook",
      status: "follow_up",
      date: new Date().toISOString(),
      email: "charlie@example.com",
      phone: "6677889900",
    },
    {
      id: 6,
      name: "David Lee",
      category: "instagram",
      status: "open",
      date: new Date().toISOString(),
      email: "david@example.com",
      phone: "7788990011",
    },
    {
      id: 7,
      name: "Emma Davis",
      category: "portal",
      status: "joined",
      date: new Date().toISOString(),
      email: "emma@example.com",
      phone: "8899001122",
    },
  ];

  // Initialize data on component mount
  useEffect(() => {
    fetchDashboardData(fromDate, toDate);
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async (startDate, endDate) => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Set dummy data
      // setCategoryData(dummyCategoryData);
      setLeadDetails(dummyLeadDetails);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // toast.error("Failed to load dashboard data");

      // Fallback dummy data
      // setCategoryData(dummyCategoryData);
      setLeadDetails(dummyLeadDetails);
    } finally {
      setLoading(false);
    }
  };

  // Handle category click
  // const handleCategoryClick = (category) => {
  //   setSelectedCategory(category);

  //   // Generate status data for selected category
  //   generateStatusData(category.category);

  //   setIsCategoryModalOpen(true);
  // };

  // Generate status data for category
  const generateStatusData = (category) => {
    // Filter leads for the selected category
    const categoryLeads = dummyLeadDetails.filter(
      (lead) => lead.category === category,
    );

    // Count by status
    const statusCounts = {
      open: 0,
      joined: 0,
      interested: 0,
      not_interested: 0,
      follow_up: 0,
      not_picked: 0,
    };

    // Count occurrences
    categoryLeads.forEach((lead) => {
      if (statusCounts.hasOwnProperty(lead.status)) {
        statusCounts[lead.status]++;
      }
    });

    // Convert to array format
    const statusDataArray = [
      { id: 1, status: "open", count: statusCounts.open, label: "Open" },
      { id: 2, status: "joined", count: statusCounts.joined, label: "Joined" },
      {
        id: 3,
        status: "interested",
        count: statusCounts.interested,
        label: "Interested / Scheduled",
      },
      {
        id: 4,
        status: "not_interested",
        count: statusCounts.not_interested,
        label: "Not Interested",
      },
      {
        id: 5,
        status: "follow_up",
        count: statusCounts.follow_up,
        label: "Follow Up",
      },
      {
        id: 6,
        status: "not_picked",
        count: statusCounts.not_picked,
        label: "Not Picked",
      },
    ];

    setStatusData(statusDataArray);
  };

  // Handle status click
  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setIsStatusModalOpen(true);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("From date cannot be greater than To date");
      return;
    }

    fetchDashboardData(fromDate, toDate);
    toast.success("Dashboard data updated!");
  };

  // Handle reset
  const handleReset = () => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
    fetchDashboardData(today, today);
    toast.success("Dashboard reset to today!");
  };

  // Category columns
  const categoryColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
      style: { width: "80px" },
    },
    {
      field: "category",
      header: "Category",
      body: (rowData) => (
        <button
          onClick={() => handleCategoryClick(rowData)}
          className="text-green-600 hover:text-green-800 font-medium hover:underline"
        >
          {rowData.category}
        </button>
      ),
    },
    {
      field: "count",
      header: "Count",
      body: (rowData) => (
        <span className="font-semibold text-gray-800">{rowData.count}</span>
      ),
    },
  ];

  // Status columns
  const statusColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
      style: { width: "80px" },
    },
    {
      field: "label",
      header: "Status",
      body: (rowData) => (
        <button
          onClick={() => handleStatusClick(rowData)}
          className="text-green-600 hover:text-green-800 font-medium hover:underline"
        >
          {rowData.label}
        </button>
      ),
    },
    {
      field: "count",
      header: "Count",
      body: (rowData) => (
        <span className="font-semibold text-gray-800">{rowData.count}</span>
      ),
    },
  ];

  // Status details columns
  const statusDetailsColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
      style: { width: "80px" },
    },
    {
      field: "name",
      header: "Name",
    },
    {
      field: "email",
      header: "Email",
    },
    {
      field: "phone",
      header: "Phone",
    },
    {
      field: "date",
      header: "Date",
      body: (rowData) => new Date(rowData.date).toLocaleDateString("en-GB"),
    },
  ];

  // Get filtered leads for status modal
  const getFilteredLeads = () => {
    if (!selectedCategory || !selectedStatus) return [];

    return dummyLeadDetails.filter(
      (lead) =>
        lead.category === selectedCategory.category &&
        lead.status === selectedStatus.statusDatalead,
    );
  };

  //

  const [dasboradData, setDashboardData] = useState([]);
  console.log("dasboradData", dasboradData);

  // const fetchleaddashboard = async () => {
  //   try {
  //     const res = await axiosInstance.get(`${API_URL}api/lead-management/dashboard`);

  //  setDashboardData(res.data);
  //     // console.log("Lead Dashboard Data:", res.data);
  //   } catch (error) {
  //     console.error("Failed to fetch lead dashboard data", error);
  //   }
  // };

  const fetchleaddashboard = async (params = {}) => {
    try {
      const payload = {
        from_date: params.from_date ?? fromDate,
        to_date: params.to_date ?? toDate,
      };

      const queryParams = new URLSearchParams(payload).toString();

      const res = await axiosInstance.get(
        `${API_URL}api/lead-management/dashboard?${queryParams}`,
      );

      setDashboardData(res.data);
    } catch (error) {
      console.error("Failed to fetch lead dashboard data", error);
    }
  };

  useEffect(() => {
    fetchleaddashboard();
  }, []);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedlead, setSelectedlead] = useState(null);
  const [statusData, setStatusData] = useState([]);

  const handleCategoryClick = (rowData) => {
    console.log("Clicked category:", rowData);
    setSelectedCategory(rowData);

    fetchstatusdashboard({
      from_date: fromDate,
      to_date: toDate,
      lead_category_id: rowData.category_id,
    });
  };

    const handleCategoryClicklead = (rowData) => {
    console.log("Clicked category:", rowData);
    setSelectedlead(rowData);
    setIsLeadModalOpen(true);

   
  };

  const statusList = [
    { key: "open", label: "Open" },
    { key: "not_picked", label: "Not Picked" },
    { key: "interested", label: "Interested" },
    { key: "follow_up", label: "Follow Up" },
    { key: "joined", label: "Joined" },
    { key: "not_interested", label: "Not Interested" },
  ];

  const statusDatalead =
    statusList.map((s) => ({
      key: s.key,
      label: s.label,
      count: selectedlead?.status_details?.[s.key] ?? 0,
    })) || [];

  const fetchstatusdashboard = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();

      const res = await axiosInstance.get(
        `${API_URL}api/lead-management/status-wise?${queryParams}`,
      );

      console.log("Lead assign Data:", res.data);

      const apiData = res?.data?.data || [];

      // ✅ convert response for table
      const converted = apiData.map((item) => ({
        status: item.status,
        label: item.status.replaceAll("_", " ").toUpperCase(),
        count: item.count,
      }));

      setStatusData(converted);

      // ✅ open popup
      setIsCategoryModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch lead dashboard data", error);
    }
  };

  // useEffect(() => {
  //   fetchstatusdashboard();
  // }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col justify-between bg-gray-100 md:px-5 px-3 py-2 md:pt-5">
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className=" ">
              <Mobile_Sidebar />
            </div>

            {/* <p className="text-xs md:text-sm mt-3  text-end text-[#1ea600]">Lead Dashboard</p> */}
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="font-semibold ">Lead Dashboard</p>

              {/* Date Filters */}
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="border p-2 rounded-lg w-40"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    max={toDate}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="border p-2 rounded-lg w-40"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    min={fromDate}
                  />
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    // onClick={handleSubmit}
                    onClick={() =>
                      fetchleaddashboard({
                        from_date: fromDate,
                        to_date: toDate,
                      })
                    }
                    className="bg-[#1ea600] hover:bg-[#4BB452] text-white px-4 py-2 rounded-lg transition"
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="dashboard-tables mt-6">
              {/* platorm Wise Count */}
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Platform Wise Count
                  </h2>
                </div>

                <div className="h-[300px] overflow-auto">
                  <DataTable
                    value={dasboradData?.category_data}
                    showGridlines
                    responsiveLayout="scroll"
                    className="data-table"
                    emptyMessage="No Category found."
                  >
                    <Column
                      field="sno"
                      header="S.No"
                      body={(_, options) => options.rowIndex + 1}
                      style={{ width: "80px" }}
                    />
                    <Column
                      field="category"
                      header="Category"
                      body={(rowData) => (
                        <button
                          onClick={() => handleCategoryClick(rowData)}
                          className="text-green-600 hover:text-green-800 font-medium hover:underline"
                        >
                          {rowData.category}
                        </button>
                      )}
                    />

                    <Column field="count" header="Count"
                      body={(rowData) => (
                        <button
                          onClick={() => handleCategoryClick(rowData)}
                          className="text-green-600 hover:text-green-800 font-medium hover:underline"
                        >{rowData.count}</button>
                      )} />
                  </DataTable>
                </div>

                {/* Summary */}
                {/* <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Total Leads: {categoryData.reduce((sum, item) => sum + item.count, 0)}
                  </p>
                </div> */}
              </div>
            </div>

            {/* asshin lead data */}

            <div className="dashboard-tables mt-6">
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Assgin Lead
                  </h2>
                </div>

                <div className="h-[300px] overflow-auto">
                  <DataTable
                    value={dasboradData?.assign_leads}
                    showGridlines
                    responsiveLayout="scroll"
                    className="data-table"
                    emptyMessage="No Category found."
                  >
                    <Column
                      field="sno"
                      header="S.No"
                      body={(_, options) => options.rowIndex + 1}
                      style={{ width: "80px" }}
                    />
                    <Column
                      field="employee_id"
                      header="Employee Id"
                      body={(rowData) => (
                        <button
                          // onClick={() => handleCategoryClicklead(rowData)}
                          className="text-gray-600 hover:text-gray-800 font-medium hover:underline"
                        >
                          {rowData.employee_id}
                        </button>
                      )}
                    />
                    <Column
                      field="employee_name"
                      header="Employee Name"
                      body={(rowData) => (
                        <button
                          onClick={() => handleCategoryClicklead(rowData)}
                          className="text-green-600 hover:text-green-800 font-medium hover:underline"
                        >
                          {rowData.employee_name}
                        </button>
                      )}
                    />
                    <Column field="assign_count" header="Count"
                    body={(rowData) => (
                     <button
                          onClick={() => handleCategoryClicklead(rowData)}
                          className="text-green-600 hover:text-green-800 font-medium hover:underline"
                        >
                          {rowData.assign_count}
                        </button>)} />
                         
                  </DataTable>
                </div>

                {/* Summary */}
                {/* <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Total Leads: {categoryData.reduce((sum, item) => sum + item.count, 0)}
                  </p>
                </div> */}
              </div>
            </div>
          </div>

          {/* Category Modal */}
         <Dialog
  header={
    <div className="flex flex-col">
      <p className="text-lg font-bold text-gray-800">
        {selectedCategory?.employee_name}
      </p>
      <p className="text-sm text-green-700 font-medium">
        Status Wise Count
      </p>
    </div>
  }
  visible={isCategoryModalOpen}
  style={{ width: "75vw", maxWidth: "900px" }}
  onHide={() => setIsCategoryModalOpen(false)}
  className="rounded-2xl"
  footer={
    <div className="flex justify-end gap-3">
      <button
        onClick={() => setIsCategoryModalOpen(false)}
        className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
      >
        Close
      </button>
    </div>
  }
>
  <div className="p-4 md:p-6 bg-white rounded-2xl">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500">
          Showing status counts for
        </p>
        <p className="text-base font-semibold text-gray-800">
          {selectedCategory?.employee_name}
        </p>
      </div>

      <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-200">
        <p className="text-sm text-green-800 font-semibold">
          Total: {statusData.reduce((sum, item) => sum + item.count, 0)}
        </p>
      </div>
    </div>

    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <DataTable
        value={statusData}
        showGridlines={false}
        responsiveLayout="scroll"
        className="w-full"
        emptyMessage="No status data found"
        stripedRows
      >
        <Column
          header="S.No"
          body={(_, options) => (
            <span className="font-semibold text-gray-700">
              {options.rowIndex + 1}
            </span>
          )}
          style={{ width: "80px" }}
          headerClassName="bg-green-600 text-white font-semibold"
          bodyClassName="py-3"
        />

        <Column
          field="label"
          header="Status"
          headerClassName="bg-green-600 text-white font-semibold"
          bodyClassName="py-3 text-gray-700 font-medium"
        />

        <Column
          field="count"
          header="Count"
          headerClassName="bg-green-600 text-white font-semibold"
          bodyClassName="py-3 font-bold text-green-700"
        />
      </DataTable>
    </div>

    <div className="mt-5 p-4 rounded-2xl bg-green-50 border border-green-200">
      <p className="text-sm text-green-900 font-semibold">
        Total in {selectedCategory?.employee_name}:{" "}
        {statusData.reduce((sum, item) => sum + item.count, 0)}
      </p>
    </div>
  </div>
</Dialog>


{/* lead */}
          <Dialog
  header={
    <div className="flex flex-col">
      <p className="text-lg font-bold text-gray-800">
        {selectedlead?.employee_name}
      </p>
      <p className="text-sm text-green-700 font-medium">
        Status Wise Count
      </p>
    </div>
  }
  visible={isLeadModalOpen}
  style={{ width: "75vw", maxWidth: "900px" }}
  onHide={() => setIsLeadModalOpen(false)}
  className="rounded-2xl"
  footer={
    <div className="flex justify-end gap-3">
      <button
        onClick={() => setIsLeadModalOpen(false)}
        className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
      >
        Close
      </button>
    </div>
  }
>
  <div className="p-4 md:p-6 bg-white rounded-2xl">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500">
          Showing status counts for
        </p>
        <p className="text-base font-semibold text-gray-800">
          {selectedlead?.employee_name}
        </p>
      </div>

      <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-200">
        <p className="text-sm text-green-800 font-semibold">
          Total: {statusDatalead.reduce((sum, item) => sum + item.count, 0)}
        </p>
      </div>
    </div>

    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <DataTable
        value={statusDatalead}
        showGridlines={false}
        responsiveLayout="scroll"
        className="w-full"
        emptyMessage="No status data found"
        stripedRows
      >
        <Column
          header="S.No"
          body={(_, options) => (
            <span className="font-semibold text-gray-700">
              {options.rowIndex + 1}
            </span>
          )}
          style={{ width: "80px" }}
          headerClassName="bg-green-600 text-white font-semibold"
          bodyClassName="py-3"
        />

        <Column
          field="label"
          header="Status"
          headerClassName="bg-green-600 text-white font-semibold"
          bodyClassName="py-3 text-gray-700 font-medium"
        />

        <Column
          field="count"
          header="Count"
          headerClassName="bg-green-600 text-white font-semibold"
          bodyClassName="py-3 font-bold text-green-700"
        />
      </DataTable>
    </div>

    <div className="mt-5 p-4 rounded-2xl bg-green-50 border border-green-200">
      <p className="text-sm text-green-900 font-semibold">
        Total in {selectedlead?.employee_name}:{" "}
        {statusDatalead.reduce((sum, item) => sum + item.count, 0)}
      </p>
    </div>
  </div>
</Dialog>


          <Footer />
        </>
      )}
    </div>
  );
};

export default Lead_Dashboard;
