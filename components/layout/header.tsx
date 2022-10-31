import { signOut, useAuth } from '../../lib/authContext'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { RiArrowDropDownFill } from 'react-icons/ri'

export default function Header(props: any) {
  const [showDropdown, setShowDropdown] = useState(false)

  const { user, loading } = useAuth()

  return (
    <div className="flex h-full flex-row lg:px-40 px-8 md:px-16">
      <div className="w-full mx-auto flex flex-wrap items-end justify-between mt-0 pb-5">
        <div className="pl-4 flex items-center">
          <Link passHref href="/">
            <div className="h-100 flex items-end gap-3 cursor-pointer">
              <Image src={'/assets/ribbon.png'} className="" alt="logo" width={25} height={68} layout={'fixed'} />{' '}
              <Image src={'/assets/logo_binus.png'} className="" alt="logo" width={81.25} height={50} layout={'fixed'} />{' '}
              {/* <span className="text-2xl text-neutral-300 font-light">|</span> <b className="font-medium text-xl">BEECARA</b> */}
            </div>
          </Link>
        </div>

        <div className="flex-grow flex items-center w-auto  bg-white bg-transparent text-black z-20">
          <ul className="list-reset flex justify-end flex-1 items-center py-2">
            {user ? (
              <li className="text-gray-600 transition-colors duration-500 hover:text-primary-50 cursor-pointer">
                <div className="relative" onMouseOver={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                  <button type="button" className="flex items-center gap-1">
                    Hi, <b>{user?.claims.name}</b> ! <RiArrowDropDownFill />
                  </button>

                  <div className={`${!showDropdown && 'hidden'} absolute right-0 z-10 w-40 origin-top-right rounded-md border border-gray-100 bg-white shadow-lg`}>
                    <div className="p-2">
                      <div className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">Profile</div>
                      <div
                        onClick={() => {
                          setShowDropdown(false)
                          signOut()
                        }}
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      >
                        Sign Out
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  )
}
