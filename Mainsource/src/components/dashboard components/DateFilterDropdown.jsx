import { Dropdown } from "primereact/dropdown";

const options = [
  { label: "Today", value: "Today" },
  { label: "Yesterday", value: "Yesterday" },
//   { label: "Realtime", value: "Realtime" },
  { label: "Last 7 Days", value: "Last 7 Days" },
  { label: "Last 30 Days", value: "Last 30 Days" },
  { label: "Last 90 Days", value: "Last 90 Days" },
  { label: "This Month", value: "This Month" },
  { label: "Last Month", value: "Last Month" },
  { label: "Custom Range", value: "Custom Range" },
];

export default function DateFilterDropdown({ value, onChange }) {
  return (
    <Dropdown
      value={value}
      options={options}
      onChange={(e) => onChange(e.value)}
      placeholder="Select Date"
      className="w-40 text-sm rounded-lg border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
    />
  );
}
