import { MouseEventHandler, ReactNode } from 'react'

interface Props {
  onClick?: MouseEventHandler<HTMLButtonElement>
  color?: 'sky' | 'red' | 'white'
  children: ReactNode
  className?: string
  isSubmitButton?: boolean
  disabled?: boolean
}

const Button = ({ color, onClick, children, className, isSubmitButton, disabled }: Props) => {
  return (
    <button
      type={isSubmitButton ? 'submit' : undefined}
      className={` uppercase flex items-center justify-center ${
        disabled
          ? 'bg-gray-400'
          : color === 'red'
          ? 'bg-red-400 hover:ring-red-400 hover:text-red-400'
          : color === 'white'
          ? 'bg-white hover:ring-black border'
          : 'bg-sky-400 hover:ring-sky-400 hover:text-sky-400'
      } ${color === 'white' ? 'text-black' : 'text-white'} font-bold rounded py-2 px-6 shadow-md focus:outline-none focus:shadow-outline ${
        !disabled ? 'hover:bg-white hover:ring' : ''
      } transition-all ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
