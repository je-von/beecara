import type { NextPage } from 'next'
import Head from 'next/head'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, OAuthProvider } from 'firebase/auth'
import { useState } from 'react'
import { useAuth } from '../lib/authContext'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { user, loading } = useAuth()
  const router = useRouter()
  if (loading) return null // todo: add spinner

  if (user) {
    router.push('/home')
    return null
  }

  const auth = getAuth()

  // function login() {
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user
  //       console.log('success', user)
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code
  //       const errorMessage = error.message
  //       console.log('error', errorMessage)
  //       window.alert(errorMessage)
  //     })
  // }

  function loginWithOutlook() {
    const outlookProvider = new OAuthProvider('microsoft.com')
    outlookProvider.setCustomParameters({
      tenant: 'binusianorg.onmicrosoft.com',
    })

    // outlookProvider.addScope('mail.read')
    // outlookProvider.addScope('calendars.read') // todo: calendar need admin approval
    outlookProvider.addScope('openid')
    outlookProvider.addScope('profile')
    signInWithPopup(auth, outlookProvider)
      .then((result) => {
        // User is signed in.
        // IdP data available in result.additionalUserInfo.profile.

        // Get the OAuth access token and ID Token
        const credential = OAuthProvider.credentialFromResult(result)
        const accessToken = credential?.accessToken
        const idToken = credential?.idToken

        console.log(credential?.toJSON())
        console.log(credential)
      })
      .catch((error) => {
        // Handle error.
        console.log(error.message)
      })
  }

  return (
    <>
      <div className="bg-gradient-to-tl from-sky-400 to-sky-200 flex flex-grow flex-col w-full px-40 ">
        <div className="pt-24">
          <div className='flex flex-row w-full'>
          <div className="px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
            <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
              <p className="uppercase tracking-loose w-full">Welcome to</p>
              <h1 className="my-4 text-5xl font-bold leading-tight">BeeCara</h1>
              <p className="leading-normal text-2xl mb-8">An application for Binusian to seek and join events to get SAT points and Comserv Hour!</p>
              <button
                onClick={loginWithOutlook}
                className="flex items-center justify-center mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                <Image src={'/assets/icon_microsoft.svg'} width={24} height={24} alt={'Microsoft'} />
                <span className="ml-2">Sign in with Microsoft</span>
              </button>
            </div>
          </div>
          <Image src={'/assets/home_vector.png'} width={430} height={10} alt={'Illustration'} />

          </div>
        </div>
      </div>
    </>
  )
}

export default Home
