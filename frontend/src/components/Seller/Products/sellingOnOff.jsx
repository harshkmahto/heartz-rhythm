import React, { useState } from 'react'

const SellingOnOff = () => {
    const [enabled, setEnabled] = useState(false);

    const handleToggle = () => {
    setEnabled(!enabled);
  };


  return (
     <div className="bg-black/10 dark:bg-white/10 p-3 rounded-2xl text-center">
      
      <button
        onClick={handleToggle}
        className={`w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 
          ${enabled ? "bg-emerald-500" : "bg-gray-300"}`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md  transform transition-all duration-300 cursor-pointer 
            ${enabled ? "translate-x-8" : "translate-x-0"}`}
        />
      </button>

    </div>
  )
}

export default SellingOnOff