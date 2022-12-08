const UnderlineButton = (props: any) => {
  return (
    <button className={'group text-black transition-all duration-300 ease-in-out'}>
      <span
        {...props}
        className={
          props.className +
          ' bg-left-bottom bg-gradient-to-r from-sky-400 to-sky-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out pb-1'
        }
      >
        {props.children}
      </span>
    </button>
  )
}

export default UnderlineButton
