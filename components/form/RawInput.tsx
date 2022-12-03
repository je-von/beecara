const RawInput = (props: any) => {
  const className =
    props.className + ` resize-none appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white `
  if (props.type === 'textarea') {
    return <textarea {...props} className={'h-32 ' + className}></textarea>
  } else {
    return <input {...props} className={className} />
  }
}

export default RawInput
