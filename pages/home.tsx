import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/authContext'
import EventList from '../components/event/events'
import Head from 'next/head'
const Home: NextPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (!loading && !user) {
    router.push('/')
    return null
  }

  return (
    <div className="lg:px-40 md:px-16 px-8">
      <Head>
        <title>Events | BeeCara</title>
      </Head>
      {/* <h1>
        Welcome, <b>{user?.claims.name}</b> ({user?.claims.email}) !
      </h1> */}
      {/* <h1 className="text-3xl font-bold">BeeCara</h1>
      <p>An application for Binusian to seek and join events to get SAT points and Comserv Hour!</p> */}

      <EventList />
    </div>
  )
}

export default Home
