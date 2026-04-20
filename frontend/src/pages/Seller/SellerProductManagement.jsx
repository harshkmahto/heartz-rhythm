import React, { useState } from 'react'
import SellingOnOff from '../../components/Seller/Products/sellingOnOff'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const SellerProductManagement = () => {
  const [activeCard, setActiveCard] = useState([])
  const navigate = useNavigate()


  const handleCreate = () => {
    navigate('/seller/product/create')
  }

  const cards = [
    {total:5},
    {active:2},
    {draft:4},
    {schedule:2},
    {},
    {},
    {},
    {},
    {},
    {},
  ];



  const cardHandle = (index) => {
   
    setActiveCard(index)
  }



  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-100 dark:from-green-950 dark:via-black dark:to-emerald-950 text-black dark:text-white p-4'>
      <div>
        <h1 className='uppercase text-center font-bold text-4xl'>Seller Product Management</h1>
        <p className='text-center mt-4 text-sm'>Manage and Create Product at here </p>
        <p className='border-b mt-6 border-emerald-500'></p>
      </div>


   <div className='flex flex-col md:flex-row items-center justify-center max-w-4xl gap-10 mx-auto mt-10'>

  <div className='w-full md:w-120 h-55 rounded-2xl 
    bg-gradient-to-br from-emerald-200 via-green-100 to-emerald-300 
    dark:from-emerald-400 dark:via-emerald-600 dark:to-emerald-950
    backdrop-blur-md shadow-xl hover:shadow-emerald-500/30 hover:scale-105 
    transition-all duration-300'>
      <div className='flex items-center justify-center h-48  hover:scale-105  transition-all duration-300 cursor-pointer'>
        <div 
        onClick={handleCreate}
        className=' bg-black/10 dark:bg-white/10 p-3 w-72  rounded-2xl  text-center '>
        <span className='uppercase flex items-center gap-2 text-2xl font-bold text-green-600 dark:text-white'><Plus className='hover:scale-105 hover:rotate-90 transition-all duration-300' /> Create Product </span>
        </div>
      </div>
  </div>

  <div className='w-full md:w-86 h-55 rounded-2xl 
    bg-gradient-to-br from-blue-400 via-indigo-300 to-purple-500 
    dark:from-blue-900 dark:via-indigo-800 dark:to-purple-900
    backdrop-blur-md shadow-xl hover:shadow-indigo-500/30 hover:scale-105 
    transition-all duration-300'>
      <div className='flex flex-col items-center justify-center h-48 mt-4'>
        <SellingOnOff />
        <span className='text-md mt-4 bg-amber-300 p-2 rounded-xl text-center '>Selling SWitch On/Off</span>
      </div>
      
  </div>

   </div>

    <div className='flex flex-col md:flex-row items-center gap-10 mx-auto mt-10'>
  {cards.map((item, index) => (
    <div 
      key={index}
      onClick={() => {cardHandle(index)}}
      className={`bg-green-600 w-42 h-30 rounded-xl cursor-pointer
                  ${activeCard === index ? "w-[260px]" : "w-[160px]"} `}
    >
      <div>

      </div>
    </div>
  ))}
  </div>






    </div>
  )
}

export default SellerProductManagement