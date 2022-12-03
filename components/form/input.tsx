import { HTMLInputTypeAttribute, ReactNode } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'
import RawInput from './RawInput'

interface Props {
  name: string
  validation?: RegisterOptions
  inputType: HTMLInputTypeAttribute | 'textarea'
  placeholder?: string
  title: ReactNode
  isDisabled?: boolean
  value?: string
  width: 'full' | '1/2' | '1/3'
  additionalAppend?: ReactNode
}
const Input = ({ name, validation, inputType, placeholder, title, width, isDisabled, value }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className={`w-full md:w-${width} px-3`}>
      <label className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{title}</label>
      <div className="flex">
        <RawInput
          className={`resize-none appearance-none block w-full bg-gray-200 text-gray-700 border ${
            errors[name] ? 'border-red-500' : ''
          } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white `}
          {...register(name, validation)}
          type={inputType}
          placeholder={placeholder}
          disabled={isDisabled}
          value={value}
        />
      </div>
      {errors[name] && <p className="text-red-500 text-xs italic">{errors[name]?.message || `${title} is invalid`}</p>}
    </div>
  )
}

export default Input
