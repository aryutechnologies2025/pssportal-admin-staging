import exportToExcel from "../Utils/exportToCSV";
import exportToPDF from "../Utils/exportToPDF";

const ReportDownloadButton = ({ data, fileName, title }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportToExcel(data, fileName)}
        className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
      >
        Excel
      </button>

      <button
        onClick={() => exportToPDF(data, fileName, title)}
        className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
      >
        PDF
      </button>
    </div>
  );
};

export default ReportDownloadButton;