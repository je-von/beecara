import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/authContext'
import Card from '../components/event/card'
import { collection } from 'firebase/firestore'
import { db } from '../lib/firebaseConfig/init'
import { eventConverter } from '../lib/types/Event'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import EventList from '../components/event/events'
const Home: NextPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) return <h1>Loading...</h1>

  if (!user) {
    router.push('/')
    return null
  }

  return (
    <div className=" px-40 ">
      {/* <h1>
        Welcome, <b>{user?.claims.name}</b> ({user?.claims.email}) !
      </h1> */}
      <h1 className="text-3xl font-bold">BeeCara</h1>
      <p>An application for Binusian to seek and join events to get SAT points and Comserv Hour!</p>

      <EventList />
    </div>
  )
}

export default Home
