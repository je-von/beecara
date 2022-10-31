import { signOut, useAuth } from '../../lib/authContext'
import Image from 'next/image'
import Link from 'next/link'

export default function Header(props: any) {
  const { user, loading } = useAuth()

  return (
    <div className="flex h-full flex-row px-40">
      <div className="w-full mx-auto flex flex-wrap items-center justify-between mt-0 ">
        <div className="pl-4 flex items-center">
          <Link passHref href="/">
            <div className="h-100 flex items-center gap-3 cursor-pointer">
              <Image src={'/assets/ribbon.png'} className="" alt="logo" width={35} height={80} layout={'fixed'} />{' '}
              <Image src={'/assets/logo_binus.png'} className="" alt="logo" width={81.25} height={50} layout={'fixed'} />{' '}
              {/* <span className="text-2xl text-neutral-300 font-light">|</span> <b className="font-medium text-xl">BEECARA</b> */}
            </div>
          </Link>
        </div>

        <div className="flex-grow flex items-center w-auto  bg-white bg-transparent text-black z-20">
          <ul className="list-reset flex justify-end flex-1 items-center py-2">
            {!user && !loading ? (
              <>
                {/* <li className="mr-3">
                  <Link href="/signup">
                    <a className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"> Signup</a>
                  </Link>
                </li>

                <li className="mr-3">
                  <Link href="/">
                    <a className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"> Signin</a>
                  </Link>
                </li> */}
              </>
            ) : null}
            {user ? (
              <>
                {/* <li className="mr-3">
                  <Link href="/privatessr">
                    <a className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"> PrivateSSR</a>
                  </Link>
                </li>

                <li className="mr-3">
                  <Link href="/private">
                    <a className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"> Private</a>
                  </Link>
                </li> */}

                <li>
                  <p>
                    Hi <b>{user?.claims.name}</b> !
                  </p>
                </li>

                <li className="mr-3">
                  <button onClick={signOut} className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4">
                    Signout
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  )
}
