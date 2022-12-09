import { HTMLInputTypeAttribute, ReactNode } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'
interface Props {
  name: string
  validation?: RegisterOptions
  inputType: HTMLInputTypeAttribute | 'textarea'
  placeholder?: string
  titleLabel: ReactNode
  title?: string
  isDisabled?: boolean
  value?: string
  width: 'full' | '1/2' | '1/3'
  additionalAppend?: ReactNode
  additionalPrepend?: ReactNode
}

const Input = ({ name, validation, inputType, placeholder, titleLabel, title, width, isDisabled, value, additionalAppend, additionalPrepend }: Props) => {
  const { register, getFieldState, formState } = useFormContext()
  const RawInput = (props: any) => {
    if (props.type === 'textarea') {
      return <textarea {...props} {...register(name, validation)} className={'h-32 ' + props.className}></textarea>
    } else {
      return <input {...register(name, validation)} {...props} min={validation?.min} />
    }
  }

  return (
    <div className={`${width === 'full' ? 'md:w-full' : width === '1/2' ? 'md:w-1/2' : 'md:w-1/3'} w-full px-3 mb-5 flex flex-col gap-2 `}>
      <label className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold w-full">
        {titleLabel} {validation?.required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex ">
        {additionalPrepend}
        <RawInput
          className={`resize-none appearance-none block w-full ${isDisabled ? 'bg-gray-200' : 'bg-white'} text-gray-700 border ${
            getFieldState(name, formState).error ? 'border-red-500' : 'border-gray-300'
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
      {getFieldState(name, formState).error && (
        <p className="text-red-500 text-xs italic">{getFieldState(name, formState).error?.message || `${title ? title : titleLabel} is invalid`}</p>
      )}
    </div>
  )
}

export default Input
