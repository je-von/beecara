import Link from 'next/link'
import * as React from 'react'
import { RiAlarmWarningFill } from 'react-icons/ri'

export default function NotFoundPage() {
  return (
    <div className="h-[90vh] overflow-x-hidden flex flex-col gap-3 items-center justify-center text-center text-black">
      <RiAlarmWarningFill size={60} className="drop-shadow-glow animate-flicker text-red-500" />
      <h1 className="mt-8 text-4xl md:text-6xl">Page Not Found</h1>
      <Link passHref href="/">
        <div className="mt-4 md:text-lg hover:underline cursor-pointer">Back to Home</div>
      </Link>
    </div>
  )
}
