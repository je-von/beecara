import Link from 'next/link'
import { useRouter } from 'next/router'
import { IoMdArrowBack } from 'react-icons/io'

interface Props {
  href?: string
}

const ArrowBack = ({ href }: Props) => {
  const router = useRouter()

  const arrow = <IoMdArrowBack className="mr-2 mt-[0.4rem] text-xl cursor-pointer stroke-black opacity-80 hover:opacity-100 transition-opacity" strokeWidth={40} />
  return (
    <>
      {href ? (
        <Link href={href} passHref>
          {arrow}
        </Link>
      ) : (
        <div onClick={() => router.back()}>{arrow}</div>
      )}
    </>
  )
}

export { ArrowBack }
