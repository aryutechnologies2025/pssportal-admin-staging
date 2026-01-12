import React from "react";
import Footer from "../Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Select from "react-select";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import Mobile_Sidebar from "../Mobile_Sidebar";

const Income_History_Mainbar = () => {
  let navigate = useNavigate();

  const [globalFilter, setGlobalFilter] = useState("");

  const data = [
    {
      client_name: "Spotify Subscription",
      transaction_id: "#12548796",
      type: "UPI",
      date: "25 Jan, 10.40 PM",
      amount: "+$2,500",
      receipt: "Download",
    },
  ];

  const columns = [
    { field: "client_name", header: "Client Name" },
    { field: "transaction_id", header: "Transaction Id" },
    { field: "type", header: "Type" },
    { field: "date", header: "Date" },
    { field: "amount", header: "Amount" },
  ];

  // Function to handle download
  const handleDownload = (rowIndex) => {
    const receiptData = data[rowIndex].receipt;
    console.log(`Downloading receipt for row ${rowIndex}: ${receiptData}`);
  };

  // download button style
  const receiptBodyTemplate = (rowData, { rowIndex }) => {
    return (
      <button
        onClick={() => handleDownload(rowIndex)}
        className="border border-blue-500 rounded-full text-blue-500 px-4 text-sm py-1  "
      >
        {rowData.receipt}
      </button>
    );
  };

  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openAddTransactionModal = () => {
    setAddTransactionModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddTransactionModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddTransactionModalOpen(false), 250);
  };

  const options = [
    { value: "UPI", label: "UPI" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
    { value: "DD", label: "DD" },
  ];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: "2px solid #d1d5db", // Gray border
      borderRadius: "0.75rem", // Rounded corners
      boxShadow: state.isFocused ? "none" : base.boxShadow, // Remove the blue border when focused
    }),
  };

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 w-screen min-h-screen px-5 pt-2 md:pt-10">
      <div>

    <Mobile_Sidebar/>


        {/* Breadcrumbs */}
        <div className="flex gap-2  text-sm items-center">
          <p
            onClick={() => navigate("/finance")}
            className=" text-gray-500 cursor-pointer "
          >
            Finance
          </p>
          <p>{">"}</p>
          <p className=" text-blue-500 ">Income History</p>
          <p>{">"}</p>
        </div>

        <div className="flex flex-col gap-5 md:flex-row justify-between mt-8">
          <p className="font-semibold text-xl md:text-2xl">Transaction</p>
          <button
            onClick={openAddTransactionModal}
            className="bg-blue-500 px-3 py-1 w-fit font-medium text-sm text-white rounded-full"
          >
            {" "}
            + Add Transaction
          </button>
        </div>

        <div style={{ width: "auto", margin: "0 auto" }}>
          {/* Global Search Input */}
          <div className="mt-5 flex justify-end">
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="px-2 py-2 rounded-md"
            />
          </div>

          <DataTable
            className="mt-8"
            value={data}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            globalFilter={globalFilter}
            showGridlines
            resizableColumns
          >
            {columns.map((col, index) => (
              <Column
                key={index}
                field={col.field}
                header={col.header}
                style={{
                  minWidth: "150px",
                  wordWrap: "break-word",
                  overflow: "hidden",
                  whiteSpace: "normal",
                }}
              />
            ))}

            <Column
              header="Receipt"
              body={receiptBodyTemplate}
              style={{ minWidth: "150px" }}
            />
          </DataTable>
        </div>

        {addTransactionModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 "
              onClick={closeAddTransactionModal}
            ></div>
            <div
              className={`fixed top-0 right-0 px-5 lg:px-14 py-10 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddTransactionModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="flex flex-wrap  flex-col md:flex-row justify-between">
                <p className="text-xl md:text-3xl font-medium mt-8">Create Transaction</p>
                <div className="flex justify-end gap-5 mt-8">
                  <button
                    onClick={closeAddTransactionModal}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button className="bg-blue-600 text-white px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full">
                    Save
                  </button>
                </div>
              </div>

              <div className="flex  flex-col gap-3 mt-8">
                {/* Client name */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="Client name">
                    CLIENT NAME
                  </label>

                  <input
                    type="text"
                    id="Client name"
                    placeholder="Client name"
                    className="border-2 rounded-xl ps-4 py-2 border-gray-300 outline-none h-10 w-full md:w-96"
                  />
                </div>

                {/* Transaction Id */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label
                    className="font-medium text-sm"
                    htmlFor="Transaction Id"
                  >
                    TRANSACTION ID
                  </label>

                  <input
                    type="text"
                    id="Transaction Id"
                    placeholder="Transaction Id"
                    className="border-2 rounded-xl ps-4 py-2 border-gray-300 outline-none h-10 w-full md:w-96"
                  />
                </div>

                {/* Payment type*/}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="Payment type">
                    PAYMENT TYPE
                  </label>
                  <Select
                    options={options}
                    styles={customStyles}
                    placeholder="Select Payment Method"
                    className="w-full md:w-96 "
                  />
                </div>

                {/* date*/}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="date">
                    DATE
                  </label>

                  <input
                    type="date"
                    id="gst/tax"
                    // placeholder="With/With"
                    className="border-2 pe-5 rounded-xl ps-4 py-2 text-gray-400 border-gray-300 outline-none h-10 w-full md:w-96"
                  />
                </div>

                {/* amount */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <label className="font-medium text-sm" htmlFor="amount">
                    AMOUNT
                  </label>

                  <input
                    type="text"
                    id="amount"
                    placeholder="Amount"
                    className="border-2 rounded-xl ps-4 py-2 border-gray-300 outline-none h-10 w-full md:w-96"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Income_History_Mainbar;
