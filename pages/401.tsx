import { GetServerSideProps } from 'next'
import Link from 'next/link'
import * as React from 'react'
import { RiAlarmWarningFill } from 'react-icons/ri'
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.statusCode = 401
  return { props: {} }
}
export default function NotAuthorizedPage() {
  return (
    <div className="h-[90vh] overflow-x-hidden flex flex-col gap-3 items-center justify-center text-center text-black">
      <RiAlarmWarningFill size={60} className="drop-shadow-glow animate-flicker text-red-500" />
      <h1 className="mt-8 text-4xl md:text-6xl">Unauthorized</h1>
      <Link passHref href="/">
        <div className="mt-4 md:text-lg hover:underline cursor-pointer">Back to Home</div>
      </Link>
    </div>
  )
}
