import React from 'react'

const RoundedText = ({ text }) => {
  return (
    <h1 className="relative w-fit px-4 py-1 uppercase mx-auto border border-red-500/50  md:text-2xl text-xl font-bold  font-machina  leading-none pt-1.5 inline-block text-black dark:text-white">
      {text}
      
      {/* Top Left Dot */}
      <span className="absolute w-[3px] h-[3px] bg-red-500/60 z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      
      {/* Top Right Dot */}
      <span className="absolute w-[3px] h-[3px] bg-red-500/60 z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full" />
      
      {/* Bottom Left Dot */}
      <span className="absolute w-[3px] h-[3px] bg-red-500/60 z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2 rounded-full" />
      
      {/* Bottom Right Dot */}
      <span className="absolute w-[3px] h-[3px] bg-red-500/60 z-10 bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full" />
    </h1>
  )
}

export default RoundedText