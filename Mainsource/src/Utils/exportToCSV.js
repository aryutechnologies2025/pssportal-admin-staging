 const exportToCSV = (data, fileName = "report") => {
  if (!data || data.length === 0) {
    alert("No data available");
    return;
  }

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(row =>
    Object.values(row).join(",")
  );

  const csvContent = [headers, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
};

export default exportToCSV;