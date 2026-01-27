// import React, { useEffect, useState } from "react";
// import Loader from "../Loader";
// import Mobile_Sidebar from "../Mobile_Sidebar";
// import { toast, ToastContainer } from "react-toastify";
// import Footer from "../Footer";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../axiosConfig";
// import { API_URL } from "../../Config";
// import "react-toastify/dist/ReactToastify.css";
// import { MdDelete } from "react-icons/md";

// const Setting_Mainbar = () => {
//   const [loading, setLoading] = useState(false);
//   let navigate = useNavigate();
//   const [faviconPreview, setFaviconPreview] = useState("");
//   const [logoPreview, setLogoPreview] = useState("");

//   const user = JSON.parse(localStorage.getItem("pssuser") || "{}");
// //   console.log("User from localStorage:", user);

//   const userId = user?.id || null;
// //   console.log("User ID to send:", userId);
//   const [settings, setSettings] = useState({
//     admin_email: "",
//     gst_number: "",
//     address: "",
//     created_by: "",
//   });

//   const [favicon, setFavicon] = useState(null);
//   const [logo, setLogo] = useState(null);

//   const [dateFormat, setDateFormat] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setSettings((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // create
//   const handleSaveSettings = async () => {

//     const formData = new FormData();
//     formData.append("admin_email", settings.admin_email);
//     formData.append("gst_number", settings.gst_number);
//     formData.append("address", settings.address);
//     formData.append("created_by", String(userId));
//     // formData.append("date_format", dateFormat);

//     if (favicon instanceof File) formData.append("fav_icon", favicon);
//     if (logo instanceof File) formData.append("site_logo", logo);

//     setLoading(true);

//     try {
//       const res = await axiosInstance.post(`${API_URL}api/settings`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.status || res.data.success) {
//         toast.success(res.data.message || "Settings saved successfully");
//         fetchSettings();
//       } else {
//         toast.error(res.data.message || "Failed to save settings");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // view
//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(`${API_URL}api/settings`);

//       if ((res.data.success || res.data.status) && res.data.data) {
//         const data = res.data.data;

//         setSettings({
//           admin_email: data.admin_email ?? "",
//           gst_number: data.gst_number ?? "",
//           address: data.address ?? "",
//           created_by: data.created_by ?? "",
//         });

//         setFaviconPreview(data.fav_icon ? `${API_URL}${data.fav_icon}` : "");

//         setLogoPreview(data.site_logo ? `${API_URL}${data.site_logo}` : "");
//       }
//     } catch (error) {
//       console.error("Fetch settings error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex  flex-col bg-gray-50  px-3 md:px-5 pt-2 w-full min-h-screen overflow-x-auto">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//       />
//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           <div>
//             <div className="">
//               <Mobile_Sidebar />
//             </div>
//             <div className="flex justify-start gap-2 mt-2 md:mt-1 items-center">
//               <p
//                 className="text-xs md:text-sm text-gray-500  cursor-pointer"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 Dashboard
//               </p>
//               <p>{">"}</p>
//               <p className="text-xs  md:text-sm  text-[#1ea600]">Setting</p>
//             </div>

//             {/* Main */}
//             <div className="flex flex-wrap justify-between items-center w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
//               <div className="mt-4 ">
//                 <h2 className="text-lg md:text-2xl font-medium">
//                   General Setting
//                 </h2>
//                 <div className="flex flex-wrap gap-y-5 gap-x-14 mt-5">
//                   {/* Favicon Upload */}
//                   <div className="flex flex-col gap-2 w-full md:w-[40%]">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Favicon
//                     </label>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) {
//                           setFavicon(file);
//                           setFaviconPreview(URL.createObjectURL(file));
//                         }
//                       }}
//                       className="border w-full border-gray-300 rounded-lg p-2 text-sm"
//                     />

//                     {faviconPreview && (
//                       <div className="relative w-fit mt-2">
//                         <img
//                           src={faviconPreview}
//                           alt="Favicon Preview"
//                           className="w-10 h-10 rounded"
//                         />

//                         {/* Delete Icon */}
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setFavicon(null);
//                             setFaviconPreview(null);
//                           }}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                         >
//                           <MdDelete size={14} />
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Logo Upload */}
//                   <div className="flex flex-col gap-2 w-full md:w-[40%]">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Logo
//                     </label>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) {
//                           setLogo(file);
//                           setLogoPreview(URL.createObjectURL(file));
//                         }
//                       }}
//                       className="border w-full border-gray-300 rounded-lg p-2 text-sm"
//                     />

//                     {logoPreview && (
//                       <div className="relative w-fit mt-2">
//                         <img
//                           src={logoPreview}
//                           alt="Logo Preview"
//                           className="w-24 h-auto rounded"
//                         />

//                         {/* Delete Icon */}
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setLogo(null);
//                             setLogoPreview(null);
//                           }}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                         >
//                           <MdDelete size={16} />
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-2 w-full md:w-[40%]">
//                     <label
//                       htmlFor="adminemail"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Admin Email
//                     </label>
//                     <input
//                       type="email"
//                       name="admin_email"
//                       value={settings.admin_email}
//                       onChange={handleChange}
//                       placeholder="Enter Email"
//                       className="border w-full border-gray-300 rounded-lg p-2 text-sm"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2 w-full md:w-[40%]">
//                     <label
//                       htmlFor="GST"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       GST Number
//                     </label>
//                     <input
//                       type="text"
//                       name="gst_number"
//                       value={settings.gst_number}
//                       onChange={handleChange}
//                       placeholder="Enter GST Number"
//                       className="border w-full border-gray-300 rounded-lg p-2 text-sm"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2 w-full md:w-[40%]">
//                     <label
//                       htmlFor="address"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       name="address"
//                       value={settings.address}
//                       onChange={handleChange}
//                       placeholder="Enter Address"
//                       className="border w-full border-gray-300 rounded-lg p-2 text-sm"
//                     />
//                   </div>

//                   <hr className="border-t-2 border-gray w-full"></hr>
//                   <div className="mt-4 ">
//                     <h2 className="text-lg md:text-2xl font-medium">
//                       Date Format
//                     </h2>

//                     <div className="mt-5 flex flex-col gap-4">
//                       <div className="flex gap-3">
//                         <input
//                           id="dd/MM/yyyy"
//                           name="dateformat"
//                           type="radio"
//                           value="dd/MM/yyyy"
//                           className="cursor-pointer"
//                           checked={dateFormat === "dd/MM/yyyy"}
//                           onChange={(e) => setDateFormat(e.target.value)}
//                         />{" "}
//                         <label htmlFor="dd/MM/yyyy" className="cursor-pointer">
//                           DD/MM/YYYY
//                         </label>
//                       </div>

//                       <div className="flex gap-3">
//                         <input
//                           id="MM/dd/yyyy"
//                           name="dateformat"
//                           type="radio"
//                           value="MM/dd/yyyy"
//                           className="cursor-pointer"
//                           checked={dateFormat === "MM/dd/yyyy"}
//                           onChange={(e) => setDateFormat(e.target.value)}
//                         />
//                         <label htmlFor="MM/dd/yyyy" className="cursor-pointer">
//                           MM/DD/YYYY
//                         </label>
//                       </div>

//                       <div className="flex gap-3">
//                         <input
//                           id="yyyy/MM/dd"
//                           name="dateformat"
//                           type="radio"
//                           value="yyyy/MM/dd"
//                           className="cursor-pointer"
//                           checked={dateFormat === "yyyy/MM/dd"}
//                           onChange={(e) => setDateFormat(e.target.value)}
//                         />
//                         <label htmlFor="yyyy/MM/dd" className="cursor-pointer">
//                           YYYY/MM/DD
//                         </label>
//                       </div>
//                       <div className="flex gap-3">
//                         <input
//                           id="MM/dd/yy"
//                           name="dateformat"
//                           type="radio"
//                           value="MM/dd/yy"
//                           className="cursor-pointer"
//                           checked={dateFormat === "MM/dd/yy"}
//                           onChange={(e) => setDateFormat(e.target.value)}
//                         />
//                         <label htmlFor="MM/dd/yy" className="cursor-pointer">
//                           MM/DD/YY
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex justify-end items-center">
//                   <button
//                     onClick={handleSaveSettings}
//                     className="bg-[#1ea600] text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//       <div className="fixed bottom-0 left-0 w-full flex justify-center items-center">
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Setting_Mainbar;



import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { API_URL } from "../../Config";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";


const Setting_Mainbar = () => {
  const navigate = useNavigate();

  // 🔹 Separate loading states
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [favicon, setFavicon] = useState(null);
  const [logo, setLogo] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  const [dateFormat, setDateFormat] = useState("");

  const user = JSON.parse(localStorage.getItem("pssuser") || "{}");
  const userId = user?.id || "";

  const [settings, setSettings] = useState({
    admin_email: "",
    gst_number: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 FETCH SETTINGS
  const fetchSettings = async () => {
    setPageLoading(true);
    try {
      const res = await axiosInstance.get(`${API_URL}api/settings`);

      console.log("Fetch Settings Response:", res);
      if (res.data?.data) {
        const data = res.data.data;
        setSettings({
          admin_email: data.admin_email ?? "",
          gst_number: data.gst_number ?? "",
          address: data.address ?? "",
        });
        setDateFormat(data.date_format ?? "");
        setFaviconPreview(data.fav_icon ? `${API_URL}${data.fav_icon}` : "");
        setLogoPreview(data.site_logo ? `${API_URL}${data.site_logo}` : "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 🔹 SAVE SETTINGS
  const handleSaveSettings = async () => {
    // console.log("SAVE CLICKED ✅");

    const formData = new FormData();
    formData.append("admin_email", settings.admin_email);
    formData.append("gst_number", settings.gst_number);
    formData.append("address", settings.address);
    formData.append("created_by", String(userId));
    formData.append("date_format", dateFormat);

    if (favicon) formData.append("fav_icon", favicon);
    if (logo) formData.append("site_logo", logo);

    setSaveLoading(true);

    try {
      await axiosInstance.post(`${API_URL}api/settings`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Settings saved successfully");
      fetchSettings();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 px-3 md:px-5 pt-2 w-full min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {pageLoading ? (
        <Loader />
      ) : (
        <>
          <Mobile_Sidebar />

          <div className="flex gap-2 mt-2 items-center">
            <p
              className="text-xs text-gray-500 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </p>
            <p>{">"}</p>
            <p className="text-xs text-[#1ea600]">Setting</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 mt-4">
            <h2 className="text-2xl font-medium mb-6">General Setting</h2>

               <div className="flex flex-wrap gap-y-5 gap-x-14 mt-5">                   {/* Favicon Upload */}                   <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label className="block text-sm font-medium text-gray-700">                      Favicon                     </label>

                     <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFavicon(file);
                          setFaviconPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="border w-full border-gray-300 rounded-lg p-2 text-sm"
                    />

                    {faviconPreview && (
                      <div className="relative w-fit mt-2">
                        <img
                          src={faviconPreview}
                          alt="Favicon Preview"
                          className="w-10 h-10 rounded"
                        />

                        {/* Delete Icon */}
                        <button
                          type="button"
                          onClick={() => {
                            setFavicon(null);
                            setFaviconPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <IoClose  size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Logo Upload */}
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label className="block text-sm font-medium text-gray-700">
                      Logo
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setLogo(file);
                          setLogoPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="border w-full border-gray-300 rounded-lg p-2 text-sm"
                    />

                    {logoPreview && (
                      <div className="relative w-fit mt-2">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-24 h-auto rounded"
                        />

                        {/* Delete Icon */}
                        <button
                          type="button"
                          onClick={() => {
                            setLogo(null);
                            setLogoPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <IoClose size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="adminemail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Admin Email
                    </label>
                    <input
                      type="email"
                      name="admin_email"
                      value={settings.admin_email}
                      onChange={handleChange}
                      placeholder="Enter Email"
                      className="border w-full border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="GST"
                      className="block text-sm font-medium text-gray-700"
                    >
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gst_number"
                      value={settings.gst_number}
                      onChange={handleChange}
                      placeholder="Enter GST Number"
                      className="border w-full border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={settings.address}
                      onChange={handleChange}
                      placeholder="Enter Address"
                      className="border w-full border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>
</div>
            {/* DATE FORMAT */}
          <div>

                       <hr className="border-t-2 border-gray mt-5  w-full"></hr>

            
              <h3 className="text-lg font-medium mb-2 mt-5">Date Format</h3>
            {["dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd", "MM/dd/yy"].map(
              (format) => (
                <div key={format} className="flex gap-2 mb-2">
                  <input
                    type="radio"
                    value={format}
                    checked={dateFormat === format}
                    onChange={(e) => setDateFormat(e.target.value)}
                  />
                  <label>{format.toUpperCase()}</label>
                </div>
              )
            )}
          </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveSettings}
                disabled={saveLoading}
                className="bg-[#1ea600] text-white px-6 py-2 rounded-lg"
              >
                {saveLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Setting_Mainbar;
