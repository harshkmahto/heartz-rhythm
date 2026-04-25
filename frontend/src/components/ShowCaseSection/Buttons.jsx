import React from 'react'

const Button = ({
  text,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  size = "lg",
  fullWidth = false,
  icon: Icon,
  iconPosition = "right",
  fromColor = "red-600",
  toColor = "red-800",
  textColor = "white",
  darkText = "white",
  arrowIcon = "→",
  variant = "gradient",
  shadow = true,
  shadowFrom = "red-500",
  shadowTo = "red-700",
  shadowIntensity = "0.6",
  shadowSize = "40px",
  hoverColor,
}) => {
  
  const sizes = {
    sm: "py-3 px-4 text-sm",
    md: "py-4 px-6 text-base",
    lg: "py-4 px-7 text-lg",
    xl: "py-4 px-8 text-xl md:text-xl",
    xxl: "py-4 px-10 text-xl md:text-xl"
  }
  
  const sizeClass = sizes[size] || sizes.lg
  
  const getShadowRGB = (color) => {
    const colors = {
      'red-500': '239,68,68', 'red-600': '220,38,38', 'red-700': '185,28,28',
      'orange-500': '249,115,22', 'purple-500': '168,85,247', 'green-500': '34,197,94',
      'blue-500': '59,130,246', 'rose-500': '244,63,94',
    }
    return colors[color] || colors['red-600']
  }
  
  const shadowFromRGB = getShadowRGB(shadowFrom)
  const shadowToRGB = getShadowRGB(shadowTo)
  
  // CSS variables for shadow
  const cssVars = {
    '--shadow-from': shadowFromRGB,
    '--shadow-to': shadowToRGB,
    '--shadow-intensity': shadowIntensity,
    '--shadow-size': shadowSize,
  } 
  
  const ButtonContent = () => (
    <div className="relative overflow-hidden w-max cursor-pointer mx-auto">
      <div className="transition-transform duration-300 ease-out group-hover:-translate-y-full">
        <span>{text}</span>
        {iconPosition === "right" && Icon && (
          <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
            <Icon className="w-4 h-4 inline" />
          </span>
        )}
      </div>
      <div className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
        <span>{text}</span>
        {iconPosition === "right" && (
          <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
            {Icon ? <Icon className="w-4 h-4 inline" /> : arrowIcon}
          </span>
        )}
      </div>
    </div>
  )
  
  const variantClasses = variant === "gradient" 
    ? `bg-gradient-to-r from-${fromColor} to-${toColor}`
    : `bg-transparent border-2 border-${fromColor} hover:bg-${fromColor}`
  
  const baseClasses = `
    uppercase
    text-${textColor}
    dark:text-${darkText}
    hover:bg-${hoverColor}
    text-center group
    ${sizeClass}
    font-bold
    rounded-2xl
    outline-none
    transition-all duration-300
    ${variantClasses}
    ${variant === "gradient" ? "hover:bg-gradient-to-l" : ""}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer hover:scale-105'}
    ${shadow ? 'hover:shadow-[0_0_var(--shadow-size)_8px_rgba(var(--shadow-from),var(--shadow-intensity))]' : ''}
    ${className}
  `
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={baseClasses}
      style={cssVars}
    >
      <ButtonContent />
    </button>
  )
}

export default Button