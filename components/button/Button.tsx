import { MouseEventHandler, ReactNode } from 'react'

interface Props {
  onClick?: MouseEventHandler<HTMLButtonElement>
  color?: 'sky' | 'red' | 'white'
  children: ReactNode
  className?: string
  isSubmitButton?: boolean
}

const Button = ({ color, onClick, children, className, isSubmitButton }: Props) => {
  return (
    <button
      type={isSubmitButton ? 'submit' : undefined}
      className={` uppercase flex items-center justify-center ${
        color === 'red' ? 'bg-red-400 hover:ring-red-400 hover:text-red-400' : color === 'white' ? 'bg-white hover:ring-black border' : 'bg-sky-400 hover:ring-blue-400 hover:text-blue-400'
      } ${color === 'white' ? 'text-black' : 'text-white'} font-bold rounded py-2 px-6 shadow-lg focus:outline-none focus:shadow-outline hover:bg-white hover:ring transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
