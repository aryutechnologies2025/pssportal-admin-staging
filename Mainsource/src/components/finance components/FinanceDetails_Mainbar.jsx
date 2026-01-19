// import present from "../../assets/present.svg";
// import not_present from "../../assets/not_present.svg";
// import WFH from "../../assets/WFH.svg";
// import { MdArrowForwardIos } from "react-icons/md";
// import finance_piechart from "../../assets/finance_piechart.svg";
// import creditcard from "../../assets/creditcard.png";
// import credit_card1 from "../../assets/credit_card1.png";
// import credit_card2 from "../../assets/credit_card2.png";
// import { useState, useEffect } from "react";
// import { IoArrowUpCircleOutline } from "react-icons/io5";
// import { IoIosArrowForward } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { IoClose } from "react-icons/io5";
// import { IoSettingsOutline } from "react-icons/io5";
// import { BsCalendar4 } from "react-icons/bs";
// import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";
// import { IoIosArrowBack } from "react-icons/io";
// import { PieChart } from "react-minimal-pie-chart";
// import { EffectCards } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/effect-cards";
// import { Swiper, SwiperSlide } from "swiper/react";
// import Footer from "../Footer";
// import Mobile_Sidebar from "../Mobile_Sidebar";

// const FinanceDetails_Mainbar = () => {
//   let navigate = useNavigate();

  

//   return (
//     <div className="flex flex-col justify-between min-h-screen bg-gray-100 px-3 pt-2 md:pt-5 w-screen">
//       <div>
        
//         <Mobile_Sidebar/>

//         <div className="flex gap-2 mt-5 text-sm items-center">
//           <p className=" text-green-500 ">Finance</p>
//           <p>{">"}</p>
//         </div>

//         {/* mainflex */}
//         <div className="flex gap-3 flex-col lg:flex-row  mt-5">
//           {/* leftside div */}
//           <div className="flex flex-grow flex-col gap-3 basis-[55%]">
//             {/* All Expenses Cards */}
//             <section className="bg-white rounded-xl px-5 py-5">
              
//               <div className="flex items-center flex-wrap gap-8 justify-between">
//                 <p className="text-xl md:text-2xl font-semibold">All Expenses</p>
//                 <select
//                   name=""
//                   id=""
//                   className="border-2 border-gray-200 rounded-xl px-3   py-2 "
//                 >
//                   <option value="">Monthly</option>
//                   <option value="">1</option>
//                   <option value="">1</option>
//                 </select>
//               </div>

//               <div className="flex mt-8 flex-col md:flex-row  flex-grow gap-3">
//                 <div className="flex flex-grow w-full md:w-1/3 flex-col bg-green-600 px-5 py-5 rounded-xl">
//                   <div className="flex items-center justify-between">
//                     <img src={present} alt="" className="h-12 w-12" />
//                     <MdArrowForwardIos className="text-white text-2xl" />
//                   </div>

//                   <p className="text-lg md:text-xl font-semibold text-white mt-8">
//                     Balance
//                   </p>
//                   <p className="text-white mt-2">April 2024</p>
//                   <p className="text-xl md:text-2xl font-semibold text-white mt-3">
//                     $20,129
//                   </p>
//                 </div>

//                 <div className="flex flex-grow w-full md:w-1/3 flex-col border bg-white px-5 py-5 rounded-xl">
//                   <div className="flex items-center justify-between">
//                     <img src={not_present} alt="" className="h-12 w-12" />
//                     <MdArrowForwardIos className="text-2xl text-green-500" />
//                   </div>

//                   <p className="text-lg md:text-xl font-semibold  mt-8">Income</p>
//                   <p className="text-gray-500 mt-2">April 2024</p>
//                   <p className=" md:text-2xl font-semibold text-green-500 mt-3">
//                     $20,129
//                   </p>
//                 </div>

//                 <div className="flex flex-grow w-full md:w-1/3 border flex-col bg-white px-5 py-5 rounded-xl">
//                   <div className="flex items-center justify-between">
//                     <img src={WFH} alt="" className="h-12 w-12" />
//                     <MdArrowForwardIos className="text-2xl text-green-500" />
//                   </div>

//                   <p className="text-lg md:text-xl font-semibold  mt-8">Expenses</p>
//                   <p className="text-gray-500 mt-2">April 2024</p>
//                   <p className="text-xl md:text-2xl font-semibold text-green-500 mt-3">
//                     $20,129
//                   </p>
//                 </div>
//               </div>
//             </section>
//             {/* <section className="bg-white rounded-xl px-5 py-5">
//               <div className="flex flex-row gap-8 flex-wrap items-center justify-between  ">
//                 <p className="text-xl md:text-2xl font-semibold">All Expenses</p>
//                 <select
//                   name=""
//                   id=""
//                   className="border-2 border-gray-200 rounded-xl w-fit ml-auto  px-3 py-2 mt-3 "
//                 >
//                   <option value="">Monthly</option>
//                   <option value="">1</option>
//                   <option value="">1</option>
//                 </select>
//               </div>
//               <div className="flex gap-5 md:gap-14 flex-col sm:flex-row px-0 md:px-12 mt-7">
//                 <section className="relative flex items-center justify-center">
//                   <PieChart
//                     className="w-44 h-44 "
//                     startAngle={230}
//                     data={[
//                       { title: "One", value: 50, color: "#E5F33C" },
//                       { title: "Two", value: 35, color: "#E2DECD" },
//                       { title: "Three", value: 20, color: "#111111" },
//                       { title: "Four", value: 30, color: "#00565B" },
//                     ]}
//                   />
//                   <div className="absolute w-32 h-32 bg-white rounded-full"></div>
//                 </section>

//                 <div className="flex flex-row flex-wrap sm:flex-col gap-5 justify-normal sm:justify-center ">
//                   <div className="flex gap-3 items-center">
//                     <div className="h-5 w-5 rounded-full bg-[#E5F33C]"></div>
//                     <p>Tech</p>
//                   </div>
//                   <div className="flex gap-3 items-center">
//                     <div className="h-5 w-5 rounded-full bg-green-900"></div>
//                     <p>Non Tech</p>
//                   </div>
//                   <div className="flex gap-3 items-center">
//                     <div className="h-5 w-5 rounded-full bg-black"></div>
//                     <p>Salary</p>
//                   </div>
//                   <div className="flex gap-3 items-center">
//                     <div className="h-5 w-5 rounded-full bg-gray-200"></div>
//                     <p>Investment</p>
//                   </div>
//                 </div>
//               </div>
//             </section> */}

//             {/* <section className="relative flex items-center justify-center">
//           <PieChart
//           className="w-44 h-44 absolute"
//           startAngle={230}
//             data={[
//               { title: "One", value: 50, color: "#E5F33C" },
//               { title: "Two", value: 35, color: "#E2DECD" },
//               { title: "Three", value: 20, color: "#111111" },
//               { title: "Four", value: 30, color: "#00565B" },
//             ]}
//           />
//           <div className="absolute w-32 h-32 bg-white rounded-full">

//           </div>

//           </section> */}
//           </div>

//           {/* rightside div */}
//           <div className="bg-white flex-grow px-5 py-5 rounded-xl overflow-hidden">
//             {/* <p className="text-2xl font-semibold">All Expenses</p>

//             <Swiper
//               effect="cards"
//               grabCursor={true}
//               loop={true}
//               modules={[EffectCards]}
//               className="w-[20vw] mt-5"
//             >
//               <SwiperSlide>
//                 <img src={creditcard} alt="Credit Card 2" />
//               </SwiperSlide>

//               <SwiperSlide>
//                 <img src={credit_card1} alt="Credit Card 2" />
//               </SwiperSlide>
//               <SwiperSlide>
//                 <img src={credit_card2} alt="Credit Card 3" />
//               </SwiperSlide>
//             </Swiper> */}

//             {/* income history */}
//             <section>
//               <div className="flex flex-wrap justify-between items-center ">
//                 <p className="text-xl md:text-2xl font-semibold mt-5">Income History</p>
//                 <p
//                   onClick={() => navigate("/finance/incomehistory")}
//                   className="bg-green-500 hover:bg-green-600 cursor-pointer mt-5 rounded-md px-5 py-1 md:py-2 text-white"
//                 >
//                   See all
//                 </p>
//               </div>

//               <hr className="my-5" />
//               <p className="text-gray-500 text-base md:text-xl font-medium">13 April 2024</p>

//               <div className="flex flex-col mt-3 gap-3">
//                 <div className="bg-gray-100 rounded-xl px-5 py-5">
//                   <div className="flex justify-between items-center">
//                     <div className="flex flex-col gap-1">
//                       <p className="font-semibold">Deposit</p>
//                       <p className="text-gray-500">13 Apr, 2024 at 3:30 PM</p>
//                     </div>

//                     <p className="text-lg md:text-xl font-semibold text-green-600">
//                       $20,129
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-gray-100 rounded-xl px-5 py-5">
//                   <div className="flex justify-between items-center">
//                     <div className="flex flex-col gap-1">
//                       <p className="font-semibold">Deposit</p>
//                       <p className="text-gray-500">13 Apr, 2024 at 3:30 PM</p>
//                     </div>

//                     <p className="text-lg md:text-xl font-semibold text-green-600">
//                       $20,129
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* expense history */}
//             <section>
//               <div className="flex flex-wrap justify-between items-center ">
//                 <p className="text-xl md:text-2xl font-semibold mt-5">Expense History</p>
//                 <p onClick={()=>navigate('/finance/expensehistory')} className="bg-green-500 hover:bg-green-600 cursor-pointer mt-5 rounded-md px-5 py-1 md:py-2 text-white">
//                   See all
//                 </p>
//               </div>

//               <hr className="my-5" />
//               <p className="text-gray-500 text-base md:text-xl font-medium">13 April 2024</p>

//               <div className="flex flex-col mt-3 gap-3">
//                 <div className="bg-gray-100 rounded-xl px-5 py-5">
//                   <div className="flex justify-between items-center">
//                     <div className="flex flex-col gap-1">
//                       <p className="font-semibold">Cash Withdrawal</p>
//                       <p className="text-gray-500">13 Apr, 2024 at 3:30 PM</p>
//                     </div>

//                     <p className="text-lg md:text-xl font-semibold text-orange-500">
//                       $20,129
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-gray-100 rounded-xl px-5 py-5">
//                   <div className="flex justify-between items-center">
//                     <div className="flex flex-col gap-1">
//                       <p className="font-semibold">Cash Withdrawal</p>
//                       <p className="text-gray-500">13 Apr, 2024 at 3:30 PM</p>
//                     </div>

//                     <p className="text-xl font-semibold text-orange-500">
//                       $20,129
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>

//         {/* {seeAllTransactionHistoryModalOpen && (
//           <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
//             <div className="absolute inset-0 " onClick={closeModal}></div>

//             <div
//               className={`fixed top-0 right-0 h-full w-[90vw] md:w-[70vw] overflow-y-scroll bg-gray-100 shadow-lg px-5 md:px-8 py-5 transform transition-transform duration-500 ease-in-out ${
//                 isAnimating ? "translate-x-0" : "translate-x-full"
//               }`}
//             >
//               <div
//                 className="w-6 h-6 rounded-full  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
//                 title="Toggle Sidebar"
//                 onClick={closeModal}
//               >
//                 <IoIosArrowForward className="w-3 h-3" />
//               </div>

//               <p className="text-2xl font-medium mt-3">Transaction History</p>

//               <div className="bg-white w-full overflow-x-auto rounded-xl p-5 mt-5 custom-scrollbar">
//                 <table className="min-w-[900px] mt-5 ">
//                   <thead className="text-left border-b-2 border-gray-200 ">
//                     <tr className="text-left text-[#718EBF]">
//                       <th className="py-2 font-medium text-sm">Description</th>
//                       <th className="py-2 font-medium text-sm">
//                         Transaction ID
//                       </th>
//                       <th className="py-2 font-medium text-sm">Type</th>
//                       <th className="py-2 font-medium text-sm">Card</th>
//                       <th className="py-2 font-medium text-sm">Date</th>
//                       <th className="py-2 font-medium text-sm">Amount</th>
//                       <th className="py-2 font-medium text-sm">Receipt</th>
//                     </tr>
//                   </thead>

//                   <tbody className="text-left ">
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                     <tr className="text-left border-b-2  border-gray-200">
//                       <td className="py-4 flex items-center gap-2">
//                         <IoArrowUpCircleOutline className="text-2xl text-[#718EBF]" />
//                         <p className="text-sm"> Spotify Subscription</p>
//                       </td>
//                       <td className="py-4 text-sm">#12548796</td>
//                       <td className="py-4 text-sm">Shopping</td>
//                       <td className="py-4 text-sm">1234 ****</td>
//                       <td className="py-4 text-sm">28 Jan, 12.30 AM</td>
//                       <td className="py-4 text-sm text-red-500">-$2,500</td>
//                       <td>
//                         <p className="border-2 text-sm border-blue-900 text-blue-900 rounded-full py-1 px-3 w-fit">
//                           Download
//                         </p>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )} */}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default FinanceDetails_Mainbar;


import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';

import { Toast } from 'primereact/toast';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import axiosInstance from '../../axiosConfig';
import Mobile_Sidebar from '../Mobile_Sidebar';
// import './FinanceDetails.css';

const FinanceDetails = () => {
    const [financeRequests, setFinanceRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusOptions] = useState([
        { label: 'Pending', value: 'Pending' },
        { label: 'Waiting for MD Approval', value: 'Waiting for MD Approval' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Approved', value: 'Approved' }
    ]);
    const [userDetails, setUserDetails] = useState(null);
    const toast = useRef(null);

    // Get user details from localStorage on component mount
    useEffect(() => {
        const storedDetails = localStorage.getItem("pssuser");
        if (storedDetails) {
            const parsedDetails = JSON.parse(storedDetails);
            setUserDetails(parsedDetails);
            console.log("User Details:", parsedDetails);
        }
        fetchFinanceRequests();
    }, []);

    const fetchFinanceRequests = async () => {
        setLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axiosInstance.get('/api/finance-requests');
            setFinanceRequests(response.data);
        } catch (error) {
            console.error('Error fetching finance requests:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load finance requests',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (rowData, newStatus) => {
        if (!userDetails) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'User not authenticated',
                life: 3000
            });
            return;
        }

        const updateData = {
            id: rowData.id,
            status: newStatus,
            updated_by: userDetails.id,
            updated_by_role: userDetails.role, // Assuming role is stored in user object
            updated_by_name: userDetails.name || userDetails.username
        };

        try {
            // Replace with your actual API endpoint
            const response = await axios.put('/api/update-finance-status', updateData);
            
            if (response.data.success) {
                // Update local state
                const updatedRequests = financeRequests.map(item =>
                    item.id === rowData.id 
                    ? { ...item, status: newStatus, updated_by: userDetails.id } 
                    : item
                );
                setFinanceRequests(updatedRequests);

                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Status updated successfully',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update status',
                life: 3000
            });
        }
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <Dropdown
                value={rowData.status}
                options={statusOptions}
                onChange={(e) => handleStatusChange(rowData, e.value)}
                placeholder="Select Status"
                className={`status-dropdown status-${rowData.status.toLowerCase().replace(/\s+/g, '-')}`}
            />
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <button
                label="Update"
                icon="pi pi-check"
                className="p-button-sm p-button-outlined"
                onClick={() => {
                    // You can add additional logic here if needed
                    console.log('Update action for:', rowData);
                }}
            />
        );
    };

    const amountBodyTemplate = (rowData) => {
        return `₹ ${rowData.amount.toLocaleString()}`;
    };

    const dummyData = [
  {
    sno: 1,
    date: "13 Apr 2024",
    employee: {
      name: "John Doe",
      id: "EMP001",
    },
    company: {
      name: "ABC Pvt Ltd",
    },
    amount: 20129,
    status: "Approved",
    updated_by: "Admin",
  },
  {
    sno: 2,
    date: "14 Apr 2024",
    employee: {
      name: "Jane Smith",
      id: "EMP002",
    },
    company: {
      name: "XYZ Corp",
    },
    amount: 15200,
    status: "Pending",
    updated_by: "Manager",
  },
];

const employeeBodyTemplate = (row) => (
  <div className="flex flex-col">
    <span className="font-medium">{row.employee?.name}</span>
    <span className="text-xs text-gray-500">
      ID: {row.employee?.id}
    </span>
  </div>
);

const companyBodyTemplate = (row) => (
  <span>{row.company?.name}</span>
);





    // Column definitions
    const columns = [
        { field: 'sno', header: 'S.No',  },
        { field: 'date', header: 'Date',  },
        { field: 'employeeName', header: 'Employee Name',  },
        { field: 'companyName', header: 'Company Name',  },
        { field: 'amount', header: 'Amount', body: amountBodyTemplate,  },
        { field: 'status', header: 'Status', body: statusBodyTemplate,  },
        { field: 'action', header: 'Action', body: actionBodyTemplate }
    ];

    return (
         <div className="flex flex-col min-h-screen bg-gray-100 px-3 pt-2 md:pt-5 w-screen">
    


    <Mobile_Sidebar />

    {/* Breadcrumbs */}
    <div className="flex gap-2 mt-5 text-sm items-center">
      <p className="text-gray-500">Finance</p>
      <p>{">"}</p>
      <p className="text-sm  md:text-md  text-[#1ea600]">Finance Requests</p>
    </div>
            
            <div className="card">
                {/* <h2>Finance Request Details</h2>
                <div className="user-info">
                    {userDetails && (
                        <small>
                            Logged in as: {userDetails.name || userDetails.username} 
                            ({userDetails.role}) | ID: {userDetails.id}
                        </small>
                    )}
                </div> */}
                
                <DataTable
                    value={dummyData}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    emptyMessage="No finance requests found."
                    responsiveLayout="scroll"
                >
                    <Column field="sno" header="S.No"  style={{ width: '80px' }} />
                    <Column field="date" header="Date"  style={{ width: '120px' }} />
                    <Column field="employeeName" header="Employee Name"  style={{ width: '150px' }} />
                    <Column field="companyName" header="Company Name"  style={{ width: '150px' }} />
                    <Column field="amount" header="Amount"  style={{ width: '120px' }} body={amountBodyTemplate} />
                    <Column field="status" header="Status"  style={{ width: '200px' }} body={statusBodyTemplate} />
                    <Column field="updated_by" header="Updated By"  style={{ width: '120px' }} />
                    <Column header="Action" body={actionBodyTemplate} style={{ width: '120px' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default FinanceDetails;