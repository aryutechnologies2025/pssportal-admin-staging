// /**
//  * Formats a date into a readable date & time string.
//  * @param {Date} date - The date to format.
//  * @param {Object} [options] - Optional formatting options.
//  * @param {boolean} [options.includeTime=true] - Whether to include time in the output.
//  * @param {boolean} [options.includeSeconds=false] - Whether to include seconds in the time.
//  * @param {string} [options.locale='en-US'] - The locale to use for formatting.
//  * @returns {string} Formatted date-time string.
//  */

// import { useCallback, useContext } from "react";
// import { SettingsContext } from "../App";

// export const useDateUtils  = () => {
//   const { dynamicDateFormat } = useContext(SettingsContext);

//   const formatDateTime = useCallback((
//     date,
//     { includeTime = false, includeSeconds = false, timeOnly = false } = {}
//   ) => {
//     const format =
//       typeof dynamicDateFormat === "string"
//         ? { dateFormat: dynamicDateFormat, timeFormat: "HH:mm:ss" }
//         : dynamicDateFormat;

//     if (!(date instanceof Date)) {
//       // Handle string time formats like "10:39:20"
//       if (typeof date === "string" && /^\d{1,2}:\d{2}(:\d{2})?$/.test(date)) {
//         const [hours, minutes, seconds] = date.split(":").map(Number);
//         const newDate = new Date();
//         newDate.setHours(hours, minutes, seconds || 0, 0);
//         date = newDate;
//       } else {
//         date = new Date(date);
//       }
//     }

//     // Parse format patterns from config
//     const formatPattern = (pattern, date) => {
//       const hours = date.getHours();
//       const isPM = hours >= 12;

//       const replacements = {
//         yyyy: date.getFullYear(),
//         yy: String(date.getFullYear()).slice(-2),
//         MM: String(date.getMonth() + 1).padStart(2, "0"),
//         M: date.getMonth() + 1,
//         dd: String(date.getDate()).padStart(2, "0"),
//         d: date.getDate(),
//         HH: String(hours).padStart(2, "0"), // 24-hour, leading zero
//         H: hours, // 24-hour, no leading zero
//         hh: String(hours % 12 || 12).padStart(2, "0"), // 12-hour, leading zero
//         h: hours % 12 || 12, // 12-hour, no leading zero
//         mm: String(date.getMinutes()).padStart(2, "0"),
//         m: date.getMinutes(),
//         ss: String(date.getSeconds()).padStart(2, "0"),
//         s: date.getSeconds(),
//         a: isPM ? "PM" : "AM",
//       };

//       return pattern.replace(
//         /(yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|a)/g,
//         (match) => replacements[match] || match
//       );
//     };

//     // Time only output
//     if (timeOnly) {
//       let timePattern = format.timeFormat;
//       if (!includeSeconds) {
//         // More precise replacement - only remove :ss or :s with their preceding colon
//         timePattern = timePattern.replace(/:ss?/g, "");
//         // Remove standalone seconds without colon (less common)
//         timePattern = timePattern.replace(/(^|\s)ss?(\s|$)/g, "$1$2");
//         // Clean up any remaining double colons or trailing separators
//         timePattern = timePattern
//           .replace(/::/g, ":")
//           .replace(/(\s|^):|:(\s|$)/g, "$1$2");
//       }
//       return formatPattern(timePattern, date);
//     }

//     if (includeTime) {
//       // Use dateFormat and timeFormat from config
//       const dateStr = formatPattern(format.dateFormat, date);

//       // Handle time format - remove seconds if includeSeconds is false
//       let timePattern = format.timeFormat;
//       if (!includeSeconds) {
//         timePattern = timePattern.replace(/[:\\/]?ss?/g, "");
//         // Clean up any remaining double colons
//         timePattern = timePattern.replace(/::/g, ":").replace(/:$/, "");
//       }

//       const timeStr = formatPattern(timePattern, date);
//       return `${dateStr} ${timeStr}`;
//     } else {
//       // Date only
//       return formatPattern(format.dateFormat, date);
//     }
//   }, [dynamicDateFormat] );

//   return formatDateTime;
// };
