'use client'

export default function Button({ children, onClick, variant = 'primary', ...props }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
