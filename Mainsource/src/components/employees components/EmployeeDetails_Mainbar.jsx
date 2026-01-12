
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import sample from "../../assets/sample.jpg";
import Footer from "../Footer";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaFileWord } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileImage } from "react-icons/fa";
import Mobile_Sidebar from "../Mobile_Sidebar";
import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";
import { formatToDDMMYYYY } from "../../Utils/dateformat";

const EmployeeDetails_Mainbar = () => {
  let navigate = useNavigate();
  const { id } = useParams();

  const [employeeData, setEmployeeData] = useState(null);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}api/role`
      );

      const rolesData = response?.data?.data || [];

      const formattedRoles = rolesData.map((role) => ({
        id: role.id,
        role_name: role.role_name,
        status: role.status
      }));

      setRoles(formattedRoles);


    } catch (err) {
      console.log(err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployee = async () => {

      try {
        const response = await axiosInstance.get(`/api/employees/edit/${id}`);


        setEmployeeData(response?.data?.data);
      } catch (err) {
        console.error("Failed to fetch employee data:", err);
      }
    };

    fetchEmployee();
    fetchRoles();

  }, [id]);



  const openDocument = (url) => {
    window.open(`${API_URL}${url}`, "_blank");
  };

  return (
    <div className="flex flex-col justify-between w-screen min-h-screen bg-gray-100 px-3 md:px-5 pt-2 md:pt-5">
      <div>

        <Mobile_Sidebar />

        {/* breadcrumbs */}
        <div className="flex gap-2  text-sm items-center">
          <p
            onClick={() => navigate("/employees")}
            className=" text-gray-500 cursor-pointer "
          >
            Employees
          </p>
          <p>{">"}</p>
          <p className=" text-[#1ea600] ">Employee Details</p>
          <p>{">"}</p>
        </div>

        <div className="flex gap-8 items-center justify-end mt-5">
          <p className="text-sm font-medium">STATUS</p>
          <p className="border px-8 py-2 text-sm bg-white rounded-xl">Active</p>
        </div>

        <div className="flex flex-col xl:flex-row md:gap-3 mt-3">
          {/* leftsidebar */}
          <div className="basis-[70%] pb-3 md:pb-0">
            <div className="flex flex-col md:flex-row flex-grow gap-3">
              <div className="border-2 flex-grow rounded-2xl bg-white  px-5 py-5">
                <div className="flex gap-3">
                  <div>
                    <div className="flex">
                      <img
                        src={employeeData?.photo ? `${API_URL}${employeeData?.photo}` : sample}
                        alt=""
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col  gap-3">
                    <p className="font-semibold text-2xl">{employeeData?.full_name || "-"}</p>
                    <p className="bg-green-100  px-3 py-1 rounded-full w-fit">{roles?.find(role => role.id == employeeData?.role_id)?.role_name || "-"}</p>
                  </div>
                </div>
                {/*                 
                <div className="flex items-start gap-5 mt-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">DEPARTMENT</p>
                    <p className="font-semibold">Sales & Marketing</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">DATE OF JOINING</p>
                    <p className="font-semibold">{employeeData?.full_name || "-"}</p>
                  </div>
                </div> */}

                <div className="flex flex-col gap-1 bg-gray-200 mt-5 px-8 rounded-2xl py-3">
                  <p className="text-md flex justify-between">Personal Email <span className="font-medium"> {employeeData?.email || "-"}</span></p>
                  <hr className="w-full border-gray-300" />
                  <p className="text-md flex justify-between">Official Email <span className="font-medium"> {employeeData?.offical_email || "-"}</span></p>
                  {/* <p className="mt-2 font-extrabold text-green-500">ON DUTY</p>
                  <p className="mt-2 font-extrabold text-red-500">RELEIVING</p> */}
                </div>
              </div>

              <div className="border-2 bg-white flex-grow rounded-2xl  px-5 py-5">
                <div className="flex justify-between">
                  <p className="text-2xl font-semibold">Personal Info</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Pan No</p>
                    <p className="font-medium text-sm">{employeeData?.pan_no || "-"}</p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Aadhar Number</p>
                    <p className="font-medium text-sm">{employeeData?.aadhaar_no || "-"}</p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Phone Number</p>
                    <p className="font-medium text-sm">{employeeData?.phone_no || "-"}</p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Birthday</p>
                    <p className="font-medium text-sm">{formatToDDMMYYYY(employeeData?.date_of_birth || "-")}</p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Marital Status</p>
                    <p className="font-medium text-sm capitalize">{employeeData?.marital_status || "-"}</p>
                  </div>
                  <hr />
                </div>
              </div>
            </div>

            <div className="border-2 bg-white px-5 py-5 rounded-2xl mt-3 ">
              <div className="flex justify-between">
                <p className="text-2xl font-semibold">Skills</p>

              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {employeeData?.skills && JSON.parse(employeeData?.skills).map((item,index) => (
                  <p key={index} className="px-3 py-1 rounded-full border-2 w-fit ">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex flex-col flex-grow gap-2">
                <div className="border-2 bg-white px-5 py-5 rounded-2xl mt-3 w-full">
                  <div className="flex justify-between">
                    <p className="text-2xl font-semibold">Educations</p>

                  </div>
                  {employeeData?.educations && employeeData?.educations.length > 0 ? (
                    <div>
                      {employeeData?.educations.map((education, index) => (
                        // console.log("education", education),
                        <div key={index} className="mb-3">
                          <p className="font-medium">
                            {education.school_name} {/* Assuming 'degree' is a field in your education object */}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {education.department_name} 
                          </p>
                          <p className="text-sm font-medium mt-1">
                            Graduated {education.year_of_passing} {/* Assuming 'graduationDate' is a field */}
                          </p>
<hr className="" />
                        </div>
                        
                      ))}
                      {/* <hr className="" /> */}
                    </div>
                  ) : (
                    "No education details available"
                  )}




                </div>

                <div className="border-2 bg-white px-5 py-5 rounded-2xl ">
                  <div className="flex justify-between">
                    <p className="text-2xl font-semibold">Emergency Contact</p>
                  </div>
                  {employeeData?.contacts && employeeData?.contacts.length > 0 ? (
                    <div className="flex flex-col gap-8">
                      {employeeData?.contacts.map((contact, index) => (<>
                        <div className="">
                          <div className="flex justify-between mt-3">
                            <p className="text-sm">Full Name</p>
                            <p className="font-medium text-sm">{contact?.name || "-"}</p>
                          </div>
                          <hr className="my-3" />

                          <div className="flex justify-between mt-3">
                            <p className="text-sm">Contact</p>
                            <p className="font-medium text-sm">{contact?.phone_number || "-"}</p>
                          </div>
                          <hr className="my-3" />

                          <div className="flex justify-between mt-3">
                            <p className="text-sm">Relation Type</p>
                            <p className="font-medium text-sm">{contact?.relationship || "-"}</p>
                          </div>
                        </div></>))} <hr className="my-3" /></div>) : "No emergency contact details available"}

                </div>
              </div>

              <div className="flex flex-col flex-grow gap-2">


                <div className="border-2 bg-white mt-3 px-5 py-5 rounded-2xl ">
                  <div className="flex justify-between">
                    <p className="text-2xl font-semibold">Documents</p>

                  </div>

                  <div>
                    {employeeData?.document_groups.map((item) => (
                      <div key={item.title}>
                        <p className="capitalize">{item.title}</p>
                        <div className="ms-5 flex items-center gap-2 flex-wrap">
                          {item.documents.map((document, index) => (
                            <div
                              key={document.id}  // Use 'document.id' for a unique key
                              className="flex gap-1 bg-gray-100 px-4 py-4 hover:bg-gray-200 rounded-xl items-center text-3xl cursor-pointer"
                              onClick={() => openDocument(document.file_path)} // Use 'file_path' for the URL
                            >
                              {/* Check document file type and render corresponding icons */}
                              {document.original_name.includes(".pdf") && <FaFilePdf />}
                              {document.original_name.includes(".jpg") || document.original_name.includes(".jpeg") ? (
                                <FaFileImage />
                              ) : null}
                              {document.original_name.includes(".png") && <FaFileImage />}
                              {document.original_name.includes(".xlsx") && <PiMicrosoftExcelLogoFill />}
                              {document.original_name.includes(".docx") && <FaFileWord />}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>


                </div>

                <div className="border-2 bg-white px-5 py-5 rounded-2xl ">
                  <div className="flex justify-between">
                    <p className="text-2xl font-semibold">Verification Doc</p>
                    <button
                      onClick={() =>
                        navigate("/editemployeedetails", {
                          state: { scrollTo: "verification-doc" },
                        })
                      }
                      className="text-sm h-fit bg-gray-200 px-5 py-2 rounded-3xl"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    <p className="border text-sm font-medium px-3 py-2 rounded-full">
                      Aadhar
                    </p>
                    <p className="border text-sm font-medium px-3 py-2 rounded-full">
                      Salary
                    </p>
                    <p className="border text-sm font-medium px-3 py-2 rounded-full">
                      Education
                    </p>
                    <p className="border text-sm font-medium px-3 py-2 rounded-full">
                      Experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* rightsidebar */}
          <div className="flex flex-row flex-wrap flex-grow xl:flex-col gap-3 basis-[30%]">
            <div className="border-2 flex-grow bg-white px-5 py-5 rounded-2xl ">
              <div className="flex justify-between">
                <p className="text-2xl font-semibold">Bank Information</p>

              </div>

              <div className="flex justify-between mt-3">
                <p className="text-sm">Bank Account No</p>
                <p className="font-medium text-sm">{employeeData?.bank_account_no || "-"}</p>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between mt-3">
                <p className="text-sm">Bank Name</p>
                <p className="font-medium text-sm">{employeeData?.bank_name || "-"}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm">IFSC Code</p>
                <p className="font-medium text-sm">{employeeData?.ifsc_code || "-"}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className="text-sm">Bank Branch</p>
                <p className="font-medium text-sm">{employeeData?.bank_branch || "-"}</p>
              </div>
            </div>

            <div className="border-2 bg-white flex-grow px-5 py-5 rounded-2xl ">
              <div className="flex justify-between">
                <p className="text-2xl font-semibold">Salary Information</p>

              </div>

              <div className="flex justify-between mt-3">
                <p className="text-sm">Salary Basis </p>
                <p className="font-medium text-sm">₹ {employeeData?.salary_basis || "-"}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className="text-sm">Salary Amount</p>
                <p className="font-medium text-sm">₹ {employeeData?.salary_amount || "-"}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className="text-sm">Effective Date</p>
                <p className="font-medium text-sm">{formatToDDMMYYYY(employeeData?.effective_date || "-")}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className="text-sm">Payment Type</p>
                <p className="font-medium text-sm">{employeeData?.payment_type || "-"}</p>
              </div>
            </div>

            <div className="border-2 bg-white px-5 py-5 flex-grow rounded-2xl ">
              <div className="flex justify-between">
                <p className="text-2xl font-semibold">Experience</p>

              </div>
              {employeeData?.experiences && employeeData?.experiences.length > 0 ? (
                <div>
                  {employeeData?.experiences.map((exp, index) => (<>
                    <div className="flex justify-between mt-3">
                      <div className="flex flex-col items-end">
                        <p className="font-semibold text-lg">
                          {exp?.job_title || "-"}
                        </p>

                      </div>

                      <p className="text-sm font-medium me-5">
                        {exp?.from_date}    -  {exp?.to_date}
                      </p>
                    </div>

                    <p className="mt-1 text-sm font-medium">{exp?.company_name || "-"}</p>

                    <p>
                      Previous Salary: ₹ {exp?.previous_salary || "-"}
                    </p>
                    <hr className="my-3" />
                  </>
                  ))} 
                </div>) : "No experience details available"}


            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default EmployeeDetails_Mainbar;
