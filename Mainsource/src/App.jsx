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
import 'react-toastify/dist/ReactToastify.css';
import PSS_Attendance from "./pages/Pss_Attendance";

function App() {
  return (
    <>
     


      <BrowserRouter>

      <ToastContainer
  position="top-right"
  autoClose={3000}
 closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>
      
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<Login />} />
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
          <Route path="/assetmanagement" element={<AssetManagement_mainbar />} />
          <Route path="/assetcategory" element={<AssetCategory_mainbar />} />
          <Route path="/assetsubcategory" element={<AssetSubCategory_mainbar />} />

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
          <Route path="dailywork-report" element={<DailyWork_Report_Main />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
