import { signOut, useAuth } from '../../lib/authContext'
import Image from 'next/image'


export default function Header(props: any) {
  const { user, loading } = useAuth()

  return (
    <div className="flex h-full flex-row px-40">
      <div className="w-full mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        <div className="pl-4 flex items-center">
          <a className="hover:no-underline font-bold text-2xl lg:text-4xl" href="#">
            <div className="h-100">
              <Image src={'/assets/logo_binus.png'} alt="logo" width={81.25} height={50} layout={'fixed'} />
            </div>
          </a>
        </div>

        <div className="flex-grow flex items-center w-auto  bg-white bg-transparent text-black z-20">
          <ul className="list-reset flex justify-end flex-1 items-center">
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
