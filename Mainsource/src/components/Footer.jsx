import React from 'react'
import aryu_logo from "../assets/aryu_logo.svg";


const Footer = () => {
return (
     <footer className='w-full mt-7'>
      <div className="flex flex-col md:flex-row items-center mb-1 md:mb-3 text-center justify-center sm:gap-4 text-sm text-gray-500 w-full ">
       <p className="text-xs sm:text-sm">Copyrights &copy;  {new Date().getFullYear()} </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a target="_blank" href="https://aryutechnologies.com/">
            <p className='text-gray-600 hover:text-green-700 transition-colors text-xs sm:text-sm font-medium'>
              <span>&bull;</span> PSS <span>&bull;</span> <span className='text-gray-500'>Powered by</span> Aryu Technologies</p>
            
          </a>
          <img className="w-5 h-5 sm:w-6 sm:h-6 object-contain" src={aryu_logo} alt="" />
        </div>
      </div> 
     </footer>
  )
}


export default Footer


