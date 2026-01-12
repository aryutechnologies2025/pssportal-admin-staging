import React from 'react'
import Sidebar from '../components/Sidebar';

import ContractCandidates_Mainbar from '../components/contractCandidates components/ContractCandidates_Mainbar';

const ContractCandidates = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <ContractCandidates_Mainbar/>
    </div>
  );
}

export default ContractCandidates
