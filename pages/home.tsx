import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/authContext'
import Card from '../components/card'

const Home: NextPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) return <h1>Loading...</h1>

  if (!user) {
    router.push('/')
    return null
  }

  return (
    <div className="flex w-full px-40 ">
      <h1>
        Welcome, <b>{user?.claims.name}</b> ({user?.claims.email}) !
      </h1>
    </div>
  )
}

export default Home
