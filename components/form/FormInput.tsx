import { HTMLInputTypeAttribute, ReactNode } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'

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
  additionalPrepend?: ReactNode
}

const Input = ({ name, validation, inputType, placeholder, title, width, isDisabled, value, additionalAppend, additionalPrepend }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const RawInput = (props: any) => {
    if (props.type === 'textarea') {
      return <textarea {...props} {...register(name, validation)} className={'h-32 ' + props.className}></textarea>
    } else {
      return <input {...register(name, validation)} {...props} />
    }
  }
  return (
    <div className={`${width === 'full' ? 'md:w-full' : width === '1/2' ? 'md:w-1/2' : 'md:w-1/3'} w-full px-3`}>
      <label className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 w-full">
        {title} {validation?.required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex mb-3">
        {additionalPrepend}
        <RawInput
          className={`resize-none appearance-none block w-full ${isDisabled ? 'bg-gray-200' : 'bg-white'} text-gray-700 border ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          } rounded py-3 px-4 leading-tight focus:outline-none  focus:ring-sky-400 focus:bg-white ${additionalAppend ? 'rounded-r-none' : ''} ${
            additionalPrepend ? 'rounded-l-none' : ''
          } ${isDisabled ? 'cursor-not-allowed' : ''}`}
          type={inputType}
          placeholder={placeholder}
          disabled={isDisabled}
          value={value}
        />
        {additionalAppend}
      </div>
      {errors[name] && <p className="text-red-500 text-xs italic">{errors[name]?.message || `${title} is invalid`}</p>}
    </div>
  )
}

export default Input
