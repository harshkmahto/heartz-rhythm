import React, { useEffect } from 'react'
import RoundedText from '../../components/ShowCaseSection/RoundedText'
import { ArrowLeft, ArrowRight, PencilIcon, } from 'lucide-react'

const AllUsers = () => {

    useEffect(() => {
      const getData = async()=> {
        

        
      }
    
      getData()
    }, [])
    


  return (
   <div className='min-h-screen  '>
      <div className='text-center'>
        <p className='text-2xl font-black'>USERS</p>
      
      </div>
      <div>
        <RoundedText text="All Users"/>
        <p className='ml-2 mt-2 font-light'>Manage All Users</p>

        <p className='border-b w-full mt-5 mb-5'></p>

        {/* content */}
        <div>
          {/* filter Panel */}
          <div>
            <div className='border w-full max-h-80 h-60'>
              <span className='flex justify-center m-2'><RoundedText text="Filter Panel"/> </span>
            <div className='flex gap-6'>
              <input type="search" placeholder='Search User...'
               className=' relative border p-4 m-4 rounded-xl w-72'/>
               <div>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="ewview">Review</option>
               </div>
               <div>
                <option value="">Customer</option>
                <option value="">Admin</option>
                <option value="">Seller</option>
               </div>
            </div>
            </div>
          </div>

          {/* table */}
          <div>
            {/* List */}
           <span className='flex justify-center items-center mt-4'> <RoundedText text="Users List"/> </span>
            <div className='sticky top-10 z-10 flex w-full justify-between mt-4 '>
              <div>PROFILE</div>
              <div>NAME</div>
              <div>EMAIL</div>
              <div>ROLE</div>
              <div>STATUS</div>
              <div>VERIFIED</div>
              <div>ACTIONS</div>
            </div>
            <div className=' sticky top-10 z-10 flex items-center justify-between '>
              <span className='bg-white/10 shadow-md p-2 rounded-full cursor-pointer active:scale-95 hover:bg-red-300 text-black dark:text-white '><ArrowLeft/> </span>
              <span className='bg-white/10 shadow-md p-2 rounded-full cursor-pointer active:scale-95 hover:bg-red-300 text-black dark:text-white '><ArrowRight/></span>
            </div>


            <div className='flex w-full justify-between mt-4'>
              <div>PROFILE</div>
              <div>NAME</div>
              <div>EMAIL</div>
              <div>ROLE</div>
              <div>STATUS</div>
              <div>VERIFIED</div>
              <div className='bg-red-300 p-2 rounded-full hover:bg-red-600 hover:scale-95 cursor-pointer active:scale-105 '> <PencilIcon className='text-sm'/> </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default AllUsers