import React, { useState, useRef, useEffect } from 'react'

const Button = ({ 
  text, 
  variant = "primary", 
  size = "md",
  onClick,
  disabled = false,
  className = "",
  icon: Icon,
  iconPosition = "left",
  fullWidth = false
}) => {
  
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedChars, setAnimatedChars] = useState({})
  const animationTimeout = useRef(null)
  
  // Size variants
  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg"
  }
  
  // Color variants
  const variants = {
    primary: {
      base: "bg-[#FF3C38] text-white",
      dark: "dark:bg-transparent dark:border dark:border-[#FF3C38] dark:text-[#FF3C38] dark:hover:bg-[#FF3C38] dark:hover:text-white",
      glow: "dark:shadow-[0_0_10px_#FF3C38] dark:hover:shadow-[0_0_20px_#FF3C38]"
    },
    secondary: {
      base: "bg-gray-600 text-white",
      dark: "dark:bg-transparent dark:border dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-400 dark:hover:text-white",
      glow: "dark:shadow-[0_0_10px_#6B7280] dark:hover:shadow-[0_0_20px_#6B7280]"
    },
    outline: {
      base: "bg-transparent border-2 border-[#FF3C38] text-[#FF3C38] hover:bg-[#FF3C38] hover:text-white",
      dark: "dark:border-[#FF3C38] dark:text-[#FF3C38] dark:hover:bg-[#FF3C38] dark:hover:text-white",
      glow: "dark:shadow-[0_0_10px_#FF3C38] dark:hover:shadow-[0_0_20px_#FF3C38]"
    }
  }
  
  const currentVariant = variants[variant] || variants.primary
  
  const handleMouseEnter = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    
    // Animate each character with a delay
    const chars = text.split('')
    chars.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedChars(prev => ({ ...prev, [index]: true }))
        
        // Reset after animation
        setTimeout(() => {
          setAnimatedChars(prev => ({ ...prev, [index]: false }))
        }, 300)
      }, index * 50)
    })
    
    // Reset animation state
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current)
    }
    animationTimeout.current = setTimeout(() => {
      setIsAnimating(false)
    }, chars.length * 50 + 300)
  }
  
  const handleMouseLeave = () => {
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current)
    }
    setIsAnimating(false)
    setAnimatedChars({})
  }
  
  // Split text into characters
  const characters = text.split('')
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden rounded-full font-medium tracking-wide
        transition-all duration-300 ease-in-out
        shadow-[0_4px_20px_rgba(0,0,0,0.08)]
        
        /* Size */
        ${sizes[size]}
        
        /* Width */
        ${fullWidth ? 'w-full' : ''}
        
        /* Base styles */
        ${currentVariant.base}
        
        /* Dark mode styles */
        ${currentVariant.dark}
        
        /* Neon glow effect */
        ${currentVariant.glow}
        
        /* Hover effects */
        hover:scale-105 hover:shadow-lg
        active:scale-95
        
        /* Disabled state */
        ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : 'cursor-pointer'}
        
        /* Custom classes */
        ${className}
      `}
    >
      {/* Glow pulse effect */}
      <span className={`
        absolute inset-0 rounded-full opacity-0 pointer-events-none
        bg-[#FF3C38] blur-xl transition-opacity duration-300
        ${!disabled && 'hover:opacity-30 dark:opacity-30 animate-pulse'}
      `} />
      
      {/* Button content with slot machine scroll effect */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {Icon && iconPosition === "left" && <Icon className="w-5 h-5 flex-shrink-0" />}
        
        {/* Individual character animation */}
        <span className="inline-flex gap-0">
          {characters.map((char, index) => (
            <span
              key={index}
              className={`
                relative inline-block transition-all duration-300 ease-out
                ${animatedChars[index] 
                  ? 'animate-[scroll_0.3s_ease-in-out]' 
                  : ''
                }
              `}
              style={{
                animation: animatedChars[index] 
                  ? 'scrollCharacter 0.3s ease-in-out' 
                  : 'none'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
        
        {Icon && iconPosition === "right" && <Icon className="w-5 h-5 flex-shrink-0" />}
      </span>
      
      {/* Add the keyframes to your global CSS or use inline style */}
      <style jsx>{`
        @keyframes scrollCharacter {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          30% {
            transform: translateY(-100%);
            opacity: 0;
          }
          70% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </button>
  )
}

export default Button