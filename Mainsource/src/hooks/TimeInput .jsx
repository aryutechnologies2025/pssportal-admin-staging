// import React, { useEffect, useRef, useState } from "react";

// const TimeDropdown = ({ value, onChange }) => {
//   const boxRef = useRef(null);
//   const popupRef = useRef(null);

//   const [open, setOpen] = useState(false);

//   // TEMP values (not saved until OK)
//   const [tempHour, setTempHour] = useState("01");
//   const [tempMinute, setTempMinute] = useState("00");
//   const [tempAmpm, setTempAmpm] = useState("AM");

//   const [pos, setPos] = useState({ top: 0, left: 0 });

//   // Open dropdown and load temp values
//   const openDropdown = () => {
//     if (value) {
//       const [time, ap] = value.split(" ");
//       const [h, m] = time.split(":");
//       setTempHour(h);
//       setTempMinute(m);
//       setTempAmpm(ap);
//     }

//     const rect = boxRef.current.getBoundingClientRect();
//     setPos({
//       top: rect.bottom + 6,
//       left: rect.left,
//     });

//     setOpen(true);
//   };

//   // Close when clicking outside (NO SAVE)
//   useEffect(() => {
//     const close = (e) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(e.target) &&
//         !boxRef.current.contains(e.target)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);

//   // Save ONLY on OK
//   const handleOk = () => {
//     onChange(`${tempHour}:${tempMinute} ${tempAmpm}`);
//     setOpen(false);
//   };

//   return (
//     <>
//       {/* Display box */}
//       <div
//         ref={boxRef}
//         onClick={() => (open ? setOpen(false) : openDropdown())}
//         className="border border-green-600 bg-white text-green-700 px-3 py-1 rounded-lg shadow-sm cursor-pointer min-w-[120px] text-center"
//       >
//         {value || "Select Time"}
//       </div>

//       {/* Popup */}
//       {open && (
//         <div
//           ref={popupRef}
//           className="fixed bg-white border border-green-500 rounded-lg shadow-xl p-3 w-60"
//           style={{
//             top: pos.top,
//             left: pos.left,
//             zIndex: 9999,
//           }}
//         >
//           <div className="flex gap-2 mb-3 justify-between">
//             {/* Hour */}
//             <select
//               value={tempHour}
//               onChange={(e) => setTempHour(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1 text-green-700"
//             >
//               {Array.from({ length: 12 }, (_, i) => {
//                 const h = String(i + 1).padStart(2, "0");
//                 return (
//                   <option key={h} value={h}>
//                     {h}
//                   </option>
//                 );
//               })}
//             </select>

//             {/* Minute */}
//             <select
//               value={tempMinute}
//               onChange={(e) => setTempMinute(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1 text-green-700"
//             >
//               {["00", "15", "30", "45"].map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>

//             {/* AM / PM */}
//             <select
//               value={tempAmpm}
//               onChange={(e) => setTempAmpm(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1 text-green-700 font-semibold"
//             >
//               <option value="AM">AM</option>
//               <option value="PM">PM</option>
//             </select>
//           </div>

//           {/* OK */}
//           <button
//             onClick={handleOk}
//             className="w-full bg-green-600 text-white py-1 rounded-md hover:bg-green-700"
//           >
//             OK
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default TimeDropdown;


// import React, { useEffect, useRef, useState } from "react";

// const TimeDropdown = ({ value, onChange }) => {
//   const boxRef = useRef(null);
//   const popupRef = useRef(null);

//   const [open, setOpen] = useState(false);

//   // DEFAULT AM
//   const [tempHour, setTempHour] = useState("09");
//   const [tempMinute, setTempMinute] = useState("00");
//   const [tempAmpm, setTempAmpm] = useState("AM");

//   const [pos, setPos] = useState({ top: 0, left: 0 });

//   // Open dropdown → load existing value OR default AM
//   const openDropdown = () => {
//     if (value) {
//       const parts = value.split(" ");
//       if (parts.length === 2) {
//         const [h, m] = parts[0].split(":");
//         setTempHour(h || "09");
//         setTempMinute(m || "00");
//         setTempAmpm(parts[1] || "AM");
//       }
//     } else {
//       // fallback default
//       setTempHour("09");
//       setTempMinute("00");
//       setTempAmpm("AM");
//     }

//     const rect = boxRef.current.getBoundingClientRect();
//     setPos({
//       top: rect.bottom + 6,
//       left: rect.left,
//     });

//     setOpen(true);
//   };

//   // Close popup (NO SAVE)
//   useEffect(() => {
//     const close = (e) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(e.target) &&
//         !boxRef.current.contains(e.target)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);

//   // SAVE ONLY ON OK
//   const handleOk = () => {
//     onChange(`${tempHour}:${tempMinute} ${tempAmpm}`);
//     setOpen(false);
//   };

//   return (
//     <>
//       {/* Display */}
//       <div
//         ref={boxRef}
//         onClick={() => (open ? setOpen(false) : openDropdown())}
//         className="border border-green-600 bg-white text-green-700 px-3 py-1 rounded-lg shadow-sm cursor-pointer min-w-[120px] text-center"
//       >
//         {value || "09:00 AM"}
//       </div>

//       {/* Popup */}
//       {open && (
//         <div
//           ref={popupRef}
//           className="fixed bg-white border border-green-500 rounded-lg shadow-xl p-3 w-60"
//           style={{
//             top: pos.top,
//             left: pos.left,
//             zIndex: 9999,
//           }}
//         >
//           <div className="flex gap-2 mb-3 justify-between">
//             {/* Hour */}
//             <select
//               value={tempHour}
//               onChange={(e) => setTempHour(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1 text-green-700"
//             >
//               {Array.from({ length: 12 }, (_, i) => {
//                 const h = String(i + 1).padStart(2, "0");
//                 return (
//                   <option key={h} value={h}>
//                     {h}
//                   </option>
//                 );
//               })}
//             </select>

//             {/* Minute */}
//             <select
//               value={tempMinute}
//               onChange={(e) => setTempMinute(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1 text-green-700"
//             >
//               {["00", "15", "30", "45"].map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>

//             {/* AM / PM */}
//             <select
//               value={tempAmpm}
//               onChange={(e) => setTempAmpm(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1 text-green-700 font-semibold"
//             >
//               <option value="AM">AM</option>
//               <option value="PM">PM</option>
//             </select>
//           </div>

//           {/* OK */}
//           <button
//             onClick={handleOk}
//             className="w-full bg-green-600 text-white py-1 rounded-md hover:bg-green-700"
//           >
//             OK
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default TimeDropdown;


// import React, { useEffect, useRef, useState } from "react";

// const TimeDropdown = ({ value, onChange }) => {
//   const boxRef = useRef(null);
//   const popupRef = useRef(null);

//   const [open, setOpen] = useState(false);

//   // DEFAULT TIME
//   const [tempHour, setTempHour] = useState("09");
//   const [tempMinute, setTempMinute] = useState("00");
//   const [tempAmpm, setTempAmpm] = useState("AM");

//   const [pos, setPos] = useState({ top: 0, left: 0 });

//   // Open dropdown → load existing value OR default
//   const openDropdown = () => {
//     if (value) {
//       const parts = value.split(" ");
//       if (parts.length === 2) {
//         const [h, m] = parts[0].split(":");
//         setTempHour(h || "09");
//         setTempMinute(m || "00");
//         setTempAmpm(parts[1] || "AM");
//       }
//     } else {
//       setTempHour("09");
//       setTempMinute("00");
//       setTempAmpm("AM");
//     }

//     const rect = boxRef.current.getBoundingClientRect();
//     setPos({
//       top: rect.bottom + 6,
//       left: rect.left,
//     });

//     setOpen(true);
//   };

//   // Close popup on outside click (NO SAVE)
//   useEffect(() => {
//     const close = (e) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(e.target) &&
//         !boxRef.current.contains(e.target)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);

//   // SAVE ONLY ON OK
//   const handleOk = () => {
//     onChange(`${tempHour}:${tempMinute} ${tempAmpm}`);
//     setOpen(false);
//   };

//   return (
//     <>
//       {/* DISPLAY BOX */}
//       <div
//         ref={boxRef}
//         onClick={() => (open ? setOpen(false) : openDropdown())}
//         className="border border-green-600 bg-white text-green-700 px-3 py-1
//                    rounded-lg shadow-sm cursor-pointer min-w-[120px]
//                    flex items-center justify-between gap-2"
//       >
//         <span>{value || "09:00 AM"}</span>

//         {/* DROPDOWN ARROW */}
//         <span
//           className={`text-green-600 text-xs transition-transform duration-200 ${
//             open ? "rotate-180" : ""
//           }`}
//         >
//           ▼
//         </span>
//       </div>

//       {/* POPUP */}
//       {open && (
//         <div
//           ref={popupRef}
//           className="fixed bg-white border border-green-500 rounded-lg shadow-xl p-3 w-60"
//           style={{
//             top: pos.top,
//             left: pos.left,
//             zIndex: 9999,
//           }}
//         >
//           <div className="flex gap-2 mb-3 justify-between">
//             {/* HOUR */}
//             <select
//               value={tempHour}
//               onChange={(e) => setTempHour(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1 text-green-700"
//             >
//               {Array.from({ length: 12 }, (_, i) => {
//                 const h = String(i + 1).padStart(2, "0");
//                 return (
//                   <option key={h} value={h}>
//                     {h}
//                   </option>
//                 );
//               })}
//             </select>

//             {/* MINUTE */}
//             <select
//               value={tempMinute}
//               onChange={(e) => setTempMinute(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1 text-green-700"
//             >
//               {["00", "15", "30", "45"].map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>

//             {/* AM / PM */}
//             <select
//               value={tempAmpm}
//               onChange={(e) => setTempAmpm(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1 text-green-700 font-semibold"
//             >
//               <option value="AM">AM</option>
//               <option value="PM">PM</option>
//             </select>
//           </div>

//           {/* OK BUTTON */}
//           <button
//             onClick={handleOk}
//             className="w-full bg-green-600 text-white py-1 rounded-md hover:bg-green-700"
//           >
//             OK
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default TimeDropdown;
// import React, { useEffect, useRef, useState } from "react";

// const TimeDropdown = ({ value, onChange, disabled = false }) => {
//   const boxRef = useRef(null);
//   const popupRef = useRef(null);

//   const [open, setOpen] = useState(false);

//   const [tempHour, setTempHour] = useState("09");
//   const [tempMinute, setTempMinute] = useState("00");
//   const [tempAmpm, setTempAmpm] = useState("AM");

//   const [pos, setPos] = useState({ top: 0, left: 0 });

//   const openDropdown = () => {
//     if (disabled) return;

//     if (value) {
//       const parts = value.split(" ");
//       if (parts.length === 2) {
//         const [h, m] = parts[0].split(":");
//         setTempHour(h || "09");
//         setTempMinute(m || "00");
//         setTempAmpm(parts[1] || "AM");
//       }
//     } else {
//       setTempHour("09");
//       setTempMinute("00");
//       setTempAmpm("AM");
//     }

//     const rect = boxRef.current.getBoundingClientRect();
//     setPos({
//       top: rect.bottom + 6,
//       left: rect.left,
//     });

//     setOpen(true);
//   };

//   // Close popup
//   useEffect(() => {
//     if (disabled) return;

//     const close = (e) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(e.target) &&
//         !boxRef.current.contains(e.target)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, [disabled]);

//   const handleOk = () => {
//     if (disabled) return;
//     onChange && onChange(`${tempHour}:${tempMinute} ${tempAmpm}`);
//     setOpen(false);
//   };

//   return (
//     <>
//       {/* DISPLAY */}
//       <div
//         ref={boxRef}
//         onClick={openDropdown}
//         className={`px-3 py-1 rounded-lg min-w-[120px] flex items-center justify-between gap-2
//           ${
//             disabled
//               ? "border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
//               : "border border-green-600 bg-white text-green-700 cursor-pointer"
//           }`}
//       >
//         <span>{value || "09:00 AM"}</span>

//         <span
//           className={`text-xs transition-transform ${
//             open ? "rotate-180" : ""
//           } ${disabled ? "text-gray-400" : "text-green-600"}`}
//         >
//           ▼
//         </span>
//       </div>

//       {/* POPUP */}
//       {open && !disabled && (
//         <div
//           ref={popupRef}
//           className="fixed bg-white border border-green-500 rounded-lg shadow-xl p-3 w-60"
//           style={{
//             top: pos.top,
//             left: pos.left,
//             zIndex: 9999,
//           }}
//         >
//           <div className="flex gap-2 mb-3 justify-between">
//             <select
//               value={tempHour}
//               onChange={(e) => setTempHour(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1"
//             >
//               {Array.from({ length: 12 }, (_, i) =>
//                 String(i + 1)
//                   .padStart(2, "0")
//                   .split()
//                   .map((h) => (
//                     <option key={h} value={h}>
//                       {h}
//                     </option>
//                   ))
//               )}
//             </select>

//             <select
//               value={tempMinute}
//               onChange={(e) => setTempMinute(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1"
//             >
//               {["00", "15", "30", "45"].map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={tempAmpm}
//               onChange={(e) => setTempAmpm(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1"
//             >
//               <option value="AM">AM</option>
//               <option value="PM">PM</option>
//             </select>
//           </div>

//           <button
//             onClick={handleOk}
//             className="w-full bg-green-600 text-white py-1 rounded-md"
//           >
//             OK
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default TimeDropdown;



// import React, { useEffect, useRef, useState } from "react";

// const TimeDropdown = ({ value, onChange, disabled = false }) => {
//   const boxRef = useRef(null);
//   const popupRef = useRef(null);

//   const [open, setOpen] = useState(false);
//   const [tempHour, setTempHour] = useState("09");
//   const [tempMinute, setTempMinute] = useState("00");
//   const [tempAmpm, setTempAmpm] = useState("AM");

//   const [pos, setPos] = useState({ top: -100, left: 0 });

//   // Open dropdown
//   const openDropdown = () => {
//     if (disabled) return;

//     if (value) {
//       const parts = value.split(" ");
//       if (parts.length === 2) {
//         const [h, m] = parts[0].split(":");
//         setTempHour(h || "09");
//         setTempMinute(m || "00");
//         setTempAmpm(parts[1] || "AM");
//       }
//     } else {
//       setTempHour("09");
//       setTempMinute("00");
//       setTempAmpm("AM");
//     }

//     const rect = boxRef.current.getBoundingClientRect();
//     setPos({
//       top: rect.bottom + window.scrollY, // include scroll for modal
//       left: rect.left + window.scrollX,
//     });

//     setOpen(true);
//   };

//   // Close popup on outside click
//   useEffect(() => {
//     if (disabled) return;

//     const handleClickOutside = (e) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(e.target) &&
//         !boxRef.current.contains(e.target)
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [disabled]);

//   // Save selected value
//   const handleOk = () => {
//     if (disabled) return;
//     onChange && onChange(`${tempHour}:${tempMinute} ${tempAmpm}`);
//     setOpen(false);
//   };

//   return (
//     <>
//       {/* Display box */}
//       <div
//         ref={boxRef}
//         onClick={openDropdown}
//         className={`px-3 py-1 rounded-lg min-w-[120px] flex items-center justify-between gap-2
//           ${disabled
//             ? "border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
//             : "border border-green-600 bg-white text-green-700 cursor-pointer"
//           }`}
//       >
//         <span>{value || "09:00 AM"}</span>
//         <span className={`text-xs transition-transform ${open ? "rotate-180" : ""} ${disabled ? "text-gray-400" : "text-green-600"}`}>
//           ▼
//         </span>
//       </div>

//       {/* Popup */}
//       {open && !disabled && (
//         <div
//           ref={popupRef}
//           className="absolute bg-white border border-green-500 rounded-lg shadow-xl p-3 w-60"
//           style={{
         
//             zIndex: 2000, // higher than modal
//           }}
//         >
//           <div className="flex gap-2 mb-3 justify-between">
//             {/* Hour */}
//             <select
//               value={tempHour}
//               onChange={(e) => setTempHour(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1"
//             >
//               {Array.from({ length: 12 }, (_, i) => {
//                 const h = String(i + 1).padStart(2, "0");
//                 return <option key={h} value={h}>{h}</option>;
//               })}
//             </select>

//             {/* Minute */}
//             <select
//               value={tempMinute}
//               onChange={(e) => setTempMinute(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1"
//             >
//               {["00", "15", "30", "45"].map((m) => (
//                 <option key={m} value={m}>{m}</option>
//               ))}
//             </select>

//             {/* AM / PM */}
//             <select
//               value={tempAmpm}
//               onChange={(e) => setTempAmpm(e.target.value)}
//               className="border border-green-400 rounded px-2 py-1"
//             >
//               <option value="AM">AM</option>
//               <option value="PM">PM</option>
//             </select>
//           </div>

//           {/* OK button */}
//           <button
//             onClick={handleOk}
//             className="w-full bg-green-600 text-white py-1 rounded-md hover:bg-green-700"
//           >
//             OK
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default TimeDropdown;



import React, { useEffect, useRef, useState } from "react";

const TimeDropdown = ({ value, onChange, disabled = false }) => {
  const boxRef = useRef(null);
  const popupRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [tempHour, setTempHour] = useState("09");
  const [tempMinute, setTempMinute] = useState("00");
  const [tempAmpm, setTempAmpm] = useState("AM");
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Open dropdown
  const openDropdown = () => {
    if (disabled) return;

    if (value) {
      const parts = value.split(" ");
      if (parts.length === 2) {
        const [h, m] = parts[0].split(":");
        setTempHour(h || "09");
        setTempMinute(m || "00");
        setTempAmpm(parts[1] || "AM");
      }
    }

    const rect = boxRef.current.getBoundingClientRect();
    const popupWidth = 240; // width of the popup in px
    const popupHeight = 120; // approximate height of popup
    const padding = 10; // minimum padding from viewport

    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY;

    // Adjust right overflow
    if (left + popupWidth + padding > window.scrollX + window.innerWidth) {
      left = window.scrollX + window.innerWidth - popupWidth - padding;
    }

    // Adjust left overflow
    if (left < window.scrollX + padding) {
      left = window.scrollX + padding;
    }

    // Adjust bottom overflow
    if (top + popupHeight + padding > window.scrollY + window.innerHeight) {
      top = rect.top + window.scrollY - popupHeight; // open above
    }

    // Adjust top overflow
    if (top < window.scrollY + padding) {
      top = window.scrollY + padding;
    }

    setPos({ top, left });
    setOpen(true);
  };

  // Close popup on outside click
  useEffect(() => {
    if (disabled) return;
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !boxRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [disabled]);

  const handleOk = () => {
    if (disabled) return;
    onChange && onChange(`${tempHour}:${tempMinute} ${tempAmpm}`);
    setOpen(false);
  };

  return (
    <>
      <div
        ref={boxRef}
        onClick={openDropdown}
        className={`px-3 py-1  rounded-lg min-w-[120px] flex items-center justify-between gap-2
          ${disabled
            ? "border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border border-green-600 bg-white text-green-700 cursor-pointer"
          }`}
      >
        <span>{value || "09:00 AM"}</span>
        <span
          className={`text-xs transition-transform ${
            open ? "rotate-180" : ""
          } ${disabled ? "text-gray-400" : "text-green-600"}`}
        >
          ▼
        </span>
      </div>

      {open && !disabled && (
        <div
          ref={popupRef}
          className="absolute bg-white border mt-10  border-green-500 rounded-lg shadow-xl p-3"
          style={{
            // top: pos.top,
            // left: pos.left,
            // right: "0",
            width: "240px",
            zIndex: 2000,
          }}
        >
          <div className="flex gap-2 mb-3 justify-between">
            <select
              value={tempHour}
              onChange={(e) => setTempHour(e.target.value)}
              className="border border-green-400 rounded px-2 py-1"
            >
              {Array.from({ length: 12 }, (_, i) =>
                <option key={i+1} value={String(i + 1).padStart(2, "0")}>{String(i + 1).padStart(2, "0")}</option>
              )}
            </select>
            <select
              value={tempMinute}
              onChange={(e) => setTempMinute(e.target.value)}
              className="border border-green-400 rounded px-2 py-1"
            >
              {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={tempAmpm}
              onChange={(e) => setTempAmpm(e.target.value)}
              className="border border-green-400 rounded px-2 py-1"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <button
            onClick={handleOk}
            className="w-full bg-green-600 text-white py-1 rounded-md hover:bg-green-700"
          >
            OK
          </button>
        </div>
      )}
    </>
  );
};

export default TimeDropdown;



