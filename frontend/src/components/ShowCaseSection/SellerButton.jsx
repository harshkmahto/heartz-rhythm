import React from 'react'

const SellerButton = ({ text, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="
        uppercase flex items-center gap-2
        bg-gradient-to-r from-emerald-500 to-green-600
        hover:from-emerald-600 hover:to-green-600
        text-white px-6 py-3 rounded-xl
        transition-all duration-300
        active:scale-95
        cursor-pointer
        
        shadow-md
        hover:shadow-[0_0_25px_rgba(16,185,129,0.7)]
        hover:scale-105
      "
    >
      {text}
    </button>
  )
}

export default SellerButton