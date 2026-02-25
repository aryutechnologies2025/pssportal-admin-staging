import { BrowserRouter, Routes, Route } from "react-router-dom";
import Employees from "./pages/Employees";
import CreateEmployee from "./pages/CreateEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import Attendance from "./pages/Attendance";
import MonthlyAttendanceDetails from "./pages/MonthlyAttendanceDetails";
import Leaves from "./pages/Leaves";
import Finance from "./pages/Finance";
import Payroll from "./pages/Payroll";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import PageNotFound from "./pages/PageNotFound";
import Vacancy from "./pages/Vacancy";
import CreateVacancy from "./pages/CreateVacancy";
import Roles from "./pages/Roles";
import Permission from "./pages/Permission";
import Sitemap from "./pages/Sitemap";
import Income_History from "./pages/Income_History";
import Expense_History from "./pages/Expense_History";
import Job_Application from "./pages/Job_Application";
import Company from "./pages/Company";
import Job_form from "./components/job form/Job_form";
import ContractCandidates from "./pages/ContractCandidates";
import Attendance_Add_Details from "./components/attendance components/Attendance_Add_Details";
import Attendance_add_main from "./components/attendance components/Attendance_Add_Main";
import Contact from "./pages/Contact";
import Attendance_Edit_Main from "./components/attendance components/Attendance_Edit_Main";
import Attendance_view_main from "./components/attendance components/Attendance_view_Main";

import Department from "./pages/Department";
import Branch from "./pages/Branch";
import Employee_contract_details from "./components/employee contract component/Employee_contract_details";
import Employee_contract_main from "./pages/Employee_contract_main";

import Setting from "./pages/Setting";

import Shift from "./pages/Shipt";
import Activity from "./pages/Activity";
import AssetManagement_mainbar from "./pages/Asset Pages/AssetManagement_mainbar";
import AssetCategory_mainbar from "./pages/Asset Pages/AssetCategory_mainbar";
import AssetSubCategory_mainbar from "./pages/Asset Pages/AssetSubCategory_mainbar";

import Reports_Mainbar from "./pages/Report_Mainbar";
import LeadManagement from "./pages/LeadManagement";
import Pss_company_Mainbar from "./pages/Pss_company_Mainbar";
import DailyWork_Report_Main from "./pages/DailyWork_Report_Main";
import Finance_Request from "./pages/Finance_Request";
import Holiday from "./pages/Holiday";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PSS_Attendance from "./pages/Pss_Attendance";
import Announcement_Mainbar from "./components/announcement/Announcement";
import Announcement_Mainbar_page from "./pages/Announcement";
import BoardingPoint_Main from "./pages/BoardingPoint_Main";
import Education_Main from "./pages/Education_Main";
import Contract_Report_main from "./components/Contract Report component/Contract_Report_main";
import Relieved_Main from "./components/relieved component/Relieved_Main";
import Lead_Dashboard from "./components/Lead Management/Lead_Dashboard";
import Lead_Dashboard_Main from "./pages/Lead_Dashboard_Main";
import Lead_Category_Main from "./pages/Lead_Category_Main";
import Lead_AssignedTo_Main from "./pages/Lead_AssignedTo_Main";
import MonthlyWorkReport_Main from "./components/Daily work report component/MonthlyWorkReport_Main";
import ProtectedRoute from "./auth/Protected_Route";
import { useState } from "react";
import PublicRoute from "./auth/PublicRoute ";
import { useTokenExpiry } from "./hooks/useTokenExpiry";
import Lead_Edit_Assigned_Main from "./pages/Lead_Edit_Assigned_Main";
import Lead_Add_Assigned_Main from "./pages/Lead_Add_Assigned_Main";
import Lead_View_Assigned_Main from "./pages/Lead_View_Assigned_Main";
import Lead_Assign_Report_Main from "./pages/LeadAssignReport";

// Routes component that uses hooks (inside Router context)
function AppRoutes() {
  const user = JSON.parse(localStorage.getItem("pssuser"));
  const isLoggedIn = !!user;

  // Monitor token expiry (now inside Router context)
  useTokenExpiry();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 999999 }}
      />

      <Routes>
        {/* PUBLIC */}

        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />

        {/* PROTECTED ROOT */}
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/permission" element={<Permission />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/branches" element={<Branch />} />
          <Route path="/shift" element={<Shift />} />
          <Route path="/job-form" element={<Job_form />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/reports" element={<Reports_Mainbar />} />
          <Route path="/pssdailyattendance" element={<PSS_Attendance />} />
          <Route
            path="/assetmanagement"
            element={<AssetManagement_mainbar />}
          />
          <Route path="/assetcategory" element={<AssetCategory_mainbar />} />
          <Route
            path="/assetsubcategory"
            element={<AssetSubCategory_mainbar />}
          />

          <Route path="/company" element={<Company />} />
          <Route path="/psscompany" element={<Pss_company_Mainbar />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contractcandidates" element={<ContractCandidates />} />
          <Route path="/holiday" element={<Holiday />} />

          <Route
            path="/employeecontract"
            element={<Employee_contract_main />}
          />
          <Route path="/jobapplication" element={<Job_Application />} />
          <Route path="/createvacancy" element={<CreateVacancy />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="createemployee" element={<CreateEmployee />} />
          <Route path="employeedetails/:id" element={<EmployeeDetails />} />
          <Route path="editemployeedetails/:id" element={<CreateEmployee />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="boarding-point" element={<BoardingPoint_Main />} />
          <Route path="education" element={<Education_Main />} />
          <Route
            path="monthlyattendancedetails"
            element={<MonthlyAttendanceDetails />}
          />
          <Route path="/attendance-add" element={<Attendance_add_main />} />
          <Route
            path="/attendance-edit/:id"
            element={<Attendance_Edit_Main />}
          />
          <Route
            path="/attendance-view/:id"
            element={<Attendance_view_main />}
          />

          <Route path="leaves" element={<Leaves />} />
          <Route path="finance" element={<Finance />} />
          <Route path="finance-details" element={<Finance_Request />} />
          <Route path="finance/incomehistory" element={<Income_History />} />
          <Route path="finance/expensehistory" element={<Expense_History />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="message" element={<Messages />} />
          <Route path="sitemap" element={<Sitemap />} />
          <Route path="setting" element={<Setting />} />
          <Route path="lead-engine" element={<LeadManagement />} />
          <Route path="lead-assign-report" element={<Lead_Assign_Report_Main />} />
          <Route path="lead-dashboard" element={<Lead_Dashboard_Main />} />
          <Route path="lead-assignedto" element={<Lead_AssignedTo_Main />} />
          <Route path="lead-assignedto-add" element={<Lead_Add_Assigned_Main/>} />
          <Route path="lead-assignedto-edit/:id" element={<Lead_Edit_Assigned_Main/>} />
          <Route path="lead-assignedto-view/:id" element={<Lead_View_Assigned_Main/>} />
          <Route path="lead-category" element={<Lead_Category_Main />} />
          <Route path="dailywork-report" element={<DailyWork_Report_Main />} />
          <Route path="announcement" element={<Announcement_Mainbar_page />} />
          <Route path="contract-report" element={<Contract_Report_main />} />
          <Route path="relieved-contract" element={<Relieved_Main />} />
          <Route
            path="monthly-workreport"
            element={<MonthlyWorkReport_Main />}
          />

          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
