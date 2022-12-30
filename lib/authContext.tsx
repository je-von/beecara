import { createContext, useContext, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signOut as signout } from 'firebase/auth'
import { destroyCookie, setCookie } from 'nookies'
import { doc } from 'firebase/firestore'
import { db } from './firebaseConfig/init'
import { User, userConverter } from './types/User'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Router from 'next/router'

// export type TIdTokenResult = {
//   token: string
//   expirationTime: string
//   authTime: string
//   issuedAtTime: string
//   signInProvider: string | null
//   signInSecondFactor: string | null
//   claims: {
//     [key: string]: any
//   }
// }

type Props = {
  children: React.ReactNode
}

type UserContext = {
  // user: TIdTokenResult | null
  user?: User
  loading: boolean
}

const authContext = createContext<UserContext>({
  user: undefined,
  loading: true
})

export default function AuthContextProvider({ children }: Props) {
  // const [user, setUser] = useState<User | null>(null)
  const [userId, setUserId] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const userRef = doc(db, 'user', `${userId}`).withConverter(userConverter)
  const [user, loadingSnapshot] = useDocumentData(userRef)

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      //user returned from firebase not the state
      if (user) {
        // Save token for backend calls
        user.getIdToken(true).then((token) =>
          setCookie(null, 'idToken', token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
          })
        )

        // Save decoded token on the state
        user.getIdTokenResult(true).then((result) => {
          setUserId(result.claims.user_id)
        })
      }
      if (!user) setUserId(undefined)
      setLoading(loadingSnapshot)
    })
  }, [loadingSnapshot])

  return <authContext.Provider value={{ user, loading }}>{children}</authContext.Provider>
}

export const useAuth = () => useContext(authContext)

export const signOut = async () => {
  const auth = getAuth()
  destroyCookie(null, 'idToken')
  await signout(auth)
  Router.push('/')
}
