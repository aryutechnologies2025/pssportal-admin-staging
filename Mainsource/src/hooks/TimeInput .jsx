import React, { useState, useEffect } from "react";

/**
 * RailwayTimeInput
 * Props:
 *  - value: railway time string from backend "HH:MM:SS" (UTC)
 *  - onChange: function to send raw railway time to backend
 *  - className: optional CSS classes
 */
const RailwayTimeInput = ({ value, onChange, className }) => {
  const [displayTime, setDisplayTime] = useState("");

  // Convert railway time to local display (IST 12-hour format)
  const toDisplayTime = (railwayTime) => {
    if (!railwayTime) return "";
    const date = new Date(`1970-01-01T${railwayTime}Z`); // treat as UTC
    const offset = 5.5 * 60; // IST offset
    const istDate = new Date(date.getTime() + offset * 60 * 1000);
    let hours = istDate.getHours();
    const minutes = istDate.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Set displayTime when value changes
  useEffect(() => {
    setDisplayTime(toDisplayTime(value));
  }, [value]);

  const handleChange = (e) => {
    const newDisplay = e.target.value;
    setDisplayTime(newDisplay);

    // Calculate the selected time in UTC (railway time)
    const [timePart, ampm] = newDisplay.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;

    const date = new Date(Date.UTC(1970, 0, 1, hours, minutes));
    const offset = 5.5 * 60;
    const railwayDate = new Date(date.getTime() - offset * 60 * 1000);
    const hh = railwayDate.getUTCHours().toString().padStart(2, "0");
    const mm = railwayDate.getUTCMinutes().toString().padStart(2, "0");

    onChange(`${hh}:${mm}:00`); // send railway time to backend
  };

  return (
    <input
      type="text"
      value={displayTime}
      onChange={handleChange}
      placeholder="HH:MM AM/PM"
      className={className || "border rounded px-2 text-sm"}
    />
  );
};

export default RailwayTimeInput;
