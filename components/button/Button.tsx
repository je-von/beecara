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
      className={`${className} uppercase mt-3 flex items-center justify-center ${color === 'red' ? 'bg-red-400' : color === 'white' ? 'bg-white' : 'bg-sky-400'} ${
        color === 'white' ? 'text-black' : 'text-white'
      } font-bold rounded py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
