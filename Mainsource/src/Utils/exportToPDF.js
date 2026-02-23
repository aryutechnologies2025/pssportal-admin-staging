import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

 const exportToPDF = (data, fileName = "Report", title = "") => {
  if (!data || data.length === 0) {
    alert("No data available to download");
    return;
  }

  const doc = new jsPDF();

  doc.text(title, 14, 15);

  const tableColumn = Object.keys(data[0]);
  const tableRows = data.map((row) => Object.values(row));

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save(`${fileName}.pdf`);
};

export default exportToPDF