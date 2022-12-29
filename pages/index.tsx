import type { NextPage } from 'next'
import { OAuthProvider, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth'
import { useAuth } from '../lib/authContext'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { userConverter } from '../lib/types/User'
import { db } from '../lib/firebaseConfig/init'
import Button from '../components/button/Button'

const Home: NextPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  if (loading) return null // todo: add spinner

  if (user) {
    router.push('/home')
    return null
  }

  const auth = getAuth()

  const loginWithOutlook = async () => {
    const outlookProvider = new OAuthProvider('microsoft.com')
    outlookProvider.setCustomParameters({
      tenant: 'binusianorg.onmicrosoft.com'
    })

    // outlookProvider.addScope('mail.read')
    // outlookProvider.addScope('calendars.read') // todo: calendar need admin approval
    outlookProvider.addScope('openid')
    outlookProvider.addScope('profile')
    await signInWithRedirect(auth, outlookProvider)
    const result = await getRedirectResult(auth)
    if (result) {
      const credential = OAuthProvider.credentialFromResult(result)
      const user = result.user
      const userRef = doc(db, 'user', user.uid)
      getDoc(userRef.withConverter(userConverter)).then((res) => {
        if (!res.exists()) {
          // Kalo gak di cek dulu (getDoc dulu), sebenernya aman2 aja di db, tapi pas difetch pertama kali abis login, adminOf suka undefined (mungkin karna caching)
          setDoc(userRef, { name: user.displayName, email: user.email, lineID: null, phoneNumber: null, instagram: null }, { merge: true }).then(() => router.push('/home'))
        }
      })
    }
  }

  return (
    <>
      <div className="bg-gradient-to-tl from-sky-400 to-sky-200 flex flex-grow flex-col w-full lg:px-40 px-16 justify-center">
        <div className="flex md:flex-row flex-col-reverse w-full justify-between">
          <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-left">
            <p className="uppercase tracking-loose w-full">Welcome to</p>
            <h1 className="my-4 text-5xl font-extrabold leading-tight font-secondary">BeeCara</h1>
            <p className="leading-normal text-2xl mb-8">An application for Binusian to seek and join events to get SAT points and Community Service Hour!</p>
            <Button onClick={loginWithOutlook} color={'white'} className="py-4">
              <Image src={'/assets/icon_microsoft.svg'} width={24} height={24} alt={'Microsoft'} />
              <span className="ml-2">Sign in with Microsoft</span>
            </Button>
          </div>
          <Image src={'/assets/home_vector.svg'} width={500} height={500} alt={'Illustration'} />
        </div>
      </div>
    </>
  )
}

export default Home
