import { useCallback, useContext } from "react";
// import { SettingsContext } from "../App";

const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
const DEFAULT_TIME_FORMAT = "HH:mm:ss";

export const useDateUtils = () => {
//   const { dynamicDateFormat } = useContext(SettingsContext);


const dateFormatAdmin = JSON.parse(localStorage.getItem("pss_dateformat") || "null");

    const dynamicDateFormat = dateFormatAdmin?.setting?.date_format;
console.log("dateFormatAdmin",dynamicDateFormat);



  const formatDateTime = useCallback(
    (
      inputDate,
      { includeTime = false, includeSeconds = false, timeOnly = false } = {}
    ) => {
      if (!inputDate) return "";

      
      const normalizeFormat = (format = "") =>
        format.replace(/YYYY/g, "yyyy").replace(/DD/g, "dd");

      const format =
        typeof dynamicDateFormat === "string"
          ? {
              dateFormat: normalizeFormat(
                dynamicDateFormat || DEFAULT_DATE_FORMAT
              ),
              timeFormat: DEFAULT_TIME_FORMAT,
            }
          : {
              dateFormat: normalizeFormat(
                dynamicDateFormat?.dateFormat || DEFAULT_DATE_FORMAT
              ),
              timeFormat:
                dynamicDateFormat?.timeFormat || DEFAULT_TIME_FORMAT,
            };

      /* ---------------- DATE PARSING ---------------- */
      let date;

      // Time-only string (e.g. "10:39" or "10:39:20")
      if (
        typeof inputDate === "string" &&
        /^\d{1,2}:\d{2}(:\d{2})?$/.test(inputDate)
      ) {
        const [h, m, s = 0] = inputDate.split(":").map(Number);
        date = new Date();
        date.setHours(h, m, s, 0);
      } else {
        date = new Date(inputDate);
      }

      if (isNaN(date.getTime())) {
        console.warn("Invalid date input:", inputDate);
        return "";
      }

      /* ---------------- FORMAT ENGINE ---------------- */
      const formatPattern = (pattern, d) => {
        const hours = d.getHours();
        const isPM = hours >= 12;

        const map = {
          yyyy: d.getFullYear(),
          yy: String(d.getFullYear()).slice(-2),
          MM: String(d.getMonth() + 1).padStart(2, "0"),
          M: d.getMonth() + 1,
          dd: String(d.getDate()).padStart(2, "0"),
          d: d.getDate(),
          HH: String(hours).padStart(2, "0"),
          H: hours,
          hh: String(hours % 12 || 12).padStart(2, "0"),
          h: hours % 12 || 12,
          mm: String(d.getMinutes()).padStart(2, "0"),
          m: d.getMinutes(),
          ss: String(d.getSeconds()).padStart(2, "0"),
          s: d.getSeconds(),
          a: isPM ? "PM" : "AM",
        };

        return pattern.replace(
          /(yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|a)/g,
          (token) => map[token]
        );
      };

      /* ---------------- TIME ONLY ---------------- */
      if (timeOnly) {
        let timePattern = format.timeFormat;
        if (!includeSeconds) {
          timePattern = timePattern.replace(/:ss?/g, "");
        }
        return formatPattern(timePattern, date);
      }

      /* ---------------- DATE + TIME ---------------- */
      if (includeTime) {
        let timePattern = format.timeFormat;
        if (!includeSeconds) {
          timePattern = timePattern.replace(/:ss?/g, "");
        }

        return `${formatPattern(
          format.dateFormat,
          date
        )} ${formatPattern(timePattern, date)}`;
      }

      /* ---------------- DATE ONLY ---------------- */
      return formatPattern(format.dateFormat, date);
    },
    [dynamicDateFormat]
  );

  return formatDateTime;
};
