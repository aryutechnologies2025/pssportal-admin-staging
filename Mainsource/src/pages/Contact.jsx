import React from "react";
import ContactCandidate from "../components/contact component/ContactCandidate";
import Sidebar from "../components/Sidebar";

const Contact = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <ContactCandidate />
    </div>
  );
};

export default Contact;